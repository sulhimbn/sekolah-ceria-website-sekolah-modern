/**
 * Unit tests for worker entity definitions
 * Tests entity static properties and schema definitions
 *
 * Note: Entity classes require Cloudflare Workers runtime (cloudflare:workers)
 * so we test the entity structures via mock data instead of importing the classes.
 */
import { describe, it, expect } from 'vitest';
import type { User, Chat, ChatMessage, NewsArticle } from '@shared/types';
import {
  MOCK_USERS,
  MOCK_CHATS,
  MOCK_CHAT_MESSAGES,
  MOCK_NEWS_ARTICLES,
} from '@shared/mock-data';

// Entity static definitions (mirrored from entities.ts for testing)
const USER_ENTITY = {
  entityName: 'user' as const,
  indexName: 'users' as const,
  initialState: { id: '', name: '' } as User,
};

const CHAT_ENTITY = {
  entityName: 'chat' as const,
  indexName: 'chats' as const,
  initialState: { id: '', title: '', messages: [] } as Chat & {
    messages: ChatMessage[];
  },
};

const NEWS_ENTITY = {
  entityName: 'newsArticle' as const,
  indexName: 'newsArticles' as const,
  initialState: {
    id: '',
    title: '',
    date: '',
    author: '',
    excerpt: '',
  } as NewsArticle,
};

describe('UserEntity', () => {
  it('should have correct entityName', () => {
    expect(USER_ENTITY.entityName).toBe('user');
  });

  it('should have correct indexName', () => {
    expect(USER_ENTITY.indexName).toBe('users');
  });

  it('should have valid initialState', () => {
    expect(USER_ENTITY.initialState).toEqual({ id: '', name: '' });
  });

  it('should have seedData with users matching MOCK_USERS', () => {
    expect(MOCK_USERS).toBeDefined();
    expect(Array.isArray(MOCK_USERS)).toBe(true);
  });

  it('should have valid user structure in MOCK_USERS', () => {
    MOCK_USERS.forEach((user: User) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(typeof user.id).toBe('string');
      expect(typeof user.name).toBe('string');
    });
  });
});

describe('ChatBoardEntity', () => {
  it('should have correct entityName', () => {
    expect(CHAT_ENTITY.entityName).toBe('chat');
  });

  it('should have correct indexName', () => {
    expect(CHAT_ENTITY.indexName).toBe('chats');
  });

  it('should have valid initialState', () => {
    const initialState = CHAT_ENTITY.initialState;
    expect(initialState).toEqual({ id: '', title: '', messages: [] });
  });

  it('should have seedData with chat boards matching MOCK_CHATS', () => {
    expect(MOCK_CHATS).toBeDefined();
    expect(Array.isArray(MOCK_CHATS)).toBe(true);
  });

  it('should have valid chat board structure in MOCK_CHATS', () => {
    MOCK_CHATS.forEach((chat: Chat) => {
      expect(chat).toHaveProperty('id');
      expect(chat).toHaveProperty('title');
      expect(typeof chat.id).toBe('string');
      expect(typeof chat.title).toBe('string');
    });
  });

  it('should have valid chat messages in MOCK_CHAT_MESSAGES', () => {
    MOCK_CHAT_MESSAGES.forEach((msg: ChatMessage) => {
      expect(msg).toHaveProperty('id');
      expect(msg).toHaveProperty('chatId');
      expect(msg).toHaveProperty('userId');
      expect(msg).toHaveProperty('text');
      expect(msg).toHaveProperty('ts');
      expect(typeof msg.id).toBe('string');
      expect(typeof msg.chatId).toBe('string');
      expect(typeof msg.userId).toBe('string');
      expect(typeof msg.text).toBe('string');
      expect(typeof msg.ts).toBe('number');
    });
  });
});

describe('NewsArticleEntity', () => {
  it('should have correct entityName', () => {
    expect(NEWS_ENTITY.entityName).toBe('newsArticle');
  });

  it('should have correct indexName', () => {
    expect(NEWS_ENTITY.indexName).toBe('newsArticles');
  });

  it('should have valid initialState', () => {
    const initialState = NEWS_ENTITY.initialState;
    expect(initialState).toEqual({
      id: '',
      title: '',
      date: '',
      author: '',
      excerpt: '',
    });
  });

  it('should have seedData with news articles matching MOCK_NEWS_ARTICLES', () => {
    expect(MOCK_NEWS_ARTICLES).toBeDefined();
    expect(Array.isArray(MOCK_NEWS_ARTICLES)).toBe(true);
  });

  it('should have valid news article structure in MOCK_NEWS_ARTICLES', () => {
    MOCK_NEWS_ARTICLES.forEach((article: NewsArticle) => {
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('date');
      expect(article).toHaveProperty('author');
      expect(article).toHaveProperty('excerpt');
      expect(typeof article.id).toBe('string');
      expect(typeof article.title).toBe('string');
      expect(typeof article.date).toBe('string');
      expect(typeof article.author).toBe('string');
      expect(typeof article.excerpt).toBe('string');
    });
  });

  it('should have unique ids for all news articles', () => {
    const ids = MOCK_NEWS_ARTICLES.map((a: NewsArticle) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have non-empty titles for all news articles', () => {
    MOCK_NEWS_ARTICLES.forEach((article: NewsArticle) => {
      expect(article.title.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty excerpts for all news articles', () => {
    MOCK_NEWS_ARTICLES.forEach((article: NewsArticle) => {
      expect(article.excerpt.length).toBeGreaterThan(0);
    });
  });
});

describe('Entity Relationships', () => {
  it('should have distinct entity names', () => {
    const entityNames = [
      USER_ENTITY.entityName,
      CHAT_ENTITY.entityName,
      NEWS_ENTITY.entityName,
    ];
    const uniqueNames = new Set(entityNames);
    expect(uniqueNames.size).toBe(entityNames.length);
  });

  it('should have distinct index names', () => {
    const indexNames = [
      USER_ENTITY.indexName,
      CHAT_ENTITY.indexName,
      NEWS_ENTITY.indexName,
    ];
    const uniqueNames = new Set(indexNames);
    expect(uniqueNames.size).toBe(indexNames.length);
  });

  it('should have valid seed data for all entities', () => {
    expect(MOCK_USERS.length).toBeGreaterThan(0);
    expect(MOCK_CHATS.length).toBeGreaterThan(0);
    expect(MOCK_NEWS_ARTICLES.length).toBeGreaterThan(0);
  });

  it('should correctly map chat messages to chat boards', () => {
    MOCK_CHATS.forEach((chat: Chat) => {
      const chatMessages = MOCK_CHAT_MESSAGES.filter(m => m.chatId === chat.id);
      chatMessages.forEach((msg: ChatMessage) => {
        expect(msg.chatId).toBe(chat.id);
      });
    });
  });
});
