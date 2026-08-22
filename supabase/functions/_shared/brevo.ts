const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  toName?: string;
}

export async function sendEmail({ to, subject, html, toName }: SendEmailParams) {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  const fromEmail = Deno.env.get('BREVO_FROM_EMAIL') ?? 'info@studiodentisticomarostica.it';
  const fromName = Deno.env.get('BREVO_FROM_NAME') ?? 'Studio Dentistico Marostica';

  if (!apiKey) {
    console.warn('BREVO_API_KEY not set — email skipped:', subject, to);
    return { skipped: true };
  }

  const res = await fetch(BREVO_API, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to, name: toName ?? to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error: ${res.status} ${text}`);
  }
  return res.json();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function bookingPendingEmail(locale: string, firstName: string) {
  const isIt = locale === 'it';
  return {
    subject: isIt
      ? 'Richiesta di prenotazione ricevuta — Studio Dentistico Marostica'
      : 'Booking request received — Studio Dentistico Marostica',
    html: isIt
      ? `<p>Gentile ${firstName},</p><p>abbiamo ricevuto la sua richiesta di prenotazione. Il nostro team la esaminerà e la contatterà al più presto per confermare data e ora.</p><p>Grazie per aver scelto Studio Dentistico Marostica.</p>`
      : `<p>Dear ${firstName},</p><p>We have received your booking request. Our team will review it and contact you shortly to confirm your appointment.</p><p>Thank you for choosing Studio Dentistico Marostica.</p>`,
  };
}

export function reviewInviteEmail(locale: string, firstName: string, reviewUrl: string) {
  const isIt = locale === 'it';
  return {
    subject: isIt ? 'La voce dei nostri pazienti — lascia una recensione' : 'Our patients\' voice — share your review',
    html: isIt
      ? `<p>Gentile ${firstName},</p><p>grazie per la sua visita. Ci farebbe piacere conoscere la sua esperienza:</p><p><a href="${reviewUrl}">Lascia una recensione</a></p>`
      : `<p>Dear ${firstName},</p><p>Thank you for your visit. We would love to hear about your experience:</p><p><a href="${reviewUrl}">Leave a review</a></p>`,
  };
}

export function appointmentCancellationEmail(
  locale: string,
  firstName: string,
  appointmentDate: string,
  appointmentTime: string,
  reason?: string | null,
) {
  const isIt = locale === 'it';
  const time = String(appointmentTime).slice(0, 5);
  const trimmedReason = reason?.trim();
  const reasonBlock = trimmedReason
    ? isIt
      ? `<p><strong>Motivo:</strong> ${escapeHtml(trimmedReason)}</p>`
      : `<p><strong>Reason:</strong> ${escapeHtml(trimmedReason)}</p>`
    : '';

  return {
    subject: isIt
      ? 'Appuntamento annullato — Studio Dentistico Marostica'
      : 'Appointment cancelled — Studio Dentistico Marostica',
    html: isIt
      ? `<p>Gentile ${firstName},</p><p>ci scusiamo sinceramente, ma dobbiamo informarla che il suo appuntamento del <strong>${appointmentDate}</strong> alle ore <strong>${time}</strong> è stato annullato.</p>${reasonBlock}<p>Per prenotare una nuova visita può contattarci telefonicamente o utilizzare il modulo sul nostro sito.</p><p>Cordiali saluti,<br/>Studio Dentistico Marostica</p>`
      : `<p>Dear ${firstName},</p><p>We sincerely apologise, but we must inform you that your appointment on <strong>${appointmentDate}</strong> at <strong>${time}</strong> has been cancelled.</p>${reasonBlock}<p>To book a new visit, please call us or use the booking form on our website.</p><p>Kind regards,<br/>Studio Dentistico Marostica</p>`,
  };
}

export function blogNewsletterEmail(title: string, excerpt: string, postUrl: string) {
  return {
    subject: `Nuovo articolo: ${title}`,
    html: `<p>${excerpt}</p><p><a href="${postUrl}">Leggi l'articolo</a></p>`,
  };
}
