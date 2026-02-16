/**
 * Barrel export for repository interfaces
 * 
 * Import pattern:
 * import { INewsRepository, IContactRepository } from '@/repositories/interfaces';
 */
export type { INewsRepository, NewsArticleDetail, NewsListResponse } from './news.repository.interface';
export type { IContactRepository, ContactFormData, ContactResponse } from './contact.repository.interface';
