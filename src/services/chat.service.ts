import type { Chat, ChatMessage } from '@shared/types';
import type { IChatRepository } from '@/repositories/interfaces';
import { createChatRepository } from '@/repositories/implementations';
import { withErrorHandling } from '.';

export class ChatService {
  private repository: IChatRepository;

  constructor(repository: IChatRepository = createChatRepository()) {
    this.repository = repository;
  }

  async listChats(): Promise<Chat[]> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.fetchChats();
        return response.items;
      },
      'Gagal memuat data chat. Silakan coba lagi nanti.'
    );
  }

  async createChat(title: string): Promise<Chat> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.createChat(title);
        return response;
      },
      'Gagal membuat chat. Silakan coba lagi nanti.'
    );
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.fetchMessages(chatId);
        return response;
      },
      'Gagal memuat pesan. Silakan coba lagi nanti.'
    );
  }

  async sendMessage(chatId: string, userId: string, text: string): Promise<ChatMessage> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.sendMessage(chatId, userId, text);
        return response;
      },
      'Gagal mengirim pesan. Silakan coba lagi nanti.'
    );
  }
}

export const chatService = new ChatService();
