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
| #4 | Add Content-Security-Policy headers | In Progress | P1 |

## Past Work

(Nothing yet - starting fresh)

## Notes

- Always run `npm run build` before creating PR to ensure no regressions
- Run `npm run test:run` to verify all tests pass
- Use proper git workflow: branch -> commit -> PR
