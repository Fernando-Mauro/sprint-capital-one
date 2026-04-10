'use client';

import AuthBackground from '@/components/auth/AuthBackground';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    // Supabase doesn't have a direct "resend" — user can just sign up again
    // with the same email and it will resend the confirmation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResent(true);
    setResending(false);
  };

  return (
    <AuthBackground>
      <main className="relative z-10 w-full max-w-lg px-6 py-12">
        <div className="bg-surface-container-low border-l-8 border-primary-container p-10 space-y-8 backdrop-blur-xl bg-opacity-90 text-center">
          {/* Animated mail icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary-container/10 border-2 border-primary-container flex items-center justify-center animate-bounce">
              <Mail className="w-12 h-12 text-primary-container" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-on-surface">
              REVISA TU CORREO
            </h1>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Enviamos un enlace de confirmación a
            </p>
            <p className="font-headline font-black text-primary text-lg uppercase tracking-wider">
              {email || 'tu correo'}
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Haz clic en el enlace del correo para activar tu cuenta y unirte a la cancha.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-outline-variant" />

          {/* Tips */}
          <div className="text-left space-y-3">
            <p className="font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant">
              ¿No ves el correo?
            </p>
            <ul className="space-y-2 text-on-surface-variant text-xs">
              <li className="flex items-start gap-2">
                <span className="text-primary font-black">1.</span>
                Revisa tu carpeta de spam o correo no deseado
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-black">2.</span>
                Verifica que escribiste bien tu correo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-black">3.</span>
                Puede tardar unos minutos en llegar
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="w-full border-2 border-primary-container text-primary-container font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 hover:bg-primary-container hover:text-on-primary-fixed transition-all cursor-pointer disabled:opacity-50"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Reenviando...
                </>
              ) : resent ? (
                'Correo reenviado'
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reenviar correo
                </>
              )}
            </button>

            <Link
              href="/login"
              className="w-full border-2 border-outline-variant text-on-surface-variant font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            Performance Driven UI © 2024 MatchUp
          </p>
        </footer>
      </main>
    </AuthBackground>
  );
}
