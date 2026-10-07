import React, { useEffect, useMemo, useState } from 'react';
import { LocalizedLink } from '../i18n/LocalizedLink';
import { CalendarCheck, CaretRight, Sparkle, Users } from '@phosphor-icons/react';
import { PUBLIC_ICON_WEIGHT } from '../components/ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import ScrollHero from '../components/ScrollHero';
import ReviewsCarousel from '../components/ReviewsCarousel';
import ServicesCarousel from '../components/ServicesCarousel';
import { fetchPublishedReviews, fetchPublishedServices } from '../lib/api';
import { mergeDbAndTranslationServices } from '../lib/serviceDisplay';
import { ASSETS } from '../config/assets';
import { STATIC_REVIEWS } from '../config/staticFallback';
import type { Service } from '../types/database';
import Seo from '../seo/Seo';
import {
  breadcrumbSchema,
  dentistSchema,
  graph,
  physicianSchema,
  websiteSchema,
  withAggregateRating,
} from '../seo/schema';

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const jsonLd = graph([
    withAggregateRating(dentistSchema(language)),
    physicianSchema(),
    websiteSchema(language),
    breadcrumbSchema([{ name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' }]),
  ]);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [dbReviews, setDbReviews] = useState<{ id: string; name: string; body: string; rating: number }[]>([]);

  useEffect(() => {
    fetchPublishedServices(language).then(setDbServices).catch(() => setDbServices([]));
    fetchPublishedReviews()
      .then((rows) =>
        setDbReviews(rows.map((r) => ({ id: r.id, name: r.name, body: r.body, rating: r.rating }))),
      )
      .catch(() => setDbReviews([]));
  }, [language]);

  const services = useMemo(
    () => mergeDbAndTranslationServices(dbServices, language, t),
    [dbServices, language, t],
  );

  const testimonials = useMemo(() => {
    if (dbReviews.length > 0) {
      return dbReviews.map((r) => ({
        id: r.id,
        name: r.name,
        text: r.body,
        rating: r.rating,
      }));
    }
    return STATIC_REVIEWS.map((r) => ({
      id: r.id,
      name: r.name,
      text: r.body,
      rating: r.rating,
    }));
  }, [dbReviews]);

  const features = [
    {
      icon: <CalendarCheck size={28} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand text-brand-cyan" />,
      title: t('home.features.flexible.title'),
      description: t('home.features.flexible.description'),
    },
    {
      icon: <Sparkle size={28} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand text-brand-cyan" />,
      title: t('home.features.technology.title'),
      description: t('home.features.technology.description'),
    },
    {
      icon: <Users size={28} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand text-brand-cyan" />,
      title: t('home.features.team.title'),
      description: t('home.features.team.description'),
    },
  ];

  return (
    <div>
      <Seo
        title={String(t('seo.home.title'))}
        description={String(t('seo.home.description'))}
        path={language === 'en' ? '/en' : '/'}
        jsonLd={jsonLd}
      />
      <ScrollHero />

      {/* About */}
      <Section className="home-about-section relative z-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={ASSETS.about.hero}
                alt={
                  language === 'it'
                    ? 'Studio Dentistico Marostica: visita odontoiatrica in studio a Marostica'
                    : 'Studio Dentistico Marostica: dental visit at the clinic in Marostica'
                }
                className="h-full w-full object-cover"
                width={800}
                height={600}
                loading="lazy"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="heading-section mb-5">{t('home.about.title')}</h2>
            <p className="text-body mb-8">{t('home.about.content')}</p>
            <LocalizedLink to="/about" className="btn-primary">
              {t('home.about.more')}
            </LocalizedLink>
          </FadeIn>
        </div>
      </Section>

      {/* Services */}
      <Section muted>
        <FadeIn>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="heading-section mb-3">{t('home.services.title')}</h2>
              <p className="text-body">{t('home.services.subtitle')}</p>
            </div>
            <LocalizedLink to="/services" className="link-accent shrink-0">
              {t('home.services.cta')} <CaretRight size={16} weight={PUBLIC_ICON_WEIGHT} className="ml-1" />
            </LocalizedLink>
          </div>
        </FadeIn>
        <ServicesCarousel services={services} learnMoreLabel={t('home.services.learnMore')} />
      </Section>

      {/* Features */}
      <Section>
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <h2 className="heading-section mb-3">{t('home.features.title')}</h2>
            <p className="text-body">{t('home.features.subtitle')}</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div className="border-t border-brand-cyan/30 pt-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 font-display text-xl font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="text-ink-muted">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section muted>
        <FadeIn>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="heading-section mb-3">{t('home.testimonials.title')}</h2>
              <p className="text-body">{t('home.testimonials.subtitle')}</p>
            </div>
            <LocalizedLink to="/reviews" className="link-accent shrink-0">
              {t('common.viewAllReviews')} <CaretRight size={16} weight={PUBLIC_ICON_WEIGHT} className="ml-1" />
            </LocalizedLink>
          </div>
        </FadeIn>
        <ReviewsCarousel reviews={testimonials} />
      </Section>

      {/* CTA */}
      <section className="band-dark">
        <div className="container-page section-padding text-center">
          <FadeIn>
            <h2 className="heading-on-dark mb-4 text-2xl md:text-3xl">
              {t('home.cta.title')}
            </h2>
            <p className="text-on-dark-muted mx-auto mb-8 max-w-2xl text-lg">
              {t('home.cta.subtitle')}
            </p>
            <LocalizedLink to="/contact" className="btn-primary">
              {t('home.cta.button')}
            </LocalizedLink>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
