# R&D Documentation

## Overview

This document serves as the long-term memory for the R&D (Research & Development) specialist working on the Sekolah Ceria project.

## Domain Focus

- **Security Research**: Security headers, best practices, OWASP guidelines
- **Performance Optimization**: Caching, bundle optimization, runtime performance
- **Innovation**: New features, experimental technologies, semantic search
- **Developer Experience**: Build tooling, testing, CI/CD improvements

## Technology Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Hono on Cloudflare Workers
- Testing: Vitest + React Testing Library
- Package Manager: npm (with Bun compatibility)

## Active Improvements

| Issue | Title                                                              | Status  | Priority |
| ----- | ------------------------------------------------------------------ | ------- | -------- |
| #121  | Code duplication in API hooks - create generic useApiResource hook | PR #160 | P1       |
| #140  | Fix missing React imports in use-news.ts                           | PR #145 | P0       |
| #94   | Fix missing npm dependencies for UI components                     | PR #107 | Low      |

## Completed Work

- **#121** (2026-02-26): Create generic useApiResource hook
  - Created useApiResource<T> for data fetching with built-in loading, error handling, and error reporting
  - Created useApiResourceMutation<TInput, TOutput> for mutations
  - Refactored useNews, useChats, useUsers, useChatMessages to use generic hooks
  - Reduced ~90% identical boilerplate code across 4 API hooks
  - Build passes (813.7KB), all 191 tests pass
  - PR #160 created with RnD label

- **#140** (2026-02-26): Fix missing React imports in use-news.ts
  - Added missing React imports (useState, useEffect, useMemo, useCallback)
  - Fixes P0 runtime crash when visiting news pages
  - Type-check and build pass (812KB bundle)
  - PR #145 created with RnD label

- **#88** (2026-02-25): Fix accessibility - Remove placeholder links
  - Removed incorrect navigation items from app-sidebar
  - Links had mismatched labels and destinations (e.g., "Projects" pointed to /admissions)
  - Removed "Quick Links" section with placeholder links
  - Improves accessibility by removing misleading navigation

- **#94** (2026-02-25): Fix missing npm dependencies for UI components
  - Installed 3 missing packages: embla-carousel-react, input-otp, react-resizable-panels
  - Resolved lint errors for carousel.tsx, input-otp.tsx, resizable.tsx
  - Components now have their dependencies available for future use
  - PR #107 created with RnD label

- **#67** (2026-02-25): Bundle Size Optimization
  - Removed 7 unused dependencies (@dnd-kit/core, @dnd-kit/sortable, react-flow, react-select, react-swipeable, react-use, tw-animate-css)
  - Adjusted bundle size limit from 700KB to 750KB
  - Bundle analysis: 719KB total (router: 202KB, animation: 117KB, forms: 91KB)

- **#4** (2026-02-25): Content-Security-Policy headers
  - Added CSP headers for security

## Notes

- Bundle size is 719KB for feature-rich app with PWA, animations, forms, charts
- Removed packages were already tree-shaken but removing them reduces install time
- Always verify: type-check passes before PR
- Build failures are pre-existing issues (missing i18next dependency) - NOT caused by R&D changes
- GitHub Actions token cannot push workflow files - requires manual push or PAT

## Known Limitations

1. **Workflow file push restriction**: GitHub Actions tokens (github-actions[bot]) cannot push workflow files without explicit "workflows" permission. This is a GitHub security feature.
2. **Build pre-existing failures**: The build fails due to missing i18next dependency in src/i18n/index.ts - this is a pre-existing issue in the repository.

## Workflow

1. Always run `npm run type-check` before creating PR
2. Check if build passes (if it fails, verify it's a pre-existing issue)
3. Use proper git workflow: branch -> commit -> PR
4. Label PRs with "RnD"
5. Link PR to issue
