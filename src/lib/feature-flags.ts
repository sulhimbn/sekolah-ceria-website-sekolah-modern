/**
 * Feature Flags Configuration
 *
 * Centralized configuration for feature flags used throughout the application.
 * These flags enable gradual rollout and A/B testing of new features.
 */

export interface FeatureFlags {
  /** Enable AI-powered semantic search for news articles */
  FEATURE_SEMANTIC_SEARCH: boolean;
  /** Minimum similarity score for semantic search results (0-1) */
  SEMANTIC_SEARCH_MIN_SCORE: number;
  /** Maximum results to return from semantic search */
  SEMANTIC_SEARCH_LIMIT: number;
  /** Enable social sharing buttons on news articles */
  FEATURE_SOCIAL_SHARING: boolean;
  /** Enable TanStack Query for API caching - improves performance */
  FEATURE_TANSTACK_QUERY: boolean;
  /** Cache time in milliseconds (default: 5 minutes) */
  TANSTACK_QUERY_CACHE_TIME: number;
  /** Stale time in milliseconds (default: 1 minute) */
  TANSTACK_QUERY_STALE_TIME: number;
}

export const FEATURE_FLAGS: FeatureFlags = {
  FEATURE_SEMANTIC_SEARCH: true,
  SEMANTIC_SEARCH_MIN_SCORE: 0.1,
  FEATURE_SOCIAL_SHARING: true,
  FEATURE_TANSTACK_QUERY: true,
  TANSTACK_QUERY_CACHE_TIME: 5 * 60 * 1000,
  TANSTACK_QUERY_STALE_TIME: 60 * 1000,
};

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[flag] === true;
}

/**
 * Get a feature flag value
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(
  flag: K
): FeatureFlags[K] {
  return FEATURE_FLAGS[flag];
}
