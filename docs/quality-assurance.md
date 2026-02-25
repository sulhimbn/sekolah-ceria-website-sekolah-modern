# Quality Assurance Specialist - Long-time Memory

## Overview
This document serves as the long-time memory for the quality-assurance specialist agent.

## Project: Sekolah Ceria Website

### Testing Infrastructure
- **Test Runner**: vitest v4.0.17
- **Testing Library**: @testing-library/react v16.3.1
- **DOM Environment**: happy-dom v20.1.0
- **Test Files Pattern**: `**/*.test.{ts,tsx}`

### Current Test Coverage

#### Service Tests (Existing)
- `src/services/news.service.pure.test.ts` - 20 tests
- `src/services/news.service.api.test.ts` - 8 tests
- `src/services/contact.service.validation.test.ts` - 16 tests
- `src/services/contact.service.api.test.ts` - 9 tests

#### Component Tests (Added)
- `src/components/ui/button.test.tsx` - 22 tests
- `src/components/ui/card.test.tsx` - 15 tests
- `src/components/ui/input.test.tsx` - 21 tests

### Total Test Count
- **Before**: 53 tests (4 test files)
- **After**: 111 tests (7 test files)
- **New Tests**: 58 component tests added

### Test Execution
- All tests pass: `npm run test:run`
- Lint check passes: `npm run lint`
- Build passes: `npm run build`

### QA Work Completed

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
   - Accessibility tests (aria-* props)
   - Form-related props (required, maxLength, etc.)

### Future QA Work

#### Issue #11: Add E2E tests with Playwright
**Status**: Not started
**Notes**: Playwright is not installed. Would need to:
1. Install @playwright/test
2. Configure playwright.config.ts
3. Write E2E tests for critical user flows

### Best Practices Applied
- Proper cleanup using `afterEach` and `cleanup()`
- Using `vi.fn()` for mocking
- Proper test isolation
- Accessibility-aware queries (`getByRole`, `getByLabelText`, etc.)
- Follow existing test patterns in the codebase
