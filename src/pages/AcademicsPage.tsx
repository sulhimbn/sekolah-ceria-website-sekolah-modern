import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookCopy, Palette, Dumbbell, Music, Code } from 'lucide-react';
import { PlaceholderImage } from '@/components/PlaceholderImage';

const extracurriculars = [
  { icon: Dumbbell, name: 'Klub Olahraga', description: 'Sepak bola, basket, bulu tangkis, dan renang.' },
  { icon: Palette, name: 'Seni & Kerajinan', description: 'Menggambar, melukis, dan membuat kerajinan tangan.' },
  { icon: Music, name: 'Musik & Tari', description: 'Paduan suara, band, angklung, dan tari tradisional.' },
  { icon: Code, name: 'Klub STEM', description: 'Robotika, coding, dan eksperimen sains yang menyenangkan.' },
];

const AcademicsPage: React.FC = () => {
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
            Program Akademik
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Menjelajahi kurikulum inovatif dan kegiatan ekstrakurikuler yang memperkaya pengalaman belajar siswa.
          </motion.p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold font-display text-gray-900">Kurikulum Kami</h2>
              <p className="text-lg text-muted-foreground">
                Sekolah Ceria mengimplementasikan Kurikulum Merdeka yang diperkaya dengan program-programunggulan sekolah. Pendekatan kami berpusat pada siswa, mendorong pemikiran kritis, kolaborasi, dan kreativitas.
              </p>
              <div className="aspect-video rounded-3xl p-1 shadow-lg mt-8">
                <PlaceholderImage variant="curriculum" className="w-full h-full rounded-2xl" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold">Sekolah Dasar (Kelas 1-6)</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Fokus pada pembangunan fondasi literasi, numerasi, dan karakter. Pembelajaran tematik yang menyenangkan dan terintegrasi dengan kegiatan praktik langsung.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl font-semibold">Sekolah Menengah Pertama (Kelas 7-9)</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Pendalaman materi pelajaran inti, pengenalan proyek berbasis masalah, dan pengembangan keterampilan abad ke-21. Siswa didorong untuk eksplorasi minat dan bakat.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xl font-semibold">Program Bahasa</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Program intensif Bahasa Inggris dan pengenalan bahasa asing lainnya seperti Mandarin dan Jepang untuk mempersiapkan siswa menjadi warga dunia.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-xl font-semibold">Pendidikan Karakter</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Terintegrasi dalam semua mata pelajaran dan kegiatan sekolah, berfokus pada nilai-nilai integritas, tanggung jawab, dan empati.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-gray-900">Kegiatan Ekstrakurikuler</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              kami percaya belajar tidak hanya terjadi di dalam kelas. Siswa dapat menyalurkan energi dan kreativitas mereka melalui berbagai pilihan ekstrakurikuler.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {extracurriculars.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-school-yellow p-4 rounded-full w-fit">
                      <item.icon className="h-8 w-8 text-school-blue" />
                    </div>
                    <CardTitle className="pt-4 font-display text-2xl">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
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

export default AcademicsPage;
