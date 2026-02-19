-- =============================================
-- BLOG ANDREI — Migrare V2
-- Rulează asta în Supabase > SQL Editor DUPĂ schema inițială
-- =============================================

-- ==================
-- CATEGORII
-- ==================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorii vizibile pentru toți"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admin poate gestiona categorii"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categorii default
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Blog', 'blog', 'Texte și gânduri scrise', 1),
  ('Streamuri', 'streamuri', 'Înregistrări video de pe stream', 2),
  ('Poezii', 'poezii', 'Versuri și poezie', 3);

-- Adaugă category_id la posts
ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES categories(id);

-- Setează categoria default pentru postările existente
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'blog') WHERE type = 'text';
UPDATE posts SET category_id = (SELECT id FROM categories WHERE slug = 'streamuri') WHERE type = 'video';

-- ==================
-- TAG-URI (tabel separat pentru management)
-- ==================
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tag-uri vizibile pentru toți"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Admin poate gestiona tag-uri"
  ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inserează tag-urile existente din postări
INSERT INTO tags (name, slug)
SELECT DISTINCT unnest(tags), lower(replace(unnest(tags), ' ', '-'))
FROM posts
ON CONFLICT (name) DO NOTHING;

-- ==================
-- PROFILURI UTILIZATORI (pentru comentarii)
-- ==================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiluri vizibile pentru toți"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Utilizatorii își pot edita profilul"
  ON profiles FOR UPDATE USING (auth.uid() = id);

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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==================
-- COMENTARII
-- ==================
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentarii vizibile pentru toți"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Utilizatorii autentificați pot comenta"
  ON comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii își pot șterge comentariile"
  ON comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admin poate șterge orice comentariu (verifică manual dacă e admin)
-- Alternativ, poți adăuga un câmp is_admin în profiles

-- ==================
-- RATING-URI
-- ==================
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_ratings_post ON ratings(post_id);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rating-uri vizibile pentru toți"
  ON ratings FOR SELECT USING (true);

CREATE POLICY "Utilizatorii autentificați pot vota"
  ON ratings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii își pot modifica votul"
  ON ratings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ==================
-- ACTIVEAZĂ GOOGLE AUTH
-- ==================
-- Du-te în Supabase Dashboard:
-- Authentication > Providers > Google > Enable
-- Adaugă Client ID și Secret de la Google Cloud Console
-- (sau folosește doar Email login — funcționează fără config extra)
