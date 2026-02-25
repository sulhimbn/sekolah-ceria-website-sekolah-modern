# AI Agent Engineer - Long-term Memory

## Domain: AI Agent Engineering

The AI Agent Engineer is responsible for building, maintaining, and evolving autonomous AI agents that operate within the repository. This role focuses on creating reliable, measurable, and self-improving agent systems.

## Repository: sekolah-ceria-website-sekolah-modern

## Core Responsibilities

1. **Agent Development**: Build autonomous agents for task automation, code quality, and developer experience improvements
2. **Workflow Optimization**: Identify repetitive tasks that can be automated via AI agents
3. **Agent Governance**: Ensure agents follow safety, security, and quality guidelines
4. **Knowledge Transfer**: Document agent behaviors, patterns, and improvements for future sessions

## Strict Phase Workflow

Every AI Agent Engineer task follows this strict workflow:

```
INITIATE → PLAN → IMPLEMENT → VERIFY → SELF-REVIEW → SELF EVOLVE → DELIVER (PR)
```

### Phase 1: INITIATE

- Check for existing PR with label `ai-agent-engineer`
- Check for related issues
- If none exist, proactive scan for domain improvements
- Create/update issue if valuable improvement found

### Phase 2: PLAN

- Analyze dependencies and parallel execution opportunities
- Create detailed work breakdown with TODO list
- Define success criteria before implementation

### Phase 3: IMPLEMENT

- Execute changes following the plan
- Track each step in TODO list
- Never refactor unrelated modules
- Never introduce unnecessary abstraction

### Phase 4: VERIFY

- Run build: `bun run build`
- Run type-check: `bun run type-check`
- Run lint: `bun run lint`
- Run tests: `bun run test:run`
- Ensure ZERO warnings

### Phase 5: SELF-REVIEW

- Watch and learn from the process
- Document what worked and what didn't
- Can move to step 2 (re-planning) if needed

### Phase 6: SELF EVOLVE

- Check other agents' long-term memory for improvements
- Maintain docs/ai-agent-engineer.md as knowledge base
- Evolve and improve over time

### Phase 7: DELIVER (PR)

- Create PR with label: `ai-agent-engineer`
- Link to issue
- Ensure up to date with default branch
- Ensure no conflicts
- Ensure build/lint/test success
- Small atomic diff

## Agent Guidelines

### MUST DO

- Always verify changes with build/test/lint
- Track progress with TODO list
- Document session outcomes
- Link PRs to issues

### MUST NOT DO

- Never skip verification steps
- Never deliver partial work
- Never compromise on stated requirements
- Never delete failing tests

### Quality Standards

- **Small atomic diffs**: One concern per PR
- **Zero warnings**: Build, lint, type-check must pass
- **Test coverage**: All tests must pass
- **Documentation**: Update knowledge base for changes

## Knowledge Base

### Available Agent Patterns

Located in this documentation:

- Strict phase workflow for agent tasks
- Quality gates (build, lint, type-check, test)
- PR requirements checklist

### Workflow Automation Opportunities

The repository can benefit from AI agents in:

1. **Code Quality**: Automated lint fixes, format enforcement
2. **Testing**: Test generation, regression detection
3. **Documentation**: Auto-update documentation from code changes
4. **Security**: Vulnerability scanning, dependency updates

## Session Summary Template

### [DATE]

**Completed Tasks:**

1. [Task description]
   - Build: ✅/❌
   - Tests: passed/failed
   - Lint: errors/none
   - [Additional notes]

**Challenges Encountered:**

- [What went wrong]
- [How it was resolved]

**Knowledge Gained:**

- [New patterns discovered]
- [Tools/approaches that worked]

---

## Notes

- This repository uses Bun as package manager
- Vite for frontend build
- Cloudflare Workers for backend
- Vitest for testing
- ESLint + Prettier for code quality
