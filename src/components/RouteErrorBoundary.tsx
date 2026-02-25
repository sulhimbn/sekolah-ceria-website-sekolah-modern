import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { errorReporter } from '@/lib/errorReporter';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    // Report the route error
    if (error) {
      let errorMessage = 'Unknown route error';
      let errorStack = '';

      if (isRouteErrorResponse(error)) {
        errorMessage = `Route Error ${error.status}: ${error.statusText}`;
        if (error.data) {
          errorMessage += ` - ${JSON.stringify(error.data)}`;
        }

        // Navigate to custom error pages based on status code
        if (error.status === 404) {
          navigate('/404', { replace: true });
        } else if (error.status >= 500) {
          navigate('/500', { replace: true });
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || '';
        // Navigate to 500 page for unexpected errors
        navigate('/500', { replace: true });
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
        navigate('/500', { replace: true });
      }

      errorReporter.report({
        message: errorMessage,
        stack: errorStack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        source: 'react-router',
        error: error,
        level: 'error',
      });
    }
  }, [error, navigate]);

  // Return null since we're navigating to custom error pages
  return null;
}
