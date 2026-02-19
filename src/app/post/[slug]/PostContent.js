'use client';

import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import Logo from '@/components/Logo';
import Comments from '@/components/Comments';
import Rating from '@/components/Rating';
import { BrushStroke, PaintTexture } from '@/components/BrushElements';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function PostContent({ post }) {
  const youtubeId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null;
  const isVideo = post.type === 'video';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Back link */}
        <Link href="/" style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-muted)',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 32, transition: 'color 0.2s',
        }}>
          ← Înapoi
        </Link>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
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
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 400,
          lineHeight: 1.2, color: 'var(--text)', marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          {post.title}
        </h1>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 16, lineHeight: 1.7,
          color: 'var(--text-3)', marginBottom: 32,
        }}>
          {post.description}
        </p>

        <BrushStroke width={100} color="#8b7355" opacity={0.25} style={{ marginBottom: 32 }} />

        {/* Video embed */}
        {isVideo && youtubeId && (
          <div style={{ marginBottom: 40 }}>
            <div style={{
              borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9',
              boxShadow: '0 8px 32px rgba(74,60,40,0.12)',
            }}>
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={post.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block', width: '100%', aspectRatio: '16/9' }}
              />
            </div>
          </div>
        )}

        {isVideo && !youtubeId && (
          <div style={{ marginBottom: 40 }}>
            <VideoPlayer duration={post.duration} large />
          </div>
        )}

        {/* Content (Markdown) */}
        {post.content && (
          <div className="post-body" style={{
            fontFamily: 'var(--sans)', fontSize: 16, lineHeight: 1.9,
            color: 'var(--text-2)',
          }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 style={{
                    fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400,
                    color: 'var(--text)', margin: '40px 0 16px', letterSpacing: '-0.01em',
                  }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{
                    fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
                    color: 'var(--text)', margin: '32px 0 12px',
                  }}>{children}</h3>
                ),
                p: ({ children }) => (
                  <p style={{ marginBottom: 20 }}>{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid var(--accent-soft)',
                    paddingLeft: 20, margin: '24px 0',
                    fontFamily: 'var(--serif)', fontStyle: 'italic',
                    color: 'var(--text-3)',
                  }}>{children}</blockquote>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{
            display: 'flex', gap: 8, marginTop: 40, paddingTop: 24,
            borderTop: '1px solid var(--border)', flexWrap: 'wrap',
          }}>
            {post.tags.map(t => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>
        )}

        {/* Rating */}
        <Rating postId={post.id} />

        {/* Comments */}
        <Comments postId={post.id} />
      </article>

      {/* Footer */}
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
          <Link href="/" className="nav-link">← Toate postările</Link>
        </div>
      </footer>
    </div>
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
