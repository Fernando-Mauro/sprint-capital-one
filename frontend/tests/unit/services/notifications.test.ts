import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// --- Supabase mock chain ---------------------------------------------------

const mockOrder = jest.fn();
const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
const mockIn = jest.fn();
const mockUpdate = jest.fn().mockReturnValue({ in: mockIn });
const mockSingle = jest.fn();
const mockInsertSelect = jest.fn().mockReturnValue({ single: mockSingle });
const mockInsert = jest.fn().mockReturnValue({ select: mockInsertSelect });

const mockFrom = jest.fn().mockReturnValue({
  select: mockSelect,
  update: mockUpdate,
  insert: mockInsert,
});

jest.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({ from: mockFrom }),
}));

import { getNotifications, markAsRead, createNotification } from '@/services/notifications';

// --- Fixtures ---------------------------------------------------------------

const FAKE_USER_ID = 'user-abc-123';

const fakeNotification = {
  id: 'notif-1',
  user_id: FAKE_USER_ID,
  type: 'player_joined' as const,
  title: 'New player joined',
  body: 'Someone joined your reta',
  reta_id: 'reta-1',
  is_read: false,
  created_at: '2026-04-10T12:00:00Z',
};

// --- Reset mocks before each test -------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();

  // Restore default chaining so `from()` always returns the right shape
  mockFrom.mockReturnValue({
    select: mockSelect,
    update: mockUpdate,
    insert: mockInsert,
  });
  mockSelect.mockReturnValue({ eq: mockEq });
  mockEq.mockReturnValue({ order: mockOrder });
  mockUpdate.mockReturnValue({ in: mockIn });
  mockInsert.mockReturnValue({ select: mockInsertSelect });
  mockInsertSelect.mockReturnValue({ single: mockSingle });
});

// ---------------------------------------------------------------------------
// getNotifications
// ---------------------------------------------------------------------------

describe('getNotifications', () => {
  it('returns notifications for a given user on success', async () => {
    mockOrder.mockResolvedValueOnce({ data: [fakeNotification], error: null });

    const result = await getNotifications(FAKE_USER_ID);

    expect(mockFrom).toHaveBeenCalledWith('notifications');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('user_id', FAKE_USER_ID);
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });

    expect(result).toEqual({ data: [fakeNotification], error: null });
  });

  it('returns an error message when the query fails', async () => {
    mockOrder.mockResolvedValueOnce({
      data: null,
      error: { message: 'database error' },
    });

    const result = await getNotifications(FAKE_USER_ID);

    expect(result).toEqual({ data: null, error: 'database error' });
  });
});

// ---------------------------------------------------------------------------
// markAsRead
// ---------------------------------------------------------------------------

describe('markAsRead', () => {
  const notificationIds = ['notif-1', 'notif-2'];

  it('marks the given notifications as read on success', async () => {
    mockIn.mockResolvedValueOnce({ error: null });

    const result = await markAsRead(notificationIds);

    expect(mockFrom).toHaveBeenCalledWith('notifications');
    expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
    expect(mockIn).toHaveBeenCalledWith('id', notificationIds);

    expect(result).toEqual({ data: null, error: null });
  });

  it('returns an error message when the update fails', async () => {
    mockIn.mockResolvedValueOnce({
      error: { message: 'update failed' },
    });

    const result = await markAsRead(notificationIds);

    expect(result).toEqual({ data: null, error: 'update failed' });
  });
});

// ---------------------------------------------------------------------------
// createNotification
// ---------------------------------------------------------------------------

describe('createNotification', () => {
  const input = {
    user_id: FAKE_USER_ID,
    type: 'player_joined' as const,
    title: 'New player joined',
    body: 'A player joined your reta',
    reta_id: 'reta-1',
  };

  it('creates a notification and returns it on success', async () => {
    mockSingle.mockResolvedValueOnce({
      data: { ...fakeNotification, body: input.body },
      error: null,
    });

    const result = await createNotification(input);

    expect(mockFrom).toHaveBeenCalledWith('notifications');
    expect(mockInsert).toHaveBeenCalledWith(input);
    expect(mockInsertSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();

    expect(result).toEqual({
      data: { ...fakeNotification, body: input.body },
      error: null,
    });
  });

  it('returns an error message when the insert fails', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'insert failed' },
    });

    const result = await createNotification(input);

    expect(result).toEqual({ data: null, error: 'insert failed' });
  });
});
