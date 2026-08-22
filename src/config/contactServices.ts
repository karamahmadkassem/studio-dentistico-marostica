export const CONTACT_SERVICE_KEYS = [
  'sbiancamento-dentale',
  'conservativa',
  'endodonzia',
  'chirurgia-orale',
  'pedodonzia',
  'igiene-orale',
  'implantologia',
  'protesi',
  'prevenzione',
  'ortodonzia',
  'estetica-dentale',
] as const;

export type ContactServiceKey = (typeof CONTACT_SERVICE_KEYS)[number];
