export { newsService } from './news.service';
export type { NewsListResponse, NewsArticleDetail } from './news.service';
export { contactService } from './contact.service';
export type { ContactFormData, ContactResponse } from './contact.service';
export { userService } from './user.service';
export type { UserListResponse } from './user.service';
export { chatService } from './chat.service';
export type { ChatListResponse } from './chat.service';

/**
 * Centralized API error handler (HARDEN-004)
 * 
 * Wraps API calls with consistent error handling to eliminate
 * duplication across services.
 * 
 * @param apiCall - The API call function to execute
 * @param errorMessage - The error message to throw on failure
 * @returns The result of the API call
 * @throws Error with the provided error message
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    throw new Error(errorMessage);
  }
}

/**
 * Enhanced API call wrapper with conditional error handling (HARDEN-004)
 * 
 * @param apiCall - The API call function to execute
 * @param options - Error handling options
 * @returns The result of the API call
 * @throws Error based on the error handling configuration
 */
export async function withConditionalErrorHandling<T>(
  apiCall: () => Promise<T>,
  options: {
    defaultError: string;
    notFoundError?: string;
    notFoundCheck?: (error: unknown) => boolean;
  }
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (
      options.notFoundError &&
      options.notFoundCheck &&
      options.notFoundCheck(error)
    ) {
      throw new Error(options.notFoundError);
    }
    throw new Error(options.defaultError);
  }
}
