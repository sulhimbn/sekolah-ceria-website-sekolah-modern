import { Skeleton } from '@/components/ui/skeleton';

/**
 * Pre-defined skeleton loading variants
 */
export type SkeletonVariant = 'card' | 'hero' | 'list' | 'article';

/**
 * Props for SkeletonLoader component
 */
interface SkeletonLoaderProps {
  /** The variant of skeleton to display */
  variant?: SkeletonVariant;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pre-configured skeleton loaders for common loading states
 *
 * Provides consistent skeleton patterns for different UI contexts.
 * Use these during data loading to show placeholders.
 *
 * @example
 * ```tsx
 * {isLoading && <SkeletonLoader variant="hero" />}
 * {isLoading && <SkeletonLoader variant="card" />}
 * {isLoading && <SkeletonLoader variant="list" />}
 * {isLoading && <SkeletonLoader variant="article" />}
 * ```
 */
export function SkeletonLoader({
  variant = 'card',
  className = '',
}: SkeletonLoaderProps) {
  switch (variant) {
    case 'hero':
      return (
        <div className={`space-y-4 ${className}`}>
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-5 w-1/3 mt-auto" />
        </div>
      );

    case 'card':
      return (
        <div className={`space-y-3 ${className}`}>
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      );

    case 'list':
      return (
        <div className={`space-y-2 ${className}`}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      );

    case 'article':
      return (
        <div className={`space-y-4 ${className}`}>
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );

    default:
      return <Skeleton className={`h-4 w-full ${className}`} />;
  }
}
