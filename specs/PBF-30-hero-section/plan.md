# Implementation Plan: Hero Section Redesign

**Branch**: `PBF-30-hero-section` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-30-hero-section/spec.md`

## Summary

Rollback the hero section from the complex WebGL 3D animation (PBF-28) to a simple, clean, name-first layout following awwwards portfolio conventions. This involves:
- Removing all WebGL/OGL animation code and dependencies (~30KB bundle savings)
- Replacing complex choreographed animations with simple CSS fade-in
- Restructuring content hierarchy: name prominent (h1) → role (subtitle) → CTA
- Using simple CSS gradient background with Catppuccin Mocha colors

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3 (static site generator), CSS Custom Properties (no additional JS libraries for hero)
**Storage**: N/A (static site, no data persistence)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web (GitHub Pages), viewports 320px-2560px
**Project Type**: Web (Astro static site with single-page architecture)
**Performance Goals**: LCP <2.5s, Lighthouse ≥85 mobile/≥95 desktop, hero content visible within 1 second
**Constraints**: Zero JavaScript required for hero render, CSS-only animations, prefers-reduced-motion support
**Scale/Scope**: Single component redesign affecting Hero.astro, 6 TypeScript files to delete, ~30KB bundle reduction

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First ✅ PASS
- **LCP <2.5s**: SATISFIED - Removing WebGL animation eliminates blocking resources
- **Page weight <500KB**: SATISFIED - Reducing by ~30KB (OGL + hero modules)
- **JavaScript 0KB initial**: SATISFIED - CSS-only hero with no hydration required
- **Animations 60fps**: SATISFIED - CSS fade-in animation is GPU-accelerated

### II. Quality & Accessibility ✅ PASS
- **WCAG 2.1 AA**: SATISFIED - Color contrast maintained via CSS variables
- **Keyboard navigable**: SATISFIED - CTA button with focus indicators
- **Semantic HTML**: SATISFIED - h1 for name, proper heading hierarchy
- **prefers-reduced-motion**: SATISFIED - CSS animation respects media query

### III. Build & Deployment ✅ PASS
- **Build <30 seconds**: SATISFIED - Removing 6 TypeScript files reduces build time
- **Bun for scripts**: SATISFIED - Using existing Bun workflow

### IV. Developer Experience ✅ PASS
- **Component-based**: SATISFIED - Hero.astro component maintained
- **TypeScript**: SATISFIED - Props interface simplified
- **Dependencies minimal**: SATISFIED - Removing OGL dependency (~24KB)

### V. Content & SEO ✅ PASS
- **Semantic markup**: SATISFIED - Name as h1, role as supporting text
- **Progressive enhancement**: SATISFIED - Content visible without JavaScript

### VI. Tooling & Runtime ✅ PASS
- **Bun runtime**: SATISFIED - Using bun install/run for all operations

### Gate Summary
All constitutional gates PASS. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```
specs/PBF-30-hero-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - hero best practices research
├── data-model.md        # Phase 1 output - hero component entities
├── quickstart.md        # Phase 1 output - implementation guide
├── contracts/           # Phase 1 output - CSS contract/styling spec
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       └── Hero.astro          # MODIFY: Simplify to name-first layout
├── pages/
│   └── index.astro             # MODIFY: Update Hero props (headline/subheadline)
├── styles/
│   └── effects/
│       ├── hero-effects.css    # MODIFY: Remove WebGL/animation styles
│       └── glitch.css          # KEEP: May be used elsewhere
├── scripts/
│   └── hero/                   # DELETE: Entire directory (6 files, ~48KB)
│       ├── hero-controller.ts      # DELETE
│       ├── background-3d.ts        # DELETE
│       ├── cursor-tracker.ts       # DELETE
│       ├── typography-reveal.ts    # DELETE
│       ├── performance-monitor.ts  # DELETE
│       └── types.ts                # DELETE
└── config/
    └── performance.ts          # MODIFY: Remove HERO_* constants

package.json                    # MODIFY: Remove "ogl" dependency
```

**Structure Decision**: Astro static site structure. This is a rollback/simplification feature that primarily involves deletions and modifications to existing files. No new directories created.

## Complexity Tracking

*No violations - all constitutional gates passed.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design artifacts generated.*

### Design Artifacts Verification

| Artifact | Status | Constitutional Alignment |
|----------|--------|--------------------------|
| research.md | ✅ Complete | Resolved all technical decisions |
| data-model.md | ✅ Complete | HeroProps interface defined, migration path documented |
| contracts/hero-styles.css | ✅ Complete | CSS tokens follow theme.css pattern |
| quickstart.md | ✅ Complete | Implementation steps use Bun commands |

### Post-Design Gate Summary

All constitutional principles remain satisfied after design phase:

- **Performance**: CSS-only solution maintains 0KB JavaScript for hero
- **Accessibility**: prefers-reduced-motion handled in CSS contract
- **Semantic HTML**: h1 for name, proper heading hierarchy preserved
- **Bun Runtime**: All commands in quickstart use `bun` prefix
- **Bundle Size**: ~30KB reduction confirmed (OGL removal)

**Result**: ✅ APPROVED FOR IMPLEMENTATION

## Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| Plan | `specs/PBF-30-hero-section/plan.md` | This implementation plan |
| Research | `specs/PBF-30-hero-section/research.md` | Technical decisions and best practices |
| Data Model | `specs/PBF-30-hero-section/data-model.md` | Entity definitions and migration notes |
| CSS Contract | `specs/PBF-30-hero-section/contracts/hero-styles.css` | Styling specification |
| Quickstart | `specs/PBF-30-hero-section/quickstart.md` | Step-by-step implementation guide |
