import { Bolt } from 'lucide-react';
import Link from 'next/link';

import type { ReactNode } from 'react';

export default function HomePage(): ReactNode {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center grayscale-[0.5] brightness-[0.3]"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop)',
        }}
      />

      <main className="relative z-10 w-full max-w-lg px-6 py-12 text-center">
        <h1 className="font-headline text-7xl md:text-9xl font-black uppercase tracking-tighter italic text-primary-container leading-none mb-6">
          MATCHUP
        </h1>
        <p className="font-headline text-xl md:text-3xl font-black uppercase tracking-tighter text-on-surface leading-tight mb-12">
          Encuentra tu próximo juego
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-black uppercase text-xl py-4 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Ingresar <Bolt className="w-6 h-6 fill-current" />
          </Link>
          <Link
            href="/register"
            className="w-full border-2 border-primary-container text-primary-container font-headline font-black uppercase text-xl py-4 hover:bg-primary-container hover:text-on-primary-fixed transition-all flex items-center justify-center gap-2"
          >
            Crear Cuenta
          </Link>
        </div>

        <footer className="mt-16">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            Created by Muchachos, idk © 2026 MatchUp
          </p>
        </footer>
      </main>

      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
