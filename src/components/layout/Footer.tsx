import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal berlangganan');
      }

      setMessage({
        type: 'success',
        text: data.message || 'Terima kasih telah berlangganan!',
      });
      setEmail('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Gagal berlangganan. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <a
                href="https://facebook.com/sekolahceria"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-school-blue transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/sekolahceria"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-school-blue transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/sekolahceria"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-school-blue transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tautan Cepat
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-school-blue transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/academics"
                  className="text-muted-foreground hover:text-school-blue transition-colors"
                >
                  Akademik
                </Link>
              </li>
              <li>
                <Link
                  to="/admissions"
                  className="text-muted-foreground hover:text-school-blue transition-colors"
                >
                  Pendaftaran
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-muted-foreground hover:text-school-blue transition-colors"
                >
                  Berita
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Hubungi Kami
            </h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>Jl. Pendidikan No. 123, Jakarta</li>
              <li>Email: info@sekolahceria.sch.id</li>
              <li>Telepon: (021) 123-4567</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Newsletter</h3>
            <p className="mt-4 text-muted-foreground">
              Dapatkan berita terbaru dari kami.
            </p>
            <form
              className="mt-4 flex"
              onSubmit={handleSubmit}
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email Anda
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email Anda"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-l-md border-gray-300 px-4 py-2 focus:border-school-blue focus:ring-school-blue disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-r-md bg-school-blue px-4 py-2 text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Subscribe to newsletter"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Daftar'
                )}
              </button>
            </form>
            {message && (
              <div
                className={`mt-3 flex items-center gap-2 text-sm ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {message.text}
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Sekolah Ceria. All rights
            reserved.
          </p>
          <p className="mt-1 text-sm">Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
};
