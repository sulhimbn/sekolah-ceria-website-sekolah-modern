/**
 * Unit tests for worker validation schemas
 * Tests Zod validation schemas for worker API endpoints
 */
import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  createUserSchema,
  createChatSchema,
  sendMessageSchema,
  deleteManySchema,
  loginSchema,
  registerSchema,
  type ContactFormInput,
  type CreateUserInput,
  type CreateChatInput,
  type SendMessageInput,
  type DeleteManyInput,
  type LoginInput,
  type RegisterInput,
} from './validators';

describe('contactFormSchema', () => {
  it('should validate a valid contact form', () => {
    const validInput: ContactFormInput = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters.',
    };
    expect(contactFormSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidInput = {
      name: '',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters.',
    };
    const result = contactFormSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });

  it('should reject name with less than 2 characters', () => {
    const invalidInput = {
      name: 'A',
      email: 'john@example.com',
      message: 'This is a valid message with enough characters.',
    };
    const result = contactFormSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidInput = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is a valid message with enough characters.',
    };
    const result = contactFormSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should reject message with less than 10 characters', () => {
    const invalidInput = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    };
    const result = contactFormSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('message');
    }
  });

  it('should trim whitespace from inputs', () => {
    const input = {
      name: '  John Doe  ',
      email: '  john@example.com  ',
      message: '  This is a valid message with enough characters.  ',
    };
    const result = contactFormSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('John Doe');
      expect(result.data.email).toBe('john@example.com');
    }
  });
});

describe('createUserSchema', () => {
  it('should validate a valid user input', () => {
    const validInput: CreateUserInput = { name: 'John Doe' };
    expect(createUserSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidInput = { name: '' };
    const result = createUserSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject name exceeding 100 characters', () => {
    const invalidInput = { name: 'A'.repeat(101) };
    const result = createUserSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('createChatSchema', () => {
  it('should validate a valid chat input', () => {
    const validInput: CreateChatInput = { title: 'General Discussion' };
    expect(createChatSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidInput = { title: '' };
    const result = createChatSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject title exceeding 200 characters', () => {
    const invalidInput = { title: 'A'.repeat(201) };
    const result = createChatSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('sendMessageSchema', () => {
  it('should validate a valid message input', () => {
    const validInput: SendMessageInput = {
      userId: 'user-123',
      text: 'Hello, world!',
    };
    expect(sendMessageSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject empty userId', () => {
    const invalidInput = { userId: '', text: 'Hello' };
    const result = sendMessageSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject empty text', () => {
    const invalidInput = { userId: 'user-123', text: '' };
    const result = sendMessageSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject text exceeding 5000 characters', () => {
    const invalidInput = { userId: 'user-123', text: 'A'.repeat(5001) };
    const result = sendMessageSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('deleteManySchema', () => {
  it('should validate valid delete input', () => {
    const validInput: DeleteManyInput = { ids: ['id-1', 'id-2'] };
    expect(deleteManySchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject empty ids array', () => {
    const invalidInput = { ids: [] };
    const result = deleteManySchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject ids array exceeding 100 items', () => {
    const invalidInput = { ids: Array(101).fill('id') };
    const result = deleteManySchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('should validate a valid login input', () => {
    const validInput: LoginInput = {
      email: 'user@example.com',
      password: 'password123',
    };
    expect(loginSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const invalidInput = { email: 'not-email', password: 'password123' };
    const result = loginSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject password less than 6 characters', () => {
    const invalidInput = { email: 'user@example.com', password: '12345' };
    const result = loginSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('should validate a valid register input', () => {
    const validInput: RegisterInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    expect(registerSchema.safeParse(validInput).success).toBe(true);
  });

  it('should reject name with less than 2 characters', () => {
    const invalidInput = {
      name: 'A',
      email: 'john@example.com',
      password: 'password123',
    };
    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidInput = {
      name: 'John Doe',
      email: 'invalid',
      password: 'password123',
    };
    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should reject password less than 6 characters', () => {
    const invalidInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345',
    };
    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should trim whitespace from inputs', () => {
    const input = {
      name: '  John Doe  ',
      email: '  john@example.com  ',
      password: '  password123  ',
    };
    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('John Doe');
      expect(result.data.email).toBe('john@example.com');
    }
  });
});
