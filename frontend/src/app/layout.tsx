import '@/app/globals.css';

import type { ReactNode } from 'react';

export const metadata = {
  title: 'MatchUp',
  description: 'Find and join pick-up sports matches in your area.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
