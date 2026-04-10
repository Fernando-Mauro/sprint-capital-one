import { createBrowserClient } from '@/lib/supabase/client';

import type { UserProfile, ServiceResult } from '@/types';

const supabase = createBrowserClient();

export async function getUserProfile(id: string): Promise<ServiceResult<UserProfile>> {
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
  const { data: allPlayed } = await supabase
    .from('reta_players')
    .select('id, role, status')
    .eq('user_id', userId);

  const played = allPlayed?.filter((p) => p.status === 'confirmed').length ?? 0;
  const organized = allPlayed?.filter((p) => p.role === 'organizer').length ?? 0;
  const noShows = allPlayed?.filter((p) => p.status === 'no_show').length ?? 0;

  return { played, organized, noShows };
}

export async function getUserRetaHistory(userId: string) {
  const { data, error } = await supabase
    .from('reta_players')
    .select('*, retas(*, sports(*))')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })
    .limit(10);

  if (error) return [];
  return data ?? [];
}
