# Research: Project Initialization Technology Decisions

**Feature**: Project Initialization with Bun and Astro
**Date**: 2025-11-06
**Status**: Resolved

## Overview

This document resolves the three clarifications identified in the Constitutional Check phase:
1. Linting tool choice: Biome vs ESLint + Prettier
2. Testing framework: Bun's built-in test runner vs Vitest
3. UI component integration: Pure Astro components vs React/Vue Islands

## Decision 1: Linting Tool Choice

### Decision: **Biome**

### Rationale

**Performance & Integration**:
- Biome is written in Rust, providing 10-100x faster linting and formatting compared to ESLint + Prettier
- Single tool replaces two (ESLint + Prettier), reducing configuration complexity
- Native support for TypeScript, JavaScript, JSON, and CSS
- Aligns with Bun's performance-first philosophy (both are native, fast tools)

**Developer Experience**:
- Single configuration file (`biome.json`) vs multiple config files
- Built-in formatter eliminates Prettier dependency
- Faster CI/CD pipeline execution due to speed improvements
- Active development and growing ecosystem

**Constitutional Alignment**:
- **Principle III (Build Optimization)**: Faster linting reduces build time
- **Principle IV (Developer Experience)**: Simpler configuration, faster feedback
- **Principle VI (Tooling Excellence)**: Modern, performant tooling that aligns with Bun runtime

### Alternatives Considered

**ESLint + Prettier** (rejected):
- **Pros**: Larger ecosystem, more plugins, industry standard
- **Cons**: Slower performance, requires two tools and configurations, redundant with Bun's performance goals
- **Why Rejected**: While more established, the performance overhead and configuration complexity contradict the "minimal" initialization goal and Principle VI (Tooling Excellence)

### Implementation Notes

- Use `@biomejs/biome` package via Bun
- Configure `biome.json` with recommended Astro rules
- Add scripts: `bun run lint`, `bun run format`
- Integrate with VS Code via Biome extension
- Pre-commit hook for automatic formatting

### Validation

- ✅ Aligns with Principle VI (Tooling Excellence): Modern, performant tooling
- ✅ Aligns with Principle III (Build Optimization): Faster linting/formatting
- ✅ Aligns with Principle IV (Developer Experience): Simpler configuration
- ✅ Supports TypeScript, JavaScript, JSON, CSS (all required for Astro projects)

---

## Decision 2: Testing Framework

### Decision: **Bun's Built-in Test Runner**

### Rationale

**Native Integration**:
- No additional dependencies required (Bun includes test runner out-of-the-box)
- Compatible with Jest-like syntax (describe, test, expect)
- Native TypeScript support without configuration
- Faster test execution compared to Vitest (2-10x in benchmarks)

**Performance**:
- Leverages Bun's fast runtime for test execution
- Parallel test execution by default
- Hot module reloading for test-driven development
- Aligns with <30s build time target (faster tests = faster CI)

**Constitutional Alignment**:
- **Principle III (Build Optimization)**: Faster test execution improves CI/CD pipeline
- **Principle IV (Developer Experience)**: No additional setup, native TypeScript support
- **Principle VI (Tooling Excellence)**: Use Bun's native capabilities, avoid redundant tools

### Alternatives Considered

**Vitest** (rejected):
- **Pros**: More mature, better tooling (VS Code extension, UI), larger ecosystem
- **Cons**: Additional dependency, slower than Bun test runner, requires configuration
- **Why Rejected**: For a minimal initialization, Bun's native test runner eliminates a dependency while providing sufficient functionality. Vitest can be added later if advanced features are needed (UI, coverage visualization).

### Implementation Notes

- Use Bun's built-in test runner: `bun test`
- Place tests in `tests/` directory with `.test.ts` or `.spec.ts` extensions
- Add script: `bun run test` (alias for `bun test`)
- Configure in `package.json` scripts section
- No additional test dependencies required

### Validation

- ✅ Aligns with Principle VI (Tooling Excellence): Use Bun's native features
- ✅ Aligns with Principle III (Build Optimization): Faster test execution
- ✅ Aligns with Principle IV (Developer Experience): Zero-config testing
- ✅ Supports TypeScript natively (no transpilation needed)

---

## Decision 3: UI Component Integration

### Decision: **Pure Astro Components (with Islands Architecture ready for future needs)**

### Rationale

**Zero-JavaScript Initial Load**:
- Pure Astro components compile to static HTML with 0KB JavaScript by default
- Aligns perfectly with Principle I (Performance First): 0KB JavaScript initial load
- Meets Core Web Vitals targets more easily without framework overhead

**Progressive Enhancement**:
- Astro Islands architecture allows selective hydration when needed
- Can add React/Vue components later for complex interactivity (e.g., interactive animations, forms)
- Start simple, add complexity only when justified
- GSAP animations can be used with vanilla JS (no framework needed)

**Constitutional Alignment**:
- **Principle I (Performance First)**: 0KB JavaScript initial load via Astro Islands architecture
- **Principle IV (Developer Experience)**: Simpler components, less framework overhead
- **Performance Budget**: Maximizes JavaScript budget for GSAP/Lenis rather than framework code

### Alternatives Considered

**React Islands** (deferred, not rejected):
- **Pros**: Rich ecosystem, advanced interactivity patterns, React developer familiarity
- **Cons**: Adds framework overhead (~40-50KB for React runtime), unnecessary for static content
- **Why Deferred**: Not needed for minimal initialization. Can be added later via `bun add react react-dom` + `@astrojs/react` integration when complex interactive components are required.

**Vue Islands** (deferred, not rejected):
- **Pros**: Smaller bundle than React (~30KB), simpler component syntax
- **Cons**: Still adds framework overhead, unnecessary for static portfolio
- **Why Deferred**: Same reasoning as React - defer until complex interactivity is required.

### Implementation Notes

- Initialize with pure `.astro` components in `src/components/`
- Reserve `src/components/islands/` directory for future interactive components
- GSAP animations will be implemented with vanilla JavaScript (no framework needed)
- When interactive components are needed:
  1. Install framework: `bun add react react-dom` + `bun add -d @astrojs/react`
  2. Update `astro.config.mjs` to include framework integration
  3. Use `client:load`, `client:visible`, or `client:idle` directives for selective hydration

### Validation

- ✅ Aligns with Principle I (Performance First): 0KB JavaScript initial load
- ✅ Aligns with Astro Framework Standards: Default to 0KB JavaScript
- ✅ Aligns with Performance Budget: Maximizes JS budget for GSAP/Lenis
- ✅ Supports progressive enhancement: Islands architecture ready when needed

---

## Summary of Decisions

| Decision | Choice | Primary Rationale | Constitutional Alignment |
|----------|--------|-------------------|-------------------------|
| Linting Tool | **Biome** | Performance (10-100x faster), single tool simplicity | Principles III, IV, VI |
| Testing Framework | **Bun Test Runner** | Native integration, zero dependencies, faster execution | Principles III, IV, VI |
| UI Components | **Pure Astro (Islands ready)** | 0KB JavaScript initial load, progressive enhancement | Principles I, IV |

## Best Practices Research

### Bun + Astro Integration Best Practices

**Package Installation**:
- Use `bun create astro@latest` for project initialization (official Bun support)
- Specify Bun version in `package.json` engines field: `"engines": { "bun": ">=1.0.0" }`
- Use `bun install` for dependency installation (not `npm install`)

**Astro Configuration**:
- Set `output: 'static'` in `astro.config.mjs` for static site generation
- Configure `base: '/portfolio'` if deploying to GitHub Pages subdirectory
- Enable `compressHTML: true` for production builds

**TypeScript Configuration**:
- Extend Astro's recommended tsconfig: `"extends": "astro/tsconfigs/strict"`
- Enable `"strict": true` for type safety
- Use `"moduleResolution": "bundler"` for modern module resolution

**Performance Optimization**:
- Use Astro's built-in image optimization: `<Image />` component
- Implement lazy loading for images: `loading="lazy"`
- Defer non-critical JavaScript: `<script is:inline defer>`
- Use `client:visible` for animations that appear on scroll

### GSAP + Astro Integration Pattern

**Loading Strategy**:
```typescript
// src/scripts/animations.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animation functions exported for use in Astro components
```

**Astro Component Integration**:
```astro
---
// Component script (runs at build time)
---

<div class="animate-on-scroll">Content</div>

<script>
  // Client-side script (runs in browser)
  import { setupScrollAnimations } from '@/scripts/animations';
  setupScrollAnimations();
</script>
```

**Accessibility**:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  gsap.to('.element', { /* animation */ });
}
```

### GitHub Pages Deployment

**Configuration**:
- Add `site: 'https://username.github.io'` to `astro.config.mjs`
- Add `base: '/portfolio'` if deploying to repository subdirectory
- Use GitHub Actions workflow for automated deployment

**Build Command**:
```json
{
  "scripts": {
    "build": "astro build"
  }
}
```

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## Dependencies Summary

**Runtime**:
- `bun` ≥1.0.0 (runtime and package manager)

**Core Framework**:
- `astro` ^4.0.0
- `typescript` ^5.0.0

**Animation Libraries**:
- `gsap` ^3.12.0 (includes ScrollTrigger)
- `@studio-freight/lenis` ^1.0.0 (smooth scroll)

**Tooling**:
- `@biomejs/biome` ^1.5.0 (linting + formatting)

**Development**:
- `@astrojs/check` ^0.4.0 (TypeScript checking for Astro files)

**Total Initial Dependencies**: 6 packages (minimal footprint)

## Validation Checklist

- ✅ All NEEDS CLARIFICATION items resolved
- ✅ Technology choices align with constitutional principles
- ✅ Performance budgets validated against chosen tools
- ✅ Best practices researched and documented
- ✅ Dependencies minimized (6 packages total)
- ✅ Integration patterns documented for Phase 1 implementation
