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

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle Size | 614KB | <500KB | ⚠️ Warning |
| Lazy Routes | 7/7 | 7/7 | ✅ |
| Manual Chunks | 7 chunks | 7 chunks | ✅ |
| Build Time | ~30s | <30s | ✅ |

## Known Issues (Product-Architect)

1. **Bundle Size**: 614KB exceeds 500KB target - primarily due to:
   - shadcn/ui components (many radix dependencies)
   - recharts (heavy charting library)
   - framer-motion (animation library)
   
2. **Opportunities**:
   - Consider tree-shaking unused radix components
   - Evaluate lighter chart alternatives
   - Add bundle size tracking to CI

## Improvement Roadmap

### P1 - High Impact
- [ ] Add bundle size tracking to CI (fail on regression)
- [ ] Implement performance budgets

### P2 - Medium Impact
- [ ] Evaluate tree-shaking for radix-ui
- [ ] Consider chart library alternatives
- [ ] Add Core Web Vitals tracking

### P3 - Low Impact
- [ ] Add bundle analysis visualization
- [ ] Document performance optimization decisions

## Last Updated

- Date: 2026-02-25
- Agent: Product-Architect (ulw-loop)
- PR: #22 (merged)
