import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Import hooks to test
import { useNews, useNewsSearch } from './use-news';
import { useUsers } from './use-users';
import { useContactForm } from './use-contact-form';
import { useNewsArticle } from './use-news-article';
import { useChats } from './use-chats';
import { useChatMessages } from './use-chat-messages';

// Mock services
vi.mock('@/services/news.service', () => ({
  newsService: {
    listArticles: vi.fn(),
    getArticle: vi.fn(),
  },
}));

vi.mock('@/services', () => ({
  userService: {
    listUsers: vi.fn(),
    createUser: vi.fn(),
  },
  contactService: {
    submitContactForm: vi.fn(),
  },
  chatService: {
    listChats: vi.fn(),
    createChat: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock('@/lib/error-reporting', () => ({
  errorReporter: {
    report: vi.fn(),
  },
}));

vi.mock('@/lib/feature-flags', () => ({
  FEATURE_FLAGS: {
    TANSTACK_QUERY_STALE_TIME: 5 * 60 * 1000,
    TANSTACK_QUERY_CACHE_TIME: 10 * 60 * 1000,
    FEATURE_SEMANTIC_SEARCH: false,
  },
}));

// Import mock functions after vi.mock
import { newsService } from '@/services/news.service';
import { userService, contactService, chatService } from '@/services';

// Test data
const mockNewsArticles = [
  {
    id: '1',
    title: 'News 1',
    slug: 'news-1',
    content: 'Content 1',
    excerpt: 'Excerpt 1',
    publishedAt: '2026-01-01',
    author: 'Author 1',
    imageUrl: null,
    category: 'news',
  },
  {
    id: '2',
    title: 'News 2',
    slug: 'news-2',
    content: 'Content 2',
    excerpt: 'Excerpt 2',
    publishedAt: '2026-01-02',
    author: 'Author 2',
    imageUrl: null,
    category: 'event',
  },
];

const mockUsers = [
  {
    id: '1',
    name: 'User 1',
    email: 'user1@test.com',
    role: 'admin',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    name: 'User 2',
    email: 'user2@test.com',
    role: 'user',
    createdAt: '2026-01-02',
  },
];

const mockChats = [
  {
    id: '1',
    title: 'Chat 1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    title: 'Chat 2',
    createdAt: '2026-01-02',
    updatedAt: '2026-01-02',
  },
];

const mockMessages = [
  { id: '1', chatId: '1', userId: '1', text: 'Hello', createdAt: '2026-01-01' },
  {
    id: '2',
    chatId: '1',
    userId: '2',
    text: 'Hi there',
    createdAt: '2026-01-02',
  },
];

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNews Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (newsService.listArticles as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockNewsArticles
    );
  });

  it('should fetch news articles successfully', async () => {
    const { result } = renderHook(() => useNews(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.articles).toEqual(mockNewsArticles);
    expect(result.current.error).toBeNull();
  });
});

describe('useNewsSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (newsService.listArticles as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockNewsArticles
    );
  });

  it('should initialize with empty search query', async () => {
    const { result } = renderHook(() => useNewsSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual(mockNewsArticles);
  });

  it('should update search query when setSearchQuery is called', async () => {
    const { result } = renderHook(() => useNewsSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.setSearchQuery('test query');

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('test query');
    });
  });

  it('should have searchMode as keyword by default', async () => {
    const { result } = renderHook(() => useNewsSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.searchMode).toBe('keyword');
  });
});

describe('useUsers Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (userService.listUsers as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockUsers
    );
    (userService.createUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: '3',
      name: 'New User',
      email: 'new@test.com',
      role: 'user',
      createdAt: '2026-01-03',
    });
  });

  it('should fetch users successfully', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it('should create user successfully', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newUser = await result.current.createUser('New User');

    expect(newUser).toEqual({
      id: '3',
      name: 'New User',
      email: 'new@test.com',
      role: 'user',
      createdAt: '2026-01-03',
    });
    expect(userService.createUser).toHaveBeenCalledWith('New User');
  });
});

describe('useContactForm Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (
      contactService.submitContactForm as ReturnType<typeof vi.fn>
    ).mockResolvedValue(undefined);
  });

  it('should submit contact form successfully', async () => {
    const { result } = renderHook(() => useContactForm());

    const formData = {
      name: 'Test User',
      email: 'test@test.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    await expect(
      result.current.submitContactForm(formData)
    ).resolves.not.toThrow();
    expect(contactService.submitContactForm).toHaveBeenCalledWith(formData);
  });

  it('should handle submit errors', async () => {
    (
      contactService.submitContactForm as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('Submit failed'));

    const { result } = renderHook(() => useContactForm());

    const formData = {
      name: 'Test User',
      email: 'test@test.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    await expect(result.current.submitContactForm(formData)).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBe('Submit failed');
    });
  });

  it('should clear error when clearError is called', async () => {
    (
      contactService.submitContactForm as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('Submit failed'));

    const { result } = renderHook(() => useContactForm());

    const formData = {
      name: 'Test User',
      email: 'test@test.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    await expect(result.current.submitContactForm(formData)).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBe('Submit failed');
    });

    result.current.clearError();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

describe('useNewsArticle Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (newsService.getArticle as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockNewsArticles[0]
    );
  });

  it('should fetch article by ID successfully', async () => {
    const { result } = renderHook(() => useNewsArticle('1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.article).toEqual(mockNewsArticles[0]);
    expect(result.current.error).toBeNull();
  });

  it('should handle invalid ID', async () => {
    const { result } = renderHook(() => useNewsArticle(''));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.article).toBeNull();
    expect(result.current.error).toBe('ID artikel tidak valid');
  });

  it('should handle fetch errors', async () => {
    (newsService.getArticle as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Not found')
    );

    const { result } = renderHook(() => useNewsArticle('999'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.article).toBeNull();
    expect(result.current.error).toBe('Not found');
  });
});

describe('useChats Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (chatService.listChats as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockChats
    );
    (chatService.createChat as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: '3',
      title: 'New Chat',
      createdAt: '2026-01-03',
      updatedAt: '2026-01-03',
    });
  });

  it('should fetch chats successfully', async () => {
    const { result } = renderHook(() => useChats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.chats).toEqual(mockChats);
    expect(result.current.error).toBeNull();
  });

  it('should create chat successfully', async () => {
    const { result } = renderHook(() => useChats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newChat = await result.current.createChat('New Chat');

    expect(newChat).toEqual({
      id: '3',
      title: 'New Chat',
      createdAt: '2026-01-03',
      updatedAt: '2026-01-03',
    });
    expect(chatService.createChat).toHaveBeenCalledWith('New Chat');
  });

  it('should handle empty title for createChat', async () => {
    const { result } = renderHook(() => useChats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newChat = await result.current.createChat('   ');

    expect(newChat).toBeNull();
    expect(chatService.createChat).not.toHaveBeenCalled();
  });
});

describe('useChatMessages Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (chatService.getMessages as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockMessages
    );
    (chatService.sendMessage as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: '3',
      chatId: '1',
      userId: '1',
      text: 'New message',
      createdAt: '2026-01-03',
    });
  });

  it('should load messages for a chat', async () => {
    const { result } = renderHook(() => useChatMessages());

    await result.current.loadMessages('1');

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockMessages);
    });
    expect(result.current.error).toBeNull();
  });

  it('should not load messages for empty chatId', async () => {
    const { result } = renderHook(() => useChatMessages());

    await result.current.loadMessages('');

    expect(result.current.messages).toEqual([]);
    expect(chatService.getMessages).not.toHaveBeenCalled();
  });

  it('should send message successfully', async () => {
    const { result } = renderHook(() => useChatMessages());

    const message = await result.current.sendMessage('1', '1', 'New message');

    expect(message).toEqual({
      id: '3',
      chatId: '1',
      userId: '1',
      text: 'New message',
      createdAt: '2026-01-03',
    });
    expect(chatService.sendMessage).toHaveBeenCalledWith(
      '1',
      '1',
      'New message'
    );
  });

  it('should not send message with invalid params', async () => {
    const { result } = renderHook(() => useChatMessages());

    const message = await result.current.sendMessage('', '1', 'Test');
    expect(message).toBeNull();

    const message2 = await result.current.sendMessage('1', '', 'Test');
    expect(message2).toBeNull();

    const message3 = await result.current.sendMessage('1', '1', '   ');
    expect(message3).toBeNull();
  });
});
