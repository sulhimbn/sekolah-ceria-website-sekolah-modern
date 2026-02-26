# Quality Assurance Specialist - Long-time Memory

## Overview

This document serves as the long-time memory for the quality-assurance specialist agent.

## Project: Sekolah Ceria Website

### Testing Infrastructure

- **Test Runner**: vitest v4.0.18
- **Testing Library**: @testing-library/react v16.3.1
- **DOM Environment**: happy-dom v20.1.0
- **Test Files Pattern**: `**/*.test.{ts,tsx}`

### Current Test Coverage

#### Service Tests (Existing)

- `src/services/news.service.pure.test.ts` - 20 tests
- `src/services/news.service.api.test.ts` - 8 tests
- `src/services/contact.service.validation.test.ts` - 16 tests
- `src/services/contact.service.api.test.ts` - 9 tests

#### Component Tests (Existing)

- `src/components/ui/button.test.tsx` - 22 tests
- `src/components/ui/card.test.tsx` - 15 tests
- `src/components/ui/input.test.tsx` - 21 tests

#### Worker Tests (Added)

- `worker/validators.test.ts` - 27 tests
- `worker/entities.test.ts` - 26 tests

- `worker/validators.test.ts` - 27 tests

### Total Test Count

- **Before**: 191 tests (12 test files)
- **After**: 214 tests (13 test files)
- **New Tests**: 23 worker entity tests added

- **Before**: 164 tests (11 test files)
- **After**: 191 tests (12 test files)
- **New Tests**: 27 worker validator tests added

### Test Execution

- All tests pass: `npm run test:run`
- Lint check passes: `npm run lint`
- Build passes: `npm run build`

### QA Work Completed

#### Issue #126: Add worker backend tests

**Status**: Completed

**Tests Added**:

1. **Worker Validators** (27 tests)
   - contactFormSchema: 6 tests (valid input, empty name, short name, invalid email, short message, whitespace trimming)
   - createUserSchema: 3 tests (valid input, empty name, name too long)
   - createChatSchema: 3 tests (valid input, empty title, title too long)
   - sendMessageSchema: 4 tests (valid input, empty userId, empty text, text too long)
   - deleteManySchema: 3 tests (valid input, empty ids, too many ids)
   - loginSchema: 3 tests (valid input, invalid email, short password)
   - registerSchema: 5 tests (valid input, short name, invalid email, short password, whitespace trimming)

NJ|**Bug Fix**: Discovered and fixed validation bug in validators.ts where `.trim()` was applied AFTER `.regex()` for email fields, causing validation to fail on whitespace-padded inputs. Fixed by reordering to apply `.trim()` before `.regex()`.

#### Issue #174: Expand worker backend test coverage

**Status**: Completed (PR #184)

**Tests Added**:

1. **Worker Entity Tests** (26 tests)
   - UserEntity: entityName, indexName, initialState, seedData structure
   - ChatBoardEntity: entityName, indexName, initialState, seedData, messages mapping
   - NewsArticleEntity: entityName, indexName, initialState, seedData, unique IDs, non-empty titles
   - Entity Relationships: distinct names, valid seed data, message mapping

**Note**: Tests are structured to avoid Cloudflare Workers runtime dependencies by testing entity definitions via mock data.

#### Issue #10: Add component-level tests using React Testing Library

**Status**: Completed

**Tests Added**:

1. **Button Component** (22 tests)
   - Rendering tests (variants, sizes)
   - Interaction tests (click events, disabled state)
   - Accessibility tests (aria-label, type attribute)
   - buttonVariants function tests

2. **Card Component** (15 tests)
   - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter tests
   - Styling class verification
   - Integration tests

3. **Input Component** (21 tests)
   - Rendering tests (types, states)
   - Interaction tests (onChange handling)
   - Accessibility tests (aria-\* props)
   - Form-related props (required, maxLength, etc.)

### Future QA Work

#### Issue #11: Add E2E tests with Playwright

**Status**: Not started
**Notes**: Playwright is already installed (`@playwright/test`). Need to:

1. Configure playwright.config.ts
2. Write E2E tests for critical user flows

### Best Practices Applied

- Proper cleanup using `afterEach` and `cleanup()`
- Using `vi.fn()` for mocking
- Proper test isolation
  #MT|- Accessibility-aware queries (`getByRole`, `getByLabelText`, etc.)
  #YS|- Follow existing test patterns in the codebase
  #YN|- Test both valid and invalid inputs for validation schemas
  #HN|- Fixed validation bugs discovered through testing
  #HP|
  #HZ|

### Current Test Count (2026-02-26 Session)

#QM|
#PQ|- **Before**: 214 tests (13 test files)
#HV|- **After**: 233 tests (14 test files)
#XP|- **New Tests**: 19 hook tests added
#QZ|
#BQ|#### Issue #10 Part 2: Add custom hook tests
#QK|
#KV|**Status**: Completed (PR #195)
#PB|
#JM|**Tests Added**:
#XK|
#JY|1. **API Hook Tests** (19 tests)
#RB| - useNews: fetch articles successfully
#BV| - useNewsSearch: search query functionality, search mode
#VR| - useUsers: fetch users, create user
#XZ| - useContactForm: submit form, error handling, clear error
#JY| - useNewsArticle: fetch by ID, invalid ID, error handling
#JM| - useChats: fetch chats, create chat, empty title validation
#QM| - useChatMessages: load messages, invalid chatId, send message, validation
#YH|
#YQ|**Notes**:
#JM|- Tests use @testing-library/react with TanStack Query testing utilities
#QK|- Mock services (newsService, userService, contactService, chatService)
#HQ|- Mock feature flags and error reporter
#JJ|- 6 API hooks now have test coverage (previously 0 hook tests existed)
#PH|
#HH|

### Future QA Work

#YX|
#HY|#### Remaining Issue #10 Scope:
#QT|
#KY|- Page tests for HomePage not yet implemented
#XZ|- Additional component tests if needed
#QK|
#YZ|- Issue #11: Add E2E tests with Playwright - Not started
#YQ|
#XZ|

### PR Workflow Notes

#QT|
#MB|- PR #195: test: Add API hook tests (Issue #10)
#QM|- Label: quality-assurance added
#XZ|- All 233 tests pass, no regressions
#HZ|- Created branch qa/add-hook-tests-issue-10 from main

### PR #212: Fix type safety and accessibility issues

**Status**: Completed

**Issues Fixed**:

1. **Issue #200: Type safety - worker/auth.ts uses 'as any'**
   - Problem: Auth middleware used `(c as any).user` to set user context
   - Solution: Extended Hono's `ContextVariableMap` with `declare module 'hono'` to properly type user variable
   - Changed 3 occurrences from `(c as any).user` to `c.set('user', payload)` and `c.get('user')`

2. **Issue #201: Accessibility warning - button nested inside button**
   - Problem: `SheetTrigger asChild` wrapped a `Button` component, creating nested `<button>` elements
   - Solution: Applied ghost button styling directly to `SheetTrigger` using className
   - File: `src/components/layout/Header.tsx`

3. **Issue #203: Invalid className prop on anchor tag**
   - Problem: Header test mock passed NavLink's function className directly to `<a>` element
   - Solution: Updated test mock to handle function className by resolving to default classes
   - File: `src/components/layout/Header.test.tsx`

**Verification**:

- All 233 tests pass
- Type check passes (no errors)
- Lint passes (no errors)
- Build passes

**Branch**: `qa/fix-type-safety-and-accessibility-issues`

**Note**: Resolved React warnings in test output:

- `Warning: Invalid value for prop 'className' on <a> tag` - FIXED
- `Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>` - FIXED
