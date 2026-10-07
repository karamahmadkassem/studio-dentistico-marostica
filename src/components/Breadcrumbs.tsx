import React from 'react';
import { LocalizedLink } from '../i18n/LocalizedLink';

export type Crumb = { label: string; to?: string };

const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav className="container-page pt-24 md:pt-28" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden>/</span>}
              {item.to && !last ? (
                <LocalizedLink to={item.to} className="hover:text-brand-cyan">
                  {item.label}
                </LocalizedLink>
              ) : (
                <span className={last ? 'text-ink-muted' : undefined} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
