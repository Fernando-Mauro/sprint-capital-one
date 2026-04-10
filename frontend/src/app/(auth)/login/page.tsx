'use client';

import AuthBackground from '@/components/auth/AuthBackground';
import CaptchaWidget from '@/components/auth/CaptchaWidget';
import FormField from '@/components/ui/FormField';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema } from '@/lib/validations/auth';
import { Globe, Lock, Mail, Bolt } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const updateField = (field: keyof LoginInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const signInResult = await signIn(form.email, form.password, captchaToken ?? undefined);
    if (signInResult.error) {
      setServerError(
        signInResult.error.includes('Invalid login')
          ? 'Correo o contraseña incorrectos'
          : signInResult.error,
      );
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthBackground>
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
            <Link
              href="/register"
              className="font-headline text-lg font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Registro
            </Link>
          </div>

          {serverError && (
            <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
              {serverError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Correo Electrónico"
              icon={Mail}
              type="email"
              placeholder="ATLETA@MATCHUP.COM"
              value={form.email}
              onChange={(v) => updateField('email', v)}
              error={errors.email}
            />
            <FormField
              label="Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(v) => updateField('password', v)}
              error={errors.password}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary uppercase tracking-widest hover:text-primary-container transition-colors cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <CaptchaWidget onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-headline font-black uppercase text-xl py-4 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner
                    size="sm"
                    className="border-on-primary-fixed/30 border-t-on-primary-fixed"
                  />
                  Ingresando...
                </>
              ) : (
                <>
                  Entrar al Juego
                  <Bolt className="w-6 h-6 fill-current" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-outline-variant flex-1" />
            <span className="text-on-surface-variant font-headline text-xs font-black uppercase">
              O CONECTA CON
            </span>
            <div className="h-px bg-outline-variant flex-1" />
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 transition-all cursor-pointer"
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
    </AuthBackground>
  );
}
