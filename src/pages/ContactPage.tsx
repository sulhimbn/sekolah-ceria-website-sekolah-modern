import React from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin } from 'lucide-react';
const ContactPage: React.FC = () => {
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
            Hubungi Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Kami senang mendengar dari Anda. Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
          </motion.p>
        </div>
      </div>
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold font-display text-gray-900">Informasi Kontak</h2>
                <div className="mt-6 space-y-4 text-lg text-muted-foreground">
                  <p className="flex items-center"><MapPin className="h-6 w-6 mr-3 text-school-blue" /> Jl. Pendidikan No. 123, Jakarta, Indonesia</p>
                  <p className="flex items-center"><Mail className="h-6 w-6 mr-3 text-school-blue" /> info@sekolahceria.sch.id</p>
                  <p className="flex items-center"><Phone className="h-6 w-6 mr-3 text-school-blue" /> (021) 123-4567</p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-gray-900">Jam Operasional</h3>
                <div className="mt-4 text-lg text-muted-foreground">
                  <p>Senin - Jumat: 07:00 - 16:00 WIB</p>
                  <p>Sabtu - Minggu: Tutup</p>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg">
                {/* Placeholder for map */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">[Peta Lokasi Interaktif]</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">Kirim Pesan</h2>
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-lg">Nama Lengkap</Label>
                    <Input id="name" type="text" placeholder="John Doe" className="mt-2 text-lg p-4" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg">Alamat Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" className="mt-2 text-lg p-4" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-lg">Pesan Anda</Label>
                    <Textarea id="message" placeholder="Tuliskan pesan Anda di sini..." rows={5} className="mt-2 text-lg p-4" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-school-blue hover:bg-school-blue/90 text-lg py-6">
                    Kirim Pesan
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default ContactPage;