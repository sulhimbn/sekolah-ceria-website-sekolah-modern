import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the heavy components that cause issues in test environment
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactElement }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

vi.mock('@/components/PlaceholderImage', () => ({
  PlaceholderImage: () => <div data-testid="placeholder" />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactElement }) => (
      <div>{children}</div>
    ),
  },
}));

// Import after mocking
import NotFoundPage from '@/pages/NotFoundPage';

afterEach(() => {
  cleanup();
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {component}
    </BrowserRouter>
  );
};

describe('NotFoundPage', () => {
  describe('Rendering', () => {
    it('should render the 404 page without crashing', () => {
      expect(() => renderWithRouter(<NotFoundPage />)).not.toThrow();
    });

    it('should display the page title', () => {
      renderWithRouter(<NotFoundPage />);
      const title = screen.getByText(/Halaman Tidak Ditemukan/i);
      expect(title).toBeInTheDocument();
    });

    it('should display the error message', () => {
      renderWithRouter(<NotFoundPage />);
      const message = screen.getByText(
        /Maaf, halaman yang Anda cari tidak ada/i
      );
      expect(message).toBeInTheDocument();
    });

    it('should display the home link text', () => {
      renderWithRouter(<NotFoundPage />);
      const homeLink = screen.getByText(/Kembali ke Beranda/i);
      expect(homeLink).toBeInTheDocument();
    });

    it('should display the about link text', () => {
      renderWithRouter(<NotFoundPage />);
      const aboutLink = screen.getByText(/Pelajari Tentang Kami/i);
      expect(aboutLink).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have a link to home page', () => {
      renderWithRouter(<NotFoundPage />);
      const homeLink = screen.getByRole('link', {
        name: /kembali ke beranda/i,
      });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have a link to about page', () => {
      renderWithRouter(<NotFoundPage />);
      const aboutLink = screen.getByRole('link', {
        name: /pelajari tentang kami/i,
      });
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should have a link to news page', () => {
      renderWithRouter(<NotFoundPage />);
      const newsLink = screen.getByRole('link', { name: /berita/i });
      expect(newsLink).toHaveAttribute('href', '/news');
    });

    it('should have a link to academics page', () => {
      renderWithRouter(<NotFoundPage />);
      const academicsLink = screen.getByRole('link', { name: /akademik/i });
      expect(academicsLink).toHaveAttribute('href', '/academics');
    });

    it('should have a link to contact page', () => {
      renderWithRouter(<NotFoundPage />);
      const contactLink = screen.getByRole('link', { name: /kontak/i });
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should have a link to admissions page', () => {
      renderWithRouter(<NotFoundPage />);
      const admissionsLink = screen.getByRole('link', { name: /pendaftaran/i });
      expect(admissionsLink).toHaveAttribute('href', '/admissions');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithRouter(<NotFoundPage />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have multiple navigation links', () => {
      renderWithRouter(<NotFoundPage />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
