import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import type { User } from '@shared/types';
import type { ApiQueryHookResult, ApiMutationHookResult } from './index';

type UseUsersReturn = ApiQueryHookResult<User[]> & {
  /** Backward compatible alias for data */
  users: User[];
  /** Mutation: Create a new user */
  createUser: (name: string) => Promise<User | null>;
  /** Mutation loading state */
  isCreating: boolean;
};

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.listUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat data pengguna.';
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'network',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (name: string): Promise<User | null> => {
    if (!name.trim()) return null;

    try {
      setIsCreating(true);
      const newUser = await userService.createUser(name.trim());
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal membuat pengguna.';
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'user',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    data: users,
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    isCreating,
  };
}
