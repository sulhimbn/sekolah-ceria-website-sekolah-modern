import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock } from 'lucide-react';
import type { NewsArticle } from '@shared/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { calculateReadingTime } from '@/lib/utils';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
}) => {
  // Don't render if feature is disabled or no articles
  if (!FEATURE_FLAGS.FEATURE_RELATED_ARTICLES || articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold font-display mb-8"
      >
        Artikel Terkait
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-lg">
              <div className="aspect-video flex items-center justify-center overflow-hidden">
                <PlaceholderImage variant="news" className="w-full h-full" />
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground mb-2">
                  {article.date} • {article.author}
                  {FEATURE_FLAGS.FEATURE_READING_TIME && (
                    <span className="ml-2">
                      {' '}
                      • <Clock className="inline h-3 w-3 mr-1" />
                      {calculateReadingTime(article.excerpt)}
                    </span>
                  )}
                </p>
                <h3 className="text-lg font-semibold font-display mb-2 flex-grow line-clamp-2">
                  {article.title}
                </h3>
                <Link
                  to={`/news/${article.id}`}
                  className="inline-flex items-center text-school-blue hover:text-school-blue/80 font-medium mt-auto"
                >
                  Baca Selengkapnya
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
