import type { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add sidebar navigation component */}
      <aside className="w-64 border-r border-[var(--border)]">
        {/* TODO: Sidebar with nav links */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
