import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'sdm-analytics-consent';

function loadGa(measurementId: string) {
  if (document.getElementById('sdm-ga')) return;
  const script = document.createElement('script');
  script.id = 'sdm-ga';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = (...args: unknown[]) => {
    w.dataLayer?.push(args);
  };
  w.gtag('js', new Date());
  w.gtag('config', measurementId, { anonymize_ip: true });
}

const ConsentBanner: React.FC = () => {
  const { t } = useLanguage();
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'granted' && gaId) loadGa(gaId);
    if (!stored && gaId) setVisible(true);

    if (document.referrer.match(/chatgpt\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai/i)) {
      window.dispatchEvent(
        new CustomEvent('sdm-analytics', { detail: { name: 'ai_referrer', referrer: document.referrer } }),
      );
    }
  }, [gaId]);

  if (!visible || !gaId) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-ink-soft/20 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="container-page flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink-muted">{t('common.consent.message')}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-ink-soft px-3 py-2 text-sm"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, 'denied');
              setVisible(false);
            }}
          >
            {t('common.consent.decline')}
          </button>
          <button
            type="button"
            className="btn-primary text-sm"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, 'granted');
              loadGa(gaId);
              setVisible(false);
            }}
          >
            {t('common.consent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
