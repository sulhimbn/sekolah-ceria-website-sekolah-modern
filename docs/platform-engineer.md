# Platform Engineering - Long-term Memory

## Overview

Sekolah Ceria is a Cloudflare Pages + Workers application with React/Vite frontend and Hono backend.

## Infrastructure

- **Hosting**: Cloudflare Pages (frontend) + Cloudflare Workers (backend)
- **Runtime**: Cloudflare Durable Objects for stateful data
- **Package Manager**: Bun
- **Build Tool**: Vite

## CI/CD Workflows

### Workflow Files

|| `main.yml` | Deployment | Manual/Scheduled |

### Action Versions

All GitHub Actions should use consistent, pinned versions:

| Action                | Recommended Version | Purpose             |
| --------------------- | ------------------- | ------------------- |
| `actions/checkout`    | v6                  | Repository checkout |
| `actions/cache`       | v5                  | Dependency caching  |
| `actions/setup-node`  | v6                  | Node.js setup       |
| `softprops/turnstyle` | v3                  | Concurrency control |

### Node.js Setup

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: 20
    cache: 'npm'
    cache-dependency-path: '**/package-lock.json' # Explicit path required
```

**Important**: Always specify explicit `cache-dependency-path` to ensure correct cache invalidation.

## Caching Strategy

### NPM Cache

- Path: `**/package-lock.json`
- Why: Ensures cache invalidation when dependencies change

### Build Cache

- Vite cache: `.vite` directory
- Add to `.gitignore` for clean rebuilds

## Common Commands

```bash
# Development
bun dev

# Build
bun run build

# Lint
bun run lint

# Test
bun run test

# Deploy
bun run deploy
```

## Environment Variables

Required secrets for CI:

- `GITHUB_TOKEN`
- `IFLOW_API_KEY`
- `SUPABASE_SECRET_KEY`
- `VITE_SUPABASE_KEY`
- `VITE_SUPABASE_URL`

## Best Practices

1. **Always sync with default branch** before creating PRs
2. **Run full CI** (build, lint, test) before committing
3. **Use explicit cache paths** in GitHub Actions
4. **Keep workflow versions pinned** for reproducibility

## Issue Labels

- `ci` - CI/CD improvements
- `platform-engineer` - Platform engineering tasks

## Recent Fixes

### 2026-02-26: ESLint packages in wrong dependencies

**Issue**: ESLint packages (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-import-resolver-typescript`, `eslint-plugin-import`) were incorrectly placed in `dependencies` instead of `devDependencies`.

**Fix**: Moved all ESLint-related packages to `devDependencies` in `package.json`.

**Impact**: Reduced production bundle size by ~5MB.

**Lesson**: Always verify package.json dependencies are correct - dev tools belong in devDependencies, not dependencies.

- `ci` - CI/CD improvements
- `platform-engineer` - Platform engineering tasks

## Related Documentation

- [Blueprint](./blueprint.md) - Architecture overview
- [Phase1 Diagnostic Report](./phase1-diagnostic-report.md) - Quality assessment
