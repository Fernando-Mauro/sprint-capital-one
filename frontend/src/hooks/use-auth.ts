'use client';

import { createBrowserClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';

import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    captchaToken?: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    username: string,
    fullName: string,
    captchaToken?: string,
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, captchaToken?: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const supabase = createBrowserClient();

export function useAuth(): AuthState {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();

      if (data) {
        setUser(data as UserProfile);
        return;
      }

      // Auto-create profile for OAuth users (Google) who don't have one yet
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const email = authUser.email ?? '';
        const fullName =
          authUser.user_metadata?.full_name ??
          authUser.user_metadata?.name ??
          email.split('@')[0] ??
          '';
        const sanitizedName = (fullName as string)
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '')
          .slice(0, 30);
        const username =
          (sanitizedName || 'user') + '_' + userId.slice(0, 4);

        const { data: newProfile } = await supabase
          .from('users')
          .insert({
            id: userId,
            email,
            username,
            full_name: fullName as string,
            avatar_url: (authUser.user_metadata?.avatar_url as string) ?? null,
          })
          .select()
          .maybeSingle();

        if (newProfile) {
          setUser(newProfile as UserProfile);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });
    return { error: error?.message ?? null };
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    fullName: string,
    captchaToken?: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });
    if (error) return { error: error.message };

    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        username,
        full_name: fullName,
      });
      if (profileError) return { error: profileError.message };
    }

    return { error: null };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  const resetPassword = async (email: string, captchaToken?: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
      captchaToken,
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };
}
