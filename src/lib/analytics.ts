// Wrapper tipado sobre gtag. GoogleAnalytics.astro inicializa window.dataLayer/gtag en
// el <head>; este módulo es lo que se importa desde cualquier otro componente para
// registrar eventos, sin repetir en cada sitio la comprobación de que gtag existe.
//
// Uso desde un <script> de un componente .astro:
//   import { trackEvent } from '../lib/analytics';
//   trackEvent('cv_download', { source: 'hero' });

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
