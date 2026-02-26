import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { PlaceholderImage } from '@/components/PlaceholderImage';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* 500 Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-64 h-48">
                <PlaceholderImage
                  variant="school"
                  className="w-full h-full rounded-2xl opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-4">
                    <AlertTriangle className="w-12 h-12 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
                Terjadi Kesalahan
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Maaf, sedang ada masalah dengan服务器 kami. Tim kami sudah
                bekerja untuk memperbaiki ini. Silakan coba lagi dalam beberapa
                saat.
              </p>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>Tim teknis telah diberitahu</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={handleRetry}
                  size="lg"
                  className="bg-school-blue hover:bg-school-blue/90"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Coba Lagi
                </Button>
                <Button onClick={handleGoHome} size="lg" variant="outline">
                  <Home className="w-5 h-5 mr-2" />
                  Kembali ke Beranda
                </Button>
              </div>

              {/* Contact support */}
              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Jika masalah berlanjut, hubungi kami:
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a
                    href="mailto:info@sekolahceria.sch.id"
                    className="flex items-center gap-2 text-school-blue hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    info@sekolahceria.sch.id
                  </a>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    (021) 123-4567
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-400 rounded-full opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-red-400 rounded-full opacity-30" />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServerErrorPage;
