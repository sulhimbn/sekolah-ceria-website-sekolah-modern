import { api } from '@/lib/api-client';
import type {
  IChatRepository,
  ChatListResponse,
} from '@/repositories/interfaces';
import type { Chat, ChatMessage } from '@shared/types';

/**
 * API implementation of ChatRepository
 * Fetches data from REST API endpoints
 */
export class ChatApiRepository implements IChatRepository {
  async fetchChats(): Promise<ChatListResponse> {
    const response = await api<ChatListResponse>('/api/chats');
    return response;
  }

  async createChat(title: string): Promise<Chat> {
    const response = await api<Chat>('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ title: title.trim() }),
    });
    return response;
  }

  async fetchMessages(chatId: string): Promise<ChatMessage[]> {
    const response = await api<ChatMessage[]>(`/api/chats/${chatId}/messages`);
    return response;
  }

  async sendMessage(chatId: string, userId: string, text: string): Promise<ChatMessage> {
    const response = await api<ChatMessage>(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ userId, text: text.trim() }),
    });
    return response;
  }
}

/**
 * Factory function to create ChatRepository instance
 * Allows for easy swapping between implementations
 */
export function createChatRepository(): IChatRepository {
  return new ChatApiRepository();
}
