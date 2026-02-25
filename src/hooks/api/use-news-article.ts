import { useState, useEffect } from 'react';
import { newsService } from '@/services/news.service';
import { errorReporter } from '@/lib/errorReporter';
import type { NewsArticle } from '@shared/types';

interface UseNewsArticleReturn {
  article: NewsArticle | null;
  isLoading: boolean;
  error: string | null;
}

export function useNewsArticle(id: string): UseNewsArticleReturn {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      setIsLoading(false);
      setError('ID artikel tidak valid');
      return;
    }

    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await newsService.getArticle(id);
        setArticle(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal memuat artikel.';
        setError(errorMessage);
        errorReporter.report({
          message: errorMessage,
          stack: err instanceof Error ? err.stack : undefined,
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
          level: 'error',
          category: 'network',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return {
    article,
    isLoading,
    error,
  };
}
