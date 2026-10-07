import React from 'react';
import { LocalizedLink } from '../i18n/LocalizedLink';
import { useLanguage } from '../context/LanguageContext';
import Seo from '../seo/Seo';
import Section from '../components/Section';

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const isIt = language === 'it';

  return (
    <div>
      <Seo
        title={isIt ? 'Pagina non trovata' : 'Page not found'}
        description={
          isIt
            ? 'La pagina richiesta non esiste. Torna allo Studio Dentistico Marostica.'
            : 'The requested page does not exist. Return to Studio Dentistico Marostica.'
        }
        noindex
      />
      <Section>
        <div className="mx-auto max-w-lg pt-16 text-center">
          <p className="mb-3 font-display text-6xl font-bold text-brand-cyan">404</p>
          <h1 className="heading-section mb-4">{isIt ? 'Pagina non trovata' : 'Page not found'}</h1>
          <p className="text-body mb-8">
            {isIt
              ? 'Il contenuto che cerchi non è disponibile o è stato spostato.'
              : 'The content you are looking for is unavailable or has moved.'}
          </p>
          <LocalizedLink to="/" className="btn-primary">
            {isIt ? 'Torna alla home' : 'Back to home'}
          </LocalizedLink>
        </div>
      </Section>
    </div>
  );
};

export default NotFoundPage;
