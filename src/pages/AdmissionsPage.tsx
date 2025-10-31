import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UserCheck, MessageCircle, Calendar } from 'lucide-react';
const admissionSteps = [
  { icon: FileText, title: '1. Pendaftaran Online', description: 'Isi formulir pendaftaran secara online melalui website kami dan unggah dokumen yang diperlukan.' },
  { icon: UserCheck, title: '2. Seleksi & Observasi', description: 'Calon siswa akan mengikuti tes potensi akademik dan observasi untuk mengetahui minat dan bakat.' },
  { icon: MessageCircle, title: '3. Wawancara Orang Tua', description: 'Sesi diskusi antara pihak sekolah dan orang tua untuk menyamakan visi pendidikan anak.' },
  { icon: Calendar, title: '4. Pengumuman & Daftar Ulang', description: 'Hasil seleksi akan diumumkan sesuai jadwal, dilanjutkan dengan proses daftar ulang.' },
];
const AdmissionsPage: React.FC = () => {
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
            Pendaftaran Siswa Baru
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Bergabunglah dengan keluarga besar Sekolah Ceria. Berikut adalah panduan lengkap proses penerimaan siswa baru.
          </motion.p>
        </div>
      </div>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold font-display text-gray-900">Alur Pendaftaran</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-6rem)] bg-gray-200"></div>
            <div className="space-y-12">
              {admissionSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="md:w-1/2 flex justify-center md:justify-end md:pr-16">
                    <Card className={`w-full max-w-md ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="bg-school-yellow p-3 rounded-full">
                            <step.icon className="h-6 w-6 text-school-blue" />
                          </div>
                          <CardTitle className="font-display text-2xl">{step.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:block w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold font-display text-gray-900">Jadwal Penting</h3>
              <ul className="mt-6 space-y-4 text-lg">
                <li className="flex items-start"><Calendar className="h-6 w-6 text-school-blue mt-1 mr-3 flex-shrink-0" /> <span><strong>Pendaftaran Online:</strong> 1 Jan - 28 Feb</span></li>
                <li className="flex items-start"><Calendar className="h-6 w-6 text-school-blue mt-1 mr-3 flex-shrink-0" /> <span><strong>Seleksi & Observasi:</strong> 5 Mar</span></li>
                <li className="flex items-start"><Calendar className="h-6 w-6 text-school-blue mt-1 mr-3 flex-shrink-0" /> <span><strong>Pengumuman:</strong> 15 Mar</span></li>
                <li className="flex items-start"><Calendar className="h-6 w-6 text-school-blue mt-1 mr-3 flex-shrink-0" /> <span><strong>Daftar Ulang:</strong> 15 - 20 Mar</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-3xl font-bold font-display text-gray-900">Biaya Pendidikan</h3>
              <p className="mt-6 text-lg text-muted-foreground">
                Untuk informasi detail mengenai biaya pendaftaran, SPP, dan biaya lainnya, silakan unduh brosur kami atau hubungi bagian administrasi.
              </p>
              <div className="mt-6 flex space-x-4">
                <Button size="lg" className="bg-school-blue hover:bg-school-blue/90">Unduh Brosur</Button>
                <Button size="lg" variant="outline">Hubungi Kami</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default AdmissionsPage;