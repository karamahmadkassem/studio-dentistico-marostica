import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LegalPageLayout from '../components/LegalPageLayout';
import { usePageTitle } from '../hooks/usePageTitle';

const TermsPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('legal.terms.pageTitle'));

  const sections = t('legal.terms.sections') as {
    title: string;
    paragraphs: string[];
  }[];

  return (
    <LegalPageLayout
      heroTitle={String(t('legal.terms.hero.title'))}
      heroSubtitle={String(t('legal.terms.hero.subtitle'))}
      updated={String(t('legal.terms.updated'))}
      sections={Array.isArray(sections) ? sections : []}
    />
  );
};

export default TermsPage;
