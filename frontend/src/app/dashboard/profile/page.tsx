'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { getUserStats, getUserRetaHistory } from '@/services/users';
import { BadgeCheck, ChevronRight, LogOut, PlusCircle, Settings, Trophy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ played: 0, organized: 0, noShows: 0 });
  const [history, setHistory] = useState<
    { reta: string; sport: string; date: string; result: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user?.id) return;
    const [userStats, retaHistory] = await Promise.all([
      getUserStats(user.id),
      getUserRetaHistory(user.id),
    ]);
    setStats(userStats);

    const formatted = (retaHistory ?? []).map((entry: Record<string, unknown>) => {
      const reta = entry.retas as Record<string, unknown> | null;
      const sport = reta?.sports as Record<string, unknown> | null;
      return {
        reta: (reta?.title as string) ?? 'Matchup',
        sport: (sport?.name as string) ?? 'Deporte',
        date: (reta?.date as string) ?? '',
        result:
          (entry.status as string) === 'confirmed' ? 'Jugada' : ((entry.status as string) ?? ''),
      };
    });
    setHistory(formatted);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse font-headline font-black text-2xl text-on-surface-variant">
          CARGANDO...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 space-y-10">
      {/* Hero Profile */}
      <section className="flex flex-col md:flex-row gap-8 items-center md:items-end">
        <div className="relative group">
          <div className="w-40 h-40 bg-surface-container-high overflow-hidden brutalist-shadow border-4 border-primary-container flex items-center justify-center">
            {user.avatar_url ? (
              <img className="w-full h-full object-cover" src={user.avatar_url} alt="Profile" />
            ) : (
              <span className="font-headline font-black text-6xl text-primary">
                {user.username?.charAt(0).toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          <div className="absolute -bottom-4 -right-4 bg-primary-container text-on-primary-fixed px-3 py-1 font-headline font-black italic text-xl">
            {user.skill_level?.toUpperCase() ?? 'NEW'}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-2">
            {user.username}
          </h1>
          <p className="text-on-surface-variant font-bold mb-4">{user.full_name}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-primary-container w-5 h-5 fill-current" />
              <span className="font-sans text-sm font-bold text-on-surface-variant uppercase">
                Jugador Verificado
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="hover:bg-surface-container transition-colors p-2">
            <Settings className="w-6 h-6 text-on-surface-variant" />
          </button>
          <button
            onClick={signOut}
            className="hover:bg-surface-container transition-colors p-2"
            title="Cerrar sesión"
          >
            <LogOut className="w-6 h-6 text-error" />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-8 bg-primary-container block" />
          Estadísticas
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-low p-8 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="bg-surface-container-low p-8 flex flex-col justify-between">
              <span className="font-sans font-bold text-on-surface-variant uppercase text-xs">
                Matchups Jugados
              </span>
              <span className="font-headline font-black text-6xl text-white">{stats.played}</span>
            </div>
            <div className="bg-primary-container p-8 flex flex-col justify-between">
              <span className="font-sans font-bold text-on-primary-fixed uppercase text-xs">
                Organizadas
              </span>
              <span className="font-headline font-black text-6xl text-on-primary-fixed">
                {stats.organized}
              </span>
            </div>
            <div className="bg-surface-container-low p-8 flex flex-col justify-between border-l border-surface-container-highest">
              <span className="font-sans font-bold text-error uppercase text-xs">No-Shows</span>
              <span className="font-headline font-black text-6xl text-white">
                {String(stats.noShows).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Sport placeholder */}
      <section className="space-y-4">
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-8 bg-primary-container block" />
          Mis Deportes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low flex items-stretch h-32 group cursor-pointer">
            <div className="w-24 bg-surface-container-high flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center">
              <h3 className="font-headline font-black text-xl uppercase italic">
                {user.skill_level ?? 'Sin nivel'}
              </h3>
              <p className="text-on-surface-variant text-xs font-bold uppercase">Nivel actual</p>
            </div>
          </div>
          <div className="bg-surface-container-highest border-2 border-dashed border-outline-variant flex items-center justify-center h-32 cursor-pointer hover:border-primary transition-colors group">
            <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8 mb-1" />
              <span className="font-sans font-bold text-xs uppercase">Agregar Deporte</span>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="space-y-4">
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-8 bg-primary-container block" />
          Mi Historial
        </h2>
        {history.length === 0 ? (
          <p className="text-on-surface-variant font-bold py-8">
            Aún no tienes historial de matchups
          </p>
        ) : (
          <div className="space-y-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="bg-surface-container-low p-4 flex items-center gap-6 opacity-60 hover:opacity-100 transition-all cursor-pointer group"
              >
                <div className="text-center min-w-[60px]">
                  <div className="font-headline font-black text-xl leading-none">
                    {item.date.split('-')[2] ?? '--'}
                  </div>
                  <div className="font-sans text-[10px] uppercase font-bold text-on-surface-variant">
                    {item.date.split('-')[1] ?? ''}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.reta}
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant">{item.sport}</p>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-black px-2 py-1 uppercase italic',
                    'bg-primary-container text-on-primary-fixed',
                  )}
                >
                  {item.result}
                </span>
                <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
