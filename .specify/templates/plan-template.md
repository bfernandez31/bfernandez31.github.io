# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript, HTML5, CSS3 or NEEDS CLARIFICATION]
**Runtime**: [Bun >=1.0.0 (REQUIRED per Constitution VI)]
**Primary Dependencies**: [Astro (static site generator), GSAP (animations), Tailwind CSS or NEEDS CLARIFICATION]
**Storage**: [Static files, JSON/Markdown content, Astro Content Collections]
**Testing**: [e.g., Lighthouse CI, Playwright, Bun test, Pa11y or NEEDS CLARIFICATION]
**Target Platform**: [Static hosting: GitHub Pages (primary), Netlify, Vercel, Cloudflare Pages]
**Project Type**: [static-site - determines source structure]
**Framework**: [Astro 4.x with static export mode]
**Performance Goals**: [Lighthouse ≥95, LCP <2.5s, FID <100ms, CLS <0.1, TTI <3s on 3G, 60fps animations]
**Constraints**: [0KB JS initial (Astro Islands), <500KB initial load, <50KB HTML/page, <100KB CSS total, <200KB JS total including GSAP]
**Scale/Scope**: [Portfolio site: ~5-20 pages, project showcases, blog posts]
**Build Target**: [<30s full build, <5s incremental (Bun + Astro)]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

**Static Site Specific Checks**:
- [ ] Performance budget impact assessed (page weight, bundle sizes per Constitution)
- [ ] Lighthouse score targets identified (≥95 for all categories)
- [ ] Accessibility compliance plan (WCAG 2.1 AA, animation accessibility)
- [ ] SEO requirements defined (meta tags, structured data, sitemap via Astro)
- [ ] Build time impact estimated (<30s for full build with Bun + Astro)
- [ ] CDN and caching strategy confirmed (GitHub Pages CDN)
- [ ] Bun runtime requirement documented (Constitution VI)
- [ ] Astro Islands architecture planned (0KB JS initial per Constitution I)
- [ ] GSAP animation performance verified (60fps, GPU-accelerated per Constitution II)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Static Site (PORTFOLIO DEFAULT)
src/
├── components/       # Reusable UI components
├── layouts/          # Page layouts and templates
├── pages/            # Route pages
├── content/          # Markdown/JSON content
├── styles/           # Global styles, themes
└── assets/           # Images, fonts, static files

public/               # Static assets copied as-is
tests/
├── e2e/              # End-to-end tests (Playwright)
├── accessibility/    # Accessibility tests (Pa11y)
└── performance/      # Lighthouse CI tests

# [REMOVE IF UNUSED] Option 2: Single project (backend/CLI)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 3: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 4: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
