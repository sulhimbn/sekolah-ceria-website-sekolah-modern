# Frontend Engineering - Long-term Memory

## Overview

Sekolah Ceria is a React/Vite frontend with TypeScript, Tailwind CSS, and shadcn/ui component library.

## Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + React Hook Form
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Testing**: Vitest + React Testing Library + Playwright
- **Package Manager**: Bun (with npm compatibility)

## Common Commands

```bash
# Development
bun dev

# Build
bun run build

# Lint (use --no-cache after installing new dependencies)
bun run lint
bun run lint -- --no-cache

# Type check
bun run type-check

# Test
bun run test
bun run test:run

# E2E Test
bun run test:e2e
```

## UI Components

### Location

All UI components are in `src/components/ui/` following shadcn/ui patterns.

### Common Issues

#### Missing Dependencies

When adding new shadcn/ui components, ensure all peer dependencies are installed. Common missing dependencies:

- `embla-carousel-react` - for carousel component
- `input-otp` - for OTP input component
- `react-resizable-panels` - for resizable panel component

**ESLint Cache Issue**: After installing new dependencies, always run `bun run lint -- --no-cache` or clear `.eslintcache` to ensure ESLint picks up the new packages.

#### ESLint Resolution

The project uses `eslint-import-resolver-typescript` for import resolution. If ESLint reports `import/no-unresolved` errors for installed packages:

1. Clear ESLint cache: `rm -f .eslintcache`
2. Run with `--no-cache` flag
3. Verify TypeScript can resolve the imports (`bun run type-check`)

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   └── app-sidebar.tsx
├── hooks/           # Custom React hooks
│   └── api/         # React Query hooks
├── lib/             # Utilities and configurations
├── services/        # API service layer
└── i18n/           # Internationalization
```

## Best Practices

1. **Always run lint and build before committing**
2. **Clear ESLint cache** after installing new dependencies
3. **Verify build passes** - check bundle size is within budget (800KB)
4. **Use TypeScript** - the project uses strict typing where possible
5. **Follow shadcn/ui patterns** for component structure

## Issue Labels

- `frontend-engineer` - Frontend-specific tasks
- `ui-ux-engineer` - Design and UX improvements

## Related Documentation

- [Blueprint](./blueprint.md) - Architecture overview
- [UI/UX Engineer](./ui-ux-engineer.md) - Design system documentation

## Lessons Learned

### API Response Handling

When implementing API repositories, always use the actual values from the API response rather than hardcoding:

**❌ Bad**:

```typescript
const response = await api<T>('/api/endpoint', config);
validateResponse(schema, { ...response, success: true }); // Hardcoded!
```

**✅ Good**:

```typescript
const response = await api<{ success: boolean; data: T }>(
  '/api/endpoint',
  config
);
validateResponse(schema, { ...response.data, success: response.success }); // Actual value
```

### Worker API Patterns

The worker uses a consistent pattern for responses:

- `ok(c, data)` returns `{ success: true, data: ... }`
- `bad(c, error)` returns `{ success: false, error: ... }` with 400 status

The frontend API client validates `success` at the HTTP layer and throws on failure, returning only `json.data`.

### React.memo Implementation Pattern

When adding React.memo to components using React.forwardRef, the syntax requires double closing parentheses:

**Correct pattern for forwardRef components**:

```typescript
const Component = React.memo(
  React.forwardRef<RefType, Props>(({ ...props }, ref) => {
    // render
  })
);
Component.displayName = 'Component';
```

**Correct pattern for simple function components**:

```typescript
const Component = React.memo(function Component({ ... }) {
  // render
})
```

### UI Components Memoization Status

As of 2026-02-27, these UI components have React.memo:

- button.tsx ✅
- card.tsx ✅ (multiple exports)
- avatar.tsx ✅
- badge.tsx ✅
- input.tsx ✅ (added in PR #238)
- textarea.tsx ✅ (added in PR #238)
- skeleton.tsx ✅ (added in PR #238)
- separator.tsx ✅ (added in PR #238)

### UI Components Memoization Status

As of 2026-02-27, these UI components have React.memo:

- button.tsx ✅
- card.tsx ✅ (multiple exports)
- avatar.tsx ✅
- badge.tsx ✅
- input.tsx ✅ (added in PR #238)
- textarea.tsx ✅ (added in PR #238)
- skeleton.tsx ✅ (added in PR #238)
- separator.tsx ✅ (added in PR #238)

### ErrorBoundary Usage

Wrap components with ErrorBoundary to prevent render errors from crashing the entire page:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Wrap the component's return JSX
return (
  <ErrorBoundary>
    <YourComponent />
  </ErrorBoundary>
);
```

**When to use ErrorBoundary:**

- Layout components (Header, Footer, Sidebar) - to prevent full page crashes
- Components with external API calls (newsletter forms, data fetching)
- Components that might throw runtime errors

**Available ErrorBoundary components:**

- `ErrorBoundary.tsx` - Class component with ErrorFallback
- `RouteErrorBoundary.tsx` - For route-level error handling

### DemoPage Component Split (2026-02-27)

Split monolithic DemoPage.tsx (206 lines) into focused components following single responsibility principle:

**New structure:**

```
src/components/demo/
├── DemoPage.tsx         # Container (142 lines)
├── UserManager.tsx      # User CRUD (69 lines)
├── ChatManager.tsx      # Chat CRUD (69 lines)
├── MessageList.tsx      # Message display (47 lines)
├── MessageComposer.tsx  # Message input (49 lines)
└── index.ts            # Barrel exports
```

**Key patterns used:**

1. **Props interface for each component** - Clear API contracts
2. **useCallback for handlers** - Prevent unnecessary re-renders
3. **useMemo for expensive computations** - usersById map in MessageList
4. **Backwards compatibility** - Original pages/DemoPage.tsx re-exports from new location

```typescript
// Original src/pages/DemoPage.tsx now just re-exports
export { DemoPage } from '@/components/demo';
```

**Verification:**

- Lint passes ✅
- Build succeeds ✅
- All 271 tests pass ✅
- PR #259
