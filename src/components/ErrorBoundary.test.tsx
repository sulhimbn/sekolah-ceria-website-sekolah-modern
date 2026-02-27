import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';

// Use vi.hoisted to define mock before vi.mock is hoisted
const { mockErrorReporter } = vi.hoisted(() => ({
  mockErrorReporter: {
    report: vi.fn(),
  },
}));

vi.mock('@/lib/error-reporting', () => ({
  errorReporter: mockErrorReporter,
}));

// Mock window.location
const locationMock = {
  href: '',
  reload: vi.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: locationMock,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Reset location mocks
  locationMock.href = '';
  locationMock.reload.mockClear();
});

describe('ErrorBoundary Component', () => {
  describe('Error Catching', () => {
    it('should catch error from child component and render fallback', () => {
      // Create a component that throws an error
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Should show the fallback UI
      expect(
        screen.getByText(/Oops! Something went wrong/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
      expect(screen.getByText(/Go to Homepage/i)).toBeInTheDocument();
    });

    it('should catch error and call errorReporter.report', () => {
      const ThrowingComponent = () => {
        throw new Error('Reported error');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Verify errorReporter was called
      expect(mockErrorReporter.report).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Reported error',
          errorBoundary: true,
        })
      );
    });

    it('should render custom fallback when provided', () => {
      const customFallback = vi.fn((error, errorInfo, retry) => (
        <div data-testid="custom-fallback">
          <p>Custom error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      ));

      const ThrowingComponent = () => {
        throw new Error('Custom fallback test');
      };

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Should render custom fallback
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(
        screen.getByText(/Custom error: Custom fallback test/i)
      ).toBeInTheDocument();
      // Verify custom fallback was called with error and retry function
      expect(customFallback).toHaveBeenCalled();
    });
  });

  describe('Fallback UI Rendering', () => {
    it('should render ErrorFallback component with default props', () => {
      const ThrowingComponent = () => {
        throw new Error('Fallback test');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Check default title and message
      expect(
        screen.getByText('Oops! Something went wrong')
      ).toBeInTheDocument();
      expect(screen.getByText(/We're aware of the issue/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Our team has been notified/i)
      ).toBeInTheDocument();
    });

    it('should render fallback UI with custom title and message', () => {
      const ThrowingComponent = () => {
        throw new Error('Custom messages test');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Verify Try Again and Go to Homepage buttons exist
      expect(
        screen.getByRole('button', { name: /Try Again/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Go to Homepage/i })
      ).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should call window.location.reload when retry is clicked', () => {
      const ThrowingComponent = () => {
        throw new Error('Retry test');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Click Try Again button
      const retryButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(retryButton);

      // Verify window.location.reload was called
      expect(locationMock.reload).toHaveBeenCalled();
    });

    it('should call onGoHome when Go to Homepage is clicked', () => {
      const ThrowingComponent = () => {
        throw new Error('Go home test');
      };

      render(
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      );

      // Click Go to Homepage button
      const homeButton = screen.getByRole('button', {
        name: /Go to Homepage/i,
      });
      fireEvent.click(homeButton);

      // Verify window.location.href was set
      expect(window.location.href).toBe('/');
    });
  });

  describe('Children Rendering', () => {
    it('should render children when no error occurs', () => {
      const SafeComponent = () => (
        <div data-testid="safe-child">Safe Content</div>
      );

      const { container } = render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      // Should render the child component
      expect(screen.getByTestId('safe-child')).toBeInTheDocument();
      expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('should not render fallback when no error occurs', () => {
      const SafeComponent = () => <div>Safe</div>;

      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      // Should NOT show fallback UI
      expect(
        screen.queryByText(/Oops! Something went wrong/i)
      ).not.toBeInTheDocument();
    });
  });
});
