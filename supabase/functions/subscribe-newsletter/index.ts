import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse('Valid email required', 400);
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.toLowerCase(), active: true, subscribed_at: new Date().toISOString() }, { onConflict: 'email' });

    if (error) throw error;
    return jsonResponse({ ok: true });
  } catch (e) {
    console.error(e);
    return errorResponse('Subscription failed', 500);
  }
});
