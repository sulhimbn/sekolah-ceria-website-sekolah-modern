import { useState, useCallback } from 'react';
import { chatService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import type { ChatMessage } from '@shared/types';
import type { ApiQueryHookResult } from './index';

type UseChatMessagesReturn = ApiQueryHookResult<ChatMessage[]> & {
  /** Backward compatible alias for data */
  messages: ChatMessage[];
  /** Query: Load messages for a chat */
  loadMessages: (chatId: string) => Promise<void>;
  /** Mutation: Send a message */
  sendMessage: (
    chatId: string,
    userId: string,
    text: string
  ) => Promise<ChatMessage | null>;
  /** Mutation loading state */
  isSending: boolean;
};

export function useChatMessages(): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat pesan.';
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

  const sendMessage = useCallback(
    async (
      chatId: string,
      userId: string,
      text: string
    ): Promise<ChatMessage | null> => {
      if (!chatId || !userId || !text.trim()) return null;

      try {
        setIsSending(true);
        setError(null);
        const newMessage = await chatService.sendMessage(
          chatId,
          userId,
          text.trim()
        );
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Gagal mengirim pesan.';
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
        setIsSending(false);
      }
    },
    []
  );

  return {
    data: messages,
    messages,
    isLoading,
    error,
    refetch: () => Promise.resolve(), // No auto-refetch for chat messages
    loadMessages,
    sendMessage,
    isSending,
  };
}
