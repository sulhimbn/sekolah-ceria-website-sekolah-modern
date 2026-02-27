import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AcademicsPage from '@/pages/AcademicsPage';

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
    h2: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    p: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  },
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AcademicsPage', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <BrowserRouter>
          <AcademicsPage />
        </BrowserRouter>
      )
    ).not.toThrow();
  });

  it('should display academics page title', () => {
    render(
      <BrowserRouter>
        <AcademicsPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Program Akademik/i)).toBeInTheDocument();
  });
});
