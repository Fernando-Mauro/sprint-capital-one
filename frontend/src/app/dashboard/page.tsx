'use client';

import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import MatchCard from '@/components/matches/MatchCard';
import SportFilters from '@/components/matches/SportFilters';
import { getMatches, getSports } from '@/services/matches';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Reta, Sport } from '@/types';

export default function DashboardPage() {
  const [retas, setRetas] = useState<Reta[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [loadingRetas, setLoadingRetas] = useState(true);
  const [loadingSports, setLoadingSports] = useState(true);
  const sportsLoaded = useRef(false);

  // Load sports only once
  useEffect(() => {
    if (sportsLoaded.current) return;
    sportsLoaded.current = true;

    const loadSports = async () => {
      const result = await getSports();
      if (result.data) setSports(result.data as Sport[]);
      setLoadingSports(false);
    };
    loadSports();
  }, []);

  // Load retas when sport filter changes
  const loadRetas = useCallback(async () => {
    setLoadingRetas(true);
    const result = await getMatches(
      activeSport ? { sport_id: activeSport, status: 'open' } : { status: 'open' },
    );
    if (result.data) setRetas(result.data);
    setLoadingRetas(false);
  }, [activeSport]);

  useEffect(() => {
    loadRetas();
  }, [loadRetas]);

  return (
    <div className="px-4 max-w-5xl mx-auto space-y-8 pt-4">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-container-low p-8 border-l-8 border-primary-container">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 grayscale">
          <Image
            alt="Sport"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop"
            fill
            sizes="50vw"
          />
        </div>
        <div className="relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-2 italic">
            PRÓXIMOS <br />
            <span className="text-primary-container">MATCHUPS</span>
          </h1>
          <p className="font-sans font-bold text-primary max-w-xs uppercase tracking-widest text-xs">
            Busca. Únete. Domina la cancha.
          </p>
        </div>
      </section>

      {/* Filters — always visible, show skeleton chips while loading */}
      {loadingSports ? (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-surface-container-high animate-pulse shrink-0" />
          ))}
        </div>
      ) : (
        <SportFilters sports={sports} activeSport={activeSport} onSelect={setActiveSport} />
      )}

      {/* Retas — skeleton while loading, empty state if no results */}
      {loadingRetas ? (
        <LoadingSkeleton />
      ) : retas.length === 0 ? (
        <EmptyState
          title={activeSport ? 'No hay matchups de este deporte' : 'No hay matchups disponibles'}
          description="Sé el primero en crear uno"
          actionLabel="Crear Matchup"
          actionHref="/dashboard/matches/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retas.map((reta) => (
            <MatchCard key={reta.id} reta={reta} />
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        href="/dashboard/matches/create"
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[0_10px_40px_rgba(0,253,134,0.4)] hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
      >
        <Plus className="w-10 h-10 font-bold" />
      </Link>
    </div>
  );
}
