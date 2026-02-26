// ============================================================================
// Error Reporter - Barrel file
// This file re-exports all error reporting modules for backward compatibility
// The original errorReporter.ts (794 lines) has been split into focused modules:
// - error-types.ts: All interfaces and shared utilities
// - error-deduplication.ts: GlobalErrorDeduplication class
// - error-logger.ts: Console interceptors
// - error-reporter.ts: ErrorReporter class
// ============================================================================

// Re-export types for backward compatibility
export type {
  BaseErrorData,
  ErrorReport,
  ConsoleMethod,
  ConsoleArgs,
  ErrorFilterResult,
  ErrorContext,
  ErrorPrecedence,
  WrappedConsoleFn,
  ConsoleNative,
  ImmediatePayload,
} from './error-types';

// Re-export shared utilities
export {
  categorize,
  REACT_WARNING_PATTERN,
  WARNING_PREFIX,
  CONSOLE_ERROR_PREFIX,
  SOURCE_FILE_PATTERNS,
  VENDOR_PATTERNS,
  isReactRouterFutureFlagMessage,
  isDeprecatedReactWarningMessage,
  hasRelevantSourceInStack,
  hasRelevantSourceCode,
  formatConsoleArgs,
  createImmediateErrorPayload,
} from './error-types';

// Re-export deduplication
export {
  GlobalErrorDeduplication,
  globalDeduplication,
} from './error-deduplication';

// Re-export logger utilities
export {
  shouldReportImmediate,
  sendImmediateError,
  createImmediateInterceptor,
  setupImmediateInterceptors,
} from './error-logger';

// Re-export ErrorReporter class and factory
export {
  ErrorReporter,
  createErrorReporter,
  getErrorReporter,
} from './error-reporter';

// Create and export singleton instance for backward compatibility
// This ensures all existing imports like `import { errorReporter } from "@/lib/errorReporter"` still work
import { ErrorReporter } from './error-reporter';

export const errorReporter = new ErrorReporter();
