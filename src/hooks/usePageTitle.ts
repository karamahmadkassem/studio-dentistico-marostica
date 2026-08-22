import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function usePageTitle(titleKeyOrText: string, isKey = false) {
  const { t, language } = useLanguage();

  useEffect(() => {
    const pageTitle = isKey ? String(t(titleKeyOrText)) : titleKeyOrText;
    document.title = `${pageTitle} | Studio Dentistico Marostica`;
  }, [titleKeyOrText, isKey, t, language]);
}
