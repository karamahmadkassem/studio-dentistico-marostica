import type { Language } from '../translations';
import type { ServiceCatalogKey } from '../config/servicesCatalog';
import { SERVICE_CATALOG_KEYS } from '../config/servicesCatalog';

export const SERVICE_PATH_SLUGS: Record<ServiceCatalogKey, { it: string; en: string }> = {
  'general-dentistry': { it: 'odontoiatria-generale', en: 'general-dentistry' },
  'dental-hygiene': { it: 'igiene-dentale', en: 'dental-hygiene' },
  'gum-treatment': { it: 'cura-gengive', en: 'gum-treatment' },
  endodonzia: { it: 'endodonzia', en: 'root-canal' },
  implants: { it: 'implantologia', en: 'dental-implants' },
  protesi: { it: 'protesi', en: 'dental-prosthetics' },
  'cosmetic-dentistry': { it: 'estetica-dentale', en: 'cosmetic-dentistry' },
  'oral-surgery': { it: 'chirurgia-orale', en: 'oral-surgery' },
  'snoring-sleep-apnea': { it: 'russamento-apnee', en: 'snoring-sleep-apnea' },
};

const IT_SLUG_TO_KEY = Object.fromEntries(
  SERVICE_CATALOG_KEYS.map((key) => [SERVICE_PATH_SLUGS[key].it, key]),
) as Record<string, ServiceCatalogKey>;

const EN_SLUG_TO_KEY = Object.fromEntries(
  SERVICE_CATALOG_KEYS.map((key) => [SERVICE_PATH_SLUGS[key].en, key]),
) as Record<string, ServiceCatalogKey>;

export function languageFromPath(pathname: string): Language {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'it';
}

export function isHomePath(pathname: string): boolean {
  return pathname === '/' || pathname === '/en' || pathname === '/en/';
}

export function stripLangPrefix(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/';
  if (pathname.startsWith('/en/')) {
    const rest = pathname.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname || '/';
}

export function serviceKeyFromSlug(slug: string | undefined, language: Language): ServiceCatalogKey | null {
  if (!slug) return null;
  const clean = slug.replace(/\/$/, '');
  if (SERVICE_CATALOG_KEYS.includes(clean as ServiceCatalogKey)) return clean as ServiceCatalogKey;
  const preferred = language === 'it' ? IT_SLUG_TO_KEY[clean] : EN_SLUG_TO_KEY[clean];
  return preferred ?? IT_SLUG_TO_KEY[clean] ?? EN_SLUG_TO_KEY[clean] ?? null;
}

export function serviceHref(key: ServiceCatalogKey, language: Language): string {
  const slug = SERVICE_PATH_SLUGS[key][language];
  return language === 'en' ? `/en/services/${slug}` : `/servizi/${slug}`;
}

export function servicesHubPath(language: Language): string {
  return language === 'en' ? '/en/services' : '/servizi';
}

export function localizePath(path: string, language: Language): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('/admin')) return path;

  const [rawPath, search = ''] = path.split('?');
  const query = search ? `?${search}` : '';
  const pathname = stripLangPrefix(rawPath);

  if (pathname.startsWith('/servizi/')) {
    const slug = pathname.slice('/servizi/'.length);
    const key = serviceKeyFromSlug(slug, 'it') ?? serviceKeyFromSlug(slug, 'en');
    return (key ? serviceHref(key, language) : servicesHubPath(language)) + query;
  }
  if (pathname.startsWith('/services/')) {
    const slug = pathname.slice('/services/'.length);
    const key = serviceKeyFromSlug(slug, 'en') ?? serviceKeyFromSlug(slug, 'it');
    return (key ? serviceHref(key, language) : servicesHubPath(language)) + query;
  }

  if (pathname === '/services' || pathname === '/servizi') {
    return servicesHubPath(language) + query;
  }

  if (language === 'en') {
    if (pathname === '/') return `/en${query}`;
    return `/en${pathname}${query}`;
  }

  return `${pathname}${query}`;
}

export function alternatePath(pathname: string, target: Language): string {
  return localizePath(pathname, target);
}

export function publicStaticPaths(): { it: string; en: string }[] {
  const pages = ['/', '/about', '/servizi', '/blog', '/contact', '/reviews', '/privacy', '/terms'];
  return pages.map((itPath) => ({
    it: itPath,
    en: localizePath(itPath === '/servizi' ? '/services' : itPath, 'en'),
  }));
}

export function serviceStaticPaths(): { it: string; en: string; key: ServiceCatalogKey }[] {
  return SERVICE_CATALOG_KEYS.map((key) => ({
    key,
    it: serviceHref(key, 'it'),
    en: serviceHref(key, 'en'),
  }));
}
