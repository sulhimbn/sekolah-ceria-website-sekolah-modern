# Backend Engineer Agent - Long-term Memory

## Session Summary

### 2026-02-26

**Completed Tasks:**

1. **Resolved Issue #200** (Type safety - worker/auth.ts uses 'as any' for context)
   - Root cause: Hono context not properly typed with Variables
   - Fix: Defined AppContext type in worker/core-utils.ts with AuthContext
   - Updated worker/auth.ts to use Hono's `c.set()` and `c.get()` methods
   - Updated worker/user-routes.ts and worker/index.ts to use AppContext type
   - Files changed:
     - `worker/core-utils.ts` - Added AuthContext interface and AppContext type
     - `worker/auth.ts` - Replaced `(c as any)` with `c.set()` and `c.get()`
     - `worker/user-routes.ts` - Changed to use Hono<AppContext>
     - `worker/index.ts` - Changed to use Hono<AppContext>
   - Build: ✅ (TypeScript type-check passes)
   - Created PR #208

### 2026-02-25

**Completed Tasks:**

1. **Resolved Issue #30** (Circular chunk dependency warnings)
   - Root cause: Circular re-exports between services/index.ts and individual service files
   - Fix: Changed imports from barrel file (`@/services`) to direct service file imports
   - Files changed:
     - `src/pages/HomePage.tsx`
     - `src/hooks/api/use-news.ts`
     - `src/hooks/api/use-news-article.ts`
   - Build: ✅ (no circular dependency warnings)
   - Tests: 120 passed
   - Lint: No errors
   - Created PR #58

2. **Closed stale PR #44** (Zod validation)
   - Feature already merged to main via commit 90d46a9
   - Added comment explaining closure

3. **Verified PR #7** (Zod validation schemas)
   - Build: ✅
   - Tests: 53 passed
   - Lint: No errors
   - Commented verification results on PR

4. **Resolved Issue #8** (Standardize error handling)
   - Refactored `NewsService` to use `withErrorHandling` and `withConditionalErrorHandling`
   - Refactored `ContactService` to use `withErrorHandling`
   - Created PR #16
   - Build: ✅
   - Tests: 53 passed
   - Lint: No errors

## Knowledge Base

### Hono Context Typing (Cloudflare Workers)

When working with Hono in Cloudflare Workers:

**Defining Custom Context Variables:**

```typescript
// In worker/core-utils.ts
export interface AuthContext {
  user?: {
    sub: string;
    name: string;
    role: 'admin' | 'user' | 'guest';
    iat: number;
    exp: number;
  };
}

export type AppContext = { Bindings: Env; Variables: AuthContext };
```

**Using Typed Context:**

```typescript
// Instead of (c as any).user = payload
c.set('user', payload);

// Instead of (c as any).user
const user = c.get('user');

// Function signatures
function myFunction(c: Context<AppContext>) { ... }

// Hono app typing
const app = new Hono<AppContext>();
export function userRoutes(app: Hono<AppContext>) { ... }
```

### Available Utilities

Located in `src/services/index.ts`:

1. **`withErrorHandling<T>(apiCall, errorMessage)`**
   - Simple wrapper for standard error handling
   - Usage: Wraps API calls with consistent error messages

2. **`withConditionalErrorHandling<T>(apiCall, options)`**
   - Enhanced wrapper with notFound handling
   - Options: `defaultError`, `notFoundError`, `notFoundCheck`

### Services Using Utilities

- ✅ UserService (`src/services/user.service.ts`)
- ✅ ChatService (`src/services/chat.service.ts`)
- ✅ NewsService (`src/services/news.service.ts`) - **Refactored**
- ✅ ContactService (`src/services/contact.service.ts`) - **Refactored**

### Patterns to Follow

When adding new API methods to services:

```typescript
// Import the utility
import { withErrorHandling, withConditionalErrorHandling } from '.';

// For simple error handling
async method(): Promise<T> {
  return withErrorHandling(
    async () => { /* API call */ },
    'Error message'
  );
}

// For methods with notFound handling
async method(id: string): Promise<T> {
  return withConditionalErrorHandling(
    async () => { /* API call */ },
    {
      defaultError: 'Default error message',
      notFoundError: 'Not found error message',
      notFoundCheck: (error) => error instanceof Error && error.message.includes('not found')
    }
  );
}
```

### Avoiding Circular Dependencies

When importing services in components/hooks:

- **DO**: Import directly from service file: `import { newsService } from '@/services/news.service'`
- **DON'T**: Import from barrel file: `import { newsService } from '@/services'`

This avoids Vite/Rollup circular chunk warnings caused by:

1. Individual service files importing utilities from `services/index.ts`
2. `services/index.ts` re-exporting from individual service files

## Open Issues (Backend Engineer)

- #200: Type safety - worker/auth.ts uses 'as any' for context - **RESOLVED**
- #30: Fix circular chunk dependency warnings in Vite build - **RESOLVED**
- #9: Add runtime type validation for API responses using Zod - **RESOLVED**
- #8: Standardize error handling across all services - **RESOLVED**

## Notes

- The codebase uses Bun as package manager
- Vite for building
- Vitest for testing
- ESLint for linting
- Cloudflare Workers with Hono for backend
