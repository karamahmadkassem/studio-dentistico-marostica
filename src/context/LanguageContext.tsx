import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, getTranslation } from '../translations';
import { alternatePath, languageFromPath } from '../i18n/paths';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: <T = string>(key: string) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = languageFromPath(location.pathname);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (lang: Language) => {
      const next = alternatePath(`${location.pathname}${location.search}`, lang);
      if (next !== `${location.pathname}${location.search}`) {
        navigate(next);
      }
    },
    [location.pathname, location.search, navigate],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'it' : 'en');
  }, [language, setLanguage]);

  const t = useCallback(
    <T = string>(key: string): T => getTranslation(language, key) as T,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
