'use client';

import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

import type { Sport } from '@/types';

interface SportFiltersProps {
  sports: Sport[];
  activeSport: string | null;
  onSelect: (sportId: string | null) => void;
}

export default function SportFilters({ sports, activeSport, onSelect }: SportFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
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
          onClick={() => onSelect(sport.id)}
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
  );
}
