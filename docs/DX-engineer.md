# DX-engineer Long-term Memory

## Repository: sekolah-ceria-website-sekolah-modern

### DX Improvements Applied

#### 2026-02-25: Add type-check and lint scripts

**Changes:**
- Added `type-check` script: `tsc --noEmit` - enables TypeScript type validation
- Added `lint:fix` script: `eslint --cache --fix .` - auto-fix lint issues

**Rationale:**
- TypeScript projects should have type checking as a separate, runnable script
- Developers need an easy way to auto-fix lint issues without manual intervention
- These are fundamental DX improvements that improve developer workflow

**Files Modified:**
- `package.json` - Added new npm scripts
