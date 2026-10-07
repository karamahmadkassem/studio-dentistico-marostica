import { SERVICE_PATH_SLUGS } from '../i18n/paths';
import { SERVICE_CATALOG_KEYS } from '../config/servicesCatalog';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export async function fetchPublishedBlogSlugs(): Promise<string[]> {
  if (!supabaseUrl || !anonKey) return [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=slug&published=eq.true`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string }[];
    return rows.map((row) => row.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export async function italianBlogPaths(): Promise<string[]> {
  const slugs = await fetchPublishedBlogSlugs();
  return slugs.map((slug) => `blog/${slug}`);
}

export async function englishBlogPaths(): Promise<string[]> {
  const slugs = await fetchPublishedBlogSlugs();
  return slugs.map((slug) => `blog/${slug}`);
}

export function italianServicePaths(): string[] {
  return SERVICE_CATALOG_KEYS.map((key) => `servizi/${SERVICE_PATH_SLUGS[key].it}`);
}

export function englishServicePaths(): string[] {
  return SERVICE_CATALOG_KEYS.map((key) => `services/${SERVICE_PATH_SLUGS[key].en}`);
}
