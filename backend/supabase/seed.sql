-- MatchUp Seed Data
-- Run with: pnpm db:seed

-- =============================================================================
-- SPORTS
-- =============================================================================

INSERT INTO sports (name, icon, default_player_count) VALUES
  ('Soccer', '⚽', 22),
  ('Basketball', '🏀', 10),
  ('Tennis', '🎾', 2),
  ('Volleyball', '🏐', 12);

-- =============================================================================
-- TEST USERS & MATCHES
-- =============================================================================
-- To add test users, first create them via Supabase Auth (Dashboard or API),
-- then insert corresponding rows into the users table:
--
--   INSERT INTO users (id, email, display_name) VALUES
--     ('<auth-user-uuid>', 'player1@example.com', 'Player One'),
--     ('<auth-user-uuid>', 'player2@example.com', 'Player Two');
--
-- After users exist, you can seed matches:
--
--   INSERT INTO matches (organizer_id, title, sport, location_name, latitude, longitude, starts_at, ends_at, max_players, status) VALUES
--     ('<user-uuid>', 'Sunday Soccer', 'Soccer', 'Central Park', 40.785091, -73.968285, now() + interval '1 day', now() + interval '1 day 2 hours', 22, 'open');
