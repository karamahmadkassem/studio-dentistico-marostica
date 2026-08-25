import React, { useCallback, useEffect, useRef, useState } from 'react';
import ServiceFlipCard from './ServiceFlipCard';
import type { DisplayService } from '../config/servicesCatalog';

interface ServicesCarouselProps {
  services: DisplayService[];
  learnMoreLabel: string;
}

const DRAG_THRESHOLD = 6;

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ services, learnMoreLabel }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const suppressClickRef = useRef(false);
  const isHoveredRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const wrapScroll = useCallback((el: HTMLDivElement) => {
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    while (el.scrollLeft >= half) el.scrollLeft -= half;
    while (el.scrollLeft < 0) el.scrollLeft += half;
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || reduceMotion) return;

    const durationMs = Math.max(50, services.length * 8) * 1000;
    let raf = 0;
    let lastTime: number | null = null;

    const tick = (time: number) => {
      if (lastTime == null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!dragState.current.active && !isHoveredRef.current) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          el.scrollLeft += (half / durationMs) * delta;
          wrapScroll(el);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, services.length, wrapScroll]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;

    const el = viewportRef.current;
    if (!el) return;

    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const el = viewportRef.current;
    if (!el) return;

    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }

    el.scrollLeft = dragState.current.startScroll - dx;
    wrapScroll(el);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    if (dragState.current.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    dragState.current.active = false;
    setIsDragging(false);
    viewportRef.current?.releasePointerCapture(e.pointerId);
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    if ((e.target as HTMLElement).closest('a')) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClickRef.current = false;
  };

  if (services.length === 0) return null;

  const renderCard = (service: DisplayService, key: string) => (
    <ServiceFlipCard key={key} service={service} learnMoreLabel={learnMoreLabel} />
  );

  const track = reduceMotion ? (
    services.map((service) => renderCard(service, service.id))
  ) : (
    <>
      {services.map((service) => renderCard(service, service.id))}
      {services.map((service) => renderCard(service, `dup-${service.id}`))}
    </>
  );

  return (
    <div className="services-carousel">
      <div
        ref={viewportRef}
        className={`services-carousel-viewport${isDragging ? ' is-dragging' : ''}`}
        aria-label="Services carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        <div className="services-carousel-track">{track}</div>
      </div>
    </div>
  );
};

export default ServicesCarousel;
