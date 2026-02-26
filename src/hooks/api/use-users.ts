import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import type { User } from '@shared/types';

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
  } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: FEATURE_FLAGS.TANSTACK_QUERY_STALE_TIME,
    gcTime: FEATURE_FLAGS.TANSTACK_QUERY_CACHE_TIME,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const handleError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Gagal memuat data pengguna.';
    errorReporter.report({
      message: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'network',
    });
    return errorMessage;
  }, []);

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
      handleError(err);
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
    error: error ? handleError(error) : null,
    refetch,
    createUser,
    isCreating: createUserMutation.isPending,
  };
}
