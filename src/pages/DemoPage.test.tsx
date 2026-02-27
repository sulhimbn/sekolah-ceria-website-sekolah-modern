import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DemoPage } from '@/pages/DemoPage';

// Mock all heavy components
vi.mock('@/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactElement }) => (
    <div data-testid="app-layout">{children}</div>
  ),
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

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('@/hooks/api/use-users', () => ({
  useUsers: vi.fn(() => ({
    users: [],
    isLoading: false,
    createUser: vi.fn(),
    isCreating: false,
  })),
}));

vi.mock('@/hooks/api/use-chats', () => ({
  useChats: vi.fn(() => ({
    chats: [],
    isLoading: false,
    createChat: vi.fn(),
    isCreating: false,
  })),
}));

vi.mock('@/hooks/api/use-chat-messages', () => ({
  useChatMessages: vi.fn(() => ({
    messages: [],
    isLoading: false,
    loadMessages: vi.fn(),
    sendMessage: vi.fn(),
    isSending: false,
  })),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('DemoPage', () => {
  it('should render without crashing', () => {
    expect(() => render(<DemoPage />)).not.toThrow();
  });

  it('should display demo page title', () => {
    render(<DemoPage />);
    expect(screen.getByText(/Minimal Users/i)).toBeInTheDocument();
  });
});
