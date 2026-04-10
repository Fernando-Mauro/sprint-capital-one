export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  skill_level: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface Sport {
  id: string;
  name: string;
  icon_url: string | null;
  min_players: number;
  max_players: number | null;
  team_based: boolean;
  description: string | null;
}

export interface Reta {
  id: string;
  title: string;
  sport_id: string;
  organizer_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  date: string;
  start_time: string;
  end_time: string | null;
  max_players: number;
  current_players: number;
  min_skill_level: string | null;
  status: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
  // Joined fields
  sports?: Sport;
  organizer?: UserProfile;
}

export interface RetaPlayer {
  id: string;
  reta_id: string;
  user_id: string;
  role: string;
  team: string | null;
  status: string;
  joined_at: string;
  // Joined fields
  users?: UserProfile;
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export type NotificationType = 'reta_full' | 'reta_reminder' | 'player_joined' | 'reta_cancelled';
