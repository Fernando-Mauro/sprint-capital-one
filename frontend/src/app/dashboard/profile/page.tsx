'use client';

import { cn } from '@/lib/utils';
import { getSportImage } from '@/lib/sport-images';
import { useAuth } from '@/hooks/use-auth';
import { getUserStats, getUserRetaHistory, getUserSports } from '@/services/users';
import { BadgeCheck, ChevronRight, LogOut, Trophy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ played: 0, organized: 0, noShows: 0 });
  const [sports, setSports] = useState<{ id: string; name: string; count: number }[]>([]);
  const [history, setHistory] = useState<
    {
      reta: string;
      sport: string;
      date: string;
      startTime: string;
      timeStatus: 'past' | 'live' | 'upcoming';
      retaStatus: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user?.id) return;
    const [userStats, retaHistory, userSports] = await Promise.all([
      getUserStats(user.id),
      getUserRetaHistory(user.id),
      getUserSports(user.id),
    ]);
    setStats(userStats);
    setSports(userSports);

    const today = new Date().toISOString().split('T')[0] ?? '';

    const formatted = (retaHistory ?? []).map((entry: Record<string, unknown>) => {
      const reta = entry.retas as Record<string, unknown> | null;
      const sport = reta?.sports as Record<string, unknown> | null;
      const date = (reta?.date as string) ?? '';
      const retaStatus = (reta?.status as string) ?? '';

      let timeStatus: 'past' | 'live' | 'upcoming';
      if (retaStatus === 'completed' || date < today) {
        timeStatus = 'past';
      } else if (retaStatus === 'in_progress' || date === today) {
        timeStatus = 'live';
      } else {
        timeStatus = 'upcoming';
      }

      return {
        reta: (reta?.title as string) ?? 'Matchup',
        sport: (sport?.name as string) ?? 'Deporte',
        date,
        startTime: (reta?.start_time as string) ?? '',
        timeStatus,
        retaStatus,
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
        <button
          onClick={signOut}
          className="hover:bg-surface-container transition-colors p-2 cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-6 h-6 text-error" />
        </button>
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
                Organizados
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

      {/* Mis Deportes */}
      <section className="space-y-4">
        <h2 className="font-headline font-black text-2xl uppercase tracking-tight flex items-center gap-2">
          <span className="w-2 h-8 bg-primary-container block" />
          Mis Deportes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface-container-low h-32 animate-pulse" />
            ))}
          </div>
        ) : sports.length === 0 ? (
          <div className="bg-surface-container-low p-8 text-center">
            <Trophy className="w-10 h-10 text-on-surface-variant mx-auto mb-3 opacity-30" />
            <p className="text-on-surface-variant font-bold text-sm uppercase">
              Únete a matchups para desbloquear tus deportes
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sports.map((sport) => (
              <div
                key={sport.id}
                className="bg-surface-container-low flex items-stretch h-32 group relative overflow-hidden"
              >
                {/* Sport background */}
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 grayscale">
                  <img
                    src={getSportImage(sport.name)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 bg-surface-container-high flex items-center justify-center relative z-10">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-headline font-black text-xl uppercase italic">
                      {sport.name}
                    </h3>
                    <span className="text-primary font-bold text-xs uppercase">
                      {sport.count} {sport.count === 1 ? 'matchup' : 'matchups'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${Math.min((sport.count / (stats.played || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            {history.map((item, idx) => {
              const statusLabel =
                item.timeStatus === 'live'
                  ? 'EN VIVO'
                  : item.timeStatus === 'upcoming'
                    ? 'PRÓXIMO'
                    : item.retaStatus === 'cancelled'
                      ? 'CANCELADO'
                      : 'JUGADO';

              const statusClass =
                item.timeStatus === 'live'
                  ? 'bg-primary text-on-primary animate-pulse'
                  : item.timeStatus === 'upcoming'
                    ? 'bg-tertiary text-on-tertiary'
                    : item.retaStatus === 'cancelled'
                      ? 'bg-error/20 text-error'
                      : 'bg-primary-container text-on-primary-fixed';

              return (
                <div
                  key={idx}
                  className={cn(
                    'bg-surface-container-low p-4 flex items-center gap-6 transition-all cursor-pointer group',
                    item.timeStatus === 'past' ? 'opacity-60 hover:opacity-100' : 'opacity-100',
                  )}
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
                    <p className="font-sans text-xs text-on-surface-variant">
                      {item.sport}
                      {item.startTime ? ` — ${item.startTime}` : ''}
                    </p>
                  </div>
                  <span
                    className={cn('text-[10px] font-black px-2 py-1 uppercase italic', statusClass)}
                  >
                    {statusLabel}
                  </span>
                  <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
