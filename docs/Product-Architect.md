# Product-Architect Memory

## Project Overview

**Project**: Sekolah Ceria - Modern School Website
**Tech Stack**: React (Vite), Tailwind CSS, shadcn/ui, Framer Motion, Hono on Cloudflare Workers, Durable Objects
**Package Manager**: Bun

## Architecture Summary

### Current Structure

```
src/
├── components/     # UI + Layout (60+ shadcn/ui components)
├── pages/         # Route components (lazy-loaded, 10 pages)
├── hooks/         # Custom hooks (api/, ui/, useErrorHandler)
├── services/      # Business logic
├── repositories/  # Data access layer (interfaces + implementations)
└── lib/           # Utilities
worker/
├── index.ts       # Hono entry point
├── user-routes.ts # API routes (single file)
├── core-utils.ts  # Durable Object utilities
├── entities.ts    # Entity implementations
└── validators.ts  # Zod schemas
shared/
├── types.ts       # Shared TypeScript types
└── mock-data.ts   # Demo data
```

### Key Architectural Decisions

1. **Clean Architecture**: Separation of concerns with services, repositories, hooks
2. **Route-based Code Splitting**: All 10 routes use `lazy()` loading
3. **Vendor Chunking**: Manual chunks for react-vendor, router, ui-vendor, animation, charts, forms, query
4. **Error Handling**: Centralized via `lib/errorReporter.ts`, `lib/messages.ts`, and `hooks/useErrorHandler.ts`
5. **Type Safety**: Zod for runtime validation (Phase 5 complete)

## Performance Benchmarks

| Metric              | Current  | Target   | Status |
| ------------------- | -------- | -------- | ------ |
| Bundle Size         | 861KB    | <870KB   | ✅     |
| Lazy Routes         | 10/10    | 10/10    | ✅     |
| Manual Chunks       | 7 chunks | 7 chunks | ✅     |
| Build Time          | ~5s      | <30s     | ✅     |
| Performance Budgets | Enabled  | Enabled  | ✅     |
| Bundle Regression   | Enabled  | Enabled  | ✅     |

## Known Issues (Product-Architect)

1. **Bundle Size**: 790KB exceeds original 500KB target - adjusted to 870KB. Primary contributors:
   - shadcn/ui components (many radix dependencies)
   - recharts (heavy charting library)
   - framer-motion (animation library) - ~120KB
   - react-hook-form + zod (forms library) - ~94KB

2. **Opportunities**:
   - Consider tree-shaking unused radix components
   - Evaluate lighter chart alternatives
   - Add bundle size tracking to CI (DONE - in build script with regression check)

## Improvement Roadmap

### P1 - High Impact

- [x] Add bundle size regression check in CI (Issue #271)
- [x] Implement performance budgets
- [x] Bundle size regression check with 5% threshold

### P2 - Medium Impact

- [ ] Evaluate tree-shaking for radix-ui
- [ ] Consider chart library alternatives (recharts is heavy)
- [ ] Add Core Web Vitals tracking

### P3 - Low Impact

- [ ] Add bundle analysis visualization
- [ ] Document performance optimization decisions

## Recent Changes

- 2026-02-27: Implemented bundle size regression check in CI (Issue #271)
  - Added `scripts/check-bundle-regression.js` - compares current build against baseline
  - Added `bundle-size-baseline.json` - stores baseline for comparison
  - Updated `package.json` scripts: `build:check` and `build:update-baseline`
  - 5% regression threshold - build fails if exceeded
- 2026-02-26: Fixed Issue #170 - Moved ESLint packages from dependencies to devDependencies

## Last Updated

- Date: 2026-02-27
- Agent: Product-Architect (ulw-loop)
- Changes: Implemented bundle size regression check in CI (Issue #271)
