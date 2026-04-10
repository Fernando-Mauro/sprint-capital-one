import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database } from '@/lib/supabase/types';

export async function createServerClient(): Promise<ReturnType<typeof createClient<Database>>> {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
          // TODO: Handle cookie setting for server-side auth
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
