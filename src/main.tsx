import '@/i18n';
import '@/lib/errorReporter';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import '@/index.css';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const AcademicsPage = lazy(() => import('@/pages/AcademicsPage'));
const AdmissionsPage = lazy(() => import('@/pages/AdmissionsPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AboutPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/academics',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AcademicsPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/admissions',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdmissionsPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/news',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NewsPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/news/:articleId',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NewsDetailPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ContactPage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  // Custom error pages
  {
    path: '/404',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    path: '/500',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ServerErrorPage />
      </Suspense>
    ),
  },
  // Catch-all for 404
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);
