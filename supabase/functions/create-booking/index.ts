import { handleOptions, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { sendEmail, bookingPendingEmail } from '../_shared/brevo.ts';

function normalizeTime(time: string): string {
  const parts = time.split(':');
  const h = parts[0]?.padStart(2, '0') ?? '00';
  const m = (parts[1] ?? '00').padStart(2, '0');
  return `${h}:${m}:00`;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      serviceId,
      appointmentDate,
      appointmentTime,
      message,
      locale = 'it',
    } = body;

    if (!firstName || !lastName || !phone || !email || !appointmentDate || !appointmentTime) {
      return errorResponse('Missing required fields', 400);
    }

    const supabase = getServiceClient();
    const normalizedTime = normalizeTime(appointmentTime);

    let serviceName = '';
    if (serviceId) {
      const { data: svc } = await supabase.from('services').select('title_it, title_en').eq('id', serviceId).maybeSingle();
      if (svc) serviceName = locale === 'en' ? svc.title_en : svc.title_it;
    }

    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', normalizedTime)
      .in('status', ['pending', 'accepted', 'review_sent'])
      .maybeSingle();

    if (existing) return errorResponse('Time slot no longer available', 409);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        service_id: serviceId || null,
        service_name: serviceName,
        appointment_date: appointmentDate,
        appointment_time: normalizedTime,
        message: message || null,
        status: 'pending',
        locale,
      })
      .select()
      .single();

    if (error) throw error;

    const mail = bookingPendingEmail(locale, firstName);
    await sendEmail({ to: email, subject: mail.subject, html: mail.html, toName: `${firstName} ${lastName}` });

    const adminEmail = Deno.env.get('ADMIN_NOTIFY_EMAIL');
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `Nuova prenotazione: ${firstName} ${lastName}`,
        html: `<p>Nuova richiesta per ${appointmentDate} alle ${appointmentTime}.</p><p>Telefono: ${phone}</p><p>Email: ${email}</p>`,
      });
    }

    return jsonResponse({ ok: true, appointmentId: appointment.id, status: 'pending' });
  } catch (e) {
    console.error(e);
    return errorResponse('Booking failed', 500);
  }
});
