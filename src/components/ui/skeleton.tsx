import * as React from 'react';

import { cn } from '@/lib/utils';

const Skeleton = React.memo(function Skeleton({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'shimmer' }) {
  if (variant === 'shimmer') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-md bg-primary/10',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
});

export { Skeleton };
