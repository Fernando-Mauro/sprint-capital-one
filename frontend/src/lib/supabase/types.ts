export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          skill_level?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          skill_level?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          updated_at?: string | null;
        };
      };
      sports: {
        Row: {
          id: string;
          name: string;
          icon_url: string | null;
          min_players: number;
          max_players: number | null;
          team_based: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon_url?: string | null;
          min_players: number;
          max_players?: number | null;
          team_based?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          icon_url?: string | null;
          min_players?: number;
          max_players?: number | null;
          team_based?: boolean;
          description?: string | null;
        };
      };
      retas: {
        Row: {
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
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          sport_id: string;
          organizer_id: string;
          location_name: string;
          latitude: number;
          longitude: number;
          date: string;
          start_time: string;
          end_time?: string | null;
          max_players: number;
          current_players?: number;
          min_skill_level?: string | null;
          status?: string;
          description?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          title?: string;
          sport_id?: string;
          location_name?: string;
          latitude?: number;
          longitude?: number;
          date?: string;
          start_time?: string;
          end_time?: string | null;
          max_players?: number;
          current_players?: number;
          min_skill_level?: string | null;
          status?: string;
          description?: string | null;
          is_private?: boolean;
          updated_at?: string | null;
        };
      };
      reta_players: {
        Row: {
          id: string;
          reta_id: string;
          user_id: string;
          role: string;
          team: string | null;
          status: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          reta_id: string;
          user_id: string;
          role?: string;
          team?: string | null;
          status?: string;
          joined_at?: string;
        };
        Update: {
          role?: string;
          team?: string | null;
          status?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          reta_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          reta_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
