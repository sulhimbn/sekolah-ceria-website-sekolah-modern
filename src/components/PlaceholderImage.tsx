import React from 'react';
import { cn } from '@/lib/utils';

export type PlaceholderVariant = 'school' | 'news' | 'history' | 'curriculum';

type PlaceholderImageProps = {
  variant?: PlaceholderVariant;
  className?: string;
  label?: string;
};

const variantConfig = {
  school: {
    bgColor: 'bg-school-yellow',
    iconColor: 'text-school-blue',
    label: 'Sekolah',
  },
  news: {
    bgColor: 'bg-school-blue/20',
    iconColor: 'text-school-blue',
    label: 'Berita',
  },
  history: {
    bgColor: 'bg-school-yellow',
    iconColor: 'text-school-blue',
    label: 'Sejarah',
  },
  curriculum: {
    bgColor: 'bg-school-yellow',
    iconColor: 'text-school-blue',
    label: 'Kurikulum',
  },
};

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  variant = 'school',
  className,
  label,
}) => {
  const config = variantConfig[variant];
  const displayLabel = label || config.label;

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col items-center justify-center rounded-2xl',
        config.bgColor,
        className
      )}
      role="img"
      aria-label={`Placeholder ${displayLabel}`}
    >
      {/* Decorative SVG illustration */}
      <svg
        className={cn('w-20 h-20 mb-3', config.iconColor)}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Building/School icon */}
        <path
          d="M40 10L10 30V70H30V50H50V70H70V30L40 10Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Roof */}
        <path
          d="M40 10L5 32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M40 10L75 32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Door */}
        <rect
          x="35"
          y="50"
          width="10"
          height="20"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        {/* Windows */}
        <rect
          x="15"
          y="35"
          width="10"
          height="10"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <rect
          x="55"
          y="35"
          width="10"
          height="10"
          rx="1"
          fill="currentColor"
          fillOpacity="0.3"
        />
        {/* Flag */}
        <path
          d="M40 10V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M40 5H48"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Book icon */}
        <path
          d="M25 60H55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 65H50"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle label */}
      <span className={cn('text-sm font-medium', config.iconColor)}>
        {displayLabel}
      </span>
    </div>
  );
};

export default PlaceholderImage;
