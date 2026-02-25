import { useState, useCallback } from 'react';
import { errorReporter } from '@/lib/errorReporter';

interface UseErrorHandlerOptions {
  /** Default error message when error is not an Error instance */
  defaultMessage?: string;
  /** Default category for error reporting */
  defaultCategory?: 'react' | 'javascript' | 'network' | 'user' | 'unknown';
}

interface UseErrorHandlerReturn {
  /** Current error message or null if no error */
  error: string | null;
  /** Function to set error state */
  setError: (error: string | null) => void;
  /** Function to handle error with automatic reporting */
  handleError: (
    err: unknown,
    options?: {
      message?: string;
      category?: 'react' | 'javascript' | 'network' | 'user' | 'unknown';
    }
  ) => void;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Custom hook for handling errors consistently across the application.
 * Extracts common error handling patterns to reduce duplication.
 *
 * @example
 * ```typescript
 * const { error, handleError, clearError } = useErrorHandler({
 *   defaultMessage: 'Terjadi kesalahan',
 *   defaultCategory: 'network'
 * });
 *
 * const fetchData = async () => {
 *   try {
 *     const data = await apiCall();
 *     return data;
 *   } catch (err) {
 *     handleError(err, { category: 'network' });
 *   }
 * };
 * ```
 */
export function useErrorHandler(
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn {
  const { defaultMessage = 'Terjadi kesalahan', defaultCategory = 'unknown' } =
    options;

  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback(
    (
      err: unknown,
      opts?: {
        message?: string;
        category?: 'react' | 'javascript' | 'network' | 'user' | 'unknown';
      }
    ) => {
      const errorMessage =
        err instanceof Error ? err.message : (opts?.message ?? defaultMessage);
      const category = opts?.category ?? defaultCategory;

      setError(errorMessage);

      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category,
      });
    },
    [defaultMessage, defaultCategory]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
}
