import { useCallback } from 'react';
import { errorReporter } from '@/lib/errorReporter';

/**
 * Error categories for reporting
 */
export type ErrorCategory = 'network' | 'user' | 'validation' | 'unknown';

/**
 * Options for useErrorHandler hook
 */
interface UseErrorHandlerOptions {
  /** Default error message when error has no message */
  defaultMessage: string;
  /** Category for error reporting */
  category: ErrorCategory;
}

/**
 * Result from useErrorHandler hook
 */
interface UseErrorHandlerResult {
  /** Function to handle an error */
  handleError: (error: unknown, customMessage?: string) => string;
  /** Clear the error state */
  clearError: () => void;
}

/**
 * Creates error handling utilities for API hooks
 *
 * Extracts common error handling patterns to reduce duplication
 * across multiple hook files.
 *
 * @param options - Configuration options
 * @returns Error handler functions
 *
 * @example
 * ```typescript
 * const { handleError, clearError } = useErrorHandler({
 *   defaultMessage: 'Gagal memuat data.',
 *   category: 'network'
 * });
 *
 * try {
 *   const data = await fetchData();
 *   setData(data);
 * } catch (err) {
 *   const message = handleError(err);
 *   setError(message);
 * }
 * ```
 */
export function useErrorHandler(
  setError: (error: string | null) => void,
  options: UseErrorHandlerOptions
): UseErrorHandlerResult {
  const { defaultMessage, category } = options;

  const handleError = useCallback(
    (error: unknown, customMessage?: string): string => {
      const errorMessage =
        customMessage ||
        (error instanceof Error ? error.message : defaultMessage);

      setError(errorMessage);

      errorReporter.report({
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category,
      });

      return errorMessage;
    },
    [defaultMessage, category, setError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    handleError,
    clearError,
  };
}
