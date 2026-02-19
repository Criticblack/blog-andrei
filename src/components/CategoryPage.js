'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import Reveal from '@/components/Reveal';
import Logo from '@/components/Logo';
import { BrushStroke, BrushDivider, PaintTexture } from '@/components/BrushElements';

export default function CategoryPage({ category, posts, allTags = [] }) {
  const [activeTag, setActiveTag] = useState(null);

  const filtered = activeTag
    ? posts.filter(p => p.tags?.includes(activeTag))
    : posts;

  // Colectează toate tag-urile unice din postările din categoria asta
  const tagSet = new Set();
  posts.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
  const tags = Array.from(tagSet).sort();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <PaintTexture style={{ zIndex: 0, opacity: 0.5, position: 'fixed' }} />
      <Navbar />

      <header className="container" style={{ paddingTop: 48, paddingBottom: 8 }}>
        <Reveal>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <BrushStroke width={40} color="#8b4513" opacity={0.4} />
            {category.name}
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 400,
            color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.02em',
          }}>
            {category.name}
          </h1>
          {category.description && (
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.7,
              color: 'var(--text-3)', maxWidth: 500,
            }}>
              {category.description}
            </p>
          )}
        </Reveal>

        {/* Tag filters */}
        {tags.length > 0 && (
          <Reveal delay={0.08}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 24 }}>
              <button
                className={`filter-btn ${!activeTag ? 'active' : ''}`}
                onClick={() => setActiveTag(null)}
              >
                Toate ({posts.length})
              </button>
              {tags.map(t => (
                <button key={t}
                  className={`filter-btn ${activeTag === t ? 'active' : ''}`}
                  onClick={() => setActiveTag(activeTag === t ? null : t)}
                >
                  #{t}
                </button>
              ))}
            </div>
          </Reveal>
        )}
      </header>

      <BrushDivider style={{ maxWidth: 1100, margin: '20px auto 0', padding: '0 40px' }} />

      <section className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <PostCard post={post} />
            </Reveal>
          ))}

          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: 80, color: 'var(--text-muted)',
            }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic', marginBottom: 8 }}>
                Nicio postare {activeTag ? `cu tag-ul #${activeTag}` : 'în această categorie'} încă.
              </p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-light)' }}>
                Urmează să adaug conținut nou în curând.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer style={{ borderTop: '1.5px solid #ddd6c8', background: 'var(--bg-alt)' }}>
        <div className="container footer-inner" style={{
          padding: '28px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-light)' }}>
              © {new Date().getFullYear()} Andrei
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic', color: 'var(--text-light)',
          }}>
            făcut cu cafea și întrebări existențiale
          </span>
        </div>
      </footer>
    </div>
  );
}
