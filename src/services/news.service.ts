import type { NewsArticle } from '@shared/types';
import type { INewsRepository, NewsArticleDetail } from '@/repositories/interfaces';
import { createNewsRepository } from '@/repositories/implementations';
import { VALIDATION_CONFIG } from '@/lib/validation-config';
import { MESSAGES } from '@/lib/messages';

export interface NewsListResponse {
  items: NewsArticle[];
  next?: string;
}

export { type NewsArticleDetail };

export class NewsService {
  private repository: INewsRepository;

  constructor(repository: INewsRepository = createNewsRepository()) {
    this.repository = repository;
  }

  async listArticles(): Promise<NewsArticle[]> {
    try {
      const response = await this.repository.fetchArticles();
      return response.items;
    } catch (error) {
      throw new Error(MESSAGES.NEWS.LOAD_FAILED);
    }
  }

  async getArticle(id: string): Promise<NewsArticleDetail> {
    try {
      const article = await this.repository.fetchArticle(id);
      return article;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new Error(MESSAGES.NEWS.ARTICLE_NOT_FOUND);
      }
      throw new Error(MESSAGES.NEWS.ARTICLE_LOAD_FAILED);
    }
  }

  searchArticles(query: string, articles: NewsArticle[]): NewsArticle[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return articles;
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.author.toLowerCase().includes(normalizedQuery)
    );
  }

  getRecentArticles(articles: NewsArticle[], count: number = VALIDATION_CONFIG.NEWS.DEFAULT_RECENT_COUNT): NewsArticle[] {
    return articles.slice(0, count);
  }

  getArticlesByMonth(articles: NewsArticle[], month: number, year: number): NewsArticle[] {
    return articles.filter(article => {
      const date = new Date(article.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }
}

export const newsService = new NewsService();
