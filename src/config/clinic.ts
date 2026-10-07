export const SITE_URL = 'https://www.studiodentisticomarostica.com';

export const CLINIC = {
  name: 'Studio Dentistico Marostica',
  legalName: 'Studio Dentistico Marostica',
  doctorName: 'Dr. Mourtada',
  doctorJobTitle: 'Odontoiatra',
  email: 'info@studiodentisticomarostica.it',
  telephone: ['+393518228984', '+39042473061'],
  telephoneDisplay: ['+39 351 8228984', '+39 0424 73061'],
  streetAddress: 'Via XXIV Maggio 39',
  postalCode: '36063',
  addressLocality: 'Marostica',
  addressRegion: 'VI',
  addressCountry: 'IT',
  addressLine: 'Via XXIV Maggio 39, 36063 Marostica (VI)',
  geo: {
    latitude: 45.74611,
    longitude: 11.65556,
  },
  mapQuery: 'Studio Dentistico Marostica, Via XXIV Maggio 39, 36063 Marostica VI',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Studio%20Dentistico%20Marostica%2C%20Via%20XXIV%20Maggio%2039%2C%2036063%20Marostica%20(VI)&z=16&output=embed',
  mapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=Studio%20Dentistico%20Marostica%20Via%20XXIV%20Maggio%2039%2036063%20Marostica',
  googleReviewUrl:
    'https://www.google.com/maps/search/?api=1&query=Studio%20Dentistico%20Marostica%20Via%20XXIV%20Maggio%2039%2036063%20Marostica',
  sameAs: [
    'https://www.facebook.com/profile.php?id=61556290275439',
    'https://www.instagram.com/studiodentisticomarostica',
  ],
  areaServed: [
    'Marostica',
    'Bassano del Grappa',
    'Thiene',
    'Breganze',
    'Schiavon',
    'Nove',
    'Mason Vicentino',
    'Vicenza',
  ],
  languages: ['Italian', 'English', 'French', 'Arabic'],
  openingHours: [
    { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' },
    { dayOfWeek: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],
  logo: '/images/brand/logo.png',
  image: '/images/about/about-us.jpg',
  ogImage: '/images/og-default.jpg',
  doctorImage: '/images/team/dr-moustapha-mortada.jpg',
} as const;

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;
  return `${SITE_URL}${normalized}`;
}
