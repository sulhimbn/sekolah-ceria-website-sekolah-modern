import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdmissionsPage from '@/pages/AdmissionsPage';

// Mock all heavy components
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactElement }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactElement }) => (
      <div>{children}</div>
    ),
    h1: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
    p: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  },
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

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe('AdmissionsPage', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AdmissionsPage />
        </BrowserRouter>
      )
    ).not.toThrow();
  });

  it('should display admissions page title', () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AdmissionsPage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Pendaftaran Siswa Baru/i)).toBeInTheDocument();
  });
});
