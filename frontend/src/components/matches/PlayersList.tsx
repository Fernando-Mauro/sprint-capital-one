import { Star } from 'lucide-react';

import type { RetaPlayer } from '@/types';

interface PlayersListProps {
  players: RetaPlayer[];
  maxPlayers: number;
}

export default function PlayersList({ players, maxPlayers }: PlayersListProps) {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h3 className="font-headline font-black uppercase text-2xl border-l-4 border-primary pl-4">
          JUGADORES CONFIRMADOS
        </h3>
        <span className="font-headline font-black text-primary text-xl">
          {players.length}/{maxPlayers}
        </span>
      </div>
      {players.length === 0 ? (
        <p className="text-on-surface-variant font-bold">Nadie se ha unido aún. ¡Sé el primero!</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="bg-surface-container-low flex items-center p-2 pr-4 gap-3 border-b-2 border-outline-variant hover:border-primary transition-all"
            >
              <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center border border-outline">
                <span className="text-xs font-black text-primary">
                  {player.users?.username?.charAt(0).toUpperCase() ?? `P${idx + 1}`}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">@{player.users?.username ?? 'jugador'}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-current" />
                  <span className="text-[10px] text-primary font-black uppercase">
                    {player.role === 'organizer' ? 'ORGANIZADOR' : 'JUGADOR'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
