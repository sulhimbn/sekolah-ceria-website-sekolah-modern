import type { NewsArticle } from '@shared/types';
import type {
  INewsRepository,
  NewsArticleDetail,
} from '@/repositories/interfaces';
import { createNewsRepository } from '@/repositories/implementations';
import { VALIDATION_CONFIG } from '@/lib/validation-config';
import { MESSAGES } from '@/lib/messages';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import {
  semanticSearchService,
  type SearchResult,
} from './semantic-search.service';
import { withErrorHandling, withConditionalErrorHandling } from '.';

export interface NewsListResponse {
  items: NewsArticle[];
  next?: string;
}

export { type NewsArticleDetail };

export class NewsService {
  private repository: INewsRepository;
  private indexed = false;

  constructor(repository: INewsRepository = createNewsRepository()) {
    this.repository = repository;
  }

  async listArticles(): Promise<NewsArticle[]> {
    return withErrorHandling(async () => {
      const response = await this.repository.fetchArticles();
      return response.items;
    }, MESSAGES.NEWS.LOAD_FAILED);
  }

  async getArticle(id: string): Promise<NewsArticleDetail> {
    return withConditionalErrorHandling(
      async () => {
        const article = await this.repository.fetchArticle(id);
        return article;
      },
      {
        defaultError: MESSAGES.NEWS.ARTICLE_LOAD_FAILED,
        notFoundError: MESSAGES.NEWS.ARTICLE_NOT_FOUND,
        notFoundCheck: (error: unknown) =>
          error instanceof Error && error.message.includes('not found'),
      }
    );
  }

  /**
   * Search articles using semantic search with keyword fallback
   *
   * Uses TF-IDF based semantic search when enabled, falls back to
   * simple keyword matching when semantic search is disabled or
   * returns no results.
   */
  searchArticles(query: string, articles: NewsArticle[]): NewsArticle[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return articles;

    // Use semantic search if enabled
    if (FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH) {
      // Index articles if not already indexed
      if (!this.indexed) {
        semanticSearchService.index(articles);
        this.indexed = true;
      }

      // Perform semantic search
      const results = semanticSearchService.search(normalizedQuery, articles, {
        enabled: FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH,
        minScore: FEATURE_FLAGS.SEMANTIC_SEARCH_MIN_SCORE,
        limit: FEATURE_FLAGS.SEMANTIC_SEARCH_LIMIT,
      });

      // If we have semantic results, return them
      if (results.length > 0) {
        return results.map(r => r.item);
      }

      // Fallback to keyword search if semantic search returns no results
    }

    // Keyword search fallback
    return articles.filter(
      article =>
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.author.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Search with relevance scores (for advanced UI)
   */
  searchArticlesWithScores(
    query: string,
    articles: NewsArticle[]
  ): SearchResult<NewsArticle>[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return articles.map(item => ({ item, score: 1 }));
    }

    // Use semantic search if enabled
    if (FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH) {
      if (!this.indexed) {
        semanticSearchService.index(articles);
        this.indexed = true;
      }

      const results = semanticSearchService.search(normalizedQuery, articles, {
        enabled: FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH,
        minScore: 0,
        limit: FEATURE_FLAGS.SEMANTIC_SEARCH_LIMIT,
      });

      if (results.length > 0) {
        return results;
      }
    }

    // Keyword search fallback with scores
    return articles
      .filter(
        article =>
          article.title.toLowerCase().includes(normalizedQuery) ||
          article.excerpt.toLowerCase().includes(normalizedQuery) ||
          article.author.toLowerCase().includes(normalizedQuery)
      )
      .map(item => ({ item, score: 1 }));
  }

  getRecentArticles(
    articles: NewsArticle[],
    count: number = VALIDATION_CONFIG.NEWS.DEFAULT_RECENT_COUNT
  ): NewsArticle[] {
    return articles.slice(0, count);
  }

  getArticlesByMonth(
    articles: NewsArticle[],
    month: number,
    year: number
  ): NewsArticle[] {
    return articles.filter(article => {
      const date = new Date(article.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }

  /**
   * Get related articles using semantic search
   *
   * Finds articles similar to the given article using semantic similarity.
   * Uses TF-IDF based semantic search for relevance ranking.
   */
  getRelatedArticles(
    currentArticle: NewsArticle,
    allArticles: NewsArticle[]
  ): NewsArticle[] {
    // Filter out the current article
    const otherArticles = allArticles.filter(
      article => article.id !== currentArticle.id
    );

    if (otherArticles.length === 0) {
      return [];
    }

    // Build search query from current article title and excerpt
    const query = `${currentArticle.title} ${currentArticle.excerpt}`;
    const normalizedQuery = query.toLowerCase().trim();

    // Use semantic search if enabled
    if (FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH) {
      // Re-index if needed
      if (!this.indexed) {
        semanticSearchService.index(allArticles);
        this.indexed = true;
      }

      // Search for related articles
      const results = semanticSearchService.search(
        normalizedQuery,
        otherArticles,
        {
          enabled: true,
          minScore: 0.05, // Lower threshold for related articles
          limit: FEATURE_FLAGS.RELATED_ARTICLES_COUNT,
        }
      );

      if (results.length > 0) {
        return results.map(r => r.item);
      }
    }

    // Fallback: return recent articles (excluding current)
    return otherArticles.slice(0, FEATURE_FLAGS.RELATED_ARTICLES_COUNT);
  }
}

export const newsService = new NewsService();
