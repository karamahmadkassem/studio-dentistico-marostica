import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ASSETS } from '../config/assets';
import { useLanguage } from '../context/LanguageContext';

const FRAMES = ASSETS.home.hero.frames;
const SCROLL_FRAMES = FRAMES;
const SCROLL_FRAME_LAST_INDEX = SCROLL_FRAMES.length - 1;

const HeroContent = memo(function HeroContent() {
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
});

const getActiveFrameIndex = (value: number) =>
  Math.min(
    SCROLL_FRAME_LAST_INDEX,
    Math.max(0, Math.round(value * SCROLL_FRAME_LAST_INDEX)),
  );

const DoctorFrame: React.FC<{
  src: string;
  index: number;
  progress: MotionValue<number>;
}> = ({ src, index, progress }) => {
  const opacity = useTransform(progress, (value) =>
    getActiveFrameIndex(value) === index ? 1 : 0,
  );
  const visibility = useTransform(progress, (value) =>
    getActiveFrameIndex(value) === index ? 'visible' : 'hidden',
  );
  const zIndex = useTransform(progress, (value) =>
    getActiveFrameIndex(value) === index ? 2 : 1,
  );

  return (
    <motion.img
      src={src}
      alt=""
      className="scroll-hero__doctor-img"
      style={{ opacity, visibility, zIndex }}
      draggable={false}
      decoding="async"
      loading="eager"
      aria-hidden
    />
  );
};

const HeroLayers: React.FC<{
  scrollYProgress?: MotionValue<number>;
  staticFrameIndex?: number;
  teethY?: MotionValue<string>;
  overlayOpacity?: MotionValue<number>;
  overlayZIndex?: MotionValue<number>;
  textZIndex?: MotionValue<number>;
  doctorZIndex?: MotionValue<number>;
  teethZIndex?: MotionValue<number>;
}> = ({
  scrollYProgress,
  staticFrameIndex = 0,
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
      className="scroll-hero__doctor pointer-events-none absolute inset-x-0 bottom-0 h-full w-full"
      style={{ zIndex: doctorZIndex ?? 5 }}
      aria-hidden
    >
      {scrollYProgress
        ? SCROLL_FRAMES.map((src, index) => (
            <DoctorFrame key={src} src={src} index={index} progress={scrollYProgress} />
          ))
        : (
          <img
            src={FRAMES[staticFrameIndex]}
            alt=""
            className="scroll-hero__doctor-img scroll-hero__doctor-img--static"
            draggable={false}
          />
        )}
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
    void Promise.all(
      SCROLL_FRAMES.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => {
              if (typeof img.decode === 'function') {
                img.decode().then(resolve).catch(resolve);
                return;
              }
              resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    );
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

  if (reducedMotion) {
    return (
      <section id="home-hero" className="scroll-hero scroll-hero--static">
        <HeroLayers staticFrameIndex={0} />
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
          scrollYProgress={scrollYProgress}
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
