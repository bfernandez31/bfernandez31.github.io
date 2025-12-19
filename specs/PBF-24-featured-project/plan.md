# Implementation Plan: Featured Project Section for AI-BOARD

**Branch**: `PBF-24-featured-project` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-24-featured-project/spec.md`

## Summary

Add a dedicated "Featured Project" sub-section at the top of the Projects area that prominently showcases AI-BOARD with hero-style presentation (larger visual footprint, meta-narrative about portfolio being built with AI-BOARD, clear CTA to live deployment). The implementation will leverage existing Astro Content Collections data from `src/content/projects/ai-board.md` as single source of truth.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3 (static site generator), Content Collections (Zod validation), GSAP 3.13.0 (animations)
**Storage**: Static Markdown files via Astro Content Collections (`src/content/projects/`)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web (static site deployed to GitHub Pages)
**Project Type**: Web application (single-page Astro portfolio)
**Performance Goals**: LCP <2.5s, CLS <0.1, 60fps animations on mid-tier devices, 0KB JS initial load via Islands architecture
**Constraints**: <500KB page weight, <100KB CSS, Lighthouse ≥85 mobile/≥95 desktop, WCAG 2.1 AA compliance
**Scale/Scope**: Single portfolio site, 6 main sections, ~7 projects in content collection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence/Notes |
|-----------|--------|----------------|
| I. Performance First | ✅ PASS | Static component, no hydration required. Images lazy-loaded with aspect-ratio placeholder. CSS-only animations respect reduced-motion. |
| II. Quality & Accessibility | ✅ PASS | WCAG 2.1 AA compliance required (FR-008). Keyboard navigation (FR-008). Screen reader support with ARIA (FR-009). prefers-reduced-motion (FR-007). |
| III. Build & Deployment | ✅ PASS | Uses existing Astro Content Collections. No new dependencies. Standard `bun run build` workflow. |
| IV. Developer Experience | ✅ PASS | Single source of truth from existing ai-board.md. Component-based architecture. TypeScript with strict mode. |
| V. Content & SEO | ✅ PASS | Uses existing content collection entry. Semantic HTML throughout. |
| VI. Tooling & Runtime | ✅ PASS | Bun runtime for all operations. No new tools required. |

**Gate Result**: ✅ PASS - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```
specs/PBF-24-featured-project/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       ├── FeaturedProject.astro    # NEW: Featured project hero component
│       └── ProjectsHexGrid.astro    # EXISTING: Standard project grid (unchanged)
├── content/
│   └── projects/
│       └── ai-board.md              # EXISTING: AI-BOARD content entry (data source)
├── pages/
│   └── index.astro                  # MODIFY: Add FeaturedProject before ProjectsHexGrid
└── styles/
    └── sections.css                 # MODIFY: Add featured-project section styles (if needed)

tests/
└── unit/
    └── featured-project.test.ts     # NEW: Component tests
```

**Structure Decision**: Single new component (`FeaturedProject.astro`) added to existing `sections/` directory. Minimal changes to `index.astro` to include the new component. No new directories required.

## Complexity Tracking

*No Constitution violations requiring justification.*

| Aspect | Complexity | Justification |
|--------|------------|---------------|
| New files | 1 component | Minimal footprint - single Astro component |
| Modified files | 1-2 files | index.astro to include component, possibly sections.css |
| Dependencies | 0 new | Leverages existing GSAP, Content Collections |
| Bundle impact | ~0KB JS | Static Astro component, no client-side hydration needed |
