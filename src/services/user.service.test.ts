import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/services/user.service';
import type { IUserRepository } from '@/repositories/interfaces';
import type { User } from '@shared/types';

describe('UserService', () => {
  let userService: UserService;
  let mockFetchUsers: ReturnType<typeof vi.fn>;
  let mockCreateUser: ReturnType<typeof vi.fn>;
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockFetchUsers = vi.fn();
    mockCreateUser = vi.fn();

    mockRepository = {
      fetchUsers: mockFetchUsers,
      createUser: mockCreateUser,
    };

    userService = new UserService(mockRepository);
  });

  describe('listUsers', () => {
    it('should return list of users on success', async () => {
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', role: 'student' },
        { id: '2', name: 'Jane Doe', role: 'teacher' },
      ];
      mockFetchUsers.mockResolvedValueOnce({
        items: mockUsers,
        next: null,
      });

      const result = await userService.listUsers();

      expect(mockFetchUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should throw error on fetch failure', async () => {
      mockFetchUsers.mockRejectedValueOnce(new Error('Network error'));

      await expect(userService.listUsers()).rejects.toThrow(
        'Gagal memuat data pengguna. Silakan coba lagi nanti.'
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user on success', async () => {
      const newUser: User = { id: '1', name: 'John Doe', role: 'student' };
      mockCreateUser.mockResolvedValueOnce(newUser);

      const result = await userService.createUser('John Doe');

      expect(mockCreateUser).toHaveBeenCalledWith('John Doe');
      expect(result).toEqual(newUser);
    });

    it('should throw error on creation failure', async () => {
      mockCreateUser.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(userService.createUser('John Doe')).rejects.toThrow(
        'Gagal membuat pengguna. Silakan coba lagi nanti.'
      );
    });
  });
});
