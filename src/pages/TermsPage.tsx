import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LegalPageLayout from '../components/LegalPageLayout';
import Seo from '../seo/Seo';
import { breadcrumbSchema, dentistSchema, graph, websiteSchema } from '../seo/schema';
import { useLocalizedPath } from '../i18n/LocalizedLink';

const TermsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const localize = useLocalizedPath();
  const path = localize('/terms');
  const sections = t('legal.terms.sections') as {
    title: string;
    paragraphs: string[];
  }[];

  return (
    <>
      <Seo
        title={String(t('seo.terms.title'))}
        description={String(t('seo.terms.description'))}
        path={path}
        jsonLd={graph([
          dentistSchema(language),
          websiteSchema(language),
          breadcrumbSchema([
            { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
            { name: String(t('legal.terms.pageTitle')), path },
          ]),
        ])}
      />
      <LegalPageLayout
        heroTitle={String(t('legal.terms.hero.title'))}
        heroSubtitle={String(t('legal.terms.hero.subtitle'))}
        updated={String(t('legal.terms.updated'))}
        sections={Array.isArray(sections) ? sections : []}
      />
    </>
  );
};

export default TermsPage;
