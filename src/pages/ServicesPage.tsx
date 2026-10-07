import React, { useEffect, useMemo, useState } from 'react';
import { LocalizedLink } from '../i18n/LocalizedLink';
import { Check } from '@phosphor-icons/react';
import { PUBLIC_ICON_WEIGHT } from '../components/ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import ServiceIcon from '../components/ServiceIcon';
import { fetchPublishedServices } from '../lib/api';
import { mergeDbAndTranslationServices } from '../lib/serviceDisplay';
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
import { useLocalizedPath } from '../i18n/LocalizedLink';

const ServicesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const localize = useLocalizedPath();
  const [dbServices, setDbServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchPublishedServices(language).then(setDbServices).catch(() => setDbServices([]));
  }, [language]);

  const services = useMemo(
    () => mergeDbAndTranslationServices(dbServices, language, t),
    [dbServices, language, t],
  );

  const approaches = [
    { key: 'diagnosis', num: '01' },
    { key: 'plan', num: '02' },
    { key: 'care', num: '03' },
  ] as const;

  return (
    <div>
      <Seo
        title={String(t('seo.services.title'))}
        description={String(t('seo.services.description'))}
        path={localize('/services')}
        jsonLd={graph([
          withAggregateRating(dentistSchema(language)),
          physicianSchema(),
          websiteSchema(language),
          breadcrumbSchema([
            { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
            { name: String(t('nav.services')), path: localize('/services') },
          ]),
        ])}
      />
      <PageHero title={t('services.hero.title')} subtitle={t('services.hero.subtitle')} />

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
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-brand-cyan/25 bg-brand-cyan/5">
                    <ServiceIcon iconKey={service.iconKey} size={22} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                    <LocalizedLink to={`/services/${service.slug}`} className="hover:text-brand-cyan">
                      {service.title}
                    </LocalizedLink>
                  </h3>
                </div>
                <p className="mb-5 leading-relaxed text-ink-muted">{service.description}</p>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-cyan">
                  {t('services.services.included')}
                </h4>
                <ul className="space-y-2">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-ink-muted">
                      <Check size={16} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand mt-1 shrink-0 text-brand-cyan" />
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
              <a href={`tel:${String(t('footer.mobileHref'))}`} className="btn-white">
                {t('services.cta.call')}
              </a>
              <LocalizedLink to="/contact" className="btn-primary">
                {t('services.cta.book')}
              </LocalizedLink>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
