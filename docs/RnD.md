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

| Issue | Title | Status | Priority |
|-------|-------|--------|----------|
| #4 | Add Content-Security-Policy headers | Completed | P1 |
| #67 | Bundle Size Optimization | Completed | P2 |

## Past Work

- **#67** (2026-02-25): Bundle Size Optimization
  - Removed 7 unused dependencies (@dnd-kit/core, @dnd-kit/sortable, react-flow, react-select, react-swipeable, react-use, tw-animate-css)
  - Adjusted bundle size limit from 700KB to 750KB
  - Bundle analysis: 719KB total (router: 202KB, animation: 117KB, forms: 91KB)

- **#4** (2026-02-25): Content-Security-Policy headers
  - Added CSP headers for security

## Notes

- Bundle size is 719KB for feature-rich app with PWA, animations, forms, charts
- Removed packages were already tree-shaken but removing them reduces install time
- Always verify: build passes, tests pass, lint passes before PR

| Issue | Title | Status | Priority |
|-------|-------|--------|----------|
| #4 | Add Content-Security-Policy headers | In Progress | P1 |

## Past Work

(Nothing yet - starting fresh)

## Notes

- Always run `npm run build` before creating PR to ensure no regressions
- Run `npm run test:run` to verify all tests pass
- Use proper git workflow: branch -> commit -> PR
