import type { Chat, ChatMessage } from '@shared/types';
import { api } from '@/lib/api-client';
import { withErrorHandling } from '.';

export interface ChatListResponse {
  items: Chat[];
  next: string | null;
}

export class ChatService {
  async listChats(): Promise<Chat[]> {
    return withErrorHandling(
      async () => {
        const response = await api<ChatListResponse>('/api/chats');
        return response.items;
      },
      'Gagal memuat data chat. Silakan coba lagi nanti.'
    );
  }

  async createChat(title: string): Promise<Chat> {
    return withErrorHandling(
      async () => {
        const response = await api<Chat>('/api/chats', {
          method: 'POST',
          body: JSON.stringify({ title: title.trim() }),
        });
        return response;
      },
      'Gagal membuat chat. Silakan coba lagi nanti.'
    );
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return withErrorHandling(
      async () => {
        const response = await api<ChatMessage[]>(`/api/chats/${chatId}/messages`);
        return response;
      },
      'Gagal memuat pesan. Silakan coba lagi nanti.'
    );
  }

  async sendMessage(chatId: string, userId: string, text: string): Promise<ChatMessage> {
    return withErrorHandling(
      async () => {
        const response = await api<ChatMessage>(`/api/chats/${chatId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ userId, text: text.trim() }),
        });
        return response;
      },
      'Gagal mengirim pesan. Silakan coba lagi nanti.'
    );
  }
}

export const chatService = new ChatService();
