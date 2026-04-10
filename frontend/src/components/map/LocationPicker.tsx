'use client';

import { MAP_STYLE_URL, getUserLocation, searchPlaces } from '@/lib/aws-location';
import maplibregl from 'maplibre-gl';
import { MapPin, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import type { PlaceSuggestion } from '@/lib/aws-location';

interface LocationPickerProps {
  value: string;
  onChange: (location: { name: string; latitude: number; longitude: number }) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      const pos = await getUserLocation();
      setUserPos(pos);

      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: MAP_STYLE_URL,
        center: pos,
        zoom: 13,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Allow clicking on map to pick a location
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setMarker([lng, lat]);
        onChange({
          name: query || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          latitude: lat,
          longitude: lng,
        });
      });

      mapRef.current = map;
    };

    initMap();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMarker = (coords: [number, number]) => {
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLngLat(coords);
    } else {
      markerRef.current = new maplibregl.Marker({ color: '#00fd86' })
        .setLngLat(coords)
        .addTo(mapRef.current);
    }
    mapRef.current.flyTo({ center: coords, zoom: 15 });
  };

  // Debounced search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleQueryChange = useCallback(
    (v: string) => {
      setQuery(v);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (v.length < 3) {
        setSuggestions([]);
        return;
      }
      searchTimeout.current = setTimeout(async () => {
        setSearching(true);
        const results = await searchPlaces(v, userPos ?? undefined);
        setSuggestions(results);
        setShowSuggestions(true);
        setSearching(false);
      }, 300);
    },
    [userPos],
  );

  const handleSelectSuggestion = (place: PlaceSuggestion) => {
    setQuery(place.label);
    setShowSuggestions(false);
    if (place.latitude && place.longitude) {
      setMarker([place.longitude, place.latitude]);
      onChange({ name: place.label, latitude: place.latitude, longitude: place.longitude });
    }
  };

  return (
    <div className="space-y-3">
      {/* Search input with suggestions */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant px-0 py-4 pl-12 text-lg font-bold uppercase placeholder:text-surface-container-highest focus:border-primary-container focus:outline-none"
            placeholder="BUSCAR UBICACIÓN..."
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            required
          />
          <MapPin className="absolute right-0 top-4 text-primary pointer-events-none w-5 h-5" />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high border-2 border-outline-variant z-50 max-h-60 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s.placeId}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="w-full text-left px-4 py-3 hover:bg-primary-container/10 transition-colors border-b border-outline-variant/50 cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-xs font-bold text-on-surface">{s.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {searching && (
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">
            Buscando...
          </p>
        )}
      </div>

      {/* Map */}
      <div className="h-64 md:h-80 border-2 border-outline-variant relative">
        <div ref={mapContainerRef} className="w-full h-full" />
        <p className="absolute bottom-2 left-2 bg-surface-container-high/80 backdrop-blur px-2 py-1 text-[10px] font-bold text-on-surface-variant uppercase pointer-events-none">
          Click en el mapa para ajustar
        </p>
      </div>
    </div>
  );
}
