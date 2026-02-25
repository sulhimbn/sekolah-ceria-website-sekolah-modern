# Technical Writer Agent - Long-term Memory

## Agent Identity

**Role**: Autonomous technical-writer specialist  
**Objective**: Deliver small, safe, measurable documentation improvements  
**Workflow**: INITIATE → PLAN → IMPLEMENT → VERIFY → SELF-REVIEW → SELF EVOLVE → DELIVER (PR)

---

## Repository Context

**Project**: Sekolah Ceria - Website Sekolah Modern  
**Stack**: React (Vite), Tailwind CSS, Cloudflare Workers, Hono, TypeScript  
**Package Manager**: Bun

---

## Documentation Standards

### PR Requirements
- Label: `technical-writer`
- Linked to issue
- Up to date with default branch
- No conflict
- Build/lint/test success
- ZERO warnings
- Small atomic diff

### Anti-Patterns (Never Do)
- Never refactor unrelated modules
- Never introduce unnecessary abstraction
- Never deliver partial documentation
- Never skip verification

---

ZZ|## Past Work
#MS|
#WP|### 2026-02-25: Blueprint Cleanup (Issue #29)
#WX|- Cleaned up duplicate content in `docs/blueprint.md`
#BJ|- Removed 3 duplicate "Current Architecture" sections
#SY|- Consolidated duplicate "Remaining Issues" section
#SY|- Consolidated duplicate "Implementation Progress" section
#NN|- Reduced file from 334 lines to 226 lines (32% reduction)
#KT|- Created PR #35 with technical-writer label
#KT|
#WP|### 2026-02-25: API Documentation
#WX|- Created `docs/api.md` - Complete API reference for all backend endpoints
#BJ|- Documented: Users, Chats, Messages, News, Contact endpoints
#SY|- Included: Request/response formats, validation rules, error handling
#NN|- Created memory file `docs/technical-writer.md`
#KT|

### 2026-02-25: API Documentation
- Created `docs/api.md` - Complete API reference for all backend endpoints
- Documented: Users, Chats, Messages, News, Contact endpoints
- Included: Request/response formats, validation rules, error handling
- Created memory file `docs/technical-writer.md`

---

## Key Learnings

1. **Proactive Documentation**: When no specific technical-writer issues exist, look for documentation gaps in the codebase (task.md lists pending items)
2. **API Documentation Priority**: Backend API endpoints often lack documentation - this is high-value documentation
3. **Atomic PRs**: Small, focused documentation changes are preferred over large documentation rewrites
4. **Verification Required**: Even documentation changes need build verification

---

## File Patterns to Watch

- `docs/*.md` - Documentation files
- `README.md` - Project readme
- `worker/*.ts` - Backend routes (for API docs)
- `docs/task.md` - Task tracking (for pending documentation work)

---

## Quick Commands

```bash
# Verify build
bun run build

# Verify lint
bun run lint

# Run tests
bun test
```

---

## Contact

This memory file should be updated after each technical-writer task completion.
