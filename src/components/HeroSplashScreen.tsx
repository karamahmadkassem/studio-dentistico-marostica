import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ASSETS } from '../config/assets';
import { getTranslation } from '../translations';

const SPLASH_LOADING = getTranslation('en', 'home.splash.loading') as string;
const SPLASH_QUOTES = getTranslation('en', 'home.splash.quotes') as string[];
const SPLASH_BRAND = getTranslation('en', 'common.brand') as string;

type HeroSplashScreenProps = {
  progress: number;
  exiting?: boolean;
};

const HeroSplashScreen: React.FC<HeroSplashScreenProps> = ({ progress, exiting = false }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const safeQuotes = useMemo(
    () => (Array.isArray(SPLASH_QUOTES) && SPLASH_QUOTES.length > 0 ? SPLASH_QUOTES : []),
    [],
  );

  useLayoutEffect(() => {
    // Hand off from the inline HTML splash to the React splash before paint.
    document.getElementById('hero-splash-static')?.remove();
    document.documentElement.classList.add('hero-boot-loading');
    document.documentElement.classList.remove('hero-boot-ready');
  }, []);

  useEffect(() => {
    if (safeQuotes.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % safeQuotes.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [safeQuotes.length]);

  const quote = safeQuotes[quoteIndex] ?? '';
  const hasProgress = progress > 0;
  const barScale = Math.min(1, Math.max(0, progress));

  return createPortal(
    <motion.div
      className="hero-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      aria-live="polite"
      aria-busy={!exiting}
      role="status"
    >
      <div className="hero-splash__content">
        <img
          src={ASSETS.brand.logo}
          alt={SPLASH_BRAND}
          className="hero-splash__logo"
          width={220}
          height={80}
          decoding="async"
        />
        {quote ? (
          <motion.p
            key={quoteIndex}
            className="hero-splash__quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {quote}
          </motion.p>
        ) : null}
        <p className="hero-splash__loading">{SPLASH_LOADING}</p>
      </div>

      <div className="hero-splash__progress-track" aria-hidden>
        {hasProgress ? (
          <div
            className="hero-splash__progress-bar"
            style={{ transform: `scaleX(${Math.max(barScale, 0.03)})` }}
          />
        ) : (
          <div className="hero-splash__progress-bar hero-splash__progress-bar--indeterminate" />
        )}
      </div>
    </motion.div>,
    document.body,
  );
};

export default HeroSplashScreen;
