'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import VideoPlayer from '@/components/VideoPlayer';
import Reveal from '@/components/Reveal';
import Logo from '@/components/Logo';
import Roadmap from '@/components/Roadmap';
import { BrushStroke, BrushDivider, PaintTexture } from '@/components/BrushElements';

export default function HomeClient({ posts, categories = [] }) {
  const [filter, setFilter] = useState('all');
  const [loaded, setLoaded] = useState(false);

  useState(() => { setTimeout(() => setLoaded(true), 100); });

  const featured = posts[0];
  const rest = posts.slice(1);
  const filtered = filter === 'all' ? rest : rest.filter(p => p.categories?.slug === filter || p.type === filter);
  const featYtId = featured?.youtube_url ? extractYoutubeId(featured.youtube_url) : null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* BG decorations */}
      <PaintTexture style={{ zIndex: 0, opacity: 0.5, position: 'fixed' }} />
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%', width: '50vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(139,115,85,0.05) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Navbar />

      {/* HERO */}
      {featured && (
        <header className="container" style={{ paddingTop: 44, position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 52, alignItems: 'center',
          }}>
            <div style={{
              opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)',
              transition: 'all 0.9s cubic-bezier(.22,1,.36,1) 0.15s',
            }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <BrushStroke width={40} color="#8b4513" opacity={0.4} />
                Ultimul {featured.type === 'video' ? 'stream' : 'text'}
              </div>
              <h1 style={{
                fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 400,
                lineHeight: 1.15, color: 'var(--text)', marginBottom: 18, letterSpacing: '-0.02em',
              }}>
                {featured.title}
              </h1>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.8,
                color: 'var(--text-3)', maxWidth: 400, marginBottom: 28,
              }}>
                {featured.description}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {featured.tags?.map(t => (
                  <span key={t} className="tag">#{t}</span>
                ))}
                {featured.duration && (
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 14px',
                    borderRadius: 20, background: 'var(--text)', color: 'var(--bg)',
                  }}>▶ {featured.duration}</span>
                )}
              </div>
            </div>

            <div style={{
              opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)',
              transition: 'all 0.9s cubic-bezier(.22,1,.36,1) 0.35s',
            }}>
              {featured.type === 'video' ? (
                <VideoPlayer duration={featured.duration} large youtubeId={featYtId} />
              ) : (
                <div style={{
                  background: 'linear-gradient(145deg, #ddd6c8, #cec6b4)',
                  borderRadius: 14, aspectRatio: '16/9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <PaintTexture />
                  <span style={{
                    fontFamily: 'var(--serif)', fontSize: 64, fontStyle: 'italic',
                    color: '#8a8070', opacity: 0.3,
                  }}>✍</span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* INTRO STRIP */}
      <Reveal>
        <div className="container" style={{ marginTop: 48 }}>
          <BrushDivider />
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '12px 0' }}>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic',
              lineHeight: 1.6, color: 'var(--text-3)', flex: 1, textAlign: 'center',
            }}>
              Nu sunt filosof. Sunt doar un tip care gândește mult, 
              streamuiește uneori, și scrie ce-i trece prin cap.
            </p>
          </div>
          <BrushDivider style={{ transform: 'scaleX(-1)' }} />
        </div>
      </Reveal>

      {/* POSTS */}
      <section className="container" style={{ paddingTop: 44, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32 }}>
            <div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <BrushStroke width={28} color="#8b7355" opacity={0.3} />
                Explorează
              </div>
              <h2 style={{
                fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 400, color: 'var(--text)',
              }}>Toate postările</h2>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[['all', 'Toate'], ['text', '✍ Text'],
                ...categories.map(c => [c.slug, c.name])
              ].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`filter-btn ${filter === k ? 'active' : ''}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06}>
              <PostCard post={post} />
            </Reveal>
          ))}

          {filtered.length === 0 && (
            <p style={{
              textAlign: 'center', padding: 60, color: 'var(--text-muted)',
              fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic',
            }}>
              Nicio postare de acest tip încă.
            </p>
          )}
        </div>
      </section>

      {/* GOYA QUOTE */}
      <Reveal>
        <div style={{
          background: 'var(--goya-section-bg)',
          padding: '72px 40px', position: 'relative', overflow: 'hidden',
        }}>
          <PaintTexture style={{ opacity: 1.5 }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
          }} />
          <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: 'var(--goya-label)', marginBottom: 24,
            }}>Francisco Goya</div>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 300,
              fontStyle: 'italic', lineHeight: 1.45, color: 'var(--goya-text)', marginBottom: 20,
            }}>
              „Somnul rațiunii naște monștri."
            </p>
            <BrushStroke width={120} color="var(--goya-label)" opacity={0.3} style={{ margin: '0 auto 20px' }} />
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.7,
              color: 'var(--goya-sub)', maxWidth: 480, margin: '0 auto',
            }}>
              Când nu mai gândim critic, când ne lăsăm pe pilot automat, 
              monștrii ies la suprafață. De asta fac ce fac aici — ca să rămân treaz.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ROADMAP */}
      <Roadmap />

      {/* ABOUT */}
      <section id="despre" className="container about-grid" style={{
        paddingTop: 64, paddingBottom: 64,
        display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: 48, alignItems: 'start',
      }}>
        <Reveal>
          <div>
            <div style={{
              width: 100, height: 100, borderRadius: 18,
              background: 'linear-gradient(145deg, var(--border), var(--border-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20, position: 'relative',
              boxShadow: 'inset 0 3px 14px var(--shadow), 0 6px 20px var(--shadow)',
              overflow: 'hidden',
            }}>
              <PaintTexture />
              <span style={{
                fontFamily: 'var(--serif)', fontSize: 44, fontStyle: 'italic',
                color: 'var(--text-3)', position: 'relative', zIndex: 1,
              }}>a</span>
              <div style={{
                position: 'absolute', bottom: -3, right: -3,
                width: 22, height: 22, borderRadius: 6,
                background: 'var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'var(--bg)', fontSize: 10 }}>✦</span>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, color: 'var(--text)', marginBottom: 4 }}>
              Andrei
            </h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              Developer · Moldova
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.85,
              color: 'var(--text-2)', marginBottom: 16,
            }}>
              Gândesc mult, streamuiesc ocazional. Discut despre filosofie, 
              disciplină, onestitate cu sine, și cum să nu te amăgești. 
              Nu am pretenția că știu mai mult decât tine — doar procesez totul cu voce tare.
            </p>
            <BrushStroke width={160} color="#8b7355" opacity={0.25} style={{ marginBottom: 16 }} />
            <p style={{
              fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic',
              color: 'var(--text-3)', lineHeight: 1.6,
            }}>
              „Nu pretind că am răspunsuri. Am doar întrebări mai bune decât aveam ieri."
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
              {['YouTube', 'Twitch', 'Twitter', 'GitHub'].map(l => (
                <a key={l} className="nav-link">{l}</a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div style={{
            background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 14,
            padding: '24px 26px', position: 'relative', overflow: 'hidden',
          }}>
            <PaintTexture style={{ opacity: 0.3 }} />
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 9, textTransform: 'uppercase',
              letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: 18,
              display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
            }}>
              <BrushStroke width={16} color="#8b4513" opacity={0.5} />
              Teme
            </div>
            {['Filosofie practică', 'Disciplină', 'Onestitate radicală', 'Sens & scop', 'Stream Q&A'].map((t, i) => (
              <div key={i} style={{
                fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)',
                padding: '9px 0', position: 'relative',
                borderBottom: i < 4 ? '1px solid var(--border-light)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ color: 'var(--accent)', fontSize: 6 }}>●</span>
                {t}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
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

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/);
  return match ? match[1] : null;
}
