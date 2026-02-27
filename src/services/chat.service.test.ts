import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatService } from '@/services/chat.service';
import type { IChatRepository } from '@/repositories/interfaces';
import type { Chat, ChatMessage } from '@shared/types';

describe('ChatService', () => {
  let chatService: ChatService;
  let mockFetchChats: ReturnType<typeof vi.fn>;
  let mockCreateChat: ReturnType<typeof vi.fn>;
  let mockFetchMessages: ReturnType<typeof vi.fn>;
  let mockSendMessage: ReturnType<typeof vi.fn>;
  let mockRepository: IChatRepository;

  beforeEach(() => {
    mockFetchChats = vi.fn();
    mockCreateChat = vi.fn();
    mockFetchMessages = vi.fn();
    mockSendMessage = vi.fn();

    mockRepository = {
      fetchChats: mockFetchChats,
      createChat: mockCreateChat,
      fetchMessages: mockFetchMessages,
      sendMessage: mockSendMessage,
    };

    chatService = new ChatService(mockRepository);
  });

  describe('listChats', () => {
    it('should return list of chats on success', async () => {
      const mockChats: Chat[] = [
        { id: '1', title: 'Test Chat', createdAt: '2025-01-01T00:00:00Z' },
      ];
      mockFetchChats.mockResolvedValueOnce({
        items: mockChats,
        next: null,
      });

      const result = await chatService.listChats();

      expect(mockFetchChats).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChats);
    });

    it('should throw error on fetch failure', async () => {
      mockFetchChats.mockRejectedValueOnce(new Error('Network error'));

      await expect(chatService.listChats()).rejects.toThrow(
        'Gagal memuat data chat. Silakan coba lagi nanti.'
      );
    });
  });

  describe('createChat', () => {
    it('should create a new chat on success', async () => {
      const newChat: Chat = {
        id: '1',
        title: 'New Chat',
        createdAt: '2025-01-01T00:00:00Z',
      };
      mockCreateChat.mockResolvedValueOnce(newChat);

      const result = await chatService.createChat('New Chat');

      expect(mockCreateChat).toHaveBeenCalledWith('New Chat');
      expect(result).toEqual(newChat);
    });

    it('should throw error on creation failure', async () => {
      mockCreateChat.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(chatService.createChat('New Chat')).rejects.toThrow(
        'Gagal membuat chat. Silakan coba lagi nanti.'
      );
    });
  });

  describe('getMessages', () => {
    it('should return messages for a chat on success', async () => {
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          chatId: 'chat1',
          userId: 'user1',
          text: 'Hello',
          timestamp: '2025-01-01T00:00:00Z',
        },
      ];
      mockFetchMessages.mockResolvedValueOnce(mockMessages);

      const result = await chatService.getMessages('chat1');

      expect(mockFetchMessages).toHaveBeenCalledWith('chat1');
      expect(result).toEqual(mockMessages);
    });

    it('should throw error on fetch failure', async () => {
      mockFetchMessages.mockRejectedValueOnce(new Error('Network error'));

      await expect(chatService.getMessages('chat1')).rejects.toThrow(
        'Gagal memuat pesan. Silakan coba lagi nanti.'
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message on success', async () => {
      const newMessage: ChatMessage = {
        id: '1',
        chatId: 'chat1',
        userId: 'user1',
        text: 'Hello',
        timestamp: '2025-01-01T00:00:00Z',
      };
      mockSendMessage.mockResolvedValueOnce(newMessage);

      const result = await chatService.sendMessage('chat1', 'user1', 'Hello');

      expect(mockSendMessage).toHaveBeenCalledWith('chat1', 'user1', 'Hello');
      expect(result).toEqual(newMessage);
    });

    it('should throw error on send failure', async () => {
      mockSendMessage.mockRejectedValueOnce(new Error('Send failed'));

      await expect(
        chatService.sendMessage('chat1', 'user1', 'Hello')
      ).rejects.toThrow('Gagal mengirim pesan. Silakan coba lagi nanti.');
    });
  });
});
