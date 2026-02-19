-- =============================================
-- BLOG ANDREI — Migrare V2 (SAFE — nu dă eroare dacă există deja)
-- Rulează asta în Supabase > SQL Editor
-- =============================================

-- ==================
-- CATEGORII
-- ==================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categorii vizibile pentru toți" ON categories;
CREATE POLICY "Categorii vizibile pentru toți"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin poate gestiona categorii" ON categories;
CREATE POLICY "Admin poate gestiona categorii"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categorii default (ignoră dacă există deja)
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Blog', 'blog', 'Texte și gânduri scrise', 1),
  ('Streamuri', 'streamuri', 'Înregistrări video de pe stream', 2),
  ('Poezii', 'poezii', 'Versuri și poezie', 3)
ON CONFLICT (slug) DO NOTHING;

-- Adaugă category_id la posts (ignoră dacă există)
DO $$ BEGIN
  ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES categories(id);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Setează categoria default pentru postările existente
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'blog') WHERE type = 'text' AND category_id IS NULL;
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'streamuri') WHERE type = 'video' AND category_id IS NULL;

-- ==================
-- TAG-URI
-- ==================
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tag-uri vizibile pentru toți" ON tags;
CREATE POLICY "Tag-uri vizibile pentru toți"
  ON tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin poate gestiona tag-uri" ON tags;
CREATE POLICY "Admin poate gestiona tag-uri"
  ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inserează tag-urile existente din postări
INSERT INTO tags (name, slug)
SELECT DISTINCT unnest(tags), lower(replace(unnest(tags), ' ', '-'))
FROM posts
ON CONFLICT (name) DO NOTHING;

-- ==================
-- PROFILURI UTILIZATORI
-- ==================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiluri vizibile pentru toți" ON profiles;
CREATE POLICY "Profiluri vizibile pentru toți"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Utilizatorii își pot edita profilul" ON profiles;
CREATE POLICY "Utilizatorii își pot edita profilul"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Utilizatorii își pot crea profilul" ON profiles;
CREATE POLICY "Utilizatorii își pot crea profilul"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-creează profil la signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Creează profil pentru userul admin existent (dacă nu are)
INSERT INTO profiles (id, display_name)
SELECT id, split_part(email, '@', 1)
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT DO NOTHING;

-- ==================
-- COMENTARII
-- ==================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comentarii vizibile pentru toți" ON comments;
CREATE POLICY "Comentarii vizibile pentru toți"
  ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Utilizatorii autentificați pot comenta" ON comments;
CREATE POLICY "Utilizatorii autentificați pot comenta"
  ON comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Utilizatorii își pot șterge comentariile" ON comments;
CREATE POLICY "Utilizatorii își pot șterge comentariile"
  ON comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ==================
-- RATING-URI
-- ==================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_post ON ratings(post_id);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Rating-uri vizibile pentru toți" ON ratings;
CREATE POLICY "Rating-uri vizibile pentru toți"
  ON ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Utilizatorii autentificați pot vota" ON ratings;
CREATE POLICY "Utilizatorii autentificați pot vota"
  ON ratings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Utilizatorii își pot modifica votul" ON ratings;
CREATE POLICY "Utilizatorii își pot modifica votul"
  ON ratings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
