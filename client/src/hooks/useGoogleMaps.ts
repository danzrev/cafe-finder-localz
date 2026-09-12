import { useEffect, useState } from 'react';

export type MapsStatus = 'loading' | 'ready' | 'unavailable';

/* Lightweight access to the global google.maps object without a types dep. */
interface GoogleMapsWindow {
  google?: {
    maps?: {
      Map: new (...args: any[]) => unknown;
      Marker: new (...args: any[]) => unknown;
    };
  };
  __cfMapsInit?: () => void;
}

declare global {
  interface Window extends GoogleMapsWindow {}
}

const KEY = import.meta.env.VITE_MAPS_API_KEY;
const BASE_URL = import.meta.env.VITE_MAPS_LIBRARY_URL || 'https://maps.googleapis.com/maps/api/js';

/**
 * Loads the Google Maps JavaScript API once and reports readiness.
 * Returns 'unavailable' when no VITE_MAPS_API_KEY is configured (app still works,
 * the map just shows a placeholder).
 */
export function useGoogleMaps(): MapsStatus {
  const [status, setStatus] = useState<MapsStatus>(() => {
    if (!KEY) return 'unavailable';
    if (typeof window !== 'undefined' && window.google?.maps) return 'ready';
    return 'loading';
  });

  useEffect(() => {
    if (status !== 'loading') return;

    // Already available (e.g. set by a previous mount).
    if (window.google?.maps) {
      setStatus('ready');
      return;
    }

    // The Maps bootstrap needs a global callback; install it before injecting.
    window.__cfMapsInit = () => setStatus('ready');

    const src = `${BASE_URL}?key=${KEY}&callback=__cfMapsInit&v=weekly&loading=async`;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existing) {
      // Script tag already present but not yet resolved — poll briefly.
      const check = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(check);
          setStatus('ready');
        }
      }, 200);
      return () => window.clearInterval(check);
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onerror = () => setStatus('unavailable');
    document.head.appendChild(script);

    return () => {
      delete window.__cfMapsInit;
    };
  }, [status]);

  return status;
}