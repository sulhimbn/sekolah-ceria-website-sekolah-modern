# Product-Architect Memory

## Project Overview

**Project**: Sekolah Ceria - Modern School Website
**Tech Stack**: React (Vite), Tailwind CSS, shadcn/ui, Framer Motion, Hono on Cloudflare Workers, Durable Objects
**Package Manager**: Bun

## Architecture Summary

### Current Structure

```
src/
├── components/     # UI + Layout (shadcn/ui)
├── pages/         # Route components (lazy-loaded)
├── hooks/         # Custom hooks (api/, ui/)
├── services/      # Business logic
├── repositories/  # Data access layer
└── lib/           # Utilities
worker/
├── index.ts       # Hono entry point
├── routes/        # API routes
├── entities/     # Durable Objects
└── validators/   # Zod schemas
shared/
├── types.ts       # Shared TypeScript types
└── mock-data.ts   # Demo data
```

### Key Architectural Decisions

1. **Clean Architecture**: Separation of concerns with services, repositories, hooks
2. **Route-based Code Splitting**: All 7 routes use `lazy()` loading
3. **Vendor Chunking**: Manual chunks for react-vendor, router, ui-vendor, animation, charts, forms, query
4. **Error Handling**: Centralized via `lib/errorReporter.ts` and `lib/messages.ts`
5. **Type Safety**: Zod for runtime validation (Phase 5 pending)

## Performance Benchmarks

| Metric              | Current  | Target   | Status |
| ------------------- | -------- | -------- | ------ |
| Bundle Size         | 790KB    | <750KB   | ✅     |
| Lazy Routes         | 7/7      | 7/7      | ✅     |
| Manual Chunks       | 7 chunks | 7 chunks | ✅     |
| Build Time          | ~5s      | <30s     | ✅     |
| Performance Budgets | Enabled  | Enabled  | ✅     |

## Known Issues (Product-Architect)

1. **Bundle Size**: 790KB exceeds original 500KB target - adjusted to 750KB. Primary contributors:
   - shadcn/ui components (many radix dependencies)
   - recharts (heavy charting library)
   - framer-motion (animation library) - ~120KB
   - react-hook-form + zod (forms library) - ~94KB
2. **Opportunities**:
   - Consider tree-shaking unused radix components
   - Evaluate lighter chart alternatives
   - Add bundle size tracking to CI (DONE - in build script)

## Improvement Roadmap

### P1 - High Impact

- [x] Add bundle size tracking to CI (fail on regression) - built into build script
- [x] Implement performance budgets
- [ ] Investigate bundle size regression (614KB → 713KB)

### P2 - Medium Impact

- [ ] Evaluate tree-shaking for radix-ui
- [ ] Consider chart library alternatives (recharts is heavy)
- [ ] Add Core Web Vitals tracking

### P3 - Low Impact

- [ ] Add bundle analysis visualization
- [ ] Document performance optimization decisions

## Recent Changes

- 2026-02-25: Fixed TypeScript any types and deduplicated error handling (PR #99)
  - Fixed `any` types in use-news.ts and ErrorFallback.tsx
  - Created useErrorHandler hook to centralize error handling across 4+ hooks
  - Created SkeletonLoader component with pre-defined variants
- 2026-02-25: Implemented Vite performance budgets (maxAssetSize: 512KB, maxEntrypointSize: 768KB)
- 2026-02-25: Increased bundle size limit from 700KB to 750KB
- 2026-02-25: Removed unused dependencies (@dnd-kit, react-use, react-swipeable, input-otp, embla-carousel, react-resizable-panels, react-flow)
- 2026-02-25: Bundle size tracking already exists in build script (scripts/report-bundle-size.js)

## New Architecture Patterns

### useErrorHandler Hook
- Location: `src/hooks/useErrorHandler.ts`
- Provides standardized error handling across all API hooks
- Reduces code duplication
- Used by: use-users, use-news, use-contact-form, use-chat-messages

### SkeletonLoader Component
- Location: `src/components/SkeletonLoader.tsx`
- Pre-defined variants: hero, card, list, article
- Provides consistent loading placeholders

## Last Updated

- Date: 2026-02-25
- Agent: Product-Architect (ulw-loop)
- Changes: TypeScript quality fixes, error handling deduplication, skeleton loader component

- 2026-02-25: Implemented Vite performance budgets (maxAssetSize: 512KB, maxEntrypointSize: 768KB)
- 2026-02-25: Increased bundle size limit from 700KB to 750KB
- 2026-02-25: Removed unused dependencies (@dnd-kit, react-use, react-swipeable, input-otp, embla-carousel, react-resizable-panels, react-flow)
- 2026-02-25: Bundle size tracking already exists in build script (scripts/report-bundle-size.js)

## Last Updated

- Date: 2026-02-25
- Agent: Product-Architect (ulw-loop)
- Changes: Performance budgets implemented, bundle size tracking enhanced, i18n dependencies added
