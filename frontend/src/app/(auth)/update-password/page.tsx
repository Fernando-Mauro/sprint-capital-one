'use client';

import AuthBackground from '@/components/auth/AuthBackground';
import FormField from '@/components/ui/FormField';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/use-auth';
import { updatePasswordSchema } from '@/lib/validations/auth';
import { Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const result = updatePasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'password' | 'confirmPassword';
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const updateResult = await updatePassword(password);
    if (updateResult.error) {
      setServerError(updateResult.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  if (success) {
    return (
      <AuthBackground>
        <main className="relative z-10 w-full max-w-lg px-6 py-12">
          <div className="bg-surface-container-low border-l-8 border-primary-container p-10 space-y-8 backdrop-blur-xl bg-opacity-90 text-center">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary-container/10 border-2 border-primary-container flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-primary-container" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface">
                CONTRASEÑA ACTUALIZADA
              </h1>
              <p className="text-on-surface-variant text-sm">
                Tu contraseña fue actualizada exitosamente. Redirigiendo al dashboard...
              </p>
            </div>
            <Spinner size="lg" className="mx-auto" />
          </div>
        </main>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <main className="relative z-10 w-full max-w-lg px-6 py-12">
        <div className="bg-surface-container-low border-l-8 border-primary-container p-8 space-y-8 backdrop-blur-xl bg-opacity-90">
          <div>
            <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-on-surface mb-2">
              NUEVA CONTRASEÑA
            </h1>
            <p className="text-on-surface-variant text-sm">
              Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
            </p>
          </div>

          {serverError && (
            <div className="bg-error/10 border border-error text-error text-sm font-bold p-3">
              {serverError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Nueva Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(v) => {
                setPassword(v);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
            />
            <FormField
              label="Confirmar Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(v) => {
                setConfirmPassword(v);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
            />

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
                  Actualizando...
                </>
              ) : (
                <>
                  Actualizar Contraseña
                  <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </AuthBackground>
  );
}
