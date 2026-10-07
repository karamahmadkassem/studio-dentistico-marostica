import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const site = 'https://www.studiodentisticomarostica.com';
const today = new Date().toISOString().slice(0, 10);

const SERVICE_SLUGS = [
  { it: 'odontoiatria-generale', en: 'general-dentistry' },
  { it: 'igiene-dentale', en: 'dental-hygiene' },
  { it: 'cura-gengive', en: 'gum-treatment' },
  { it: 'endodonzia', en: 'root-canal' },
  { it: 'implantologia', en: 'dental-implants' },
  { it: 'protesi', en: 'dental-prosthetics' },
  { it: 'estetica-dentale', en: 'cosmetic-dentistry' },
  { it: 'chirurgia-orale', en: 'oral-surgery' },
  { it: 'russamento-apnee', en: 'snoring-sleep-apnea' },
];

const STATIC_PAGES = [
  { it: '/', en: '/en/' },
  { it: '/about', en: '/en/about' },
  { it: '/servizi', en: '/en/services' },
  { it: '/blog', en: '/en/blog' },
  { it: '/contact', en: '/en/contact' },
  { it: '/reviews', en: '/en/reviews' },
  { it: '/privacy', en: '/en/privacy' },
  { it: '/terms', en: '/en/terms' },
];

function loadEnv() {
  const env = { ...process.env };
  const files = ['.env.local', '.env'];
  for (const file of files) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match || env[match[1]]) continue;
      env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
  return env;
}

async function fetchBlogPosts(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at,published_at&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function urlset(entries) {
  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="it" href="${entry.it}" />
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.it}" />
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}

function abs(path) {
  if (path === '/') return `${site}/`;
  return `${site}${path}`;
}

function collectPrerenderedPaths(dir = dist, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.isDirectory()) {
      if (name.name === 'assets' || name.name === 'images' || name.name === 'fonts') continue;
      out.push(...collectPrerenderedPaths(join(dir, name.name), `${prefix}/${name.name}`));
    } else if (name.name === 'index.html') {
      out.push(prefix || '/');
    }
  }
  return out;
}

async function pingIndexNow(env, urls) {
  const key = env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.studiodentisticomarostica.com',
        key,
        keyLocation: `${site}/${key}.txt`,
        urlList: urls.slice(0, 100),
      }),
    });
  } catch (error) {
    console.warn('IndexNow ping failed', error);
  }
}

async function main() {
  mkdirSync(dist, { recursive: true });
  const env = loadEnv();
  const posts = await fetchBlogPosts(env);

  const pairs = [
    ...STATIC_PAGES,
    ...SERVICE_SLUGS.map((slug) => ({
      it: `/servizi/${slug.it}`,
      en: `/en/services/${slug.en}`,
    })),
    ...posts.map((post) => ({
      it: `/blog/${post.slug}`,
      en: `/en/blog/${post.slug}`,
      lastmod: (post.updated_at || post.published_at || today).slice(0, 10),
    })),
  ];

  const xml = urlset(
    pairs.map((pair) => ({
      loc: abs(pair.it),
      it: abs(pair.it),
      en: abs(pair.en),
      lastmod: pair.lastmod || today,
    })),
  );

  writeFileSync(join(dist, 'sitemap.xml'), xml);
  writeFileSync(join(root, 'public', 'sitemap.xml'), xml);

  const notFoundNested = join(dist, '404', 'index.html');
  if (existsSync(notFoundNested)) {
    copyFileSync(notFoundNested, join(dist, '404.html'));
  }

  const urls = pairs.flatMap((pair) => [abs(pair.it), abs(pair.en)]);
  await pingIndexNow(env, urls);
  console.log(`SEO files: ${pairs.length} URL pairs, ${collectPrerenderedPaths().length} prerendered HTML files`);
}

await main();
