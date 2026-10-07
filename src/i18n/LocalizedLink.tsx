import React from 'react';
import { Link, NavLink, type LinkProps, type NavLinkProps } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { localizePath } from './paths';

type Props = LinkProps & { children?: React.ReactNode };

export const LocalizedLink: React.FC<Props> = ({ to, ...rest }) => {
  const { language } = useLanguage();
  const href = typeof to === 'string' ? localizePath(to, language) : to;
  return <Link to={href} {...rest} />;
};

export const LocalizedNavLink: React.FC<NavLinkProps> = ({ to, ...rest }) => {
  const { language } = useLanguage();
  const href = typeof to === 'string' ? localizePath(to, language) : to;
  return <NavLink to={href} {...rest} />;
};

export function useLocalizedPath() {
  const { language } = useLanguage();
  return (path: string) => localizePath(path, language);
}
