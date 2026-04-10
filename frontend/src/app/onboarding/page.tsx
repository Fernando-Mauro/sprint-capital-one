'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/services/users';
import { CheckCircle2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SKILL_LEVELS = [
  { id: 'beginner', name: 'Principiante', desc: 'RECIÉN LLEGADO AL CAMPO' },
  { id: 'intermediate', name: 'Intermedio', desc: 'CONTROL DE BALÓN Y TÁCTICA' },
  { id: 'advanced', name: 'Avanzado', desc: 'ALTO RENDIMIENTO Y COMPETENCIA' },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    await updateUserProfile(user.id, { skill_level: skillLevel });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <main className="w-full max-w-lg space-y-8">
        <div className="bg-surface-container-high p-8 border-l-8 border-tertiary">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-tertiary-container text-on-tertiary-container w-12 h-12 flex items-center justify-center slant-box">
              <Trophy className="w-6 h-6 font-bold" />
            </div>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
              PERFIL DE RENDIMIENTO
            </h2>
          </div>

          <div className="space-y-10">
            {/* Skill Level */}
            <div className="space-y-4">
              <p className="font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Selecciona tu nivel de habilidad
              </p>
              <div className="flex flex-col gap-2">
                {SKILL_LEVELS.map((level) => {
                  const isActive = skillLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSkillLevel(level.id)}
                      className={cn(
                        'flex items-center justify-between p-4 border-l-4 transition-all text-left',
                        isActive
                          ? 'bg-primary-container/10 border-primary-container'
                          : 'bg-surface-container-lowest border-outline-variant opacity-60',
                      )}
                    >
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'font-headline font-black uppercase text-sm',
                            isActive ? 'text-primary' : 'text-on-surface',
                          )}
                        >
                          {level.name}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-bold',
                            isActive ? 'text-primary/80' : 'text-on-surface-variant',
                          )}
                        >
                          {level.desc}
                        </span>
                      </div>
                      <CheckCircle2
                        className={cn(
                          'w-6 h-6',
                          isActive ? 'text-primary fill-primary/20' : 'text-outline',
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-tertiary text-on-tertiary font-headline font-black uppercase text-lg py-5 slant-box hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Finalizar Perfil'}
            </button>
          </div>
        </div>

        <footer className="text-center">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            Performance Driven UI © 2024 MatchUp
          </p>
        </footer>
      </main>
    </div>
  );
}
