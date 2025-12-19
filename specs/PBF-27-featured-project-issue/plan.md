# Implementation Plan: Featured Project Layout and Image Fix

**Branch**: `PBF-27-featured-project-issue` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-27-featured-project-issue/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix two bugs in the Projects section: (1) the FeaturedProject component appears before the section title on mobile, causing incorrect visual hierarchy, and (2) the AI-BOARD image at `/images/projects/ai-board.webp` is a 570-byte placeholder file that doesn't render as a valid image. The fix involves restructuring the section layout and implementing an image fallback strategy.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3, CSS Custom Properties
**Storage**: Static Markdown files via Astro Content Collections (`src/content/projects/`)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web (all modern browsers, GitHub Pages deployment)
**Project Type**: Static site (Astro Islands architecture)
**Performance Goals**: LCP <2.5s, CLS <0.1, 60fps animations
**Constraints**: <500KB page weight, WCAG 2.1 AA compliance, mobile-first responsive
**Scale/Scope**: Single-page portfolio with 6 sections, ~7 projects

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Performance First | LCP <2.5s, CLS <0.1, 0KB initial JS | ✅ PASS | Bug fix, no new JS added |
| II. Quality & Accessibility | WCAG 2.1 AA, semantic HTML, keyboard nav | ✅ PASS | Maintaining existing a11y |
| III. Build & Deployment | <30s build, Bun for scripts | ✅ PASS | Minimal CSS changes |
| IV. Developer Experience | TypeScript, component architecture | ✅ PASS | Existing patterns |
| V. Content & SEO | Semantic URLs, content collections | ✅ PASS | No SEO impact |
| VI. Tooling & Runtime | Bun runtime, native TS | ✅ PASS | Standard workflow |

**Pre-design Gate**: ✅ PASSED - No violations. Bug fix context.

## Project Structure

### Documentation (this feature)

```
specs/PBF-27-featured-project-issue/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (layout/image analysis)
├── data-model.md        # Phase 1 output (minimal - no new entities)
├── quickstart.md        # Phase 1 output (testing instructions)
├── contracts/           # Phase 1 output (N/A for CSS-only fix)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       ├── FeaturedProject.astro   # MODIFY: Add CSS fallback for broken images
│       └── ProjectsHexGrid.astro   # ANALYZE: Contains "Featured Projects" h2 title
├── pages/
│   └── index.astro                 # MODIFY: Add section title before FeaturedProject
├── content/
│   └── projects/
│       └── ai-board.md             # REVIEW: Confirm image path is correct
└── styles/
    └── global.css                  # MAY MODIFY: If shared styles needed for fallback

public/
└── images/
    └── projects/
        ├── ai-board.webp           # ISSUE: 570-byte placeholder file
        └── placeholder.svg         # POTENTIAL: Use as fallback
```

**Structure Decision**: Minimal changes to existing component structure. The fix involves:
1. Moving the section title from `ProjectsHexGrid.astro` to `index.astro` (or creating a shared title)
2. Adding CSS-based image fallback to `FeaturedProject.astro`

## Complexity Tracking

*No complexity violations - this is a targeted bug fix.*

---

## Phase 0: Research

See [research.md](./research.md) for detailed findings.

### Key Findings

1. **Layout Issue Root Cause**: The "Featured Projects" h2 title is inside `ProjectsHexGrid.astro` (line 34), while `FeaturedProject.astro` is a separate component without a section title. When both are rendered in `index.astro`, the order is `FeaturedProject` → `ProjectsHexGrid` (which contains the h2).

2. **Image Issue Root Cause**: All project images in `/public/images/projects/` are 570-byte placeholder files, not actual images. The `ai-board.webp` file exists but is not a valid WebP image.

3. **Solution Approach**:
   - **Layout**: Add a section header with "Projects" title in `index.astro` before `FeaturedProject`, and change ProjectsHexGrid's title to "Other Projects" or remove its h2
   - **Image**: Implement CSS gradient fallback in `FeaturedProject.astro` using `::before` pseudo-element on the image wrapper, visible when image fails to load

---

## Phase 1: Design & Contracts

### Data Model

No new entities required. See [data-model.md](./data-model.md).

### Contracts

No API contracts required - this is a CSS/HTML layout fix.

### Implementation Approach

#### Fix 1: Layout Ordering

**Option A (Recommended)**: Add unified section title to `index.astro`
- Add `<h2 class="section-title">Projects</h2>` before `<FeaturedProject />` in the projects section
- Modify `ProjectsHexGrid.astro` to change h2 text to "More Projects" or hide/remove it
- Pros: Clear visual hierarchy, single source of truth for section title
- Cons: Requires modifying two files

**Option B**: Move `FeaturedProject` inside `ProjectsHexGrid`
- Cons: Increases component complexity, tighter coupling
- Rejected: Against single-responsibility principle

**Decision**: Option A - Add section title in parent, adjust child component

#### Fix 2: Broken Image

**Option A (Recommended)**: CSS gradient fallback
- Add `background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))` to `.featured-project__image-wrapper`
- Image loads on top of gradient; if broken, gradient shows
- Pros: Zero JS, immediate fallback, visually consistent with theme
- Cons: Doesn't indicate it's a placeholder

**Option B**: Replace with actual screenshot
- Requires asset creation (out of scope per spec)
- Noted for future enhancement

**Option C**: JavaScript error handling
- Add `onerror` handler to swap image
- Cons: Adds JS to static component, potential layout shift
- Rejected: Violates performance principles

**Decision**: Option A - CSS gradient fallback, with Option B as follow-up

### Quickstart

See [quickstart.md](./quickstart.md) for testing instructions.

---

## Post-Design Constitution Re-check

| Principle | Status | Impact Assessment |
|-----------|--------|-------------------|
| I. Performance First | ✅ | No JS added, ~50 bytes CSS |
| II. Quality & Accessibility | ✅ | Improved visual hierarchy |
| III. Build & Deployment | ✅ | <1s incremental build |
| IV. Developer Experience | ✅ | Clear component responsibilities |
| V. Content & SEO | ✅ | Better heading structure |
| VI. Tooling & Runtime | ✅ | Standard Astro/Bun workflow |

**Post-design Gate**: ✅ PASSED
