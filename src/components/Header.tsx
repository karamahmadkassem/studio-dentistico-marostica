import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(() => location.pathname === '/');

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setOverHero(false);
      return;
    }

    let retryTimer: ReturnType<typeof setTimeout>;

    const update = () => {
      const hero = document.getElementById('home-hero');
      if (!hero) {
        retryTimer = setTimeout(update, 50);
        return;
      }

      const headerHeight =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
      const heroTopOffset = headerHeight * 0.2;
      setOverHero(hero.getBoundingClientRect().bottom > headerHeight + heroTopOffset);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      clearTimeout(retryTimer);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/about', label: t('nav.about') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-[#4AACE1]' : 'text-white/90 hover:text-[#4AACE1]'
    }`;

  return (
    <header
      className={`shell-header fixed inset-x-0 z-50${
        overHero && !isMenuOpen ? ' shell-header--over-hero' : ''
      }`}
    >
      <nav className="container-page" aria-label="Main">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={String(t('common.brand'))}>
            <img
              src="/logo.png"
              alt=""
              className="site-logo shrink-0"
            />
            <span className="brand-header min-w-0 leading-tight">
              Studio Dentistico{' '}
              <span className="accent">Marostica</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {String(item.label)}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#000340] transition-colors hover:bg-[#E8F6FC]"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span>{language === 'en' ? 'IT' : 'EN'}</span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="border-t border-white/15 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-3 text-base font-medium ${
                      isActive ? 'bg-white/10 text-[#4AACE1]' : 'text-white hover:bg-white/5'
                    }`
                  }
                >
                  {String(item.label)}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={toggleLanguage}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-[#000340]"
              >
                <Globe size={18} />
                {language === 'en' ? 'IT' : 'EN'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
