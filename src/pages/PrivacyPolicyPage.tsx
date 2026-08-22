import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LegalPageLayout from '../components/LegalPageLayout';
import { usePageTitle } from '../hooks/usePageTitle';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('legal.privacy.pageTitle'));

  const sections = t('legal.privacy.sections') as {
    title: string;
    paragraphs: string[];
  }[];

  return (
    <LegalPageLayout
      heroTitle={String(t('legal.privacy.hero.title'))}
      heroSubtitle={String(t('legal.privacy.hero.subtitle'))}
      updated={String(t('legal.privacy.updated'))}
      sections={Array.isArray(sections) ? sections : []}
    />
  );
};

export default PrivacyPolicyPage;
