# Implementation Plan: Awwwards-Worthy Portfolio Architecture

**Branch**: `003-1507-architecture-globale` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-1507-architecture-globale/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a visually distinctive, performance-optimized portfolio website using Astro's static site architecture with TypeScript and Bun runtime. The portfolio features 7 distinct pages (Home with neural network hero, About, Projects, Expertise, Blog, Contact, 404) with advanced GSAP animations including a magnetic burger menu with neural pathway link animations. The architecture must achieve Lighthouse 100 performance scores, load in under 3 seconds, and maintain 60fps animations while meeting WCAG 2.1 AA accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode) with Bun ≥1.0.0 runtime
**Primary Dependencies**:
- Astro ≥4.0.0 (static site generator, Islands architecture)
- GSAP ≥3.13.0 (animations: magnetic menu, neural networks)
- Lenis ≥1.0.0 (smooth scrolling)
- Biome ≥2.0.0 (linting and formatting)

**Storage**: Static content (Markdown files via Astro Content Collections for blog/projects, JSON for structured data like skills)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Static site deployment on GitHub Pages with CDN
**Project Type**: Web (static site with component-based architecture)
**Performance Goals**:
- Lighthouse Performance: 95-100 (desktop), 90-95 (mobile)
- Time to Interactive (TTI): <3s on 4G
- Animation frame rate: 60fps (desktop), 30fps (mobile)
- First Contentful Paint (FCP): <1.5s

**Constraints**:
- Initial page weight: ≤500KB uncompressed
- JavaScript bundle: ≤200KB total (0KB initial via Astro Islands)
- GSAP + plugins: ≤50KB minified
- Build time: <30s for full build
- WCAG 2.1 AA compliance (4.5:1 contrast, keyboard nav, screen reader support)

**Scale/Scope**:
- 7 core pages (Home, About, Projects, Expertise, Blog, Contact, 404)
- Content managed via Astro Content Collections (type-safe)
- Dynamic routes: `/projects/[slug]`, `/blog/[post]`
- Expected content: ~10-20 projects, ~10-30 blog posts
- Responsive: 320px (mobile) to 2560px (large desktop)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First (NON-NEGOTIABLE) ✅

**Status**: COMPLIANT
**Evidence**:
- Feature spec mandates Lighthouse 95-100 performance (SC-001)
- TTI <3s requirement aligns with constitutional <3s target (FR-035)
- Astro Islands architecture ensures 0KB JavaScript initial load (constitution requirement met)
- GSAP limited to ≤50KB (within 200KB total JS budget)
- Lazy loading specified for below-fold content (FR-036)
- GPU-accelerated animations mandated (FR-037)
- Code splitting at route level planned (FR-038)

**Risks**: Complex animations (neural network, magnetic menu) could impact 60fps target on mid-tier devices. Mitigation: Performance profiling required during Phase 1 implementation.

### II. Quality & Accessibility ✅

**Status**: COMPLIANT
**Evidence**:
- WCAG 2.1 AA compliance mandatory (FR-042, SC-006)
- Keyboard navigation for all interactive elements (FR-039)
- Screen reader support with ARIA attributes (FR-040)
- `prefers-reduced-motion` respected (FR-041, FR-010)
- Semantic HTML enforced (from constitution)
- 4.5:1 contrast ratios verified via color palette system (existing)

**Risks**: None identified. Accessibility is baked into requirements from the start.

### III. Build & Deployment Optimization ✅

**Status**: COMPLIANT
**Evidence**:
- Bun runtime specified (≥1.0.0) for package management
- Astro static output configured for GitHub Pages deployment
- Build time target: <30s (constitutional requirement)
- Asset fingerprinting via Astro's build pipeline
- GitHub Pages CDN included (no additional CDN needed)
- Biome configured for linting (fast alternative to ESLint)

**Risks**: None. Deployment strategy already established in previous features.

### IV. Developer Experience & Maintainability ✅

**Status**: COMPLIANT
**Evidence**:
- TypeScript 5.0+ strict mode enforced
- Component-based architecture via Astro components
- Bun's native TypeScript support (no transpilation overhead)
- Hot module reload via Astro dev server
- Biome for consistent code style
- Content Collections for type-safe content management

**Risks**: None. Existing project structure supports this feature.

### V. Content & SEO Excellence ✅

**Status**: COMPLIANT
**Evidence**:
- Unique meta titles/descriptions per page (implied by 7 distinct pages)
- Astro auto-generates sitemap.xml and robots.txt
- Content Collections for type-safe blog/project management
- Semantic URLs via Astro routing (`/projects/[slug]`, `/blog/[post]`)
- Structured data recommended for Person/Portfolio schema (not blocking)

**Risks**: Structured data (JSON-LD) not explicitly in spec. Should be added during Phase 1 design.

### VI. Tooling & Runtime Excellence ✅

**Status**: COMPLIANT
**Evidence**:
- Bun ≥1.0.0 specified in Technical Context
- Package management via `bun install` (existing practice)
- Script execution via `bun run` commands
- Native TypeScript support leveraged (no tsx/ts-node)
- Bun test runner for testing framework

**Risks**: None. Bun already established as project runtime.

### Performance Budgets Compliance ✅

**Status**: COMPLIANT
**Evidence**:
- HTML: <50KB per page (estimated, to be validated in Phase 1)
- CSS: <100KB total (using existing Catppuccin theme, minimal additions)
- JavaScript:
  - Astro runtime: 0KB (Islands architecture)
  - GSAP core + ScrollTrigger: ~45KB
  - Lenis: ~10KB
  - Interactive Islands budget: ~145KB remaining (sufficient for navigation menu and animations)
- Fonts: Using existing font setup (<100KB)
- Images: Lazy loading + optimization ensures <300KB per page

**Risks**: Neural network animation complexity unknown. Phase 0 research must determine if Canvas/SVG approach fits within budget.

### Overall Gate Status: ✅ PASS

All constitutional principles are satisfied. No violations requiring justification. Feature can proceed to Phase 0 research.

---

## Post-Design Constitution Re-Evaluation

*Performed after Phase 1 design completion*

### Design Artifacts Generated

1. **research.md**: Comprehensive technical research resolving all unknowns
   - Neural network animation approach (Canvas 2D, 5-8KB)
   - Magnetic menu implementation (GSAP quickTo(), 1-2KB)
   - Hexagonal grid layout (CSS-only, 2-3KB)

2. **data-model.md**: Complete content structure definitions
   - Content Collections schemas (Projects, Blog)
   - Data files (Skills, Navigation, Page Metadata)
   - Validation rules and relationships

3. **contracts/**: TypeScript interfaces and configurations
   - `component-interfaces.ts`: All component prop types
   - `animation-config.ts`: Animation constants and helpers
   - `README.md`: Integration guide

4. **quickstart.md**: Developer implementation guide
   - Step-by-step setup instructions
   - Code examples for all major components
   - Performance optimization checklist

### Constitutional Compliance Review

#### I. Performance First ✅ CONFIRMED

**Post-Design Evidence**:
- Neural network: 5-8KB (2.5-4% of 200KB JS budget) ✅
- Magnetic menu: 1-2KB (0.5-1% of budget) ✅
- Hexagonal grid: 2-3KB CSS (2-3% of 100KB CSS budget) ✅
- Total: ~10KB of ~300KB budget (3.3%) ✅
- Adaptive performance: Device tier detection implemented ✅
- Frame rate monitoring: `FrameRateMonitor` class for runtime optimization ✅

**Validation**: All performance budgets confirmed within limits. No budget violations.

#### II. Quality & Accessibility ✅ CONFIRMED

**Post-Design Evidence**:
- `prefers-reduced-motion` checks in all animation code ✅
- Keyboard navigation patterns documented in quickstart ✅
- ARIA attributes specified in component interfaces ✅
- Semantic HTML enforced in example components ✅
- Color contrast maintained via existing palette system ✅

**Validation**: Accessibility patterns baked into contracts and code examples.

#### III. Build & Deployment Optimization ✅ CONFIRMED

**Post-Design Evidence**:
- Astro static output configured ✅
- Bun commands documented in quickstart ✅
- Content Collections provide build-time validation ✅
- No runtime dependencies for layout (CSS-only hexagons) ✅

**Validation**: Build process remains fast and optimized.

#### IV. Developer Experience & Maintainability ✅ CONFIRMED

**Post-Design Evidence**:
- Full TypeScript interfaces in `contracts/` ✅
- Quickstart guide with copy-paste examples ✅
- Configuration constants centralized in `animation-config.ts` ✅
- JSDoc comments for all interfaces ✅

**Validation**: Developer experience enhanced with comprehensive documentation.

#### V. Content & SEO Excellence ✅ CONFIRMED

**Post-Design Evidence**:
- Content Collections schemas enforce metadata ✅
- Page metadata structure defined in `data-model.md` ✅
- Open Graph images specified in contracts ✅
- Semantic URLs via Astro routing ✅

**Validation**: SEO best practices maintained.

#### VI. Tooling & Runtime Excellence ✅ CONFIRMED

**Post-Design Evidence**:
- Bun runtime throughout quickstart examples ✅
- Native TypeScript leveraged (no transpilation) ✅
- Script execution via `bun run` ✅
- Test runner: Bun's built-in test ✅

**Validation**: Bun-first approach consistent.

### Identified Enhancements (Not Blocking)

During Phase 1 design, the following optional enhancements were identified but are **not required for MVP**:

1. **Structured Data (JSON-LD)**: Not explicitly in spec, but recommended for SEO
   - **Action**: Add to Phase 2 tasks as optional enhancement
   - **Impact**: Improves search engine understanding, not blocking

2. **Progressive Image Loading (LQIP)**: Mentioned in research but not specified
   - **Action**: Use Astro's native lazy loading (simpler)
   - **Impact**: Acceptable trade-off, native lazy loading sufficient

3. **Animation Performance Profiling**: Monitoring tools identified in research
   - **Action**: Add to testing checklist (already in quickstart.md)
   - **Impact**: Essential for validation, included in guide

### Final Gate Status: ✅ PASS (Confirmed)

**Summary**: Post-design review confirms all constitutional principles remain satisfied. Design artifacts (research, data model, contracts, quickstart) provide complete implementation blueprint while maintaining performance budgets, accessibility standards, and developer experience goals.

**No blocking issues identified.** Feature ready for Phase 2 (task generation via `/speckit.tasks`).

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
│   ├── components/          # Reusable Astro components
│   │   ├── layout/          # Header, Footer, Navigation
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── BurgerMenu.astro (NEW - magnetic menu)
│   │   ├── ui/              # UI primitives (Button, Card, etc.)
│   │   ├── islands/         # Interactive components (client-side JS)
│   │   │   ├── HeroNeuralNetwork.tsx (NEW - Canvas/WebGL animation)
│   │   │   ├── MagneticBurger.tsx (NEW - magnetic effect)
│   │   │   └── NeuralPathwayLinks.tsx (NEW - nav animations)
│   │   ├── sections/        # Page-specific sections (NEW)
│   │   │   ├── Hero.astro
│   │   │   ├── AboutIDE.astro (IDE-style theme)
│   │   │   ├── ProjectsHexGrid.astro (hexagonal grid)
│   │   │   ├── ExpertiseMatrix.astro (skills matrix)
│   │   │   ├── BlogCommits.astro (commit-style list)
│   │   │   └── ContactProtocol.astro (terminal theme)
│   │   └── animations/      # GSAP animation utilities (NEW)
│   │       ├── gsap-config.ts
│   │       └── scroll-animations.ts
│   ├── layouts/             # Page templates
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro (NEW - consistent layout wrapper)
│   ├── pages/               # File-based routing
│   │   ├── index.astro      (Home with Hero)
│   │   ├── about.astro      (NEW)
│   │   ├── projects/
│   │   │   ├── index.astro  (NEW - hexagonal grid)
│   │   │   └── [slug].astro (NEW - project detail)
│   │   ├── expertise.astro  (NEW - skills matrix)
│   │   ├── blog/
│   │   │   ├── index.astro  (NEW - commit-style list)
│   │   │   └── [slug].astro (NEW - blog post detail)
│   │   ├── contact.astro    (NEW - terminal theme)
│   │   └── 404.astro        (NEW - creative error page)
│   ├── styles/              # Global styles
│   │   ├── global.css
│   │   ├── theme.css        (existing Catppuccin palette)
│   │   └── animations.css   (NEW - animation utilities)
│   ├── content/             # Content Collections (NEW)
│   │   ├── config.ts        (Zod schemas for validation)
│   │   ├── projects/        (Markdown files: project-name.md)
│   │   └── blog/            (Markdown files: post-slug.md)
│   └── utils/               # Helper functions
│       └── format-date.ts
├── public/                  # Static assets
│   ├── images/
│   │   ├── projects/        (project screenshots/previews)
│   │   └── og-images/       (Open Graph images)
│   └── fonts/
├── tests/                   # Test files
│   ├── unit/
│   │   ├── components/      (component tests)
│   │   └── utils/           (utility function tests)
│   └── integration/
│       └── pages/           (page rendering tests)
└── astro.config.mjs         (Astro configuration)
```

**Structure Decision**: Web application (Astro static site) with component-based architecture. This is an **existing project** being enhanced with new pages and animations. The structure leverages Astro's:
- **File-based routing** (`src/pages/`) for the 7 core pages
- **Content Collections** (`src/content/`) for type-safe blog/project management
- **Islands architecture** (`src/components/islands/`) for selective client-side hydration of animations
- **Component modularity** (`src/components/`) for reusable UI elements and page sections

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**Status**: No violations detected. Constitution Check passed with full compliance.
