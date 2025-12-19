# Implementation Plan: Featured Project - AI-BOARD

**Branch**: `PBF-23-featured-project` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-23-featured-project/spec.md`

## Summary

Add AI-BOARD as the top featured project in the portfolio (displayOrder: 1) and replace the footer attribution from "Built with Astro and Bun" to "Powered by AI-BOARD" with a link to https://ai-board-three.vercel.app/. This creates a cohesive narrative where the portfolio itself showcases the AI-BOARD tool that powers it.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3 (static site generator), Content Collections (Zod validation)
**Storage**: Markdown files via Astro Content Collections (src/content/projects/)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Static site, GitHub Pages deployment
**Project Type**: Web (Astro static site)
**Performance Goals**: Lighthouse ≥95, LCP <2.5s, 0KB initial JavaScript for new content
**Constraints**: Must not degrade existing performance, maintain WCAG 2.1 AA compliance
**Scale/Scope**: 2 files modified (Footer.astro), 1 file created (ai-board.md project)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Performance First | ✅ PASS | No JavaScript added; only static content (markdown + HTML text change) |
| II. Quality & Accessibility | ✅ PASS | External links use target="_blank" with rel="noopener noreferrer"; semantic HTML preserved |
| III. Build & Deployment Optimization | ✅ PASS | No build process changes; content collection already configured |
| IV. Developer Experience & Maintainability | ✅ PASS | Standard content collection pattern; follows existing project structure |
| V. Content & SEO Excellence | ✅ PASS | New project content will include meta data, tags, and proper schema |
| VI. Tooling & Runtime Excellence | ✅ PASS | Uses Bun runtime and Astro content collections as established |

**Gate Result**: PASSED - No constitution violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```
specs/PBF-23-featured-project/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this feature - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```
src/
├── content/
│   └── projects/
│       └── ai-board.md           # NEW: AI-BOARD project entry
├── components/
│   └── layout/
│       └── Footer.astro          # MODIFIED: Attribution text change
└── (no other changes needed)

public/
└── images/
    └── projects/
        └── ai-board.webp         # NEW: Project screenshot (to be provided)
```

**Structure Decision**: Single project structure. This feature adds one content collection entry and modifies one component. No new directories or patterns required.

## Complexity Tracking

*No violations - minimal change scope*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Phase 0: Research

### Research Tasks

1. **Existing displayOrder Values**: Verify current project displayOrder values to prevent conflicts
2. **Content Collection Schema**: Confirm AI-BOARD project entry will conform to existing schema
3. **Footer Component Styling**: Verify styling approach for new attribution text

### Findings

#### 1. Existing Project Display Orders

| Project | displayOrder | featured |
|---------|-------------|----------|
| neural-portfolio.md | 1 | true |
| ecommerce-platform.md | 2 | true |
| data-visualization.md | 3 | false |
| mobile-app.md | 4 | false |
| saas-platform.md | 5 | true |
| open-source-library.md | 6 | false |

**Decision**: AI-BOARD will take displayOrder: 1, requiring increment of all existing displayOrder values by 1.

**Rationale**: User explicitly wants AI-BOARD as the top featured project. Shifting existing projects maintains relative ordering while giving AI-BOARD highest priority.

**Alternatives Considered**:
- Using displayOrder: 0 (rejected: schema requires positive integers)
- Keeping existing orders and only changing AI-BOARD (rejected: would duplicate displayOrder: 1)

#### 2. Content Collection Schema Compatibility

**Schema Requirements** (from src/content/config.ts):
- title: string (required) ✅
- description: string (required) ✅
- technologies: string[] (required) ✅
- image: string (required) ⚠️ Needs image asset
- imageAlt: string (required) ✅
- externalUrl: URL string (optional) ✅ Will use https://ai-board-three.vercel.app/
- githubUrl: URL string (optional) - N/A (private/not specified)
- featured: boolean (default: false) ✅ Will set to true
- displayOrder: positive integer (required) ✅
- status: enum (default: "completed") ✅
- startDate: date (required) ✅
- endDate: date (optional) - N/A (ongoing)
- tags: string[] (optional) ✅

**Decision**: Use placeholder image initially; document need for proper screenshot.

**Rationale**: Spec notes (Decision 3) acknowledges image requirement with medium confidence and suggests placeholder initially.

#### 3. Footer Styling Compatibility

Current footer structure:
```html
<p class="footer__built">
  Built with <a href="...">Astro</a> and <a href="...">Bun</a>
</p>
```

New structure:
```html
<p class="footer__built">
  Powered by <a href="https://ai-board-three.vercel.app/" target="_blank" rel="noopener noreferrer">AI-BOARD</a>
</p>
```

**Decision**: Direct text replacement using existing `.footer__built` styling.

**Rationale**: Existing styling includes link hover/focus states and maintains consistency. No new CSS required.

---

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md) for detailed entity specifications.

**Summary**:
- AI-BOARD project entry follows existing Content Collection schema
- No new entities or schema modifications needed
- displayOrder renumbering of existing projects required

### Contracts

**N/A** - This feature does not introduce new APIs. All changes are static content modifications:
- 1 new markdown file (content collection entry)
- 1 modified Astro component (text replacement)
- Image asset requirement

### Implementation Approach

#### Step 1: Update Existing Project displayOrders

Increment displayOrder by 1 for all existing projects:
- neural-portfolio.md: 1 → 2
- ecommerce-platform.md: 2 → 3
- data-visualization.md: 3 → 4
- mobile-app.md: 4 → 5
- saas-platform.md: 5 → 6
- open-source-library.md: 6 → 7

#### Step 2: Create AI-BOARD Project Entry

Create `src/content/projects/ai-board.md` with:
- displayOrder: 1
- featured: true
- externalUrl: https://ai-board-three.vercel.app/
- Appropriate technologies, tags, and description

#### Step 3: Add Placeholder Image

Create or add `public/images/projects/ai-board.webp` (placeholder or screenshot)

#### Step 4: Update Footer Attribution

Modify `src/components/layout/Footer.astro`:
- Replace "Built with Astro and Bun" text block
- Replace with "Powered by AI-BOARD" with external link
- Maintain target="_blank" and rel="noopener noreferrer" attributes

### Quickstart

See [quickstart.md](./quickstart.md) for implementation verification steps.

---

## Post-Design Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Performance First | ✅ PASS | Static content only; no JS bundle increase |
| II. Quality & Accessibility | ✅ PASS | Links open in new tab; semantic structure maintained |
| III. Build & Deployment Optimization | ✅ PASS | Standard content collection build; no new dependencies |
| IV. Developer Experience & Maintainability | ✅ PASS | Follows existing patterns exactly |
| V. Content & SEO Excellence | ✅ PASS | New project has full metadata schema |
| VI. Tooling & Runtime Excellence | ✅ PASS | No tooling changes |

**Final Gate Result**: PASSED - Ready for task generation.
