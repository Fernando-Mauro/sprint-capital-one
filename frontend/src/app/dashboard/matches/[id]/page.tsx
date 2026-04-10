'use client';

import { useAuth } from '@/hooks/use-auth';
import { getMatchById, joinMatch, leaveMatch, cancelMatch } from '@/services/matches';
import { ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, Send, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { Reta, RetaPlayer } from '@/types';

export default function MatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [reta, setReta] = useState<(Reta & { reta_players: RetaPlayer[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadReta = useCallback(async () => {
    const result = await getMatchById(id);
    if (result.data) setReta(result.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadReta();
  }, [loadReta]);

  const isParticipant = reta?.reta_players?.some((p) => p.user_id === user?.id);
  const isOrganizer = reta?.organizer_id === user?.id;

  const handleJoin = async () => {
    if (!user || !reta) return;
    setActionLoading(true);
    await joinMatch(reta.id, user.id);
    await loadReta();
    setActionLoading(false);
  };

  const handleLeave = async () => {
    if (!user || !reta) return;
    setActionLoading(true);
    await leaveMatch(reta.id, user.id);
    await loadReta();
    setActionLoading(false);
  };

  const handleCancel = async () => {
    if (!reta) return;
    setActionLoading(true);
    await cancelMatch(reta.id);
    await loadReta();
    setActionLoading(false);
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
          RETA NO ENCONTRADA
        </p>
        <Link href="/dashboard" className="text-primary font-bold uppercase">
          Volver
        </Link>
      </div>
    );
  }

  const confirmedPlayers = reta.reta_players?.filter((p) => p.status === 'confirmed') ?? [];

  return (
    <div className="pb-32">
      {/* Hero */}
      <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <img
          className="w-full h-full object-cover grayscale-[0.3] brightness-75"
          src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=2000&auto=format&fit=crop"
          alt="Match"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/dashboard"
            className="text-white hover:bg-surface-container/50 transition-colors p-2 inline-block"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-2">
          <div className="inline-block bg-primary-container text-on-primary-container px-4 py-1 font-headline font-black uppercase italic tracking-tighter skew-tag">
            <span className="block skew-tag-content">{reta.sports?.name ?? 'DEPORTE'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none">
            {reta.title}
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-bold uppercase tracking-widest text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary w-5 h-5" />
              <span>{reta.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary w-5 h-5" />
              <span>
                {reta.start_time}
                {reta.end_time ? ` - ${reta.end_time}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary w-5 h-5" />
              <span>{reta.location_name}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Description */}
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

          {/* Players */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-headline font-black uppercase text-2xl border-l-4 border-primary pl-4">
                JUGADORES CONFIRMADOS
              </h3>
              <span className="font-headline font-black text-primary text-xl">
                {confirmedPlayers.length}/{reta.max_players}
              </span>
            </div>
            {confirmedPlayers.length === 0 ? (
              <p className="text-on-surface-variant font-bold">
                Nadie se ha unido aún. ¡Sé el primero!
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {confirmedPlayers.map((player, idx) => (
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
        </div>

        {/* Right Column */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Map Placeholder */}
          <div className="aspect-video bg-surface-container-high relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <MapPin className="text-4xl text-primary-container mb-2 w-10 h-10" />
              <p className="font-headline font-black uppercase text-sm tracking-widest">
                {reta.location_name}
              </p>
            </div>
          </div>

          {/* Chat Placeholder */}
          <section className="bg-surface-container flex flex-col h-[400px] border border-outline-variant">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
              <h3 className="font-headline font-black uppercase tracking-tight">CHAT DE LA RETA</h3>
              <span className="w-2 h-2 bg-primary rounded-full" />
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
              <p className="text-on-surface-variant text-xs font-bold uppercase">
                Chat próximamente
              </p>
            </div>
            <div className="p-4 bg-surface-container-lowest flex gap-2">
              <input
                className="flex-1 bg-surface-container-high border-0 focus:ring-1 focus:ring-primary text-xs font-bold p-3 focus:outline-none"
                placeholder="ESCRIBE UN MENSAJE..."
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="bg-primary-container text-on-primary-container px-4 hover:bg-primary transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Organizer Tools */}
          {isOrganizer && reta.status !== 'cancelled' && (
            <div className="p-6 bg-surface-container-high border-2 border-dashed border-outline-variant space-y-4">
              <p className="font-headline font-black uppercase text-xs text-on-surface-variant tracking-widest">
                HERRAMIENTAS DE ORGANIZADOR
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="border-2 border-error text-error font-headline font-black uppercase text-xs p-3 hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> CANCELAR
                </button>
                <button className="border-2 border-primary text-primary font-headline font-black uppercase text-xs p-3 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> COMPLETAR
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Sticky Bottom Bar */}
      {reta.status !== 'cancelled' && (
        <div className="fixed bottom-0 left-0 w-full z-[60] bg-surface-container-high/90 backdrop-blur-xl border-t border-outline-variant p-4 md:p-6 flex items-center justify-between">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              ESTADO DE LA RETA
            </p>
            <p className="font-headline font-black uppercase text-2xl tracking-tighter">
              {reta.current_players >= reta.max_players ? 'COMPLETA' : 'ÚLTIMOS LUGARES'}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {!isParticipant ? (
              <button
                onClick={handleJoin}
                disabled={actionLoading || reta.current_players >= reta.max_players}
                className="flex-1 md:w-48 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-black uppercase italic py-4 text-xl tracking-tighter active:scale-95 transition-transform disabled:opacity-50"
              >
                {actionLoading ? 'CARGANDO...' : 'UNIRME'}
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={actionLoading || isOrganizer}
                className="flex-1 md:w-48 border-2 border-outline text-outline font-headline font-black uppercase italic py-4 text-xl tracking-tighter hover:border-error hover:text-error transition-colors active:scale-95 disabled:opacity-50"
              >
                {actionLoading ? 'CARGANDO...' : 'SALIRME'}
              </button>
            )}
          </div>
        </div>
      )}

      {reta.status === 'cancelled' && (
        <div className="fixed bottom-0 left-0 w-full z-[60] bg-error/20 backdrop-blur-xl border-t border-error p-6 text-center">
          <p className="font-headline font-black uppercase text-2xl text-error">RETA CANCELADA</p>
        </div>
      )}
    </div>
  );
}
