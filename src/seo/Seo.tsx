import React from 'react';
import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';
import { CLINIC, absoluteUrl } from '../config/clinic';
import { useLanguage } from '../context/LanguageContext';
import { alternatePath, languageFromPath } from '../i18n/paths';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  image,
  noindex = false,
  jsonLd,
}) => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const canonicalPath = path ?? pathname;
  const canonical = absoluteUrl(canonicalPath === '/' ? '/' : canonicalPath);
  const itHref = absoluteUrl(alternatePath(canonicalPath, 'it'));
  const enHref = absoluteUrl(alternatePath(canonicalPath, 'en'));
  const ogLocale = language === 'it' ? 'it_IT' : 'en_GB';
  const ogImage = absoluteUrl(image || CLINIC.ogImage);
  const fullTitle = title.includes(CLINIC.name) ? title : `${title} | ${CLINIC.name}`;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const htmlLang = languageFromPath(canonicalPath) === 'en' ? 'en' : 'it';

  const graphs = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Head>
      <html lang={htmlLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="it" href={itHref} />
      <link rel="alternate" hrefLang="en" href={enHref} />
      <link rel="alternate" hrefLang="x-default" href={itHref} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={CLINIC.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={language === 'it' ? 'en_GB' : 'it_IT'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {graphs.map((node, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
    </Head>
  );
};

export default Seo;
