import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentButton from '../components/AppointmentButton';
import HeroBootGate from '../components/HeroBootGate';
import ScrollToTop from '../components/ScrollToTop';
import { LanguageProvider } from '../context/LanguageContext';
import ConsentBanner from '../components/ConsentBanner';

const PublicLayout: React.FC = () => (
  <LanguageProvider>
    <ScrollToTop />
    <HeroBootGate>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow pb-20 sm:pb-8">
          <Suspense fallback={<div className="container-page py-24 text-ink-muted">…</div>}>
            <Outlet />
          </Suspense>
        </main>
        <AppointmentButton />
        <Footer />
        <ConsentBanner />
      </div>
    </HeroBootGate>
  </LanguageProvider>
);

export default PublicLayout;
