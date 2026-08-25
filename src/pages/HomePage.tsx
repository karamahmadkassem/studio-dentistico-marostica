import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  CalendarCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import ReviewsCarousel from '../components/ReviewsCarousel';
import ServiceIcon from '../components/ServiceIcon';
import { fetchPublishedReviews, fetchPublishedServices } from '../lib/api';
import { SERVICE_IMAGES, STATIC_REVIEWS } from '../config/staticFallback';
import type { Service } from '../types/database';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(t('nav.home'));
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

  const services = useMemo(() => {
    const isIt = language === 'it';
    if (dbServices.length > 0) {
      return dbServices.slice(0, 4).map((s, i) => ({
        iconKey: s.icon_key,
        title: isIt ? s.title_it : s.title_en,
        description: isIt ? s.description_it : s.description_en,
        image: SERVICE_IMAGES[i % SERVICE_IMAGES.length],
      }));
    }
    return [
      {
        iconKey: 'smile',
        title: t('home.services.general.title'),
        description: t('home.services.general.description'),
        image: SERVICE_IMAGES[0],
      },
      {
        iconKey: 'activity',
        title: t('home.services.implants.title'),
        description: t('home.services.implants.description'),
        image: SERVICE_IMAGES[1],
      },
      {
        iconKey: 'heart',
        title: t('home.services.aesthetics.title'),
        description: t('home.services.aesthetics.description'),
        image: SERVICE_IMAGES[2],
      },
    ];
  }, [dbServices, language, t]);

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
      icon: <CalendarCheck size={28} className="text-brand-cyan" />,
      title: t('home.features.flexible.title'),
      description: t('home.features.flexible.description'),
    },
    {
      icon: <Sparkles size={28} className="text-brand-cyan" />,
      title: t('home.features.technology.title'),
      description: t('home.features.technology.description'),
    },
    {
      icon: <Users size={28} className="text-brand-cyan" />,
      title: t('home.features.team.title'),
      description: t('home.features.team.description'),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        id="home-hero"
        className="relative flex min-h-[100svh] items-end overflow-hidden md:items-center"
        style={{ backgroundColor: 'var(--brand-deep)', color: '#ffffff' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(3,13,29,0.96) 0%, rgba(0,3,64,0.88) 42%, rgba(3,13,29,0.45) 70%, rgba(3,13,29,0.25) 100%)',
          }}
          aria-hidden
        />

        <div className="container-page relative z-10 w-full pb-20 pt-28 md:pb-28 md:pt-32">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="brand-title mb-5 text-3xl md:text-5xl">
              Studio Dentistico <span className="accent">Marostica</span>
            </h1>
            <p className="mb-3 font-display text-xl font-semibold text-white md:text-2xl">
              {t('home.hero.title')}
            </p>
            <p className="text-on-dark mb-8 max-w-xl text-base md:text-lg">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary">
                {t('home.hero.cta')} <ChevronRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border-2 border-white/80 bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[#000340]"
              >
                {t('home.hero.secondary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={t('home.about.title')}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="heading-section mb-5">{t('home.about.title')}</h2>
            <p className="text-body mb-8">{t('home.about.content')}</p>
            <Link to="/about" className="btn-primary">
              {t('home.about.more')}
            </Link>
          </FadeIn>
        </div>
      </Section>

      {/* Services */}
      <Section muted>
        <FadeIn>
          <div className="mb-12 max-w-2xl">
            <h2 className="heading-section mb-3">{t('home.services.title')}</h2>
            <p className="text-body">{t('home.services.subtitle')}</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={i * 0.06}>
              <article>
                <div className="mb-4 aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mb-3">
                  <ServiceIcon iconKey={service.iconKey} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
                <Link to="/services" className="link-accent text-sm">
                  {t('home.services.cta')} <ChevronRight size={14} className="ml-1" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
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
            <Link to="/reviews" className="link-accent shrink-0">
              {t('common.viewAllReviews')} <ChevronRight size={16} className="ml-1" />
            </Link>
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
            <Link to="/contact" className="btn-primary">
              {t('home.cta.button')}
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
