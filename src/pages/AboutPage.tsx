import React from 'react';
import { Check } from 'lucide-react';
import { ASSETS } from '../config/assets';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { usePageTitle } from '../hooks/usePageTitle';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.about'));

  const trainingItems = t('about.doctor.trainingItems') as string[];

  return (
    <div>
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
                    <Check size={18} className="mt-0.5 shrink-0 text-brand-cyan" />
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
                alt={String(t('about.team.imageAlt'))}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="mb-1 font-display text-xl font-semibold text-ink">
              {t('about.doctor.name')}
            </h3>
            <p className="text-ink-muted">{t('about.doctor.role')}</p>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
};

export default AboutPage;
