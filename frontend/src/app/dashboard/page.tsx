'use client';

import { cn } from '@/lib/utils';
import { getMatches, getSports } from '@/services/matches';
import { Calendar, MapPin, Plus, TrendingUp, Zap } from 'lucide-react';
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

      {/* Sport Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setActiveSport(null)}
          className={cn(
            'px-6 py-2 flex items-center gap-2 font-black italic uppercase transition-all whitespace-nowrap',
            !activeSport
              ? 'bg-primary-container text-on-primary-fixed scale-105'
              : 'bg-surface-container-high text-on-surface-variant hover:text-primary',
          )}
        >
          <Zap className="w-4 h-4" />
          Todos
        </button>
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setActiveSport(sport.id)}
            className={cn(
              'px-6 py-2 flex items-center gap-2 font-black italic uppercase transition-all whitespace-nowrap',
              activeSport === sport.id
                ? 'bg-primary-container text-on-primary-fixed scale-105'
                : 'bg-surface-container-high text-on-surface-variant hover:text-primary',
            )}
          >
            <Zap className="w-4 h-4" />
            {sport.name}
          </button>
        ))}
      </div>

      {/* Retas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-container-low p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : retas.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-headline font-black text-3xl uppercase text-on-surface-variant mb-4">
            No hay retas disponibles
          </p>
          <p className="text-on-surface-variant mb-8">Sé el primero en crear una</p>
          <Link
            href="/dashboard/matches/create"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary-fixed px-8 py-4 font-black uppercase"
          >
            <Plus className="w-5 h-5" /> Crear Reta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {retas.map((reta) => {
            const fillPercent = Math.round((reta.current_players / reta.max_players) * 100);
            const isAlmostFull = fillPercent >= 80;

            return (
              <Link
                key={reta.id}
                href={`/dashboard/matches/${reta.id}`}
                className="bg-surface-container-low p-6 flex flex-col justify-between border-l-8 border-primary-container hover:border-primary transition-colors group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary-container text-on-primary-fixed px-3 py-1 text-[10px] font-black uppercase italic">
                      {reta.sports?.name ?? 'Deporte'}
                    </div>
                    {reta.min_skill_level && (
                      <div className="flex items-center gap-1 text-primary-container">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">
                          Nivel: {reta.min_skill_level}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline font-black text-3xl uppercase tracking-tighter mb-1 group-hover:text-primary transition-colors">
                    {reta.title}
                  </h3>
                  <div className="space-y-1 mb-6 text-on-surface-variant font-bold text-xs uppercase">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {reta.date} — {reta.start_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {reta.location_name}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span
                      className={cn(
                        'text-xs font-black uppercase tracking-wider',
                        isAlmostFull ? 'text-error' : 'text-primary',
                      )}
                    >
                      {reta.current_players}/{reta.max_players} Jugadores
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest w-full">
                    <div
                      className={cn(
                        'h-full transition-all',
                        isAlmostFull
                          ? 'bg-error'
                          : 'bg-gradient-to-r from-primary to-primary-container',
                      )}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <Link
        href="/dashboard/matches/create"
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[0_10px_40px_rgba(0,253,134,0.4)] hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Plus className="w-10 h-10 font-bold" />
      </Link>
    </div>
  );
}
