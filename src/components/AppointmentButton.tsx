import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const actionMotion = {
  initial: { opacity: 0, scale: 0.5, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.5, y: 12 },
  transition: { duration: 0.22, ease: 'easeOut' as const },
};

const AppointmentButton: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const mobileHref = String(t('footer.mobileHref'));
  const phoneHref = String(t('footer.phoneHref'));
  const whatsappUrl = `https://wa.me/${mobileHref.replace(/\D/g, '')}`;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/contact') return null;

  const actions = [
    {
      id: 'call',
      render: (
        <a href={`tel:${phoneHref}`} className="contact-fab-action" aria-label={String(t('common.fabCall'))}>
          <Phone size={22} />
        </a>
      ),
    },
    {
      id: 'whatsapp',
      render: (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="contact-fab-action contact-fab-action--whatsapp"
          aria-label={String(t('common.fabWhatsApp'))}
        >
          <WhatsAppIcon size={24} />
        </a>
      ),
    },
    {
      id: 'book',
      render: (
        <Link
          to="/contact"
          className="contact-fab-action"
          aria-label={String(t('common.fabBook'))}
          onClick={() => setOpen(false)}
        >
          <Calendar size={22} />
        </Link>
      ),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="contact-fab fixed z-50 flex flex-col items-end gap-3"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <AnimatePresence>
        {open &&
          actions.map((action, index) => (
            <motion.div
              key={action.id}
              {...actionMotion}
              transition={{ ...actionMotion.transition, delay: index * 0.05 }}
            >
              {action.render}
            </motion.div>
          ))}
      </AnimatePresence>

      <button
        type="button"
        className={`contact-fab-main${open ? ' contact-fab-main--open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={String(t('common.contactUs'))}
      >
        <Phone size={22} className="shrink-0" aria-hidden />
        <span className="hidden font-semibold sm:inline">{t('common.contactUs')}</span>
      </button>
    </div>
  );
};

export default AppointmentButton;
