export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export type NotificationType =
  | 'match_joined'
  | 'match_cancelled'
  | 'match_starting'
  | 'match_full'
  | 'new_message';
