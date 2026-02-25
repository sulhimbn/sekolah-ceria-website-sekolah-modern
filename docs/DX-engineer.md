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

---

#### 2026-02-25: Add Prettier code formatter with ESLint integration

**Changes:**

- Added `prettier` and `eslint-config-prettier` as dev dependencies
- Created `.prettierrc` configuration file with standard settings
- Integrated prettier config into `eslint.config.js` (must be last)
- Added `format` script: `prettier --write .` - formats all files
- Added `format:check` script: `prettier --check .` - checks formatting without modifying

**Prettier Configuration (.prettierrc):**

- `semi`: true - Use semicolons
- `singleQuote`: true - Use single quotes
- `tabWidth`: 2 - 2 spaces for indentation
- `trailingComma`: es5 - Trailing commas where valid in ES5
- `printWidth`: 80 - Line width
- `bracketSpacing`: true - Space between brackets and props
- `arrowParens`: avoid - Omit parens when possible
- `endOfLine`: lf - Unix line endings

**Rationale:**

- Prettier provides opinionated, consistent code formatting
- `eslint-config-prettier` disables ESLint rules that conflict with Prettier
- Having both `format` and `format:check` allows CI/CD validation
- Prettier config must be LAST in eslint.config.js to properly override conflicting rules

**Files Modified:**

- `package.json` - Added prettier, eslint-config-prettier and format scripts
- `.prettierrc` - Created new Prettier configuration
- `eslint.config.js` - Added prettier import and config

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
