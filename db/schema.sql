-- Habilitar extensión para UUIDs (Mejor práctica para seguridad y escalabilidad)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  skill_level TEXT, -- beginner, intermediate, advanced
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 2. Tabla de Deportes (Catálogo)
CREATE TABLE sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, -- Ej: Futbol, Basquetbol
  icon_url TEXT,
  min_players INT NOT NULL,
  max_players INT,
  team_based BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla de Retas (Canchas integradas aquí para ahorrar tiempo)
CREATE TABLE retas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Datos de la Cancha directamente en la Reta (MVP Hackathon)
  location_name TEXT NOT NULL, 
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  -- Datos del partido
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  max_players INT NOT NULL,
  current_players INT DEFAULT 1,
  min_skill_level TEXT,
  status TEXT DEFAULT 'open', -- open, full, in_progress, completed, cancelled
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 4. Jugadores en la Reta (Relación Usuarios-Retas)
CREATE TABLE reta_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reta_id UUID REFERENCES retas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'player', -- organizer, player
  team TEXT, -- team_a, team_b (Opcional por ahora)
  -- NOTA: Se agregó 'kicked' a los status
  status TEXT DEFAULT 'confirmed', -- confirmed, pending, declined, no_show, kicked
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(reta_id, user_id) -- Un usuario no puede unirse dos veces a la misma reta
);

-- 5. Notificaciones (Mantenido a petición tuya)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- reta_full, reta_reminder, player_joined, reta_cancelled
  title TEXT NOT NULL,
  body TEXT,
  reta_id UUID REFERENCES retas(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Chat de la Reta
CREATE TABLE reta_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reta_id UUID REFERENCES retas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- ⚠️ HACKATHON MODE: Desactivar Row Level Security (RLS)
-- Esto permite que tu Frontend de Next.js lea y escriba sin errores 401.
-- ¡Solo para el Hackathon!
-- ==========================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sports DISABLE ROW LEVEL SECURITY;
ALTER TABLE retas DISABLE ROW LEVEL SECURITY;
ALTER TABLE reta_players DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE reta_chat DISABLE ROW LEVEL SECURITY;
-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE retas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reta_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

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

-- ---- retas ----
CREATE POLICY "Retas: anyone authenticated can read"
  ON retas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Retas: authenticated can create"
  ON retas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Retas: organizer can update"
  ON retas FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Retas: organizer can delete"
  ON retas FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- ---- reta_players ----
CREATE POLICY "Reta players: anyone authenticated can read"
  ON reta_players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Reta players: can join (insert own)"
  ON reta_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Reta players: can leave (delete own)"
  ON reta_players FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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

CREATE POLICY "Notifications: authenticated can insert"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
