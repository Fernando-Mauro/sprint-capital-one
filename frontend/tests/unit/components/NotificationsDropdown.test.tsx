import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Module mocks (must be before imports that use them)
// ---------------------------------------------------------------------------

jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/notifications', () => ({
  getNotifications: jest.fn(),
  markAsRead: jest.fn(),
}));

import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import { useAuth } from '@/hooks/use-auth';
import { getNotifications, markAsRead } from '@/services/notifications';

// ---------------------------------------------------------------------------
// Typed mocks
// ---------------------------------------------------------------------------

const mockUseAuth = jest.mocked(useAuth);
const mockGetNotifications = jest.mocked(getNotifications);
const mockMarkAsRead = jest.mocked(markAsRead);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const fakeUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  full_name: 'Test User',
  avatar_url: null,
  phone: null,
  skill_level: null,
  latitude: null,
  longitude: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: null,
};

const fakeNotifications = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'player_joined' as const,
    title: 'Nuevo jugador en tu reta',
    body: 'Carlos se unió a "Fútbol en el parque"',
    reta_id: 'reta-1',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'reta_cancelled' as const,
    title: 'Reta cancelada',
    body: 'La reta "Basquet" fue cancelada',
    reta_id: 'reta-2',
    is_read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();

  mockUseAuth.mockReturnValue({
    user: fakeUser,
    loading: false,
  } as unknown as ReturnType<typeof useAuth>);

  mockGetNotifications.mockResolvedValue({ data: [], error: null });
  mockMarkAsRead.mockResolvedValue({ data: null, error: null });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NotificationsDropdown', () => {
  it('renders bell icon', async () => {
    await act(async () => {
      render(<NotificationsDropdown />);
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows unread badge when there are unread notifications', async () => {
    mockGetNotifications.mockResolvedValue({
      data: fakeNotifications,
      error: null,
    });

    await act(async () => {
      render(<NotificationsDropdown />);
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('opens dropdown on bell click', async () => {
    await act(async () => {
      render(<NotificationsDropdown />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
  });

  it('shows notifications in dropdown', async () => {
    mockGetNotifications.mockResolvedValue({
      data: fakeNotifications,
      error: null,
    });

    await act(async () => {
      render(<NotificationsDropdown />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Nuevo jugador en tu reta')).toBeInTheDocument();
      expect(screen.getByText('Reta cancelada')).toBeInTheDocument();
    });
  });

  it('shows empty state when no notifications', async () => {
    mockGetNotifications.mockResolvedValue({ data: [], error: null });

    await act(async () => {
      render(<NotificationsDropdown />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByText('No tienes notificaciones')).toBeInTheDocument();
    });
  });

  it('calls markAsRead when mark all button clicked', async () => {
    mockGetNotifications.mockResolvedValue({
      data: fakeNotifications,
      error: null,
    });

    await act(async () => {
      render(<NotificationsDropdown />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Marcar todas como leídas')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Marcar todas como leídas'));
    });

    expect(mockMarkAsRead).toHaveBeenCalledWith(['notif-1']);
  });
});
