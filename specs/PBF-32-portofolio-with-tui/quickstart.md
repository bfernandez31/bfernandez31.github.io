# Quickstart: Portfolio with TUI Aesthetic

**Feature Branch**: `PBF-32-portofolio-with-tui`
**Created**: 2025-12-19

This document provides a rapid onboarding guide for developers implementing the TUI-aesthetic portfolio feature.

---

## Overview

Transform the portfolio into a Terminal User Interface (TUI) inspired by Neovim and tmux:

- **Top Bar**: tmux-style with buffer tabs, clock, git branch
- **Sidebar**: NvimTree-style file explorer with 6 "files"
- **Content Area**: Main viewport with line numbers gutter
- **Statusline**: Neovim-style mode/file/position display
- **Command Line**: Decorative `:e filename` display

---

## Quick Setup

### 1. Switch to Feature Branch

```bash
git checkout PBF-32-portofolio-with-tui
bun install
```

### 2. Install Font Dependencies

```bash
# Download fonts (one-time setup)
mkdir -p public/fonts

# Option A: Use Fontsource packages
bun add @fontsource/jetbrains-mono

# Option B: Download manually
# JetBrains Mono: https://www.jetbrains.com/lp/mono/
# Nerd Font subset: See research.md for subsetting instructions
```

### 3. Start Development

```bash
bun run dev
# Open http://localhost:4321
```

---

## Key Files to Create/Modify

### New Components

| File | Purpose | Priority |
|------|---------|----------|
| `src/components/layout/TuiLayout.astro` | Main TUI container | P0 |
| `src/components/layout/TopBar.astro` | tmux-style top bar | P0 |
| `src/components/layout/Sidebar.astro` | NvimTree file list | P0 |
| `src/components/layout/StatusLine.astro` | Neovim statusline | P0 |
| `src/components/layout/CommandLine.astro` | Command line | P2 |
| `src/components/sections/HeroTui.astro` | Hero with typing | P1 |
| `src/components/sections/AboutReadme.astro` | README.md style | P2 |
| `src/components/sections/ExperienceGitLog.astro` | Git log style | P2 |
| `src/components/sections/ProjectsTelescope.astro` | Telescope style | P2 |
| `src/components/sections/ExpertiseCheckhealth.astro` | Checkhealth style | P2 |
| `src/components/sections/ContactTerminal.astro` | Terminal style | P2 |

### New Styles

| File | Purpose |
|------|---------|
| `src/styles/tui/layout.css` | TUI grid layout |
| `src/styles/tui/sidebar.css` | NvimTree styling |
| `src/styles/tui/statusline.css` | Statusline styling |
| `src/styles/tui/typography.css` | Monospace fonts |
| `src/styles/tui/syntax.css` | Section-specific TUI styles |
| `src/styles/tui/icons.css` | Nerd Font icons |

### New Scripts

| File | Purpose |
|------|---------|
| `src/scripts/typing-animation.ts` | Hero typing effect |
| `src/scripts/tui-navigation.ts` | Sidebar/tab navigation |
| `src/scripts/statusline-sync.ts` | Statusline state sync |

### Modified Files

| File | Changes |
|------|---------|
| `src/layouts/PageLayout.astro` | Import TuiLayout |
| `src/pages/index.astro` | Use TUI section components |
| `src/styles/global.css` | Import TUI styles |
| `src/data/sections.ts` | Add TUI metadata (icons, fileNames) |

---

## TUI Layout Structure

```html
<!-- TuiLayout.astro structure -->
<div class="tui-layout">
  <!-- tmux-style top bar -->
  <header class="tui-topbar">
    <div class="tui-topbar__tabs"><!-- BufferTabs --></div>
    <div class="tui-topbar__meta">
      <span class="tui-clock">12:34</span>
      <span class="tui-branch">main</span>
    </div>
  </header>

  <!-- Main content area -->
  <main class="tui-main">
    <!-- NvimTree sidebar -->
    <aside class="tui-sidebar">
      <nav class="tui-sidebar__files">
        <!-- FileEntry components -->
      </nav>
    </aside>

    <!-- Content viewport with line numbers -->
    <article class="tui-content">
      <div class="tui-content__gutter">
        <!-- LineNumbers component -->
      </div>
      <div class="tui-content__viewport">
        <slot />
      </div>
    </article>
  </main>

  <!-- Neovim statusline -->
  <footer class="tui-statusline">
    <span class="tui-mode">NORMAL</span>
    <span class="tui-file">hero.tsx</span>
    <span class="tui-position">Ln 1, Col 1</span>
  </footer>

  <!-- Command line -->
  <div class="tui-commandline">
    <span class="tui-prompt">:</span>
    <span class="tui-command">e hero.tsx</span>
  </div>
</div>
```

---

## CSS Grid Layout

```css
/* src/styles/tui/layout.css */
.tui-layout {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  grid-template-columns: minmax(200px, 250px) 1fr;
  grid-template-areas:
    "topbar  topbar"
    "sidebar content"
    "status  status"
    "cmdline cmdline";
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.tui-topbar { grid-area: topbar; }
.tui-sidebar { grid-area: sidebar; }
.tui-content { grid-area: content; }
.tui-statusline { grid-area: status; }
.tui-commandline { grid-area: cmdline; }

/* Mobile: sidebar hidden */
@media (max-width: 767px) {
  .tui-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "topbar"
      "content"
      "status"
      "cmdline";
  }
  .tui-sidebar { display: none; }
  .tui-sidebar.is-open { /* overlay styles */ }
}
```

---

## Section Data Configuration

```typescript
// src/data/sections.ts
import type { Section } from '../types/tui';

export const SECTIONS: Section[] = [
  {
    id: 'hero',
    displayName: 'Hero',
    fileName: 'hero.tsx',
    icon: '\uf0a2', // Nerd Font file icon
    order: 1,
    styleType: 'typing',
  },
  {
    id: 'about',
    displayName: 'About',
    fileName: 'about.tsx',
    icon: '\uf0a2',
    order: 2,
    styleType: 'readme',
  },
  {
    id: 'experience',
    displayName: 'Experience',
    fileName: 'experience.tsx',
    icon: '\uf0a2',
    order: 3,
    styleType: 'git-log',
  },
  {
    id: 'projects',
    displayName: 'Projects',
    fileName: 'projects.tsx',
    icon: '\uf0a2',
    order: 4,
    styleType: 'telescope',
  },
  {
    id: 'expertise',
    displayName: 'Expertise',
    fileName: 'expertise.tsx',
    icon: '\uf0a2',
    order: 5,
    styleType: 'checkhealth',
  },
  {
    id: 'contact',
    displayName: 'Contact',
    fileName: 'contact.tsx',
    icon: '\uf01ea', // Nerd Font mail icon
    order: 6,
    styleType: 'terminal',
  },
];
```

---

## Typing Animation Usage

```astro
---
// HeroTui.astro
import { TypewriterText } from '../ui/TypewriterText.astro';

interface Props {
  headline: string;
  subheadline?: string;
}

const { headline, subheadline } = Astro.props;
---

<section id="hero" class="tui-section tui-section--hero">
  <TypewriterText
    text={headline}
    speed={12.5}
    cursor="█"
    as="h1"
    class="hero__headline"
  />
  {subheadline && (
    <p class="hero__subheadline">{subheadline}</p>
  )}
</section>

<script>
  import { createTypewriter } from '@/scripts/typing-animation';

  const headline = document.querySelector('.hero__headline');
  if (headline) {
    createTypewriter(headline, headline.textContent || '', {
      speed: 12.5,
      delay: 0.5,
    });
  }
</script>
```

---

## Color Token Usage

Use existing Catppuccin Mocha tokens from `theme.css`:

```css
/* TUI element colors */
.tui-heading { color: var(--color-primary); }     /* Violet */
.tui-prompt { color: var(--color-accent); }       /* Lavender */
.tui-status-ok { color: var(--color-success); }   /* Green */
.tui-status-warn { color: var(--color-warning); } /* Yellow */
.tui-code { color: var(--color-secondary); }      /* Rose */
.tui-link { color: var(--color-info); }           /* Blue */
.tui-muted { color: var(--color-text-muted); }    /* Muted */
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
.tui-sidebar {
  /* Hidden by default on mobile */
  display: none;
}

/* Tablet (768px+): Collapsible sidebar */
@media (min-width: 768px) {
  .tui-sidebar {
    display: block;
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .tui-sidebar.is-open {
    transform: translateX(0);
  }
}

/* Desktop (1024px+): Always visible */
@media (min-width: 1024px) {
  .tui-sidebar {
    position: static;
    transform: none;
  }
}
```

---

## Accessibility Checklist

- [ ] All navigation via Tab/Shift+Tab/Enter/Escape
- [ ] Visible focus indicators on all interactive elements
- [ ] `prefers-reduced-motion` support for typing animation
- [ ] Screen reader text via `.sr-only` class for typed content
- [ ] `aria-hidden="true"` on decorative elements (line numbers, cursor)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Color contrast WCAG 2.1 AA (already verified in theme.css)

---

## Testing Commands

```bash
# Run tests
bun test

# Type check
bunx astro check

# Lint
bun run lint

# Build
bun run build

# Preview build
bun run preview
```

---

## References

- **Spec**: `specs/PBF-32-portofolio-with-tui/spec.md`
- **Plan**: `specs/PBF-32-portofolio-with-tui/plan.md`
- **Research**: `specs/PBF-32-portofolio-with-tui/research.md`
- **Data Model**: `specs/PBF-32-portofolio-with-tui/data-model.md`
- **Contracts**: `specs/PBF-32-portofolio-with-tui/contracts/tui-components.d.ts`
- **Color Tokens**: `src/styles/theme.css`
- **Existing Navigation**: `src/data/navigation.ts`
