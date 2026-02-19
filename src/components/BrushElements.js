'use client';

import { useRef } from 'react';

export function BrushStroke({ width = 200, color = '#8b7355', opacity = 0.12, style = {} }) {
  return (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none" style={{ display: 'block', ...style }}>
      <path d="M2 14c18-8 38-2 58-6s32-8 52-4 28 10 48 6 22-8 38-4" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={opacity} />
      <path d="M6 18c22-4 42 2 62-2s36-6 48-2 18 6 38 4 26-4 42-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={opacity * 0.6} />
    </svg>
  );
}

export function BrushDivider({ style = {} }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 800 32" preserveAspectRatio="none" fill="none" style={style}>
      <path d="M0 16c80-12 160 8 240-4s120-14 200-2 140 16 200 4 80-10 160-6" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" opacity="0.1" />
      <path d="M0 20c100-8 180 4 280-2s160-10 220 0 120 8 200 2" stroke="#6b5535" strokeWidth="1" strokeLinecap="round" opacity="0.06" />
    </svg>
  );
}

export function PaintTexture({ style = {} }) {
  const splatters = useRef(Array.from({ length: 40 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    r: 2 + Math.random() * 8, o: 0.015 + Math.random() * 0.03,
    c: ['#8b7355', '#6b5535', '#a08c6a', '#4a3c28'][Math.floor(Math.random() * 4)],
  }))).current;

  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {splatters.map((s, i) => (
        <ellipse key={i} cx={`${s.x}%`} cy={`${s.y}%`} rx={s.r} ry={s.r * 0.7}
          fill={s.c} opacity={s.o} transform={`rotate(${Math.random() * 360} ${s.x} ${s.y})`} />
      ))}
    </svg>
  );
}
