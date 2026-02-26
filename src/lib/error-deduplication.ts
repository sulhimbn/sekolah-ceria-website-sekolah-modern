// ============================================================================
// Error Deduplication - Global error deduplication system
// Extracted from errorReporter.ts to follow single responsibility principle
// ============================================================================

import type {
  ErrorContext,
  ErrorFilterResult,
  ErrorPrecedence,
} from './error-types';
import { hasRelevantSourceCode } from './error-types';

/**
 * Global error deduplication system that prevents duplicate error reports
 * within a configurable time window while prioritizing errors with source code.
 */
export class GlobalErrorDeduplication {
  private reportedErrors = new Map<
    string,
    { timestamp: number; precedence: ErrorPrecedence; reported: boolean }
  >();
  private readonly deduplicationWindow = 5000; // 5 seconds
  private readonly cleanupInterval = 60000; // 1 minute
  private lastCleanup = Date.now();

  private calculatePrecedence(context: ErrorContext): ErrorPrecedence {
    const hasSource = hasRelevantSourceCode(context.stack);
    const isWarning = context.level === 'warning';
    const stackDepth = context.stack ? context.stack.split('\n').length : 0;

    return {
      hasSourceCode: hasSource,
      isWarning,
      stackDepth,
      timestamp: Date.now(),
    };
  }

  private isHigherPrecedence(
    newPrec: ErrorPrecedence,
    existingPrec: ErrorPrecedence
  ): boolean {
    // Prefer errors with source code
    if (newPrec.hasSourceCode !== existingPrec.hasSourceCode) {
      return newPrec.hasSourceCode;
    }

    // For same source code presence, prefer warnings (they often have better stack traces)
    if (newPrec.isWarning !== existingPrec.isWarning) {
      return newPrec.isWarning;
    }

    // Prefer deeper stack traces (more context)
    if (newPrec.stackDepth !== existingPrec.stackDepth) {
      return newPrec.stackDepth > existingPrec.stackDepth;
    }

    // Prefer newer errors
    return newPrec.timestamp > existingPrec.timestamp;
  }

  private generateSignature(context: ErrorContext): string {
    // Normalize message to group all variants of the same error
    let messageCore = context.message
      .replace(/\[CONSOLE ERROR\]|\[WARNING\]/g, '')
      .replace(/^Uncaught Error:\s*/i, '')
      .replace(/^Error:\s*/i, '')
      .replace(/%s.*?\n/g, '') // Remove React formatting
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract the core error message for better grouping
    // For "Maximum update depth exceeded" errors, use just that key phrase
    if (messageCore.includes('Maximum update depth exceeded')) {
      messageCore = 'Maximum update depth exceeded';
    }
    // For getSnapshot errors
    else if (
      messageCore.includes('The result of getSnapshot should be cached')
    ) {
      messageCore = 'The result of getSnapshot should be cached';
    }
    // For React Router caught errors
    else if (messageCore.includes('React Router caught the following error')) {
      messageCore = 'React Router caught error';
    }

    // Don't include stack in signature - just the core message
    // This ensures all variants of the same error are grouped together
    return messageCore;
  }

  /**
   * Determines if an error should be reported based on deduplication rules
   * @param context The error context
   * @param immediate If true, requires source code for immediate reports
   * @returns Whether to report and optional reason
   */
  shouldReport(
    context: ErrorContext,
    immediate = false
  ): { shouldReport: boolean; reason?: string } {
    this.maybeCleanup();

    const signature = this.generateSignature(context);
    const precedence = this.calculatePrecedence(context);
    const existing = this.reportedErrors.get(signature);
    const now = Date.now();

    if (!existing) {
      // For immediate reporting, require source code to avoid vendor-only noise
      if (immediate && !precedence.hasSourceCode) {
        return { shouldReport: false, reason: 'no_source_code' };
      }
      // Record and allow reporting
      this.reportedErrors.set(signature, {
        timestamp: now,
        precedence,
        reported: true,
      });
      return { shouldReport: true };
    }

    // Check if this is a better version of the same error
    if (this.isHigherPrecedence(precedence, existing.precedence)) {
      // Only report if significantly better (has source code when existing doesn't)
      if (precedence.hasSourceCode && !existing.precedence.hasSourceCode) {
        existing.precedence = precedence;
        existing.timestamp = now;
        existing.reported = true;
        return { shouldReport: true };
      }
    }

    // Check deduplication window
    if (now - existing.timestamp < this.deduplicationWindow) {
      return { shouldReport: false, reason: 'duplicate_in_window' };
    }

    // Enough time has passed, but check source code requirement for immediate
    if (immediate && !precedence.hasSourceCode) {
      return { shouldReport: false, reason: 'no_source_code' };
    }

    // Allow reporting after window expires
    existing.timestamp = now;
    existing.precedence = precedence;
    existing.reported = true;
    return { shouldReport: true };
  }

  private maybeCleanup() {
    const now = Date.now();
    if (now - this.lastCleanup > this.cleanupInterval) {
      const cutoff = now - 300000; // 5 minutes
      for (const [signature, data] of this.reportedErrors.entries()) {
        if (data.timestamp < cutoff) {
          this.reportedErrors.delete(signature);
        }
      }
      this.lastCleanup = now;
    }
  }
}

// Global instance shared across all interceptors
export const globalDeduplication = new GlobalErrorDeduplication();
