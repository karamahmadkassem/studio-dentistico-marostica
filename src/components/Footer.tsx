import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useOpeningHours } from '../hooks/useOpeningHours';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { lines: openingHoursLines } = useOpeningHours();
  const year = new Date().getFullYear();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="shell-footer">
      <div className="container-page pt-14 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img src="/logo.png" alt="Studio Dentistico Marostica" className="site-logo" />
            </div>
            <p className="brand-footer mb-3 text-sm md:text-base">
              Studio Dentistico <span className="accent">Marostica</span>
            </p>
            <p className="mb-5 max-w-sm text-on-dark-muted font-sans normal-case tracking-normal">
              {String(t('footer.tagline'))}
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-[#4AACE1]"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-[#4AACE1]"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-[#4AACE1]">
              {String(t('common.menu'))}
            </h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/80 transition-colors hover:text-[#4AACE1]"
                  >
                    {String(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-[#4AACE1]">
              {String(t('footer.contacts'))}
            </h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#4AACE1]" />
                <span>{String(t('footer.address'))}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[#4AACE1]" />
                <a href={`tel:${String(t('footer.phoneHref'))}`} className="hover:text-[#4AACE1]">
                  {String(t('footer.phone'))}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-[#4AACE1]" />
                <a
                  href="mailto:info@studiodentisticomarostica.it"
                  className="break-all hover:text-[#4AACE1]"
                >
                  {String(t('footer.email'))}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-[#4AACE1]" />
                <div>
                  {openingHoursLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm text-white/55 md:flex-row">
          <p>
            © {year} Studio Dentistico Marostica. {String(t('footer.rights'))}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#4AACE1]">
              {String(t('common.privacy'))}
            </Link>
            <Link to="/terms" className="hover:text-[#4AACE1]">
              {String(t('common.terms'))}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
