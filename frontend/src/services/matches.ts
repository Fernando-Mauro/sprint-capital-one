import { createBrowserClient } from '@/lib/supabase/client';

import type { Reta, RetaPlayer, ServiceResult, Sport } from '@/types';
import type { CreateMatchInput, UpdateMatchInput } from '@/types/matches';

const supabase = createBrowserClient();

interface MatchFilters {
  sport_id?: string;
  status?: string;
}

export async function getMatches(filters?: MatchFilters): Promise<ServiceResult<Reta[]>> {
  let query = supabase
    .from('retas')
    .select('*, sports(*)')
    .order('date', { ascending: true })
    .limit(50);

  if (filters?.sport_id) {
    query = query.eq('sport_id', filters.sport_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) return { data: null, error: error.message };
  // Supabase returns joined data that doesn't match the generated types
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
  // Supabase returns joined data that doesn't match the generated types
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

  // TODO: SECURITY - Replace with Supabase RPC for atomic increment to prevent race conditions
  // Increment current_players
  const { data: reta } = await supabase
    .from('retas')
    .select('organizer_id, title, current_players')
    .eq('id', retaId)
    .single();

  if (reta) {
    await supabase
      .from('retas')
      .update({ current_players: reta.current_players + 1 })
      .eq('id', retaId);

    // Notify the organizer (fire-and-forget)
    const { data: joiningUser } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .maybeSingle();

    const username = joiningUser?.username ?? 'Un jugador';
    const retaTitle = reta.title as string;

    supabase
      .from('notifications')
      .insert({
        user_id: reta.organizer_id as string,
        type: 'player_joined',
        title: 'Nuevo jugador en tu reta',
        body: `${username} se unió a "${retaTitle}"`,
        reta_id: retaId,
      })
      .then(({ error: notifError }) => {
        if (notifError) {
          console.error('Failed to insert join notification:', notifError.message);
        }
      });
  }

  return { data: data as RetaPlayer, error: null };
}

export async function leaveMatch(retaId: string, userId: string): Promise<ServiceResult<null>> {
  const { error } = await supabase
    .from('reta_players')
    .delete()
    .eq('reta_id', retaId)
    .eq('user_id', userId);

  if (error) return { data: null, error: error.message };

  // TODO: SECURITY - Replace with Supabase RPC for atomic decrement to prevent race conditions
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

export async function cancelMatch(id: string): Promise<ServiceResult<Reta>> {
  return updateMatch(id, { status: 'cancelled' });
}

export async function getSports(): Promise<ServiceResult<Sport[]>> {
  const { data, error } = await supabase.from('sports').select('*').order('name');

  if (error) return { data: null, error: error.message };
  return { data: data as Sport[], error: null };
}
