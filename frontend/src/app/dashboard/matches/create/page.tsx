'use client';

import LocationPicker from '@/components/map/LocationPicker';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { createMatch, getSports } from '@/services/matches';
import { ArrowLeft, Calendar, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { Sport } from '@/types';

export default function CreateMatchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(12);
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSports = useCallback(async () => {
    const result = await getSports();
    if (result.data) {
      setSports(result.data as Sport[]);
      const first = result.data[0];
      if (first) setSelectedSport(first.id);
    }
  }, []);

  useEffect(() => {
    loadSports();
  }, [loadSports]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!latitude || !longitude) {
      setError('Selecciona una ubicación en el mapa');
      return;
    }
    setLoading(true);
    setError(null);

    const result = await createMatch(
      {
        title,
        sport_id: selectedSport,
        location_name: locationName,
        latitude,
        longitude,
        date,
        start_time: startTime,
        max_players: maxPlayers,
        min_skill_level: level || undefined,
        description: description || undefined,
        is_private: !isPublic,
      },
      user.id,
    );

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-white hover:bg-surface-container transition-colors p-2 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      <header>
        <h1 className="font-headline font-black text-5xl uppercase leading-none tracking-tighter mb-2">
          NUEVO <span className="text-primary-container">MATCHUP</span>
        </h1>
        <p className="text-on-surface-variant font-bold uppercase text-sm tracking-widest">
          Configura el encuentro
        </p>
      </header>

      {error && (
        <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
          {error}
        </div>
      )}

      <form className="space-y-12" onSubmit={handleSubmit}>
        {/* Sport Selection */}
        <section>
          <label className="block font-headline font-black text-xl uppercase mb-6 italic">
            Selecciona Deporte
          </label>
          <div className="flex flex-wrap gap-3">
            {sports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => setSelectedSport(sport.id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 font-black uppercase text-sm border-2 transition-all active:scale-95 cursor-pointer',
                  selectedSport === sport.id
                    ? 'bg-primary-container text-on-primary-fixed border-primary-container'
                    : 'bg-surface-container text-on-surface border-transparent hover:border-outline-variant',
                )}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-outline mb-2 tracking-widest">
              Título del Encuentro
            </label>
            <input
              className="w-full bg-surface-container-lowest border-b-2 border-outline-variant px-0 py-4 text-2xl font-black uppercase placeholder:text-surface-container-highest focus:border-primary-container transition-colors focus:outline-none"
              placeholder="EJ: FINAL CHAMPIONS BARRIO"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-outline mb-2 tracking-widest">
              Fecha
            </label>
            <div className="relative">
              <input
                className="w-full bg-surface-container-lowest border-b-2 border-outline-variant px-0 py-4 text-lg font-bold text-on-surface appearance-none focus:border-primary-container focus:outline-none"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Calendar className="absolute right-0 top-4 text-primary pointer-events-none w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-outline mb-2 tracking-widest">
              Hora de Inicio
            </label>
            <input
              className="w-full bg-surface-container-lowest border-b-2 border-outline-variant px-0 py-4 text-lg font-bold text-on-surface appearance-none focus:border-primary-container focus:outline-none"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </section>

        {/* Location Picker */}
        <section>
          <label className="block text-xs font-bold uppercase text-outline mb-2 tracking-widest">
            Cancha / Ubicación
          </label>
          <LocationPicker
            value={locationName}
            onChange={({ name, latitude: lat, longitude: lng }) => {
              setLocationName(name);
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </section>

        {/* Settings */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 bg-surface-container-low">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase text-outline tracking-widest">
                Max Jugadores
              </label>
              <span className="text-3xl font-headline font-black text-primary-container">
                {maxPlayers}
              </span>
            </div>
            <input
              className="w-full h-1 bg-surface-container-highest appearance-none cursor-pointer accent-primary-container"
              max="22"
              min="2"
              type="range"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-[10px] font-bold text-outline uppercase">
              <span>2 Jugadores</span>
              <span>22 Jugadores</span>
            </div>
          </div>
          <div className="space-y-6">
            <label className="block text-xs font-bold uppercase text-outline tracking-widest">
              Nivel Mínimo
            </label>
            <div className="flex bg-surface-container-lowest p-1">
              {['Novato', 'Inter', 'Pro'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={cn(
                    'flex-1 py-3 text-xs font-black uppercase transition-all cursor-pointer',
                    level === lvl
                      ? 'bg-primary-container text-on-primary-fixed'
                      : 'text-on-surface-variant hover:text-white',
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Description & Visibility */}
        <section className="space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase text-outline mb-2 tracking-widest">
              Descripción
            </label>
            <textarea
              className="w-full bg-surface-container-lowest border-2 border-outline-variant p-4 text-lg font-medium placeholder:text-surface-container-highest focus:border-primary-container transition-colors resize-none focus:outline-none"
              placeholder="REGLAS, COOPERACIÓN, ETC..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between p-6 border-2 border-outline-variant">
            <div className="flex items-center gap-4">
              {isPublic ? (
                <Globe className="text-primary w-8 h-8" />
              ) : (
                <Lock className="text-error w-8 h-8" />
              )}
              <div>
                <p className="font-black uppercase text-sm leading-none mb-1">
                  {isPublic ? 'Matchup Público' : 'Matchup Privado'}
                </p>
                <p className="text-xs text-on-surface-variant uppercase font-bold">
                  {isPublic ? 'Cualquiera puede unirse' : 'Solo con invitación'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={cn(
                'w-14 h-8 relative flex items-center px-1 transition-colors cursor-pointer',
                isPublic ? 'bg-primary-container' : 'bg-surface-container-highest',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 bg-on-surface transition-transform',
                  isPublic ? 'translate-x-6' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-container py-6 text-on-primary-fixed font-headline font-black text-2xl uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(0,253,134,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'CREANDO...' : 'CREAR MATCHUP'}
          </button>
        </div>
      </form>
    </div>
  );
}
