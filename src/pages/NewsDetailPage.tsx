import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsDetailSkeleton } from '@/components/NewsDetailSkeleton';
import { RelatedArticles } from '@/components/RelatedArticles';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Eye,
} from 'lucide-react';
import { useNewsArticle, useNews } from '@/hooks/api';
import { newsService } from '@/services/news.service';
import type { NewsArticle } from '@shared/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { ShareButtons } from '@/components/ShareButtons';
import { calculateReadingTime } from '@/lib/utils';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

const NewsDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { article, isLoading, error } = useNewsArticle(articleId || '');
  const { articles: allArticles } = useNews();
  const [viewCount, setViewCount] = React.useState<number>(
    article?.viewCount || 0
  );

  // Increment view count when article is loaded
  React.useEffect(() => {
    if (articleId && FEATURE_FLAGS.FEATURE_VIEW_COUNT) {
      newsService
        .incrementViewCount(articleId)
        .then(count => {
          if (count > 0) {
            setViewCount(count);
          }
        })
        .catch(() => {
          // Silently fail - view count is non-critical
        });
    }
  }, [articleId]);

  // Get related articles if feature is enabled and we have the article
  const relatedArticles = React.useMemo(() => {
    if (
      !FEATURE_FLAGS.FEATURE_RELATED_ARTICLES ||
      !article ||
      !allArticles.length
    ) {
      return [];
    }
    return newsService.getRelatedArticles(article, allArticles);
  }, [article, allArticles]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          <NewsDetailSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display text-red-800">
            Terjadi Kesalahan
          </h2>
          <p className="text-xl text-red-600 mt-2">{error}</p>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/news">Kembali ke Daftar Berita</Link>
          </Button>
        </div>
      );
    }

    if (!article) {
      return null;
    }

    return (
      <>
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center space-x-6 text-muted-foreground mb-8">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{article.author}</span>
            </div>
            {FEATURE_FLAGS.FEATURE_READING_TIME && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{calculateReadingTime(article.excerpt)}</span>
              </div>
            )}
            {FEATURE_FLAGS.FEATURE_VIEW_COUNT && (
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{viewCount.toLocaleString('id-ID')} dilihat</span>
              </div>
            )}
            <div className="ml-auto">
              <ShareButtons
                title={article.title}
                description={article.excerpt}
              />
            </div>
          </div>
          <div className="aspect-video rounded-lg mb-8 flex items-center justify-center overflow-hidden">
            <PlaceholderImage
              variant="news"
              className="w-full h-full rounded-lg"
              label="Berita Detail"
            />
          </div>
          <div className="prose prose-lg max-w-none text-foreground">
            <p>{article.excerpt}</p>
            <p>
              Ini adalah konten lengkap dari artikel berita. Karena kita belum
              memiliki sistem manajemen konten (CMS) yang sebenarnya, kita akan
              menggunakan kembali kutipan untuk mensimulasikan paragraf yang
              lebih panjang. Dalam implementasi nyata, bagian ini akan diisi
              dengan konten artikel yang sebenarnya dari backend.
            </p>
            <p>{article.excerpt}</p>
          </div>
        </motion.article>

        {/* Related Articles Section */}
        <RelatedArticles articles={relatedArticles} />
      </>
    );
  };

  return (
    <MainLayout>
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Button asChild variant="ghost">
              <Link
                to="/news"
                className="text-school-blue hover:text-school-blue/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Semua Berita
              </Link>
            </Button>
          </div>
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default NewsDetailPage;
