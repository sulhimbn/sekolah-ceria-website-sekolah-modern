export { useNews, useNewsSearch } from './use-news';
export { useNewsArticle } from './use-news-article';
export { useContactForm } from './use-contact-form';
export { useUsers } from './use-users';
export { useChats } from './use-chats';
export { useChatMessages } from './use-chat-messages';
export { useApiResource, useApiResourceWithMutation } from './use-api-resource';
export { useAsyncOperation } from './use-async-operation';

export interface ApiQueryHookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface ApiMutationHookResult<TInput, TOutput = void> {
  isSubmitting: boolean;
  error: string | null;
  submit: (data: TInput) => Promise<TOutput>;
  clearError: () => void;
}

export interface ApiPaginatedQueryHookResult<T> extends ApiQueryHookResult<
  T[]
> {
  hasMore: boolean;
  loadMore: () => Promise<void>;
  page: number;
}
