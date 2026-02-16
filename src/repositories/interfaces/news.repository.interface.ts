import type { NewsArticle } from '@shared/types';

export interface NewsArticleDetail extends NewsArticle {
  fullContent?: string;
  category?: string;
  tags?: string[];
}

export interface NewsListResponse {
  items: NewsArticle[];
  next?: string;
}

/**
 * Repository interface for news data access
 * Abstracts data source (API, cache, mock, etc.)
 */
export interface INewsRepository {
  /**
   * Fetch all news articles
   * @returns Promise resolving to list of articles
   * @throws Error if fetch fails
   */
  fetchArticles(): Promise<NewsListResponse>;

  /**
   * Fetch a single article by ID
   * @param id - Article identifier
   * @returns Promise resolving to article detail
   * @throws Error if article not found or fetch fails
   */
  fetchArticle(id: string): Promise<NewsArticleDetail>;
}
