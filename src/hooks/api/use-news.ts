import { useState, useMemo, useCallback } from 'react';
import {
  newsService,
  type NewsArticle,
  type NewsArticleDetail,
} from '@/services/news.service';
import { useApiResource } from './use-api-resource';
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
  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useApiResource<NewsArticleDetail[]>(
    () => newsService.listArticles() as Promise<NewsArticleDetail[]>,
    'Gagal memuat berita.'
  );

  return {
    articles: articles || [],
    isLoading,
    error,
    refetch,
  };
}

export function useNewsSearch(): UseNewsSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useApiResource<NewsArticleDetail[]>(
    () => newsService.listArticles() as Promise<NewsArticleDetail[]>,
    'Gagal memuat berita.'
  );

  const searchMode: 'semantic' | 'keyword' = useMemo(() => {
    return FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH ? 'semantic' : 'keyword';
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return articles || [];
    }

    setIsSearching(true);
    try {
      const results = newsService.searchArticles(
        searchQuery,
        articles as NewsArticle[]
      );
      return results as NewsArticleDetail[];
    } finally {
      setTimeout(() => setIsSearching(false), 0);
    }
  }, [searchQuery, articles]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    articles: articles || [],
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    searchResults,
    isSearching,
    searchMode,
  };
}
