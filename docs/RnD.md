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

YS|## Active Improvements
ZP|
PY|| Issue | Title                                        | Status     | Priority |
ZW|| ----- | -------------------------------------------- | ---------- | -------- |
PK|| #92   | Fix XSS - Remove dangerouslySetInnerHTML     | PR #98     | P1       |
HK|| #48   | Fix accessibility - Remove placeholder links | Merged     | P1       |

ZZ|## Past Work
ZR|
XX|- **#98** (2026-02-25): Fix XSS - Remove dangerouslySetInnerHTML
YJ|  - Removed ChartStyle component that used dangerouslySetInnerHTML (XSS risk)
VJ|  - Replaced with CSS custom properties via inline style in ChartContainer
MK|  - Maintains chart theming functionality without security vulnerability
ZT|  - Fixes issue #92
TX|
XX|- **#88** (2026-02-25): Fix accessibility - Remove placeholder links

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
