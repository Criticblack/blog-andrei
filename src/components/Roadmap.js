'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BrushStroke, PaintTexture } from './BrushElements';
import Reveal from './Reveal';

const STATUS_ICON = { done: '✓', in_progress: '◐', todo: '○' };

export default function Roadmap() {
  const [topics, setTopics] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    supabase
      .from('roadmap_topics')
      .select('*, roadmap_items(*)')
      .order('sort_order')
      .then(({ data }) => {
        if (data) data.forEach(t => t.roadmap_items?.sort((a, b) => a.sort_order - b.sort_order));
        setTopics(data || []);
      });
  }, []);

  if (topics.length === 0) return null;

  function getProgress(items) {
    if (!items?.length) return 0;
    const done = items.filter(i => i.status === 'done').length;
    const inProg = items.filter(i => i.status === 'in_progress').length;
    return Math.round(((done + inProg * 0.5) / items.length) * 100);
  }

  // Currently in progress item
  function getCurrentItem(items) {
    return items?.find(i => i.status === 'in_progress');
  }

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <Reveal>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <BrushStroke width={40} color="var(--accent)" opacity={0.4} />
              Roadmap
            </div>
            <h2 style={{
              fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 400, color: 'var(--text)', marginBottom: 6,
            }}>
              Ce studiez acum
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text-3)' }}>
              Drumul meu prin filosofie — ce am citit, ce citesc, și ce urmează.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topics.map((topic, idx) => {
            const progress = getProgress(topic.roadmap_items);
            const current = getCurrentItem(topic.roadmap_items);
            const isOpen = expanded === topic.id;

            return (
              <Reveal key={topic.id} delay={idx * 0.06}>
                <div
                  onClick={() => setExpanded(isOpen ? null : topic.id)}
                  style={{
                    background: 'var(--card)', border: '1.5px solid var(--border)',
                    borderRadius: 14, padding: '22px 26px', cursor: 'pointer',
                    transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8c0ae'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <PaintTexture style={{ opacity: 0.2 }} />

                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: 'var(--text)' }}>
                          {topic.title}
                        </h3>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700,
                          color: progress === 100 ? '#2d6a30' : 'var(--accent)',
                        }}>
                          {progress}%
                        </span>
                      </div>
                      {current && (
                        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
                          Acum: <span style={{ color: 'var(--accent)' }}>{current.title}</span>
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text-light)',
                      transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none',
                    }}>▾</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 4, borderRadius: 2, background: 'var(--border-light)',
                    marginTop: 14, overflow: 'hidden', position: 'relative', zIndex: 1,
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 2, width: `${progress}%`,
                      background: progress === 100
                        ? 'linear-gradient(90deg, #2d6a30, #4a9a4e)'
                        : 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>

                  {/* Expanded items */}
                  {isOpen && (
                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-light)', position: 'relative', zIndex: 1 }}
                      onClick={e => e.stopPropagation()}>
                      {topic.description && (
                        <p style={{
                          fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-3)',
                          marginBottom: 14, fontStyle: 'italic',
                        }}>{topic.description}</p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {topic.roadmap_items?.map(item => (
                          <div key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
                          }}>
                            <span style={{
                              fontSize: 14, width: 22, textAlign: 'center',
                              color: item.status === 'done' ? '#2d6a30'
                                : item.status === 'in_progress' ? '#856404' : 'var(--text-light)',
                            }}>
                              {STATUS_ICON[item.status]}
                            </span>
                            <span style={{
                              fontFamily: 'var(--sans)', fontSize: 14,
                              color: item.status === 'done' ? 'var(--text-3)' : 'var(--text)',
                              textDecoration: item.status === 'done' ? 'line-through' : 'none',
                              opacity: item.status === 'done' ? 0.65 : 1,
                            }}>
                              {item.title}
                            </span>
                            {item.status === 'in_progress' && (
                              <span style={{
                                fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 8px',
                                borderRadius: 4, background: '#fff3cd', color: '#856404',
                                marginLeft: 'auto',
                              }}>în curs</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
