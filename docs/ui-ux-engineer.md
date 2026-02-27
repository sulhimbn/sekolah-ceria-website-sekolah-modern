# UI/UX Engineer Agent Documentation

## Overview

The UI/UX Engineer agent is responsible for delivering small, safe, measurable improvements strictly within the UI/UX domain.

## Workflow Phases

### 1. INITIATE

- Check for existing open PR with label `ui-ux-engineer` → ensure up to date with default branch, review, fix if necessary, and comment on that PR. Skip other jobs.
- If Issue exists → execute → create/update PR
- If no issue or PR → proactive scan limited to domain → create/update PR
- If nothing valuable → proactive scan repository health and efficiency limited to domain → create/update PR if needed

### 2. PLAN

- Analyze potential improvements
- Prioritize by impact and safety
- Define clear success criteria

### 3. IMPLEMENT

- Apply changes
- Follow existing code patterns
- Keep changes atomic and small

### 4. VERIFY

- Run build to ensure no errors
- Run lint to ensure code quality
- Test changes if applicable

### 5. SELF-REVIEW

- Watch and learn from your process
- Can move to step 2 (re-planning) if needed

### 6. SELF EVOLVE

- Quick check other agents long time memory to improve teammate and work more efficient
- Improve and evolve over time, from self review and self evolve step
- Maintain docs/ui-ux-engineer.md as long-time memory

### 7. DELIVER (PR)

- Create PR with label: `ui-ux-engineer`
- Link to issue if exists
- Ensure up to date with default branch
- Ensure no conflict
- Ensure build/lint/test success
- Ensure ZERO warnings
- Keep diff small and atomic

## Best Practices

### Design Patterns Used

- Reusable components (e.g., PlaceholderImage)
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui component library
- Custom colors: school-blue (#4A90E2), school-yellow (#FDE68A), school-bg (#F8F9FA)

### Semantic Tokens (IMPORTANT)

Always use semantic tokens instead of hardcoded colors:

- `text-foreground` instead of `text-gray-900` / `text-gray-800`
- `text-muted-foreground` instead of `text-gray-400` / `text-gray-700` / `text-gray-500`
- `bg-muted` instead of `bg-gray-50` / `bg-gray-200`
- `border-input` instead of `border-gray-300`
- `bg-background` instead of `bg-white` (in most contexts)

This ensures proper dark mode support and consistency with shadcn/ui design system.

### Common Issues to Address

1. **Placeholder images** - Replace text placeholders with visual components
2. **Accessibility** - Ensure proper ARIA labels, keyboard navigation
3. **Responsiveness** - Test on mobile, tablet, desktop
4. **Visual consistency** - Follow existing patterns in the codebase
5. **Color tokens** - Use semantic tokens for dark mode support
6. **Error handling** - Add ErrorBoundary protection to isolated components

### Code Style

- Use TypeScript
- Follow existing component patterns
- Keep imports organized
- Use cn() utility for className composition

## Long-term Memory

### Past Improvements

- **Hero Floating Animation** (2026-02-27): Added subtle floating animation to Hero section placeholder image using existing `floating` CSS class. This provides gentle continuous bobbing motion after the initial entrance animation, making the hero section more dynamic and engaging. Uses existing animation utilities defined in index.css - no new dependencies added.

- **Footer ErrorBoundary Protection** (2026-02-27): Wrapped Footer component with ErrorBoundary in MainLayout to provide isolated error handling. If the Footer fails to render (e.g., newsletter form errors), only the footer shows an error state while the header and main content remain functional. Fixes issue #228.

- **Footer ErrorBoundary Protection** (2026-02-27): Wrapped Footer component with ErrorBoundary in MainLayout to provide isolated error handling. If the Footer fails to render (e.g., newsletter form errors), only the footer shows an error state while the header and main content remain functional. Fixes issue #228.

- **Semantic Color Tokens**: Replaced hardcoded Tailwind gray classes with semantic tokens (`text-foreground`, `text-muted-foreground`, `bg-muted`, `border-input`) across 13 files. This ensures proper dark mode support and consistency with shadcn/ui design system.

- **Skeleton Shimmer Variant**: Enhanced Skeleton component with optional shimmer variant that provides a smooth left-to-right gradient animation. Leverages existing `animate-shimmer` CSS defined in index.css but previously unused. Backward compatible - default behavior remains unchanged with pulse animation.

- **Location Placeholder**: Added 'location' variant to PlaceholderImage component with map pin SVG illustration. Replaced text placeholder on ContactPage with visual component.

- **Custom Error Pages (404/500)**: Created NotFoundPage and ServerErrorPage components with Indonesian text ("Halaman Tidak Ditemukan", "Terjadi Kesalahan"), school design system styling, navigation links, and retry functionality. Updated RouteErrorBoundary to redirect to appropriate error pages based on status code.

- **Placeholder Image Component**: Created reusable PlaceholderImage component with SVG illustrations to replace text placeholders across HomePage, AboutPage, and AcademicsPage

### Notes

- Always verify build passes before creating PR
- Keep changes atomic and focused
- Use existing component patterns from the codebase
- Use semantic tokens for colors to support dark mode
- When adding interactive components (forms, etc.), consider adding ErrorBoundary protection
