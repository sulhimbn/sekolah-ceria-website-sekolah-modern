import { useState, useCallback } from 'react';
import { chatService } from '@/services';
import { useErrorHandler } from '@/useErrorHandler';
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
  const [isSending, setIsSending] = useState(false);
  const { error, handleError, clearError } = useErrorHandler({
    defaultMessage: 'Gagal memuat pesan.',
    category: 'network',
  });

  const loadMessages = useCallback(
    async (chatId: string) => {
      if (!chatId) return;

      try {
        setIsLoading(true);
        clearError();
        const data = await chatService.getMessages(chatId);
        setMessages(data);
      } catch (err) {
        handleError(err, 'Gagal memuat pesan.');
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  const sendMessage = useCallback(
    async (
      chatId: string,
      userId: string,
      text: string
    ): Promise<ChatMessage | null> => {
      if (!chatId || !userId || !text.trim()) return null;

      try {
        setIsSending(true);
        clearError();
        const newMessage = await chatService.sendMessage(
          chatId,
          userId,
          text.trim()
        );
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        handleError(err, 'Gagal mengirim pesan.');
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [clearError, handleError]
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
