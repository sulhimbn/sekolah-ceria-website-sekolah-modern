import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface NewsDetailSkeletonProps {
  className?: string;
}

/**
 * Reusable news detail skeleton component.
 * Used for loading states in NewsDetailPage.
 *
 * @example
 * ```tsx
 * {isLoading && <NewsDetailSkeleton />}
 * ```
 */
export function NewsDetailSkeleton({
  className,
}: NewsDetailSkeletonProps = {}): React.ReactNode {
  return (
    <div className={className}>
      <Skeleton className="h-12 w-3/4 mb-6" />
      <div className="flex items-center space-x-6 mb-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="aspect-video w-full rounded-lg mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full mt-4" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  );
}
