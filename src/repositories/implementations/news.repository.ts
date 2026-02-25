import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import { schemas } from '@/lib/zod-schemas';
import type {
  INewsRepository,
  NewsListResponse,
  NewsArticleDetail,
} from '@/repositories/interfaces';
import type { NewsArticle } from '@shared/types';

/**
 * API implementation of NewsRepository
 * Fetches data from REST API endpoints
 * Includes runtime validation for API responses
 */
export class NewsApiRepository implements INewsRepository {
  async fetchArticles(): Promise<NewsListResponse> {
    const response = await api<{ items: NewsArticle[]; next?: string }>('/api/news');
    return validateResponse(schemas.newsListResponse, response, 'NewsListResponse');
  }

  async fetchArticle(id: string): Promise<NewsArticleDetail> {
    const response = await api<NewsArticle>(`/api/news/${id}`);
    return validateResponse(schemas.newsArticleDetail, response, 'NewsArticleDetail') as NewsArticleDetail;
  }
}

/**
 * Factory function to create NewsRepository instance
 * Allows for easy swapping between implementations
 */
export function createNewsRepository(): INewsRepository {
  return new NewsApiRepository();
}
