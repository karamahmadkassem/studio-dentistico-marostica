/** Public static asset paths (served from /public). */
export const ASSETS = {
  brand: {
    logo: '/images/brand/logo.png',
    favicon: '/images/brand/favicon.png',
  },
  home: {
    hero: {
      background: '/images/home/hero/background.jpg',
      teeth: '/images/home/hero/teeth.png',
      frames: Array.from(
        { length: 15 },
        (_, i) => `/images/home/hero/frame-${String(i + 2).padStart(2, '0')}.webp`,
      ),
    },
  },
  about: {
    hero: '/images/about/about-us.jpg',
  },
  team: {
    drMoustaphaMortada: '/images/team/dr-moustapha-mortada.jpg',
  },
} as const;
