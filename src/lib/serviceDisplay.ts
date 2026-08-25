import {
  SERVICE_CATALOG_KEYS,
  SERVICE_ICON_BY_SLUG,
  SERVICE_IMAGE_BY_SLUG,
  type DisplayService,
  type ServiceCatalogKey,
} from '../config/servicesCatalog';
import type { Service } from '../types/database';

function parseDetails(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function buildServicesFromTranslations(
  t: (key: string) => unknown,
): DisplayService[] {
  return SERVICE_CATALOG_KEYS.map((slug) => {
    const base = `services.services.${slug}`;
    return {
      id: slug,
      slug,
      iconKey: SERVICE_ICON_BY_SLUG[slug],
      imageUrl: SERVICE_IMAGE_BY_SLUG[slug],
      title: String(t(`${base}.title`)),
      description: String(t(`${base}.description`)),
      details: (t(`${base}.details`) as string[]) ?? [],
    };
  });
}

export function mergeDbAndTranslationServices(
  rows: Service[],
  language: 'it' | 'en',
  t: (key: string) => unknown,
): DisplayService[] {
  const fallback = buildServicesFromTranslations(t);
  if (rows.length === 0) return fallback;

  const isIt = language === 'it';
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  return SERVICE_CATALOG_KEYS.map((slug) => {
    const row = bySlug.get(slug);
    const catalogSlug = slug as ServiceCatalogKey;
    if (row) {
      return {
        id: row.id,
        slug,
        iconKey: row.icon_key || SERVICE_ICON_BY_SLUG[catalogSlug],
        imageUrl: SERVICE_IMAGE_BY_SLUG[catalogSlug],
        title: isIt ? row.title_it : row.title_en,
        description: isIt ? row.description_it : row.description_en,
        details: parseDetails(isIt ? row.details_it : row.details_en),
      };
    }
    return fallback.find((s) => s.slug === slug)!;
  });
}
