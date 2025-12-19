# Implementation Plan: Portfolio with TUI Aesthetic

**Branch**: `PBF-32-portofolio-with-tui` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-32-portofolio-with-tui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Complete redesign of the portfolio with a Terminal User Interface (TUI) aesthetic inspired by Neovim and tmux. The layout features a tmux-style top bar with buffer tabs, NvimTree-style file sidebar, content area with line numbers, Neovim statusline, and decorative command line. Navigation uses file metaphor (hero.tsx, about.tsx, etc.) with smooth scrolling between sections. Each section has unique TUI styling: README.md for About, git log for Experience, Telescope/fzf for Projects, :checkhealth for Expertise, and terminal commands for Contact.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3 (static site generator), GSAP 3.13.0 (animations), Lenis 1.0.42 (smooth scroll), Biome 2.3.4 (linting)
**Storage**: N/A (static site, Markdown via Astro Content Collections)
**Testing**: Bun test runner (built-in, Jest-compatible API)
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), GitHub Pages deployment
**Project Type**: Web (static site with single-page architecture)
**Performance Goals**: Lighthouse ≥85 mobile / ≥95 desktop, 60fps scrolling on desktop, 30fps minimum on mobile, LCP <2.5s, FCP <2s
**Constraints**: Total page weight <500KB, JavaScript <200KB, smooth animations at 60fps with device tier adaptation
**Scale/Scope**: 6 sections (hero, about, experience, projects, expertise, contact), responsive (320px-2560px), 3 breakpoints (mobile <768px, tablet 768-1023px, desktop ≥1024px)

**Key Technology Decisions** (Resolved via [research.md](./research.md)):
- **Font**: JetBrains Mono (self-hosted Latin subset via Fontsource, ~35KB for 2 weights)
- **Nerd Font Icons**: Custom 4-icon subset (self-hosted WOFF2, 2-4KB)
- **Typing Animation**: GSAP TextPlugin (+3KB, integrates with existing GSAP 3.13.0)
- **Syntax Highlighting**: CSS-only semantic classes (zero JS, ~4KB CSS)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Evaluation

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Performance First** | LCP <2.5s, FID <100ms, CLS <0.1, <500KB initial load, 0KB JS initial via Astro Islands | ✅ PASS | TUI layout is CSS-driven; typing animation uses minimal JS; no heavy libraries added |
| **I. Performance First** | 60fps animations on mid-tier devices | ✅ PASS | Reuses existing GSAP/Lenis; typing animation is lightweight |
| **II. Quality & Accessibility** | WCAG 2.1 AA, keyboard navigation, semantic HTML | ✅ PASS | FR-026-029 explicitly require accessibility; spec Decision 4 chose standard Tab/Enter navigation |
| **II. Quality & Accessibility** | prefers-reduced-motion support | ✅ PASS | FR-027 requires respecting reduced motion; typing animation has static fallback |
| **III. Build & Deployment** | Build <30s, static output to /dist, Bun for scripts | ✅ PASS | No new build complexity; leverages existing Astro/Bun toolchain |
| **IV. Developer Experience** | Component-based, TypeScript, consistent style | ✅ PASS | New TUI components follow existing patterns; TypeScript interfaces for entities |
| **V. Content & SEO** | Meta tags, sitemap, structured data | ✅ PASS | Single-page maintains existing SEO; hash navigation preserves URLs |
| **VI. Tooling & Runtime** | Bun runtime, no redundant tools | ✅ PASS | No new runtime dependencies; optional font CDN is external asset only |

### Performance Budget Impact Assessment

| Resource | Current Budget | TUI Feature Impact | Within Budget? |
|----------|---------------|-------------------|----------------|
| **JavaScript** | <200KB | +~5KB (typing animation) | ✅ Yes |
| **CSS** | <100KB | +~15KB (TUI layout/components) | ✅ Yes |
| **Fonts** | <100KB | +~50-80KB (monospace font + Nerd Font icons) | ⚠️ Monitor |
| **Total** | <500KB | +~70-100KB estimated | ✅ Yes |

**Risk Areas**:
1. **Font loading** - Nerd Font icons subset must be carefully curated to avoid bloat
2. **Typing animation** - Must use requestAnimationFrame with reduced motion fallback

### Violations Requiring Justification

*None identified - all requirements align with constitution principles.*

## Project Structure

### Documentation (this feature)

```
specs/PBF-32-portofolio-with-tui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── tui-components.d.ts   # TypeScript interfaces for TUI components
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── layout/                    # MODIFY: Replace Header with TUI layout
│   │   ├── TuiLayout.astro        # NEW: Main TUI container (top bar, sidebar, content, statusline, cmdline)
│   │   ├── TopBar.astro           # NEW: tmux-style top bar with buffer tabs + clock + git branch
│   │   ├── Sidebar.astro          # NEW: NvimTree-style file sidebar
│   │   ├── StatusLine.astro       # NEW: Neovim statusline (mode, file, cursor position)
│   │   ├── CommandLine.astro      # NEW: Decorative command line
│   │   ├── BurgerMenu.astro       # KEEP: Mobile menu (adapt styling)
│   │   └── Footer.astro           # KEEP: Footer (adapt styling)
│   ├── sections/
│   │   ├── HeroTui.astro          # NEW: Hero with typing animation + cursor
│   │   ├── AboutReadme.astro      # NEW: README.md styled about section
│   │   ├── ExperienceGitLog.astro # NEW: git log styled experience timeline
│   │   ├── ProjectsTelescope.astro # NEW: Telescope/fzf styled projects
│   │   ├── ExpertiseCheckhealth.astro # NEW: :checkhealth styled expertise
│   │   └── ContactTerminal.astro  # MODIFY: Adapt existing ContactProtocol
│   └── ui/
│       ├── BufferTab.astro        # NEW: Individual buffer tab component
│       ├── FileEntry.astro        # NEW: Sidebar file entry with icon
│       ├── LineNumbers.astro      # NEW: Line number gutter component
│       └── TypewriterText.astro   # NEW: Typing animation component
├── layouts/
│   └── PageLayout.astro           # MODIFY: Integrate TuiLayout
├── pages/
│   └── index.astro                # MODIFY: Use new TUI section components
├── scripts/
│   ├── typing-animation.ts        # NEW: Hero typing effect with cursor
│   ├── tui-navigation.ts          # NEW: Sidebar + tab navigation handler
│   └── statusline-sync.ts         # NEW: Statusline state management
├── styles/
│   ├── tui/                       # NEW: TUI-specific styles
│   │   ├── layout.css             # NEW: TUI grid layout
│   │   ├── sidebar.css            # NEW: NvimTree styling
│   │   ├── statusline.css         # NEW: Neovim statusline styling
│   │   ├── typography.css         # NEW: Monospace font + syntax colors
│   │   └── sections.css           # NEW: Section-specific TUI styles
│   ├── theme.css                  # KEEP: Catppuccin Mocha palette (reuse tokens)
│   └── global.css                 # MODIFY: Import TUI styles
├── data/
│   ├── sections.ts                # MODIFY: Add TUI file metadata (icons, display names)
│   └── navigation.ts              # KEEP: Navigation links (adapt for TUI)
└── types/
    ├── tui.ts                     # NEW: TUI component interfaces (Section, BufferTab, StatuslineState, CommandLine)
    └── experience.ts              # KEEP: Experience entity (reuse)

public/
└── fonts/                         # NEW: Self-hosted monospace + Nerd Font subset
    ├── jetbrains-mono-*.woff2     # NEW: JetBrains Mono font files
    └── nerd-font-symbols.woff2    # NEW: Nerd Font icon subset

tests/
├── unit/
│   ├── typing-animation.test.ts   # NEW: Typing animation unit tests
│   └── tui-navigation.test.ts     # NEW: TUI navigation tests
└── integration/
    └── tui-layout.test.ts         # NEW: Full layout integration tests
```

**Structure Decision**: Web application (static site) using existing Astro component architecture. New TUI components are added to existing `components/` structure following established patterns. Styles are organized under new `styles/tui/` subdirectory to keep TUI-specific CSS isolated. Existing color palette in `theme.css` is preserved and reused.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *No violations* | N/A | N/A |

**Complexity Notes**:
- Component count is moderate (~15 new/modified components) but each is focused and single-purpose
- CSS organization uses subdirectory (`styles/tui/`) to avoid bloating existing stylesheets
- Typing animation requires ~100 lines of JS but is isolated and lazy-loaded
- Font loading adds external dependency but uses standard web font patterns
