# CI Pipeline Documentation

## Overview

This document describes the proposed traditional CI pipeline to complement the existing AI agent workflows.

## Problem

The project has AI agent orchestration workflows but lacks a traditional CI pipeline that runs:

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run test`

## Solution

### Option 1: Separate CI Workflow (Recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    name: CI Pipeline
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Test
        run: npm run test:run
```

### Option 2: Add CI Job to main.yml

Add a `ci-checks` job to the existing `.github/workflows/main.yml` that runs before the architect stage.

## Acceptance Criteria

- [ ] CI workflow added
- [ ] Runs lint, type-check, build, test
- [ ] Required status check for PRs
- [ ] Fast feedback loop (< 5 min)

## Impact

This is a 10x leverage improvement - prevents bad code from reaching main, reducing debug time and improving trust in the codebase.

**Impact Surface:** DevEx, System
