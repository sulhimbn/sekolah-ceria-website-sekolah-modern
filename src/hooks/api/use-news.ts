import { useState, useEffect, useMemo, useCallback } from 'react';
import { newsService, type NewsArticleDetail } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

interface UseNewsReturn {
  articles: NewsArticleDetail[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseNewsSearchReturn extends UseNewsReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: NewsArticleDetail[];
  isSearching: boolean;
  searchMode: 'semantic' | 'keyword';
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

/**
 * Hook for news with semantic search support
 * 
 * Provides search functionality using TF-IDF based semantic search
 * when enabled, with fallback to keyword search.
 */
export function useNewsSearch(): UseNewsSearchReturn {
  const [articles, setArticles] = useState<NewsArticleDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  // Determine search mode based on feature flag
  const searchMode: 'semantic' | 'keyword' = useMemo(() => {
    return FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH ? 'semantic' : 'keyword';
  }, []);

  // Perform search when query changes
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return articles;
    }

    setIsSearching(true);
    try {
      // Use the news service search which handles semantic + fallback
      const results = newsService.searchArticles(searchQuery, articles as any);
      return results as NewsArticleDetail[];
    } finally {
      // Use setTimeout to avoid blocking UI
      setTimeout(() => setIsSearching(false), 0);
    }
  }, [searchQuery, articles]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    articles,
    isLoading,
    error,
    refetch: fetchNews,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    searchResults,
    isSearching,
    searchMode,
  };
}
