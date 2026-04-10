'use client';

import { cn } from '@/lib/utils';
import { Search, Map as MapIcon, PlusSquare, Users, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { id: 'explore', label: 'Explorar', icon: Search, href: '/dashboard' },
  { id: 'canchas', label: 'Canchas', icon: MapIcon, href: '/dashboard/matches' },
  { id: 'create', label: 'Crear', icon: PlusSquare, href: '/dashboard/matches/create' },
  { id: 'equipos', label: 'Equipos', icon: Users, href: '/dashboard' },
  { id: 'profile', label: 'Perfil', icon: User, href: '/dashboard/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe bg-surface-container-low/90 backdrop-blur-xl border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,253,134,0.08)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href ||
          (tab.id === 'explore' && pathname === '/dashboard');

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              'flex flex-col items-center justify-center transition-all',
              isActive ? 'text-primary-container scale-110' : 'text-on-surface-variant hover:text-primary',
            )}
          >
            <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
            <span className="font-sans font-bold text-[10px] uppercase mt-1">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
