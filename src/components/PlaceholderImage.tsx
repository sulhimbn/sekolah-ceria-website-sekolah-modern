import React from 'react';
import { cn } from '@/lib/utils';

export type PlaceholderVariant =
  | 'school'
  | 'news'
  | 'history'
  | 'curriculum'
  | 'location';

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
  location: {
    bgColor: 'bg-school-blue/20',
    iconColor: 'text-school-blue',
    label: 'Lokasi',
  },
};

export const PlaceholderImage = React.memo(
  ({ variant = 'school', className, label }: PlaceholderImageProps) => {
    const config = variantConfig[variant];
    const displayLabel = label || config.label;

    const renderSvgContent = () => {
      if (variant === 'location') {
        return (
          <>
            {/* Map/Location pin icon */}
            <path
              d="M40 15C32.817 15 27 20.817 27 28C27 37.5 40 55 40 55C40 55 53 37.5 53 28C53 20.817 47.183 15 40 15Z"
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="40"
              cy="28"
              r="5"
              fill="currentColor"
              fillOpacity="0.5"
            />
            {/* Map grid lines */}
            <path
              d="M15 35H65"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <path
              d="M15 45H65"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <path
              d="M25 20V60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <path
              d="M40 20V60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <path
              d="M55 20V60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          </>
        );
      }

      // Default school/building icon
      return (
        <>
          <path
            d="M40 10L10 30V70H30V50H50V70H70V30L40 10Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
          <rect
            x="35"
            y="50"
            width="10"
            height="20"
            rx="1"
            fill="currentColor"
            fillOpacity="0.3"
          />
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
        </>
      );
    };

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
          {renderSvgContent()}
        </svg>

        {/* Subtle label */}
        <span className={cn('text-sm font-medium', config.iconColor)}>
          {displayLabel}
        </span>
      </div>
    );
  }
);

export default PlaceholderImage;
