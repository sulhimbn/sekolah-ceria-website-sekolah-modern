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
- Accessibility-aware queries (`getByRole`, `getByLabelText`, etc.)
- Follow existing test patterns in the codebase
- Test both valid and invalid inputs for validation schemas
- Fixed validation bugs discovered through testing

### PR Workflow Notes

- **2026-02-26**: Fixed PR #133 which was out of date with main and contained unrelated commits. Created new PR #150 with clean, atomic changes rebased on current main.
- Always verify PR branches are up to date with main before merging
- Cherry-pick only relevant commits when recreating PRs
