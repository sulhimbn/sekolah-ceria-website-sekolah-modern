import { useState, useCallback } from 'react';
import { chatService } from '@/services';
import type { ChatMessage } from '@shared/types';
import { useAsyncOperation } from './use-async-operation';

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

  const loadMessagesOp = useAsyncOperation<[string], ChatMessage[]>({
    operationFn: (chatId: string) => chatService.getMessages(chatId),
    errorMessage: 'Gagal memuat pesan.',
    category: 'network',
  });

  const sendMessageOp = useAsyncOperation<
    [string, string, string],
    ChatMessage
  >({
    operationFn: (chatId: string, userId: string, text: string) =>
      chatService.sendMessage(chatId, userId, text),
    errorMessage: 'Gagal mengirim pesan.',
    category: 'user',
  });

  const loadMessages = useCallback(
    async (chatId: string) => {
      if (!chatId) return;
      const result = await loadMessagesOp.execute(chatId);
      if (result) {
        setMessages(result);
      }
    },
    [loadMessagesOp]
  );

  const sendMessage = useCallback(
    async (
      chatId: string,
      userId: string,
      text: string
    ): Promise<ChatMessage | null> => {
      if (!chatId || !userId || !text.trim()) return null;

      const result = await sendMessageOp.execute(chatId, userId, text.trim());
      if (result) {
        setMessages(prev => [...prev, result]);
      }
      return result;
    },
    [sendMessageOp]
  );

  return {
    messages,
    isLoading: loadMessagesOp.isLoading,
    error: loadMessagesOp.error || sendMessageOp.error,
    loadMessages,
    sendMessage,
    isSending: sendMessageOp.isLoading,
  };
}
