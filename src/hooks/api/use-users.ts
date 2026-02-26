import { useState, useCallback } from 'react';
import { userService } from '@/services';
import { useApiResource, useApiResourceMutation } from './use-api-resource';
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

  const { isLoading, error, refetch } = useApiResource<User[]>(
    () => userService.listUsers(),
    'Gagal memuat data pengguna.'
  );

  const { mutate: createUserMutate, isSubmitting: isCreating } =
    useApiResourceMutation<string, User>(
      (name: string) => userService.createUser(name.trim()),
      'Gagal membuat pengguna.'
    );

  const createUser = useCallback(
    async (name: string): Promise<User | null> => {
      if (!name.trim()) return null;
      const newUser = await createUserMutate(name);
      if (newUser) {
        setUsers(prev => [...prev, newUser]);
      }
      return newUser;
    },
    [createUserMutate]
  );

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    createUser,
    isCreating,
  };
}
