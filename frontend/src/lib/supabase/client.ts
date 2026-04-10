import { createBrowserClient as createClient } from '@supabase/ssr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createBrowserClient(): ReturnType<typeof createClient<any>> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );
}
