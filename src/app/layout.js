import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Andrei — Gânduri tare, opinii sincere',
  description: 'Blog personal. Nu sunt filosof. Sunt doar un tip care gândește mult, streamuiește uneori, și scrie ce-i trece prin cap.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
