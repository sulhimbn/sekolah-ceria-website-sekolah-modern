import type { NewsArticle } from '@shared/types';
import { api } from '@/lib/api-client';

export interface NewsListResponse {
  items: NewsArticle[];
  next?: string;
}

export interface NewsArticleDetail extends NewsArticle {
  fullContent?: string;
  category?: string;
  tags?: string[];
}

class NewsService {
  async listArticles(): Promise<NewsArticle[]> {
    try {
      const response = await api<{ items: NewsArticle[]; next?: string }>('/api/news');
      return response.items;
    } catch (error) {
      throw new Error('Gagal memuat berita. Silakan coba lagi nanti.');
    }
  }

  async getArticle(id: string): Promise<NewsArticleDetail> {
    try {
      const article = await api<NewsArticle>(`/api/news/${id}`);
      return article as NewsArticleDetail;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new Error('Artikel tidak ditemukan');
      }
      throw new Error('Gagal memuat artikel. Silakan coba lagi nanti.');
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

  getRecentArticles(articles: NewsArticle[], count: number = 3): NewsArticle[] {
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
