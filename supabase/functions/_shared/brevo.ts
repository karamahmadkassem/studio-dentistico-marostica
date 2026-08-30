import {
  CLINIC,
  emailButton,
  escapeHtml,
  formatAppointmentDate,
  getSiteUrl,
  wrapEmailHtml,
} from './emailTemplate.ts';

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  toName?: string;
}

export async function sendEmail({ to, subject, html, toName }: SendEmailParams) {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  const fromEmail = Deno.env.get('BREVO_FROM_EMAIL') ?? CLINIC.email;
  const fromName = Deno.env.get('BREVO_FROM_NAME') ?? CLINIC.name;

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

export function bookingPendingEmail(locale: string, firstName: string) {
  const isIt = locale === 'it';
  const safeName = escapeHtml(firstName);
  const body = isIt
    ? `<p style="margin:0 0 16px;">Gentile ${safeName},</p>
       <p style="margin:0 0 16px;">grazie di cuore per aver scelto ${escapeHtml(CLINIC.name)}.</p>
       <p style="margin:0 0 16px;">Abbiamo ricevuto la sua richiesta di appuntamento. Il nostro team la esaminerà con attenzione e la contatterà al più presto per confermare data e ora.</p>
       <p style="margin:0 0 16px;">Se desidera aggiungere qualche informazione o ha bisogno di assistenza, può rispondere a questa email o chiamarci: siamo felici di aiutarla.</p>
       <p style="margin:0;">Con cordialità,<br/>Il team di ${escapeHtml(CLINIC.name)}</p>`
    : `<p style="margin:0 0 16px;">Dear ${safeName},</p>
       <p style="margin:0 0 16px;">Thank you for choosing ${escapeHtml(CLINIC.name)}.</p>
       <p style="margin:0 0 16px;">We have received your appointment request. Our team will review it carefully and contact you shortly to confirm the date and time.</p>
       <p style="margin:0 0 16px;">If you would like to share any extra details or need help, simply reply to this email or call us — we are happy to assist you.</p>
       <p style="margin:0;">Kind regards,<br/>The ${escapeHtml(CLINIC.name)} team</p>`;

  return {
    subject: isIt
      ? 'Richiesta di appuntamento ricevuta — Studio Dentistico Marostica'
      : 'Appointment request received — Studio Dentistico Marostica',
    html: wrapEmailHtml({ locale, bodyHtml: body }),
  };
}

export function reviewInviteEmail(locale: string, firstName: string, reviewUrl: string) {
  const isIt = locale === 'it';
  const safeName = escapeHtml(firstName);
  const body = isIt
    ? `<p style="margin:0 0 16px;">Gentile ${safeName},</p>
       <p style="margin:0 0 16px;">speriamo che la sua visita da noi sia stata piacevole e che si sia sentita/a accudita/a.</p>
       <p style="margin:0 0 16px;">La sua opinione è molto importante per noi. Se lo desidera, può lasciare una breve recensione: ci aiuta a migliorare e a offrire sempre il meglio ai nostri pazienti.</p>
       ${emailButton(reviewUrl, 'Lascia una recensione')}
       <p style="margin:0;">La ringraziamo di cuore per la fiducia.<br/>Il team di ${escapeHtml(CLINIC.name)}</p>`
    : `<p style="margin:0 0 16px;">Dear ${safeName},</p>
       <p style="margin:0 0 16px;">We hope your visit with us was pleasant and that you felt well cared for.</p>
       <p style="margin:0 0 16px;">Your feedback means a lot to us. If you wish, you can leave a short review — it helps us improve and continue offering the best care to our patients.</p>
       ${emailButton(reviewUrl, 'Leave a review')}
       <p style="margin:0;">Thank you sincerely for your trust.<br/>The ${escapeHtml(CLINIC.name)} team</p>`;

  return {
    subject: isIt
      ? 'Com\'è andata la sua visita? — Studio Dentistico Marostica'
      : 'How was your visit? — Studio Dentistico Marostica',
    html: wrapEmailHtml({ locale, bodyHtml: body }),
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
  const safeName = escapeHtml(firstName);
  const time = String(appointmentTime).slice(0, 5);
  const formattedDate = escapeHtml(formatAppointmentDate(appointmentDate, locale));
  const trimmedReason = reason?.trim();
  const reasonBlock = trimmedReason
    ? isIt
      ? `<p style="margin:0 0 16px;"><strong>Motivo:</strong> ${escapeHtml(trimmedReason)}</p>`
      : `<p style="margin:0 0 16px;"><strong>Reason:</strong> ${escapeHtml(trimmedReason)}</p>`
    : '';
  const siteUrl = getSiteUrl();

  const body = isIt
    ? `<p style="margin:0 0 16px;">Gentile ${safeName},</p>
       <p style="margin:0 0 16px;">ci dispiace informarla che il suo appuntamento previsto per <strong>${formattedDate}</strong> alle ore <strong>${time}</strong> è stato annullato.</p>
       ${reasonBlock}
       <p style="margin:0 0 16px;">Ci scusiamo sinceramente per il disagio. Per fissare una nuova visita può contattarci telefonicamente o prenotare online sul nostro sito.</p>
       ${emailButton(`${siteUrl}/contact`, 'Prenota una nuova visita')}
       <p style="margin:0;">Restiamo a sua completa disposizione.<br/>Con cordialità,<br/>Il team di ${escapeHtml(CLINIC.name)}</p>`
    : `<p style="margin:0 0 16px;">Dear ${safeName},</p>
       <p style="margin:0 0 16px;">We are sorry to let you know that your appointment scheduled for <strong>${formattedDate}</strong> at <strong>${time}</strong> has been cancelled.</p>
       ${reasonBlock}
       <p style="margin:0 0 16px;">We sincerely apologise for any inconvenience. To book a new visit, please call us or use the booking form on our website.</p>
       ${emailButton(`${siteUrl}/contact`, 'Book a new visit')}
       <p style="margin:0;">We remain at your disposal.<br/>Kind regards,<br/>The ${escapeHtml(CLINIC.name)} team</p>`;

  return {
    subject: isIt
      ? 'Appuntamento annullato — Studio Dentistico Marostica'
      : 'Appointment cancelled — Studio Dentistico Marostica',
    html: wrapEmailHtml({ locale, bodyHtml: body }),
  };
}

export function blogNewsletterEmail(title: string, excerpt: string, postUrl: string) {
  const safeTitle = escapeHtml(title);
  const safeExcerpt = escapeHtml(excerpt);
  const body = `<p style="margin:0 0 16px;">Ciao,</p>
    <p style="margin:0 0 16px;">abbiamo pubblicato un nuovo articolo sul nostro blog che pensiamo possa interessarti.</p>
    <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#030d1d;">${safeTitle}</p>
    <p style="margin:0 0 16px;">${safeExcerpt}</p>
    ${emailButton(postUrl, 'Leggi l\'articolo')}
    <p style="margin:0;">Grazie per restare in contatto con noi.<br/>Il team di ${escapeHtml(CLINIC.name)}</p>`;

  return {
    subject: `Nuovo articolo: ${title}`,
    html: wrapEmailHtml({ locale: 'it', bodyHtml: body }),
  };
}

export function adminNewBookingEmail(params: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceName?: string;
}) {
  const {
    firstName,
    lastName,
    phone,
    email,
    appointmentDate,
    appointmentTime,
    serviceName,
  } = params;
  const formattedDate = escapeHtml(formatAppointmentDate(appointmentDate, 'it'));
  const time = String(appointmentTime).slice(0, 5);
  const serviceLine = serviceName
    ? `<p style="margin:0 0 8px;"><strong>Servizio:</strong> ${escapeHtml(serviceName)}</p>`
    : '';

  const body = `<p style="margin:0 0 16px;">Nuova richiesta di appuntamento ricevuta dal sito.</p>
    <p style="margin:0 0 8px;"><strong>Paziente:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p style="margin:0 0 8px;"><strong>Data:</strong> ${formattedDate} alle ${time}</p>
    ${serviceLine}
    <p style="margin:0 0 8px;"><strong>Telefono:</strong> ${escapeHtml(phone)}</p>
    <p style="margin:0 0 16px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin:0;">Accedi al pannello admin per confermare o gestire la prenotazione.</p>`;

  return {
    subject: `Nuova prenotazione: ${firstName} ${lastName}`,
    html: wrapEmailHtml({ locale: 'it', bodyHtml: body }),
  };
}
