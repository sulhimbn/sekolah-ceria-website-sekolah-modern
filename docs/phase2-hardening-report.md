# Phase 2: Feature Hardening Report

**Date:** 2026-02-11  
**Phase:** Feature Hardening & Integration  
**Goal:** Strengthen existing features without adding new functionality

---

## Issues Identified

### HARDEN-001: Direct API usage in pages breaks layered architecture
**Priority:** P1  
**Category:** refactor  
**Files Affected:** 
- `src/pages/HomePage.tsx` (line 9, 19)
- `src/pages/DemoPage.tsx` (line 9)

**Problem:** Pages are directly importing and calling `api()` from api-client, bypassing the service layer. This breaks the Clean Architecture principles documented in blueprint.md.

**Expected Data Flow:**
```
Page → Hook → Service → (Repository) → API Client
```

**Actual Data Flow (Broken):**
```
Page → API Client (bypassing service layer)
```

**Impact:**
- Business logic scattered in pages
- Harder to test (can't mock services)
- Inconsistent error handling
- Violates separation of concerns

**Fix:**
1. Create NewsService method for fetching latest news
2. Create useLatestNews hook
3. Update HomePage to use the hook instead of direct API call
4. Update DemoPage similarly

---

### HARDEN-002: Service layer tightly coupled to API client
**Priority:** P2  
**Category:** refactor  
**Files Affected:**
- `src/services/news.service.ts`
- `src/services/contact.service.ts`

**Problem:** Services directly import `api` from api-client, creating tight coupling between business logic and transport layer.

**Impact:**
- Cannot easily swap data sources (e.g., for testing)
- Harder to implement caching strategies
- Repository pattern cannot be introduced without refactoring services

**Fix:**
Per blueprint.md Phase 3, implement Repository Pattern:
1. Create repository interfaces
2. Move API calls to repository implementations
3. Inject repositories into services
4. Services depend on abstractions, not implementations

---

### HARDEN-003: Inconsistent hook interfaces
**Priority:** P2  
**Category:** refactor  
**Files Affected:**
- `src/hooks/api/use-news.ts`
- `src/hooks/api/use-contact-form.ts`
- `src/hooks/api/use-news-article.ts`

**Problem:** Hooks expose different interfaces:
- `useNews`: `{ articles, isLoading, error, refetch }`
- `useContactForm`: `{ isSubmitting, error, submitContactForm, clearError }`
- `useNewsArticle`: (not yet examined)

**Impact:**
- Inconsistent developer experience
- Harder to abstract common patterns
- No standardized error handling interface

**Fix:**
Standardize hook interface pattern:
```typescript
interface ApiHookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  // Action methods
  execute: (...args: unknown[]) => Promise<void>;
  // Utility methods
  reset: () => void;
  retry: () => Promise<void>;
}
```

---

### HARDEN-004: Error handling duplication across services
**Priority:** P2  
**Category:** refactor  
**Files Affected:**
- `src/services/news.service.ts` (lines 22-24, 31-36)
- `src/services/contact.service.ts` (lines 32-34)

**Problem:** Similar try-catch-error-throw patterns repeated in every service method.

**Impact:**
- Code duplication
- Inconsistent error messages
- Harder to change error handling strategy

**Example Duplication:**
```typescript
// news.service.ts
try {
  const response = await api<...>(...);
  return response.items;
} catch (error) {
  throw new Error(MESSAGES.NEWS.LOAD_FAILED);
}

// contact.service.ts
try {
  const response = await api<...>(...);
  return { message: ..., success: true };
} catch (error) {
  throw new Error(MESSAGES.CONTACT.SEND_FAILED);
}
```

**Fix:**
1. Create service-level error wrapper utility
2. Or move error handling to repository layer
3. Use interceptors or middleware pattern

---

### HARDEN-005: Missing error propagation to error reporter
**Priority:** P1  
**Category:** bug  
**Files Affected:**
- `src/hooks/api/use-news.ts`
- `src/hooks/api/use-news-article.ts`
- `src/hooks/api/use-contact-form.ts`

**Problem:** Hooks catch errors and set error state but don't report to errorReporter for monitoring.

**Impact:**
- Errors not tracked in production
- No visibility into user-facing errors
- Missing error analytics

**Fix:**
Add errorReporter.report() calls in all hooks' catch blocks.

---

## Implementation Plan

### Immediate (This Session)
1. ✅ HARDEN-001: Fix HomePage.tsx to use service layer
2. 🔧 HARDEN-005: Add error reporting to hooks

### Short Term (Next Session)
3. 🔧 HARDEN-003: Standardize hook interfaces
4. 🔧 HARDEN-004: Centralize error handling

### Medium Term
5. 🔧 HARDEN-002: Implement Repository Pattern (Phase 3)

---

## Phase 2 Success Criteria

- [ ] No pages directly call API client
- [ ] All hooks report errors to errorReporter
- [ ] Hook interfaces are consistent
- [ ] Service error handling is DRY
- [ ] Build, lint, tests all pass
- [ ] No new features added
- [ ] Only existing features hardened

---

*Report generated during Phase 2 Feature Hardening*
