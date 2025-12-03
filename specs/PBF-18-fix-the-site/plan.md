# Implementation Plan: Animation Cleanup and Optimization

**Branch**: `PBF-18-fix-the-site` | **Date**: 2025-12-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-18-fix-the-site/spec.md`

## Summary

Clean up the portfolio site by removing low-value animations (neural network background, custom cursor) and fixing text animation timing issues. The approach involves:
1. Removing neural-network.ts and canvas element from Hero section
2. Removing custom-cursor.ts and CustomCursor.astro component
3. Fixing text split animation timing by applying proper initial hidden state via CSS

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3 (static site generator), GSAP 3.13.0 (animations)
**Storage**: N/A (static site, no data persistence)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web (GitHub Pages, all modern browsers)
**Project Type**: Web (Astro static site)
**Performance Goals**: Lighthouse ≥85 mobile / ≥95 desktop, LCP <2.5s, 60fps animations, 0KB initial JS
**Constraints**: Page weight <500KB, no content flicker, prefers-reduced-motion support
**Scale/Scope**: Single-page portfolio with 5 sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Performance First ✅
- **Requirement**: Static site with 0KB initial JS, LCP <2.5s
- **Compliance**: Removing animations reduces JS bundle, improves performance
- **Impact**: Positive - fewer scripts to load, faster initial render

### Principle II: Quality & Accessibility ✅
- **Requirement**: WCAG 2.1 AA, prefers-reduced-motion support
- **Compliance**: Text animations already respect reduced motion; fix ensures no flicker
- **Impact**: Positive - removing problematic cursor improves accessibility

### Principle III: Build & Deployment ✅
- **Requirement**: Build under 30s, Bun for package management
- **Compliance**: No changes to build process; removing files simplifies build
- **Impact**: Neutral to positive

### Principle IV: Developer Experience ✅
- **Requirement**: Clean, maintainable code
- **Compliance**: Removing unused animation code reduces complexity
- **Impact**: Positive - fewer files to maintain

### Principle V: Content & SEO ✅
- **Requirement**: SEO best practices
- **Compliance**: No impact on SEO (animation removal is cosmetic)
- **Impact**: Neutral

### Principle VI: Tooling & Runtime ✅
- **Requirement**: Bun runtime, native TypeScript
- **Compliance**: No changes to tooling
- **Impact**: Neutral

**GATE STATUS: PASSED** - All principles satisfied, no violations

## Project Structure

### Documentation (this feature)

```
specs/PBF-18-fix-the-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── layout/          # Header, Footer, BurgerMenu
│   ├── sections/
│   │   └── Hero.astro   # MODIFY: Remove canvas and neural network script
│   └── ui/
│       └── CustomCursor.astro  # DELETE: Custom cursor component
├── layouts/
│   └── PageLayout.astro # MODIFY: Remove CustomCursor import and usage
├── scripts/
│   ├── neural-network.ts    # DELETE: Neural network animation
│   ├── custom-cursor.ts     # DELETE: Custom cursor animation
│   ├── text-animations.ts   # KEEP: Fix timing issue
│   ├── animation-config.ts  # MODIFY: Remove neural network constants
│   └── accessibility.ts     # KEEP: Used by other scripts
├── styles/
│   ├── animations.css       # MODIFY: Add initial hidden state for text-split
│   └── global.css           # KEEP: No changes
└── pages/
    └── index.astro          # KEEP: No changes needed
```

**Structure Decision**: Astro static site structure. This feature modifies existing files and deletes unused animation scripts/components.

## Complexity Tracking

*No violations - constitution check passed with no issues.*

This is a cleanup/removal feature that reduces complexity rather than adding it.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

### Principle I: Performance First ✅ (CONFIRMED)
- Removing ~579 lines of animation JavaScript
- No new dependencies added
- Faster initial load guaranteed

### Principle II: Quality & Accessibility ✅ (CONFIRMED)
- CSS fix ensures proper reduced motion support
- Hidden initial state prevents content flicker
- No accessibility regressions

### Principle III: Build & Deployment ✅ (CONFIRMED)
- Fewer files to process = faster builds
- No changes to deployment pipeline

### Principle IV: Developer Experience ✅ (CONFIRMED)
- Cleaner codebase with fewer animation files
- Simpler Hero component without canvas logic

### Principle V: Content & SEO ✅ (CONFIRMED)
- No content changes, SEO unaffected

### Principle VI: Tooling & Runtime ✅ (CONFIRMED)
- No tooling changes required

**POST-DESIGN GATE: PASSED** - Design aligns with all constitutional principles.

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/PBF-18-fix-the-site/plan.md` | ✅ Complete |
| Research Document | `specs/PBF-18-fix-the-site/research.md` | ✅ Complete |
| Quickstart Guide | `specs/PBF-18-fix-the-site/quickstart.md` | ✅ Complete |
| Agent Context | `CLAUDE.md` | ✅ Updated |

## Next Steps

Run `/speckit.tasks` to generate the implementation tasks from this plan.
