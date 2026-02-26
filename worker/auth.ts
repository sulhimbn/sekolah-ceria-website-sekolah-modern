/**
 * Authentication middleware for Cloudflare Workers
 * Implements JWT-based auth using Web Crypto API (no external dependencies)
 */
import { Context, Next } from 'hono';
import type { Env } from './core-utils';

/**
 * Constant-time string comparison to prevent timing attacks
 * Uses Web Crypto API's timingSafeEqual for secure comparison
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // If lengths differ, still do comparison to not leak length info
  if (aBytes.length !== bBytes.length) {
    // Compare with padding to maintain constant time
    const paddedB = new Uint8Array(aBytes.length);
    bBytes.forEach((byte, i) => {
      if (i < paddedB.length) paddedB[i] = byte;
    });
    await crypto.subtle.timingSafeEqual(aBytes, paddedB);
    return false;
  }
  return crypto.subtle.timingSafeEqual(aBytes, bBytes);
}

// JWT payload interface
export interface AuthPayload {
  sub: string; // user id
  name: string; // user name
  role: UserRole; // user role
  iat: number; // issued at
  exp: number; // expiration
}

export type UserRole = 'admin' | 'user' | 'guest';

// Extended context with auth
export interface AuthContext {
  user?: AuthPayload;
}

// App context type combining Bindings and Variables
export type AppContext = {
  Bindings: Env;
  Variables: AuthContext;
};

/**
 * Create a JWT-like token using Web Crypto API
 * Uses HS256 algorithm
 */
async function createToken(
  payload: Omit<AuthPayload, 'iat' | 'exp'>,
  secret: string
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 hours
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(fullPayload));

  const signatureInput = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signatureInput)
  );
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${signatureInput}.${signatureB64}`;
}

/**
 * Verify and decode a JWT-like token
 */
async function verifyToken(
  token: string,
  secret: string
): Promise<AuthPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const signatureInput = `${headerB64}.${payloadB64}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signatureInput)
    );
    const expectedSignatureB64 = btoa(
      String.fromCharCode(...new Uint8Array(signature))
    );

    const isValidSignature = await timingSafeEqual(
      signatureB64,
      expectedSignatureB64
    );
    if (!isValidSignature) return null;

    const payload = JSON.parse(atob(payloadB64)) as AuthPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch (e) {
    // Log errors for debugging but don't leak details to client
    console.error(
      '[AUTH] Token verification error:',
      e instanceof Error ? e.message : 'Unknown error'
    );
    return null;
  }
}

/**
 * Get JWT secret from environment
 * Throws error if not configured (security best practice)
 */
function getJWTSecret(c: Context<{ Bindings: Env }>): string {
  const secret = c.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not configured. Please set JWT_SECRET in your environment.'
    );
  }
  return secret;
}

/**
 * Auth middleware - parses Authorization header and attaches user to context
 */
export async function authMiddleware(c: Context<AppContext>, next: Next) {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');

  if (token) {
    const secret = getJWTSecret(c);
    const payload = await verifyToken(token, secret);
    if (payload) {
      c.set('user', payload);
    }
  }

  await next();
}

/**
 * Optional auth - attaches user if token present but doesn't require it
 */
export async function optionalAuthMiddleware(
  c: Context<AppContext>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');

  if (token) {
    const secret = getJWTSecret(c);
    const payload = await verifyToken(token, secret);
    if (payload) {
      c.set('user', payload);
    }
  }

  await next();
}

/**
 * Require auth - returns 401 if no valid token
 */
export function requireAuth(c: Context<AppContext>): AuthPayload {
  const user = c.get('user');
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require role - returns 403 if user doesn't have required role
 */
export function requireRole(
  c: Context<AppContext>,
  requiredRole: UserRole
): AuthPayload {
  const user = requireAuth(c);
  const roleHierarchy: Record<UserRole, number> = {
    guest: 0,
    user: 1,
    admin: 2,
  };

  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    throw new Error('Forbidden');
  }

  return user;
}

/**
 * Generate login response with token
 */
export async function generateAuthResponse(
  c: Context<{ Bindings: Env }>,
  userId: string,
  name: string,
  role: UserRole = 'user'
) {
  const secret = getJWTSecret(c);
  const token = await createToken({ sub: userId, name, role }, secret);

  return {
    token,
    user: { id: userId, name, role },
  };
}

/**
 * Hash password using Web Crypto API (SHA-256 with salt)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.randomUUID();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

/**
 * Verify password against stored hash
 * Rejects users without proper password hash (security best practice)
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  // Reject users without proper password hash (security best practice)
  // Demo users must set a proper password, not rely on weak fallback
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, hash] = storedHash.split(':');
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return await timingSafeEqual(hash, hashHex);
}
