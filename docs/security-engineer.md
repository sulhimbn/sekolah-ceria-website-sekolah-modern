# Security Engineer Documentation

## Overview

This document serves as the long-term memory for the security-engineer agent. It tracks security improvements, findings, and best practices.

## Security Posture Summary

### Existing Security Measures

1. **Security Headers** (worker/index.ts):
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: geolocation=(), microphone=(), camera=()
   - Content-Security-Policy (CSP)
   - Strict-Transport-Security (HSTS): max-age=31536000; includeSubDomains
   - Cross-Origin-Opener-Policy (COOP): same-origin
   - Cross-Origin-Resource-Policy (CORP): same-origin

2. **CORS Configuration**:
   - Configurable allowed origins via ALLOWED_ORIGINS environment variable
   - Default allowed methods: GET, POST, PUT, DELETE, OPTIONS
   - Default allowed headers: Content-Type, Authorization

3. **Input Validation**:
   - Zod schemas in worker/validators.ts
   - Contact form validation (name, email, message)
   - User creation validation
   - Chat/message validation
   - Delete many validation

4. **Error Handling**:
   - Sanitized error messages
   - Client error reporting endpoint

5. **Static Security Analysis**:
   - ESLint with eslint-plugin-security for runtime vulnerability detection

## Implemented Security Improvements

### 2026-02-26: ESLint Security Plugin

**File Changed**: eslint.config.js

**Description**: Added eslint-plugin-security for static analysis to detect potential security vulnerabilities in the codebase.

**Implementation Details**:

- Installed eslint-plugin-security package
- Added to ESLint flat config with recommended rules
- Detects common security issues like:
  - `detect-non-literal-fs-filename`
  - `detect-non-literal-regexp`
  - `detect-non-literal-require`
  - `detect-possible-timing-attacks`
  - `detect-pseudoRandom-bytes`
  - `no-eval`
  - `no-implied-eval`

**Code Addition**:

```javascript
import security from 'eslint-plugin-security';

// In config:
plugins: {
  security: security,
},
rules: {
  ...security.configs.recommended.rules,
}
```

### 2026-02-25: Rate Limiting Middleware

**File Changed**: worker/index.ts

**Description**: Added in-memory rate limiting middleware to protect API endpoints from abuse.

**Implementation Details**:

- Uses per-worker in-memory store (Map)
- Tracks requests by IP address + path
- 60 requests per minute limit for API endpoints
- Returns 429 Too Many Requests with retryAfter value
- Automatic cleanup of expired entries every minute
- Uses CF-Connecting-IP header for client identification

**Code Structure**:

```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
function createRateLimiter(maxRequests: number, windowMs: number);
const strictRateLimiter = createRateLimiter(60, 60000);
app.use('/api/*', strictRateLimiter);
```

**Limitations**:

- Per-worker instance state (not shared across workers)
- For production, recommend using Cloudflare Rate Limiting or KV store

### 2026-02-25: Additional Security Headers

**File Changed**: worker/index.ts

**Description**: Added three additional security headers to enhance browser security.

**Implementation Details**:

- **Strict-Transport-Security (HSTS)**: Forces browsers to use HTTPS for 1 year (max-age=31536000) and includes subdomains
- **Cross-Origin-Opener-Policy (COOP)**: Prevents cross-origin documents from accessing your page's browsing context
- **Cross-Origin-Resource-Policy (CORP)**: Prevents cross-origin loading of resources from your page

**Security Benefits**:

- HSTS: Protects against man-in-the-middle attacks and protocol downgrade attacks
- COOP: Prevents window-based attacks (e.g., opening a malicious page that can access your page)
- CORP: Mitigates Spectre-like attacks by preventing cross-origin resource loading

## Potential Future Improvements

1. **Enhanced Rate Limiting**:
   - Move to Cloudflare Rate Limiting (managed service)
   - Implement KV store for distributed rate limiting

2. **Content Security Policy Hardening**:
   - Remove 'unsafe-inline' and 'unsafe-eval' from CSP
   - Use nonces or hashes for inline scripts

3. ~~**Additional Security Headers**~~ - ✅ IMPLEMENTED

4. **Authentication/Authorization**:
   - Add API key or JWT-based authentication for sensitive endpoints

5. ~~**ESLint Security Plugins**~~ - ✅ IMPLEMENTED

## Verification Commands

```bash
# Lint check
npm run lint

# Type check
npm run type-check

# Build
npm run build

# Run tests
npm run test
```

## Security Scanning Results

### XSS Prevention

- No dangerouslySetInnerHTML usage found
- No eval() usage found
- Input validation in place via Zod

### Data Storage

- No sensitive data in localStorage/sessionStorage/cookies
- Uses Cloudflare Durable Objects for data persistence

### Environment Variables

- .env.example properly documents required variables
- No hardcoded secrets in source code

## Security Issues Verification

### 2026-02-26: Resolved Security Issues

All three security issues have been verified as FIXED:

| Issue                                                                 | Status   | Verification                                                                                                                      |
| --------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| #166 - Timing attack vulnerabilities in JWT and password verification | ✅ FIXED | `worker/auth.ts` uses `timingSafeEqual()` at lines 114-117 (JWT) and line 275 (password). Error logging present at lines 128-132. |
| #168 - N+1 query in login endpoint                                    | ✅ FIXED | `worker/user-routes.ts` line 79 uses `UserEntity.findByEmail()` instead of listing all users.                                     |
| #175 - Tabnabbing vulnerability in Footer.tsx                         | ✅ FIXED | All external links in `src/components/layout/Footer.tsx` (lines 73-100) have `rel="noopener noreferrer"`.                         |

### Proactive Security Scan Results (2026-02-26)

| Check                    | Status  | Notes                                          |
| ------------------------ | ------- | ---------------------------------------------- |
| Timing attack prevention | ✅ PASS | Uses crypto.subtle.timingSafeEqual()           |
| N+1 query prevention     | ✅ PASS | Uses findByEmail() method                      |
| Tabnabbing prevention    | ✅ PASS | All window.open have rel="noopener noreferrer" |
| XSS prevention           | ✅ PASS | No dangerouslySetInnerHTML usage               |
| eval() usage             | ✅ PASS | No eval() found in source                      |
| Security headers         | ✅ PASS | All headers configured in worker/index.ts      |
| JWT secret validation    | ✅ PASS | Throws error if not configured                 |
| Input validation         | ✅ PASS | Zod schemas in place                           |

### Known Limitations

1. **CSP Relaxations**: The CSP includes `'unsafe-inline'` and `'unsafe-eval'` which may be needed for React development. Consider using nonces for production hardening.

2. **Rate Limiting**: Current in-memory rate limiting is per-worker. For production, recommend Cloudflare Rate Limiting.
