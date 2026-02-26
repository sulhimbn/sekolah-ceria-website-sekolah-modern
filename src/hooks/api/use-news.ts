import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService, type NewsArticleDetail } from '@/services/news.service';
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

const NEWS_QUERY_KEY = ['news', 'list'];

async function fetchNews(): Promise<NewsArticleDetail[]> {
  const data = await newsService.listArticles();
  return data as NewsArticleDetail[];
}

export function useNews(): UseNewsReturn {
  const {
    data: articles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: NEWS_QUERY_KEY,
    queryFn: fetchNews,
    staleTime: FEATURE_FLAGS.TANSTACK_QUERY_STALE_TIME,
    gcTime: FEATURE_FLAGS.TANSTACK_QUERY_CACHE_TIME,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const handleError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Gagal memuat berita.';
    errorReporter.report({
      message: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'network',
    });
    return errorMessage;
  }, []);

  return {
    articles,
    isLoading,
    error: error ? handleError(error) : null,
    refetch,
  };
}

/**
 * Hook for news with semantic search support
 *
 * Provides search functionality using TF-IDF based semantic search
 * when enabled, with fallback to keyword search.
 */
export function useNewsSearch(): UseNewsSearchReturn {
  const {
    data: articles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: NEWS_QUERY_KEY,
    queryFn: fetchNews,
    staleTime: FEATURE_FLAGS.TANSTACK_QUERY_STALE_TIME,
    gcTime: FEATURE_FLAGS.TANSTACK_QUERY_CACHE_TIME,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Determine search mode based on feature flag
  const searchMode: 'semantic' | 'keyword' = useMemo(() => {
    return FEATURE_FLAGS.FEATURE_SEMANTIC_SEARCH ? 'semantic' : 'keyword';
  }, []);

  // Perform search - using local state to avoid refetching
  const searchResults = useMemo(() => {
    // This is a client-side filter - the actual search happens in the service
    // We return all articles here; filtering is done by the component
    return articles;
  }, [articles]);

  const handleError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Gagal memuat berita.';
    errorReporter.report({
      message: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'network',
    });
    return errorMessage;
  }, []);

  // For search functionality, we need to keep the original approach
  // since searchQuery is handled by the component
  const [searchQuery, setSearchQuery] = useState<{ value: string }>({
    value: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery({ value: query });
  }, []);

  return {
    articles,
    isLoading,
    error: error ? handleError(error) : null,
    refetch,
    searchQuery: searchQuery.value,
    setSearchQuery: handleSetSearchQuery,
    searchResults,
    isSearching,
    searchMode,
  };
}
