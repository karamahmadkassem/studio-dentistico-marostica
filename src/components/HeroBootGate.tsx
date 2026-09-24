import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeroBootLogo from './HeroBootLogo';
import HeroSplashScreen from './HeroSplashScreen';
import {
  ensureHeroPreloaded,
  hasHeroFrameSources,
  isHeroPreloadComplete,
  isHeroSessionWarmed,
  markHeroSessionWarmed,
  releaseHeroBootOverlay,
  subscribeHeroPreloadProgress,
  shouldWaitForHeroPreload,
  waitForBrandFonts,
} from '../lib/heroAssets';

const HERO_HARD_REVEAL_MS = 45000;
const HERO_SPLASH_MIN_MS = 600;
/** Soft reloads from cache usually finish faster — skip splash unless load exceeds this. */
const SPLASH_DELAY_MS = 400;

type HeroBootGateProps = {
  children: React.ReactNode;
};

const HeroBootGate: React.FC<HeroBootGateProps> = ({ children }) => {
  const { pathname } = useLocation();
  const needsPreload = shouldWaitForHeroPreload(pathname);
  const splashVisibleRef = useRef(false);

  const [bootReady, setBootReady] = useState(() => !needsPreload);
  const [showSplash, setShowSplash] = useState(
    () => needsPreload && !isHeroSessionWarmed(),
  );
  const [splashExiting, setSplashExiting] = useState(false);
  const [loadProgress, setLoadProgress] = useState(() =>
    isHeroPreloadComplete() ? 1 : 0,
  );

  useEffect(() => {
    splashVisibleRef.current = showSplash;
  }, [showSplash]);

  useEffect(() => {
    if (!needsPreload) {
      releaseHeroBootOverlay();
      setBootReady(true);
      setShowSplash(false);
      setSplashExiting(false);
      return undefined;
    }

    const firstVisit = !isHeroSessionWarmed();
    splashVisibleRef.current = firstVisit;
    setShowSplash(firstVisit);
    setBootReady(false);
    setSplashExiting(false);
    setLoadProgress(0);

    document.documentElement.classList.remove('hero-boot-ready');
    document.documentElement.classList.add('hero-boot-loading');
    document.body.style.overflow = 'hidden';

    if (!firstVisit) {
      document.getElementById('hero-splash-static')?.remove();
    }

    let cancelled = false;
    let finished = false;
    const startedAt = Date.now();

    const delayedSplashId = firstVisit
      ? undefined
      : window.setTimeout(() => {
          if (cancelled || finished) return;
          splashVisibleRef.current = true;
          setShowSplash(true);
        }, SPLASH_DELAY_MS);

    const finishLoading = (options?: { force?: boolean }) => {
      if (cancelled || finished) return;
      if (!options?.force && !hasHeroFrameSources()) return;

      if (delayedSplashId !== undefined) {
        window.clearTimeout(delayedSplashId);
      }

      finished = true;
      markHeroSessionWarmed();

      const revealSite = async () => {
        if (cancelled) return;
        await waitForBrandFonts();
        if (cancelled) return;
        releaseHeroBootOverlay();
        setBootReady(true);
      };

      const usedSplash = splashVisibleRef.current;

      if (!usedSplash) {
        void revealSite();
        return;
      }

      setShowSplash(true);
      setLoadProgress(1);
      setSplashExiting(true);

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, HERO_SPLASH_MIN_MS - elapsed);
      window.setTimeout(() => {
        void revealSite();
      }, remaining + 400);
    };

    const hardRevealId = window.setTimeout(() => {
      finishLoading({ force: true });
    }, HERO_HARD_REVEAL_MS);

    const unsubscribeProgress = subscribeHeroPreloadProgress((loaded, total) => {
      if (!cancelled) setLoadProgress(total > 0 ? loaded / total : 0);
    });

    ensureHeroPreloaded()
      .then(() => finishLoading())
      .catch(() => finishLoading({ force: true }));

    return () => {
      cancelled = true;
      unsubscribeProgress();
      window.clearTimeout(hardRevealId);
      if (delayedSplashId !== undefined) {
        window.clearTimeout(delayedSplashId);
      }
    };
  }, [needsPreload, pathname]);

  if (!bootReady) {
    if (showSplash) {
      return <HeroSplashScreen progress={loadProgress} exiting={splashExiting} />;
    }
    return <HeroBootLogo progress={loadProgress} exiting={splashExiting} />;
  }

  return <>{children}</>;
};

export default HeroBootGate;
