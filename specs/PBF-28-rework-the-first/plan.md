# Implementation Plan: Award-Winning Hero Section Rework

**Branch**: `PBF-28-rework-the-first` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-28-rework-the-first/spec.md`

## Summary

Rework the hero section to achieve an Awwwards-worthy visual experience with 3D depth, cursor interactivity, theatrical entrance animations, and bold typography. Replace the current flat Canvas 2D neural network with a layered 3D experience using WebGL or advanced Canvas techniques, while maintaining performance targets (Lighthouse 85+ mobile, 95+ desktop, LCP <2.5s).

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode)
**Runtime**: Bun ≥1.0.0
**Framework**: Astro 5.15.3 (static site generator with Islands architecture)
**Primary Dependencies**: GSAP 3.13.0 (animations), Lenis 1.0.42 (smooth scroll), OGL ~24KB (lightweight WebGL)
**Storage**: N/A (static site, no database)
**Testing**: Bun test runner (Jest-compatible API)
**Target Platform**: Web (Chrome 90+, Firefox 88+, Safari 14+, mobile browsers)
**Project Type**: Static site (Astro)
**Performance Goals**: 60 FPS desktop, 30+ FPS mobile, Lighthouse ≥85 mobile / ≥95 desktop, LCP <2.5s
**Constraints**: Total JS budget <200KB, initial 0KB JS (Astro Islands), hero entrance ≤3 seconds, must degrade gracefully
**Scale/Scope**: Single hero section component + supporting animation modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate (Initial Compliance)

| Principle | Requirement | Compliance | Notes |
|-----------|-------------|------------|-------|
| **I. Performance First** | LCP <2.5s, FID <100ms, CLS <0.1 | ✅ PASS | Spec targets LCP <2.5s (SC-003), content visible in 2s (FR-010) |
| **I. Performance First** | Page weight <500KB initial | ⚠️ NEEDS CLARIFICATION | Three.js adds ~150KB gzipped; may exceed if not careful |
| **I. Performance First** | 0KB initial JS (Astro Islands) | ✅ PASS | Hero animation can be hydrated with client:visible |
| **I. Performance First** | 60fps animations mid-tier | ✅ PASS | Spec requires 30+ FPS on mid-tier, 60fps desktop (SC-004) |
| **II. Quality & Accessibility** | WCAG 2.1 AA | ✅ PASS | SC-006 requires zero accessibility violations |
| **II. Quality & Accessibility** | prefers-reduced-motion | ✅ PASS | FR-009 requires instant static content |
| **III. Build & Deployment** | Build <30s | ✅ PASS | No new build steps required |
| **IV. Developer Experience** | TypeScript strict mode | ✅ PASS | Existing codebase uses strict mode |
| **VI. Tooling & Runtime** | Bun runtime | ✅ PASS | All scripts use Bun |

### NEEDS CLARIFICATION (Phase 0 Research Required)

1. ~~**3D Technology Choice**~~: ✅ RESOLVED → Use OGL (~24KB) - see [research.md](./research.md#decision-1-3d-technology-choice)
2. ~~**Visual Concept Theme**~~: ✅ RESOLVED → Geometric/Architectural 3D Forms - see [research.md](./research.md#decision-2-visual-concept-theme)
3. ~~**Performance Budget Allocation**~~: ✅ RESOLVED → 30KB for hero system within 200KB budget - see [research.md](./research.md#decision-3-performance-budget-allocation)

### Post-Phase 1 Gate (Design Compliance)

| Principle | Requirement | Compliance | Evidence |
|-----------|-------------|------------|----------|
| **I. Performance First** | Page weight <500KB | ✅ PASS | OGL 24KB + hero 30KB = 54KB new; total ~90KB well under 200KB JS budget |
| **I. Performance First** | 60fps animations | ✅ PASS | GSAP quickTo() for cursor, OGL WebGL for 3D - both GPU-accelerated |
| **II. Accessibility** | WCAG 2.1 AA | ✅ PASS | Static fallback via CSS gradient; prefers-reduced-motion skips all animation |
| **II. Accessibility** | Keyboard navigable | ✅ PASS | No focus traps; CTA button remains accessible |
| **III. Build** | Build <30s | ✅ PASS | Single `bun add ogl` dependency; no build tool changes |
| **IV. Developer Experience** | TypeScript strict | ✅ PASS | Full TypeScript contracts in [contracts/hero-animation.ts](./contracts/hero-animation.ts) |
| **VI. Tooling** | Bun runtime | ✅ PASS | Installation: `bun add ogl` |

**All constitutional gates PASS. Proceeding to /speckit.tasks is approved.**

## Project Structure

### Documentation (this feature)

```
specs/PBF-28-rework-the-first/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - implementation guide
├── contracts/           # Phase 1 output - API/interface contracts
│   └── hero-animation.ts  # TypeScript interfaces for hero system
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       └── Hero.astro           # MODIFY: Update hero component structure
├── scripts/
│   ├── hero/                    # NEW: Hero animation module
│   │   ├── hero-controller.ts   # Animation orchestration
│   │   ├── background-3d.ts     # 3D/Canvas background effect
│   │   ├── cursor-tracker.ts    # Cursor interactivity layer
│   │   └── typography-reveal.ts # Headline animation
│   ├── animation-config.ts      # MODIFY: Add hero animation config
│   └── neural-network.ts        # DEPRECATE: Replace with new system
├── styles/
│   └── effects/
│       └── hero-effects.css     # NEW: Hero-specific visual effects
└── config/
    └── performance.ts           # MODIFY: Add hero performance settings

tests/
├── unit/
│   └── hero/
│       └── hero-controller.test.ts
└── integration/
    └── hero.test.ts
```

**Structure Decision**: Single Astro project with modular hero animation scripts. The hero system is decomposed into separate modules (controller, background, cursor, typography) for maintainability and tree-shaking. The existing neural-network.ts will be deprecated in favor of a more sophisticated background effect.

## Complexity Tracking

*Potential violations to address in research:*

| Potential Violation | Resolution Path | Simpler Alternative Considered |
|---------------------|-----------------|-------------------------------|
| ~~Three.js bundle size~~ | ✅ RESOLVED: Using OGL (24KB) instead of Three.js (150KB) | Canvas 2D lacked true 3D depth required for Awwwards |
| Multiple animation modules (4 files) | ✅ JUSTIFIED: Modules total <30KB combined; tree-shakeable for future optimization | Single monolithic file - harder to maintain and test |
| Cursor tracking overhead | ✅ JUSTIFIED: GSAP quickTo() ensures 60fps; disabled on LOW tier devices | No cursor effect rejected - spec requires mouse interactivity |

---

## Phase 1 Complete: Ready for Tasks

This plan has completed Phase 0 (Research) and Phase 1 (Design & Contracts).

**Next step**: Run `/speckit.tasks` to generate implementation tasks.
