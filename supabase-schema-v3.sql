-- =============================================
-- BLOG ANDREI — Migrare V3 (SAFE)
-- Rulează în Supabase > SQL Editor DUPĂ schema V2
-- =============================================

-- ==================
-- BLOCARE UTILIZATORI
-- ==================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;

-- Blochează comentariile de la utilizatorii blocați
DROP POLICY IF EXISTS "Utilizatorii autentificați pot comenta" ON comments;
DROP POLICY IF EXISTS "Utilizatorii neblocați pot comenta" ON comments;
CREATE POLICY "Utilizatorii neblocați pot comenta"
  ON comments FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_blocked = true)
  );

-- Blochează ratingurile de la utilizatorii blocați
DROP POLICY IF EXISTS "Utilizatorii autentificați pot vota" ON ratings;
DROP POLICY IF EXISTS "Utilizatorii neblocați pot vota" ON ratings;
CREATE POLICY "Utilizatorii neblocați pot vota"
  ON ratings FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_blocked = true)
  );

-- Admin poate șterge orice comentariu
DROP POLICY IF EXISTS "Utilizatorii își pot șterge comentariile" ON comments;
DROP POLICY IF EXISTS "Admin poate șterge orice comentariu" ON comments;
CREATE POLICY "Admin poate șterge orice comentariu"
  ON comments FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ==================
-- ROADMAP
-- ==================

CREATE TABLE IF NOT EXISTS roadmap_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roadmap_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES roadmap_topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Roadmap vizibil pentru toți" ON roadmap_topics;
CREATE POLICY "Roadmap vizibil pentru toți" ON roadmap_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Roadmap items vizibile pentru toți" ON roadmap_items;
CREATE POLICY "Roadmap items vizibile pentru toți" ON roadmap_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin editează roadmap topics" ON roadmap_topics;
CREATE POLICY "Admin editează roadmap topics" ON roadmap_topics FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin editează roadmap items" ON roadmap_items;
CREATE POLICY "Admin editează roadmap items" ON roadmap_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Date de exemplu (ignoră dacă există)
INSERT INTO roadmap_topics (title, description, sort_order) VALUES
  ('Stoicism', 'Filosofia stoică — de la origini la aplicații moderne', 1),
  ('Existențialism', 'De la Kierkegaard la Camus', 2),
  ('Filosofia Antică', 'Fundamentele gândirii occidentale', 3)
ON CONFLICT DO NOTHING;

-- Iteme de exemplu
DO $$
DECLARE
  _stoic UUID;
  _exist UUID;
  _antic UUID;
BEGIN
  SELECT id INTO _stoic FROM roadmap_topics WHERE title = 'Stoicism' LIMIT 1;
  SELECT id INTO _exist FROM roadmap_topics WHERE title = 'Existențialism' LIMIT 1;
  SELECT id INTO _antic FROM roadmap_topics WHERE title = 'Filosofia Antică' LIMIT 1;

  IF _stoic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roadmap_items WHERE topic_id = _stoic) THEN
    INSERT INTO roadmap_items (topic_id, title, status, sort_order) VALUES
      (_stoic, 'Marcus Aurelius — Meditații', 'done', 1),
      (_stoic, 'Seneca — Scrisori către Lucilius', 'done', 2),
      (_stoic, 'Epictet — Manualul', 'in_progress', 3),
      (_stoic, 'Ryan Holiday — The Obstacle Is the Way', 'todo', 4);
  END IF;

  IF _exist IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roadmap_items WHERE topic_id = _exist) THEN
    INSERT INTO roadmap_items (topic_id, title, status, sort_order) VALUES
      (_exist, 'Kierkegaard — Frică și tremur', 'done', 1),
      (_exist, 'Sartre — Greața', 'in_progress', 2),
      (_exist, 'Camus — Mitul lui Sisif', 'todo', 3),
      (_exist, 'Heidegger — Ființă și timp', 'todo', 4);
  END IF;

  IF _antic IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roadmap_items WHERE topic_id = _antic) THEN
    INSERT INTO roadmap_items (topic_id, title, status, sort_order) VALUES
      (_antic, 'Platon — Republica', 'done', 1),
      (_antic, 'Aristotel — Etica Nicomahică', 'in_progress', 2),
      (_antic, 'Socrate (prin Platon) — Apologia', 'done', 3),
      (_antic, 'Presocraticii', 'todo', 4);
  END IF;
END $$;

-- ==================
-- IMPORTANT: Setează-te ca admin!
-- Rulează SEPARAT după ce verifici emailul tău:
-- ==================
-- UPDATE profiles SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'emailul-tau@gmail.com');
