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
    async (
      userId: string,
      authUser?: {
        email?: string | null;
        user_metadata?: Record<string, unknown> | null;
      } | null,
    ) => {
      const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();

      if (data) {
        setUser(data as UserProfile);
        return;
      }

      // Auto-create profile for OAuth users (Google) who don't have one yet.
      // Use authUser from the caller instead of supabase.auth.getUser() to
      // avoid triggering a TOKEN_REFRESHED → onAuthStateChange → fetchProfile
      // infinite loop.
      if (!authUser) return;

      const email = authUser.email ?? '';
      const metadata = authUser.user_metadata ?? {};
      const fullName =
        (metadata.full_name as string) ?? (metadata.name as string) ?? email.split('@')[0] ?? '';
      const sanitizedName = fullName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 30);
      const username = (sanitizedName || 'user') + '_' + userId.slice(0, 4);

      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          username,
          full_name: fullName,
          avatar_url: (metadata.avatar_url as string) ?? null,
        })
        .select()
        .maybeSingle();

      if (newProfile) {
        setUser(newProfile as UserProfile);
      }
    },
    [],
  );

  useEffect(() => {
    let lastHandledUserId: string | null = null;

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        lastHandledUserId = session.user.id;
        await fetchProfile(session.user.id, session.user);
      }
      setLoading(false);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react to actual sign in/out — ignore TOKEN_REFRESHED and
      // INITIAL_SESSION which can fire in loops and cause infinite refetches.
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;

      if (!session?.user) {
        setUser(null);
        lastHandledUserId = null;
        setLoading(false);
        return;
      }

      // Skip if we already handled this user (prevents re-fetch loops)
      if (lastHandledUserId === session.user.id) {
        setLoading(false);
        return;
      }

      lastHandledUserId = session.user.id;
      fetchProfile(session.user.id, session.user).finally(() => setLoading(false));
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
