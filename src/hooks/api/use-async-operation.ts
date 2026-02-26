import { useState, useCallback } from 'react';
import { errorReporter } from '@/lib/errorReporter';

export interface UseAsyncOperationOptions<TArgs extends unknown[], TResult> {
  operationFn: (...args: TArgs) => Promise<TResult>;
  errorMessage?: string;
  category?: 'network' | 'user' | 'validation' | 'unknown';
}

export interface UseAsyncOperationReturn<TArgs extends unknown[], TResult> {
  isLoading: boolean;
  error: string | null;
  execute: (...args: TArgs) => Promise<TResult | null>;
  clearError: () => void;
}

function handleError(
  err: unknown,
  customMessage?: string,
  category = 'network'
): string {
  const defaultMessage = 'Gagal memuat data.';
  const errorMessage =
    err instanceof Error ? err.message : customMessage || defaultMessage;

  errorReporter.report({
    message: errorMessage,
    stack: err instanceof Error ? err.stack : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
    level: 'error',
    category,
  });

  return errorMessage;
}

export function useAsyncOperation<TArgs extends unknown[], TResult>(
  options: UseAsyncOperationOptions<TArgs, TResult>
): UseAsyncOperationReturn<TArgs, TResult> {
  const { operationFn, errorMessage, category = 'network' } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await operationFn(...args);
        return result;
      } catch (err) {
        const errorMsg = handleError(err, errorMessage, category);
        setError(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [operationFn, errorMessage, category]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    clearError,
  };
}
