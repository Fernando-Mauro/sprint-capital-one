export type { Reta as Match } from './database';
export type { RetaPlayer as MatchParticipant } from './database';
export type { Sport } from './database';
export type { MatchStatus, ParticipantStatus } from './database';

import type { MatchStatus } from './database';

export interface CreateMatchInput {
  title: string;
  sport_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  date: string;
  start_time: string;
  end_time?: string;
  max_players: number;
  min_skill_level?: string;
  description?: string;
  is_private?: boolean;
}

export interface UpdateMatchInput {
  title?: string;
  sport_id?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  max_players?: number;
  min_skill_level?: string;
  description?: string;
  is_private?: boolean;
  status?: MatchStatus;
}
