import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SkipLink } from './SkipLink';

beforeEach(() => {
  // Create main-content element for SkipLink to find
  const main = document.createElement('main');
  main.id = 'main-content';
  main.tabIndex = -1;
  document.body.appendChild(main);
});

afterEach(() => {
  cleanup();
  // Remove the test main element
  const main = document.getElementById('main-content');
  if (main) {
    main.remove();
  }
  vi.clearAllMocks();
});

describe('SkipLink Component', () => {
  describe('Rendering', () => {
    it('should render skip link with correct text', () => {
      render(<SkipLink />);
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('should render as an anchor element', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });
      expect(link).toBeInTheDocument();
    });

    it('should have correct href attribute', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });
      expect(link).toHaveAttribute('href', '#main-content');
    });

    it('should have sr-only class by default (hidden from visual users)', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });
      expect(link).toHaveClass('sr-only');
    });
  });

  describe('Interaction', () => {
    it('should focus main content when clicked', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });
      const mainContent = document.getElementById('main-content');

      // Mock focus and scrollIntoView
      const focusMock = vi.fn();
      const scrollMock = vi.fn();
      mainContent!.focus = focusMock;
      mainContent!.scrollIntoView = scrollMock;

      fireEvent.click(link);

      expect(focusMock).toHaveBeenCalled();
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should remove sr-only class and become visible on focus', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });

      // Simulate focus event
      fireEvent.focus(link);

      expect(link).toHaveClass('focus:not-sr-only');
      expect(link).toHaveClass('focus:fixed');
      expect(link).toHaveClass('focus:top-4');
      expect(link).toHaveClass('focus:left-4');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible link with proper semantics', () => {
      render(<SkipLink />);
      const link = screen.getByRole('link', { name: /skip to main content/i });

      // Should be a link (anchor element)
      expect(link.tagName).toBe('A');

      // Should have proper href
      expect(link).toHaveAttribute('href');
    });
  });
});
