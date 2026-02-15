import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import type { Chat } from '@shared/types';

interface UseChatsReturn {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createChat: (title: string) => Promise<Chat | null>;
  isCreating: boolean;
}

export function useChats(): UseChatsReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.listChats();
      setChats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data chat.';
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'network',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createChat = useCallback(async (title: string): Promise<Chat | null> => {
    if (!title.trim()) return null;
    
    try {
      setIsCreating(true);
      const newChat = await chatService.createChat(title.trim());
      setChats(prev => [...prev, newChat]);
      return newChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat chat.';
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'user',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    isLoading,
    error,
    refetch: fetchChats,
    createChat,
    isCreating,
  };
}
