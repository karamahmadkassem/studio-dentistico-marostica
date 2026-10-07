import { CLINIC, SITE_URL, absoluteUrl } from '../config/clinic';
import { SERVICE_PATH_SLUGS } from '../i18n/paths';
import { SERVICE_CATALOG_KEYS, type ServiceCatalogKey } from '../config/servicesCatalog';
import type { Language } from '../translations';
import { STATIC_REVIEWS } from '../config/staticFallback';

const dentistId = `${SITE_URL}/#dentist`;
const physicianId = `${SITE_URL}/#physician`;
const websiteId = `${SITE_URL}/#website`;

type JsonLd = Record<string, unknown>;

export function dentistSchema(language: Language): JsonLd {
  return {
    '@type': ['Dentist', 'MedicalBusiness', 'LocalBusiness'],
    '@id': dentistId,
    name: CLINIC.name,
    url: SITE_URL,
    image: [absoluteUrl(CLINIC.image), absoluteUrl(CLINIC.doctorImage)],
    logo: absoluteUrl(CLINIC.logo),
    email: CLINIC.email,
    telephone: CLINIC.telephone,
    medicalSpecialty: 'Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CLINIC.streetAddress,
      postalCode: CLINIC.postalCode,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      addressCountry: CLINIC.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CLINIC.geo.latitude,
      longitude: CLINIC.geo.longitude,
    },
    hasMap: CLINIC.mapsSearchUrl,
    sameAs: CLINIC.sameAs,
    inLanguage: language === 'it' ? 'it-IT' : 'en-GB',
    areaServed: CLINIC.areaServed.map((name) => ({
      '@type': 'City',
      name,
    })),
    openingHoursSpecification: CLINIC.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.dayOfWeek,
      opens: slot.opens,
      closes: slot.closes,
    })),
    employee: { '@id': physicianId },
    availableService: SERVICE_CATALOG_KEYS.map((key) => ({
      '@type': 'MedicalProcedure',
      name: SERVICE_PATH_SLUGS[key][language].replace(/-/g, ' '),
      url: absoluteUrl(
        language === 'en' ? `/en/services/${SERVICE_PATH_SLUGS[key].en}` : `/servizi/${SERVICE_PATH_SLUGS[key].it}`,
      ),
    })),
  };
}

export function physicianSchema(): JsonLd {
  return {
    '@type': ['Person', 'Physician'],
    '@id': physicianId,
    name: CLINIC.doctorName,
    jobTitle: CLINIC.doctorJobTitle,
    worksFor: { '@id': dentistId },
    image: absoluteUrl(CLINIC.doctorImage),
    url: absoluteUrl('/about'),
    knowsLanguage: CLINIC.languages,
    medicalSpecialty: 'Dentistry',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Università degli Studi di Trieste',
    },
  };
}

export function websiteSchema(language: Language): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE_URL,
    name: CLINIC.name,
    inLanguage: language === 'it' ? ['it-IT', 'en-GB'] : ['en-GB', 'it-IT'],
    publisher: { '@id': dentistId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): JsonLd | null {
  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}): JsonLd {
  return {
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: absoluteUrl(input.image || CLINIC.ogImage),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Person',
      name: input.author || CLINIC.doctorName,
      url: absoluteUrl('/about'),
    },
    publisher: { '@id': dentistId },
    mainEntityOfPage: absoluteUrl(input.path),
    reviewedBy: { '@id': physicianId },
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  key: ServiceCatalogKey;
}): JsonLd {
  return {
    '@type': 'MedicalProcedure',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    procedureType: 'http://schema.org/MedicalProcedure',
    provider: { '@id': dentistId },
  };
}

export function reviewAggregateSchema(): JsonLd | null {
  if (STATIC_REVIEWS.length === 0) return null;
  const ratings = STATIC_REVIEWS.map((r) => r.rating);
  const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
  return {
    '@type': 'AggregateRating',
    ratingValue: Number(avg.toFixed(1)),
    reviewCount: STATIC_REVIEWS.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export function graph(nodes: Array<JsonLd | null | undefined>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

export function withAggregateRating(dentist: JsonLd): JsonLd {
  const rating = reviewAggregateSchema();
  if (!rating) return dentist;
  return { ...dentist, aggregateRating: rating };
}
