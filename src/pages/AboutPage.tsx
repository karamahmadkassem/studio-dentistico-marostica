import React from 'react';
import { Check } from '@phosphor-icons/react';
import { PUBLIC_ICON_WEIGHT } from '../components/ui/Icon';
import { ASSETS } from '../config/assets';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
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

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const localize = useLocalizedPath();
  const credentials = t('about.doctor.credentials') as string[];

  const trainingItems = t('about.doctor.trainingItems') as string[];

  return (
    <div>
      <Seo
        title={String(t('seo.about.title'))}
        description={String(t('seo.about.description'))}
        path={localize('/about')}
        jsonLd={graph([
          withAggregateRating(dentistSchema(language)),
          physicianSchema(),
          websiteSchema(language),
          breadcrumbSchema([
            { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
            { name: String(t('nav.about')), path: localize('/about') },
          ]),
        ])}
      />
      <PageHero
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        image={ASSETS.about.hero}
      />

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <h2 className="heading-section mb-2">{t('about.doctor.name')}</h2>
            <p className="mb-6 font-display text-lg font-medium text-brand-cyan">
              {t('about.doctor.role')}
            </p>
            <p className="text-body mb-4">{t('about.doctor.intro')}</p>
            <p className="text-body">{t('about.doctor.experience')}</p>
            <h3 className="mb-3 mt-8 font-display text-lg font-semibold text-ink">
              {t('about.doctor.credentialsTitle')}
            </h3>
            <ul className="space-y-2">
              {Array.isArray(credentials) &&
                credentials.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-ink-muted">
                    <Check size={18} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand mt-0.5 shrink-0 text-brand-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </FadeIn>
      </Section>

      <Section muted>
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <h2 className="heading-section mb-6">{t('about.doctor.trainingTitle')}</h2>
            <ul className="space-y-3">
              {Array.isArray(trainingItems) &&
                trainingItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-ink-muted">
                    <Check size={18} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand mt-0.5 shrink-0 text-brand-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <p className="text-body mb-8">{t('about.doctor.approach')}</p>
            <h3 className="mb-2 font-display text-lg font-semibold text-ink">
              {t('about.doctor.languagesTitle')}
            </h3>
            <p className="text-ink-muted">{t('about.doctor.languages')}</p>
          </div>
        </FadeIn>
      </Section>

      <Section muted>
        <FadeIn>
          <h2 className="heading-section mb-10 text-center">{t('about.team.title')}</h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-6 h-56 w-56 overflow-hidden rounded-full ring-4 ring-brand-cyan/25">
              <img
                src={ASSETS.team.drMoustaphaMortada}
                alt={
                  language === 'it'
                    ? 'Dr. Mourtada, odontoiatra dello Studio Dentistico Marostica'
                    : 'Dr. Mourtada, dentist at Studio Dentistico Marostica'
                }
                className="h-full w-full object-cover"
                width={224}
                height={224}
                loading="lazy"
              />
            </div>
            <h3 className="mb-1 font-display text-xl font-semibold text-ink">
              {t('about.doctor.name')}
            </h3>
            <p className="text-ink-muted">{t('about.doctor.role')}</p>
            <p className="mt-4 text-sm text-ink-soft">{t('about.doctor.reviewedBy')}</p>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
};

export default AboutPage;
