import { useState, useCallback } from 'react';
import { errorReporter } from '@/lib/errorReporter';

/**
 * Configuration options for useErrorHandler hook
 */
export interface UseErrorHandlerOptions {
  /** Default error message when error has no message */
  defaultMessage?: string;
  /** Category for error reporting (e.g., 'network', 'user', 'validation') */
  category?: string;
  /** Whether to report errors to the error reporter */
  reportErrors?: boolean;
}

/**
 * Return type for useErrorHandler hook
 */
export interface UseErrorHandlerReturn {
  /** Current error message or null if no error */
  error: string | null;
  /** Function to clear the error state */
  clearError: () => void;
  /**
   * Handler function to process errors
   * @param err - The error that occurred
   * @param customMessage - Optional custom message to override default
   */
  handleError: (err: unknown, customMessage?: string) => void;
}

/**
 * Custom hook for standardized error handling across the application
 *
 * Extracts common error handling patterns to reduce duplication in hooks.
 * Handles:
 * - Error state management
 * - Error message extraction
 * - Error reporting to errorReporter
 *
 * @example
 * ```ts
 * const { error, handleError, clearError } = useErrorHandler({
 *   defaultMessage: 'Gagal memuat data.',
 *   category: 'network',
 * });
 *
 * const fetchData = async () => {
 *   try {
 *     const data = await api.getData();
 *     setData(data);
 *   } catch (err) {
 *     handleError(err, 'Gagal memuat data.');
 *   }
 * };
 * ```
 */
export function useErrorHandler(
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn {
  const {
    defaultMessage = 'Terjadi kesalahan.',
    category = 'general',
    reportErrors = true,
  } = options;

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback(
    (err: unknown, customMessage?: string) => {
      const errorMessage =
        customMessage || (err instanceof Error ? err.message : defaultMessage);

      setError(errorMessage);

      if (reportErrors) {
        errorReporter.report({
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined,
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
          level: 'error',
          category,
        });
      }
    },
    [defaultMessage, category, reportErrors]
  );

  return {
    error,
    clearError,
    handleError,
  };
}
