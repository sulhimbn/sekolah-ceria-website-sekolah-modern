import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { errorReporter } from '@/lib/error-reporting';
import type { User } from '@shared/types';
import { useApiResource } from './use-api-resource';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (name: string) => Promise<User | null>;
  isCreating: boolean;
}

const USERS_QUERY_KEY = ['users', 'list'];

async function fetchUsers(): Promise<User[]> {
  return userService.listUsers();
}

export function useUsers(): UseUsersReturn {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useApiResource<User[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    errorMessage: 'Gagal memuat data pengguna.',
  });

  const createUserMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!name.trim()) return null;
      return userService.createUser(name.trim());
    },
    onSuccess: newUser => {
      if (newUser) {
        queryClient.setQueryData<User[]>(USERS_QUERY_KEY, (old = []) => [
          ...old,
          newUser,
        ]);
      }
    },
    onError: err => {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal membuat pengguna.';
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'network',
      });
    },
  });

  const createUser = useCallback(
    async (name: string): Promise<User | null> => {
      return createUserMutation.mutateAsync(name);
    },
    [createUserMutation]
  );

  return {
    users,
    isLoading,
    error,
    refetch,
    createUser,
    isCreating: createUserMutation.isPending,
  };
}
