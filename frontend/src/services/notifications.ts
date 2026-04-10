import { createBrowserClient } from '@/lib/supabase/client';

import type { ServiceResult, NotificationType } from '@/types';

const supabase = createBrowserClient();

interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  reta_id: string | null;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(userId: string): Promise<ServiceResult<Notification[]>> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as Notification[], error: null };
}

export async function markAsRead(notificationIds: string[]): Promise<ServiceResult<null>> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .in('id', notificationIds);

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

export async function createNotification(input: {
  user_id: string;
  type: string;
  title: string;
  body?: string;
  reta_id?: string;
}): Promise<ServiceResult<Notification>> {
  const { data, error } = await supabase.from('notifications').insert(input).select().single();

  if (error) return { data: null, error: error.message };
  return { data: data as Notification, error: null };
}
