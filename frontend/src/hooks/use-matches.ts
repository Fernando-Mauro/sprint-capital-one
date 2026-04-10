'use client';

import { getMatches } from '@/services/matches';
import { useCallback, useEffect, useState } from 'react';

import type { Reta } from '@/types';

interface UseMatchesReturn {
  matches: Reta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMatches(sportId?: string): UseMatchesReturn {
  const [matches, setMatches] = useState<Reta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getMatches(
      sportId ? { sport_id: sportId, status: 'open' } : { status: 'open' },
    );
    if (result.error) {
      setError(result.error);
    } else {
      setMatches(result.data ?? []);
    }
    setLoading(false);
  }, [sportId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { matches, loading, error, refetch };
}
