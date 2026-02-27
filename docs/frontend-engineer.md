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
- **Package Manager**: npm (project uses npm, not bun despite README)

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint (use --no-cache after installing new dependencies)
npm run lint
npm run lint -- --no-cache

# Type check
npm run type-check

# Test
npm run test
npm run test:run

# E2E Test
npm run test:e2e
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

**ESLint Cache Issue**: After installing new dependencies, always run `npm run lint -- --no-cache` or clear `.eslintcache` to ensure ESLint picks up the new packages.

#### ESLint Resolution

The project uses `eslint-import-resolver-typescript` for import resolution. If ESLint reports `import/no-unresolved` errors for installed packages:

1. Clear ESLint cache: `rm -f .eslintcache`
2. Run with `--no-cache` flag
3. Verify TypeScript can resolve the imports (`npm run type-check`)

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
2. **Clear ESLint cache** after installing new npm dependencies
3. **Verify build passes** - check bundle size is within budget (800KB)
4. **Use TypeScript** - the project uses strict typing where possible
5. **Follow shadcn/ui patterns** for component structure

## Issue Labels

- `frontend-engineer` - Frontend-specific tasks
- `ui-ux-engineer` - Design and UX improvements

## Related Documentation

- [Blueprint](./blueprint.md) - Architecture overview
- [UI/UX Engineer](./ui-ux-engineer.md) - Design system documentation

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
