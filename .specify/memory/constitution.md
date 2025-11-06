<!--
Sync Impact Report:
- Version: 1.0.0 → 1.1.0
- Rationale: Added Principle VI (Tooling & Runtime Excellence) for Bun runtime specifications.
  Expanded technical standards for Astro framework and GSAP animation library.
  Material additions to Performance Standards and Development Workflow sections.
- Principles modified:
  1. Performance First - Added Astro-specific targets (0KB JS initial, Islands architecture)
  2. Quality & Accessibility - Added animation performance targets (60fps, GSAP optimization)
  3. Build & Deployment Optimization - Added Bun-specific build targets (<30s), Astro output specs
  4. Developer Experience & Maintainability - Expanded with Bun and Astro tooling requirements
  5. Content & SEO Excellence - No changes
  6. NEW: Tooling & Runtime Excellence - Bun runtime, package management, and tooling standards
- Added sections:
  * Bun Runtime Standards (sub-section under Tooling & Runtime Excellence)
  * Astro Framework Standards (sub-section under Performance Standards)
  * GSAP Animation Standards (sub-section under Performance Standards)
- Removed sections: None
- Templates requiring updates:
  ✅ plan-template.md - Already includes static site structure, constitution checks, and performance context
  ✅ spec-template.md - Already includes Performance & Quality Criteria for static sites
  ✅ tasks-template.md - Already includes Constitutional Validation phase with performance/accessibility tasks
  ⚠ MANUAL REVIEW RECOMMENDED: Verify that build/test commands in plan-template.md align with Bun (e.g., 'bun install', 'bun run build')
- Follow-up TODOs:
  * Consider adding specific Astro View Transitions guidance in future amendments
  * Monitor Bun ecosystem maturity and update tooling standards as needed (e.g., when Bun test runner reaches v1.0)
-->

# Portfolio Static Site Constitution

## Core Principles

### I. Performance First (NON-NEGOTIABLE)

**Rules**:
- Static site MUST achieve Core Web Vitals targets: LCP <2.5s, FID <100ms, CLS <0.1
- Page weight MUST NOT exceed 500KB for initial load (uncompressed)
- Time to Interactive (TTI) MUST be under 3 seconds on 3G networks
- JavaScript MUST ship 0KB initial load via Astro Islands architecture
- Only interactive components MUST be hydrated with JavaScript
- All images MUST be optimized and served in modern formats (WebP/AVIF with fallbacks)
- JavaScript for animations (GSAP) MUST be minimal, defer non-critical scripts, and use code splitting
- Animations MUST maintain 60fps performance on mid-tier devices

**Rationale**: Performance is a core user experience metric and competitive differentiator for portfolio sites. Astro's zero-JavaScript-by-default architecture ensures optimal performance. Slow sites increase bounce rates and negatively impact SEO. Static sites have no excuse for poor performance.

### II. Quality & Accessibility

**Rules**:
- MUST achieve WCAG 2.1 AA compliance minimum
- All interactive elements MUST be keyboard navigable
- Semantic HTML MUST be used throughout (proper heading hierarchy, landmarks, alt text)
- Color contrast ratios MUST meet AA standards (4.5:1 for normal text, 3:1 for large text)
- MUST support screen readers and assistive technologies
- Cross-browser compatibility MUST include last 2 versions of major browsers
- GSAP animations MUST respect prefers-reduced-motion user preference
- Animated elements MUST maintain accessibility during transitions (focus management, ARIA states)

**Rationale**: Accessibility is not optional - it ensures the portfolio is usable by everyone and demonstrates professional quality standards. Good accessibility also improves SEO. Animations must enhance, not hinder, user experience for all users including those with motion sensitivities.

### III. Build & Deployment Optimization

**Rules**:
- Build process MUST complete in under 30 seconds for typical changes (Bun + Astro target)
- Static assets MUST be fingerprinted/hashed for optimal caching
- MUST implement aggressive caching strategies (immutable assets, cache-busting)
- MUST use CDN for asset delivery (GitHub Pages CDN included)
- HTML/CSS/JS MUST be minified and compressed (gzip/brotli)
- Unused CSS MUST be purged from production builds (Tailwind CSS purging)
- Astro MUST output static files to /dist directory for deployment
- Build process MUST use Bun for package management and script execution

**Rationale**: Fast builds enable rapid iteration and developer productivity. Bun provides 2-10x faster install and execution compared to npm/yarn. Optimized deployment ensures maximum performance and minimal hosting costs for static sites. GitHub Pages is free for public repos and provides global CDN distribution.

### IV. Developer Experience & Maintainability

**Rules**:
- Code MUST follow consistent style guide (enforced via linting with Biome or ESLint)
- Component-based architecture MUST be used for reusability (Astro components)
- Configuration MUST be environment-aware (dev/staging/production)
- Local development server MUST support hot module reload (Astro dev server)
- Documentation MUST exist for setup, build, and deployment processes
- Dependencies MUST be kept minimal and regularly updated
- MUST use TypeScript for type safety across components and utilities
- MUST use Bun's native TypeScript support (no separate transpilation step required)
- Package management MUST use Bun (bun install, bun add, bun remove)

**Rationale**: Maintainable code ensures long-term project health. Good developer experience reduces friction and enables faster iteration. Bun's speed improvements and native TypeScript support streamline development workflow. Type safety catches errors early and improves code quality.

### V. Content & SEO Excellence

**Rules**:
- Every page MUST have unique, descriptive meta titles and descriptions
- Structured data (JSON-LD) MUST be implemented for relevant content types (Person, Portfolio, WebSite)
- sitemap.xml and robots.txt MUST be generated automatically by Astro
- Open Graph and Twitter Card meta tags MUST be present on all pages
- URLs MUST be semantic and human-readable
- MUST implement proper canonical URLs to prevent duplicate content
- Content MUST be organized in Astro's content collections for type safety

**Rationale**: A portfolio's purpose is to be discovered and showcase work. Strong SEO ensures visibility. Structured data helps search engines understand content context. Astro's content collections provide type-safe content management and automatic routing.

### VI. Tooling & Runtime Excellence

**Rules**:
- MUST use Bun as the JavaScript runtime and package manager
- Package installation MUST use `bun install` (not npm/yarn/pnpm)
- Script execution MUST use `bun run` commands
- Bun version MUST be specified in package.json "engines" field (e.g., ">=1.0.0")
- MUST leverage Bun's native features: built-in TypeScript, fast bundler, test runner
- MUST avoid installing redundant tools that Bun provides natively (e.g., tsx, ts-node)
- Development workflow MUST prioritize Bun's performance advantages
- MUST document Bun installation requirements in project setup

**Rationale**: Bun provides significant performance improvements (2-10x faster) over Node.js for package management and script execution. Native TypeScript support eliminates transpilation overhead. Using a consistent runtime across development and CI/CD ensures predictable behavior. Bun's modern architecture aligns with the performance-first principle.

## Performance Standards

### Measurable Targets

- **Lighthouse Performance Score**: ≥95 (mobile and desktop)
- **Lighthouse Accessibility Score**: ≥95
- **Lighthouse Best Practices Score**: ≥95
- **Lighthouse SEO Score**: ≥95
- **Total Blocking Time (TBT)**: <200ms
- **First Contentful Paint (FCP)**: <1.5s
- **Speed Index**: <3.0s
- **Animation Frame Rate**: 60fps sustained during GSAP animations

### Performance Budgets

- **HTML per page**: <50KB (uncompressed)
- **CSS total**: <100KB (uncompressed, after Tailwind purge)
- **JavaScript total**: <200KB (uncompressed)
  - **Astro runtime**: ~0KB for static pages
  - **GSAP core + ScrollTrigger**: ~45KB (minified)
  - **Lenis smooth scroll**: ~10KB (minified)
  - **Interactive Islands**: <145KB combined
- **Fonts**: <100KB total (subset and preload)
- **Images per page**: <300KB (optimized, after compression)

### Astro Framework Standards

- **Output Mode**: MUST use static output (`output: 'export'` in astro.config.mjs)
- **JavaScript Strategy**: Default to 0KB JavaScript; hydrate only interactive components
- **Hydration Directives**: Use appropriate client directives (client:load, client:visible, client:idle)
- **View Transitions**: MAY use Astro View Transitions API for page navigation (optional enhancement)
- **Content Collections**: MUST use for type-safe content management
- **Integration**: MAY integrate React/Vue/Svelte components as Islands if complex interactivity needed
- **Base Path**: MUST configure basePath for GitHub Pages deployment (e.g., `/portfolio`)

### GSAP Animation Standards

- **Bundle Size**: Core GSAP + plugins MUST NOT exceed 50KB minified
- **Performance**: Animations MUST use GPU-accelerated properties (transform, opacity)
- **Avoid**: Animating layout properties (width, height, top, left) that trigger reflow
- **ScrollTrigger**: MUST be used for scroll-based animations (included in bundle budget)
- **Smooth Scroll**: MAY use Lenis or similar library for smooth scrolling (~10KB)
- **Motion Accessibility**: MUST respect prefers-reduced-motion media query
- **Lazy Loading**: Animation scripts MUST be loaded only when needed (code splitting)
- **Cleanup**: MUST properly cleanup GSAP animations and ScrollTrigger instances on page unmount

### Monitoring

- Performance MUST be measured on every build via Lighthouse CI
- Performance regressions >5% MUST block deployment
- Real User Monitoring (RUM) SHOULD be implemented for production insights
- Animation performance MUST be monitored via browser DevTools Performance panel during development

## Development Workflow

### Quality Gates

1. **Pre-commit**: Linting (HTML/CSS/JS/TS), formatting verification (Biome/Prettier)
2. **Pre-push**: Build success with Bun, basic validation
3. **Pull Request**: Lighthouse CI, accessibility audit, visual regression tests
4. **Pre-deploy**: Full performance audit, broken link check, SEO validation

### Build Process

- MUST use Astro as the static site generator
- MUST use Bun for package installation and build script execution
- MUST generate optimized production builds (`bun run build`)
- MUST support incremental builds where possible
- MUST validate HTML, check for broken links
- Build output MUST be in /dist directory
- Build time target: <30 seconds for full build, <5 seconds for incremental

### Development Commands

Standard Bun + Astro workflow:
- **Install**: `bun install` (not npm install)
- **Dev Server**: `bun run dev` (Astro dev with HMR)
- **Build**: `bun run build` (static export to /dist)
- **Preview**: `bun run preview` (test production build locally)
- **Lint**: `bun run lint` (if configured)
- **Format**: `bun run format` (if configured)

### Deployment

- MUST use atomic deployments (full site replacement via GitHub Actions)
- MUST support instant rollback capability (GitHub Pages history)
- MUST invalidate CDN cache on deployment (automatic with GitHub Pages)
- SHOULD use preview deployments for branches (Netlify/Vercel optional)
- Deployment target: GitHub Pages with custom domain support
- Deployment trigger: Push to main branch via GitHub Actions workflow

## Governance

### Amendment Process

- Amendments to this constitution require documented justification
- Performance budget changes MUST include before/after measurements
- Principle additions MUST NOT contradict existing principles
- All amendments MUST be versioned following semantic versioning
- Technology changes (e.g., runtime, framework) require MINOR version bump minimum

### Compliance

- Every feature specification MUST reference relevant constitutional principles
- Implementation plans MUST include performance budget impact assessment
- Code reviews MUST verify constitutional compliance
- Quarterly audits SHOULD be conducted to ensure ongoing adherence
- MUST verify Bun runtime is used for all package and script operations

### Versioning Policy

- Version format: MAJOR.MINOR.PATCH
- MAJOR: Backward incompatible changes (e.g., removing a principle, changing runtime/framework)
- MINOR: New principles or materially expanded sections (e.g., new tooling standards)
- PATCH: Clarifications, wording improvements, non-semantic updates

**Version**: 1.1.0 | **Ratified**: 2025-11-06 | **Last Amended**: 2025-11-06
