import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ASSETS } from '../config/assets';
import { useLanguage } from '../context/LanguageContext';

const FRAMES = ASSETS.home.hero.frames;

const HeroContent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl">
      <h1 className="scroll-hero__title mb-5 text-3xl md:text-5xl">
        Studio Dentistico <span className="accent">Marostica</span>
      </h1>
      <p className="scroll-hero__tagline mb-3 font-display text-xl font-semibold md:text-2xl">
        {t('home.hero.title')}
      </p>
      <p className="scroll-hero__subtitle mb-8 max-w-xl text-base md:text-lg">
        {t('home.hero.subtitle')}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/contact" className="btn-primary">
          {t('home.hero.cta')} <ChevronRight size={18} />
        </Link>
        <Link to="/services" className="scroll-hero__btn-ghost">
          {t('home.hero.secondary')}
        </Link>
      </div>
    </div>
  );
};

const HeroLayers: React.FC<{
  frameIndex: number;
  teethY?: MotionValue<string>;
  overlayOpacity?: MotionValue<number>;
  overlayZIndex?: MotionValue<number>;
  textZIndex?: MotionValue<number>;
  doctorZIndex?: MotionValue<number>;
  teethZIndex?: MotionValue<number>;
}> = ({
  frameIndex,
  teethY,
  overlayOpacity,
  overlayZIndex,
  textZIndex,
  doctorZIndex,
  teethZIndex,
}) => (
  <>
    <div
      className="scroll-hero__bg absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${ASSETS.home.hero.background})` }}
      aria-hidden
    />
    <motion.div
      className="scroll-hero__doctor pointer-events-none absolute inset-x-0 bottom-0 flex h-full w-full items-end justify-center"
      style={{ zIndex: doctorZIndex ?? 5 }}
      aria-hidden
    >
      <img
        src={FRAMES[frameIndex]}
        alt=""
        className="scroll-hero__doctor-img"
        draggable={false}
      />
    </motion.div>

    {teethY ? (
      <motion.div
        className="scroll-hero__teeth pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
        style={{ y: teethY, zIndex: teethZIndex ?? 6 }}
        aria-hidden
      >
        <img
          src={ASSETS.home.hero.teeth}
          alt=""
          className="scroll-hero__teeth-img"
          draggable={false}
        />
      </motion.div>
    ) : (
      <div
        className="scroll-hero__teeth scroll-hero__teeth--static pointer-events-none absolute inset-x-0 bottom-0 z-[6] flex justify-center"
        aria-hidden
      >
        <img
          src={ASSETS.home.hero.teeth}
          alt=""
          className="scroll-hero__teeth-img"
          draggable={false}
        />
      </div>
    )}

    <motion.div
      className="scroll-hero__gradient absolute inset-0"
      style={{
        opacity: overlayOpacity ?? 1,
        zIndex: overlayZIndex ?? 42,
      }}
      aria-hidden
    />

    <motion.div
      className="container-page scroll-hero__copy absolute inset-x-0 top-0 flex h-full w-full items-center pb-16 pt-28 md:pb-20 md:pt-32"
      style={{ zIndex: textZIndex ?? 50 }}
    >
      <HeroContent />
    </motion.div>
  </>
);

const ScrollHero: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const teethY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ['85%', '-1%'] : ['110%', '11%'],
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.06, 0.2], [1, 0.35, 0]);
  const overlayZIndex = useTransform(scrollYProgress, [0, 0.07, 0.1], [42, 42, 8]);
  const textZIndex = useTransform(scrollYProgress, [0, 0.08, 1], [50, 12, 8]);
  const doctorZIndex = useTransform(scrollYProgress, [0, 0.08, 1], [5, 35, 40]);
  const teethZIndex = useTransform(scrollYProgress, [0, 0.08, 1], [5, 45, 50]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setFrameIndex(Math.min(15, 1 + Math.round(latest * 14)));
  });

  if (reducedMotion) {
    return (
      <section id="home-hero" className="scroll-hero scroll-hero--static">
        <HeroLayers frameIndex={1} />
      </section>
    );
  }

  return (
    <div ref={trackRef} className="scroll-hero-track">
      <section
        id="home-hero"
        className="scroll-hero sticky top-0 z-40 h-[100svh]"
      >
        <HeroLayers
          frameIndex={frameIndex}
          teethY={teethY}
          overlayOpacity={overlayOpacity}
          overlayZIndex={overlayZIndex}
          textZIndex={textZIndex}
          doctorZIndex={doctorZIndex}
          teethZIndex={teethZIndex}
        />
      </section>
    </div>
  );
};

export default ScrollHero;
