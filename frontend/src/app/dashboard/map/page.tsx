'use client';

import SportFilters from '@/components/matches/SportFilters';
import { MAP_STYLE_URL, getUserLocation } from '@/lib/aws-location';
import { cn } from '@/lib/utils';
import { getMatches, getSports } from '@/services/matches';
import {
  IconBallBasketball,
  IconBallBaseball,
  IconBallFootball,
  IconBallTennis,
  IconBallVolleyball,
  IconBike,
  IconFlag,
  IconGolf,
  IconRun,
  IconSwimming,
} from '@tabler/icons-react';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

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

// Tabler Icons per sport — monochrome line style matches brutalist design
type SportIcon = typeof IconBallFootball;

const SPORT_ICON_COMPONENTS: Record<string, SportIcon> = {
  futbol: IconBallFootball,
  fútbol: IconBallFootball,
  soccer: IconBallFootball,
  'fútbol 7': IconBallFootball,
  'futbol 7': IconBallFootball,
  basquetbol: IconBallBasketball,
  basketball: IconBallBasketball,
  basket: IconBallBasketball,
  voleibol: IconBallVolleyball,
  volleyball: IconBallVolleyball,
  voley: IconBallVolleyball,
  tenis: IconBallTennis,
  tennis: IconBallTennis,
  padel: IconBallTennis,
  pádel: IconBallTennis,
  beisbol: IconBallBaseball,
  béisbol: IconBallBaseball,
  baseball: IconBallBaseball,
  running: IconRun,
  correr: IconRun,
  golf: IconGolf,
  natacion: IconSwimming,
  natación: IconSwimming,
  swimming: IconSwimming,
  ciclismo: IconBike,
  cycling: IconBike,
};

function getSportIconSvg(name: string | undefined): string {
  const Icon = ((name && SPORT_ICON_COMPONENTS[name.toLowerCase()]) ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IconFlag) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToStaticMarkup(<Icon size={22} stroke={2.5} /> as any);
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
