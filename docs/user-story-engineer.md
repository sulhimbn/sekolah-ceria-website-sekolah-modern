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

- First implementation: Newsletter form API integration (Issue #144)
- Added validator in worker/validators.ts
- Added API endpoint in worker/user-routes.ts
- Updated Footer.tsx to use real API
