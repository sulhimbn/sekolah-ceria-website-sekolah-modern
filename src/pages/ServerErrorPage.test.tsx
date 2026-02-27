import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
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
import ServerErrorPage from '@/pages/ServerErrorPage';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
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

describe('ServerErrorPage', () => {
  describe('Rendering', () => {
    it('should render the 500 page without crashing', () => {
      expect(() => renderWithRouter(<ServerErrorPage />)).not.toThrow();
    });

    it('should display the page title', () => {
      renderWithRouter(<ServerErrorPage />);
      const title = screen.getByText(/Terjadi Kesalahan/i);
      expect(title).toBeInTheDocument();
    });

    it('should display the error message', () => {
      renderWithRouter(<ServerErrorPage />);
      const message = screen.getByText(/Maaf, sedang ada masalah/i);
      expect(message).toBeInTheDocument();
    });

    it('should display the technical team notification', () => {
      renderWithRouter(<ServerErrorPage />);
      const notification = screen.getByText(/Tim teknis telah diberitahu/i);
      expect(notification).toBeInTheDocument();
    });

    it('should display the retry button', () => {
      renderWithRouter(<ServerErrorPage />);
      const retryButton = screen.getAllByText(/Coba Lagi/i)[1];
      expect(retryButton).toBeInTheDocument();
    });

    it('should display the home button', () => {
      renderWithRouter(<ServerErrorPage />);
      const homeButton = screen.getByText(/Kembali ke Beranda/i);
      expect(homeButton).toBeInTheDocument();
    });

    it('should display contact support section', () => {
      renderWithRouter(<ServerErrorPage />);
      const contactSection = screen.getByText(
        /Jika masalah berlanjut, hubungi kami:/i
      );
      expect(contactSection).toBeInTheDocument();
    });

    it('should display the support email', () => {
      renderWithRouter(<ServerErrorPage />);
      const email = screen.getAllByText(/info@sekolahceria.sch.id/i)[0];
      expect(email).toBeInTheDocument();
    });

    it('should display the support phone', () => {
      renderWithRouter(<ServerErrorPage />);
      const phone = screen.getAllByText(/\(021\) 123-4567/i)[0];
      expect(phone).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should reload page when retry button is clicked', () => {
      const reloadSpy = vi
        .spyOn(window.location, 'reload')
        .mockImplementation(() => {});
      renderWithRouter(<ServerErrorPage />);

      const retryButton = screen.getAllByText(/Coba Lagi/i)[1];
      fireEvent.click(retryButton);

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithRouter(<ServerErrorPage />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have multiple button elements', () => {
      renderWithRouter(<ServerErrorPage />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(2);
    });

    it('should have a mailto link for support', () => {
      renderWithRouter(<ServerErrorPage />);
      const emailLink = screen.getAllByRole('link', {
        name: /info@sekolahceria.sch.id/i,
      })[0];
      expect(emailLink).toHaveAttribute(
        'href',
        'mailto:info@sekolahceria.sch.id'
      );
    });
  });
});
