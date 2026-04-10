import { createBrowserClient as createClient } from '@supabase/ssr';

import type { Database } from '@/lib/supabase/types';

export function createBrowserClient(): ReturnType<typeof createClient<Database>> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
