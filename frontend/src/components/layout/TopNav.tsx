'use client';

import { useAuth } from '@/hooks/use-auth';
import { Bell, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function TopNav() {
  const { user } = useAuth();

  return (
    <header className="bg-background flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50 border-b border-surface-container-highest">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="font-headline font-black uppercase tracking-tighter text-2xl italic text-primary"
        >
          MATCHUP
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white hover:bg-surface-container transition-colors p-2">
          <Search className="w-6 h-6" />
        </button>
        <button className="text-white hover:bg-surface-container transition-colors p-2 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full" />
        </button>
        <Link
          href="/dashboard/profile"
          className="w-8 h-8 bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center"
        >
          {user?.avatar_url ? (
            <Image alt="Profile" className="w-full h-full object-cover" src={user.avatar_url} width={32} height={32} />
          ) : (
            <span className="text-xs font-black text-primary">
              {user?.username?.charAt(0).toUpperCase() ?? '?'}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
