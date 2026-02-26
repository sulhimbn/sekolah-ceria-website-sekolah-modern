import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

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
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  BookOpen: () => <span data-testid="book-open-icon" />,
  Facebook: () => <span data-testid="facebook-icon" />,
  Twitter: () => <span data-testid="twitter-icon" />,
  Instagram: () => <span data-testid="instagram-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
  CheckCircle: () => <span data-testid="check-icon" />,
  XCircle: () => <span data-testid="x-icon" />,
}));

afterEach(() => {
  cleanup();
});

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render the school logo and name', () => {
      render(<Footer />);
      const logo = screen.getByText('Sekolah Ceria');
      expect(logo).toBeInTheDocument();
    });

    it('should render school description', () => {
      render(<Footer />);
      const description = screen.getByText(/Membentuk generasi/);
      expect(description).toBeInTheDocument();
    });

    it('should render contact information', () => {
      render(<Footer />);
      expect(screen.getByText(/Jl. Pendidikan No. 123/)).toBeInTheDocument();
      expect(screen.getByText(/info@sekolahceria.sch.id/)).toBeInTheDocument();
      expect(screen.getByText(/\(021\) 123-4567/)).toBeInTheDocument();
    });
  });

  describe('Quick Links', () => {
    it('should render quick links section', () => {
      render(<Footer />);
      expect(screen.getByText('Tautan Cepat')).toBeInTheDocument();
      expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
      expect(screen.getByText('Akademik')).toBeInTheDocument();
      expect(screen.getByText('Pendaftaran')).toBeInTheDocument();
      expect(screen.getByText('Berita')).toBeInTheDocument();
    });

    it('should have correct href for quick links', () => {
      render(<Footer />);
      expect(screen.getByText('Tentang Kami')).toHaveAttribute(
        'href',
        '/about'
      );
      expect(screen.getByText('Akademik')).toHaveAttribute(
        'href',
        '/academics'
      );
      expect(screen.getByText('Pendaftaran')).toHaveAttribute(
        'href',
        '/admissions'
      );
      expect(screen.getByText('Berita')).toHaveAttribute('href', '/news');
    });
  });

  describe('Social Media Links', () => {
    it('should render social media links', () => {
      render(<Footer />);
      const facebookLink = screen.getByRole('link', { name: /facebook/i });
      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      const instagramLink = screen.getByRole('link', { name: /instagram/i });

      expect(facebookLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
      expect(instagramLink).toBeInTheDocument();

      // Verify security attributes are present
      expect(facebookLink).toHaveAttribute('target', '_blank');
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Newsletter Subscription', () => {
    it('should render newsletter form', () => {
      render(<Footer />);
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should have email input with correct type', () => {
      render(<Footer />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have required attribute on email input', () => {
      render(<Footer />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeRequired();
    });

    it('should have submit button with type submit', () => {
      render(<Footer />);
      const submitButton = screen.getByRole('button', { name: /subscribe/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Copyright', () => {
    it('should render copyright text with current year', () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });

    it('should render footer element', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });
});
