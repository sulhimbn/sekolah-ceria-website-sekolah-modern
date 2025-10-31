import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram } from 'lucide-react';
export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-school-blue" />
              <span className="text-2xl font-bold font-display text-gray-900">
                Sekolah Ceria
              </span>
            </Link>
            <p className="text-muted-foreground">
              Membentuk generasi cerdas, kreatif, dan berakhlak mulia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-school-blue transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-school-blue transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-school-blue transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-school-blue transition-colors">Tentang Kami</Link></li>
              <li><Link to="/academics" className="text-muted-foreground hover:text-school-blue transition-colors">Akademik</Link></li>
              <li><Link to="/admissions" className="text-muted-foreground hover:text-school-blue transition-colors">Pendaftaran</Link></li>
              <li><Link to="/news" className="text-muted-foreground hover:text-school-blue transition-colors">Berita</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hubungi Kami</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Jl. Pendidikan No. 123, Jakarta</li>
              <li>Email: info@sekolahceria.sch.id</li>
              <li>Telepon: (021) 123-4567</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Newsletter</h3>
            <p className="mt-4 text-muted-foreground">Dapatkan berita terbaru dari kami.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Email Anda" className="w-full rounded-l-md border-gray-300 px-4 py-2 focus:border-school-blue focus:ring-school-blue" />
              <button type="submit" className="rounded-r-md bg-school-blue px-4 py-2 text-white hover:bg-opacity-90 transition-colors">
                Daftar
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sekolah Ceria. All rights reserved.</p>
          <p className="mt-1 text-sm">Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
};