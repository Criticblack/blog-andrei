'use client';

export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="1.5" y="1.5" width="37" height="37" rx="8" fill="var(--bg)" stroke="var(--text)" strokeWidth="1.5" />
      <path d="M8 30c4-2 8 1 12-1s6-3 10-1 4 2 6 1" stroke="var(--accent-soft)" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
      <path d="M6 33c5-1 10 1 15 0s8-2 12-1" stroke="var(--accent-soft)" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />
      <text x="10.5" y="28" fontFamily="'Newsreader', Georgia, serif" fontSize="25" fontWeight="400" fill="var(--text)" fontStyle="italic">a</text>
      <circle cx="32" cy="8" r="2.8" fill="var(--accent)" />
    </svg>
  );
}
