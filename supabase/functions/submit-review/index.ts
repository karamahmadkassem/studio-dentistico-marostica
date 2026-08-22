import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return errorResponse('Token required', 400);

    const supabase = getServiceClient();
    const { data: invite } = await supabase
      .from('review_invitations')
      .select('*, appointments(*)')
      .eq('token', token)
      .maybeSingle();

    if (!invite) return errorResponse('Invalid or expired link', 404);
    if (invite.completed_at) return errorResponse('Review already submitted', 409);
    if (new Date(invite.expires_at) < new Date()) return errorResponse('Link expired', 410);

    const body = await req.json();
    const { name, email, rating, treatmentType, reviewText } = body;
    if (!name || !rating || !reviewText) return errorResponse('Missing required fields', 400);

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        appointment_id: invite.appointment_id,
        name,
        email: email || null,
        rating,
        treatment_type: treatmentType || '',
        body: reviewText,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('review_invitations')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', invite.id);

    return jsonResponse({ ok: true, reviewId: review.id });
  } catch (e) {
    console.error(e);
    return errorResponse('Submit failed', 500);
  }
});
