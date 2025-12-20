# Implementation Plan: Fix Explorer Visibility on Desktop

**Branch**: `PBF-33-fix-explorer` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-33-fix-explorer/spec.md`

## Summary

Fix CSS layout conflict preventing the TUI sidebar (explorer) from displaying side-by-side with main content on desktop viewports (≥1024px). The issue stems from conflicting grid definitions between `layout.css` (global) and `TuiLayout.astro` (scoped), where the scoped styles omit the necessary `grid-template-columns` property.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode) with CSS3
**Primary Dependencies**: Astro 5.15.3 (static site generator), CSS Grid Layout
**Storage**: N/A (static site, CSS-only fix)
**Testing**: Visual regression testing across breakpoints (320px, 768px, 1024px, 1440px, 2560px)
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web (Astro static site)
**Performance Goals**: Zero JavaScript overhead, <1KB CSS change, no layout shift (CLS <0.1)
**Constraints**: Must not break mobile/tablet overlay behavior, scoped to desktop breakpoint only
**Scale/Scope**: 2 files affected (TuiLayout.astro, optionally layout.css)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Performance First | ✅ PASS | CSS-only fix, 0KB JavaScript, no performance impact |
| II. Quality & Accessibility | ✅ PASS | Semantic HTML preserved, keyboard navigation unaffected |
| III. Build & Deployment | ✅ PASS | No build changes, standard CSS update |
| IV. Developer Experience | ✅ PASS | Simple CSS fix, no new dependencies |
| V. Content & SEO | ✅ PASS | No content or SEO impact |
| VI. Tooling & Runtime | ✅ PASS | Uses existing Bun/Astro toolchain |

**Performance Budget Impact**: +0KB JavaScript, ~0.1KB CSS change (well within 100KB CSS budget)

## Project Structure

### Documentation (this feature)

```
specs/PBF-33-fix-explorer/
├── plan.md              # This file
├── research.md          # Root cause analysis and solution design
├── data-model.md        # CSS entity relationships (layout grid areas)
├── quickstart.md        # Quick fix instructions
├── contracts/           # CSS layout contract specifications
│   └── layout-fix.css   # Required CSS properties for fix
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (affected files)

```
src/
├── components/
│   └── layout/
│       └── TuiLayout.astro    # PRIMARY: Remove conflicting scoped styles
└── styles/
    └── tui/
        └── layout.css         # REFERENCE: Correct grid definition (no changes needed)
```

**Structure Decision**: Single-file CSS fix in `TuiLayout.astro`. The `layout.css` file already contains the correct grid layout; the issue is the scoped styles in `TuiLayout.astro` overriding it.

## Complexity Tracking

*No violations - simple CSS fix with no new complexity.*
