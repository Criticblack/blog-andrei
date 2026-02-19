'use client';

import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import Reveal from '@/components/Reveal';
import { BrushStroke, BrushDivider, PaintTexture } from '@/components/BrushElements';

const STATUS_CONFIG = {
  done: { label: 'Terminat', color: '#4a8c5c', icon: '✓', bg: 'rgba(74,140,92,0.12)' },
  in_progress: { label: 'În progres', color: '#c87040', icon: '◐', bg: 'rgba(200,112,64,0.12)' },
  todo: { label: 'De făcut', color: 'var(--text-light)', icon: '○', bg: 'var(--tag-bg)' },
};

function ProgressBar({ items }) {
  const total = items.length;
  if (total === 0) return null;
  const done = items.filter(i => i.status === 'done').length;
  const inProgress = items.filter(i => i.status === 'in_progress').length;
  const pct = Math.round(((done + inProgress * 0.5) / total) * 100);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8,
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
          {pct}%
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          {done}/{total} complete
        </span>
      </div>
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{
          width: `${(done / total) * 100}%`,
          background: '#4a8c5c',
          borderRadius: '4px 0 0 4px',
          transition: 'width 1s ease',
        }} />
        <div style={{
          width: `${(inProgress / total) * 100}%`,
          background: '#c87040',
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.06em',
      padding: '3px 10px', borderRadius: 4, fontWeight: 700,
      color: cfg.color, background: cfg.bg, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function RoadmapView({ topics }) {
  // Current focus: first topic with in_progress items
  const currentTopic = topics.find(t =>
    t.roadmap_items.some(i => i.status === 'in_progress')
  );
  const currentItem = currentTopic?.roadmap_items.find(i => i.status === 'in_progress');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <PaintTexture style={{ zIndex: 0, opacity: 0.5, position: 'fixed' }} />
      <Navbar />

      <header className="container" style={{ paddingTop: 48, paddingBottom: 0 }}>
        <Reveal>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <BrushStroke width={40} color="var(--accent)" opacity={0.4} />
            Parcurs
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 38, fontWeight: 400,
            color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.02em',
          }}>
            Roadmap filosofic
          </h1>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.7,
            color: 'var(--text-3)', maxWidth: 550,
          }}>
            Ce studiez acum, ce am terminat, și ce urmează. Un parcurs prin filosofie — 
            actualizat pe măsură ce avansez.
          </p>
        </Reveal>

        {/* Current focus banner */}
        {currentItem && (
          <Reveal delay={0.1}>
            <div style={{
              marginTop: 28, padding: '20px 28px', borderRadius: 14,
              background: 'var(--card)', border: '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(200,112,64,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                📖
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: '#c87040', marginBottom: 4,
                }}>
                  Citesc acum
                </div>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--text)',
                }}>
                  {currentItem.title}
                </div>
                <div style={{
                  fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2,
                }}>
                  din secțiunea „{currentTopic.title}"
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </header>

      <BrushDivider style={{ maxWidth: 1100, margin: '28px auto 0', padding: '0 40px' }} />

      {/* Topics */}
      <section className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {topics.map((topic, ti) => (
            <Reveal key={topic.id} delay={ti * 0.08}>
              <div style={{
                background: 'var(--card)', border: '1.5px solid var(--border)',
                borderRadius: 16, padding: '32px 36px', position: 'relative', overflow: 'hidden',
              }}>
                <PaintTexture style={{ opacity: 0.2 }} />

                {/* Left accent */}
                <div style={{
                  position: 'absolute', left: 0, top: '15%', bottom: '15%', width: 3,
                  background: topic.roadmap_items.some(i => i.status === 'in_progress')
                    ? 'linear-gradient(to bottom, transparent, #c87040, transparent)'
                    : 'linear-gradient(to bottom, transparent, var(--accent-soft), transparent)',
                  opacity: 0.5,
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Topic header */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'start',
                    marginBottom: 8, gap: 20,
                  }}>
                    <div>
                      <h2 style={{
                        fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400,
                        color: 'var(--text)', marginBottom: 4,
                      }}>
                        {topic.title}
                      </h2>
                      {topic.description && (
                        <p style={{
                          fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-3)',
                          lineHeight: 1.5,
                        }}>
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ProgressBar items={topic.roadmap_items} />

                  {/* Items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {topic.roadmap_items.map((item, ii) => {
                      const isDone = item.status === 'done';
                      const isProgress = item.status === 'in_progress';
                      return (
                        <div key={item.id} style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 16px', borderRadius: 10,
                          background: isProgress ? 'rgba(200,112,64,0.06)' : 'transparent',
                          transition: 'background 0.2s',
                        }}>
                          {/* Checkbox visual */}
                          <div style={{
                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                            border: isDone ? '2px solid #4a8c5c'
                              : isProgress ? '2px solid #c87040'
                              : '2px solid var(--border)',
                            background: isDone ? '#4a8c5c' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}>
                            {isDone && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {isProgress && (
                              <div style={{ width: 8, height: 8, borderRadius: 2, background: '#c87040' }} />
                            )}
                          </div>

                          {/* Title */}
                          <span style={{
                            fontFamily: 'var(--sans)', fontSize: 14, flex: 1,
                            color: isDone ? 'var(--text-muted)' : 'var(--text)',
                            textDecoration: isDone ? 'line-through' : 'none',
                            fontWeight: isProgress ? 500 : 400,
                          }}>
                            {item.title}
                          </span>

                          <StatusBadge status={item.status} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          {topics.length === 0 && (
            <div style={{
              textAlign: 'center', padding: 80, color: 'var(--text-muted)',
            }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic' }}>
                Roadmap-ul va fi disponibil în curând.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1.5px solid var(--border)', background: 'var(--bg-alt)' }}>
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
