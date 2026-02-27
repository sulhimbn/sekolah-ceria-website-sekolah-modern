import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserApiRepository } from './user.repository';
import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import type { User } from '@shared/types';

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

describe('UserApiRepository', () => {
  let repository: UserApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UserApiRepository();
  });

  describe('fetchUsers', () => {
    it('should fetch users and return validated response', async () => {
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
      ];
      const mockResponse = { items: mockUsers, next: null };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        items: mockUsers,
        next: null,
      });
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockResponse
      );

      const result = await repository.fetchUsers();

      expect(api).toHaveBeenCalledWith('/api/users');
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        { items: mockUsers, next: null },
        'UserListResponse'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(repository.fetchUsers()).rejects.toThrow('Network error');
    });
  });

  describe('createUser', () => {
    it('should create user with trimmed name and return validated response', async () => {
      const newUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(newUser);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        newUser
      );

      const result = await repository.createUser('  John Doe  ');

      expect(api).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe' }),
      });
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        newUser,
        'User'
      );
      expect(result).toEqual(newUser);
    });

    it('should throw error when creation fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Creation failed')
      );

      await expect(repository.createUser('John Doe')).rejects.toThrow(
        'Creation failed'
      );
    });
  });
});
