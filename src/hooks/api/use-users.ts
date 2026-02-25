import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services';
import { useErrorHandler } from '@/useErrorHandler';
import type { User } from '@shared/types';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (name: string) => Promise<User | null>;
  isCreating: boolean;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { error, handleError, clearError } = useErrorHandler({
    defaultMessage: 'Gagal memuat data pengguna.',
    category: 'network',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      const data = await userService.listUsers();
      setUsers(data);
    } catch (err) {
      handleError(err, 'Gagal memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  const createUser = useCallback(
    async (name: string): Promise<User | null> => {
      if (!name.trim()) return null;

      try {
        setIsCreating(true);
        const newUser = await userService.createUser(name.trim());
        setUsers(prev => [...prev, newUser]);
        return newUser;
      } catch (err) {
        handleError(err, 'Gagal membuat pengguna.');
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [handleError]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    isCreating,
  };
}
