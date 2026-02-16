/**
 * Barrel export for all repository modules
 *
 * Import patterns:
 * - Interfaces: import { INewsRepository } from '@/repositories';
 * - Implementations: import { createNewsRepository } from '@/repositories/implementations';
 * - Everything: import { INewsRepository, NewsApiRepository } from '@/repositories';
 */

// Re-export interfaces
export type {
  INewsRepository,
  NewsArticleDetail,
  NewsListResponse,
  IContactRepository,
  ContactFormData,
  ContactResponse,
} from './interfaces';

// Re-export implementations
export {
  NewsApiRepository,
  createNewsRepository,
  ContactApiRepository,
  createContactRepository,
} from './implementations';
