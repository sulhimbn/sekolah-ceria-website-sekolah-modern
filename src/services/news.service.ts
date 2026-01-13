import type { NewsArticle } from '@shared/types';
import { api } from '@/lib/api-client';
import { VALIDATION_CONFIG } from '@/lib/validation-config';
import { MESSAGES } from '@/lib/messages';

export interface NewsListResponse {
  items: NewsArticle[];
  next?: string;
}

export interface NewsArticleDetail extends NewsArticle {
  fullContent?: string;
  category?: string;
  tags?: string[];
}

export class NewsService {
  async listArticles(): Promise<NewsArticle[]> {
    try {
      const response = await api<{ items: NewsArticle[]; next?: string }>('/api/news');
      return response.items;
    } catch (error) {
      throw new Error(MESSAGES.NEWS.LOAD_FAILED);
    }
  }

  async getArticle(id: string): Promise<NewsArticleDetail> {
    try {
      const article = await api<NewsArticle>(`/api/news/${id}`);
      return article as NewsArticleDetail;
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
