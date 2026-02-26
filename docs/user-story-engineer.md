# User Story Engineer - Long-term Memory

## Overview

This document serves as the long-term memory for the User Story Engineer agent.

## Domain

Small, safe, measurable improvements - strictly within the user-story-engineer domain.

## Working Process

### INITIATE Phase

1. Check for existing open PR with `user-story-engineer` label → update/review if exists
2. Check for existing Issues → work on one if available
3. If none → proactive scan limited to domain → create improvement
4. If nothing valuable → scan repository health/efficiency → create PR if needed

### Execution Workflow

1. Explore codebase to find improvement opportunities
2. Validate the change is safe and measurable
3. Implement the fix
4. Verify: Build ✅ Lint ✅ Type-check ✅
5. Create PR with `user-story-engineer` label

### PR Requirements

- Label: `user-story-engineer`
- Linked to issue (if applicable)
- Up to date with default branch
- No conflicts
- Build/lint/test success
- ZERO warnings
- Small atomic diff

## Improvement Patterns Found

### 1. Unused Dependencies

- Use `explore` agent to find unused packages
- Check imports in src/ directory
- Remove from both package.json AND vite.config.ts if present
- Verify build passes after removal

### 2. Code Quality

- Look for missing memo() on components
- Check for any types that can be improved
- Ensure no type errors

## Lessons Learned

### Issue: Edit Tool Complexity

- The edit tool can create duplicate lines if not used carefully
- For simple line removals, `sed -i` is more reliable
- Always verify with `git diff` after changes

### Testing

- Always run build, lint, and type-check before creating PR
- Missing dependencies can be discovered during build (pre-existing issues)
- Keep changes atomic and focused

## Current Work

- PR #138: Removed unused @radix-ui/react-toast dependency
  - Found via explore agent that the package was unused
  - Project uses `sonner` instead for toast notifications
  - Removed from both package.json and vite.config.ts
