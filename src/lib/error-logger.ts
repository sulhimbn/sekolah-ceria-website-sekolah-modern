// ============================================================================
// Error Logger - Console interceptors for error logging
// Extracted from errorReporter.ts to follow single responsibility principle
// ============================================================================

import type {
  ConsoleMethod,
  ConsoleNative,
  ConsoleArgs,
  ErrorContext,
  ImmediatePayload,
  WrappedConsoleFn,
} from './error-types';
import {
  formatConsoleArgs,
  createImmediateErrorPayload,
  REACT_WARNING_PATTERN,
  WARNING_PREFIX,
  CONSOLE_ERROR_PREFIX,
} from './error-types';
import { globalDeduplication } from './error-deduplication';

/**
 * Determines if an immediate console error should be reported
 */
export const shouldReportImmediate = (context: ErrorContext): boolean => {
  const { message, stack, level } = context;

  // Skip internal debug messages
  if (message.includes('[ErrorReporter]')) return false;

  // Skip React Router future flag warnings
  const futurePatterns = [
    /React Router Future Flag Warning/i,
    /future flag to opt-in early/i,
    /reactrouter\.com.*upgrading.*future/i,
    /v7_\w+.*future flag/i,
  ];
  if (futurePatterns.some(pattern => pattern.test(message))) return false;

  // Skip deprecated React lifecycle warnings
  const deprecatedPatterns = [
    /componentWillReceiveProps/,
    /componentWillMount/,
    /componentWillUpdate/,
    /UNSAFE_componentWill/,
  ];
  if (
    level === 'warning' &&
    deprecatedPatterns.some(pattern => pattern.test(message))
  )
    return false;

  // For errors without proper source code, skip them
  const hasSourceCode = stack
    ? stack
        .split('\n')
        .some(
          line =>
            /\.tsx?$/.test(line) || /\.jsx?$/.test(line) || /\/src\//.test(line)
        )
    : false;

  // Skip uncaught errors without source code
  if (level === 'error' && message.includes('Uncaught Error') && !hasSourceCode)
    return false;

  // Skip Maximum update depth errors without source code
  if (message.includes('Maximum update depth exceeded') && !hasSourceCode)
    return false;

  // Use global deduplication with immediate flag
  const deduplicationResult = globalDeduplication.shouldReport(context, true);
  return deduplicationResult.shouldReport;
};

/**
 * Sends immediate error to the reporting endpoint
 */
export const sendImmediateError = async (
  payload: ImmediatePayload
): Promise<void> => {
  try {
    await fetch('/api/client-errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Fail silently
  }
};

/**
 * Creates an immediate console interceptor function
 */
export const createImmediateInterceptor = (
  original: ConsoleNative,
  prefix: string,
  defaultLevel: 'warning' | 'error'
) =>
  function (...args: unknown[]) {
    original.apply(console, args);

    try {
      const message = formatConsoleArgs(args);
      const stack = new Error().stack;
      const level = message.includes('Warning:') ? 'warning' : defaultLevel;

      const context: ErrorContext = {
        message: `${prefix} ${message}`,
        stack,
        level,
        url: typeof window !== 'undefined' ? window.location.href : '',
      };

      if (shouldReportImmediate(context)) {
        const payload = createImmediateErrorPayload(context.message, level);
        sendImmediateError(payload);
      }
    } catch {
      // Fail silently
    }
  };

/**
 * Sets up immediate console interceptors before React can cache them
 * This runs synchronously at module load time
 */
export const setupImmediateInterceptors = (): void => {
  if (typeof window === 'undefined') return;

  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = createImmediateInterceptor(
    originalWarn,
    '[WARNING]',
    'warning'
  ) as WrappedConsoleFn;
  (console.warn as WrappedConsoleFn).__errorReporterWrapped = true;

  console.error = createImmediateInterceptor(
    originalError,
    '[CONSOLE ERROR]',
    'error'
  ) as WrappedConsoleFn;
  (console.error as WrappedConsoleFn).__errorReporterWrapped = true;
};

// Run immediately at module load
setupImmediateInterceptors();
