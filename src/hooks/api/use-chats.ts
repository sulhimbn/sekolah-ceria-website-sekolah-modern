import { useState, useCallback } from 'react';
import { chatService } from '@/services';
import { useApiResource, useApiResourceMutation } from './use-api-resource';
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

  const { isLoading, error, refetch } = useApiResource<Chat[]>(
    () => chatService.listChats(),
    'Gagal memuat data chat.'
  );

  const { mutate: createChatMutate, isSubmitting: isCreating } =
    useApiResourceMutation<string, Chat>(
      (title: string) => chatService.createChat(title.trim()),
      'Gagal membuat chat.'
    );

  const createChat = useCallback(
    async (title: string): Promise<Chat | null> => {
      if (!title.trim()) return null;
      const newChat = await createChatMutate(title);
      if (newChat) {
        setChats(prev => [...prev, newChat]);
      }
      return newChat;
    },
    [createChatMutate]
  );

  return {
    chats: chats || [],
    isLoading,
    error,
    refetch,
    createChat,
    isCreating,
  };
}
