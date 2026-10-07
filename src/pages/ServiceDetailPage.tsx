import React, { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import { PUBLIC_ICON_WEIGHT } from '../components/ui/Icon';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, dentistSchema, faqSchema, graph, physicianSchema, serviceSchema, websiteSchema, withAggregateRating } from '../seo/schema';
import { getServiceLanding } from '../content/serviceLandings';
import { SERVICE_IMAGE_BY_SLUG } from '../config/servicesCatalog';
import { serviceHref, serviceKeyFromSlug } from '../i18n/paths';
import { LocalizedLink, useLocalizedPath } from '../i18n/LocalizedLink';
import ServiceIcon from '../components/ServiceIcon';
import { SERVICE_ICON_BY_SLUG } from '../config/servicesCatalog';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const localize = useLocalizedPath();
  const key = serviceKeyFromSlug(slug, language);
  const path = key ? serviceHref(key, language) : localize('/services');

  const landing = key ? getServiceLanding(key, language) : null;
  const title = key ? String(t(`services.services.${key}.title`)) : '';
  const description = key ? String(t(`services.services.${key}.description`)) : '';

  const jsonLd = useMemo(() => {
    if (!key || !landing) return undefined;
    return graph([
      withAggregateRating(dentistSchema(language)),
      physicianSchema(),
      websiteSchema(language),
      breadcrumbSchema([
        { name: String(t('nav.home')), path: language === 'en' ? '/en' : '/' },
        { name: String(t('nav.services')), path: localize('/services') },
        { name: title, path },
      ]),
      serviceSchema({ name: title, description: landing.summary, path, key }),
      faqSchema(landing.faqs),
    ]);
  }, [key, landing, language, localize, path, t, title]);

  if (!key || !landing) {
    return <Navigate to={localize('/services')} replace />;
  }

  const seoTitle =
    language === 'it'
      ? `${title} a Marostica`
      : `${title} in Marostica`;

  return (
    <div>
      <Seo title={seoTitle} description={landing.summary} path={path} jsonLd={jsonLd} />
      <Breadcrumbs
        items={[
          { label: String(t('nav.home')), to: '/' },
          { label: String(t('nav.services')), to: '/services' },
          { label: title },
        ]}
      />
      <PageHero title={title} subtitle={landing.summary} image={SERVICE_IMAGE_BY_SLUG[key]} />

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-brand-cyan/25 bg-brand-cyan/5">
                <ServiceIcon iconKey={SERVICE_ICON_BY_SLUG[key]} size={24} />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
                {language === 'it' ? 'Studio a Marostica (VI)' : 'Practice in Marostica (VI)'}
              </p>
            </div>
            {landing.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body mb-4">
                {paragraph}
              </p>
            ))}
            <p className="text-body">{landing.local}</p>
          </FadeIn>
          <aside className="space-y-4">
            <div className="rounded-md border border-ink-soft/20 bg-white p-5">
              <h2 className="mb-2 font-display text-lg font-semibold text-ink">
                {language === 'it' ? 'A chi è utile' : 'Who it is for'}
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">{landing.audience}</p>
            </div>
            <div className="rounded-md border border-ink-soft/20 bg-white p-5">
              <h2 className="mb-2 font-display text-lg font-semibold text-ink">
                {language === 'it' ? 'Tempi' : 'Duration'}
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">{landing.duration}</p>
            </div>
            <LocalizedLink to="/contact" className="btn-primary w-full justify-center">
              {t('common.bookAppointment')}
            </LocalizedLink>
          </aside>
        </div>
      </Section>

      <Section muted>
        <FadeIn>
          <h2 className="heading-section mb-6">{landing.stepsTitle}</h2>
          <ol className="space-y-3">
            {landing.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-ink-muted">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-sm font-semibold text-brand-cyan">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="heading-section mb-6">{language === 'it' ? 'Domande frequenti' : 'Frequently asked questions'}</h2>
          <div className="space-y-4">
            {landing.faqs.map((item) => (
              <details key={item.q} className="border border-ink-soft/20 bg-white px-5 py-4">
                <summary className="cursor-pointer font-semibold text-ink">{item.q}</summary>
                <p className="mt-3 text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Section muted>
        <FadeIn>
          <h2 className="heading-section mb-4">{language === 'it' ? 'Cosa include' : 'What it includes'}</h2>
          <ul className="space-y-2">
            {((t(`services.services.${key}.details`) as string[]) ?? []).map((detail) => (
              <li key={detail} className="flex items-start gap-2 text-ink-muted">
                <Check size={16} weight={PUBLIC_ICON_WEIGHT} className="icon-duotone-brand mt-1 shrink-0 text-brand-cyan" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          <LocalizedLink to="/services" className="link-accent mt-8 inline-flex">
            {t('common.allServices')}
          </LocalizedLink>
        </FadeIn>
      </Section>
    </div>
  );
};

export default ServiceDetailPage;
