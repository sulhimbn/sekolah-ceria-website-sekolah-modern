/**
 * Barrel export for repository interfaces
 * 
 * Import pattern:
 * import { INewsRepository, IContactRepository } from '@/repositories/interfaces';
 */
export type { INewsRepository, NewsArticleDetail, NewsListResponse } from './news.repository.interface';
export type { IContactRepository, ContactFormData, ContactResponse } from './contact.repository.interface';
export type { IUserRepository, UserListResponse } from './user.repository.interface';
export type { IChatRepository, ChatListResponse } from './chat.repository.interface';
