'use client';

import { useAuth } from '@/hooks/use-auth';
import { Globe, Lock, Mail, Bolt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.5] brightness-[0.3]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop)' }}
      />

      <main className="relative z-10 w-full max-w-lg px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-primary-container leading-none mb-4">
            MATCHUP
          </h1>
          <p className="font-headline text-2xl md:text-4xl font-black uppercase tracking-tighter text-on-surface leading-tight max-w-sm">
            TU PRÓXIMO JUEGO EMPIEZA AQUÍ
          </p>
        </header>

        <div className="bg-surface-container-low border-l-8 border-primary-container p-8 space-y-8 backdrop-blur-xl bg-opacity-90">
          <div className="flex gap-8 mb-4">
            <span className="font-headline text-lg font-black uppercase tracking-widest text-primary border-b-4 border-primary pb-1">
              Ingresar
            </span>
            <button
              onClick={() => router.push('/register')}
              className="font-headline text-lg font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Registro
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-bold p-4 pl-12 placeholder:text-outline transition-all focus:outline-none"
                  placeholder="ATLETA@MATCHUP.COM"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-surface font-bold p-4 pl-12 transition-all focus:outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-black uppercase text-xl py-4 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Entrar al Juego'}
              {!loading && <Bolt className="w-6 h-6 fill-current" />}
            </button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-outline-variant flex-1" />
            <span className="text-on-surface-variant font-headline text-xs font-black uppercase">O CONECTA CON</span>
            <div className="h-px bg-outline-variant flex-1" />
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 transition-all"
          >
            <Globe className="w-5 h-5" />
            Google Auth
          </button>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            Performance Driven UI © 2024 MatchUp
          </p>
        </footer>
      </main>

      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
