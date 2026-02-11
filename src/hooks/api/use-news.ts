import { useState, useEffect } from 'react';
import { newsService, type NewsArticleDetail } from '@/services';
import { errorReporter } from '@/lib/errorReporter';

interface UseNewsReturn {
  articles: NewsArticleDetail[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNews(): UseNewsReturn {
  const [articles, setArticles] = useState<NewsArticleDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await newsService.listArticles();
      setArticles(data as NewsArticleDetail[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat berita.';
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

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    articles,
    isLoading,
    error,
    refetch: fetchNews,
  };
}
