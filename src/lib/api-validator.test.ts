import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  validateResponse,
  validateResponseSafe,
  validateArray,
  createValidator,
  ValidationError,
} from '@/lib/api-validator';
import { schemas } from '@/lib/zod-schemas';

describe('api-validator', () => {
  describe('validateResponse', () => {
    it('should validate valid data against user schema', () => {
      const validData = {
        id: 'user-1',
        name: 'John Doe',
      };

      const result = validateResponse(schemas.user, validData, 'User');
      expect(result).toEqual(validData);
    });

    it('should validate valid data against userListResponse schema', () => {
      const validData = {
        items: [
          { id: 'user-1', name: 'John Doe' },
          { id: 'user-2', name: 'Jane Doe' },
        ],
        next: 'cursor-123',
      };

      const result = validateResponse(
        schemas.userListResponse,
        validData,
        'UserListResponse'
      );
      expect(result).toEqual(validData);
      expect(result.items).toHaveLength(2);
    });

    it('should validate valid data against newsArticle schema', () => {
      const validData = {
        id: 'news-1',
        title: 'School Event',
        date: '2024-01-15',
        author: 'Admin',
        excerpt: 'A brief summary',
      };

      const result = validateResponse(
        schemas.newsArticle,
        validData,
        'NewsArticle'
      );
      expect(result).toEqual(validData);
    });

    it('should validate valid data against chat schema', () => {
      const validData = {
        id: 'chat-1',
        title: 'General Chat',
      };

      const result = validateResponse(schemas.chat, validData, 'Chat');
      expect(result).toEqual(validData);
    });

    it('should validate valid data against chatMessage schema', () => {
      const validData = {
        id: 'msg-1',
        chatId: 'chat-1',
        userId: 'user-1',
        text: 'Hello world',
        ts: 1704067200000,
      };

      const result = validateResponse(
        schemas.chatMessage,
        validData,
        'ChatMessage'
      );
      expect(result).toEqual(validData);
    });

    it('should validate valid data against contactResponse schema', () => {
      const validData = {
        message: 'Thank you for contacting us',
        success: true,
      };

      const result = validateResponse(
        schemas.contactResponse,
        validData,
        'ContactResponse'
      );
      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid data - missing required field', () => {
      const invalidData = {
        id: 'user-1',
        // name is missing
      };

      expect(() => {
        validateResponse(schemas.user, invalidData, 'User');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid data - wrong type', () => {
      const invalidData = {
        id: 123, // should be string
        name: 'John Doe',
      };

      expect(() => {
        validateResponse(schemas.user, invalidData, 'User');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid data - empty string', () => {
      const invalidData = {
        id: '',
        name: 'John Doe',
      };

      expect(() => {
        validateResponse(schemas.user, invalidData, 'User');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct schema name property', () => {
      const invalidData = {
        id: 'user-1',
      };

      try {
        validateResponse(schemas.user, invalidData, 'User');
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).schemaName).toBe('User');
      }
    });

    it('should include Zod issues in ValidationError', () => {
      const invalidData = {
        id: '',
        name: '',
      };

      try {
        validateResponse(schemas.user, invalidData, 'User');
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues).toBeDefined();
        expect(Array.isArray((error as ValidationError).issues)).toBe(true);
      }
    });

    it('should validate optional fields when present', () => {
      const dataWithOptional = {
        id: 'news-1',
        title: 'School Event',
        date: '2024-01-15',
        author: 'Admin',
        excerpt: 'A brief summary',
        imageUrl: 'https://example.com/image.jpg',
      };

      const result = validateResponse(
        schemas.newsArticle,
        dataWithOptional,
        'NewsArticle'
      );
      expect(result.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should validate nested array in response', () => {
      const dataWithArray = {
        items: [
          {
            id: 'news-1',
            title: 'News 1',
            date: '2024-01-15',
            author: 'Admin',
            excerpt: 'Summary 1',
          },
          {
            id: 'news-2',
            title: 'News 2',
            date: '2024-01-16',
            author: 'Admin',
            excerpt: 'Summary 2',
          },
        ],
        next: 'cursor-123',
      };

      const result = validateResponse(
        schemas.newsListResponse,
        dataWithArray,
        'NewsListResponse'
      );
      expect(result.items).toHaveLength(2);
    });

    it('should handle null next field in list response', () => {
      const dataWithNullNext = {
        items: [{ id: 'user-1', name: 'John' }],
        next: null,
      };

      const result = validateResponse(
        schemas.userListResponse,
        dataWithNullNext,
        'UserListResponse'
      );
      expect(result.next).toBeNull();
    });
  });

  describe('validateResponseSafe', () => {
    it('should return validated data when validation passes', () => {
      const validData = { id: 'user-1', name: 'John Doe' };
      const fallback = { id: '', name: '' };

      const result = validateResponseSafe(
        schemas.user,
        validData,
        fallback,
        'User'
      );
      expect(result).toEqual(validData);
    });

    it('should return fallback when validation fails', () => {
      const invalidData = { id: 'user-1' }; // missing name
      const fallback = { id: 'fallback', name: 'Default User' };

      const result = validateResponseSafe(
        schemas.user,
        invalidData,
        fallback,
        'User'
      );
      expect(result).toEqual(fallback);
    });

    it('should log error to console when validation fails', () => {
      const invalidData = { id: 123, name: 'John' };
      const fallback = { id: '', name: '' };

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      validateResponseSafe(schemas.user, invalidData, fallback, 'User');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('validateArray', () => {
    it('should validate array of items', () => {
      const validArray = [
        { id: 'user-1', name: 'John Doe' },
        { id: 'user-2', name: 'Jane Doe' },
      ];

      const result = validateArray(schemas.user, validArray, 'UserArray');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(validArray[0]);
      expect(result[1]).toEqual(validArray[1]);
    });

    it('should throw ValidationError when data is not an array', () => {
      const notAnArray = { id: 'user-1', name: 'John Doe' };

      expect(() => {
        validateArray(schemas.user, notAnArray, 'UserArray');
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError when array contains invalid items', () => {
      const invalidArray = [
        { id: 'user-1', name: 'John Doe' },
        { id: 'user-2' }, // missing name
      ];

      expect(() => {
        validateArray(schemas.user, invalidArray, 'UserArray');
      }).toThrow(ValidationError);
    });

    it('should handle empty arrays', () => {
      const emptyArray: unknown[] = [];

      const result = validateArray(schemas.user, emptyArray, 'UserArray');
      expect(result).toHaveLength(0);
    });
  });

  describe('createValidator', () => {
    it('should create a validator function', () => {
      const validateUser = createValidator(schemas.user, 'User');

      const validData = { id: 'user-1', name: 'John Doe' };
      const result = validateUser(validData);

      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid data', () => {
      const validateUser = createValidator(schemas.user, 'User');

      const invalidData = { id: 'user-1' }; // missing name

      expect(() => {
        validateUser(invalidData);
      }).toThrow(ValidationError);
    });

    it('should include schema name in error', () => {
      const validateUser = createValidator(schemas.user, 'CustomUser');

      const invalidData = { id: '' };

      try {
        validateUser(invalidData);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).schemaName).toBe('CustomUser');
      }
    });
  });

  describe('ValidationError', () => {
    it('should store schema name and issues', () => {
      const issues: z.ZodIssue[] = [
        {
          code: z.ZodIssueCode.invalid_type,
          expected: 'string',
          received: 'undefined',
          path: ['name'],
          message: 'Required',
        },
      ];

      const error = new ValidationError('Validation failed', 'User', issues);

      expect(error.schemaName).toBe('User');
      expect(error.issues).toEqual(issues);
      expect(error.message).toContain('Validation failed');
      expect(error.name).toBe('ValidationError');
    });
  });
});
