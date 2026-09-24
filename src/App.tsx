import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewSubmitPage from './pages/ReviewSubmitPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AppointmentButton from './components/AppointmentButton';
import HeroBootGate from './components/HeroBootGate';
import ScrollToTop from './components/ScrollToTop';
import AdminRoutes from './admin/AdminRoutes';

// Opacity-only transitions: transforms on ancestors break sticky + scroll-linked hero.
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const AnimatedPublicRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        transition={{ duration: 0.28 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/submit" element={<ReviewSubmitPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const PublicShell = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-grow pb-20 sm:pb-8">
      <AnimatedPublicRoutes />
    </main>
    <AppointmentButton />
    <Footer />
  </div>
);

const AppRouter: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    );
  }

  return (
    <HeroBootGate>
      <PublicShell />
    </HeroBootGate>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <AppRouter />
      </Router>
    </LanguageProvider>
  );
};

export default App;
