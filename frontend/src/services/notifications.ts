import type { ServiceResult, NotificationType } from '@/types';

interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | undefined;
}

export async function getNotifications(_userId: string): Promise<ServiceResult<Notification[]>> {
  // TODO: Query Supabase for user notifications, ordered by created_at desc
  return { data: null, error: 'Not implemented' };
}

export async function markAsRead(_notificationIds: string[]): Promise<ServiceResult<null>> {
  // TODO: Update notifications to read = true
  return { data: null, error: 'Not implemented' };
}

export async function createNotification(
  _input: CreateNotificationInput,
): Promise<ServiceResult<Notification>> {
  // TODO: Insert notification into Supabase
  return { data: null, error: 'Not implemented' };
}
