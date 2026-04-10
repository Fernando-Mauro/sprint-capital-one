import { createBrowserClient } from '@/lib/supabase/client';

import type { Reta, RetaPlayer, ServiceResult } from '@/types';
import type { CreateMatchInput, UpdateMatchInput } from '@/types/matches';

const supabase = createBrowserClient();

interface MatchFilters {
  sport_id?: string;
  status?: string;
}

export async function getMatches(
  filters?: MatchFilters,
): Promise<ServiceResult<Reta[]>> {
  let query = supabase
    .from('retas')
    .select('*, sports(*)')
    .order('date', { ascending: true });

  if (filters?.sport_id) {
    query = query.eq('sport_id', filters.sport_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  return { data: data as unknown as Reta[], error: null };
}

export async function getMatchById(
  id: string,
): Promise<ServiceResult<Reta & { reta_players: RetaPlayer[] }>> {
  const { data, error } = await supabase
    .from('retas')
    .select('*, sports(*), reta_players(*, users(*))')
    .eq('id', id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Reta no encontrada' };
  return { data: data as unknown as Reta & { reta_players: RetaPlayer[] }, error: null };
}

export async function createMatch(
  input: CreateMatchInput,
  organizerId: string,
): Promise<ServiceResult<Reta>> {
  const { data, error } = await supabase
    .from('retas')
    .insert({
      ...input,
      organizer_id: organizerId,
      current_players: 1,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  // Auto-join as organizer
  await supabase.from('reta_players').insert({
    reta_id: data.id,
    user_id: organizerId,
    role: 'organizer',
    status: 'confirmed',
  });

  return { data: data as Reta, error: null };
}

export async function updateMatch(
  id: string,
  input: UpdateMatchInput,
): Promise<ServiceResult<Reta>> {
  const { data, error } = await supabase
    .from('retas')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Reta, error: null };
}

export async function joinMatch(
  retaId: string,
  userId: string,
): Promise<ServiceResult<RetaPlayer>> {
  // Check if already joined
  const { data: existing } = await supabase
    .from('reta_players')
    .select('id')
    .eq('reta_id', retaId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return { data: null, error: 'Ya estás en esta reta' };

  const { data, error } = await supabase
    .from('reta_players')
    .insert({
      reta_id: retaId,
      user_id: userId,
      role: 'player',
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  // Increment current_players
  const { data: reta } = await supabase
    .from('retas')
    .select('current_players')
    .eq('id', retaId)
    .single();

  if (reta) {
    await supabase
      .from('retas')
      .update({ current_players: reta.current_players + 1 })
      .eq('id', retaId);
  }

  return { data: data as RetaPlayer, error: null };
}

export async function leaveMatch(
  retaId: string,
  userId: string,
): Promise<ServiceResult<null>> {
  const { error } = await supabase
    .from('reta_players')
    .delete()
    .eq('reta_id', retaId)
    .eq('user_id', userId);

  if (error) return { data: null, error: error.message };

  // Decrement current_players
  const { data: reta } = await supabase
    .from('retas')
    .select('current_players')
    .eq('id', retaId)
    .single();

  if (reta && (reta.current_players as number) > 0) {
    await supabase
      .from('retas')
      .update({ current_players: (reta.current_players as number) - 1 })
      .eq('id', retaId);
  }

  return { data: null, error: null };
}

export async function cancelMatch(
  id: string,
): Promise<ServiceResult<Reta>> {
  return updateMatch(id, { status: 'cancelled' });
}

export async function getSports(): Promise<ServiceResult<{ id: string; name: string }[]>> {
  const { data, error } = await supabase
    .from('sports')
    .select('id, name')
    .order('name');

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
