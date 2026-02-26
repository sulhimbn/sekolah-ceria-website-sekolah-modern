import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Target, Eye, Heart } from 'lucide-react';
import { PlaceholderImage } from '@/components/PlaceholderImage';

const teachers = [
  {
    name: 'Dr. Indah Permata, M.Pd.',
    role: 'Kepala Sekolah',
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Bambang Wijoyo, S.Pd.',
    role: 'Guru Matematika',
    image: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Siti Aminah, S.S.',
    role: 'Guru Bahasa Inggris',
    image: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Agus Setiawan, S.Or.',
    role: 'Guru Olahraga',
    image: 'https://i.pravatar.cc/150?img=4',
  },
];

const AboutPage: React.FC = () => {
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
            Tentang Sekolah Ceria
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Mengenal lebih dekat sejarah, visi, misi, dan para pendidik
            inspiratif di balik kesuksesan kami.
          </motion.p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-video rounded-3xl p-1 shadow-lg">
                <PlaceholderImage
                  variant="history"
                  className="w-full h-full rounded-2xl"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold font-display text-foreground">
                Sejarah Kami
              </h2>
              <p className="text-lg text-muted-foreground">
                Didirikan pada tahun 2005, Sekolah Ceria berawal dari sebuah
                mimpi untuk menciptakan lingkungan belajar yang tidak hanya
                unggul secara akademis, tetapi juga menumbuhkan kreativitas dan
                karakter. Selama lebih dari 15 tahun, kami telah berkomitmen
                untuk memberikan pendidikan terbaik bagi generasi penerus
                bangsa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mx-auto bg-school-yellow p-4 rounded-full w-fit">
                    <Eye className="h-8 w-8 text-school-blue" />
                  </div>
                  <CardTitle className="pt-4 font-display text-3xl">
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Menjadi lembaga pendidikan terdepan yang menghasilkan
                    individu cerdas, kreatif, berkarakter, dan siap menghadapi
                    tantangan global.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mx-auto bg-school-yellow p-4 rounded-full w-fit">
                    <Target className="h-8 w-8 text-school-blue" />
                  </div>
                  <CardTitle className="pt-4 font-display text-3xl">
                    Misi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Menyelenggarakan pendidikan berkualitas, mengembangkan bakat
                    siswa, menanamkan nilai-nilai luhur, dan membangun kemitraan
                    dengan orang tua.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mx-auto bg-school-yellow p-4 rounded-full w-fit">
                    <Heart className="h-8 w-8 text-school-blue" />
                  </div>
                  <CardTitle className="pt-4 font-display text-3xl">
                    Nilai-Nilai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integritas, Kreativitas, KepCartney, Keunggulan, dan
                    Kolaborasi menjadi pilar utama dalam setiap aspek kegiatan
                    sekolah kami.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-foreground">
              Tim Pengajar Kami
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Bertemu dengan para pendidik profesional dan berdedikasi yang siap
              membimbing putra-putri Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback>
                    {teacher.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">
                  {teacher.name}
                </h3>
                <p className="text-school-blue">{teacher.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
