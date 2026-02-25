/**
 * Semantic Search Service
 * 
 * Implements TF-IDF based semantic search for news articles.
 * This provides better search results than simple keyword matching by:
 * - Understanding term frequency and inverse document frequency
 * - Matching on semantic similarity, not just exact keywords
 * - Providing relevance scoring for result ranking
 * 
 * Feature flag: FEATURE_SEMANTIC_SEARCH
 */

import type { NewsArticle } from '@shared/types';

// Indonesian stopwords (common words to ignore)
const STOPWORDS = new Set([
  'dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'dengan', 'pada',
  'adalah', 'ini', 'itu', 'di', 'ke', 'dari', 'akan', 'juga',
  'tidak', 'ada', 'sudah', 'saya', 'kami', 'kita', 'mereka',
  'nya', 'lah', 'kah', 'pun', 'telah', 'bisa', 'dapat', 'harus'
]);

// Word stemmer for Indonesian (simplified)
function stem(word: string): string {
  // Simple suffix removal for Indonesian
  const suffixes = ['kan', 'an', 'nya', 'i', 'pun'];
  let result = word;
  for (const suffix of suffixes) {
    if (result.length > 4 && result.endsWith(suffix)) {
      result = result.slice(0, -suffix.length);
      break;
    }
  }
  return result;
}

/**
 * Tokenize text into stemmed terms
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word))
    .map(stem);
}

/**
 * Calculate term frequency vector for a document
 */
function computeTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // Normalize by document length
  const length = tokens.length;
  if (length > 0) {
    for (const [key, value] of tf) {
      tf.set(key, value / length);
    }
  }
  return tf;
}

/**
 * Calculate IDF (Inverse Document Frequency) for all terms
 */
function computeIDF(documents: string[][]): Map<string, number> {
  const idf = new Map<string, number>();
  const N = documents.length;
  
  // Count documents containing each term
  const docCount = new Map<string, number>();
  for (const doc of documents) {
    const uniqueTerms = new Set(doc);
    for (const term of uniqueTerms) {
      docCount.set(term, (docCount.get(term) || 0) + 1);
    }
  }
  
  // Calculate IDF
  for (const [term, count] of docCount) {
    idf.set(term, Math.log((N + 1) / (count + 1)) + 1);
  }
  
  return idf;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  // Get all unique keys
  const keys = new Set([...vec1.keys(), ...vec2.keys()]);
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (const key of keys) {
    const val1 = vec1.get(key) || 0;
    const val2 = vec2.get(key) || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }
  
  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

export interface SearchResult<T> {
  item: T;
  score: number;
}

export interface SemanticSearchOptions {
  /** Minimum similarity score (0-1) to include in results */
  minScore?: number;
  /** Maximum number of results to return */
  limit?: number;
  /** Use semantic search (true) or fallback to keyword (false) */
  enabled?: boolean;
}

const DEFAULT_OPTIONS: Required<SemanticSearchOptions> = {
  minScore: 0.1,
  limit: 20,
  enabled: true,
};

export class SemanticSearchService {
  private idf: Map<string, number> = new Map();
  private documentVectors: Map<string, Map<string, number>> = new Map();
  private initialized = false;

  /**
   * Initialize the search index with articles
   */
  index(articles: NewsArticle[]): void {
    if (articles.length === 0) {
      this.initialized = false;
      return;
    }

    // Tokenize all documents
    const tokenizedDocs = articles.map(article => {
      const text = `${article.title} ${article.excerpt} ${article.author}`;
      return tokenize(text);
    });

    // Compute IDF
    this.idf = computeIDF(tokenizedDocs);

    // Compute TF-IDF vectors for each document
    this.documentVectors.clear();
    for (const article of articles) {
      const text = `${article.title} ${article.excerpt} ${article.author}`;
      const tokens = tokenize(text);
      const tf = computeTermFrequency(tokens);
      
      // Apply IDF weights
      const tfidf = new Map<string, number>();
      for (const [term, tfValue] of tf) {
        const idfValue = this.idf.get(term) || 1;
        tfidf.set(term, tfValue * idfValue);
      }
      
      this.documentVectors.set(article.id, tfidf);
    }

    this.initialized = true;
  }

  /**
   * Search articles using semantic similarity
   */
  search(
    query: string,
    articles: NewsArticle[],
    options: SemanticSearchOptions = {}
  ): SearchResult<NewsArticle>[] {
    const { minScore, limit, enabled } = { ...DEFAULT_OPTIONS, ...options };
    
    // Fallback to keyword search if disabled or not initialized
    if (!enabled || !this.initialized || articles.length === 0) {
      return this.keywordSearch(query, articles).map(item => ({
        item,
        score: 1
      }));
    }

    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return articles.slice(0, limit).map(item => ({
        item,
        score: 1
      }));
    }

    // Tokenize query
    const queryTokens = tokenize(normalizedQuery);
    const queryTf = computeTermFrequency(queryTokens);
    
    // Apply IDF weights to query
    const queryTfidf = new Map<string, number>();
    for (const [term, tfValue] of queryTf) {
      const idfValue = this.idf.get(term) || 1;
      queryTfidf.set(term, tfValue * idfValue);
    }

    // Calculate similarities
    const results: SearchResult<NewsArticle>[] = [];
    
    for (const article of articles) {
      const docVector = this.documentVectors.get(article.id);
      if (!docVector) continue;

      const similarity = cosineSimilarity(queryTfidf, docVector);
      
      if (similarity >= minScore) {
        results.push({
          item: article,
          score: similarity
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * Fallback keyword search
   */
  private keywordSearch(query: string, articles: NewsArticle[]): NewsArticle[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return articles;

    return articles.filter(article =>
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.author.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Check if the index is ready
   */
  isReady(): boolean {
    return this.initialized;
  }
}

// Singleton instance
export const semanticSearchService = new SemanticSearchService();
