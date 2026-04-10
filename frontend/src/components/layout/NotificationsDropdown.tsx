'use client';

import { Bell } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { getNotifications, markAsRead } from '@/services/notifications';

import type { NotificationType } from '@/types';

interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  reta_id: string | null;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'ahora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function NotificationsDropdown(): React.JSX.Element {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.is_read);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const result = await getNotifications(user.id);
    if (result.data) setNotifications(result.data);
  }, [user?.id]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (open) void fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleMarkAllRead(): Promise<void> {
    const ids = unread.map((n) => n.id);
    if (ids.length === 0) return;
    const result = await markAsRead(ids);
    if (!result.error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-on-surface-variant transition-all hover:text-on-surface"
        aria-label="Notificaciones"
      >
        <Bell size={22} />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-container px-1 text-xs font-bold text-on-primary-container">
            {unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 border border-outline-variant bg-surface-container-high rounded-none shadow-lg">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">
              Notificaciones
            </h3>
            {unread.length > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAllRead()}
                className="text-xs text-primary transition-all hover:text-primary-container"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-on-surface-variant">
                No tienes notificaciones
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'border-b border-outline-variant px-4 py-3 transition-all hover:bg-surface-container-highest',
                    !n.is_read && 'border-l-2 border-l-primary-container',
                  )}
                >
                  <p className="text-sm font-bold text-on-surface">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-xs text-on-surface-variant">{n.body}</p>}
                  <p className="mt-1 text-xs text-on-surface-variant">{timeAgo(n.created_at)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
