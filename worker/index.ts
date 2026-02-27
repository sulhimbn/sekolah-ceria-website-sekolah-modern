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
// Note: In production, consider using Cloudflare Rate Limiting (paid) or Durable Objects
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      keysToDelete.push(key);
    }
  }
  // Delete in reverse to handle Map iteration safely
  for (let i = keysToDelete.length - 1; i >= 0; i--) {
    rateLimitStore.delete(keysToDelete[i]);
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

    // Compute new state atomically to avoid race conditions
    const existing = rateLimitStore.get(key);
    let newState: { count: number; resetTime: number } | null;

    if (existing) {
      if (existing.resetTime < now) {
        // Window expired, reset
        newState = { count: 1, resetTime: now + windowMs };
      } else if (existing.count >= maxRequests) {
        // Rate limit exceeded - return early
        // Add rate limit headers before responding
        c.header('X-RateLimit-Limit', String(maxRequests));
        c.header('X-RateLimit-Remaining', '0');
        c.header(
          'Retry-After',
          String(Math.ceil((existing.resetTime - now) / 1000))
        );
        return c.json(
          {
            success: false,
            error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
            retryAfter: Math.ceil((existing.resetTime - now) / 1000),
          },
          429
        );
      } else {
        // Increment counter
        newState = { count: existing.count + 1, resetTime: existing.resetTime };
      }
    } else {
      // First request in window
      newState = { count: 1, resetTime: now + windowMs };
    }

    // Set the new state atomically (single write)
    rateLimitStore.set(key, newState!);

    // Add rate limit headers for successful requests
    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(newState!.count));

    await next();
  };
}

// Rate limiter instances for different endpoints
// 5 requests per minute for auth endpoints (stricter - prevents brute force)
// 60 requests per minute for general API endpoints
// 120 requests per minute for read operations (more lenient)
//
// NOTE: For production with multiple worker instances, consider:
// - Cloudflare Rate Limiting (requires Workers Paid plan)
// - Durable Objects for distributed rate limiting
// - KV store (has latency implications)
const authRateLimiter = createRateLimiter(5, 60000);
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

// Apply stricter rate limiting to auth endpoints (login/register)
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);

// Apply general rate limiting to other API endpoints
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
