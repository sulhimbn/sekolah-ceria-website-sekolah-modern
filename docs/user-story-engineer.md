# User Story Engineer - Long Term Memory

## Domain Focus

- Deliver small, safe, measurable improvements strictly inside the user-story-engineer domain
- Focus on user-facing features and UX improvements

## Workflow

1. **INITIATE**: Check for existing user-story-engineer PRs or issues
2. **PLAN**: Identify suitable issues for the domain
3. **IMPLEMENT**: Make small, atomic changes
4. **VERIFY**: Build, lint, and test must pass
5. **SELF-REVIEW**: Review changes for quality
6. **SELF EVOLVE**: Maintain documentation
7. **DELIVER**: Create PR with proper labels

## Issue Selection Criteria

- User-facing bug or enhancement
- Small and atomic (single focused change)
- Measurable outcome
- No breaking changes

## Implementation Guidelines

- Keep diff small (< 50 lines if possible)
- Follow existing code patterns
- Include proper validation
- Add error handling

## PR Requirements

- Label: `user-story-engineer`
- Linked to issue
- Up to date with default branch
- No conflicts
- Build/lint/test success

## Notes

- **Issue #175 (tabnabbing vulnerability)**: Already fixed in PR #179 - all `target="_blank"` links have `rel="noopener noreferrer"`. Issue was closed.

- **Issue #142 (duplicate ContactFormData type)**: Fixed in PR #192
  - Moved `ContactFormData` and `ContactResponse` to `shared/types.ts`
  - Updated imports in `contact.repository.interface.ts` and `contact.service.ts`
  - Eliminates DRY violation from duplicate type definitions

- **Issue #144**: Newsletter form API integration
  - Added validator in worker/validators.ts
  - Added API endpoint in worker/user-routes.ts
  - Updated Footer.tsx to use real API

#XB|- **Issue #143**: Skeleton components refactor
QM| - Moved skeleton components from src/hooks/ to src/components/
KQ| - Removed duplicate skeleton code from HomePage, NewsPage, NewsDetailPage
YV| - Created reusable NewsCardSkeleton and NewsDetailSkeleton components

- **Issue #229**: React.memo consistency for UI components
  - Added React.memo to input.tsx, textarea.tsx, label.tsx, alert.tsx
  - Follows existing pattern from Button component (memo wrapping forwardRef)
  - Prevents unnecessary re-renders in frequently updating contexts
  - Fixed in PR #240
  - Moved skeleton components from src/hooks/ to src/components/
  - Removed duplicate skeleton code from HomePage, NewsPage, NewsDetailPage
  - Created reusable NewsCardSkeleton and NewsDetailSkeleton components
