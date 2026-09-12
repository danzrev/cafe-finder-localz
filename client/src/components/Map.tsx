import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { cn } from '@/utils/cn';

export interface LatLng {
  lat: number;
  lng: number;
}

interface MapProps {
  center: LatLng | null;
  zoom?: number;
  markerTitle?: string;
  className?: string;
}

type GoogleMap = {
  setCenter: (pos: unknown) => void;
  setZoom: (zoom: number) => void;
  destroy?: () => void;
};

/**
 * A Google Maps embed rendered into a fixed-height box. Shows a single marker
 * at `center`. When no coordinates or no VITE_MAPS_API_KEY are configured, it
 * degrades to a friendly placeholder so the rest of the page still works.
 */
export function Map({ center, zoom = 15, markerTitle = 'Café', className }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const status = useGoogleMaps();

  const mapsReady = status === 'ready';

  // (Re)initialize the map when Maps loads or the center changes.
  useEffect(() => {
    if (!mapsReady || !center) return;
    const el = containerRef.current;
    if (!el) return;
    if (el.childNodes.length === 0) {
      // Build the marker + map only once, then update on subsequent renders.
      const gmaps = window.google!.maps!;
      const map = new gmaps.Map(el, {
        center,
        zoom,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
      }) as unknown as GoogleMap;
      new gmaps.Marker({ position: center, map });
      mapRef.current = map;
    } else {
      mapRef.current?.setCenter(center);
      mapRef.current?.setZoom(zoom);
    }
  }, [mapsReady, center?.lat, center?.lng, zoom]);

  // Tidy up when the component unmounts, if the map exposes a destroy.
  useEffect(() => {
    return () => {
      mapRef.current?.destroy?.();
      mapRef.current = null;
    };
  }, []);

  if (!center || status === 'unavailable' || !mapsReady) {
    return (
      <div
        className={cn(
          'flex h-56 w-full items-center justify-center rounded-dewdrop border border-espresso/10 bg-latte-light text-center',
          className
        )}
        role="img"
        aria-label={center ? 'Map preview unavailable' : 'No map location available'}
      >
        <div className="flex flex-col items-center gap-2 px-6 text-cocoa">
          <MapPin className="h-7 w-7 text-leaf" />
          <p className="text-sm">
            {!center
              ? 'Location not shared yet'
              : status === 'unavailable'
                ? 'Map is not configured — add VITE_MAPS_API_KEY to enable it.'
                : 'Loading map…'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('h-56 w-full overflow-hidden rounded-dewdrop', className)}
      aria-label={`Map showing ${markerTitle}`}
    />
  );
}