import { cn } from '@/lib/utils';
import { getSportImage } from '@/lib/sport-images';
import { Calendar, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import type { Reta } from '@/types';

interface MatchCardProps {
  reta: Reta;
}

export default function MatchCard({ reta }: MatchCardProps) {
  const fillPercent = Math.round((reta.current_players / reta.max_players) * 100);
  const isAlmostFull = fillPercent >= 80;

  return (
    <Link
      href={`/dashboard/matches/${reta.id}`}
      className="bg-surface-container-low flex flex-col justify-between border-l-8 border-primary-container hover:border-primary transition-colors group relative overflow-hidden"
    >
      {/* Sport background image */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 grayscale">
        <img src={getSportImage(reta.sports?.name)} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-primary-container text-on-primary-fixed px-3 py-1 text-[10px] font-black uppercase italic">
            {reta.sports?.name ?? 'Deporte'}
          </div>
          {reta.min_skill_level && (
            <div className="flex items-center gap-1 text-primary-container">
              <TrendingUp className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">Nivel: {reta.min_skill_level}</span>
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
      <div className="relative z-10 px-6 pb-6">
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
              isAlmostFull ? 'bg-error' : 'bg-gradient-to-r from-primary to-primary-container',
            )}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
