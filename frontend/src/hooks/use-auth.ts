'use client';

import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  // TODO: Implement auth state management with Supabase client
  const signIn = async (_email: string, _password: string): Promise<void> => {
    // TODO: Call Supabase auth.signInWithPassword
  };

  const signOut = async (): Promise<void> => {
    // TODO: Call Supabase auth.signOut
  };

  return {
    user: null,
    loading: true,
    signIn,
    signOut,
  };
}
