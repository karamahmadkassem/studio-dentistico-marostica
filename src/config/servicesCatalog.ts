export const SERVICE_CATALOG_KEYS = [
  'general-dentistry',
  'dental-hygiene',
  'gum-treatment',
  'endodonzia',
  'implants',
  'protesi',
  'cosmetic-dentistry',
  'oral-surgery',
  'snoring-sleep-apnea',
] as const;

export type ServiceCatalogKey = (typeof SERVICE_CATALOG_KEYS)[number];

/** Lucide icon keys aligned to each service category. */
export const SERVICE_ICON_BY_SLUG: Record<ServiceCatalogKey, string> = {
  'general-dentistry': 'clipboard-check',
  'dental-hygiene': 'droplets',
  'gum-treatment': 'heart-pulse',
  endodonzia: 'activity',
  implants: 'bone',
  protesi: 'layers',
  'cosmetic-dentistry': 'gem',
  'oral-surgery': 'scissors',
  'snoring-sleep-apnea': 'bed-double',
};

/** Homepage flip-card background images (local assets). */
export const SERVICE_IMAGE_BY_SLUG: Record<ServiceCatalogKey, string> = {
  'general-dentistry': '/images/services/general-dentistry.jpg',
  'dental-hygiene': '/images/services/dental-hygiene.jpg',
  'gum-treatment': '/images/services/gum-treatment.jpg',
  endodonzia: '/images/services/endodonzia.jpg',
  implants: '/images/services/implants.jpg',
  protesi: '/images/services/protesi.jpg',
  'cosmetic-dentistry': '/images/services/cosmetic-dentistry.jpg',
  'oral-surgery': '/images/services/oral-surgery.jpg',
  'snoring-sleep-apnea': '/images/services/snoring-sleep-apnea.jpg',
};

export interface DisplayService {
  id: string;
  slug: string;
  iconKey: string;
  imageUrl: string;
  title: string;
  description: string;
  details: string[];
}
