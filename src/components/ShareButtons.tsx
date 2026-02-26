import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Copy,
  Check,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { isFeatureEnabled } from '@/lib/feature-flags';

interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
}

export const ShareButtons = React.memo(
  ({ title, url, description = '' }: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false);

    // Use current location if no URL provided
    const shareUrl =
      url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    const shareOptions = [
      {
        name: 'WhatsApp',
        icon: MessageCircle,
        href: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
        color: 'hover:text-green-500',
        label: 'Bagikan ke WhatsApp',
      },
      {
        name: 'Facebook',
        icon: Facebook,
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        color: 'hover:text-blue-600',
        label: 'Bagikan ke Facebook',
      },
      {
        name: 'Twitter',
        icon: Twitter,
        href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        color: 'hover:text-black',
        label: 'Bagikan ke Twitter/X',
      },
    ];

    // Don't render if feature flag is disabled
    if (!isFeatureEnabled('FEATURE_SOCIAL_SHARING')) {
      return null;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Bagikan
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end">
          <div className="flex flex-col gap-2">
            {shareOptions.map(option => (
              <a
                key={option.name}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 ${option.color}`}
                aria-label={option.label}
              >
                <option.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{option.name}</span>
              </a>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="justify-start gap-3 text-gray-700 hover:text-gray-900"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  <span className="text-sm font-medium">Salin Tautan</span>
                </>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
