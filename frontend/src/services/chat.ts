import { createBrowserClient } from '@/lib/supabase/client';
import type { ServiceResult, RetaChatMessage } from '@/types';

const supabase = createBrowserClient();

export async function getChatMessages(retaId: string): Promise<ServiceResult<RetaChatMessage[]>> {
  try {
    const { data, error } = await supabase
      .from('reta_chat')
      .select('*, users(username, avatar_url)')
      .eq('reta_id', retaId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching chat messages';
    console.error('Error fetching chat messages:', err);
    return { data: null, error: message };
  }
}

export async function sendChatMessage(
  retaId: string,
  userId: string,
  message: string,
): Promise<ServiceResult<RetaChatMessage>> {
  try {
    const { data, error } = await supabase
      .from('reta_chat')
      .insert([
        {
          reta_id: retaId,
          user_id: userId,
          message: message,
        },
      ])
      .select('*, users(username, avatar_url)')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error sending message';
    console.error('Error sending message:', err);
    return { data: null, error: message };
  }
}

export function subscribeToChat(retaId: string, onMessage: (message: RetaChatMessage) => void) {
  return supabase
    .channel(`reta_chat:${retaId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reta_chat',
        filter: `reta_id=eq.${retaId}`,
      },
      async (payload: { new: Record<string, unknown> }) => {
        // Fetch user data for the new message as Realtime payload only includes the row
        const { data } = await supabase
          .from('reta_chat')
          .select('*, users(username, avatar_url)')
          .eq('id', payload.new.id)
          .single();

        if (data) onMessage(data);
      },
    )
    .subscribe();
}
