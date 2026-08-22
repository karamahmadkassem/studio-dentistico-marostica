import React, { useEffect, useMemo, useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { fetchPublishedReviews } from '../lib/api';
import { STATIC_REVIEWS } from '../config/staticFallback';
import { usePageTitle } from '../hooks/usePageTitle';

interface DisplayReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  treatmentType: string;
  helpful: number;
}

const ReviewsPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(t('nav.reviews'));
  const [activeFilter, setActiveFilter] = useState('all');
  const [reviews, setReviews] = useState<DisplayReview[]>([]);

  useEffect(() => {
    const locale = language === 'it' ? 'it-IT' : 'en-GB';
    fetchPublishedReviews()
      .then((rows) => {
        if (rows.length === 0) {
          setReviews(
            STATIC_REVIEWS.map((r) => ({
              id: r.id,
              name: r.name,
              date: new Date(r.created_at).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              rating: r.rating,
              text: r.body,
              treatmentType: r.treatment_type,
              helpful: r.helpful_count,
            })),
          );
          return;
        }
        setReviews(
          rows.map((r) => ({
            id: r.id,
            name: r.name,
            date: new Date(r.created_at).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            rating: r.rating,
            text: r.body,
            treatmentType: r.treatment_type,
            helpful: r.helpful_count,
          })),
        );
      })
      .catch(() => {
        setReviews(
          STATIC_REVIEWS.map((r) => ({
            id: r.id,
            name: r.name,
            date: new Date(r.created_at).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            rating: r.rating,
            text: r.body,
            treatmentType: r.treatment_type,
            helpful: r.helpful_count,
          })),
        );
      });
  }, [language]);

  const treatmentTypes = useMemo(() => {
    const types = new Set(reviews.map((r) => r.treatmentType).filter(Boolean));
    return [
      { id: 'all', label: t('reviews.filters.all') },
      ...Array.from(types).map((id) => ({ id, label: id })),
    ];
  }, [reviews, t]);

  const filteredReviews =
    activeFilter === 'all' ? reviews : reviews.filter((review) => review.treatmentType === activeFilter);

  const avg =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  const basedOn = String(t('reviews.summary.basedOn')).replace('{count}', String(reviews.length));

  return (
    <div>
      <PageHero
        title={t('reviews.hero.title')}
        subtitle={t('reviews.hero.subtitle')}
        image="https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <Section>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <FadeIn>
            <div className="max-w-xl">
              <h2 className="heading-section mb-3">{t('reviews.summary.title')}</h2>
              <p className="text-body">{t('reviews.summary.subtitle')}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="rounded-md bg-brand-cyan-soft px-8 py-6 text-center">
              <div className="mb-2 flex justify-center gap-1 text-brand-cyan">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-current" />
                ))}
              </div>
              <p className="font-display text-3xl font-bold text-ink">{avg} / 5</p>
              <p className="text-sm text-ink-muted">{basedOn}</p>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section muted>
        <div className="relative mb-8">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface-muted to-transparent md:hidden" />
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
            {treatmentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setActiveFilter(type.id)}
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === type.id
                    ? 'bg-brand-cyan text-white'
                    : 'bg-white text-ink-muted hover:bg-brand-cyan-soft hover:text-brand-navy'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filteredReviews.map((review, i) => (
            <FadeIn key={review.id} delay={Math.min(i, 4) * 0.04}>
              <article className="border border-ink-soft/25 bg-white p-6">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{review.name}</h3>
                    <p className="text-sm text-ink-soft">{review.date}</p>
                  </div>
                  <div className="flex gap-0.5" aria-label={`${review.rating} stars`}>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < review.rating ? 'fill-current text-brand-cyan' : 'text-ink-soft'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mb-4 leading-relaxed text-ink-muted">{review.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-brand-cyan-soft px-3 py-1 font-medium text-brand-navy">
                    {review.treatmentType}
                  </span>
                  <span className="inline-flex items-center gap-1 text-ink-soft">
                    <ThumbsUp size={14} />
                    {t('reviews.helpful')} ({review.helpful})
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl rounded-md bg-surface-muted p-8 text-center">
            <h2 className="heading-section mb-3">{t('reviews.inviteOnly.title')}</h2>
            <p className="text-body">{t('reviews.inviteOnly.message')}</p>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
};

export default ReviewsPage;
