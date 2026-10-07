import React from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteRecord } from 'vite-react-ssg';
import PublicLayout from './layouts/PublicLayout';
import { englishBlogPaths, englishServicePaths, italianBlogPaths, italianServicePaths } from './lib/blogStatic';

const lazyPage = (loader: () => Promise<{ default: React.ComponentType }>) => async () => {
  const mod = await loader();
  return { Component: mod.default };
};

const publicChildren = (locale: 'it' | 'en'): RouteRecord[] => [
  {
    index: true,
    lazy: lazyPage(() => import('./pages/HomePage')),
  },
  {
    path: 'about',
    lazy: lazyPage(() => import('./pages/AboutPage')),
  },
  {
    path: locale === 'it' ? 'servizi' : 'services',
    lazy: lazyPage(() => import('./pages/ServicesPage')),
  },
  {
    path: locale === 'it' ? 'servizi/:slug' : 'services/:slug',
    lazy: lazyPage(() => import('./pages/ServiceDetailPage')),
    getStaticPaths: () => (locale === 'it' ? italianServicePaths() : englishServicePaths()),
  },
  ...(locale === 'it'
    ? [
        {
          path: 'services',
          element: <Navigate to="/servizi" replace />,
        } satisfies RouteRecord,
        {
          path: 'services/:slug',
          lazy: lazyPage(() => import('./pages/ServiceLangRedirect')),
        } satisfies RouteRecord,
      ]
    : [
        {
          path: 'servizi',
          element: <Navigate to="/en/services" replace />,
        } satisfies RouteRecord,
        {
          path: 'servizi/:slug',
          lazy: lazyPage(() => import('./pages/ServiceLangRedirect')),
        } satisfies RouteRecord,
      ]),
  {
    path: 'blog',
    lazy: lazyPage(() => import('./pages/BlogPage')),
  },
  {
    path: 'blog/:slug',
    lazy: lazyPage(() => import('./pages/BlogPostPage')),
    getStaticPaths: () => (locale === 'it' ? italianBlogPaths() : englishBlogPaths()),
  },
  {
    path: 'contact',
    lazy: lazyPage(() => import('./pages/ContactPage')),
  },
  {
    path: 'reviews',
    lazy: lazyPage(() => import('./pages/ReviewsPage')),
  },
  {
    path: 'reviews/submit',
    lazy: lazyPage(() => import('./pages/ReviewSubmitPage')),
  },
  {
    path: 'privacy',
    lazy: lazyPage(() => import('./pages/PrivacyPolicyPage')),
  },
  {
    path: 'terms',
    lazy: lazyPage(() => import('./pages/TermsPage')),
  },
  {
    path: '404',
    lazy: lazyPage(() => import('./pages/NotFoundPage')),
  },
  {
    path: '*',
    lazy: lazyPage(() => import('./pages/NotFoundPage')),
  },
];

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: publicChildren('it'),
  },
  {
    path: '/en',
    element: <PublicLayout />,
    children: publicChildren('en'),
  },
  {
    path: '/admin/*',
    lazy: lazyPage(() => import('./admin/AdminRoutes')),
  },
];

export default routes;
