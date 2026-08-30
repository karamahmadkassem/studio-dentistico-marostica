export const CLINIC = {
  name: 'Studio Dentistico Marostica',
  website: 'https://www.studiodentisticomarostica.com',
  facebook: 'https://www.facebook.com/profile.php?id=61556290275439',
  instagram: 'https://www.instagram.com/studiodentisticomarostica',
  email: 'info@studiodentisticomarostica.it',
  phone: '0424 73061',
  mobile: '351 8228984',
  address: 'Via XXIV Maggio 39, Marostica (VI)',
};

export function getSiteUrl(): string {
  return Deno.env.get('SITE_URL')?.replace(/\/$/, '') ?? CLINIC.website;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatAppointmentDate(date: string, locale: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function emailButton(href: string, label: string): string {
  const safeHref = href.replace(/"/g, '&quot;');
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td style="border-radius:6px;background-color:#00c2ff;">
          <a href="${safeHref}" style="display:inline-block;padding:12px 28px;color:#030d1d;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;text-decoration:none;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

interface WrapEmailOptions {
  locale?: string;
  bodyHtml: string;
}

export function wrapEmailHtml({ locale = 'it', bodyHtml }: WrapEmailOptions): string {
  const isIt = locale === 'it';
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/images/brand/logo.png`;
  const websiteLabel = isIt ? 'Visita il nostro sito' : 'Visit our website';
  const followLabel = isIt ? 'Seguici sui social' : 'Follow us';
  const contactLabel = isIt ? 'Contatti' : 'Contact';

  return `<!DOCTYPE html>
<html lang="${isIt ? 'it' : 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(CLINIC.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef3f8;font-family:Arial,Helvetica,sans-serif;color:#1a2b3c;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef3f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #dbe4ee;">
          <tr>
            <td align="center" style="padding:32px 32px 24px;background-color:#030d1d;">
              <a href="${CLINIC.website}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="${escapeHtml(CLINIC.name)}" width="200" style="display:block;max-width:200px;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-size:16px;line-height:1.65;color:#334155;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;background-color:#030d1d;text-align:center;">
              <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#ffffff;">
                ${escapeHtml(CLINIC.name)}
              </p>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#cbd5e1;">
                ${escapeHtml(CLINIC.address)}
              </p>
              <p style="margin:0 0 20px;">
                <a href="${CLINIC.website}" style="color:#00c2ff;font-size:14px;font-weight:600;text-decoration:none;">${websiteLabel}</a>
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;">${followLabel}</p>
              <p style="margin:0 0 20px;">
                <a href="${CLINIC.facebook}" style="color:#00c2ff;font-size:14px;text-decoration:none;margin:0 10px;">Facebook</a>
                <span style="color:#475569;">|</span>
                <a href="${CLINIC.instagram}" style="color:#00c2ff;font-size:14px;text-decoration:none;margin:0 10px;">Instagram</a>
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                ${contactLabel}: ${escapeHtml(CLINIC.email)} · ${escapeHtml(CLINIC.phone)} · ${escapeHtml(CLINIC.mobile)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
