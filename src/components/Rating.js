'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';

export default function Rating({ postId }) {
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetchRatings();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchUserRating(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (user) fetchUserRating(user.id);
  }, [user, postId]);

  async function fetchRatings() {
    const { data } = await supabase
      .from('ratings')
      .select('value')
      .eq('post_id', postId);
    if (data && data.length > 0) {
      setAvg(data.reduce((s, r) => s + r.value, 0) / data.length);
      setTotal(data.length);
    }
  }

  async function fetchUserRating(userId) {
    const { data } = await supabase
      .from('ratings')
      .select('value')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    if (data) setUserRating(data.value);
  }

  async function handleRate(value) {
    if (!user) { setShowAuth(true); return; }

    if (userRating) {
      await supabase
        .from('ratings')
        .update({ value })
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('ratings')
        .insert({ post_id: postId, user_id: user.id, value });
    }
    setUserRating(value);
    fetchRatings();
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '20px 0', borderTop: '1px solid var(--border-light)',
      marginTop: 24,
    }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= (hover || userRating || Math.round(avg));
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 22, transition: 'transform 0.15s',
                transform: hover === star ? 'scale(1.2)' : 'scale(1)',
                filter: filled ? 'none' : 'grayscale(1) opacity(0.3)',
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      <div>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)',
        }}>
          {avg > 0 ? avg.toFixed(1) : '—'}
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-light)', marginLeft: 6,
        }}>
          {total > 0 ? `(${total} ${total === 1 ? 'vot' : 'voturi'})` : 'Niciun vot încă'}
        </span>
      </div>
      {userRating > 0 && (
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
          background: '#f8f0e0', padding: '3px 8px', borderRadius: 4,
        }}>
          Ai votat ★{userRating}
        </span>
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={u => setUser(u)} />}
    </div>
  );
}
