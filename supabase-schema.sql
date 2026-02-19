-- =============================================
-- BLOG ANDREI — Schema Supabase
-- Rulează asta în Supabase > SQL Editor
-- =============================================

-- Tabelul principal pentru postări
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video')),
  youtube_url TEXT,
  duration TEXT,
  tags TEXT[] DEFAULT '{}',
  draft BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pentru slug (căutare rapidă)
CREATE INDEX idx_posts_slug ON posts(slug);

-- Index pentru feed (sortare + filtrare)
CREATE INDEX idx_posts_feed ON posts(draft, published_at DESC);

-- Funcție pentru auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Oricine poate citi postări publicate (nu draft)
CREATE POLICY "Postări publice vizibile pentru toți"
  ON posts FOR SELECT
  USING (draft = false);

-- Utilizatorii autentificați pot vedea TOATE postările (inclusiv draft)
CREATE POLICY "Admin vede toate postările"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Doar autentificații pot insera
CREATE POLICY "Admin poate crea postări"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Doar autentificații pot edita
CREATE POLICY "Admin poate edita postări"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Doar autentificații pot șterge
CREATE POLICY "Admin poate șterge postări"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- DATE DE TEST (opțional — șterge după)
-- =============================================

INSERT INTO posts (title, slug, description, content, type, youtube_url, duration, tags, draft, published_at) VALUES
(
  'De ce ne mințim singuri?',
  'de-ce-ne-mintim-singuri',
  'Am vorbit pe stream despre self-deception și cum ne construim narativele convenabile. Când te minți pe tine, nimeni nu te poate ajuta — nici măcar tu.',
  '## Self-deception

Toți o facem. Ne spunem povești frumoase despre noi înșine, ne convingem că alegem **corect**, că suntem victimele circumstanțelor.

Dar dacă stai să te gândești — cât din ce crezi despre tine e adevărat și cât e construcție?

> „Cel mai greu lucru din lume e să fii sincer cu tine însuți." — probabil cineva înțelept

### De ce ne mințim?

Creierul nostru e optimizat pentru **supraviețuire**, nu pentru adevăr. E mult mai confortabil să crezi că ești victima decât să accepți că ai luat decizii proaste.

### Cum ieși din ciclul ăsta?

Sincer? Nu e ușor. Dar primul pas e să **observi** când o faci. Când simți rezistență la o idee — explorează de ce.',
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '34:12',
  ARRAY['psihologie', 'onestitate'],
  false,
  '2026-02-15T10:00:00Z'
),
(
  'Disciplina nu e motivație',
  'disciplina-nu-e-motivatie',
  'Toată lumea vorbește despre motivație dar nimeni nu-ți zice că motivația e cel mai nesigur lucru pe care poți construi.',
  '## Motivația e o minciună

Ok, poate nu o **minciună**. Dar e cel mai nesigur fundament pe care poți construi ceva.

Motivația vine și pleacă. E ca vremea — nu poți controla când apare.

### Ce funcționează de fapt?

**Sisteme.** Rutine. Obiceiuri mici, repetate zilnic.

Nu aștepți să-ți vină chef să mergi la sală. Pur și simplu mergi. La fel cum nu aștepți motivația să te speli pe dinți dimineața.

> Disciplina e libertate. Pare paradoxal, dar cu cât ești mai disciplinat, cu atât ai mai mult control asupra vieții tale.',
  'text',
  NULL,
  NULL,
  ARRAY['disciplină', 'productivitate'],
  false,
  '2026-02-10T10:00:00Z'
),
(
  'Stoicismul e supraevaluat?',
  'stoicismul-e-supraevaluat',
  'Hot take: stoicismul a devenit self-help de Instagram. Quote-uri pe fundal de munte nu te fac stoic.',
  'Am discutat pe stream despre cum stoicismul modern a pierdut esența filosofiei originale.

Marcus Aurelius nu scria **Meditațiile** pentru likes. Le scria pentru el, într-un cort, în mijlocul războiului.

Diferența între stoicismul de Instagram și cel real? **Practica.**',
  'video',
  NULL,
  '47:05',
  ARRAY['stoicism', 'hot take'],
  false,
  '2026-02-05T10:00:00Z'
),
(
  'Libertate vs confort',
  'libertate-vs-confort',
  'De fiecare dată când aleg confortul, renunț la un pic de libertate.',
  '## O observație simplă

Nu e nimic profund aici. E doar ceva ce am observat într-o dimineață de luni.

Fiecare alegere confortabilă — să stai în pat, să comanzi mâncare, să eviți o conversație dificilă — e un mic compromis cu libertatea ta.

Cu cât alegi mai des confortul, cu atât spațiul tău de acțiune se micșorează.

**Nu zic că trebuie să fii masochist.** Dar merită să fii conștient de trade-off.',
  'text',
  NULL,
  NULL,
  ARRAY['libertate', 'reflecție'],
  false,
  '2026-01-28T10:00:00Z'
);
