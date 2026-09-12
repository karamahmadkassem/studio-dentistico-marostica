import React, { memo, useEffect, useRef, useState } from 'react';
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
import {
  getHeroAnimationFrames,
  getHeroFrameSourceSize,
  getHeroFrameSources,
  type HeroFrameSource,
} from '../lib/heroAssets';
import { useLanguage } from '../context/LanguageContext';

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

const getActiveFrameIndex = (value: number, frameCount: number) => {
  const lastIndex = frameCount - 1;
  return Math.min(lastIndex, Math.max(0, Math.round(value * lastIndex)));
};

const isMobileHeroCanvas = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

const drawHeroFrame = (
  canvas: HTMLCanvasElement,
  source: HeroFrameSource,
) => {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Layout size — CSS transform handles mobile zoom separately (matches original <img>).
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  if (width <= 0 || height <= 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const { width: sourceWidth, height: sourceHeight } = getHeroFrameSourceSize(source);
  if (sourceWidth <= 0 || sourceHeight <= 0) return;

  const scale = isMobileHeroCanvas()
    ? Math.min(width / sourceWidth, height / sourceHeight)
    : Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = height - drawHeight;

  ctx.drawImage(source, drawX, drawY, drawWidth, drawHeight);
};

const DoctorAnimation: React.FC<{
  sources: readonly HeroFrameSource[];
  progress: MotionValue<number>;
}> = ({ sources, progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastIndexRef = useRef(0);
  const pendingIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const paintFrame = (index: number) => {
    const canvas = canvasRef.current;
    const source = sources[index];
    if (!canvas || !source) return;
    drawHeroFrame(canvas, source);
  };

  useEffect(() => {
    paintFrame(0);

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const observer = new ResizeObserver(() => {
      paintFrame(lastIndexRef.current);
    });
    observer.observe(canvas);

    const mobileMq = window.matchMedia('(max-width: 767px)');
    const onViewportChange = () => paintFrame(lastIndexRef.current);
    mobileMq.addEventListener('change', onViewportChange);

    return () => {
      observer.disconnect();
      mobileMq.removeEventListener('change', onViewportChange);
    };
  }, [sources]);

  useMotionValueEvent(progress, 'change', (value) => {
    const index = getActiveFrameIndex(value, sources.length);
    pendingIndexRef.current = index;

    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const nextIndex = pendingIndexRef.current;
      if (nextIndex === lastIndexRef.current) return;
      lastIndexRef.current = nextIndex;
      paintFrame(nextIndex);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      className="scroll-hero__doctor-img scroll-hero__doctor-img--canvas"
      aria-hidden
    />
  );
};

const HeroLayers: React.FC<{
  frames: readonly string[];
  sources: readonly HeroFrameSource[];
  scrollYProgress?: MotionValue<number>;
  teethY?: MotionValue<string>;
  overlayOpacity?: MotionValue<number>;
  overlayZIndex?: MotionValue<number>;
  textZIndex?: MotionValue<number>;
  doctorZIndex?: MotionValue<number>;
  teethZIndex?: MotionValue<number>;
}> = ({
  frames,
  sources,
  scrollYProgress,
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
      {scrollYProgress && sources.length > 0 ? (
        <DoctorAnimation sources={sources} progress={scrollYProgress} />
      ) : (
        <img
          src={frames[0]}
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
  const frames = getHeroAnimationFrames();
  const sources = getHeroFrameSources();

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
        <HeroLayers frames={frames} sources={sources} />
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
          frames={frames}
          sources={sources}
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
