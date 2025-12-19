# Implementation Plan: Hero Section Polish & Animation Fixes

**Branch**: `PBF-22-fix-the-first` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-22-fix-the-first/spec.md`

## Summary

Fix the hero section's visual issues by:
1. **Removing custom cursor** - User stated "le cursor n'apporte rien" (adds nothing)
2. **Simplifying text animations** - Replace buggy character-by-character splitting with simpler fade-in
3. **Improving spacing** - Add proper vertical rhythm between headline, subheadline, and CTA
4. **Using CSS variables** - Replace hardcoded colors (#ffffff) with theme tokens (var(--color-text))

Technical approach: Refactoring and deletion-focused (remove complexity, not add features).

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3, GSAP 3.13.0, Lenis 1.0.42, Biome 2.0.0+
**Storage**: N/A (static site, no persistence)
**Testing**: Bun test runner (visual inspection, Lighthouse CI)
**Target Platform**: Static web (GitHub Pages), all modern browsers
**Project Type**: Web (frontend static site)
**Performance Goals**: Lighthouse ≥85 mobile/≥95 desktop, LCP <2.5s, 30fps minimum animations
**Constraints**: <500KB total page weight, zero JavaScript by default (Astro Islands)
**Scale/Scope**: Single-page portfolio with 6 sections, ~10k visitors/month target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Performance First ✅ PASS
- Changes reduce JavaScript by removing custom cursor (~8KB saved)
- Simpler text animations reduce GSAP animation complexity
- No new dependencies added

### Principle II: Quality & Accessibility ✅ PASS
- Text will be visible immediately (progressive enhancement)
- prefers-reduced-motion support maintained
- Color contrast maintained (WCAG AA compliance)
- Keyboard navigation unaffected

### Principle III: Build & Deployment Optimization ✅ PASS
- Build time unaffected (code deletion)
- No new assets or dependencies

### Principle IV: Developer Experience & Maintainability ✅ PASS
- Removing unused code improves maintainability
- CSS variables follow established patterns
- Simpler implementation easier to maintain

### Principle V: Content & SEO Excellence ✅ PASS
- Hero content remains indexed correctly
- No impact on meta tags or structured data

### Principle VI: Tooling & Runtime Excellence ✅ PASS
- Bun continues to be used for all operations
- No new tooling requirements

### Performance Standards ✅ PASS
- JavaScript budget improves (removing ~8KB cursor code)
- Animation frame rate maintained at 60fps
- GPU-accelerated properties only (opacity, transform)

**Gate Status**: ✅ ALL GATES PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```
specs/PBF-22-fix-the-first/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── sections/
│   │   └── Hero.astro           # MODIFY: Remove text-split, add spacing CSS
│   └── ui/
│       └── CustomCursor.astro   # DELETE: Remove entirely
├── layouts/
│   └── PageLayout.astro         # MODIFY: Remove CustomCursor import/usage
├── scripts/
│   ├── custom-cursor.ts         # DELETE: Remove entirely
│   └── text-animations.ts       # KEEP: May still be used by other sections
└── styles/
    └── theme.css                # REFERENCE: Color variables

tests/
└── unit/
    └── (no cursor tests to delete)
```

**Structure Decision**: Existing Astro static site structure. This feature focuses on modification and deletion of existing files, not creation of new ones.

## Complexity Tracking

*No violations - this feature reduces complexity by removing unused code.*

| Aspect | Before | After | Change |
|--------|--------|-------|--------|
| Custom cursor code | ~340 lines | 0 lines | -100% |
| Text animation complexity | character split | simple fade | Simplified |
| Hardcoded colors | 5 instances | 0 instances | -100% |
| Hero CSS lines | ~80 lines | ~85 lines | +5 (spacing vars) |
