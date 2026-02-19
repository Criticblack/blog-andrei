'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) checkBlocked(user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) checkBlocked(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [postId]);

  async function checkBlocked(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('is_blocked')
      .eq('id', userId)
      .maybeSingle();
    setIsBlocked(data?.is_blocked || false);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(display_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
    setSubmitting(false);
  }

  async function handleDelete(commentId) {
    if (!confirm('Ștergi comentariul?')) return;
    await supabase.from('comments').delete().eq('id', commentId);
    setComments(comments.filter(c => c.id !== commentId));
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'acum';
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}z`;
    return `${Math.floor(days / 30)}l`;
  }

  return (
    <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1.5px solid var(--border)' }}>
      <h3 style={{
        fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400,
        color: 'var(--text)', marginBottom: 24,
      }}>
        Comentarii {comments.length > 0 && <span style={{ color: 'var(--text-light)' }}>({comments.length})</span>}
      </h3>

      {/* Comment form */}
      {isBlocked ? (
        <div style={{
          padding: '16px 20px', borderRadius: 12,
          background: 'rgba(160,48,32,0.06)', border: '1px solid rgba(160,48,32,0.12)',
          fontFamily: 'var(--sans)', fontSize: 13, color: '#a03020', marginBottom: 32,
        }}>
          Contul tău a fost restricționat. Nu poți lăsa comentarii.
        </div>
      ) : (
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={user ? 'Scrie un comentariu...' : 'Conectează-te pentru a comenta...'}
            onClick={() => { if (!user) setShowAuth(true); }}
            maxLength={2000}
            style={{
              width: '100%', padding: '14px 16px', minHeight: 100,
              border: '1.5px solid var(--border)', borderRadius: 12,
              fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.6,
              color: 'var(--text)', background: 'var(--card)', outline: 'none',
              resize: 'vertical', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-soft)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10,
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-light)',
            }}>
              {user ? `Conectat ca ${user.user_metadata?.full_name || user.email}` : 'Trebuie să fii conectat'}
            </span>
            <button type="submit" className="admin-btn"
              disabled={!user || !newComment.trim() || submitting}
              style={{ padding: '8px 20px', fontSize: 11, opacity: (!user || !newComment.trim()) ? 0.5 : 1 }}>
              {submitting ? 'Se trimite...' : 'Trimite'}
            </button>
          </div>
        </div>
      </form>
      )}

      {/* Comments list */}
      {loading ? (
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-muted)' }}>
          Se încarcă...
        </p>
      ) : comments.length === 0 ? (
        <p style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-muted)',
          textAlign: 'center', padding: 32,
        }}>
          Niciun comentariu încă. Fii primul care comentează!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map(c => (
            <div key={c.id} style={{
              background: 'var(--card)', border: '1px solid var(--border-light)',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--border), var(--border-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--text-3)',
                    overflow: 'hidden',
                  }}>
                    {c.profiles?.avatar_url ? (
                      <img src={c.profiles.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (c.profiles?.display_name || '?')[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                      {c.profiles?.display_name || 'Anonim'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-light)', marginLeft: 8,
                    }}>
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                </div>
                {user?.id === c.user_id && (
                  <button onClick={() => handleDelete(c.id)} style={{
                    background: 'none', border: 'none', fontFamily: 'var(--mono)',
                    fontSize: 10, color: 'var(--text-light)', cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#a03020'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
                  >șterge</button>
                )}
              </div>
              <p style={{
                fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7,
                color: 'var(--text-2)', whiteSpace: 'pre-wrap',
              }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => setUser(u)} />}
    </div>
  );
}
