import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ASSETS } from '../config/assets';
import { getTranslation } from '../translations';

const SPLASH_BRAND = getTranslation('en', 'common.brand') as string;

type HeroBootLogoProps = {
  progress: number;
  exiting?: boolean;
};

/** Minimal boot screen — logo on dark background (soft reload). */
const HeroBootLogo: React.FC<HeroBootLogoProps> = ({ progress, exiting = false }) => {
  const hasProgress = progress > 0;
  const barScale = Math.min(1, Math.max(0, progress));

  useLayoutEffect(() => {
    document.getElementById('hero-splash-static')?.remove();
    document.documentElement.classList.add('hero-boot-loading');
    document.documentElement.classList.remove('hero-boot-ready');
  }, []);

  return createPortal(
    <motion.div
      className="hero-splash hero-splash--minimal"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
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

export default HeroBootLogo;
