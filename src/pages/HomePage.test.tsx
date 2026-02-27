import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';

// Mock all heavy components
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactElement }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/components/PlaceholderImage', () => ({
  PlaceholderImage: () => <div data-testid="placeholder" />,
}));

vi.mock('@/components/NewsCardSkeleton', () => ({
  NewsCardSkeleton: () => <div data-testid="skeleton">Loading</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactElement }) => (
      <div>{children}</div>
    ),
  },
}));

// Mock services
vi.mock('@/services/news.service', () => ({
  newsService: {
    listArticles: vi.fn().mockResolvedValue([]),
    getRecentArticles: vi.fn().mockReturnValue([]),
  },
}));

vi.mock('@/lib/error-reporting', () => ({
  errorReporter: { report: vi.fn() },
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HomePage', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      )
    ).not.toThrow();
  });

  it('should display main layout', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
  });
});
