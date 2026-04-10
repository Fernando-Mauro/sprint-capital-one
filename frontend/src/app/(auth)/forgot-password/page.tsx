'use client';

import AuthBackground from '@/components/auth/AuthBackground';
import CaptchaWidget from '@/components/auth/CaptchaWidget';
import FormField from '@/components/ui/FormField';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/use-auth';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldError(undefined);

    const result = resetPasswordSchema.safeParse({ email });
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message);
      return;
    }

    setLoading(true);
    const resetResult = await resetPassword(email, captchaToken ?? undefined);
    if (resetResult.error) {
      setError(resetResult.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <AuthBackground>
        <main className="relative z-10 w-full max-w-lg px-6 py-12">
          <div className="bg-surface-container-low border-l-8 border-tertiary p-10 space-y-8 backdrop-blur-xl bg-opacity-90 text-center">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-tertiary/10 border-2 border-tertiary flex items-center justify-center">
                <Send className="w-12 h-12 text-tertiary" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">
                CORREO ENVIADO
              </h1>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Si existe una cuenta con <span className="text-primary font-bold">{email}</span>,
                recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full border-2 border-outline-variant text-on-surface-variant font-headline font-black uppercase text-sm py-4 flex items-center justify-center gap-3 hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </main>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <main className="relative z-10 w-full max-w-lg px-6 py-12">
        <div className="bg-surface-container-low border-l-8 border-tertiary p-8 space-y-8 backdrop-blur-xl bg-opacity-90">
          <div>
            <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface mb-2">
              RECUPERAR CONTRASEÑA
            </h1>
            <p className="text-on-surface-variant text-sm">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Correo Electrónico"
              icon={Mail}
              type="email"
              placeholder="ATLETA@MATCHUP.COM"
              value={email}
              onChange={(v) => {
                setEmail(v);
                setFieldError(undefined);
              }}
              error={fieldError}
            />

            <CaptchaWidget onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tertiary text-on-tertiary font-headline font-black uppercase text-xl py-4 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="border-on-tertiary/30 border-t-on-tertiary" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar enlace
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center gap-2 text-on-surface-variant font-bold text-sm uppercase hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
    </AuthBackground>
  );
}
