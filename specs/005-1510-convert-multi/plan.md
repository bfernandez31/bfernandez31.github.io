# Implementation Plan: Single-Page Portfolio with Sectioned Layout

**Branch**: `005-1510-convert-multi` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-1510-convert-multi/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Convert the existing multi-page Astro portfolio into a single-page layout with 5 full-viewport sections (#hero, #about, #projects, #expertise, #contact). All content from existing pages (about.astro, expertise.astro, contact.astro) will be migrated into sections within index.astro. Navigation will use anchor links with smooth scroll, and each section will be semantically marked with data-section attributes for identification.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro ≥5.15.3 (static site generator), GSAP ≥3.13.0 (animations), Lenis ≥1.0.42 (smooth scroll)
**Storage**: Static content (Markdown via Astro Content Collections, JSON data files)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Static site deployed to GitHub Pages (Linux/macOS/Windows browsers)
**Project Type**: Web (static site with component-based architecture)
**Performance Goals**: 60fps animations on desktop, 30fps on mobile; smooth scroll transitions <800ms per section; maintain Lighthouse Performance Score ≥95
**Constraints**: 0KB JavaScript initial load (Astro Islands), total JS <200KB (GSAP+Lenis+Islands), page weight <500KB initial; WCAG 2.1 AA compliance; respects prefers-reduced-motion
**Scale/Scope**: Single-page portfolio with 5 sections, ~10 components to migrate/update, existing content from 4 pages (index, about, expertise, contact)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First (NON-NEGOTIABLE)
**Status**: ✅ PASS
- Feature maintains 0KB JavaScript initial load (Astro Islands architecture)
- Existing GSAP (~45KB) + Lenis (~10KB) budget unchanged
- Single-page architecture reduces total payload vs. multi-page (eliminates repeated header/footer/nav HTML)
- Smooth scroll transitions target <800ms (within constitutional requirement)
- All animations respect prefers-reduced-motion (existing infrastructure)
- No new dependencies or performance regressions

### II. Quality & Accessibility
**Status**: ✅ PASS
- Maintains WCAG 2.1 AA compliance (existing color system preserved)
- Enhances accessibility with semantic section landmarks and data-section attributes
- Keyboard navigation maintained (existing Tab, Enter, Escape support)
- Focus management handled by existing accessibility utilities
- Screen reader support improved with ARIA landmarks on sections
- No accessibility regressions; feature improves semantic HTML structure

### III. Build & Deployment Optimization
**Status**: ✅ PASS
- Build time unaffected (fewer pages = faster build, consolidation from 4→1 page)
- No new build dependencies
- Static asset strategy unchanged (existing fingerprinting/caching)
- Deployment target remains GitHub Pages
- Build process uses existing Bun workflow (`bun run build`)

### IV. Developer Experience & Maintainability
**Status**: ✅ PASS
- Simplifies codebase by removing multiple page files (about.astro, expertise.astro, contact.astro)
- Component-based architecture preserved (sections remain as reusable components)
- TypeScript strict mode maintained
- Existing Biome linting/formatting unchanged
- Reduces routing complexity (single page vs. multi-page)
- Improves maintainability through content consolidation

### V. Content & SEO Excellence
**Status**: ⚠️ NEEDS CONSIDERATION
- Single-page architecture changes SEO structure (multiple pages → single page with sections)
- URL structure changes from `/about`, `/expertise`, `/contact` → `/#about`, `/#expertise`, `/#contact`
- Need to implement 301 redirects or server-side routing to preserve external links
- Single meta title/description vs. page-specific metadata (impacts search engine understanding)
- **Mitigation Required**: Implement structured data (JSON-LD) with multiple sections, use semantic HTML5 section elements, maintain unique heading hierarchy per section

### VI. Tooling & Runtime Excellence
**Status**: ✅ PASS
- No changes to Bun runtime or package management
- Existing Bun workflow preserved
- No new tooling requirements

### Overall Gate Status: ✅ CONDITIONAL PASS
**Condition**: Must address SEO considerations in Phase 0 research (URL redirects, meta strategy, structured data for single-page portfolios)

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
src/
├── pages/
│   ├── index.astro              # MODIFIED: Will contain all 5 sections
│   ├── about.astro              # TO BE DEPRECATED after migration
│   ├── expertise.astro          # TO BE DEPRECATED after migration
│   ├── contact.astro            # TO BE DEPRECATED after migration
│   ├── 404.astro                # RETAINED: Error handling
│   ├── projects/                # RETAINED: Project listings
│   └── blog/                    # RETAINED: Blog posts
├── components/
│   ├── layout/
│   │   ├── Header.astro         # MODIFIED: Update nav links to anchors
│   │   ├── BurgerMenu.astro     # MODIFIED: Update nav links to anchors
│   │   └── Footer.astro         # UNCHANGED
│   ├── sections/
│   │   ├── Hero.astro           # UNCHANGED: Already used in index.astro
│   │   ├── AboutIDE.astro       # TO BE INTEGRATED: From about.astro
│   │   ├── ProjectsHexGrid.astro # TO BE INTEGRATED: Projects section
│   │   ├── ExpertiseMatrix.astro # TO BE INTEGRATED: From expertise.astro
│   │   └── ContactProtocol.astro # TO BE INTEGRATED: From contact.astro
│   └── ui/
│       └── Button.astro         # UNCHANGED
├── layouts/
│   └── PageLayout.astro         # MODIFIED: Single-page layout adjustments
├── scripts/
│   ├── gsap-config.ts           # UNCHANGED: Existing GSAP setup
│   ├── scroll-animations.ts     # MODIFIED: Add section scroll navigation
│   └── accessibility.ts         # UNCHANGED: Existing focus management
├── styles/
│   ├── global.css               # MODIFIED: Add section layout styles
│   └── theme.css                # UNCHANGED: Existing color tokens
└── data/
    ├── pages.ts                 # MODIFIED: Single-page metadata
    └── navigation.ts            # MODIFIED: Update to anchor links

tests/
├── unit/                        # Test utilities and helpers
└── integration/                 # Test single-page navigation
```

**Structure Decision**: Web application (static site). This feature modifies the existing Astro project structure by:
1. Consolidating 4 page files into 1 (index.astro)
2. Integrating 5 section components into single-page layout
3. Updating navigation from page links to anchor links
4. Enhancing scroll behavior for smooth section transitions
5. Adding section-specific styles for 100vh layout

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

No constitutional violations requiring justification. The feature passes all constitutional gates with one condition (SEO considerations) to be addressed in Phase 0 research.
