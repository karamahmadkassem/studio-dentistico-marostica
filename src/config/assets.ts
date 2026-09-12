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
        { length: 119 },
        (_, i) => `/images/home/hero/animation/frame_${String(i + 1).padStart(3, '0')}.webp`,
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
