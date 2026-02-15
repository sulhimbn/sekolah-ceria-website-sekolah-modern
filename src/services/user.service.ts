import type { User } from '@shared/types';
import { api } from '@/lib/api-client';
import { MESSAGES } from '@/lib/messages';
import { withErrorHandling } from '.';

export interface UserListResponse {
  items: User[];
  next: string | null;
}

export class UserService {
  async listUsers(): Promise<User[]> {
    return withErrorHandling(
      async () => {
        const response = await api<UserListResponse>('/api/users');
        return response.items;
      },
      'Gagal memuat data pengguna. Silakan coba lagi nanti.'
    );
  }

  async createUser(name: string): Promise<User> {
    return withErrorHandling(
      async () => {
        const response = await api<User>('/api/users', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim() }),
        });
        return response;
      },
      'Gagal membuat pengguna. Silakan coba lagi nanti.'
    );
  }
}

export const userService = new UserService();
