import { createBrowserClient } from '@/lib/supabase/client';

import type { UserProfile, ServiceResult } from '@/types';

function getSupabase() {
  return createBrowserClient();
}

export async function getUserProfile(id: string): Promise<ServiceResult<UserProfile>> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Usuario no encontrado' };
  return { data: data as UserProfile, error: null };
}

export async function updateUserProfile(
  id: string,
  input: Partial<
    Pick<UserProfile, 'full_name' | 'username' | 'avatar_url' | 'phone' | 'skill_level'>
  >,
): Promise<ServiceResult<UserProfile>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as UserProfile, error: null };
}

export async function getUserStats(userId: string): Promise<{
  played: number;
  organized: number;
  noShows: number;
}> {
  const supabase = getSupabase();
  const { data: allPlayed } = await supabase
    .from('reta_players')
    .select('id, role, status')
    .eq('user_id', userId);

  const played = allPlayed?.filter((p) => p.status === 'confirmed').length ?? 0;
  const organized = allPlayed?.filter((p) => p.role === 'organizer').length ?? 0;
  const noShows = allPlayed?.filter((p) => p.status === 'no_show').length ?? 0;

  return { played, organized, noShows };
}

export async function getUserSports(
  userId: string,
): Promise<{ id: string; name: string; count: number }[]> {
  const supabase = getSupabase();

  // Get all retas user joined with their sport info
  const { data, error } = await supabase
    .from('reta_players')
    .select('retas(sport_id, sports(id, name))')
    .eq('user_id', userId)
    .eq('status', 'confirmed');

  if (error || !data) return [];

  // Count matchups per sport
  const sportCounts = new Map<string, { id: string; name: string; count: number }>();

  for (const row of data) {
    const retas = row.retas as unknown as Record<string, unknown> | null;
    const sports = retas?.sports as Record<string, unknown> | null;
    if (!sports?.id || !sports?.name) continue;

    const id = sports.id as string;
    const name = sports.name as string;
    const existing = sportCounts.get(id);

    if (existing) {
      existing.count++;
    } else {
      sportCounts.set(id, { id, name, count: 1 });
    }
  }

  return Array.from(sportCounts.values()).sort((a, b) => b.count - a.count);
}

export async function getUserRetaHistory(userId: string): Promise<Record<string, unknown>[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reta_players')
    .select('status, joined_at, retas(id, title, date, start_time, status, sports(id, name))')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })
    .limit(10);

  if (error) return [];
  return (data as Record<string, unknown>[]) ?? [];
}
