export const CONTACT_SERVICE_KEYS = [
  'general',
  'implants',
  'aesthetics',
  'prosthetics',
  'periodontics',
  'pediatric',
  'surgery',
] as const;

export type ContactServiceKey = (typeof CONTACT_SERVICE_KEYS)[number];
