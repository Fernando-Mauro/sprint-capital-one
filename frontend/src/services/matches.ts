import { createBrowserClient } from '@/lib/supabase/client';

import type { Reta, RetaPlayer, ServiceResult, Sport } from '@/types';
import type { CreateMatchInput, UpdateMatchInput } from '@/types/matches';

function getSupabase() {
  return createBrowserClient();
}

interface MatchFilters {
  sport_id?: string;
  status?: string;
}

export async function getMatches(filters?: MatchFilters): Promise<ServiceResult<Reta[]>> {
  const supabase = getSupabase();
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
  return { data: data as unknown as Reta[], error: null };
}

export async function getMatchById(
  id: string,
): Promise<ServiceResult<Reta & { reta_players: RetaPlayer[] }>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('retas')
    .select('*, sports(*), reta_players(*, users(*))')
    .eq('id', id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: 'Matchup no encontrado' };
  return { data: data as unknown as Reta & { reta_players: RetaPlayer[] }, error: null };
}

export async function createMatch(
  input: CreateMatchInput,
  organizerId: string,
): Promise<ServiceResult<Reta>> {
  const supabase = getSupabase();
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
  const { error: joinError } = await supabase.from('reta_players').insert({
    reta_id: data.id,
    user_id: organizerId,
    role: 'organizer',
    status: 'confirmed',
  });

  if (joinError) {
    await supabase.from('retas').delete().eq('id', data.id);
    return { data: null, error: joinError.message };
  }

  return { data: data as Reta, error: null };
}

export async function updateMatch(
  id: string,
  input: UpdateMatchInput,
): Promise<ServiceResult<Reta>> {
  const supabase = getSupabase();
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
  const supabase = getSupabase();

  // Check if matchup is full
  const { data: matchup } = await supabase
    .from('retas')
    .select('organizer_id, title, current_players, max_players, status')
    .eq('id', retaId)
    .single();

  if (!matchup) return { data: null, error: 'Matchup no encontrado' };
  if (matchup.status === 'cancelled') return { data: null, error: 'Este matchup fue cancelado' };
  if (matchup.status === 'full') return { data: null, error: 'Este matchup está lleno' };
  if (matchup.current_players >= matchup.max_players)
    return { data: null, error: 'No hay lugares disponibles' };

  // Check if already joined
  const { data: existing } = await supabase
    .from('reta_players')
    .select('id')
    .eq('reta_id', retaId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return { data: null, error: 'Ya estás en este matchup' };

  // Insert player
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

  // Increment current_players and auto-set full status
  const newCount = matchup.current_players + 1;
  const updateData: Record<string, unknown> = { current_players: newCount };
  if (newCount >= matchup.max_players) {
    updateData.status = 'full';
  }
  await supabase.from('retas').update(updateData).eq('id', retaId);

  // Notify the organizer (fire-and-forget)
  const { data: joiningUser } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .maybeSingle();

  const username = joiningUser?.username ?? 'Un jugador';
  supabase
    .from('notifications')
    .insert({
      user_id: matchup.organizer_id as string,
      type: 'player_joined',
      title: 'Nuevo jugador en tu matchup',
      body: `${username} se unió a "${matchup.title}"`,
      reta_id: retaId,
    })
    .then(({ error: notifError }) => {
      if (notifError) {
        console.error('Failed to insert join notification:', notifError.message);
      }
    });

  return { data: data as RetaPlayer, error: null };
}

export async function leaveMatch(retaId: string, userId: string): Promise<ServiceResult<null>> {
  const supabase = getSupabase();

  // Don't allow organizer to leave
  const { data: player } = await supabase
    .from('reta_players')
    .select('role')
    .eq('reta_id', retaId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!player) return { data: null, error: 'No estás en este matchup' };
  if (player.role === 'organizer') return { data: null, error: 'El organizador no puede salirse' };

  const { error } = await supabase
    .from('reta_players')
    .delete()
    .eq('reta_id', retaId)
    .eq('user_id', userId);

  if (error) return { data: null, error: error.message };

  // Decrement current_players
  const { data: matchup } = await supabase
    .from('retas')
    .select('current_players, max_players')
    .eq('id', retaId)
    .single();

  if (matchup && matchup.current_players > 0) {
    const newCount = matchup.current_players - 1;
    const updateData: Record<string, unknown> = { current_players: newCount };
    if (newCount < matchup.max_players) {
      updateData.status = 'open';
    }
    await supabase.from('retas').update(updateData).eq('id', retaId);
  }

  return { data: null, error: null };
}

export async function cancelMatch(id: string): Promise<ServiceResult<Reta>> {
  return updateMatch(id, { status: 'cancelled' });
}

export async function getMyMatchups(userId: string): Promise<ServiceResult<Reta[]>> {
  const supabase = getSupabase();

  const { data: playerRows, error: playerError } = await supabase
    .from('reta_players')
    .select('reta_id')
    .eq('user_id', userId)
    .eq('status', 'confirmed');

  if (playerError) return { data: null, error: playerError.message };
  if (!playerRows || playerRows.length === 0) return { data: [], error: null };

  const retaIds = playerRows.map((r) => r.reta_id);

  const { data, error } = await supabase
    .from('retas')
    .select('*, sports(*)')
    .in('id', retaIds)
    .order('date', { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: data as unknown as Reta[], error: null };
}

export async function getSports(): Promise<ServiceResult<Sport[]>> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('sports').select('*').order('name');

  if (error) return { data: null, error: error.message };
  return { data: data as Sport[], error: null };
}
