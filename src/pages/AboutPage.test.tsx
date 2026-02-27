import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '@/pages/AboutPage';

// Mock all heavy components
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactElement }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/components/PlaceholderImage', () => ({
  PlaceholderImage: () => <div data-testid="placeholder" />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactElement }) => (
      <div>{children}</div>
    ),
    h1: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    p: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  },
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
  AvatarImage: () => null,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AboutPage', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AboutPage />
        </BrowserRouter>
      )
    ).not.toThrow();
  });

  it('should display about page title', () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AboutPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Tentang Sekolah Ceria/i)).toBeInTheDocument();
  });
});
