'use client';

import { useState } from 'react';

export default function VideoPlayer({ duration, large = false, youtubeId = null }) {
  const [hovered, setHovered] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  if (showEmbed && youtubeId) {
    return (
      <div style={{
        borderRadius: large ? 14 : 10, overflow: 'hidden',
        aspectRatio: '16/9', position: 'relative',
        boxShadow: '0 8px 32px var(--shadow)',
      }}>
        <iframe
          width="100%" height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title="Video" frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  const thumbUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (youtubeId) setShowEmbed(true);
      }}
      style={{
        borderRadius: large ? 14 : 10, overflow: 'hidden',
        aspectRatio: '16/9', position: 'relative', cursor: 'pointer',
        boxShadow: hovered
          ? `0 20px 50px var(--shadow-hover)`
          : `0 6px 24px var(--shadow)`,
        transition: 'box-shadow 0.4s, transform 0.4s',
        transform: hovered ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: thumbUrl
          ? `url(${thumbUrl}) center/cover`
          : `linear-gradient(145deg, var(--video-grad-1) 0%, var(--video-grad-2) 100%)`,
        transition: 'all 0.5s',
      }}>
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }} />

        {/* Play button */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 3,
        }}>
          <div style={{
            width: large ? 74 : 54, height: large ? 74 : 54, borderRadius: '50%',
            background: hovered ? 'var(--video-btn-hover)' : 'var(--video-btn)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.35s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: `${large ? 13 : 9}px solid transparent`,
              borderBottom: `${large ? 13 : 9}px solid transparent`,
              borderLeft: `${large ? 21 : 15}px solid var(--bg)`,
              marginLeft: 4,
            }} />
          </div>
        </div>
      </div>

      {duration && (
        <div style={{
          position: 'absolute', bottom: large ? 14 : 10, right: large ? 14 : 10,
          background: 'rgba(0,0,0,0.6)', color: '#f0eade',
          fontFamily: 'var(--mono)', fontSize: 11,
          padding: '4px 10px', borderRadius: 5, zIndex: 4,
          backdropFilter: 'blur(6px)',
        }}>{duration}</div>
      )}

      <div style={{
        position: 'absolute', top: large ? 14 : 10, left: large ? 14 : 10,
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--text-2)', zIndex: 4,
        background: 'var(--nav-bg)', padding: '3px 9px', borderRadius: 4,
        backdropFilter: 'blur(4px)',
      }}>stream · rec</div>
    </div>
  );
}
