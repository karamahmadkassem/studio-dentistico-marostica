import { ASSETS } from '../config/assets';

const ALL_FRAMES = ASSETS.home.hero.frames;
const DECODE_TIMEOUT_MS = 4000;
const HERO_WARMED_SESSION_KEY = 'sdm-hero-warmed';

export type HeroFrameSource = ImageBitmap | HTMLImageElement;

let preloadComplete = false;
let preloadPromise: Promise<void> | null = null;
let frameSources: HeroFrameSource[] = [];
let preloadProgress = { loaded: 0, total: 0 };
const preloadProgressListeners = new Set<(loaded: number, total: number) => void>();
const frameSourceListeners = new Set<() => void>();

function notifyFrameSourcesReady() {
  frameSourceListeners.forEach((listener) => listener());
}

export function subscribeHeroFrameSources(listener: () => void): () => void {
  frameSourceListeners.add(listener);
  if (frameSources.length > 0) {
    listener();
  }
  return () => {
    frameSourceListeners.delete(listener);
  };
}

export function hasHeroFrameSources(): boolean {
  return frameSources.length > 0;
}

function notifyPreloadProgress(loaded: number, total: number) {
  preloadProgress = { loaded, total };
  preloadProgressListeners.forEach((listener) => listener(loaded, total));
}

export function subscribeHeroPreloadProgress(
  listener: (loaded: number, total: number) => void,
): () => void {
  preloadProgressListeners.add(listener);
  if (preloadProgress.total > 0) {
    listener(preloadProgress.loaded, preloadProgress.total);
  }
  return () => {
    preloadProgressListeners.delete(listener);
  };
}

export function isHeroPreloadComplete(): boolean {
  return preloadComplete;
}

export function getHeroFrameSources(): readonly HeroFrameSource[] {
  return frameSources;
}

export function isHeroSessionWarmed(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(HERO_WARMED_SESSION_KEY) === '1';
}

export function markHeroSessionWarmed(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(HERO_WARMED_SESSION_KEY, '1');
}

export function shouldWaitForHeroPreload(pathname: string): boolean {
  if (pathname !== '/') return false;
  if (preloadComplete) return false;

  if (typeof window !== 'undefined') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return false;
  }

  return true;
}

/** Hard reload re-fetches the document from the network; soft reload serves it from cache. */
export function isLikelyHardReload(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!nav) return !isHeroSessionWarmed();

  if (nav.type === 'reload') {
    return nav.transferSize > 0;
  }

  return nav.type === 'navigate' && !isHeroSessionWarmed();
}

/** Splash on first visit and hard refresh; skip on fast soft reload (cache hit). */
export function shouldShowHeroSplash(pathname: string): boolean {
  if (!shouldWaitForHeroPreload(pathname)) return false;
  if (!isHeroSessionWarmed()) return true;
  return isLikelyHardReload();
}

export function releaseHeroBootOverlay(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('hero-boot-loading');
  document.documentElement.classList.add('hero-boot-ready');
  document.getElementById('hero-splash-static')?.remove(); // legacy fallback
  document.body.style.overflow = '';
}

/** Wait for web + local fonts so the first paint uses the brand typefaces. */
export async function waitForBrandFonts(timeoutMs = 3000): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;

  await Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}

export function isMobileHeroViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

/** Fewer frames on mobile — lighter decode + smoother scrubbing. */
export function getHeroAnimationFrames(): readonly string[] {
  if (isMobileHeroViewport()) {
    return ALL_FRAMES.filter((_, index) => index % 3 === 0);
  }
  return ALL_FRAMES;
}

export function getHeroCriticalAssets(): string[] {
  const frames = getHeroAnimationFrames();
  return [
    ASSETS.brand.logo,
    ASSETS.home.hero.background,
    ASSETS.home.hero.teeth,
    frames[0],
  ];
}

export function getHeroPreloadUrls(): string[] {
  const frames = getHeroAnimationFrames();
  return [...new Set([...getHeroCriticalAssets(), ...frames])];
}

function getSourceSize(source: HeroFrameSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    };
  }
  return { width: source.width, height: source.height };
}

export function getHeroFrameSourceSize(source: HeroFrameSource): { width: number; height: number } {
  return getSourceSize(source);
}

type PreloadOptions = {
  concurrency?: number;
  onProgress?: (loaded: number, total: number) => void;
};

async function loadFrameSource(src: string): Promise<HeroFrameSource> {
  const img = new Image();
  img.decoding = 'async';

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    img.onload = () => {
      if (typeof img.decode !== 'function') {
        finish();
        return;
      }

      const decodeTimeout = window.setTimeout(finish, DECODE_TIMEOUT_MS);
      img
        .decode()
        .then(finish)
        .catch(finish)
        .finally(() => window.clearTimeout(decodeTimeout));
    };

    img.onerror = () => reject(new Error(`Failed to load hero frame: ${src}`));
    img.src = src;
  });

  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(img);
    } catch {
      return img;
    }
  }

  return img;
}

export async function preloadImages(
  urls: readonly string[],
  { concurrency = 6, onProgress }: PreloadOptions = {},
): Promise<void> {
  if (urls.length === 0) return;

  let loaded = 0;
  const total = urls.length;
  let nextIndex = 0;

  const loadOne = async (src: string) => {
    await loadFrameSource(src);
    loaded += 1;
    onProgress?.(loaded, total);
  };

  const workerCount = Math.min(concurrency, urls.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < urls.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        await loadOne(urls[index]);
      } catch {
        loaded += 1;
        onProgress?.(loaded, total);
      }
    }
  });

  await Promise.all(workers);
}

export async function preloadHeroAssets(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const frames = getHeroAnimationFrames();
  const urls = getHeroPreloadUrls();
  const sourceMap = new Map<string, HeroFrameSource>();
  let loaded = 0;
  const total = urls.length;
  let nextIndex = 0;

  preloadProgress = { loaded: 0, total };
  notifyPreloadProgress(0, total);
  onProgress?.(0, total);

  const syncFrameSources = () => {
    const next = frames
      .map((src) => sourceMap.get(src))
      .filter((source): source is HeroFrameSource => source != null);

    if (next.length > frameSources.length) {
      frameSources = next;
      notifyFrameSourcesReady();
    }
  };

  const loadOne = async (src: string) => {
    try {
      const source = await loadFrameSource(src);
      sourceMap.set(src, source);
      syncFrameSources();
    } catch {
      // Keep going — a missing frame shouldn't block the hero.
    } finally {
      loaded += 1;
      notifyPreloadProgress(loaded, total);
      onProgress?.(loaded, total);
    }
  };

  const workerCount = Math.min(isMobileHeroViewport() ? 4 : 6, urls.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < urls.length) {
      const index = nextIndex;
      nextIndex += 1;
      await loadOne(urls[index]);
    }
  });

  await Promise.all(workers);

  syncFrameSources();

  if (frameSources.length === 0) {
    throw new Error('No hero animation frames could be loaded.');
  }
}

export async function preloadHeroStatic(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const urls = getHeroCriticalAssets();
  await preloadImages(urls, { concurrency: 4, onProgress });
  const firstFrame = getHeroAnimationFrames()[0];
  if (firstFrame) {
    frameSources = [await loadFrameSource(firstFrame)];
    notifyFrameSourcesReady();
  }
}

export function ensureHeroPreloaded(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  if (onProgress) {
    preloadProgressListeners.add(onProgress);
    if (preloadProgress.total > 0) {
      onProgress(preloadProgress.loaded, preloadProgress.total);
    } else if (preloadComplete) {
      onProgress(1, 1);
    }
  }

  if (preloadComplete) {
    notifyPreloadProgress(1, 1);
    return Promise.resolve();
  }

  if (!preloadPromise) {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preload = reducedMotion ? preloadHeroStatic : preloadHeroAssets;

    preloadPromise = preload((loaded, total) => notifyPreloadProgress(loaded, total))
      .then(() => {
        preloadComplete = true;
        notifyPreloadProgress(1, preloadProgress.total || 1);
      })
      .catch((error) => {
        preloadPromise = null;
        throw error;
      });
  }

  return preloadPromise;
}
