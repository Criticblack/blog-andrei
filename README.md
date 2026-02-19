# Blog Andrei — Gânduri tare, opinii sincere

Blog personal construit cu Next.js + Supabase. Design inspirat de nuanțele lui Goya.

## Stack

- **Frontend:** Next.js 14 (App Router, React)
- **Backend/DB:** Supabase (PostgreSQL + Auth + API)
- **Hosting:** Vercel (free tier)
- **Video:** YouTube embed
- **Styling:** CSS custom (fără framework)

## Setup rapid — 5 pași

### 1. Instalează dependențele

```bash
npm install
```

### 2. Setup Supabase

1. Creează cont gratuit pe [supabase.com](https://supabase.com)
2. Creează un proiect nou
3. Du-te la **SQL Editor** și rulează conținutul din `supabase-schema.sql`
4. Du-te la **Authentication > Users** și creează-ți un user (ăsta va fi adminul)
5. Du-te la **Project Settings > API** și copiază:
   - Project URL
   - anon/public key

### 3. Configurează environment variables

```bash
cp .env.local.example .env.local
```

Editează `.env.local` cu valorile de la Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxx
```

### 4. Pornește local

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) — blogul.
Deschide [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — admin panel.

### 5. Deploy pe Vercel

1. Push proiectul pe GitHub
2. Du-te la [vercel.com](https://vercel.com) și importă repo-ul
3. Adaugă environment variables (aceleași din `.env.local`)
4. Deploy!

## Cumpără domeniu

Recomandat: **Cloudflare Registrar** (cele mai mici prețuri, fără markup).

Idei de domeniu:
- `andrei.md` (domeniul Moldovei!)
- `ganduritare.ro`
- `andreistreams.com`

După cumpărare, adaugă domeniul în Vercel > Project > Settings > Domains.

## Structura proiectului

```
src/
  app/
    page.js              → Homepage (server component, fetch posts)
    HomeClient.js        → Homepage UI (client component)
    layout.js            → Root layout + metadata
    globals.css          → Stiluri globale (tema Goya)
    post/[slug]/
      page.js            → Pagina individuală post (server)
      PostContent.js     → Post UI cu markdown + YouTube embed
    admin/
      page.js            → Dashboard admin (CRUD)
      login/page.js      → Login admin
      new/page.js        → Creează postare nouă
      edit/[id]/page.js  → Editează postare existentă
  components/
    Logo.js              → Logo SVG
    Navbar.js            → Navbar sticky cu blur
    PostCard.js          → Card postare pentru feed
    PostEditor.js        → Editor postare (new + edit)
    VideoPlayer.js       → Player video cu YouTube embed
    BrushElements.js     → Elemente decorative Goya (brush strokes, paint texture)
    Reveal.js            → Scroll reveal animation
  lib/
    supabase.js          → Client Supabase
```

## Cum funcționează

### Blogul (public)
- Homepage-ul fetch-uiește postările din Supabase (server-side, cached 60s)
- Fiecare postare are pagina ei la `/post/slug-ul-postarii`
- Postările video embed-uiesc YouTube automat
- Conținutul postărilor e scris în Markdown

### Admin panel (`/admin`)
- Protejat cu Supabase Auth (email + parolă)
- CRUD complet: creează, editează, șterge postări
- Toggle draft/publicat
- Auto-generare slug din titlu
- Editor Markdown cu preview tags

### Row Level Security
- Vizitatorii văd doar postările publicate (draft = false)
- Adminul (autentificat) vede tot și poate modifica

## Personalizare

### Schimbă culorile
Editează variabilele CSS din `globals.css`:
```css
:root {
  --bg: #f5f2ec;        /* Fundal principal */
  --accent: #8b4513;    /* Accent (sienna) */
  --accent-soft: #8b7355; /* Accent moale */
  --text: #3a3224;      /* Text principal */
  /* ... */
}
```

### Schimbă citatul Goya
Editează în `HomeClient.js`, secțiunea "GOYA QUOTE".

### Schimbă bio-ul
Editează secțiunea "ABOUT" din `HomeClient.js`.

### Adaugă linkuri sociale
Editează linkurile din secțiunile About și Footer.
