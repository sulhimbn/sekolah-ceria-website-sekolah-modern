// ============================================================================
// Generic API Resource Hook
// ============================================================================
// Reusable hook for React Query-based data fetching with built-in error handling.
// Eliminates boilerplate code for loading states, error handling, and refetching.
// ============================================================================

import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { errorReporter } from '@/lib/error-reporting';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

/**
 * Configuration options for useApiResource
 */
export interface UseApiResourceOptions<TData, TError = unknown> {
  /** Unique key for caching the query */
  queryKey: readonly unknown[];
  /** Function to fetch the data */
  queryFn: () => Promise<TData>;
  /** Custom error message for failed requests (default: 'Gagal memuat data.') */
  errorMessage?: string;
  /** Whether to enable the query (default: true) */
  enabled?: boolean;
  /** Callback when query succeeds */
  onSuccess?: (data: TData) => void;
  /** Callback when query fails */
  onError?: (error: TError) => void;
}

/**
 * Configuration for mutations
 */
export interface UseApiMutationOptions<TInput, TOutput> {
  /** Mutation function */
  mutationFn: (input: TInput) => Promise<TOutput>;
  /** Custom error message (default: 'Gagal menyimpan data.') */
  errorMessage?: string;
  /** Callback when mutation succeeds */
  onSuccess?: (data: TOutput) => void;
  /** Callback when mutation fails */
  onError?: (error: unknown) => void;
  /** Query keys to invalidate on success */
  invalidateQueries?: readonly unknown[][];
}

/**
 * Standard return type for API resource hooks
 */
export interface UseApiResourceReturn<TData> {
  /** The fetched data */
  data: TData;
  /** Whether the query is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to refetch the data */
  refetch: () => Promise<void>;
}

/**
 * Return type when mutation is included
 */
export interface UseApiResourceWithMutationReturn<
  TData,
  TInput,
  TOutput,
> extends UseApiResourceReturn<TData> {
  /** Mutation function */
  mutate: (input: TInput) => Promise<TOutput | null>;
  /** Whether mutation is in progress */
  isMutating: boolean;
  /** Mutation error */
  mutationError: string | null;
}

/**
 * Internal error handler
 */
function handleError(err: unknown, customMessage?: string): string {
  const defaultMessage = 'Gagal memuat data.';
  const errorMessage =
    err instanceof Error ? err.message : customMessage || defaultMessage;

  errorReporter.report({
    message: errorMessage,
    stack: err instanceof Error ? err.stack : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
    level: 'error',
    category: 'network',
  });

  return errorMessage;
}

/**
 * Generic hook for fetching API resources with React Query
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const { data, isLoading, error, refetch } = useApiResource<User[]>({
 *   queryKey: ['users'],
 *   queryFn: () => userService.listUsers(),
 *   errorMessage: 'Gagal memuat pengguna.',
 * });
 * ```
 */
export function useApiResource<TData>(
  options: UseApiResourceOptions<TData>
): UseApiResourceReturn<TData> {
  const { queryKey, queryFn, errorMessage, enabled = true } = options;

  const { data, isLoading, error, refetch }: UseQueryResult<TData, unknown> =
    useQuery({
      queryKey,
      queryFn,
      staleTime: FEATURE_FLAGS.TANSTACK_QUERY_STALE_TIME,
      gcTime: FEATURE_FLAGS.TANSTACK_QUERY_CACHE_TIME,
      retry: 3,
      refetchOnWindowFocus: false,
      enabled,
    });

  const handleErrorCallback = useCallback(
    (err: unknown) => handleError(err, errorMessage),
    [errorMessage]
  );

  return {
    data: data as TData,
    isLoading,
    error: error ? handleErrorCallback(error) : null,
    refetch,
  };
}

/**
 * Generic hook for fetching API resources with optional mutation support
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * const { data, isLoading, error, refetch, mutate, isMutating } = useApiResourceWithMutation<User[], string, User>({
 *   queryKey: ['users'],
 *   queryFn: () => userService.listUsers(),
 *   mutationOptions: {
 *     mutationFn: (name) => userService.createUser(name),
 *     invalidateQueries: [['users']],
 *   },
 * });
 * ```
 */
export function useApiResourceWithMutation<TData, TInput, TOutput = TInput>(
  options: UseApiResourceOptions<TData> & {
    mutationOptions?: UseApiMutationOptions<TInput, TOutput>;
  }
): UseApiResourceWithMutationReturn<TData, TInput, TOutput> {
  const {
    queryKey,
    queryFn,
    errorMessage,
    enabled = true,
    mutationOptions,
  } = options;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch }: UseQueryResult<TData, unknown> =
    useQuery({
      queryKey,
      queryFn,
      staleTime: FEATURE_FLAGS.TANSTACK_QUERY_STALE_TIME,
      gcTime: FEATURE_FLAGS.TANSTACK_QUERY_CACHE_TIME,
      retry: 3,
      refetchOnWindowFocus: false,
      enabled,
    });

  const mutation: UseMutationResult<TOutput, unknown, TInput> = useMutation({
    mutationFn: mutationOptions?.mutationFn || (async () => null as TOutput),
    onSuccess: data => {
      mutationOptions?.onSuccess?.(data);
      // Invalidate queries if specified
      if (mutationOptions?.invalidateQueries) {
        mutationOptions.invalidateQueries.forEach(keys => {
          queryClient.invalidateQueries({ queryKey: keys });
        });
      }
    },
    onError: err => {
      const errorMsg = handleError(
        err,
        mutationOptions?.errorMessage || 'Gagal menyimpan data.'
      );
      mutationOptions?.onError?.(err);
      return errorMsg;
    },
  });

  const handleErrorCallback = useCallback(
    (err: unknown) => handleError(err, errorMessage),
    [errorMessage]
  );

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      if (mutationOptions?.mutationFn) {
        return mutation.mutateAsync(input);
      }
      return null;
    },
    [mutation, mutationOptions]
  );

  return {
    data: data as TData,
    isLoading,
    error: error ? handleErrorCallback(error) : null,
    refetch,
    mutate,
    isMutating: mutation.isPending,
    mutationError: mutation.error
      ? handleError(mutation.error, mutationOptions?.errorMessage)
      : null,
  };
}
