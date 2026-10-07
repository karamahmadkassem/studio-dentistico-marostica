type EventName =
  | 'phone_click'
  | 'whatsapp_click'
  | 'booking_submit'
  | 'directions_click'
  | 'google_review_click';

export function trackEvent(name: EventName, payload: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;

  const detail = { name, ...payload, path: window.location.pathname };
  window.dispatchEvent(new CustomEvent('sdm-analytics', { detail }));

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  const w = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (gaId && typeof w.gtag === 'function') {
    w.gtag('event', name, payload);
  } else if (w.dataLayer) {
    w.dataLayer.push({ event: name, ...payload });
  }
}

export function isAiReferrer(referrer = typeof document === 'undefined' ? '' : document.referrer): boolean {
  return /chatgpt\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai/i.test(
    referrer,
  );
}
