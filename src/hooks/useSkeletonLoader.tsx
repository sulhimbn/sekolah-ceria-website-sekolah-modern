import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  /** Number of skeleton items to render */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable news card skeleton component.
 * Used for loading states in HomePage and NewsPage.
 * 
 * @example
 * ```tsx
 * {isLoading && <NewsCardSkeleton count={3} />}
 * ```
 */
export function NewsCardSkeleton({ count = 3, className }: SkeletonLoaderProps): React.ReactNode {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-6 flex-grow flex flex-col">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-5 w-1/3 mt-auto" />
          </CardContent>
        </Card>
      ))}
    </>
  );
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
export function NewsDetailSkeleton(props: { className?: string } = {}): React.ReactNode {
  const { className } = props;
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
