import { api } from '@/lib/api-client';
import type {
  IUserRepository,
  UserListResponse,
} from '@/repositories/interfaces';
import type { User } from '@shared/types';

/**
 * API implementation of UserRepository
 * Fetches data from REST API endpoints
 */
export class UserApiRepository implements IUserRepository {
  async fetchUsers(): Promise<UserListResponse> {
    const response = await api<UserListResponse>('/api/users');
    return response;
  }

  async createUser(name: string): Promise<User> {
    const response = await api<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim() }),
    });
    return response;
  }
}

/**
 * Factory function to create UserRepository instance
 * Allows for easy swapping between implementations
 */
export function createUserRepository(): IUserRepository {
  return new UserApiRepository();
}
