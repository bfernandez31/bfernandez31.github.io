# Implementation Plan: Text Split Animation

**Branch**: `012-1516-text-split` | **Date**: 2025-11-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-1516-text-split/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a text split animation utility that splits text content by character, word, or line and animates each fragment with GSAP stagger effects. The utility will provide declarative HTML API via `data-split-text` attributes, automatically trigger animations on viewport entry via IntersectionObserver, and maintain full accessibility with reduced motion support and screen reader compatibility. Primary use cases include hero headline reveals (character-level), section title animations (word-level), and paragraph reveals (line-level).

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: GSAP 3.13.0+ (animation engine), IntersectionObserver API (viewport detection)
**Storage**: N/A (client-side animations only, no data persistence)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Modern browsers (Chrome 58+, Firefox 55+, Safari 12.1+) supporting IntersectionObserver
**Project Type**: Single (static site with client-side utilities)
**Performance Goals**: 60fps on HIGH tier devices, 30fps minimum on MID tier devices, <100ms initialization for 100-character text
**Constraints**: GSAP bundle ≤50KB, text splitting limited to <500 characters per element, animations must respect prefers-reduced-motion
**Scale/Scope**: 10-20 animated text elements per page maximum, primarily short headlines/titles (<200 characters)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Performance First (NON-NEGOTIABLE) ✅

- **LCP/FID/CLS Targets**: Text animations do not impact Core Web Vitals (animations trigger after content visible)
- **Page Weight**: GSAP already included (~45KB), text-animations.ts adds ~3-5KB (well within 200KB JS budget)
- **TTI Impact**: Minimal - animations are progressive enhancement, site functional without JavaScript
- **Zero JS Initial Load**: Compliant - animations use Astro client directives (client:visible or client:idle)
- **60fps Performance**: Target met - using GPU-accelerated properties (opacity, transform) only
- **GSAP Code Splitting**: Text animation utility loaded separately from critical path

**Status**: PASS - Feature adds minimal overhead to existing GSAP infrastructure, maintains performance targets

### Quality & Accessibility ✅

- **WCAG 2.1 AA**: Text remains readable at all times, animations enhance rather than hinder
- **Keyboard Navigation**: Text animations do not interfere with keyboard navigation or focus management
- **Semantic HTML**: Original text structure preserved via visually-hidden span for screen readers
- **Contrast Ratios**: No color changes during animation, existing contrast maintained
- **Screen Reader Support**: Split text wrapped in `aria-hidden="true"`, original text preserved for assistive tech
- **Cross-browser Compatibility**: IntersectionObserver supported in all target browsers (IE11 excluded per portfolio standards)
- **prefers-reduced-motion**: Fully supported - instant text reveal with no animation frames
- **Focus Management**: No focus changes during animation, static content only

**Status**: PASS - Full accessibility compliance with motion preference support and screen reader compatibility

### Build & Deployment Optimization ✅

- **Build Time**: <1s impact (single TypeScript utility file)
- **Asset Fingerprinting**: Handled by Astro build process (no changes needed)
- **Caching**: JavaScript files already cached via immutable strategy
- **CDN Delivery**: Automatic via GitHub Pages
- **Minification**: Bun/Astro handles minification
- **Unused CSS Purge**: No CSS added (inline styles only)
- **Astro Output**: Standard /dist output, no changes
- **Bun Runtime**: Compatible - TypeScript utility uses native Bun support

**Status**: PASS - No impact on build or deployment processes

### Developer Experience & Maintainability ✅

- **Code Style**: TypeScript utility follows existing portfolio patterns (see src/scripts/)
- **Component Architecture**: Aligns with Astro component model (declarative data attributes)
- **Environment Config**: No environment-specific configuration needed
- **Hot Reload**: Standard Astro HMR support
- **Documentation**: Quickstart.md will document usage patterns
- **Dependencies**: Zero new dependencies (uses existing GSAP + native APIs)
- **TypeScript**: Strict mode compliance with explicit types
- **Bun Native TypeScript**: Fully compatible, no transpilation needed

**Status**: PASS - Follows established patterns, minimal maintenance burden

### Content & SEO Excellence ✅

- **Meta Tags**: No impact (client-side animation only)
- **Structured Data**: No impact (no content changes)
- **Sitemap/Robots**: No impact
- **Social Meta**: No impact
- **URLs**: No impact
- **Canonical URLs**: No impact
- **Content Collections**: No impact (utility works with any Astro content)

**Status**: PASS - SEO-neutral feature (progressive enhancement)

### Tooling & Runtime Excellence ✅

- **Bun Runtime**: Fully compatible
- **Package Management**: No new packages required
- **Script Execution**: Standard `bun run dev/build` workflow
- **Engine Version**: Compatible with >=1.0.0 (no version changes)
- **Native Features**: Uses Bun's native TypeScript support
- **No Redundant Tools**: No additional tooling required
- **Performance Advantages**: Bun's fast bundler handles TypeScript compilation
- **Documentation**: Bun usage already documented in CLAUDE.md

**Status**: PASS - No tooling changes required

### Performance Standards ✅

- **Lighthouse Performance**: No measurable impact (animations after LCP)
- **Lighthouse Accessibility**: Maintains ≥95 (motion preferences supported)
- **TBT**: Minimal impact (<5ms per animated element initialization)
- **FCP**: No impact (animations trigger after paint)
- **Speed Index**: No impact (progressive enhancement)
- **Animation Frame Rate**: 60fps target on HIGH tier, 30fps on MID tier (verified via requestAnimationFrame monitoring)

**Status**: PASS - Meets all performance targets

### GSAP Animation Standards ✅

- **Bundle Size**: No additional GSAP plugins needed (~0KB overhead beyond existing setup)
- **GPU Acceleration**: Only uses transform (translateY) and opacity
- **Avoid Layout**: No width/height/top/left animations
- **ScrollTrigger**: May integrate for scroll-based triggers (already included in bundle)
- **Smooth Scroll**: Compatible with existing Lenis integration
- **Motion Accessibility**: Full prefers-reduced-motion support
- **Lazy Loading**: Loaded via client directive (client:visible recommended)
- **Cleanup**: Implements cleanup via astro:before-swap event listener

**Status**: PASS - Follows all GSAP best practices

### Overall Constitutional Compliance

**Result**: ✅ PASS - All constitutional principles satisfied with no violations or exceptions needed

This feature is a pure progressive enhancement that leverages existing infrastructure (GSAP, TypeScript, Astro) without introducing new dependencies, performance overhead, or accessibility issues. It aligns perfectly with the portfolio's performance-first, accessibility-focused philosophy.

---

### Post-Design Re-Evaluation (Phase 1 Complete)

**Date**: 2025-11-08
**Artifacts Reviewed**: research.md, data-model.md, contracts/text-animation-api.ts, quickstart.md

**Design Validation**:
- ✅ **No new dependencies**: Confirmed - uses GSAP 3.13.0+ (already installed) + native IntersectionObserver API
- ✅ **Performance budget maintained**: text-animations.ts estimated at 3-5KB, well within 200KB JS budget
- ✅ **Accessibility patterns verified**: Visually-hidden original text + aria-hidden wrapper pattern confirmed in data model
- ✅ **Build process unchanged**: Single TypeScript utility file, no Astro config changes needed
- ✅ **Testing strategy defined**: Bun test runner for unit/integration tests (no new test infrastructure)

**Constitutional Re-Check**: ✅ **PASS** - All principles remain satisfied after detailed design. No violations introduced during Phase 1.

**Justification**: The design confirms all initial assumptions:
1. Simple DOM manipulation (no complex state management)
2. GPU-accelerated animations (opacity + transform only)
3. Progressive enhancement (site works without JavaScript)
4. Declarative API (HTML data attributes align with Astro patterns)
5. Zero external dependencies (uses existing portfolio infrastructure)

**Ready for Phase 2**: Implementation plan is constitutionally compliant and ready for task generation via `/speckit.tasks`.

## Project Structure

### Documentation (this feature)

```
specs/012-1516-text-split/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── text-animation-api.ts  # TypeScript interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── scripts/
│   └── text-animations.ts          # NEW: Text split animation utility
│       ├── initTextAnimations()    # Main initialization function
│       ├── splitText()             # Text splitting logic
│       ├── createSplitFragment()   # Fragment creation helper
│       └── cleanupTextAnimations() # Cleanup on navigation
├── components/
│   └── [existing components use data-split-text attribute]
└── styles/
    └── [no new styles needed - inline styles via GSAP]

tests/
├── unit/
│   └── text-animations.test.ts     # NEW: Unit tests for splitting logic
└── integration/
    └── text-animations-integration.test.ts  # NEW: Integration tests with GSAP

```

**Structure Decision**: Single project structure (Option 1) - This is a client-side utility that integrates into the existing Astro static site. The text animation script lives in `src/scripts/` alongside other animation utilities (smooth-scroll.ts, custom-cursor.ts, neural-network.ts). No new components are needed - existing Astro components simply add `data-split-text` attributes to trigger animations.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

N/A - No constitutional violations identified. All principles satisfied.
