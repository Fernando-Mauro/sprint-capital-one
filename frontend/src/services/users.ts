import type { UserProfile, ServiceResult, Match } from '@/types';

interface UpdateUserProfileInput {
  display_name?: string | undefined;
  avatar_url?: string | undefined;
  bio?: string | undefined;
  location?: string | undefined;
}

export async function getUserProfile(
  _id: string,
): Promise<ServiceResult<UserProfile>> {
  // TODO: Query Supabase for user profile by id, use .maybeSingle()
  return { data: null, error: 'Not implemented' };
}

export async function updateUserProfile(
  _id: string,
  _input: UpdateUserProfileInput,
): Promise<ServiceResult<UserProfile>> {
  // TODO: Update user profile in Supabase, verify ownership via RLS
  return { data: null, error: 'Not implemented' };
}

export async function getUserMatches(
  _userId: string,
): Promise<ServiceResult<Match[]>> {
  // TODO: Query matches where user is organizer or participant
  return { data: null, error: 'Not implemented' };
}
