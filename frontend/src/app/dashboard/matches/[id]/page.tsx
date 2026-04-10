'use client';

import MatchActionBar from '@/components/matches/MatchActionBar';
import MatchHero from '@/components/matches/MatchHero';
import OrganizerTools from '@/components/matches/OrganizerTools';
import PlayersList from '@/components/matches/PlayersList';
import { useAuth } from '@/hooks/use-auth';
import {
  getMatchById,
  joinMatch,
  leaveMatch,
  cancelMatch,
  completeMatch,
} from '@/services/matches';
import { MapPin, Share } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ChatWindow } from '@/components/chat/chat-window';
import type { Reta, RetaPlayer } from '@/types';

export default function MatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [reta, setReta] = useState<(Reta & { reta_players: RetaPlayer[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadReta = useCallback(async () => {
    const result = await getMatchById(id);
    if (result.data) setReta(result.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadReta();
  }, [loadReta]);

  const isParticipant = reta?.reta_players?.some((p) => p.user_id === user?.id) ?? false;
  const isOrganizer = reta?.organizer_id === user?.id;
  const confirmedPlayers = reta?.reta_players?.filter((p) => p.status === 'confirmed') ?? [];

  const handleJoin = async () => {
    if (!user || !reta) return;
    setActionLoading(true);
    setActionError(null);
    const result = await joinMatch(reta.id, user.id);
    if (result.error) {
      setActionError(result.error);
    }
    await loadReta();
    setActionLoading(false);
  };

  const handleLeave = async () => {
    if (!user || !reta) return;
    setActionLoading(true);
    setActionError(null);
    const result = await leaveMatch(reta.id, user.id);
    if (result.error) {
      setActionError(result.error);
    }
    await loadReta();
    setActionLoading(false);
  };

  const handleCancel = async () => {
    if (!reta) return;
    setActionLoading(true);
    setActionError(null);
    await cancelMatch(reta.id);
    await loadReta();
    setActionLoading(false);
  };

  const handleComplete = async () => {
    if (!reta) return;
    setActionLoading(true);
    setActionError(null);
    await completeMatch(reta.id);
    await loadReta();
    setActionLoading(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: reta?.title ?? 'MatchUp',
        text: `¡Únete a mi matchup: ${reta?.title}!`,
        url: window.location.href,
      });
    } catch (_err) {
      void navigator.clipboard.writeText(window.location.href);
      alert('Link copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse font-headline font-black text-2xl text-on-surface-variant">
          CARGANDO...
        </div>
      </div>
    );
  }

  if (!reta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-headline font-black text-3xl text-on-surface-variant">
          MATCHUP NO ENCONTRADO
        </p>
        <Link href="/dashboard" className="text-primary font-bold uppercase">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <MatchHero reta={reta} />

      <div className="px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Error feedback */}
          {actionError && (
            <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
              {actionError}
            </div>
          )}

          {reta.description && (
            <section>
              <h3 className="font-headline font-black uppercase text-2xl mb-4 border-l-4 border-primary pl-4">
                DESCRIPCIÓN
              </h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                {reta.description}
              </p>
            </section>
          )}

          <PlayersList players={confirmedPlayers} maxPlayers={reta.max_players} />
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="aspect-video bg-surface-container-high relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <MapPin className="text-4xl text-primary-container mb-2 w-10 h-10" />
              <p className="font-headline font-black uppercase text-sm tracking-widest">
                {reta.location_name}
              </p>
            </div>
          </div>

          {/* Chat System */}
          <ChatWindow retaId={reta.id} user={user} />

          <button
            onClick={handleShare}
            className="w-full bg-surface-container-high border-2 border-outline-variant hover:border-primary text-on-surface font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <Share className="w-5 h-5" /> COMPARTIR MATCHUP
          </button>

          {isOrganizer && reta.status !== 'cancelled' && (
            <OrganizerTools
              onCancel={handleCancel}
              onComplete={handleComplete}
              disabled={actionLoading}
            />
          )}
        </aside>
      </div>

      <MatchActionBar
        status={reta.status}
        currentPlayers={reta.current_players}
        maxPlayers={reta.max_players}
        isParticipant={isParticipant}
        isOrganizer={isOrganizer ?? false}
        loading={actionLoading}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />
    </div>
  );
}
