import type { Chat, ChatMessage } from '@shared/types';

export interface ChatListResponse {
  items: Chat[];
  next: string | null;
}

/**
 * Repository interface for chat data access
 * Abstracts data source (API, cache, mock, etc.)
 */
export interface IChatRepository {
  /**
   * Fetch all chats
   * @returns Promise resolving to list of chats
   * @throws Error if fetch fails
   */
  fetchChats(): Promise<ChatListResponse>;

  /**
   * Create a new chat
   * @param title - Chat title
   * @returns Promise resolving to created chat
   * @throws Error if creation fails
   */
  createChat(title: string): Promise<Chat>;

  /**
   * Fetch messages for a specific chat
   * @param chatId - Chat identifier
   * @returns Promise resolving to list of messages
   * @throws Error if fetch fails
   */
  fetchMessages(chatId: string): Promise<ChatMessage[]>;

  /**
   * Send a message to a chat
   * @param chatId - Chat identifier
   * @param userId - User identifier
   * @param text - Message text
   * @returns Promise resolving to created message
   * @throws Error if sending fails
   */
  sendMessage(chatId: string, userId: string, text: string): Promise<ChatMessage>;
}
