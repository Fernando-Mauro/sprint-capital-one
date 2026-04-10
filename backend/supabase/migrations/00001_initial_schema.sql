-- MatchUp Initial Schema
-- Migration: 00001_initial_schema
-- Creates all core tables, enums, indexes, and RLS policies.

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE match_status AS ENUM (
  'draft',
  'open',
  'full',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE participant_status AS ENUM (
  'joined',
  'waitlisted',
  'cancelled'
);

CREATE TYPE notification_type AS ENUM (
  'match_joined',
  'match_cancelled',
  'match_starting',
  'match_full',
  'new_message'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- User profiles (linked to Supabase Auth)
CREATE TABLE users (
  id         uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  bio        text,
  location   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sport types
CREATE TABLE sports (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text UNIQUE NOT NULL,
  icon                 text,
  default_player_count integer
);

-- Pick-up match events
CREATE TABLE matches (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id  uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  title         text NOT NULL,
  sport         text NOT NULL,
  location_name text NOT NULL,
  latitude      double precision NOT NULL,
  longitude     double precision NOT NULL,
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  max_players   integer NOT NULL,
  status        match_status NOT NULL DEFAULT 'draft',
  description   text,
  image_url     text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Users joined to matches
CREATE TABLE match_participants (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id  uuid NOT NULL REFERENCES matches ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  status    participant_status NOT NULL DEFAULT 'joined',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, user_id)
);

-- In-match chat messages
CREATE TABLE match_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id   uuid NOT NULL REFERENCES matches ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User notifications
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      text NOT NULL,
  body       text NOT NULL,
  data       jsonb,
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Uploaded images/files (S3 references)
CREATE TABLE media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  match_id   uuid REFERENCES matches ON DELETE SET NULL,
  s3_key     text NOT NULL,
  url        text NOT NULL,
  type       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_matches_organizer   ON matches (organizer_id);
CREATE INDEX idx_matches_sport       ON matches (sport);
CREATE INDEX idx_matches_status      ON matches (status);
CREATE INDEX idx_matches_starts_at   ON matches (starts_at);

CREATE INDEX idx_participants_match  ON match_participants (match_id);
CREATE INDEX idx_participants_user   ON match_participants (user_id);

CREATE INDEX idx_messages_match      ON match_messages (match_id);
CREATE INDEX idx_messages_created    ON match_messages (match_id, created_at);

CREATE INDEX idx_notifications_user  ON notifications (user_id);
CREATE INDEX idx_notifications_read  ON notifications (user_id, read);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE media              ENABLE ROW LEVEL SECURITY;

-- ---- users ----
CREATE POLICY "Users: anyone authenticated can read profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users: can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users: can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ---- sports ----
CREATE POLICY "Sports: anyone authenticated can read"
  ON sports FOR SELECT
  TO authenticated
  USING (true);

-- ---- matches ----
CREATE POLICY "Matches: anyone authenticated can read"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Matches: authenticated can create"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Matches: organizer can update"
  ON matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Matches: organizer can delete"
  ON matches FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- ---- match_participants ----
CREATE POLICY "Participants: anyone authenticated can read"
  ON match_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Participants: can join (insert own)"
  ON match_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants: can leave (delete own)"
  ON match_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---- match_messages ----
CREATE POLICY "Messages: participants can read"
  ON match_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM match_participants
      WHERE match_participants.match_id = match_messages.match_id
        AND match_participants.user_id = auth.uid()
        AND match_participants.status = 'joined'
    )
  );

CREATE POLICY "Messages: participants can send"
  ON match_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM match_participants
      WHERE match_participants.match_id = match_messages.match_id
        AND match_participants.user_id = auth.uid()
        AND match_participants.status = 'joined'
    )
    AND auth.uid() = user_id
  );

-- ---- notifications ----
CREATE POLICY "Notifications: can read own"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Notifications: can update own (mark read)"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---- media ----
CREATE POLICY "Media: anyone authenticated can read"
  ON media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Media: can upload own"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Media: can delete own"
  ON media FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
