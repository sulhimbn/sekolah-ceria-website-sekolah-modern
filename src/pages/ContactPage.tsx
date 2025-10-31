import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus diisi, minimal 2 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  message: z.string().min(10, { message: 'Pesan harus diisi, minimal 10 karakter.' }),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;
const ContactPage: React.FC = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      toast.success('Pesan Terkirim!', {
        description: 'Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.',
      });
      form.reset();
    } catch (error) {
      toast.error('Gagal Mengirim Pesan', {
        description: error instanceof Error ? error.message : 'Silakan coba lagi nanti.',
      });
    }
  };
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="text-lg p-4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Alamat Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} className="text-lg p-4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Pesan Anda</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tuliskan pesan Anda di sini..." rows={5} {...field} className="text-lg p-4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full bg-school-blue hover:bg-school-blue/90 text-lg py-6" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Pesan'
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default ContactPage;