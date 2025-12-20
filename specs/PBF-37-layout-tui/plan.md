# Implementation Plan: TUI Layout Redesign

**Branch**: `PBF-37-layout-tui` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-37-layout-tui/spec.md`

## Summary

Redesign the TUI layout to improve buffer tab styling (match Neovim aesthetic from mockup), implement horizontal slide animations for desktop navigation, maintain vertical scroll on mobile, and add per-section line numbers. This enhances the portfolio's authenticity as an IDE-inspired interface.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode)
**Primary Dependencies**: Astro 5.15.3, GSAP 3.13.0, Lenis 1.0.42
**Storage**: N/A (static site, no persistent storage)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web browsers (desktop >= 1024px, tablet 768-1023px, mobile < 768px)
**Project Type**: Web application (static site with Islands architecture)
**Performance Goals**: 60fps animations on HIGH tier devices, 400ms max transition duration, Lighthouse >= 85 mobile / >= 95 desktop
**Constraints**: Total JS < 200KB, animation bundle (GSAP + Lenis) ~55KB, respect prefers-reduced-motion
**Scale/Scope**: Single-page application with 6 sections, ~20 components affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Performance First (NON-NEGOTIABLE)
| Gate | Status | Notes |
|------|--------|-------|
| Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1) | ✅ PASS | Static site, CSS-only changes don't impact |
| Page weight < 500KB initial | ✅ PASS | No new assets, CSS-only additions |
| 0KB initial JS via Islands | ✅ PASS | Navigation script already loaded |
| Animations maintain 60fps | ⚠️ REVIEW | Horizontal slide requires GPU-accelerated properties (transform) |
| GSAP bundle < 50KB | ✅ PASS | Already using GSAP core + ScrollTrigger |

### II. Quality & Accessibility
| Gate | Status | Notes |
|------|--------|-------|
| WCAG 2.1 AA compliance | ✅ PASS | Tab styling maintains contrast ratios |
| Keyboard navigation | ✅ PASS | Existing j/k, arrow keys, Enter support |
| prefers-reduced-motion | ⚠️ REVIEW | Must disable horizontal slide for users with preference |

### III. Build & Deployment Optimization
| Gate | Status | Notes |
|------|--------|-------|
| Build < 30s | ✅ PASS | CSS/JS changes only |
| Uses Bun commands | ✅ PASS | bun install, bun run dev/build |

### IV. Developer Experience & Maintainability
| Gate | Status | Notes |
|------|--------|-------|
| TypeScript strict mode | ✅ PASS | Existing codebase pattern |
| Component-based architecture | ✅ PASS | Astro components already structured |

### V. Content & SEO Excellence
| Gate | Status | Notes |
|------|--------|-------|
| Hash-based deep linking | ✅ PASS | Already implemented, preserved |

### VI. Tooling & Runtime Excellence
| Gate | Status | Notes |
|------|--------|-------|
| Bun runtime | ✅ PASS | package.json engines: bun >= 1.0.0 |

**Pre-Design Gate Status**: ✅ PASS (2 items flagged for review during implementation)

## Project Structure

### Documentation (this feature)

```
specs/PBF-37-layout-tui/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
├── assets/              # Visual references
│   └── mockup-tab-styling.png
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (Astro static site)

```
src/
├── components/
│   ├── layout/              # TUI structural components
│   │   ├── TuiLayout.astro  # Main container (MODIFY)
│   │   ├── TopBar.astro     # tmux-style bar (MODIFY)
│   │   ├── Sidebar.astro    # NvimTree sidebar
│   │   ├── StatusLine.astro # Vim statusline (MODIFY)
│   │   └── CommandLine.astro
│   ├── sections/            # Content sections
│   │   ├── HeroTui.astro    # (ADD per-section line numbers)
│   │   ├── AboutReadme.astro
│   │   ├── ExperienceGitLog.astro
│   │   ├── ProjectsTelescope.astro
│   │   ├── ExpertiseCheckhealth.astro
│   │   └── ContactTerminal.astro
│   └── ui/
│       ├── BufferTab.astro   # Tab component (MAJOR RESTYLE)
│       └── LineNumbers.astro # Line gutter (MODIFY for per-section)
├── scripts/
│   ├── tui-navigation.ts     # Navigation logic (MAJOR REWRITE)
│   ├── gsap-config.ts        # GSAP setup
│   └── performance/
│       └── device-tier.ts    # Device detection
├── styles/
│   └── tui/
│       ├── layout.css        # Grid layout (MODIFY)
│       └── [other TUI styles]
├── types/
│   └── tui.ts               # TypeScript interfaces
└── data/
    └── sections.ts          # Section configuration

tests/
├── unit/
└── integration/
```

**Structure Decision**: Astro static site with component-based architecture. All changes are within existing `src/` structure. No new directories required.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations | All gates passed |

**Note**: The 2 review items (60fps animations, prefers-reduced-motion) are implementation details, not violations. They will be addressed during implementation with proper testing.

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

### I. Performance First (NON-NEGOTIABLE)
| Gate | Status | Notes |
|------|--------|-------|
| Animations maintain 60fps | ✅ PASS | Research confirms: use `transform`/`xPercent` only (GPU-accelerated), `killTweensOf()` for clean interruption |
| GSAP bundle < 50KB | ✅ PASS | No new GSAP plugins required, existing bundle sufficient |

### II. Quality & Accessibility
| Gate | Status | Notes |
|------|--------|-------|
| prefers-reduced-motion | ✅ PASS | Research defines pattern: use `gsap.matchMedia()` with instant fallback (0.15s fade, no slide) |

**Post-Design Gate Status**: ✅ ALL PASS

All review items have been resolved through research findings. Implementation patterns documented in `research.md`.

---

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Implementation Plan | `specs/PBF-37-layout-tui/plan.md` | Complete |
| Research Findings | `specs/PBF-37-layout-tui/research.md` | Complete |
| Data Model | `specs/PBF-37-layout-tui/data-model.md` | Complete |
| API Contracts | `specs/PBF-37-layout-tui/contracts/` | N/A (frontend-only) |
| Quickstart Guide | `specs/PBF-37-layout-tui/quickstart.md` | Complete |
| Agent Context | `CLAUDE.md` | Updated |

---

## Next Steps

Run `/speckit.tasks` to generate the implementation tasks from this plan.
