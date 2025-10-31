import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/academics', label: 'Akademik' },
  { href: '/admissions', label: 'Pendaftaran' },
  { href: '/news', label: 'Berita' },
  { href: '/contact', label: 'Kontak' },
];
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const NavItems = ({ className }: { className?: string }) => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            cn(
              "text-lg font-medium transition-colors hover:text-school-blue",
              isActive ? "text-school-blue" : "text-gray-700",
              className
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-school-blue" />
            <span className="text-2xl font-bold font-display text-gray-900">
              Sekolah Ceria
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavItems />
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <BookOpen className="h-7 w-7 text-school-blue" />
                      <span className="text-xl font-bold font-display text-gray-900">
                        Sekolah Ceria
                      </span>
                    </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-6 p-4">
                  <NavItems className="text-xl" />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};