'use client';

interface MatchActionBarProps {
  status: string;
  currentPlayers: number;
  maxPlayers: number;
  isParticipant: boolean;
  isOrganizer: boolean;
  loading: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export default function MatchActionBar({
  status,
  currentPlayers,
  maxPlayers,
  isParticipant,
  isOrganizer,
  loading,
  onJoin,
  onLeave,
}: MatchActionBarProps) {
  if (status === 'cancelled') {
    return (
      <div className="fixed bottom-0 left-0 w-full z-[60] bg-error/20 backdrop-blur-xl border-t border-error p-6 text-center">
        <p className="font-headline font-black uppercase text-2xl text-error">RETA CANCELADA</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-[60] bg-surface-container-high/90 backdrop-blur-xl border-t border-outline-variant p-4 md:p-6 flex items-center justify-between">
      <div className="hidden md:block">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
          ESTADO DE LA RETA
        </p>
        <p className="font-headline font-black uppercase text-2xl tracking-tighter">
          {currentPlayers >= maxPlayers ? 'COMPLETA' : 'ÚLTIMOS LUGARES'}
        </p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        {!isParticipant ? (
          <button
            onClick={onJoin}
            disabled={loading || currentPlayers >= maxPlayers}
            className="flex-1 md:w-48 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-black uppercase italic py-4 text-xl tracking-tighter active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'CARGANDO...' : 'UNIRME'}
          </button>
        ) : (
          <button
            onClick={onLeave}
            disabled={loading || isOrganizer}
            className="flex-1 md:w-48 border-2 border-outline text-outline font-headline font-black uppercase italic py-4 text-xl tracking-tighter hover:border-error hover:text-error transition-colors active:scale-95 disabled:opacity-50"
          >
            {loading ? 'CARGANDO...' : 'SALIRME'}
          </button>
        )}
      </div>
    </div>
  );
}
