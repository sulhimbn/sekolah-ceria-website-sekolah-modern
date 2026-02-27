// Making changes to this file is **STRICTLY** forbidden. Please add your routes in `user-routes.ts` file.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { userRoutes } from './user-routes';
import { Env, GlobalDurableObject } from './core-utils';

// Need to export GlobalDurableObject to make it available in wrangler
export { GlobalDurableObject };

export interface ClientErrorReport {
  message: string;
  url: string;
  userAgent: string;
  timestamp: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  errorBoundaryProps?: Record<string, unknown>;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
}

// Rate limiting configuration
// Rate limiter using in-memory store (per-worker instance)
// For production, consider using Cloudflare Rate Limiting or KV store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

function createRateLimiter(maxRequests: number, windowMs: number) {
  return async (c: any, next: () => Promise<void>) => {
    const ip =
      c.req.header('CF-Connecting-IP') ||
      c.req.header('X-Forwarded-For') ||
      'unknown';
    const now = Date.now();
    const key = `${ip}:${c.req.path}`;

    const current = rateLimitStore.get(key);

    if (current) {
      if (current.resetTime < now) {
        // Window expired, reset
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      } else if (current.count >= maxRequests) {
        // Rate limit exceeded
        return c.json(
          {
            success: false,
            error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
            retryAfter: Math.ceil((current.resetTime - now) / 1000),
          },
          429
        );
      } else {
        // Increment counter
        current.count++;
        rateLimitStore.set(key, current);
      }
    } else {
      // First request in window
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    }

    await next();
  };
}

// Rate limiter instances for different endpoints
// 60 requests per minute for write operations (stricter)
// 120 requests per minute for read operations (more lenient)
const strictRateLimiter = createRateLimiter(60, 60000);
const lenientRateLimiter = createRateLimiter(120, 60000);

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());

const allowedOrigins = (c: any) => {
  const origin = c.req.header('Origin');
  const envAllowedOrigins = c.env?.ALLOWED_ORIGINS?.split(',') || [];
  if (
    envAllowedOrigins.length > 0 &&
    origin &&
    envAllowedOrigins.includes(origin)
  ) {
    return origin;
  }
  return undefined;
};

app.use(
  '/api/*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Apply rate limiting to API endpoints
app.use('/api/*', strictRateLimiter);

app.use('*', async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // Additional security headers
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Cross-Origin-Opener-Policy', 'same-origin');
  c.header('Cross-Origin-Resource-Policy', 'same-origin');
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  );
});

userRoutes(app);

app.get('/api/health', c =>
  c.json({
    success: true,
    data: { status: 'healthy', timestamp: new Date().toISOString() },
  })
);

app.post('/api/client-errors', async c => {
  try {
    const e = await c.req.json<ClientErrorReport>();
    if (!e.message)
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    console.error('[CLIENT ERROR]', JSON.stringify(e, null, 2));
    return c.json({ success: true });
  } catch (error) {
    console.error('[CLIENT ERROR HANDLER] Failed:', error);
    return c.json({ success: false, error: 'Failed to process' }, 500);
  }
});

app.notFound(c => c.json({ success: false, error: 'Not Found' }, 404));
app.onError((err, c) => {
  console.error(`[ERROR] ${err}`);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

export default { fetch: app.fetch } satisfies ExportedHandler<Env>;
