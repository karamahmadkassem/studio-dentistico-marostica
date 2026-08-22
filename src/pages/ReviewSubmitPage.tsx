import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import RequiredMark from '../components/RequiredMark';
import { submitReview } from '../lib/api';
import { CONTACT_SERVICE_KEYS } from '../config/contactServices';
import { usePageTitle } from '../hooks/usePageTitle';

const ReviewSubmitPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  usePageTitle(String(t('reviews.submit.pageTitle')));

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const treatmentOptions = CONTACT_SERVICE_KEYS.map((key) => ({
    id: key,
    label: String(t(`services.services.${key}.title`)),
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (!rating) {
      setError(String(t('reviews.submit.ratingRequired')));
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    setError('');
    try {
      await submitReview(token, {
        name: fd.get('name'),
        email: fd.get('email') || '',
        rating,
        treatmentType: fd.get('treatment'),
        reviewText: fd.get('review'),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(t('reviews.submit.error')));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Section>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="heading-section mb-4">{t('reviews.submit.invalidTitle')}</h1>
          <p className="text-body mb-6">{t('reviews.submit.invalidMessage')}</p>
          <Link to="/reviews" className="link-accent">
            {t('reviews.submit.backToReviews')}
          </Link>
        </div>
      </Section>
    );
  }

  if (submitted) {
    return (
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-lg rounded-md border border-brand-cyan/30 bg-brand-cyan-soft p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-brand-cyan" />
            <h1 className="heading-section mb-3">{t('reviews.submit.successTitle')}</h1>
            <p className="text-body mb-6">{t('reviews.submit.successMessage')}</p>
            <Link to="/reviews" className="btn-primary inline-flex">
              {t('reviews.submit.backToReviews')}
            </Link>
          </div>
        </FadeIn>
      </Section>
    );
  }

  return (
    <Section>
      <FadeIn>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="heading-section mb-3">{t('reviews.submit.title')}</h1>
          <p className="text-body">{t('reviews.submit.subtitle')}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.06}>
        <form
          className="mx-auto max-w-2xl space-y-5 rounded-md bg-surface-muted p-6 md:p-8"
          onSubmit={handleSubmit}
        >
          {error && (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="review-name" className="label-field">
              {t('reviews.form.name')}
              <RequiredMark />
            </label>
            <input type="text" id="review-name" name="name" required className="input-field" />
          </div>
          <div>
            <label htmlFor="review-email" className="label-field">
              {t('reviews.form.email')}
            </label>
            <input type="email" id="review-email" name="email" className="input-field" />
          </div>
          <div>
            <span className="label-field">
              {t('reviews.form.rating')}
              <RequiredMark />
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`${value} stars`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      value <= (hoverRating || rating)
                        ? 'fill-current text-brand-cyan'
                        : 'text-ink-soft'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="treatment" className="label-field">
              {t('reviews.form.treatment')}
              <RequiredMark />
            </label>
            <select id="treatment" name="treatment" required className="input-field">
              <option value="">{t('reviews.form.selectTreatment')}</option>
              {treatmentOptions.map((type) => (
                <option key={type.id} value={type.label}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review-text" className="label-field">
              {t('reviews.form.review')}
              <RequiredMark />
            </label>
            <textarea
              id="review-text"
              name="review"
              rows={5}
              required
              className="input-field resize-y"
              placeholder={String(t('reviews.form.placeholder'))}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? language === 'it'
                ? 'Invio in corso…'
                : 'Sending…'
              : t('reviews.form.submit')}{' '}
            <Send size={16} />
          </button>
        </form>
      </FadeIn>
    </Section>
  );
};

export default ReviewSubmitPage;
