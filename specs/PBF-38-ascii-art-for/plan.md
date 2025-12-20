# Implementation Plan: ASCII Art for Name on Hero Section

**Branch**: `PBF-38-ascii-art-for` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-38-ascii-art-for/spec.md`

## Summary

Replace the plain text name "Benoit Fernandez" in the hero section with ASCII art using the same box-drawing Unicode character style as the "CONTACT" ASCII art in the contact section. The ASCII art will appear statically (no typewriter animation), while the subheadline retains its typewriter animation. The implementation must be responsive across all viewport sizes.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode)
**Primary Dependencies**: Astro 5.15.3, GSAP 3.13.0 (for typewriter animation on subheadline)
**Storage**: N/A (static site)
**Testing**: Bun test runner (unit and integration tests)
**Target Platform**: Web (GitHub Pages), all modern browsers, viewport 320px-1920px+
**Project Type**: Static site (Astro Islands architecture)
**Performance Goals**: Lighthouse ≥85 mobile, 60fps animations, <500KB page weight
**Constraints**: ASCII art must not cause horizontal overflow on mobile (<768px), must respect prefers-reduced-motion
**Scale/Scope**: Single component modification (HeroTui.astro)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Performance First** | ✅ PASS | ASCII art is pure HTML/CSS, no additional JavaScript. Minimal page weight impact (~1KB). Static display respects 0KB JS initial load. |
| **II. Quality & Accessibility** | ✅ PASS | Will use aria-label for screen reader accessibility. Semantic `<pre>` element. Color contrast maintained with --color-primary. |
| **III. Build & Deployment** | ✅ PASS | No build process changes. Static content. |
| **IV. Developer Experience** | ✅ PASS | Component-based architecture maintained. TypeScript strict mode. |
| **V. Content & SEO** | ✅ PASS | Semantic HTML preserved. Alt text via aria-label. |
| **VI. Tooling & Runtime** | ✅ PASS | Uses existing Bun + Astro workflow. No new dependencies. |

### Performance Standards Compliance

| Target | Expected Impact | Status |
|--------|-----------------|--------|
| Lighthouse ≥95 | No degradation - static content only | ✅ PASS |
| JavaScript budget (<200KB) | No change - ASCII art is HTML | ✅ PASS |
| HTML per page (<50KB) | ~1KB increase for ASCII art | ✅ PASS |
| Animation 60fps | Subheadline typewriter unchanged | ✅ PASS |

### GSAP Animation Standards

| Requirement | Compliance |
|-------------|------------|
| Respect prefers-reduced-motion | Static ASCII art naturally complies |
| GPU-accelerated properties | N/A (static display) |
| Cleanup on unmount | N/A (no new animations) |

## Project Structure

### Documentation (this feature)

```
specs/PBF-38-ascii-art-for/
├── plan.md              # This file
├── research.md          # Phase 0 output - ASCII art generation research
├── data-model.md        # Phase 1 output - ASCII art data structure
├── quickstart.md        # Phase 1 output - Implementation guide
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (files to modify)

```
src/
├── components/
│   └── sections/
│       └── HeroTui.astro          # PRIMARY - Add ASCII art name display
└── styles/
    └── tui/                       # TUI-specific styles (may add hero-ascii styles)

tests/
├── unit/
│   └── ascii-art.test.ts          # Test ASCII art rendering (optional)
└── integration/
    └── hero-section.test.ts       # Test hero section displays correctly (optional)
```

**Structure Decision**: This is an Astro static site. The modification is localized to `HeroTui.astro` component which currently displays the headline with typewriter animation. The ASCII art styling can be added inline (like ContactTerminal.astro) or extracted to TUI styles if reuse is needed.

## Complexity Tracking

*No violations identified. All constitution checks pass.*

---

## Post-Design Constitution Check (Phase 1)

*Re-evaluation after research and design phases completed.*

### Principle Compliance

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| **I. Performance First** | ✅ PASS | Confirmed: +1.2KB HTML, -200 bytes JS (net +1KB). Within all budgets. |
| **II. Quality & Accessibility** | ✅ PASS | Design includes `aria-label`, semantic `<h1>` wrapper, `<pre>` for preformatted text. |
| **III. Build & Deployment** | ✅ PASS | No changes to build process. Static content only. |
| **IV. Developer Experience** | ✅ PASS | Single component modification. Clear implementation guide in quickstart.md. |
| **V. Content & SEO** | ✅ PASS | `<h1>` heading preserved for SEO. Screen readers receive proper name. |
| **VI. Tooling & Runtime** | ✅ PASS | No new dependencies. Uses existing Bun + Astro workflow. |

### Performance Budget Impact

| Budget | Limit | Before | After | Status |
|--------|-------|--------|-------|--------|
| HTML per page | <50KB | ~15KB | ~16.2KB | ✅ PASS |
| JavaScript | <200KB | ~55KB | ~54.8KB | ✅ PASS |
| Total page weight | <500KB | ~180KB | ~181KB | ✅ PASS |

### Design Decisions Summary

1. **ASCII Art Style**: ANSI Shadow font (confirmed match with ContactTerminal.astro)
2. **Layout**: Stacked names (76 chars wide, 14 lines tall)
3. **Responsive**: CSS `clamp()` scaling (0.3rem to 0.5rem)
4. **Animation**: Static display for ASCII, typewriter preserved for subheadline
5. **Accessibility**: `aria-label` on `<pre>`, `<h1>` wrapper for semantic heading

### Artifacts Generated

| Artifact | Location | Purpose |
|----------|----------|---------|
| research.md | `specs/PBF-38-ascii-art-for/research.md` | FIGlet font research, responsive strategies |
| data-model.md | `specs/PBF-38-ascii-art-for/data-model.md` | Component structure, CSS tokens |
| quickstart.md | `specs/PBF-38-ascii-art-for/quickstart.md` | Step-by-step implementation guide |
| ascii-art-options.txt | `specs/PBF-38-ascii-art-for/ascii-art-options.txt` | ASCII art visual reference |

---

**Planning complete. Ready for `/speckit.tasks` to generate implementation tasks.**
