import React, { useEffect, useMemo, useState } from 'react';
import { Award, BookOpen, Activity, ThumbsUp, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { fetchAboutSections } from '../lib/api';
import { usePageTitle } from '../hooks/usePageTitle';

const VALUE_ICONS: Record<string, React.ReactNode> = {
  excellence: <Award size={26} className="text-brand-cyan" />,
  integrity: <ThumbsUp size={26} className="text-brand-cyan" />,
  innovation: <BookOpen size={26} className="text-brand-cyan" />,
  empathy: <Activity size={26} className="text-brand-cyan" />,
};

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageTitle(t('nav.about'));
  const [sections, setSections] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => {
    fetchAboutSections()
      .then((data) => {
        const map: Record<string, Record<string, unknown>> = {};
        for (const row of data) map[row.section_key] = row.content as Record<string, unknown>;
        setSections(map);
      })
      .catch(() => setSections({}));
  }, []);

  const isIt = language === 'it';
  const lang = isIt ? 'it' : 'en';

  const mission = useMemo(() => {
    const m = sections.mission;
    return {
      title: (m?.[`title_${lang}`] as string) || String(t('about.mission.title')),
      p1: (m?.[`p1_${lang}`] as string) || String(t('about.mission.p1')),
      p2: (m?.[`p2_${lang}`] as string) || String(t('about.mission.p2')),
    };
  }, [sections.mission, lang, t]);

  const values = useMemo(() => {
    const items = sections.values?.items as
      | { key: string; title_it: string; title_en: string; desc_it: string; desc_en: string }[]
      | undefined;
    if (items?.length) {
      return items.map((item) => ({
        key: item.key,
        icon: VALUE_ICONS[item.key] ?? VALUE_ICONS.excellence,
        title: isIt ? item.title_it : item.title_en,
        description: isIt ? item.desc_it : item.desc_en,
      }));
    }
    return (['excellence', 'integrity', 'innovation', 'empathy'] as const).map((key) => ({
      key,
      icon: VALUE_ICONS[key],
      title: String(t(`about.values.${key}.title`)),
      description: String(t(`about.values.${key}.description`)),
    }));
  }, [sections.values, isIt, t]);

  const historyItems = useMemo(() => {
    const items = sections.history?.items as
      | {
          year?: string;
          year_it?: string;
          year_en?: string;
          title_it: string;
          title_en: string;
          text_it: string;
          text_en: string;
        }[]
      | undefined;
    if (items?.length) {
      return items.map((item) => {
        const legacyYear = item.year ?? '';
        return {
          year: isIt
            ? (item.year_it ?? legacyYear)
            : (item.year_en ?? (legacyYear === 'Oggi' ? 'Today' : legacyYear)),
          title: isIt ? item.title_it : item.title_en,
          text: isIt ? item.text_it : item.text_en,
        };
      });
    }
    return t('about.history.items') as { year: string; title: string; text: string }[];
  }, [sections.history, isIt, t]);

  const technology = useMemo(() => {
    const tech = sections.technology;
    if (tech) {
      const items = (isIt ? tech.items_it : tech.items_en) as string[] | undefined;
      return {
        title: (tech[`title_${lang}`] as string) || String(t('about.technology.title')),
        content: (tech[`content_${lang}`] as string) || String(t('about.technology.content')),
        items: items?.length ? items : (t('about.technology.items') as string[]),
      };
    }
    return {
      title: String(t('about.technology.title')),
      content: String(t('about.technology.content')),
      items: t('about.technology.items') as string[],
    };
  }, [sections.technology, isIt, lang, t]);

  return (
    <div>
      <PageHero
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        image="https://images.pexels.com/photos/6502300/pexels-photo-6502300.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <Section>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <h2 className="heading-section mb-5">{mission.title}</h2>
            <p className="text-body mb-4">{mission.p1}</p>
            <p className="text-body">{mission.p2}</p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={mission.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section muted>
        <FadeIn>
          <h2 className="heading-section mb-12">{t('about.values.title')}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <FadeIn key={value.key} delay={i * 0.06}>
              <div className="border-t border-brand-cyan/30 pt-5">
                <div className="mb-4">{value.icon}</div>
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">{value.title}</h3>
                <p className="text-ink-muted">{value.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="heading-section mb-12">{t('about.history.title')}</h2>
        </FadeIn>
        <div className="relative mx-auto max-w-3xl pl-2">
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-brand-cyan/30" />
          <ol className="space-y-10">
            {Array.isArray(historyItems) &&
              historyItems.map((item, i) => (
                <FadeIn key={`${item.year}-${i}`} delay={i * 0.05}>
                  <li className="relative grid grid-cols-[32px_1fr] gap-4">
                    <div className="relative z-10 flex justify-center pt-1">
                      <span className="h-3.5 w-3.5 rounded-full bg-brand-cyan ring-4 ring-white" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-brand-cyan">{item.year}</p>
                      <h3 className="mb-1 font-display text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="leading-relaxed text-ink-muted">{item.text}</p>
                    </div>
                  </li>
                </FadeIn>
              ))}
          </ol>
        </div>
      </Section>

      <Section muted>
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6627536/pexels-photo-6627536.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={technology.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="heading-section mb-5">{technology.title}</h2>
            <p className="text-body mb-6">{technology.content}</p>
            <ul className="space-y-3">
              {Array.isArray(technology.items) &&
                technology.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-ink-muted">
                    <Check size={18} className="mt-0.5 shrink-0 text-brand-cyan" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </FadeIn>
        </div>
      </Section>
    </div>
  );
};

export default AboutPage;
