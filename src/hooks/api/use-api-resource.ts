import { useState, useEffect, useCallback } from 'react';
import { errorReporter } from '@/lib/errorReporter';

interface UseApiResourceOptions {
  autoFetch?: boolean;
  errorCategory?: 'network' | 'user' | 'validation' | 'unknown';
}

interface UseApiResourceReturn<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiResource<T>(
  fetchFn: () => Promise<T>,
  defaultErrorMessage: string,
  options: UseApiResourceOptions = {}
): UseApiResourceReturn<T> {
  const { autoFetch = true, errorCategory = 'network' } = options;

  const [data, setData] = useState<T>(null as T);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown, contextMessage: string) => {
      const errorMessage = err instanceof Error ? err.message : contextMessage;
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: errorCategory,
      });
    },
    [errorCategory]
  );

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      handleError(err, defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, defaultErrorMessage, handleError]);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

interface UseApiResourceMutationReturn<TInput, TOutput> {
  isSubmitting: boolean;
  error: string | null;
  mutate: (input: TInput) => Promise<TOutput | null>;
  clearError: () => void;
}

export function useApiResourceMutation<TInput, TOutput>(
  mutateFn: (input: TInput) => Promise<TOutput>,
  defaultErrorMessage: string,
  options: UseApiResourceOptions = {},
  onSuccess?: (result: TOutput) => void
): UseApiResourceMutationReturn<TInput, TOutput> {
  const { errorCategory = 'user' } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (err: unknown, contextMessage: string) => {
      const errorMessage = err instanceof Error ? err.message : contextMessage;
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: errorCategory,
      });
    },
    [errorCategory]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      try {
        setIsSubmitting(true);
        setError(null);
        const result = await mutateFn(input);
        onSuccess?.(result);
        return result;
      } catch (err) {
        handleError(err, defaultErrorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutateFn, defaultErrorMessage, handleError, onSuccess]
  );
  return {
    isSubmitting,
    error,
    mutate,
    clearError,
  };
}
