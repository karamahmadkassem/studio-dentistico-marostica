import React from 'react';
import PageHero from './PageHero';
import Section from './Section';
import FadeIn from './FadeIn';

interface LegalSection {
  title: string;
  paragraphs: string[];
}

interface LegalPageLayoutProps {
  heroTitle: string;
  heroSubtitle: string;
  updated: string;
  sections: LegalSection[];
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  heroTitle,
  heroSubtitle,
  updated,
  sections,
}) => {
  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} compact />

      <Section>
        <FadeIn>
          <p className="text-ink-muted mb-10 text-sm">{updated}</p>
          <div className="mx-auto max-w-3xl space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="heading-section mb-4 text-xl md:text-2xl">{section.title}</h2>
                <div className="space-y-4 text-ink-muted leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </FadeIn>
      </Section>
    </div>
  );
};

export default LegalPageLayout;
