import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

afterEach(() => {
  cleanup();
});

describe('Card Component', () => {
  describe('Card', () => {
    it('should render a card element', () => {
      render(<Card>Card Content</Card>);
      const card = screen.getByText('Card Content');
      expect(card).toBeInTheDocument();
    });

    it('should have card styling classes', () => {
      render(<Card>Styled Card</Card>);
      const card = screen.getByText('Styled Card');
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('border');
    });

    it('should accept custom className', () => {
      render(<Card className="custom-class">Custom</Card>);
      const card = screen.getByText('Custom');
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref', () => {
      const ref = { current: null };
      render(<Card ref={ref}>Ref Test</Card>);
      expect(ref.current).not.toBeNull();
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should have header styling classes', () => {
      render(<CardHeader>Header</CardHeader>);
      const header = screen.getByText('Header');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
    });
  });

  describe('CardTitle', () => {
    it('should render card title', () => {
      <Card>
        <CardTitle>My Title</CardTitle>
      </Card>;
      render(<CardTitle>My Title</CardTitle>);
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should have title styling classes', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>Description text</CardDescription>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('should have description styling classes', () => {
      render(<CardDescription>Desc</CardDescription>);
      const desc = screen.getByText('Desc');
      expect(desc).toHaveClass('text-sm');
      expect(desc).toHaveClass('text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Content here</CardContent>);
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });

    it('should have content styling classes', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('pt-0');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should have footer styling classes', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('items-center');
    });
  });

  describe('Integration', () => {
    it('should render full card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <span>Footer</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});
