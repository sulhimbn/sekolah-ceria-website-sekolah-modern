import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/sonner';
type MainLayoutProps = {
  children: React.ReactNode;
};
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-school-bg text-foreground">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};
