import { describe, it, expect } from 'vitest'
import { NewsService } from '@/services/news.service'
import type { NewsArticle } from '@shared/types'

const newsService = new NewsService()

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Prestasi Siswa di Kompetisi Matematika',
    date: '2025-01-15',
    author: 'Budi Santoso',
    excerpt: 'Siswa sekolah ceria meraih juara pertama',
    imageUrl: 'https://example.com/image1.jpg',
  },
  {
    id: '2',
    title: 'Program Ekstrakurikuler Baru Tahun 2025',
    date: '2025-01-10',
    author: 'Siti Rahayu',
    excerpt: 'Sekolah menghadirkan berbagai kegiatan baru',
  },
  {
    id: '3',
    title: 'Perayaan Hari Pendidikan Nasional',
    date: '2025-05-02',
    author: 'Ahmad Wijaya',
    excerpt: 'Upacara dan berbagai lomba meriahkan Hardiknas',
    imageUrl: 'https://example.com/image3.jpg',
  },
  {
    id: '4',
    title: 'Kunjungan Edukasi ke Museum',
    date: '2025-01-05',
    author: 'Dewi Lestari',
    excerpt: 'Siswa belajar sejarah secara langsung',
  },
  {
    id: '5',
    title: 'Workshop Kreatifitas Siswa',
    date: '2025-06-15',
    author: 'Budi Santoso',
    excerpt: 'Melatih kreativitas dan bakat siswa',
  },
]

describe('NewsService - Pure Functions', () => {
  describe('searchArticles', () => {
    it('should return all articles when query is empty', () => {
      const result = newsService.searchArticles('', mockArticles)
      expect(result).toHaveLength(mockArticles.length)
      expect(result).toEqual(mockArticles)
    })

    it('should return all articles when query contains only whitespace', () => {
      const result = newsService.searchArticles('   ', mockArticles)
      expect(result).toHaveLength(mockArticles.length)
    })

    it('should filter articles by title (case insensitive)', () => {
      const result = newsService.searchArticles('matematika', mockArticles)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should filter articles by title with uppercase query', () => {
      const result = newsService.searchArticles('MATEMATIKA', mockArticles)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should filter articles by excerpt', () => {
      const result = newsService.searchArticles('meraih juara', mockArticles)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should filter articles by author', () => {
      const result = newsService.searchArticles('budi santoso', mockArticles)
      expect(result).toHaveLength(2)
      expect(result.map(a => a.id)).toEqual(['1', '5'])
    })

    it('should return empty array when no matches found', () => {
      const result = newsService.searchArticles('nonexistent term', mockArticles)
      expect(result).toHaveLength(0)
    })

    it('should handle partial word matches', () => {
      const result = newsService.searchArticles('kreatif', mockArticles)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('5')
    })
  })

  describe('getRecentArticles', () => {
    it('should return default number of recent articles (3)', () => {
      const result = newsService.getRecentArticles(mockArticles)
      expect(result).toHaveLength(3)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('2')
      expect(result[2].id).toBe('3')
    })

    it('should return specified number of recent articles', () => {
      const result = newsService.getRecentArticles(mockArticles, 2)
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('2')
    })

    it('should return all articles when count exceeds array length', () => {
      const result = newsService.getRecentArticles(mockArticles, 10)
      expect(result).toHaveLength(mockArticles.length)
    })

    it('should return empty array when articles is empty', () => {
      const result = newsService.getRecentArticles([])
      expect(result).toHaveLength(0)
    })

    it('should handle count of 0', () => {
      const result = newsService.getRecentArticles(mockArticles, 0)
      expect(result).toHaveLength(0)
    })
  })

  describe('getArticlesByMonth', () => {
    it('should filter articles by month and year', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 0, 2025)
      expect(result).toHaveLength(3)
      expect(result.map(a => a.id)).toEqual(['1', '2', '4'])
    })

    it('should filter articles by May 2025', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 4, 2025)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('3')
    })

    it('should filter articles by June 2025', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 5, 2025)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('5')
    })

    it('should return empty array when no articles match month', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 11, 2025)
      expect(result).toHaveLength(0)
    })

    it('should return empty array when no articles match year', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 0, 2024)
      expect(result).toHaveLength(0)
    })

    it('should handle empty articles array', () => {
      const result = newsService.getArticlesByMonth([], 0, 2025)
      expect(result).toHaveLength(0)
    })

    it('should correctly identify January (month 0)', () => {
      const result = newsService.getArticlesByMonth(mockArticles, 0, 2025)
      const januaryArticles = ['1', '2', '4']
      expect(result.every(a => a.date.startsWith('2025-01'))).toBe(true)
      expect(result.length).toBe(januaryArticles.length)
    })
  })
})
