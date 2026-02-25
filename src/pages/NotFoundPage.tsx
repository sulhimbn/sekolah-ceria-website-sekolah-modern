import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  FileQuestion,
  Newspaper,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { PlaceholderImage } from '@/components/PlaceholderImage';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-school-blue/5 to-school-yellow/5 dark:from-school-blue/10 dark:to-school-yellow/10" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* 404 Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-64 h-48">
                <PlaceholderImage
                  variant="education"
                  className="w-full h-full rounded-2xl opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-school-blue">
                    404
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900">
                Halaman Tidak Ditemukan
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                Mungkin Anda ingin melihat halaman lainnya?
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-school-blue hover:bg-school-blue/90"
                >
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2" />
                    Kembali ke Beranda
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Pelajari Tentang Kami
                  </Link>
                </Button>
              </div>

              {/* Quick links */}
              <div className="pt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  atau pilih halaman lain:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/news" className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4" />
                      Berita
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/academics" className="flex items-center gap-2">
                      <FileQuestion className="w-4 h-4" />
                      Akademik
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/contact" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Kontak
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admissions" className="flex items-center gap-2">
                      <FileQuestion className="w-4 h-4" />
                      Pendaftaran
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-school-yellow rounded-full opacity-50" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-school-blue rounded-full opacity-30" />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
