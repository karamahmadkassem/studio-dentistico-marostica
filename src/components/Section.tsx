import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, className = '', id, muted = false }) => {
  return (
    <section
      id={id}
      className={`section-padding ${muted ? 'section-muted' : 'section-light'} ${className}`}
    >
      <div className="container-page">{children}</div>
    </section>
  );
};

export default Section;
