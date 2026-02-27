import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsApiRepository } from './news.repository';
import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import type { NewsArticle } from '@shared/types';
import type { NewsArticleDetail } from '@/repositories/interfaces/news.repository.interface';

// Mock the api-client module
vi.mock('@/lib/api-client', () => ({
  api: vi.fn(),
}));

// Mock the api-validator module
vi.mock('@/lib/api-validator', () => ({
  validateResponse: vi.fn((schema, data, schemaName) => data),
}));

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: '',
}));

describe('NewsApiRepository', () => {
  let repository: NewsApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new NewsApiRepository();
  });

  describe('fetchArticles', () => {
    it('should fetch articles and return validated response', async () => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'News 1',
          date: '2024-01-01',
          author: 'Author 1',
          excerpt: 'Excerpt 1',
        },
        {
          id: '2',
          title: 'News 2',
          date: '2024-01-02',
          author: 'Author 2',
          excerpt: 'Excerpt 2',
        },
      ];
      const mockResponse = { items: mockArticles, next: 'cursor123' };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        items: mockArticles,
        next: 'cursor123',
      });
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockResponse
      );

      const result = await repository.fetchArticles();

      expect(api).toHaveBeenCalledWith('/api/news');
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        { items: mockArticles, next: 'cursor123' },
        'NewsListResponse'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(repository.fetchArticles()).rejects.toThrow('Network error');
    });
  });

  describe('fetchArticle', () => {
    it('should fetch single article by id and return validated response', async () => {
      const mockArticle: NewsArticle = {
        id: '1',
        title: 'News 1',
        date: '2024-01-01',
        author: 'Author 1',
        excerpt: 'Excerpt 1',
      };
      const mockDetail: NewsArticleDetail = {
        ...mockArticle,
        fullContent: 'Full content here',
        category: 'Category',
        tags: ['tag1', 'tag2'],
      };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockArticle);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockDetail
      );

      const result = await repository.fetchArticle('1');

      expect(api).toHaveBeenCalledWith('/api/news/1');
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        mockArticle,
        'NewsArticleDetail'
      );
      expect(result).toEqual(mockDetail);
    });

    it('should throw error when article not found', async () => {
      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Article not found')
      );

      await expect(repository.fetchArticle('999')).rejects.toThrow(
        'Article not found'
      );
    });
  });
});
