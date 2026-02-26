// ============================================================================
// Error Types - All interfaces for error reporting system
// Extracted from errorReporter.ts to follow single responsibility principle
// ============================================================================

export interface BaseErrorData {
  url: string;
  timestamp: string;
}

export interface ErrorReport extends BaseErrorData {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  errorBoundaryProps?: Record<string, unknown>;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
  level: 'error' | 'warning' | 'info';
  parsedStack?: string;
  category?: 'react' | 'javascript' | 'network' | 'user' | 'unknown';
}

export type ConsoleMethod = 'warn' | 'error';
export type ConsoleArgs = unknown[];

export interface ErrorFilterResult {
  shouldReport: boolean;
  reason?: string;
}

export interface ErrorContext {
  message: string;
  stack?: string;
  source?: string;
  url?: string;
  level: 'error' | 'warning' | 'info';
}

export interface ErrorPrecedence {
  hasSourceCode: boolean;
  isWarning: boolean;
  stackDepth: number;
  timestamp: number;
}

export type WrappedConsoleFn = ((...args: unknown[]) => void) & {
  __errorReporterWrapped?: boolean;
};

export type ConsoleNative = (...args: unknown[]) => void;

// ============================================================================
// Shared categorization utility
// ============================================================================

/**
 * Categorizes error messages into specific categories for better tracking
 */
export const categorize = (message: string): ErrorReport['category'] => {
  if (message.includes('Warning:') || message.includes('React')) return 'react';
  if (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('Failed to load')
  )
    return 'network';
  if (
    message.includes('TypeError') ||
    message.includes('ReferenceError') ||
    message.includes('SyntaxError')
  )
    return 'javascript';
  return 'unknown';
};

// ============================================================================
// Shared patterns and constants
// ============================================================================

export const REACT_WARNING_PATTERN = 'Warning:' as const;
export const WARNING_PREFIX = '[WARNING]' as const;
export const CONSOLE_ERROR_PREFIX = '[CONSOLE ERROR]' as const;

export const SOURCE_FILE_PATTERNS: ReadonlyArray<RegExp> = [
  /\.tsx?$/,
  /\.jsx?$/,
  /\/src\//,
];

export const VENDOR_PATTERNS: ReadonlyArray<RegExp> = [
  /node_modules/,
  /\.vite/,
  /chunk-/,
  /deps/,
];

// ============================================================================
// Utility functions
// ============================================================================

export const isReactRouterFutureFlagMessage = (message: string): boolean => {
  const futurePatterns = [
    /React Router Future Flag Warning/i,
    /future flag to opt-in early/i,
    /reactrouter\.com.*upgrading.*future/i,
    /v7_\w+.*future flag/i,
  ];
  return futurePatterns.some(p => p.test(message));
};

export const isDeprecatedReactWarningMessage = (message: string): boolean => {
  const deprecatedPatterns = [
    /componentWillReceiveProps/,
    /componentWillMount/,
    /componentWillUpdate/,
    /UNSAFE_componentWill/,
  ];
  return deprecatedPatterns.some(p => p.test(message));
};

export const hasRelevantSourceInStack = (stack?: string): boolean => {
  if (!stack) return false;
  const lines = stack.split('\n');
  const hasSourceFiles = lines.some(line =>
    SOURCE_FILE_PATTERNS.some(pat => pat.test(line))
  );
  if (hasSourceFiles) return true;

  const isAllVendor = lines.every(
    line =>
      line.trim() === '' ||
      line.includes('Error') ||
      VENDOR_PATTERNS.some(pat => pat.test(line))
  );
  return !isAllVendor;
};

export const hasRelevantSourceCode = (stack?: string): boolean => {
  if (!stack) return false;
  return stack
    .split('\n')
    .some(
      line =>
        /\.tsx?$/.test(line) || /\.jsx?$/.test(line) || /\/src\//.test(line)
    );
};

// Format console arguments to string
export const formatConsoleArgs = (args: unknown[]): string => {
  return args
    .map(arg =>
      typeof arg === 'string'
        ? arg
        : typeof arg === 'object' && arg
          ? JSON.stringify(arg, null, 2)
          : String(arg)
    )
    .join(' ');
};

export type ImmediatePayload = Pick<
  ErrorReport,
  'message' | 'stack' | 'url' | 'timestamp' | 'level' | 'category'
>;

export const createImmediateErrorPayload = (
  message: string,
  level: 'warning' | 'error'
): ImmediatePayload => ({
  message,
  stack: new Error().stack,
  url: typeof window !== 'undefined' ? window.location.href : '',
  timestamp: new Date().toISOString(),
  level,
  category: categorize(message),
});
