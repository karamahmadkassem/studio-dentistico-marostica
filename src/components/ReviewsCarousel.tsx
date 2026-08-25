import React, { useEffect, useState } from 'react';

export interface CarouselReview {
  id: string;
  name: string;
  text: string;
  rating: number;
}

interface ReviewsCarouselProps {
  reviews: CarouselReview[];
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reviews.length === 0) return null;

  const duration = Math.max(60, reviews.length * 6);

  const renderCard = (item: CarouselReview, key: string) => (
    <blockquote
      key={key}
      className="reviews-carousel-card shrink-0 rounded-md border border-ink-soft/20 bg-white px-5 py-5"
    >
      <div className="mb-3 flex gap-0.5 text-brand-cyan" aria-label={`${item.rating} stars`}>
        {[...Array(item.rating)].map((_, idx) => (
          <span key={idx}>★</span>
        ))}
      </div>
      <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-ink-muted">“{item.text}”</p>
      <p className="font-semibold text-ink">{item.name}</p>
    </blockquote>
  );

  if (reduceMotion) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-2">
        {reviews.map((item) => renderCard(item, item.id))}
      </div>
    );
  }

  return (
    <div
      className="reviews-carousel"
      style={{ '--reviews-carousel-duration': `${duration}s` } as React.CSSProperties}
    >
      <div className="overflow-hidden">
        <div className="reviews-carousel-track">
          {reviews.map((item) => renderCard(item, item.id))}
          {reviews.map((item) => renderCard(item, `dup-${item.id}`))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsCarousel;
