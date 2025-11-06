# Implementation Plan: Project Initialization with Bun and Astro

**Branch**: `001-1505-initialise-le` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-1505-initialise-le/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Initialize a minimal, production-ready portfolio project using Bun (v1.0+) as the runtime and package manager, and Astro (v4.0+) as the static site generator. The project will include essential development tooling (TypeScript, linting, formatting, testing), a clear directory structure following Astro conventions, and configuration for GitHub Pages deployment. The initialization must complete in under 5 minutes and produce a working development environment on first run.

## Technical Context

**Language/Version**: TypeScript 5.0+ (with Bun's native TypeScript support, no separate transpilation)
**Primary Dependencies**:
- Bun ≥1.0.0 (runtime and package manager)
- Astro ≥4.0.0 (static site generator)
- GSAP core + ScrollTrigger (animation library, ~45KB minified)
- Lenis (smooth scroll library, ~10KB minified)
- NEEDS CLARIFICATION: Linting tool choice (Biome vs ESLint + Prettier)
- NEEDS CLARIFICATION: Testing framework (Bun's built-in test runner vs Vitest)
- NEEDS CLARIFICATION: UI component integration (pure Astro components vs React/Vue Islands)

**Storage**: N/A (static site, no backend database)
**Testing**: NEEDS CLARIFICATION (Bun test runner vs Vitest for unit/integration tests)
**Target Platform**: Web (static HTML/CSS/JS), GitHub Pages deployment with custom domain support
**Project Type**: web (frontend-only static site)
**Performance Goals**:
- Lighthouse Performance ≥95 (mobile/desktop)
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- TTI <3s on 3G networks
- 60fps sustained during GSAP animations
- 0KB JavaScript initial load (Astro Islands architecture)

**Constraints**:
- Initial page load ≤500KB uncompressed
- Build time <30s for typical changes
- JavaScript total <200KB uncompressed (including GSAP, Lenis, Islands)
- HTML per page <50KB, CSS <100KB, Images <300KB per page

**Scale/Scope**:
- Portfolio static site with ~10-20 pages
- ~20-50 reusable Astro components
- Minimal project structure for single developer
- GitHub Pages hosting (free tier)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Performance First ✅ PASS
- **Requirement**: Lighthouse ≥95, Core Web Vitals targets, 0KB initial JS via Astro Islands
- **Compliance**: Spec requires Astro static output with Islands architecture, GSAP animations optimized for 60fps, performance budgets enforced
- **Evidence**: FR-003 (Astro conventions), SC-002 (dev server first run), Performance budgets in constitution align with spec constraints

### Principle II: Quality & Accessibility ✅ PASS
- **Requirement**: WCAG 2.1 AA, semantic HTML, keyboard navigation, prefers-reduced-motion support
- **Compliance**: Spec assumes modern web standards, constitution requires accessibility compliance, GSAP animations must respect motion preferences
- **Evidence**: Assumptions include "modern browsers (ES2020+)", constitution mandates WCAG AA and animation accessibility

### Principle III: Build & Deployment Optimization ✅ PASS
- **Requirement**: Build <30s, Bun for package management, Astro static output to /dist, GitHub Pages deployment
- **Compliance**: Spec mandates Bun runtime (FR-001, FR-002), Astro static site generation, <5min initialization (SC-001)
- **Evidence**: FR-010 (package.json scripts), constitution specifies Bun commands and GitHub Pages deployment

### Principle IV: Developer Experience & Maintainability ✅ PASS (with clarifications needed)
- **Requirement**: TypeScript, Bun package management, linting enforcement, component architecture, documentation
- **Compliance**: Spec requires TypeScript config (FR-006), linting tools (FR-013), formatting (FR-014), README (FR-011)
- **⚠️ CLARIFICATION NEEDED**: Linting tool choice (Biome vs ESLint+Prettier) - both align with constitution, need project preference

### Principle V: Content & SEO Excellence ✅ PASS (future implementation)
- **Requirement**: Meta tags, structured data, sitemap.xml, robots.txt, content collections
- **Compliance**: Out of scope for initialization but constitution compliance required for future features
- **Evidence**: Spec out-of-scope section confirms SEO/content features deferred, Astro supports automatic sitemap generation

### Principle VI: Tooling & Runtime Excellence ✅ PASS
- **Requirement**: Bun runtime ≥1.0.0, bun install/run commands, engines field in package.json, native TypeScript
- **Compliance**: Spec explicitly requires Bun (FR-001, FR-002, FR-012), constitution mandates Bun workflow
- **Evidence**: FR-012 (validate Bun installation), SC-008 (all commands execute successfully), Assumptions (Bun v1.0.0+)

### Performance Budget Compliance ✅ PASS
- **Requirement**: HTML <50KB, CSS <100KB, JS <200KB, Fonts <100KB, Images <300KB per page
- **Compliance**: Spec constraints match constitution budgets exactly
- **Evidence**: Technical Context constraints align with constitution Performance Budgets section

### Astro Framework Standards ✅ PASS (with clarifications needed)
- **Requirement**: Static output, 0KB JS default, content collections, appropriate hydration directives
- **Compliance**: Spec requires Astro with static site output, minimal structure supports Islands architecture
- **⚠️ CLARIFICATION NEEDED**: UI component integration strategy (pure Astro vs React/Vue Islands for interactive components)

### GSAP Animation Standards ✅ PASS
- **Requirement**: Bundle <50KB, GPU-accelerated properties, ScrollTrigger, prefers-reduced-motion, lazy loading
- **Compliance**: Technical context specifies GSAP core + ScrollTrigger ~45KB, constitution mandates performance and accessibility
- **Evidence**: Dependencies list includes GSAP + ScrollTrigger within budget, constitution requires motion accessibility

### **GATE RESULT: ✅ CONDITIONAL PASS**
**Proceed to Phase 0 research to resolve clarifications. No violations requiring justification.**

**Clarifications Required**:
1. Linting tool choice: Biome (all-in-one, faster) vs ESLint + Prettier (ecosystem standard)
2. Testing framework: Bun's built-in test runner (native, faster) vs Vitest (ecosystem standard, better tooling)
3. UI component integration: Pure Astro components vs React/Vue Islands for interactive elements

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
portfolio/                          # Repository root
├── src/                            # Astro source directory
│   ├── components/                 # Reusable Astro components
│   │   ├── layout/                 # Layout components (Header, Footer, Nav)
│   │   ├── ui/                     # UI components (Button, Card, etc.)
│   │   └── islands/                # Interactive components (React/Vue islands if needed)
│   ├── layouts/                    # Page layout templates
│   │   └── BaseLayout.astro        # Base HTML structure
│   ├── pages/                      # File-based routing (becomes URLs)
│   │   └── index.astro             # Homepage (/)
│   ├── styles/                     # Global styles and design tokens
│   │   └── global.css              # Global CSS, Tailwind imports
│   └── content/                    # Content collections (future: blog, projects)
│       └── config.ts               # Content collection schemas
├── public/                         # Static assets (served as-is)
│   ├── favicon.svg                 # Favicon
│   ├── robots.txt                  # SEO robots file
│   └── assets/                     # Images, fonts, etc.
├── tests/                          # Test files
│   ├── unit/                       # Unit tests for utilities/components
│   └── integration/                # Integration tests for pages/features
├── .github/                        # GitHub-specific files
│   └── workflows/                  # GitHub Actions CI/CD
│       └── deploy.yml              # Deployment workflow for GitHub Pages
├── astro.config.mjs                # Astro configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Bun package manifest
├── bun.lockb                       # Bun lockfile
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
└── [LINTING CONFIG]                # TBD: biome.json OR .eslintrc.cjs + .prettierrc
```

**Structure Decision**: Selected **web application (frontend-only)** structure following Astro conventions. This is a static site with no backend, so we use Astro's standard directory layout:
- `src/pages/` for file-based routing (each .astro file becomes a URL)
- `src/components/` for reusable Astro components, organized by type (layout, ui, islands)
- `src/layouts/` for page templates that wrap content
- `src/content/` for type-safe content collections (future blog posts, project case studies)
- `public/` for static assets served directly (images, fonts, robots.txt)
- `tests/` for unit and integration tests
- Root-level config files for Astro, TypeScript, Bun, and linting tools

This structure supports the minimal initialization requirements while enabling easy extension for future features (content collections, additional pages, interactive islands).

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**No violations detected.** All constitutional requirements are met by the proposed initialization approach.

---

## Post-Design Constitution Check

*Re-evaluation after Phase 0 research and Phase 1 design completion*

### Phase 0 Research Outcomes

**Resolved Clarifications**:
1. ✅ **Linting Tool**: Biome selected (10-100x faster, aligns with Principle VI)
2. ✅ **Testing Framework**: Bun's built-in test runner (native, zero dependencies, aligns with Principle VI)
3. ✅ **UI Components**: Pure Astro components with Islands architecture ready (0KB JS initial load, aligns with Principle I)

**Research Validation**:
- All technology choices documented with rationale in `research.md`
- Best practices researched for Bun + Astro integration
- Dependencies minimized to 6 packages (constitutional compliance)
- Performance budgets validated against chosen tools

### Phase 1 Design Outcomes

**Data Model** (`data-model.md`):
- Configuration entities defined (package.json, astro.config.mjs, tsconfig.json, biome.json)
- File structure entity validated against Astro conventions
- State transitions documented for project initialization lifecycle
- No runtime data model (static site, constitutional compliance)

**Contracts** (`contracts/`):
- JSON Schema for package.json validation (enforces Bun, scripts, dependencies)
- TypeScript contract for Astro config (enforces static output, HTTPS site, compression)
- Validation helpers and type guards implemented
- Constitutional requirements encoded in schemas

**Quickstart** (`quickstart.md`):
- 15-step implementation guide (5-10 minutes for experienced developers)
- Verification checklist for successful initialization
- Troubleshooting guide for common issues
- Success criteria aligned with spec (SC-001 to SC-008)

### Constitutional Re-Evaluation

#### Principle I: Performance First ✅ PASS
- **Pre-Design**: Required Astro Islands, 0KB JS, performance budgets
- **Post-Design**:
  - Pure Astro components selected (0KB JS initial load)
  - GSAP + Lenis within performance budget (~55KB total)
  - Contract enforces `compressHTML: true` for production
  - Quickstart includes global CSS reset for performance
- **Evidence**: `research.md` Decision 3, `contracts/astro-config.schema.ts` lines 190-199

#### Principle II: Quality & Accessibility ✅ PASS
- **Pre-Design**: Required WCAG 2.1 AA, semantic HTML, motion preferences
- **Post-Design**:
  - Biome linting enforces code quality
  - TypeScript strict mode enforced
  - Accessibility best practices documented in research
- **Evidence**: `research.md` Decision 1, `quickstart.md` BaseLayout.astro example

#### Principle III: Build & Deployment Optimization ✅ PASS
- **Pre-Design**: Required Bun, <30s builds, GitHub Pages deployment
- **Post-Design**:
  - Bun enforced via package.json engines field (contract validation)
  - GitHub Actions workflow created for automated deployment
  - Build script includes type checking: `astro check && astro build`
- **Evidence**: `contracts/package-json.schema.json` lines 108-116, `quickstart.md` Step 14

#### Principle IV: Developer Experience & Maintainability ✅ PASS
- **Pre-Design**: Required TypeScript, Bun package management, linting, documentation
- **Post-Design**:
  - Biome provides unified linting + formatting (simpler than ESLint + Prettier)
  - Bun's native TypeScript support (no transpilation needed)
  - Quickstart guide provides 5-minute initialization path
  - Directory structure clearly documented
- **Evidence**: `research.md` Decision 1, `quickstart.md` Steps 1-15, `data-model.md` Section 7

#### Principle V: Content & SEO Excellence ✅ PASS (foundation ready)
- **Pre-Design**: Required HTTPS site, meta tags, sitemap (future implementation)
- **Post-Design**:
  - Astro config contract enforces HTTPS site URL
  - robots.txt created in quickstart
  - Content collections directory created (ready for future use)
- **Evidence**: `contracts/astro-config.schema.ts` lines 38-52, `quickstart.md` Step 12

#### Principle VI: Tooling & Runtime Excellence ✅ PASS
- **Pre-Design**: Required Bun runtime, native features, performance advantages
- **Post-Design**:
  - Bun ≥1.0.0 enforced in package.json contract
  - All scripts use Bun commands (validated by schema)
  - Bun's native test runner selected over external dependencies
  - Setup instructions document Bun installation
- **Evidence**: `research.md` Decision 2, `contracts/package-json.schema.json` lines 80-96, `quickstart.md` Troubleshooting

### Performance Budget Compliance ✅ PASS
- **Pre-Design**: HTML <50KB, CSS <100KB, JS <200KB
- **Post-Design**:
  - Pure Astro components compile to minimal HTML
  - Global CSS reset minimal (~1KB)
  - GSAP + Lenis = ~55KB (within 200KB budget, leaves 145KB for Islands)
  - Contract enforces HTML compression
- **Evidence**: `research.md` Dependencies Summary, `quickstart.md` Step 11 global.css

### Astro Framework Standards ✅ PASS
- **Pre-Design**: Required static output, 0KB JS default, appropriate hydration
- **Post-Design**:
  - Astro config contract enforces `output: 'static'`
  - Pure Astro components selected (0KB JS)
  - Islands directory created for future selective hydration
  - Contract enforces HTTPS site and optional base path
- **Evidence**: `contracts/astro-config.schema.ts` lines 63-72, `quickstart.md` Step 7

### GSAP Animation Standards ✅ PASS
- **Pre-Design**: Required bundle <50KB, GPU properties, ScrollTrigger, accessibility
- **Post-Design**:
  - GSAP core + ScrollTrigger = ~45KB (within budget)
  - Research documents GPU-accelerated properties best practice
  - Research documents prefers-reduced-motion implementation
  - Lenis smooth scroll = ~10KB (within overall JS budget)
- **Evidence**: `research.md` GSAP + Astro Integration Pattern section

### **FINAL GATE RESULT: ✅ PASS**

**All constitutional requirements met. No violations. No complexity justifications required.**

**Design Quality**:
- ✅ All clarifications resolved with documented rationale
- ✅ Technology choices align with performance-first principle
- ✅ Contracts enforce constitutional requirements automatically
- ✅ Quickstart provides clear implementation path
- ✅ Data model supports future extensibility
- ✅ Performance budgets validated and enforced

**Ready to proceed to Phase 2 (tasks.md generation via `/speckit.tasks` command)**
