# Implementation Plan: Site-Wide Color Palette

**Branch**: `002-1506-palette-couleur` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-1506-palette-couleur/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Define a comprehensive, accessible site-wide color palette based on Catppuccin Mocha with violet/rose theme accents. The palette will establish visual consistency across all pages, ensure WCAG 2.1 AA compliance, provide semantic color tokens (CSS custom properties), and include interaction states (hover, focus, active, disabled) that respect user motion preferences.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode, native Bun support)
**Primary Dependencies**: Astro ≥4.0.0, Biome ≥2.0.0 (linting), GSAP ≥3.13.0 (animations), Lenis ≥1.0.0 (smooth scroll)
**Storage**: N/A (CSS custom properties defined in global stylesheet, no data persistence)
**Testing**: Bun test runner (built-in, Jest-compatible API), WCAG contrast checker (manual/automated via browser tools)
**Target Platform**: Modern browsers (last 2 major versions), static HTML/CSS/JS output
**Project Type**: Web (static site)
**Performance Goals**: 0KB JS for color definitions, <100KB total CSS (uncompressed), no runtime color computation
**Constraints**: WCAG 2.1 AA contrast ratios (4.5:1 text, 3:1 UI), prefers-reduced-motion support, Catppuccin Mocha palette constraints
**Scale/Scope**: Site-wide design system foundation (affects all ~10-20 pages/components)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First (NON-NEGOTIABLE)

**Status**: ✅ PASS

- Color definitions via CSS custom properties = 0KB JavaScript overhead
- No runtime computation required (static color values)
- Expected CSS addition: ~5-10KB for palette definitions (well within <100KB total CSS budget)
- No impact on Core Web Vitals (LCP, FID, CLS)
- Animations will respect prefers-reduced-motion via media queries

**Justification**: Color palette is purely declarative CSS, aligns perfectly with Astro's zero-JS-by-default architecture.

### II. Quality & Accessibility

**Status**: ✅ PASS (with validation required)

- Feature explicitly targets WCAG 2.1 AA compliance (FR-006)
- All color combinations will be contrast-checked (4.5:1 text, 3:1 UI)
- Semantic color naming supports accessible design patterns
- Interaction states include keyboard focus indicators
- GSAP animations will respect prefers-reduced-motion (FR-010)

**Validation Requirements**:
- MUST verify all final color combinations with automated contrast checker
- MUST test keyboard navigation with defined focus states
- MUST validate prefers-reduced-motion media query implementation

### III. Build & Deployment Optimization

**Status**: ✅ PASS

- CSS custom properties are minified/compressed in production build
- No additional build dependencies required
- Bun + Astro build process unchanged (<30s target maintained)
- Static color values enable aggressive caching (immutable CSS files with hashing)
- No impact on deployment pipeline (GitHub Pages)

### IV. Developer Experience & Maintainability

**Status**: ✅ PASS

- Centralized color token system improves maintainability (single source of truth)
- TypeScript type definitions can be generated for color tokens (optional enhancement)
- Component-based Astro architecture easily consumes CSS custom properties
- Biome linting can enforce no hard-coded colors outside palette
- Documentation artifact (quickstart.md) will guide developer usage

### V. Content & SEO Excellence

**Status**: ✅ PASS (no impact)

- Color palette has no direct SEO impact
- Improved visual consistency may indirectly improve user engagement metrics
- No changes to meta tags, structured data, or content organization

### VI. Tooling & Runtime Excellence

**Status**: ✅ PASS

- No additional runtime dependencies required
- Bun workflow unchanged (bun install, bun run dev, bun run build)
- No npm/yarn/pnpm usage needed
- TypeScript support for color token types (if implemented) uses Bun's native TS support

### Performance Budget Impact

| Metric | Current | After Feature | Budget | Status |
|--------|---------|---------------|--------|--------|
| CSS Total | ~50KB | ~55-60KB | <100KB | ✅ PASS |
| JavaScript Total | ~55KB (GSAP+Lenis) | ~55KB (no change) | <200KB | ✅ PASS |
| HTML per page | ~30KB | ~30KB (no change) | <50KB | ✅ PASS |

**Conclusion**: All constitutional gates PASS. No violations to justify. Proceed to Phase 0.

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
portfolio/
├── src/
│   ├── styles/
│   │   ├── global.css           # Global styles (MODIFIED: add color palette CSS custom properties)
│   │   └── theme.css            # Theme definitions (NEW: color token definitions)
│   ├── components/
│   │   └── [existing components will consume new color tokens]
│   ├── layouts/
│   │   └── [existing layouts will use new color tokens]
│   └── pages/
│       └── [existing pages inherit colors from global styles]
├── tests/
│   ├── unit/
│   │   └── color-contrast.test.ts   # NEW: WCAG contrast ratio validation tests
│   └── integration/
│       └── color-consistency.test.ts # NEW: Color usage consistency tests
└── public/
    └── [no changes - static assets]
```

**Structure Decision**: Single web project (Astro static site). Color palette will be defined as CSS custom properties in `src/styles/theme.css` (new file) and imported into `src/styles/global.css`. All existing components, layouts, and pages will automatically inherit the palette via CSS cascade. No JavaScript required for color definitions, aligning with Astro's zero-JS-by-default architecture.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

No constitutional violations identified. This section is not applicable.

---

## Post-Design Constitution Re-Evaluation

**Re-evaluation Date**: 2025-11-06
**Status**: All gates continue to PASS after design phase

### Design Artifacts Review

Phase 1 design artifacts have been generated:
- ✅ `research.md`: Research findings and best practices
- ✅ `data-model.md`: Color token entity definitions and relationships
- ✅ `contracts/theme-tokens.css`: Complete CSS custom property definitions
- ✅ `contracts/README.md`: Contract documentation and validation guidelines
- ✅ `quickstart.md`: Developer implementation guide

### Constitution Compliance Post-Design

#### I. Performance First (NON-NEGOTIABLE)

**Status**: ✅ PASS (Confirmed)

- Design confirms 0KB JavaScript (pure CSS custom properties)
- Estimated CSS size: ~8KB for complete palette (well within <100KB budget)
- No runtime computation, no dynamic color generation
- Transition variable (`--transition-color`) optimizes for reduced motion
- Research validates HSL format has 98%+ browser support (no polyfills needed)

**Evidence**: `contracts/theme-tokens.css` contains only static CSS declarations, no JavaScript.

#### II. Quality & Accessibility

**Status**: ✅ PASS (Validated)

- All color combinations documented with verified WCAG 2.1 AA contrast ratios
- Contrast ratios inline-documented in `theme-tokens.css` (e.g., "Contrast: 12.23:1 ✅ WCAG AA")
- Focus states use distinct color (lavender) for keyboard navigation clarity
- Interaction states follow consistent transformation rules (hover: -6%, active: -11%)
- `prefers-reduced-motion` media query implemented via `--transition-color` variable
- Research confirms automated testing strategy via Lighthouse CI and Bun tests

**Evidence**: `research.md` Section 3 validates all primary combinations meet WCAG AA.

#### III. Build & Deployment Optimization

**Status**: ✅ PASS (Confirmed)

- No new build dependencies added (pure CSS)
- CSS will be minified/compressed by Astro build process
- Single `@import` in `global.css` maintains minimal HTTP requests
- Static color values enable immutable caching (cache-busting via Astro's build fingerprinting)
- No impact on build time (<30s target maintained)

**Evidence**: `quickstart.md` implementation uses only CSS file creation and import.

#### IV. Developer Experience & Maintainability

**Status**: ✅ PASS (Enhanced)

- Single source of truth: `src/styles/theme.css` (copied from contract)
- Semantic naming improves code clarity (`--color-primary` vs `#cba6f7`)
- Comprehensive documentation: quickstart, data model, contracts, research
- TypeScript types could be auto-generated in future (optional enhancement)
- Biome linting can enforce no hard-coded colors (rule mentioned in quickstart)
- Component examples provided in quickstart.md for common patterns

**Evidence**: `quickstart.md` demonstrates clear usage patterns with before/after examples.

#### V. Content & SEO Excellence

**Status**: ✅ PASS (No impact)

- Color palette does not affect SEO directly
- Improved visual consistency may indirectly benefit user engagement
- No changes to content structure, meta tags, or structured data

**Evidence**: Feature scope limited to CSS styling.

#### VI. Tooling & Runtime Excellence

**Status**: ✅ PASS (Confirmed)

- No additional runtime or tooling dependencies
- Bun workflow unchanged (dev, build, preview, test)
- Native TypeScript support sufficient (no new transpilation needs)
- Testing strategy uses Bun's built-in test runner

**Evidence**: `research.md` and `quickstart.md` reference only Bun-based commands.

### Performance Budget Re-Assessment

| Metric | Pre-Design Estimate | Post-Design Actual | Budget | Status |
|--------|---------------------|---------------------|--------|--------|
| CSS Total | ~55-60KB | ~58KB (base + palette) | <100KB | ✅ PASS |
| JavaScript Total | ~55KB | ~55KB (no change) | <200KB | ✅ PASS |
| HTML per page | ~30KB | ~30KB (no change) | <50KB | ✅ PASS |
| Color Tokens File | N/A | ~8KB (theme.css) | N/A | ✅ Included in CSS Total |

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Developer uses hard-coded colors bypassing palette | Medium | Medium | Configure Biome linting rule to warn on hex colors in components |
| Custom color combinations fail WCAG AA | Low | High | Require contrast validation in code review, document process in quickstart |
| Browser compatibility issues with HSL format | Very Low | Low | HSL has 98%+ support; fallback to hex if needed (conversion trivial) |
| Motion transitions ignored | Low | Medium | Document `--transition-color` usage in quickstart, add to component templates |

### Final Gate Assessment

**Overall Status**: ✅ ALL GATES PASS

All constitutional principles validated post-design. No violations or exceptions required. Feature design aligns with:
- Performance-first architecture (0KB JS, minimal CSS)
- Accessibility standards (WCAG 2.1 AA compliance)
- Build optimization (no new dependencies, static assets)
- Developer experience (semantic naming, comprehensive docs)
- Tooling excellence (Bun-native workflow)

**Recommendation**: Proceed to Phase 2 (task generation via `/speckit.tasks`).
