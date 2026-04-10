'use client';

import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import MatchCard from '@/components/matches/MatchCard';
import { useAuth } from '@/hooks/use-auth';
import { getMyMatchups } from '@/services/matches';
import { cn } from '@/lib/utils';
import { ArrowDownAZ, Calendar, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Reta } from '@/types';

type SortOption = 'date' | 'players' | 'skill';

const SORT_OPTIONS: { id: SortOption; label: string; icon: typeof Calendar }[] = [
  { id: 'date', label: 'Fecha', icon: Calendar },
  { id: 'players', label: 'Jugadores', icon: Users },
  { id: 'skill', label: 'Nivel', icon: TrendingUp },
];

const SKILL_ORDER: Record<string, number> = {
  novato: 1,
  principiante: 1,
  inter: 2,
  intermedio: 2,
  pro: 3,
  avanzado: 3,
};

function getSkillRank(level: string | null): number {
  if (!level) return 0;
  return SKILL_ORDER[level.toLowerCase()] ?? 0;
}

export default function MatchupsPage() {
  const { user } = useAuth();
  const [retas, setRetas] = useState<Reta[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const loadMatchups = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const result = await getMyMatchups(user.id);
    if (result.data) setRetas(result.data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadMatchups();
  }, [loadMatchups]);

  const sortedRetas = useMemo(() => {
    const copy = [...retas];
    switch (sortBy) {
      case 'date':
        return copy.sort((a, b) => {
          const dateA = `${a.date}T${a.start_time}`;
          const dateB = `${b.date}T${b.start_time}`;
          return dateA.localeCompare(dateB);
        });
      case 'players':
        return copy.sort((a, b) => b.current_players - a.current_players);
      case 'skill':
        return copy.sort(
          (a, b) => getSkillRank(b.min_skill_level) - getSkillRank(a.min_skill_level),
        );
      default:
        return copy;
    }
  }, [retas, sortBy]);

  return (
    <div className="px-4 max-w-5xl mx-auto space-y-8 pt-4">
      {/* Header */}
      <section className="relative overflow-hidden bg-surface-container-low p-8 border-l-8 border-tertiary">
        <div className="relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-2 italic">
            MIS <br />
            <span className="text-tertiary">MATCHUPS</span>
          </h1>
          <p className="font-sans font-bold text-tertiary max-w-xs uppercase tracking-widest text-xs">
            Tus retas confirmadas.
          </p>
        </div>
      </section>

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <ArrowDownAZ className="w-4 h-4" />
          <span className="font-headline text-xs font-black uppercase tracking-widest">
            Ordenar:
          </span>
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={cn(
                  'px-4 py-2 flex items-center gap-2 font-black uppercase text-xs transition-all cursor-pointer',
                  sortBy === option.id
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-primary',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : sortedRetas.length === 0 ? (
        <EmptyState
          title="No te has unido a ninguna reta"
          description="Explora retas disponibles y únete a la cancha"
          actionLabel="Explorar Retas"
          actionHref="/dashboard"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRetas.map((reta) => (
            <MatchCard key={reta.id} reta={reta} />
          ))}
        </div>
      )}
    </div>
  );
}
