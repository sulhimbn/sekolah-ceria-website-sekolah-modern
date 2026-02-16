import { api } from '@/lib/api-client';
import type {
  INewsRepository,
  NewsListResponse,
  NewsArticleDetail,
} from '@/repositories/interfaces';
import type { NewsArticle } from '@shared/types';

/**
 * API implementation of NewsRepository
 * Fetches data from REST API endpoints
 */
export class NewsApiRepository implements INewsRepository {
  async fetchArticles(): Promise<NewsListResponse> {
    const response = await api<{ items: NewsArticle[]; next?: string }>('/api/news');
    return response;
  }

  async fetchArticle(id: string): Promise<NewsArticleDetail> {
    const article = await api<NewsArticle>(`/api/news/${id}`);
    return article as NewsArticleDetail;
  }
}

/**
 * Factory function to create NewsRepository instance
 * Allows for easy swapping between implementations
 */
export function createNewsRepository(): INewsRepository {
  return new NewsApiRepository();
}
