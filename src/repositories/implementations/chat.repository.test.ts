import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatApiRepository } from './chat.repository';
import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import type { Chat, ChatMessage } from '@shared/types';
import type { ChatListResponse } from '@/repositories/interfaces/chat.repository.interface';

// Mock the api-client module
vi.mock('@/lib/api-client', () => ({
  api: vi.fn(),
}));

// Mock the api-validator module
vi.mock('@/lib/api-validator', () => ({
  validateResponse: vi.fn((schema, data, schemaName) => data),
}));

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: '',
}));

describe('ChatApiRepository', () => {
  let repository: ChatApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ChatApiRepository();
  });

  describe('fetchChats', () => {
    it('should fetch chats and return validated response', async () => {
      const mockChats: Chat[] = [
        { id: '1', title: 'Chat 1' },
        { id: '2', title: 'Chat 2' },
      ];
      const mockResponse: ChatListResponse = { items: mockChats, next: null };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockResponse
      );

      const result = await repository.fetchChats();

      expect(api).toHaveBeenCalledWith('/api/chats');
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        mockResponse,
        'ChatListResponse'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(repository.fetchChats()).rejects.toThrow('Network error');
    });
  });

  describe('createChat', () => {
    it('should create chat with trimmed title and return validated response', async () => {
      const newChat: Chat = { id: '1', title: 'New Chat' };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(newChat);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        newChat
      );

      const result = await repository.createChat('  New Chat  ');

      expect(api).toHaveBeenCalledWith('/api/chats', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Chat' }),
      });
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        newChat,
        'Chat'
      );
      expect(result).toEqual(newChat);
    });

    it('should throw error when creation fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Creation failed')
      );

      await expect(repository.createChat('New Chat')).rejects.toThrow(
        'Creation failed'
      );
    });
  });

  describe('fetchMessages', () => {
    it('should fetch messages for a chat and return validated response', async () => {
      const chatId = 'chat-123';
      const mockMessages: ChatMessage[] = [
        { id: '1', chatId, userId: 'user1', text: 'Hello', ts: Date.now() },
        { id: '2', chatId, userId: 'user2', text: 'Hi there', ts: Date.now() },
      ];

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockMessages);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockMessages
      );

      const result = await repository.fetchMessages(chatId);

      expect(api).toHaveBeenCalledWith(`/api/chats/${chatId}/messages`);
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        mockMessages,
        'ChatMessage[]'
      );
      expect(result).toEqual(mockMessages);
    });

    it('should throw error when fetch fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(repository.fetchMessages('chat-123')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('sendMessage', () => {
    it('should send message with trimmed text and return validated response', async () => {
      const chatId = 'chat-123';
      const userId = 'user-456';
      const text = '  Hello World  ';
      const mockMessage: ChatMessage = {
        id: 'msg-1',
        chatId,
        userId,
        text: 'Hello World',
        ts: Date.now(),
      };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockMessage);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockMessage
      );

      const result = await repository.sendMessage(chatId, userId, text);

      expect(api).toHaveBeenCalledWith(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ userId, text: 'Hello World' }),
      });
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        mockMessage,
        'ChatMessage'
      );
      expect(result).toEqual(mockMessage);
    });

    it('should throw error when sending fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Failed to send')
      );

      await expect(
        repository.sendMessage('chat-123', 'user-456', 'Hello')
      ).rejects.toThrow('Failed to send');
    });
  });
});
