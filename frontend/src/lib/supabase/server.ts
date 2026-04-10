import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- @supabase/ssr@0.5.2 cannot resolve Database generic with supabase-js@2.103.0 (dist path mismatch). Upgrade @supabase/ssr to fix.
export async function createServerClient(): Promise<ReturnType<typeof createClient<any>>> {
  const cookieStore = await cookies();

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll(): { name: string; value: string }[] {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[],
      ): void {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
