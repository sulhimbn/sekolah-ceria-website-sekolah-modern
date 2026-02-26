import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsCardSkeletonProps {
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
export function NewsCardSkeleton({
  count = 3,
  className,
}: NewsCardSkeletonProps): React.ReactNode {
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
