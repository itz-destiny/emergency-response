'use client';

import { useFirebase } from '@/firebase/provider';
import { User } from 'firebase/auth';

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook specifically for accessing the authenticated user's state from the Firebase context.
 * This provides the User object, loading status, and any auth errors.
 *
 * @returns {UserHookResult} Object with user, isUserLoading, and userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
