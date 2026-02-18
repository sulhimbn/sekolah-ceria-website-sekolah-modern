import type { User } from '@shared/types';

export interface UserListResponse {
  items: User[];
  next: string | null;
}

/**
 * Repository interface for user data access
 * Abstracts data source (API, cache, mock, etc.)
 */
export interface IUserRepository {
  /**
   * Fetch all users
   * @returns Promise resolving to list of users
   * @throws Error if fetch fails
   */
  fetchUsers(): Promise<UserListResponse>;

  /**
   * Create a new user
   * @param name - User name
   * @returns Promise resolving to created user
   * @throws Error if creation fails
   */
  createUser(name: string): Promise<User>;
}
