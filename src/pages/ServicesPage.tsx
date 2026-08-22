import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import ServiceIcon from '../components/ServiceIcon';
import { fetchPublishedServices } from '../lib/api';
import { CONTACT_SERVICE_KEYS } from '../config/contactServices';
import type { Service } from '../types/database';
import { usePageTitle } from '../hooks/usePageTitle';

const ServicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(t('nav.services'));
  const [dbServices, setDbServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchPublishedServices(language).then(setDbServices).catch(() => setDbServices([]));
  }, [language]);

  const services = useMemo(() => {
    if (dbServices.length > 0) {
      const isIt = language === 'it';
      return dbServices.map((s) => ({
        id: s.id,
        iconKey: s.icon_key,
        title: isIt ? s.title_it : s.title_en,
        description: isIt ? s.description_it : s.description_en,
        details: isIt ? s.details_it : s.details_en,
      }));
    }
    return CONTACT_SERVICE_KEYS.map((key) => ({
      id: key,
      iconKey: key === 'general' ? 'smile' : key === 'implants' ? 'activity' : key === 'aesthetics' ? 'heart' : key === 'prosthetics' ? 'layers' : key === 'periodontics' ? 'leaf' : key === 'pediatric' ? 'baby' : 'scissors',
      title: String(t(`services.services.${key}.title`)),
      description: String(t(`services.services.${key}.description`)),
      details: t(`services.services.${key}.details`) as string[],
    }));
  }, [dbServices, language, t]);

  const approaches = [
    { key: 'diagnosis', num: '01' },
    { key: 'plan', num: '02' },
    { key: 'care', num: '03' },
  ] as const;

  return (
    <div>
      <PageHero
        title={t('services.hero.title')}
        subtitle={t('services.hero.subtitle')}
        image="https://images.pexels.com/photos/3845736/pexels-photo-3845736.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <Section>
        <FadeIn>
          <div className="max-w-3xl">
            <h2 className="heading-section mb-4">{t('services.intro.title')}</h2>
            <p className="text-body">{t('services.intro.content')}</p>
          </div>
        </FadeIn>
      </Section>

      <Section muted>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={(i % 2) * 0.05}>
              <article className="border-t border-brand-cyan/25 pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <ServiceIcon iconKey={service.iconKey} />
                  <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                    {service.title}
                  </h3>
                </div>
                <p className="mb-5 leading-relaxed text-ink-muted">{service.description}</p>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-cyan">
                  {t('services.services.included')}
                </h4>
                <ul className="space-y-2">
                  {Array.isArray(service.details) &&
                    service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-ink-muted">
                        <Check size={16} className="mt-1 shrink-0 text-brand-cyan" />
                        <span>{detail}</span>
                      </li>
                    ))}
                </ul>
              </article>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="heading-section mb-12">{t('services.approach.title')}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {approaches.map((item, i) => (
            <FadeIn key={item.key} delay={i * 0.08}>
              <div>
                <span className="mb-3 block font-display text-4xl font-bold text-brand-cyan/40">
                  {item.num}
                </span>
                <h3 className="mb-3 font-display text-xl font-semibold text-ink">
                  {t(`services.approach.${item.key}.title`)}
                </h3>
                <p className="leading-relaxed text-ink-muted">
                  {t(`services.approach.${item.key}.description`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <section className="band-dark">
        <div className="container-page section-padding text-center">
          <FadeIn>
            <h2 className="heading-on-dark mb-4 text-2xl md:text-3xl">
              {t('services.cta.title')}
            </h2>
            <p className="text-on-dark-muted mx-auto mb-8 max-w-2xl text-lg">
              {t('services.cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`tel:${String(t('footer.phoneHref'))}`} className="btn-white">
                {t('services.cta.call')}
              </a>
              <Link to="/contact" className="btn-primary">
                {t('services.cta.book')}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
