import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';
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

interface NavItemsProps {
  className?: string;
  onNavigate?: () => void;
}

const NavItems = React.memo(({ className, onNavigate }: NavItemsProps) => (
  <>
    {navLinks.map(link => (
      <NavLink
        key={link.href}
        to={link.href}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'text-lg font-medium transition-colors hover:text-school-blue',
            isActive ? 'text-school-blue' : 'text-muted-foreground',
            className
          )
        }
      >
        {link.label}
      </NavLink>
    ))}
  </>
));

NavItems.displayName = 'NavItems';

// Reusable trigger button styles - avoids nested button issue with SheetTrigger + Button
const triggerButtonStyles = cn(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'h-9 w-9'
);

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-school-blue" />
            <span className="text-2xl font-bold font-display text-foreground">
              Sekolah Ceria
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavItems onNavigate={handleNavigate} />
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <span className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </span>
              </SheetTrigger>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs">
                <div className="flex justify-between items-center p-4 border-b">
                  <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-7 w-7 text-school-blue" />
                    <span className="text-xl font-bold font-display text-foreground">
                      Sekolah Ceria
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col space-y-6 p-4">
                  <NavItems className="text-xl" onNavigate={handleNavigate} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
