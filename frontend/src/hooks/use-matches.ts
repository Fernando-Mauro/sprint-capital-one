'use client';

import type { Match } from '@/types';

interface UseMatchesReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMatches(): UseMatchesReturn {
  // TODO: Implement match fetching with state management
  const refetch = async (): Promise<void> => {
    // TODO: Call getMatches service and update state
  };

  return {
    matches: [],
    loading: true,
    error: null,
    refetch,
  };
}
