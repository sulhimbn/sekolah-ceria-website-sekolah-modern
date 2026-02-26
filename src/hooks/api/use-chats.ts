import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import type { Chat } from '@shared/types';
import { useApiResource } from './use-api-resource';

interface UseChatsReturn {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createChat: (title: string) => Promise<Chat | null>;
  isCreating: boolean;
}

const CHATS_QUERY_KEY = ['chats', 'list'];

async function fetchChats(): Promise<Chat[]> {
  return chatService.listChats();
}

export function useChats(): UseChatsReturn {
  const queryClient = useQueryClient();

  const {
    data: chats = [],
    isLoading,
    error,
    refetch,
  } = useApiResource<Chat[]>({
    queryKey: CHATS_QUERY_KEY,
    queryFn: fetchChats,
    errorMessage: 'Gagal memuat data chat.',
  });

  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!title.trim()) return null;
      return chatService.createChat(title.trim());
    },
    onSuccess: newChat => {
      if (newChat) {
        queryClient.setQueryData<Chat[]>(CHATS_QUERY_KEY, (old = []) => [
          ...old,
          newChat,
        ]);
      }
    },
    onError: err => {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal membuat chat.';
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'network',
      });
    },
  });

  const createChat = useCallback(
    async (title: string): Promise<Chat | null> => {
      return createChatMutation.mutateAsync(title);
    },
    [createChatMutation]
  );

  return {
    chats,
    isLoading,
    error,
    refetch,
    createChat,
    isCreating: createChatMutation.isPending,
  };
}
