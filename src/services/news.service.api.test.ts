import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsService } from '@/services/news.service';
import { api } from '@/lib/api-client';
import type { NewsArticle } from '@shared/types';

vi.mock('@/lib/api-client', () => ({
  api: vi.fn(),
}));

describe('NewsService - API Methods', () => {
  let newsService: NewsService;

  beforeEach(() => {
    newsService = new NewsService();
    vi.clearAllMocks();
  });

  describe('listArticles', () => {
    it('should return articles list on successful API call', async () => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'Test Article',
          date: '2025-01-01',
          author: 'Test Author',
          excerpt: 'Test excerpt',
        },
      ];

      vi.mocked(api).mockResolvedValueOnce({
        items: mockArticles,
        next: undefined,
      });

      const result = await newsService.listArticles();

      expect(api).toHaveBeenCalledWith('/api/news');
      expect(result).toEqual(mockArticles);
    });

    it('should return articles list with next cursor', async () => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'Test Article',
          date: '2025-01-01',
          author: 'Test Author',
          excerpt: 'Test excerpt',
        },
      ];

      vi.mocked(api).mockResolvedValueOnce({
        items: mockArticles,
        next: 'cursor123',
      });

      const result = await newsService.listArticles();

      expect(result).toEqual(mockArticles);
    });

    it('should throw error on API failure', async () => {
      vi.mocked(api).mockRejectedValueOnce(new Error('Network error'));

      await expect(newsService.listArticles()).rejects.toThrow(
        'Gagal memuat berita. Silakan coba lagi nanti.'
      );
    });

    it('should return empty array when API returns no items', async () => {
      vi.mocked(api).mockResolvedValueOnce({
        items: [],
        next: undefined,
      });

      const result = await newsService.listArticles();

      expect(result).toEqual([]);
    });
  });

  describe('getArticle', () => {
    it('should return article detail on successful API call', async () => {
      const mockArticle: NewsArticle = {
        id: '1',
        title: 'Test Article',
        date: '2025-01-01',
        author: 'Test Author',
        excerpt: 'Test excerpt',
        imageUrl: 'https://example.com/image.jpg',
      };

      vi.mocked(api).mockResolvedValueOnce(mockArticle);

      const result = await newsService.getArticle('1');

      expect(api).toHaveBeenCalledWith('/api/news/1');
      expect(result).toEqual(mockArticle);
    });

    it('should throw not found error when API returns 404', async () => {
      const error = new Error('not found');
      vi.mocked(api).mockRejectedValueOnce(error);

      await expect(newsService.getArticle('nonexistent')).rejects.toThrow(
        'Artikel tidak ditemukan'
      );
    });

    it('should throw load failed error on API failure', async () => {
      const error = new Error('Network error');
      vi.mocked(api).mockRejectedValueOnce(error);

      await expect(newsService.getArticle('1')).rejects.toThrow(
        'Gagal memuat artikel. Silakan coba lagi nanti.'
      );
    });

    it('should throw load failed error on generic error', async () => {
      const error = new Error('some other error');
      vi.mocked(api).mockRejectedValueOnce(error);

      await expect(newsService.getArticle('1')).rejects.toThrow(
        'Gagal memuat artikel. Silakan coba lagi nanti.'
      );
    });
  });
});
