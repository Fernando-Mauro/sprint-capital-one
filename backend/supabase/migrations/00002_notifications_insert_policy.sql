-- Migration: Add INSERT policy on notifications for authenticated users
-- Reason: When user A joins user B's reta, the app inserts a notification
-- for user B (the organizer). The inserting user is NOT the notification owner,
-- so we allow any authenticated user to insert notifications.

CREATE POLICY "Notifications: authenticated can insert"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
