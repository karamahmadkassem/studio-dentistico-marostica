import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AppointmentButton: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  if (location.pathname === '/contact') return null;

  return (
    <div
      className="fixed z-50"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <Link
        to="/contact"
        className="flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:rounded-md sm:px-5"
        style={{ backgroundColor: 'var(--brand-cyan)' }}
        aria-label={t('common.bookAppointment')}
      >
        <Calendar size={20} />
        <span className="hidden font-semibold sm:inline">{t('common.bookAppointment')}</span>
      </Link>
    </div>
  );
};

export default AppointmentButton;
