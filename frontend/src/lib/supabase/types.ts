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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: 'retas_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'retas_organizer_id_fkey';
            columns: ['organizer_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'reta_players_reta_id_fkey';
            columns: ['reta_id'];
            isOneToOne: false;
            referencedRelation: 'retas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reta_players_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_reta_id_fkey';
            columns: ['reta_id'];
            isOneToOne: false;
            referencedRelation: 'retas';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
