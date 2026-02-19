'use client';

import Link from 'next/link';
import VideoPlayer from './VideoPlayer';
import { PaintTexture } from './BrushElements';

export default function PostCard({ post }) {
  const isVideo = post.type === 'video';

  // Extrage YouTube ID din URL
  const youtubeId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null;

  return (
    <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="post-card" style={{
        ...(isVideo ? {
          display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 32,
          padding: '28px 28px 28px 32px', alignItems: 'center',
        } : {
          padding: '32px 36px',
        }),
      }}>
        {/* Paint texture */}
        <PaintTexture style={{ opacity: 0.3, zIndex: 0 }} />

        {/* Left accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3,
          background: isVideo
            ? 'linear-gradient(to bottom, transparent, #8b4513, transparent)'
            : 'linear-gradient(to bottom, transparent, #8b7355, transparent)',
          opacity: 0.4, borderRadius: 2,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span className={`badge ${isVideo ? 'badge-video' : 'badge-text'}`}>
              {isVideo ? '▶ VIDEO' : '✍ TEXT'}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-light)' }}>
              {formatDate(post.published_at)}
            </span>
            {post.duration && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-light)' }}>
                · {post.duration}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="post-title" style={{
            fontFamily: 'var(--serif)', fontSize: isVideo ? 26 : 24,
            fontWeight: 400, lineHeight: 1.3, color: 'var(--text)',
            marginBottom: 10, transition: 'color 0.25s', letterSpacing: '-0.01em',
            maxWidth: isVideo ? 440 : 700,
          }}>
            {post.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.75,
            color: 'var(--text-3)', maxWidth: isVideo ? 440 : 700,
          }}>
            {post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
              {post.tags.map(t => (
                <span key={t} className="tag">#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Video player */}
        {isVideo && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <VideoPlayer duration={post.duration} youtubeId={youtubeId} />
          </div>
        )}
      </div>
    </Link>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/);
  return match ? match[1] : null;
}
