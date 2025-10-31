import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { MOCK_NEWS_ARTICLES } from '@/lib/mock-data';
const NewsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold font-display text-gray-900"
          >
            Berita & Acara
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Ikuti perkembangan, kegiatan, dan pencapaian terbaru dari seluruh warga Sekolah Ceria.
          </motion.p>
        </div>
      </div>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_NEWS_ARTICLES.map((article, index) => (
              <motion.div
                key={article.id}
                id={article.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-video bg-school-blue/20 flex items-center justify-center overflow-hidden">
                    <p className="text-gray-500">[Gambar Berita]</p>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <p className="text-sm text-muted-foreground mb-2">{article.date} • {article.author}</p>
                    <h3 className="text-xl font-semibold font-display mb-2 flex-grow">{article.title}</h3>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <Link to={`#`} className="font-semibold text-school-blue group-hover:underline mt-auto">
                      Baca Selengkapnya <ArrowRight className="inline h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default NewsPage;