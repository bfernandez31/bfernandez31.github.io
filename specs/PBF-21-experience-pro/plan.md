# Implementation Plan: Experience Pro

**Branch**: `PBF-21-experience-pro` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-21-experience-pro/spec.md`

## Summary

Create a new "Experience" section displaying professional experience timeline based on CV data (14 years, 5 positions), and update the existing skills.json to filter skills (proficiencyLevel >= 2) and recalculate years of experience based on 2010 career start date. The Experience section will be integrated into the single-page portfolio architecture as a 6th section between "About" and "Projects".

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro ≥5.15.3 (static site generator), GSAP ≥3.13.0 (animations), Lenis ≥1.0.42 (smooth scroll)
**Storage**: Static JSON data files (src/data/experiences.json, src/data/skills.json) - no database
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: GitHub Pages (static site, modern browsers Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: Web (Astro static site with Islands architecture)
**Performance Goals**: Lighthouse ≥85 mobile/≥95 desktop, LCP <2.5s, FCP <2s, 60fps animations
**Constraints**: Page weight <500KB, JavaScript <200KB total, 0KB initial JS (Astro Islands)
**Scale/Scope**: 5 experience entries, ~25 skills (filtered from ~70), single-page portfolio

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First (NON-NEGOTIABLE)
- [x] **PASS**: Static site with 0KB initial JavaScript via Astro Islands
- [x] **PASS**: New Experience section uses CSS-only animations where possible, GSAP for scroll-triggered reveals
- [x] **PASS**: No new heavy dependencies; reuses existing GSAP/Lenis
- [ ] **VERIFY**: Experience timeline component must not exceed 50KB total

### II. Quality & Accessibility
- [x] **PASS**: Will use semantic HTML (timeline as `<ul>` with `<li>` entries, proper heading hierarchy)
- [x] **PASS**: All interactive elements keyboard navigable (tab through timeline entries)
- [x] **PASS**: prefers-reduced-motion respected (defined in FR-008)
- [x] **PASS**: WCAG 2.1 AA color contrast using existing palette tokens (FR-010)

### III. Build & Deployment Optimization
- [x] **PASS**: Uses Bun for package management and build
- [x] **PASS**: Static output to /dist for GitHub Pages deployment
- [x] **PASS**: No new build dependencies required

### IV. Developer Experience & Maintainability
- [x] **PASS**: Experience data externalized to JSON (src/data/experiences.json)
- [x] **PASS**: Component follows existing pattern (src/components/sections/Experience.astro)
- [x] **PASS**: TypeScript interfaces for Experience entity

### V. Content & SEO Excellence
- [x] **PASS**: New section will have proper ARIA landmark and heading structure
- [x] **PASS**: JSON-LD structured data will be updated to include work experience

### VI. Tooling & Runtime Excellence
- [x] **PASS**: Uses Bun runtime and existing tooling
- [x] **PASS**: No new redundant dependencies

**Gate Status**: PASS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```
specs/PBF-21-experience-pro/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── experience-data.schema.json
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       ├── Experience.astro         # NEW: Experience timeline section
│       └── ExpertiseMatrix.astro    # MODIFIED: Filter skills >= 2
├── data/
│   ├── experiences.json             # NEW: Professional experience data
│   ├── skills.json                  # MODIFIED: Updated yearsExperience values
│   ├── navigation.ts                # MODIFIED: Add Experience link (order 3)
│   └── sections.ts                  # MODIFIED: Add Experience section (order 3)
├── types/
│   └── experience.ts                # NEW: TypeScript interfaces
├── pages/
│   └── index.astro                  # MODIFIED: Add Experience section between About and Projects
└── styles/
    └── sections.css                 # MODIFIED: Add experience section styles (if global needed)

tests/
├── unit/
│   └── skills-filter.test.ts        # NEW: Test skills filtering logic
└── integration/
    └── experience-section.test.ts   # NEW: Test experience section rendering
```

**Structure Decision**: Follows existing Astro portfolio structure with sections/, data/, and types/ organization. New Experience section placed between About (order 2) and Projects (order 3), shifting Projects to order 4, Expertise to order 5, Contact to order 6.

## Complexity Tracking

*No constitutional violations - section follows established patterns*

| Aspect | Assessment |
|--------|------------|
| New Section | Standard Astro component following existing patterns |
| Data Model | Simple JSON data file, similar to skills.json |
| Navigation Update | Minor additions to existing navigation arrays |
| Skills Update | Data modification only, no logic changes needed |

---

## Post-Design Constitution Re-Check

*Completed after Phase 1 design artifacts generated*

### I. Performance First (NON-NEGOTIABLE)
- [x] **VERIFIED**: Experience component uses semantic HTML (`<ol>`, `<article>`, `<time>`) with CSS-only base layout
- [x] **VERIFIED**: GSAP animations use GPU-accelerated properties only (opacity, translateY)
- [x] **VERIFIED**: No new dependencies added; component estimated <10KB (well under 50KB budget)
- [x] **VERIFIED**: Build-time skills filtering means 0KB runtime filtering logic

### II. Quality & Accessibility
- [x] **VERIFIED**: Semantic HTML structure defined in research.md (`<ol>` for chronological, `<article>` for entries, `<time datetime="">` for dates)
- [x] **VERIFIED**: Technology tags use `<ul>` with proper ARIA labels
- [x] **VERIFIED**: prefers-reduced-motion CSS rules defined in research.md

### III. Build & Deployment Optimization
- [x] **VERIFIED**: JSON schema validates data at build time
- [x] **VERIFIED**: Static output confirmed in quickstart.md build steps

### IV. Developer Experience & Maintainability
- [x] **VERIFIED**: TypeScript interface defined in data-model.md
- [x] **VERIFIED**: JSON Schema contract created for validation
- [x] **VERIFIED**: Quickstart guide documents all implementation steps

### V. Content & SEO Excellence
- [x] **VERIFIED**: ARIA landmarks and heading hierarchy specified
- [x] **TO IMPLEMENT**: JSON-LD hasOccupation data to be added during implementation

### VI. Tooling & Runtime Excellence
- [x] **VERIFIED**: Agent context updated via update-agent-context.sh

**Final Gate Status**: PASS - All constitutional principles satisfied post-design

---

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/PBF-21-experience-pro/plan.md` | Complete |
| Research Document | `specs/PBF-21-experience-pro/research.md` | Complete |
| Data Model | `specs/PBF-21-experience-pro/data-model.md` | Complete |
| JSON Schema Contract | `specs/PBF-21-experience-pro/contracts/experience-data.schema.json` | Complete |
| Quickstart Guide | `specs/PBF-21-experience-pro/quickstart.md` | Complete |

**Next Step**: Run `/speckit.tasks` to generate implementation tasks
