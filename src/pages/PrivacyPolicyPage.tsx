import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LegalPageLayout from '../components/LegalPageLayout';
import Seo from '../seo/Seo';
import { breadcrumbSchema, dentistSchema, graph, websiteSchema } from '../seo/schema';
import { useLocalizedPath } from '../i18n/LocalizedLink';

const PrivacyPolicyPage: React.FC = () => {
  const { t, language } = useLanguage();
  const localize = useLocalizedPath();
  const path = localize('/privacy');
  const sections = t('legal.privacy.sections') as {
    title: string;
    paragraphs: string[];
  }[];

  return (
    <>
      <Seo
        title={String(t('seo.privacy.title'))}
        description={String(t('seo.privacy.description'))}
        path={path}
        jsonLd={graph([
          dentistSchema(language),
          websiteSchema(language),
          breadcrumbSchema([
            { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
            { name: String(t('legal.privacy.pageTitle')), path },
          ]),
        ])}
      />
      <LegalPageLayout
        heroTitle={String(t('legal.privacy.hero.title'))}
        heroSubtitle={String(t('legal.privacy.hero.subtitle'))}
        updated={String(t('legal.privacy.updated'))}
        sections={Array.isArray(sections) ? sections : []}
      />
    </>
  );
};

export default PrivacyPolicyPage;
