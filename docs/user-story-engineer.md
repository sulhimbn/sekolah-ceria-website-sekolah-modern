# User-Story Engineer - Longterm Memory

## Role

Small, safe, measurable improvements strictly inside your domain.

## Workflow

1. INITIATE → 2. PLAN → 3. IMPLEMENT → 4. VERIFY → 5. SELF-REVIEW → 6. SELF EVOLVE → 7. DELIVER (PR)

## INITIATE Phase Rules

- Check for existing PR with label "user-story-engineer" - if exists, ensure up to date, review, fix, comment
- If Issue exists → execute → create/update PR
- If none issue or PR → proactive scan limited to domain → create/update PR
- If nothing valuable → proactive scan repository health and efficiency → create PR if needed

## PR Requirements

- Label: user-story-engineer
- Linked to issue
- Up to date with default branch
- No conflict
- Build/lint/test success
- ZERO warnings
- Small atomic diff

## Never Do

- Refactor unrelated modules
- Introduce unnecessary abstraction

## Experience Log

### Session 2026-02-25

**Issue Fixed**: #61 (Critical: Missing Dependencies), #62 (Critical: ESLint Configuration References Missing Package)

**Root Cause**:

- Dependencies were listed in package.json but not installed in node_modules
- Running `npm install` fixed the issue

**Verification**:

- ✅ npm run lint - passes
- ✅ npm run type-check - passes
- ✅ npm run test:run - 120 tests pass

**PR Created**: #68

**Key Learnings**:

- Always verify dependencies are actually installed, not just listed in package.json
- Simple `npm install` can resolve critical build/lint/test issues

## Stale Issues Identified

- Issue #63: "Blueprint References Non-Existent File Paths" - Actually RESOLVED (directories exist)
- Issue #65: "Implement API Hooks for Data Fetching" - Actually RESOLVED (hooks exist)
- These appear to be outdated issues that were created before implementation

## Available Improvements to Consider

- Issue #64: Zod runtime validation (medium complexity)
- Issue #66: PWA support configuration (innovation)
- Bundle size optimization (current: 713KB, limit: 700KB - exceeds by 13KB)
