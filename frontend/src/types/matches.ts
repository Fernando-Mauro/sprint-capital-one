export type MatchStatus = 'draft' | 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';

export type ParticipantStatus = 'joined' | 'waitlisted' | 'cancelled';

export interface Match {
  id: string;
  organizer_id: string;
  title: string;
  sport: string;
  location_name: string;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at: string;
  max_players: number;
  status: MatchStatus;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface MatchParticipant {
  id: string;
  match_id: string;
  user_id: string;
  status: ParticipantStatus;
  joined_at: string;
}

export interface CreateMatchInput {
  title: string;
  sport: string;
  location_name: string;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at: string;
  max_players: number;
  description?: string | undefined;
}

export interface UpdateMatchInput {
  title?: string | undefined;
  sport?: string | undefined;
  location_name?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  starts_at?: string | undefined;
  ends_at?: string | undefined;
  max_players?: number | undefined;
  description?: string | undefined;
  status?: MatchStatus | undefined;
}
