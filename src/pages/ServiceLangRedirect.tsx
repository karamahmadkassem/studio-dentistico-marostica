import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { languageFromPath, serviceHref, serviceKeyFromSlug, servicesHubPath, stripLangPrefix } from '../i18n/paths';

const ServiceLangRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const to = languageFromPath(pathname);
  const from = stripLangPrefix(pathname).startsWith('/servizi') ? 'it' : 'en';
  const key = serviceKeyFromSlug(slug, from) ?? serviceKeyFromSlug(slug, to);
  return <Navigate to={key ? serviceHref(key, to) : servicesHubPath(to)} replace />;
};

export default ServiceLangRedirect;
