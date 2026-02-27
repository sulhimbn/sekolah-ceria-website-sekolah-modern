import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NewsCardSkeleton } from '@/components/NewsCardSkeleton';
import {
  ArrowRight,
  AlertCircle,
  Inbox,
  Clock,
  Eye,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { useNewsSearch } from '@/hooks/api';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { calculateReadingTime } from '@/lib/utils';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { Button } from '@/components/ui/button';
const NewsPage: React.FC = () => {
  const {
    articles,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchMode,
  } = useNewsSearch();

  // Use searchResults when there's a query, otherwise use all articles
  const displayedArticles = searchQuery ? searchResults : articles;

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const renderContent = () => {
    if (isLoading || isSearching) {
      return <NewsCardSkeleton count={6} />;
    }

    if (error) {
      return (
        <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-800">
            Terjadi Kesalahan
          </h3>
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            Coba Lagi
          </Button>
        </div>
      );
    }

    if (displayedArticles.length === 0) {
      return (
        <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center bg-muted border rounded-lg p-8">
          <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">
            {searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Berita'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Tidak ada berita yang cocok dengan "${searchQuery}"`
              : 'Saat ini belum ada berita atau acara yang dipublikasikan. Silakan cek kembali nanti.'}
          </p>
        </div>
      );
    }

    return displayedArticles.map((article, index) => (
      <motion.div
        key={article.id}
        id={article.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="aspect-video flex items-center justify-center overflow-hidden">
            <PlaceholderImage
              variant="news"
              className="w-full h-full rounded-lg"
            />
          </div>
          <CardContent className="p-6 flex-grow flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">
              {article.date} • {article.author}
              {FEATURE_FLAGS.FEATURE_READING_TIME && (
                <span className="ml-2">
                  {' '}
                  • <Clock className="inline h-3 w-3 mr-1" />
                  {calculateReadingTime(article.excerpt)}
                </span>
              )}
              {FEATURE_FLAGS.FEATURE_VIEW_COUNT &&
                article.viewCount !== undefined &&
                article.viewCount > 0 && (
                  <span className="ml-2">
                    {' '}
                    • <Eye className="inline h-3 w-3 mr-1" />
                    {article.viewCount.toLocaleString('id-ID')}
                  </span>
                )}
            </p>
            <h3 className="text-xl font-semibold font-display mb-2 flex-grow">
              {article.title}
            </h3>
            <p className="text-muted-foreground mb-4">{article.excerpt}</p>
            <Link
              to={`/news/${article.id}`}
              className="font-semibold text-school-blue group-hover:underline mt-auto"
            >
              Baca Selengkapnya <ArrowRight className="inline h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold font-display text-foreground"
          >
            Berita & Acara
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Ikuti perkembangan, kegiatan, dan pencapaian terbaru dari seluruh
            warga Sekolah Ceria.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-lg bg-muted/50 border-muted focus:border-school-blue focus:ring-school-blue"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {searchMode === 'semantic' && searchQuery && (
              <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>Powered by semantic search</span>
              </div>
            )}
          </motion.div>

          {/* Results count when searching */}
          {searchQuery && !isLoading && !isSearching && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Menampilkan {displayedArticles.length} dari {articles.length}{' '}
              berita
            </motion.p>
          )}
        </div>
      </div>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:col-span-3 gap-8">
            {renderContent()}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NewsPage;
