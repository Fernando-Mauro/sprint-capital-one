import '@/app/globals.css';

import type { ReactNode } from 'react';

// All pages use Supabase at runtime — skip static prerendering during build
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MatchUp',
  description: 'Encuentra y únete a retas deportivas cerca de ti.',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
