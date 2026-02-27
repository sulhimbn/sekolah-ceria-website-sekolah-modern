/**
 * Zod schemas for runtime API response validation
 *
 * These schemas provide runtime type validation for API responses,
 * ensuring that the data structure matches the expected shape even
 * if the backend schema changes unexpectedly.
 *
 * Usage:
 *   import { validateResponse, schemas } from '@/lib/zod-schemas';
 *
 *   // Validate a single item
 *   const user = validateResponse(schemas.user, rawData);
 *
 *   // Validate a list response
 *   const users = validateResponse(schemas.userListResponse, rawData);
 */
import { z } from 'zod';

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * User schema - represents a user in the system
 */
export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type UserSchema = z.infer<typeof userSchema>;

/**
 * Chat schema - represents a chat session
 */
export const chatSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

export type ChatSchema = z.infer<typeof chatSchema>;

/**
 * ChatMessage schema - represents a message in a chat
 */
export const chatMessageSchema = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  userId: z.string().min(1),
  text: z.string().min(1),
  ts: z.number().int().positive(),
});

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;

/**
 * NewsArticle schema - represents a news article
 */
export const newsArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  author: z.string().min(1),
  excerpt: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type NewsArticleSchema = z.infer<typeof newsArticleSchema>;

/**
 * NewsArticleDetail schema - extends NewsArticle with additional fields
 */
export const newsArticleDetailSchema = newsArticleSchema.extend({
  fullContent: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type NewsArticleDetailSchema = z.infer<typeof newsArticleDetailSchema>;

// ============================================================================
// Response Schemas
// ============================================================================

/**
 * User list response schema
 */
export const userListResponseSchema = z.object({
  items: z.array(userSchema),
  next: z.string().nullable(),
});

export type UserListResponseSchema = z.infer<typeof userListResponseSchema>;

/**
 * Chat list response schema
 */
export const chatListResponseSchema = z.object({
  items: z.array(chatSchema),
  next: z.string().nullable(),
});

export type ChatListResponseSchema = z.infer<typeof chatListResponseSchema>;

/**
 * Chat message list response schema
 */
export const chatMessageListResponseSchema = z.array(chatMessageSchema);

export type ChatMessageListResponseSchema = z.infer<
  typeof chatMessageListResponseSchema
>;

/**
 * News list response schema
 */
export const newsListResponseSchema = z.object({
  items: z.array(newsArticleSchema),
  next: z.string().optional(),
});

export type NewsListResponseSchema = z.infer<typeof newsListResponseSchema>;

/**
 * Contact form response schema
 */
export const contactResponseSchema = z.object({
  message: z.string(), // Allow empty strings - service handles fallback
  success: z.boolean(),
});

export type ContactResponseSchema = z.infer<typeof contactResponseSchema>;

// ============================================================================
// Barrel Export
// ============================================================================

/**
 * All schemas indexed by name for easy lookup
 */
export const schemas = {
  user: userSchema,
  userListResponse: userListResponseSchema,
  chat: chatSchema,
  chatListResponse: chatListResponseSchema,
  chatMessage: chatMessageSchema,
  chatMessageList: chatMessageListResponseSchema,
  newsArticle: newsArticleSchema,
  newsArticleDetail: newsArticleDetailSchema,
  newsListResponse: newsListResponseSchema,
  contactResponse: contactResponseSchema,
} as const;

export type SchemaName = keyof typeof schemas;
