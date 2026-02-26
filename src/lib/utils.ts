import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate estimated reading time for text content
 * Based on average reading speed of 200 words per minute
 * @param text - The text content to calculate reading time for
 * @returns Formatted string like "3 min read"
 */
export function calculateReadingTime(text: string): string {
  if (!text || text.trim().length === 0) {
    return '1 min read';
  }

  // Count words (split by whitespace and filter empty strings)
  const wordCount = text.trim().split(/\s+/).length;

  // Average reading speed: 200 words per minute
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} min read`;
}
