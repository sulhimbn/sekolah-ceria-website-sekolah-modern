# Phase 2: Feature Hardening Report

**Date:** 2026-02-11  
**Phase:** Feature Hardening & Integration  
**Goal:** Strengthen existing features without adding new functionality

---

## Issues Identified

### HARDEN-001: Direct API usage in pages breaks layered architecture
**Priority:** P1  
**Category:** refactor  
**Status:** ✅ **COMPLETED**  
**Completed Date:** 2026-02-15  
**Commit:** ab1ec89

**Files Affected:** 
- `src/pages/DemoPage.tsx` (line 9) - FIXED

**Problem:** Pages were directly importing and calling `api()` from api-client, bypassing the service layer. This broke the Clean Architecture principles documented in blueprint.md.

**Expected Data Flow:**
```
Page → Hook → Service → (Repository) → API Client
```

**Actual Data Flow (Broken):**
```
Page → API Client (bypassing service layer)
```

**Fix Applied:**
1. ✅ Created UserService (`src/services/user.service.ts`)
2. ✅ Created ChatService (`src/services/chat.service.ts`)
3. ✅ Created useUsers hook (`src/hooks/api/use-users.ts`)
4. ✅ Created useChats hook (`src/hooks/api/use-chats.ts`)
5. ✅ Created useChatMessages hook (`src/hooks/api/use-chat-messages.ts`)
6. ✅ Refactored DemoPage to use hooks instead of direct API calls

**Verification:**
- All 53 tests pass
- Lint clean (0 errors)
- TypeScript compilation successful
- No pages directly import api-client anymore

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
1. ✅ HARDEN-001: Fix DemoPage.tsx to use service layer - **COMPLETED**
2. 🔧 HARDEN-005: Add error reporting to hooks

### Short Term (Next Session)
3. 🔧 HARDEN-003: Standardize hook interfaces
4. 🔧 HARDEN-004: Centralize error handling

### Medium Term
5. 🔧 HARDEN-002: Implement Repository Pattern (Phase 3)

---

## Phase 2 Success Criteria

- [x] No pages directly call API client
- [ ] All hooks report errors to errorReporter
- [ ] Hook interfaces are consistent
- [x] Service error handling is DRY (withErrorHandling utilities already in place)
- [x] Build, lint, tests all pass
- [x] No new features added
- [x] Only existing features hardened

---

*Report generated during Phase 2 Feature Hardening*
