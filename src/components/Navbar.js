'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Acasă', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Streamuri', href: '/streamuri' },
  { label: 'Poezii', href: '/poezii' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Despre', href: '/#despre' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.35s',
    }}>
      <div className="container" style={{
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Logo />
          <div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500,
              color: 'var(--text)', letterSpacing: '-0.01em',
            }}>Andrei</div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: -1,
            }}>gânduri & stream</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="nav-items" style={{ display: 'flex', gap: 22 }}>
            {NAV_ITEMS.map(item => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href.replace('/#', '/'));
              return (
                <Link key={item.href} href={item.href} className="nav-link" style={{
                  color: isActive ? 'var(--text)' : undefined,
                  fontWeight: isActive ? 700 : undefined,
                }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
