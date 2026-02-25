export { useNews, useNewsSearch } from './use-news';
export { useNewsArticle } from './use-news-article';
export { useContactForm } from './use-contact-form';
export { useUsers } from './use-users';
export { useChats } from './use-chats';
export { useChatMessages } from './use-chat-messages';

/**
 * Standardized API Hook Interfaces (HARDEN-003)
 *
 * These interfaces define consistent patterns for all API hooks:
 * - Query hooks (fetching data): Use ApiQueryHookResult
 * - Mutation hooks (submitting data): Use ApiMutationHookResult
 *
 * Future hooks should implement these interfaces for consistency.
 */

/** Standard interface for query hooks (data fetching) */
export interface ApiQueryHookResult<T> {
  /** The fetched data (null if not yet loaded or on error) */
  data: T | null;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message (null if no error) */
  error: string | null;
  /** Function to refetch/refresh the data */
  refetch: () => Promise<void>;
}

/** Standard interface for mutation hooks (data submission) */
export interface ApiMutationHookResult<TInput, TOutput = void> {
  /** Whether a mutation is in progress */
  isSubmitting: boolean;
  /** Error message from last submission (null if no error) */
  error: string | null;
  /** Function to execute the mutation */
  submit: (data: TInput) => Promise<TOutput>;
  /** Function to clear the error state */
  clearError: () => void;
}

/** Standard interface for paginated query hooks */
export interface ApiPaginatedQueryHookResult<T> extends ApiQueryHookResult<T[]> {
  /** Whether more data is available */
  hasMore: boolean;
  /** Function to load next page */
  loadMore: () => Promise<void>;
  /** Current page number (1-based) */
  page: number;
}
