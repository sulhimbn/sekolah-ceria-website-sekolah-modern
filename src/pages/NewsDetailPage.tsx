import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, User, ArrowLeft } from 'lucide-react';
import { useNewsArticle } from '@/hooks/api';
import type { NewsArticle } from '@shared/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { ShareButtons } from '@/components/ShareButtons';

const NewsDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { article, isLoading, error } = useNewsArticle(articleId || '');

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto">
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
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4 leading-tight">
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
          <div className="ml-auto">
            <ShareButtons title={article.title} description={article.excerpt} />
          </div>
        </div>
        <div className="aspect-video rounded-lg mb-8 flex items-center justify-center overflow-hidden">
          <PlaceholderImage
            variant="news"
            className="w-full h-full rounded-lg"
            label="Berita Detail"
          />
        </div>
        <div className="prose prose-lg max-w-none text-gray-800">
          <p>{article.excerpt}</p>
          <p>
            Ini adalah konten lengkap dari artikel berita. Karena kita belum
            memiliki sistem manajemen konten (CMS) yang sebenarnya, kita akan
            menggunakan kembali kutipan untuk mensimulasikan paragraf yang lebih
            panjang. Dalam implementasi nyata, bagian ini akan diisi dengan
            konten artikel yang sebenarnya dari backend.
          </p>
          <p>{article.excerpt}</p>
        </div>
      </motion.article>
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
