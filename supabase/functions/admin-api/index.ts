import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { verifySession } from '../_shared/auth.ts';
import { sendEmail, reviewInviteEmail, blogNewsletterEmail, appointmentCancellationEmail } from '../_shared/brevo.ts';

async function requireAdmin(req: Request) {
  const adminId = await verifySession(req.headers.get('Authorization'));
  if (!adminId) return null;
  return adminId;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const adminId = await requireAdmin(req);
  if (!adminId) return errorResponse('Unauthorized', 401);

  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const fnIdx = parts.indexOf('admin-api');
  const path = fnIdx >= 0 ? parts.slice(fnIdx + 1).join('/') : parts.join('/');
  const supabase = getServiceClient();

  try {
    // --- Appointments ---
    if (path === 'appointments' && req.method === 'GET') {
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');
      let q = supabase.from('appointments').select('*').order('appointment_date').order('appointment_time');
      if (from) q = q.gte('appointment_date', from);
      if (to) q = q.lte('appointment_date', to);
      const { data, error } = await q;
      if (error) throw error;
      return jsonResponse(data);
    }

    if (path.startsWith('appointments/') && req.method === 'PATCH') {
      const id = path.split('/')[1];
      const body = await req.json();
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse(data);
    }

    if (path.match(/^appointments\/[^/]+\/cancel$/) && req.method === 'POST') {
      const id = path.split('/')[1];
      const body = await req.json().catch(() => ({}));
      const reason = typeof body.reason === 'string' ? body.reason.trim() : '';

      const { data: appt } = await supabase.from('appointments').select('*').eq('id', id).single();
      if (!appt) return errorResponse('Not found', 404);
      if (appt.status !== 'pending' && appt.status !== 'accepted') {
        return errorResponse('Only pending or accepted appointments can be cancelled', 400);
      }

      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          cancellation_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      const mail = appointmentCancellationEmail(
        appt.locale ?? 'it',
        appt.first_name,
        appt.appointment_date,
        String(appt.appointment_time),
        reason || null,
      );
      try {
        await sendEmail({
          to: appt.email,
          subject: mail.subject,
          html: mail.html,
          toName: `${appt.first_name} ${appt.last_name}`,
        });
      } catch (emailError) {
        console.error('Cancellation email failed:', emailError);
      }

      return jsonResponse(data);
    }

    if (path.match(/^appointments\/[^/]+\/send-review$/) && req.method === 'POST') {
      const id = path.split('/')[1];
      const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';
      const { data: appt } = await supabase.from('appointments').select('*').eq('id', id).single();
      if (!appt) return errorResponse('Not found', 404);
      if (appt.status !== 'accepted') return errorResponse('Appointment must be accepted first', 400);

      const { data: invite } = await supabase
        .from('review_invitations')
        .insert({ appointment_id: id })
        .select()
        .single();

      const reviewUrl = `${siteUrl}/reviews/submit?token=${invite.token}`;
      const mail = reviewInviteEmail(appt.locale ?? 'it', appt.first_name, reviewUrl);
      await sendEmail({ to: appt.email, subject: mail.subject, html: mail.html, toName: `${appt.first_name} ${appt.last_name}` });

      await supabase.from('appointments').update({ status: 'review_sent', updated_at: new Date().toISOString() }).eq('id', id);
      return jsonResponse({ ok: true, reviewUrl });
    }

    // --- Opening hours ---
    if (path === 'opening-hours') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('opening_hours').select('*').order('day_of_week');
        return jsonResponse(data);
      }
      if (req.method === 'PUT') {
        const hours = await req.json();
        for (const h of hours) {
          const openFallback = '09:00:00';
          const closeFallback = h.day_of_week === 6 ? '13:00:00' : '19:00:00';
          const normalize = (time: string | null | undefined, fallback: string) => {
            if (!time) return fallback;
            const parts = String(time).split(':');
            const hh = parts[0]?.padStart(2, '0') ?? '09';
            const mm = (parts[1] ?? '00').padStart(2, '0');
            return `${hh}:${mm}:00`;
          };
          await supabase.from('opening_hours').upsert({
            day_of_week: h.day_of_week,
            is_closed: h.is_closed,
            open_time: h.is_closed ? null : normalize(h.open_time, openFallback),
            close_time: h.is_closed ? null : normalize(h.close_time, closeFallback),
            updated_at: new Date().toISOString(),
          });
        }
        const { data } = await supabase.from('opening_hours').select('*').order('day_of_week');
        return jsonResponse(data);
      }
    }

    // --- Services ---
    if (path === 'services') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('services').select('*').order('sort_order');
        return jsonResponse(data);
      }
      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('services').insert(body).select().single();
        if (error) throw error;
        return jsonResponse(data, 201);
      }
    }

    if (path.startsWith('services/')) {
      const id = path.split('/')[1];
      if (id === 'reorder' && req.method === 'POST') {
        const { order } = await req.json();
        for (let i = 0; i < order.length; i++) {
          await supabase.from('services').update({ sort_order: i }).eq('id', order[i]);
        }
        return jsonResponse({ ok: true });
      }
      if (req.method === 'PATCH') {
        const body = await req.json();
        const { data, error } = await supabase.from('services').update({ ...body, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return jsonResponse(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('services').delete().eq('id', id);
        return jsonResponse({ ok: true });
      }
    }

    // --- About ---
    if (path === 'about') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('about_sections').select('*');
        return jsonResponse(data);
      }
      if (req.method === 'PUT') {
        const { section_key, content } = await req.json();
        const { data, error } = await supabase
          .from('about_sections')
          .upsert({ section_key, content, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return jsonResponse(data);
      }
    }

    // --- Blog categories ---
    if (path === 'blog/categories') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('blog_categories').select('*').order('sort_order');
        return jsonResponse(data);
      }
      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('blog_categories').insert(body).select().single();
        if (error) throw error;
        return jsonResponse(data, 201);
      }
    }

    if (path.startsWith('blog/categories/') && req.method === 'DELETE') {
      const id = path.split('/')[2];
      await supabase.from('blog_categories').delete().eq('id', id);
      return jsonResponse({ ok: true });
    }

    // --- Blog posts ---
    if (path === 'blog/posts') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('blog_posts').select('*, blog_categories(name_it, name_en)').order('created_at', { ascending: false });
        return jsonResponse(data);
      }
      if (req.method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase.from('blog_posts').insert(body).select().single();
        if (error) throw error;
        return jsonResponse(data, 201);
      }
    }

    if (path.startsWith('blog/posts/')) {
      const parts = path.split('/');
      const id = parts[2];
      if (parts[3] === 'publish' && req.method === 'POST') {
        const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';
        const { data: post, error } = await supabase
          .from('blog_posts')
          .update({ published: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        const { data: subs } = await supabase.from('newsletter_subscribers').select('email').eq('active', true);
        const title = post.title_it;
        const excerpt = post.excerpt_it;
        const postUrl = `${siteUrl}/blog/${post.slug}`;
        const mail = blogNewsletterEmail(title, excerpt, postUrl);
        for (const s of subs ?? []) {
          try {
            await sendEmail({ to: s.email, subject: mail.subject, html: mail.html });
          } catch (e) {
            console.error('Newsletter send failed for', s.email, e);
          }
        }
        return jsonResponse({ ok: true, post, emailsSent: subs?.length ?? 0 });
      }
      if (req.method === 'PATCH') {
        const body = await req.json();
        const { data, error } = await supabase.from('blog_posts').update({ ...body, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) throw error;
        return jsonResponse(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('blog_posts').delete().eq('id', id);
        return jsonResponse({ ok: true });
      }
    }

    // --- Newsletter stats ---
    if (path === 'newsletter' && req.method === 'GET') {
      const { count } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('active', true);
      const { data: recent } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(20);
      return jsonResponse({ count: count ?? 0, recent });
    }

    // --- Reviews admin ---
    if (path === 'reviews' && req.method === 'GET') {
      const status = url.searchParams.get('status');
      let q = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (status) q = q.eq('status', status);
      const { data } = await q;
      return jsonResponse(data);
    }

    if (path.startsWith('reviews/') && req.method === 'PATCH') {
      const id = path.split('/')[1];
      const body = await req.json();
      const { data, error } = await supabase.from('reviews').update({ ...body, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return jsonResponse(data);
    }

    return errorResponse('Not found', 404);
  } catch (e) {
    console.error(e);
    return errorResponse('Server error', 500);
  }
});
