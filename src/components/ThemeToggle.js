'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle} aria-label="Schimbă tema" style={{
      background: 'none', border: '1.5px solid var(--border)',
      borderRadius: 20, padding: '5px 10px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)',
      transition: 'all 0.3s',
    }}>
      <span style={{
        display: 'inline-block', transition: 'transform 0.4s',
        transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)',
        fontSize: 14,
      }}>
        {theme === 'dark' ? '☀' : '☾'}
      </span>
      {theme === 'dark' ? 'ZI' : 'NOAPTE'}
    </button>
  );
}
