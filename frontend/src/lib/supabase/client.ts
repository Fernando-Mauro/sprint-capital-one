import { createBrowserClient as createClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBrowserClient(): ReturnType<typeof createClient<any>> {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
