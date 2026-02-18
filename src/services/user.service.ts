import type { User } from '@shared/types';
import type { IUserRepository } from '@/repositories/interfaces';
import { createUserRepository } from '@/repositories/implementations';
import { withErrorHandling } from '.';

export class UserService {
  private repository: IUserRepository;

  constructor(repository: IUserRepository = createUserRepository()) {
    this.repository = repository;
  }

  async listUsers(): Promise<User[]> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.fetchUsers();
        return response.items;
      },
      'Gagal memuat data pengguna. Silakan coba lagi nanti.'
    );
  }

  async createUser(name: string): Promise<User> {
    return withErrorHandling(
      async () => {
        const response = await this.repository.createUser(name);
        return response;
      },
      'Gagal membuat pengguna. Silakan coba lagi nanti.'
    );
  }
}

export const userService = new UserService();
