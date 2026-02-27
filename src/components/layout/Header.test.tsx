import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({
    to,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  NavLink: ({
    to,
    children,
    className: _className, // NavLink handles className internally, don't pass to DOM
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  BookOpen: () => <span data-testid="book-open-icon" />,
  Menu: () => <span data-testid="menu-icon" />,
  X: () => <span data-testid="x-icon" />,
}));

// Mock Sheet - always render children
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet">{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button" data-testid="sheet-trigger">
      {children}
    </button>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('Header Component', () => {
  describe('Rendering', () => {
    it('should render the school logo and name', () => {
      render(<Header />);
      const logos = screen.getAllByText('Sekolah Ceria');
      expect(logos.length).toBeGreaterThanOrEqual(1);
      const desktopLogo = logos[0];
      expect(desktopLogo.closest('a')).toHaveAttribute('href', '/');
    });

    it('should render desktop navigation links', () => {
      render(<Header />);
      const desktopNav = screen.getAllByRole('navigation')[0];
      expect(desktopNav).toBeInTheDocument();
      const links = desktopNav.querySelectorAll('a');
      expect(links.length).toBe(6);
    });

    it('should render mobile menu button', () => {
      render(<Header />);
      const menuButton = screen.getByTestId('sheet-trigger');
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Navigation Structure', () => {
    it('should have 6 navigation links', () => {
      render(<Header />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(6);
    });

    it('should include expected hrefs', () => {
      render(<Header />);
      const navLinks = [
        '/',
        '/about',
        '/academics',
        '/admissions',
        '/news',
        '/contact',
      ];
      navLinks.forEach(href => {
        const link = screen
          .getAllByRole('link')
          .find(l => l.getAttribute('href') === href);
        expect(link).toBeTruthy();
      });
    });
  });

  describe('Structure', () => {
    it('should render header element with correct role', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have sticky positioning class', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky');
    });
  });
});
