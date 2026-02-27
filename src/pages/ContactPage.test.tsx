import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from '@/pages/ContactPage';

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

vi.mock('@/hooks/api', () => ({
  useContactForm: vi.fn(() => ({
    isSubmitting: false,
    submitContactForm: vi.fn().mockResolvedValue({ success: true }),
  })),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} data-testid="input" />,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} data-testid="textarea" />,
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormField: ({ render }: any) => render({ field: {} }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: () => <span />,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ContactPage', () => {
  it('should render without crashing', () => {
    expect(() =>
      render(
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ContactPage />
        </BrowserRouter>
      )
    ).not.toThrow();
  });

  it('should display main layout', () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ContactPage />
      </BrowserRouter>
    );
  });
  it('should display main layout', () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ContactPage />
      </BrowserRouter>
    );
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});
