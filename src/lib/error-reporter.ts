// ============================================================================
// Error Reporter - Main error reporting class
// Extracted from errorReporter.ts to follow single responsibility principle
// ============================================================================

import type {
  BaseErrorData,
  ErrorContext,
  ErrorFilterResult,
  ErrorReport,
  WrappedConsoleFn,
  ConsoleMethod,
} from './error-types';
import {
  categorize,
  hasRelevantSourceInStack,
  isDeprecatedReactWarningMessage,
  isReactRouterFutureFlagMessage,
  VENDOR_PATTERNS,
  formatConsoleArgs,
  WARNING_PREFIX,
  CONSOLE_ERROR_PREFIX,
} from './error-types';
import { globalDeduplication } from './error-deduplication';

/**
 * Main ErrorReporter class that handles error reporting to the backend
 */
export class ErrorReporter {
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;
  private readonly maxQueueSize = 10;
  private readonly reportingEndpoint = '/api/client-errors';
  private originalConsoleWarn: typeof console.warn | null = null;
  private originalConsoleError: typeof console.error | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window === 'undefined') return; // Skip in SSR

    try {
      // Set up interceptors IMMEDIATELY using property descriptors to intercept even cached references
      this.setupConsoleInterceptors();
      this.setupGlobalErrorHandler();
      this.setupUnhandledRejectionHandler();

      this.isInitialized = true;
    } catch (err) {
      console.error('[ErrorReporter] Failed to initialize:', err);
    }
  }

  private setupGlobalErrorHandler() {
    const originalHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMessage =
        typeof message === 'string' ? message : 'Unknown error';

      const context: ErrorContext = {
        message: errorMessage,
        stack: error?.stack,
        source: source || undefined,
        level: 'error',
        url: window.location.href,
      };

      const filterResult = this.filterError(context);
      if (!filterResult.shouldReport) {
        // Still call original handler even if we don't report
        if (originalHandler) {
          return originalHandler(message, source, lineno, colno, error);
        }
        return true;
      }

      const payload = this.createErrorPayload({
        message: errorMessage,
        stack: error?.stack,
        parsedStack: this.parseStackTrace(error?.stack),
        source: source || undefined,
        lineno: lineno || undefined,
        colno: colno || undefined,
        error: error,
      });

      this.report(payload);

      // Call original handler if it exists
      if (originalHandler) {
        return originalHandler(message, source, lineno, colno, error);
      }
      return true; // Prevent default browser error handling
    };
  }

  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', event => {
      const error = event.reason;
      const errorMessage = error?.message || 'Unhandled Promise Rejection';

      const context: ErrorContext = {
        message: errorMessage,
        stack: error?.stack,
        level: 'error',
        url: window.location.href,
      };

      const filterResult = this.filterError(context);
      if (!filterResult.shouldReport) return;

      const payload = this.createErrorPayload({
        message: errorMessage,
        stack: error?.stack,
        parsedStack: this.parseStackTrace(error?.stack),
        error: error,
      });

      this.report(payload);
    });
  }

  private createConsoleInterceptor(
    method: ConsoleMethod,
    original: (...args: unknown[]) => void,
    prefix: string
  ) {
    return (...args: Parameters<ConsoleMethod>) => {
      // Call original first
      original.apply(console, args);

      try {
        const message = formatConsoleArgs(args);
        const stack = new Error().stack;
        const level =
          method === 'warn' && message.includes(REACT_WARNING_PATTERN)
            ? 'warning'
            : 'error';

        const context: ErrorContext = {
          message: `${prefix} ${message}`,
          stack,
          level,
          url: window.location.href,
        };

        const filterResult = this.filterError(context);
        if (!filterResult.shouldReport) return;

        const payload = this.createErrorPayload({
          message: context.message,
          stack,
          parsedStack: this.parseStackTrace(stack),
          level,
        });

        this.report(payload);
      } catch {
        // Fail silently
      }
    };
  }

  private setupConsoleInterceptors() {
    this.originalConsoleWarn = console.warn;
    this.originalConsoleError = console.error;

    const currentWarn = console.warn as WrappedConsoleFn;
    const currentError = console.error as WrappedConsoleFn;
    // If already wrapped by immediate interceptors, do not wrap again
    if (
      currentWarn.__errorReporterWrapped &&
      currentError.__errorReporterWrapped
    ) {
      return;
    }

    console.error = this.createConsoleInterceptor(
      'error',
      this.originalConsoleError!,
      CONSOLE_ERROR_PREFIX
    );
    console.warn = this.createConsoleInterceptor(
      'warn',
      this.originalConsoleWarn!,
      WARNING_PREFIX
    );
  }

  private createBaseErrorData(): BaseErrorData {
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
  }

  private createErrorPayload(
    data: Partial<ErrorReport> & { message: string }
  ): ErrorReport {
    const baseData = this.createBaseErrorData();
    return {
      ...baseData,
      level: (data.level ?? 'error') as 'error' | 'warning' | 'info',
      category: categorize(data.message),
      ...data,
    };
  }

  private filterError(context: ErrorContext): ErrorFilterResult {
    const { message, stack, level, source } = context;

    // Skip our own debug messages
    if (message.includes('[ErrorReporter]')) {
      return { shouldReport: false, reason: 'internal_debug' };
    }

    // Skip React Router future flag warnings
    if (isReactRouterFutureFlagMessage(message)) {
      return { shouldReport: false, reason: 'react_router_future_flag' };
    }

    // Skip deprecated React lifecycle warnings
    if (level === 'warning' && isDeprecatedReactWarningMessage(message)) {
      return { shouldReport: false, reason: 'deprecated_react_warning' };
    }

    // For uncaught errors, require relevant source code in stack trace
    if (
      level === 'error' &&
      message.includes('Uncaught Error') &&
      !hasRelevantSourceInStack(stack)
    ) {
      return { shouldReport: false, reason: 'no_relevant_source' };
    }

    // For general errors from vendor code only, skip if no source code involvement
    if (
      level === 'error' &&
      source &&
      VENDOR_PATTERNS.some(pattern => pattern.test(source)) &&
      !hasRelevantSourceInStack(stack)
    ) {
      return { shouldReport: false, reason: 'vendor_only_error' };
    }

    // Use global deduplication to handle precedence and avoid duplicates
    const deduplicationResult = globalDeduplication.shouldReport(
      context,
      false
    );
    if (!deduplicationResult.shouldReport)
      return { shouldReport: false, reason: deduplicationResult.reason };

    return { shouldReport: true };
  }

  private parseStackTrace(stack?: string): string {
    if (!stack) return '';

    try {
      const lines = stack.split('\n');
      const parsedLines: string[] = [];

      for (const line of lines) {
        // Skip generic error lines
        if (line.includes('Error') && !line.includes('at ')) continue;

        let parsedLine = line.trim();

        // Look for React component patterns in source files
        const componentMatch = line.match(
          /at (\w+) \(.*?\/src\/(.*?):(\d+):(\d+)\)/
        );
        if (componentMatch) {
          const [, componentName, filePath, lineNum, colNum] = componentMatch;
          parsedLine = `    at ${componentName} (${filePath}:${lineNum}:${colNum})`;
        } else {
          // Look for any patterns in src directory
          const srcMatch = line.match(/at.*?\/src\/(.*?):(\d+):(\d+)/);
          if (srcMatch) {
            const [, filePath, lineNum, colNum] = srcMatch;
            parsedLine = `    at ${filePath}:${lineNum}:${colNum}`;
          } else {
            // Look for function names at the start of lines
            const functionMatch = line.match(/at\s+(\w+)\s+\(/);
            if (functionMatch) {
              parsedLine = line;
            }
          }
        }

        if (parsedLine) {
          parsedLines.push(parsedLine);
        }
      }

      return parsedLines.join('\n');
    } catch {
      return stack; // Return original if parsing fails
    }
  }

  /**
   * Report an error to the backend
   */
  public report(error: ErrorReport): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      this.errorQueue.push(error);

      // Limit queue size
      if (this.errorQueue.length > this.maxQueueSize) {
        this.errorQueue.shift(); // Remove oldest error
      }

      // Process queue
      this.processQueue();
    } catch (err) {
      // Swallow reporting errors in client
    }
  }

  private async processQueue() {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;
    const errorsToReport = [...this.errorQueue];
    this.errorQueue = [];

    try {
      for (const error of errorsToReport) {
        await this.sendError(error);
      }
    } catch (err) {
      // If reporting fails, add errors back to queue
      console.error('[ErrorReporter] Failed to report errors:', err);
      this.errorQueue.unshift(...errorsToReport);
    } finally {
      this.isReporting = false;
    }
  }

  private async sendError(error: ErrorReport) {
    try {
      const response = await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to report error: ${response.status} ${response.statusText}`
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }

      console.log(
        '[ErrorReporter] Error reported successfully:',
        error.message
      );
    } catch (err) {
      console.error('[ErrorReporter] Failed to send error:', err);
      throw err;
    }
  }

  /**
   * Cleanup method for proper disposal
   */
  public dispose(): void {
    if (this.originalConsoleWarn) {
      console.warn = this.originalConsoleWarn;
    }
    if (this.originalConsoleError) {
      console.error = this.originalConsoleError;
    }
    this.isInitialized = false;
  }
}

// ============================================================================
// Cleanup on page unload
// ============================================================================

let reporterInstance: ErrorReporter | null = null;

export const createErrorReporter = (): ErrorReporter => {
  if (!reporterInstance) {
    reporterInstance = new ErrorReporter();
  }
  return reporterInstance;
};

export const getErrorReporter = (): ErrorReporter => {
  if (!reporterInstance) {
    reporterInstance = new ErrorReporter();
  }
  return reporterInstance;
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  const reporter = createErrorReporter();
  window.addEventListener('beforeunload', () => {
    reporter.dispose();
  });
}
