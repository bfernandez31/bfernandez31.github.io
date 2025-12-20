# Implementation Plan: About Section Rework

**Branch**: `PBF-41-about-rework` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-41-about-rework/spec.md`

## Summary

Refactor the About section to match the markdown file metaphor by: (1) renaming `about.tsx` to `about.md` in the explorer/buffer tabs, (2) removing the fake "README.md" header bar and border from the AboutReadme component, and (3) updating the buffer tab label to display `about.md` instead of "About". This is a visual-only refactoring with no architectural changes.

## Technical Context

**Language/Version**: TypeScript 5.9+ with Astro 5.15.3
**Primary Dependencies**: Astro, GSAP 3.13.0, Lenis 1.0.42
**Storage**: N/A (static site, no data persistence)
**Testing**: Bun test runner (Jest-compatible API)
**Target Platform**: Web browsers (GitHub Pages deployment)
**Project Type**: Single-page static site with component-based architecture
**Performance Goals**: Lighthouse ≥95 (mobile/desktop), 60fps animations, LCP <2.5s
**Constraints**: 0KB initial JavaScript (Astro Islands), <500KB initial page weight
**Scale/Scope**: 6-section single-page portfolio with TUI aesthetic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Performance First ✅
- **Impact**: Neutral - This is a visual-only change removing HTML elements (header bar, border)
- **Assessment**: Removing elements reduces DOM complexity, maintaining performance targets
- **No violations**: No JavaScript additions, no new dependencies

### Principle II: Quality & Accessibility ✅
- **Impact**: Neutral to positive - Removing decorative chrome simplifies screen reader navigation
- **Assessment**: Semantic HTML preserved (headings, lists remain), WCAG compliance maintained
- **Consideration**: Verify About section remains visually distinct without header/border

### Principle III: Build & Deployment Optimization ✅
- **Impact**: Neutral - No changes to build process
- **Assessment**: Static output unchanged

### Principle IV: Developer Experience & Maintainability ✅
- **Impact**: Positive - Simplifies AboutReadme component by removing unused header structure
- **Assessment**: Cleaner component code, consistent naming (file extensions match content type)

### Principle V: Content & SEO Excellence ✅
- **Impact**: Neutral - Content and metadata unchanged
- **Assessment**: No SEO impact from visual adjustments

### Principle VI: Tooling & Runtime Excellence ✅
- **Impact**: Neutral - No tooling changes
- **Assessment**: Bun commands unchanged

**Gate Status**: PASSED - All constitutional principles upheld. Visual-only refactoring with no violations.

## Project Structure

### Documentation (this feature)

```
specs/PBF-41-about-rework/
├── plan.md              # This file
├── research.md          # Phase 0 output (minimal - simple refactoring)
├── data-model.md        # Phase 1 output (component changes)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (files affected)

```
src/
├── data/
│   └── sections.ts           # TUI_SECTIONS config (fileName, displayName)
├── components/
│   ├── sections/
│   │   └── AboutReadme.astro # About section component (remove header/border)
│   └── ui/
│       ├── BufferTab.astro   # Buffer tab component (uses label from sections.ts)
│       └── FileEntry.astro   # File entry component (uses fileName from sections.ts)
```

**Structure Decision**: Existing Astro static site structure. This feature modifies configuration data and one component - no new files needed.

## Complexity Tracking

*No violations identified - simple visual refactoring within existing architecture.*
