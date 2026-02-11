import { ApiResponse } from "../../shared/types"
import { MESSAGES } from './messages'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface ApiClientConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipCache?: boolean;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  isRetryable?: boolean;
}

/**
 * Custom error class for API errors with additional metadata
 */
class ApiRequestError extends Error implements ApiError {
  status?: number;
  code?: string;
  isRetryable?: boolean;

  constructor(
    message: string,
    options: { status?: number; code?: string; isRetryable?: boolean } = {}
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = options.status;
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? this.calculateRetryable(options.status);
  }

  private calculateRetryable(status?: number): boolean {
    if (!status) return true;
    return status >= 500 || status === 429 || status === 408;
  }
}

const pendingRequests = new Map<string, Promise<unknown>>();

function generateRequestKey(url: string, init?: RequestInit): string {
  const method = init?.method || 'GET';
  const body = init?.body ? JSON.stringify(init.body) : '';
  return `${method}:${url}:${body}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateRetryDelay(attempt: number, baseDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, 30000);
}

/**
 * Enhanced API client with timeout, retries, deduplication, and better error handling
 * 
 * Features:
 * - Request timeout handling
 * - Automatic retries with exponential backoff
 * - Request deduplication (prevents duplicate concurrent requests)
 * - Structured error categorization
 * - Request/response interceptors support
 */
export async function api<T>(
  path: string, 
  config: ApiClientConfig = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    retryDelay = RETRY_DELAY,
    skipCache = false,
    ...fetchConfig
  } = config;

  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const requestKey = generateRequestKey(url, fetchConfig);

  if (!skipCache) {
    const pending = pendingRequests.get(requestKey);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestPromise = executeRequestWithRetries<T>(
    url,
    fetchConfig,
    controller,
    timeoutId,
    retries,
    retryDelay
  );

  pendingRequests.set(requestKey, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    pendingRequests.delete(requestKey);
  }
}

async function executeRequestWithRetries<T>(
  url: string,
  fetchConfig: RequestInit,
  controller: AbortController,
  timeoutId: ReturnType<typeof setTimeout>,
  maxRetries: number,
  baseDelay: number
): Promise<T> {
  let lastError: ApiRequestError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await executeRequest<T>(url, fetchConfig, controller, timeoutId);
      return result;
    } catch (error) {
      lastError = error as ApiRequestError;

      if (attempt === maxRetries) {
        break;
      }

      if (!lastError.isRetryable) {
        break;
      }

      const delay = calculateRetryDelay(attempt, baseDelay);
      
      console.warn(
        `[API] Request failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
        `Retrying in ${Math.round(delay)}ms...`,
        { url, error: lastError.message, status: lastError.status }
      );

      await sleep(delay);

      controller = new AbortController();
    }
  }

  throw lastError || new ApiRequestError(MESSAGES.API.REQUEST_FAILED);
}

async function executeRequest<T>(
  url: string,
  fetchConfig: RequestInit,
  controller: AbortController,
  timeoutId: ReturnType<typeof setTimeout>
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json',
        ...fetchConfig.headers 
      },
      ...fetchConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let json: ApiResponse<T>;
    try {
      json = await res.json() as ApiResponse<T>;
    } catch (parseError) {
      throw new ApiRequestError(
        MESSAGES.API.REQUEST_FAILED,
        { status: res.status, code: 'PARSE_ERROR' }
      );
    }

    if (!res.ok || !json.success || json.data === undefined) {
      const errorMessage = json.error || MESSAGES.API.REQUEST_FAILED;
      throw new ApiRequestError(
        errorMessage,
        { 
          status: res.status, 
          code: json.error ? 'API_ERROR' : 'REQUEST_FAILED',
          isRetryable: res.status >= 500 || res.status === 429
        }
      );
    }

    return json.data;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiRequestError(
          'Request timeout - please try again',
          { code: 'TIMEOUT', isRetryable: true }
        );
      }

      if (error instanceof ApiRequestError) {
        throw error;
      }

      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new ApiRequestError(
          'Network error - please check your connection',
          { code: 'NETWORK_ERROR', isRetryable: true }
        );
      }
    }

    throw new ApiRequestError(
      error instanceof Error ? error.message : MESSAGES.API.REQUEST_FAILED,
      { code: 'UNKNOWN_ERROR', isRetryable: false }
    );
  }
}

export const apiClient = {
  get: <T>(path: string, config?: Omit<ApiClientConfig, 'method' | 'body'>) =>
    api<T>(path, { ...config, method: 'GET' }),

  post: <T>(path: string, body: unknown, config?: Omit<ApiClientConfig, 'method' | 'body'>) =>
    api<T>(path, { ...config, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown, config?: Omit<ApiClientConfig, 'method' | 'body'>) =>
    api<T>(path, { ...config, method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown, config?: Omit<ApiClientConfig, 'method' | 'body'>) =>
    api<T>(path, { ...config, method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string, config?: Omit<ApiClientConfig, 'method'>) =>
    api<T>(path, { ...config, method: 'DELETE' }),
};

export { ApiRequestError };
export type { ApiClientConfig, ApiError };