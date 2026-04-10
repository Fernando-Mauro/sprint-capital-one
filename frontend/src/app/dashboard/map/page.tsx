'use client';

import SportFilters from '@/components/matches/SportFilters';
import { MAP_STYLE_URL, getUserLocation } from '@/lib/aws-location';
import { cn } from '@/lib/utils';
import { getMatches, getSports } from '@/services/matches';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import type { Reta, Sport } from '@/types';

// Color per sport name (lowercase)
const SPORT_COLORS: Record<string, string> = {
  futbol: '#00fd86',
  fútbol: '#00fd86',
  'fútbol 7': '#00fd86',
  basquetbol: '#ff9500',
  basketball: '#ff9500',
  basket: '#ff9500',
  voleibol: '#ffeb3b',
  volleyball: '#ffeb3b',
  voley: '#ffeb3b',
  tenis: '#7de6ff',
  tennis: '#7de6ff',
  padel: '#c792ea',
  pádel: '#c792ea',
  beisbol: '#ff716c',
  béisbol: '#ff716c',
  baseball: '#ff716c',
};

function getSportColor(name: string | undefined): string {
  if (!name) return '#a4ffb9';
  return SPORT_COLORS[name.toLowerCase()] ?? '#a4ffb9';
}

// Lucide icon SVG paths per sport — keeps visual consistency with rest of app
const SPORT_ICONS: Record<string, string> = {
  // Trophy (Fútbol)
  futbol:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  // Dumbbell (Basketball)
  basquetbol:
    '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  // Target (Tennis / Padel)
  tenis:
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  // Zap (Voleibol)
  voleibol:
    '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  // Flag (Béisbol / default sports)
  beisbol:
    '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  // Activity (Running)
  running: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
};

const SPORT_ICON_ALIASES: Record<string, string> = {
  futbol: 'futbol',
  fútbol: 'futbol',
  soccer: 'futbol',
  'fútbol 7': 'futbol',
  'futbol 7': 'futbol',
  basquetbol: 'basquetbol',
  basketball: 'basquetbol',
  basket: 'basquetbol',
  voleibol: 'voleibol',
  volleyball: 'voleibol',
  voley: 'voleibol',
  tenis: 'tenis',
  tennis: 'tenis',
  padel: 'tenis',
  pádel: 'tenis',
  beisbol: 'beisbol',
  béisbol: 'beisbol',
  baseball: 'beisbol',
  running: 'running',
  correr: 'running',
};

function getSportIconSvg(name: string | undefined): string {
  const key = name ? SPORT_ICON_ALIASES[name.toLowerCase()] : undefined;
  const paths = key ? SPORT_ICONS[key] : SPORT_ICONS.beisbol;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [retas, setRetas] = useState<Reta[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [selectedReta, setSelectedReta] = useState<Reta | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Load sports once
  useEffect(() => {
    getSports().then((result) => {
      if (result.data) setSports(result.data as Sport[]);
    });
  }, []);

  // Load retas based on filter
  const loadRetas = useCallback(async () => {
    const result = await getMatches(
      activeSport ? { sport_id: activeSport, status: 'open' } : { status: 'open' },
    );
    if (result.data) setRetas(result.data);
  }, [activeSport]);

  useEffect(() => {
    loadRetas();
  }, [loadRetas]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const init = async () => {
      const pos = await getUserLocation();

      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: MAP_STYLE_URL,
        center: pos,
        zoom: 12,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      // User location marker
      new maplibregl.Marker({ color: '#7de6ff' })
        .setLngLat(pos)
        .setPopup(new maplibregl.Popup().setText('Tú estás aquí'))
        .addTo(map);

      map.on('load', () => setMapReady(true));
      mapRef.current = map;
    };

    init();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Render markers when retas change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    retas.forEach((reta) => {
      if (!reta.latitude || !reta.longitude) return;

      // Create custom marker element (rotated diamond with counter-rotated icon inside)
      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.style.cssText = `
        width: 36px;
        height: 36px;
        background: ${getSportColor(reta.sports?.name)};
        border: 3px solid #0e0e0e;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0e0e0e;
        transform: rotate(45deg);
      `;
      const inner = document.createElement('span');
      inner.style.cssText =
        'transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;';
      inner.innerHTML = getSportIconSvg(reta.sports?.name);
      el.appendChild(inner);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedReta(reta);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([reta.longitude, reta.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [retas, mapReady]);

  return (
    <div className="fixed inset-x-0 top-16 bottom-20 overflow-hidden">
      {/* Map */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="bg-surface-container-high/90 backdrop-blur-xl border-l-8 border-primary-container p-4 pointer-events-auto">
          <h1 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none italic">
            CANCHAS <span className="text-primary-container">EN VIVO</span>
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
            {retas.length} matchups disponibles
          </p>
        </div>
      </div>

      {/* Sport filters overlay */}
      <div className="absolute top-28 left-4 right-4 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-surface-container-high/90 backdrop-blur-xl p-2">
          <SportFilters sports={sports} activeSport={activeSport} onSelect={setActiveSport} />
        </div>
      </div>

      {/* Selected reta popup */}
      {selectedReta && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-surface-container-high/95 backdrop-blur-xl border-l-8 border-primary-container p-6 relative">
            <button
              onClick={() => setSelectedReta(null)}
              className="absolute top-2 right-2 p-2 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between mb-3 pr-8">
              <div
                className="px-3 py-1 text-[10px] font-black uppercase italic text-on-primary-fixed"
                style={{ backgroundColor: getSportColor(selectedReta.sports?.name) }}
              >
                {selectedReta.sports?.name ?? 'Deporte'}
              </div>
            </div>

            <h3 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter mb-2">
              {selectedReta.title}
            </h3>

            <div className="space-y-1 text-on-surface-variant font-bold text-xs uppercase mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {selectedReta.date} — {selectedReta.start_time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {selectedReta.location_name}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {selectedReta.current_players}/{selectedReta.max_players} Jugadores
              </div>
            </div>

            <Link
              href={`/dashboard/matches/${selectedReta.id}`}
              className={cn(
                'block w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed',
                'font-headline font-black uppercase text-center py-3 cursor-pointer',
                'hover:opacity-90 active:scale-95 transition-all',
              )}
            >
              Ver Detalle
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
