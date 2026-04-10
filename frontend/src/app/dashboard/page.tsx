'use client';

import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import MatchCard from '@/components/matches/MatchCard';
import SportFilters from '@/components/matches/SportFilters';
import { getMatches, getSports } from '@/services/matches';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import type { Reta, Sport } from '@/types';

export default function DashboardPage() {
  const [retas, setRetas] = useState<Reta[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [retasResult, sportsResult] = await Promise.all([
      getMatches(activeSport ? { sport_id: activeSport, status: 'open' } : { status: 'open' }),
      getSports(),
    ]);
    if (retasResult.data) setRetas(retasResult.data);
    if (sportsResult.data) setSports(sportsResult.data as Sport[]);
    setLoading(false);
  }, [activeSport]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="px-4 max-w-5xl mx-auto space-y-8 pt-4">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-container-low p-8 border-l-8 border-primary-container">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 grayscale">
          <img
            alt="Sport"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop"
          />
        </div>
        <div className="relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-2 italic">
            PRÓXIMAS <br />
            <span className="text-primary-container">RETAS</span>
          </h1>
          <p className="font-sans font-bold text-primary max-w-xs uppercase tracking-widest text-xs">
            Busca. Únete. Domina la cancha.
          </p>
        </div>
      </section>

      <SportFilters sports={sports} activeSport={activeSport} onSelect={setActiveSport} />

      {loading ? (
        <LoadingSkeleton />
      ) : retas.length === 0 ? (
        <EmptyState
          title="No hay retas disponibles"
          description="Sé el primero en crear una"
          actionLabel="Crear Reta"
          actionHref="/dashboard/matches/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retas.map((reta) => (
            <MatchCard key={reta.id} reta={reta} />
          ))}
        </div>
      )}

      <Link
        href="/dashboard/matches/create"
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[0_10px_40px_rgba(0,253,134,0.4)] hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Plus className="w-10 h-10 font-bold" />
      </Link>
    </div>
  );
}
