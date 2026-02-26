import { useCallback, useState } from 'react';
import { chatService } from '@/services';
import { useApiResourceMutation } from './use-api-resource';
import type { ChatMessage } from '@shared/types';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (
    chatId: string,
    userId: string,
    text: string
  ) => Promise<ChatMessage | null>;
  isSending: boolean;
}

export function useChatMessages(): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat pesan.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { mutate: sendMessageMutate, isSubmitting: isSending } =
    useApiResourceMutation<
      { chatId: string; userId: string; text: string },
      ChatMessage
    >(
      ({ chatId, userId, text }) =>
        chatService.sendMessage(chatId, userId, text.trim()),
      'Gagal mengirim pesan.',
      {},
      newMessage => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

  const sendMessage = useCallback(
    async (
      chatId: string,
      userId: string,
      text: string
    ): Promise<ChatMessage | null> => {
      if (!chatId || !userId || !text.trim()) return null;
      return sendMessageMutate({ chatId, userId, text });
    },
    [sendMessageMutate]
  );

  return {
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    isSending,
  };
}
