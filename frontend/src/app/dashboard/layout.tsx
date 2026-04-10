import BottomNav from '@/components/layout/BottomNav';
import TopNav from '@/components/layout/TopNav';

import type { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="bg-background min-h-screen">
      <TopNav />
      <main className="pt-16 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
