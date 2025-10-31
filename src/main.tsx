import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Import pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import AcademicsPage from '@/pages/AcademicsPage';
import AdmissionsPage from '@/pages/AdmissionsPage';
import NewsPage from '@/pages/NewsPage';
import ContactPage from '@/pages/ContactPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/academics",
    element: <AcademicsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admissions",
    element: <AdmissionsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/news",
    element: <NewsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/news/:articleId",
    element: <NewsDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)