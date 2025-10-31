import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Users, Award, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MainLayout } from '@/components/layout/MainLayout';
import { api } from '@/lib/api-client';
import type { NewsArticle } from '@shared/types';
const HomePage: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await api<{ items: NewsArticle[] }>('/api/news');
        setLatestNews(response.items.slice(0, 3));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat berita.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);
  const testimonials = [
    {
      quote: "Sekolah Ceria memberikan fondasi pendidikan yang kuat bagi anak saya. Guru-gurunya sangat berdedikasi!",
      author: "Budi Santoso",
      role: "Orang Tua Siswa",
    },
    {
      quote: "Saya senang belajar di sini. Banyak kegiatan ekstrakurikuler yang seru dan teman-teman yang baik.",
      author: "Siti Aisyah",
      role: "Siswa Kelas 5",
    },
    {
      quote: "Lingkungan belajarnya sangat mendukung. Fasilitasnya lengkap dan modern.",
      author: "Rina Wijaya",
      role: "Alumni",
    },
  ];
  const NewsSectionContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-6 flex-grow flex flex-col">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-5 w-1/3 mt-auto" />
          </CardContent>
        </Card>
      ));
    }
    if (error) {
      return (
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-800">Gagal Memuat Berita</h3>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }
    return latestNews.map((article, index) => (
      <motion.div
        key={article.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="overflow-hidden h-full flex flex-col group">
          <div className="aspect-video bg-school-blue/20 flex items-center justify-center overflow-hidden">
            <p className="text-gray-500">[Gambar Berita]</p>
          </div>
          <CardContent className="p-6 flex-grow flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">{article.date} • {article.author}</p>
            <h3 className="text-xl font-semibold font-display mb-2 flex-grow">{article.title}</h3>
            <p className="text-muted-foreground mb-4">{article.excerpt}</p>
            <Link to={`/news/${article.id}`} className="font-semibold text-school-blue group-hover:underline">
              Baca Selengkapnya <ArrowRight className="inline h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold font-display text-gray-900 leading-tight">
                Selamat Datang di <span className="text-school-blue">Sekolah Ceria</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Membentuk Masa Depan Cerah Melalui Pendidikan Berkualitas dan Lingkungan yang Menyenangkan.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-school-blue hover:bg-school-blue/90">
                  <Link to="/admissions">Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-video bg-school-yellow rounded-3xl p-4 shadow-lg">
                 <div className="w-full h-full bg-white/50 rounded-2xl flex items-center justify-center">
                    <p className="text-2xl font-semibold text-gray-600">[Ilustrasi Sekolah Ceria]</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Featured Programs Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-gray-900">Program Unggulan Kami</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Kami menawarkan program pendidikan holistik yang dirancang untuk mengembangkan potensi setiap siswa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Book, title: "Kurikulum Merdeka", desc: "Mengadopsi kurikulum terbaru untuk pembelajaran yang relevan dan fleksibel." },
              { icon: Users, title: "Pengembangan Karakter", desc: "Program khusus untuk membangun integritas, empati, dan kepemimpinan." },
              { icon: Award, title: "Ekstrakurikuler Beragam", desc: "Dari olahraga hingga seni, kami menyediakan wadah untuk setiap minat dan bakat." },
            ].map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-school-yellow p-4 rounded-full w-fit">
                      <program.icon className="h-8 w-8 text-school-blue" />
                    </div>
                    <CardTitle className="pt-4 font-display text-2xl">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{program.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Latest News Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-gray-900">Berita & Acara Terbaru</h2>
            <p className="text-lg text-muted-foreground">Ikuti terus kegiatan dan pencapaian terbaru dari Sekolah Ceria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NewsSectionContent />
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/news">Lihat Semua Berita</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-gray-900">Apa Kata Mereka?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <MessageSquare className="h-8 w-8 text-school-yellow mb-4" />
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
export default HomePage;