# Research Document: Portfolio with TUI Aesthetic

**Feature Branch**: `PBF-32-portofolio-with-tui`
**Created**: 2025-12-19
**Phase**: 0 (Research)

This document consolidates research findings for all NEEDS CLARIFICATION items identified in the Technical Context section of the implementation plan.

---

## Research Summary

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Monospace Font** | JetBrains Mono (self-hosted subset) | Superior readability, Fontsource availability, ~35KB budget |
| **Nerd Font Icons** | Custom 4-icon subset (self-hosted) | 2-4KB vs 200KB full font, stays within budget |
| **Typing Animation** | GSAP TextPlugin | Integrates with existing stack, +5KB, excellent accessibility |
| **Syntax Highlighting** | CSS-only semantic classes | Zero JS overhead, perfect for decorative TUI content |

---

## 1. Monospace Font Selection

### Decision: JetBrains Mono (Self-Hosted Latin Subset)

### Rationale

1. **Superior Readability**: Taller letterforms designed specifically for developer ergonomics
2. **Modern Developer Aesthetic**: Purpose-built for coding environments, aligns with TUI theme
3. **Licensing**: SIL Open Font License (free commercial use, self-hosting allowed)
4. **Performance**: Fontsource provides Latin subsets (~15-20KB per weight)
5. **Differentiation**: Fresh visual identity vs current Fira Code

### Alternatives Considered

| Font | Bundle Size | Pros | Cons |
|------|-------------|------|------|
| JetBrains Mono | ~35KB (2 weights) | Best readability, ergonomic design | Slightly heavier |
| Fira Code | ~30KB | Already in codebase, extensive ligatures | Less differentiation |
| Cascadia Code | ~40KB | Powerline glyphs included | Heavier weight, less universal |
| System Stack | 0KB | Zero bundle overhead | Inconsistent across OS |

### Implementation

```css
/* Font face declarations */
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-latin-400-normal.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-latin-700-normal.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* CSS variable for consistent usage */
:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
}
```

### Fallback Strategy

```css
font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
```

- `Fira Code`: Current codebase font (smooth fallback)
- `Menlo`: macOS 10.6+ default
- `Consolas`: Windows Vista+ default
- `Liberation Mono`: Linux distributions
- `Courier New`: Universal web-safe

### Performance Budget

- 400 weight: ~15-20KB
- 700 weight: ~18-22KB
- **Total**: ~35-42KB (within <100KB font budget)

---

## 2. Nerd Font Icons Delivery

### Decision: Custom 4-Icon Subset (Self-Hosted WOFF2)

### Required Icons

| Icon | Unicode Codepoint | Usage |
|------|-------------------|-------|
| File (󰊢) | U+F0A2 | Sidebar file entries |
| Folder (󰉋) | U+F04B | Sidebar folder entries |
| User (󰀄) | U+F0004 | User/profile references |
| Mail (󰇮) | U+F01EA | Contact section |

### Rationale

1. **Minimal Footprint**: 2-4KB subset vs 200-400KB full Nerd Font (98% reduction)
2. **Authentic Aesthetics**: Real Nerd Font glyphs match terminal/TUI theme
3. **Single HTTP Request**: Cacheable font file
4. **Budget Compliance**: 4.5KB total well within <100KB budget

### Alternatives Considered

| Approach | Bundle Size | Pros | Cons |
|----------|-------------|------|------|
| Custom subset | 2-4KB | Authentic, minimal | Requires toolchain setup |
| Full Nerd Font CDN | 200-400KB | No setup | Far exceeds budget |
| Unicode fallback | 0KB | System fonts | Emoji styling inconsistent |
| Inline SVGs | ~1KB | Zero requests | Less authentic feel |

### Implementation

```bash
# One-time subsetting (using glyphhanger + fonttools)
glyphhanger \
  --whitelist="U+F0A2,U+F04B,U+F0004,U+F01EA" \
  --subset="JetBrainsMonoNerdFont-Regular.ttf" \
  --formats=woff2 \
  --output="nerd-icons-subset.woff2"
```

```css
/* src/styles/tui/icons.css */
@font-face {
  font-family: 'NerdIcons';
  src: url('/fonts/nerd-icons-subset.woff2') format('woff2');
  font-display: swap;
}

.nerd-icon {
  font-family: 'NerdIcons', monospace;
  font-style: normal;
}

.nerd-icon-file::before { content: '\f0a2'; }
.nerd-icon-folder::before { content: '\f04b'; }
.nerd-icon-user::before { content: '\f0004'; }
.nerd-icon-mail::before { content: '\f01ea'; }
```

### Fallback Strategy

Inline SVG fallback for browsers without font support:

```astro
<!-- FileIcon.astro with SVG fallback -->
<span class="nerd-icon nerd-icon-file" aria-hidden="true">
  <svg class="icon-fallback" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
</span>
```

---

## 3. Typing Animation Implementation

### Decision: GSAP TextPlugin

### Rationale

1. **Existing Infrastructure**: Already using GSAP 3.13.0 (zero new library overhead)
2. **Superior Control**: Built-in sequencing, timelines, pause/resume, callbacks
3. **Accessibility Built-In**: Easy integration with `prefers-reduced-motion`
4. **Performance**: GPU-accelerated, IntersectionObserver integration
5. **Maintainability**: Consistent with existing `text-animations.ts` patterns

### Alternatives Considered

| Approach | Bundle Size | Flexibility | Accessibility |
|----------|-------------|-------------|---------------|
| GSAP TextPlugin | +3KB | Very High | Built-in |
| Pure CSS | ~0.5KB | Very Low | Manual |
| Vanilla JS | ~2KB | Medium | Manual |
| TypeIt.js | 8-12KB | High | Built-in |

### Implementation Pattern

```typescript
// src/scripts/typing-animation.ts
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export interface TypewriterOptions {
  speed?: number;        // Characters per second (default: 12.5 = 80ms/char)
  cursor?: string;       // Cursor character (default: '█')
  cursorBlinkSpeed?: number; // Seconds (default: 0.53)
  delay?: number;        // Start delay
  onComplete?: () => void;
}

export function createTypewriter(
  element: HTMLElement,
  text: string,
  options: TypewriterOptions = {}
): gsap.core.Timeline {
  const { speed = 12.5, cursor = '█', cursorBlinkSpeed = 0.53, delay = 0 } = options;

  // Accessibility: check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create DOM structure
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = text;

  const textSpan = document.createElement('span');
  textSpan.setAttribute('aria-hidden', 'true');
  textSpan.className = 'typewriter-text';

  const cursorSpan = document.createElement('span');
  cursorSpan.setAttribute('aria-hidden', 'true');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.textContent = cursor;

  element.textContent = '';
  element.appendChild(srSpan);
  element.appendChild(textSpan);
  element.appendChild(cursorSpan);

  const timeline = gsap.timeline({ paused: true });

  if (prefersReduced) {
    // Instant reveal for accessibility
    timeline.set(textSpan, { textContent: text }, delay);
  } else {
    timeline.to(textSpan, {
      duration: text.length / speed,
      text: { value: text },
      ease: 'none',
      delay,
      onComplete: () => {
        // Start cursor blink
        gsap.to(cursorSpan, {
          opacity: 0,
          duration: cursorBlinkSpeed / 2,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)',
        });
      }
    });
  }

  timeline.play();
  return timeline;
}
```

### Cursor CSS

```css
.typewriter-cursor {
  display: inline-block;
  width: 1ch;
  color: var(--color-primary);
  animation: none; /* Controlled by GSAP */
}

@media (prefers-reduced-motion: reduce) {
  .typewriter-cursor {
    opacity: 1 !important;
  }
}
```

### Performance Impact

- TextPlugin: +3KB (gzipped)
- typing-animation.ts: ~2KB
- **Total**: +5KB (within JavaScript budget)

---

## 4. Syntax Highlighting Strategy

### Decision: CSS-Only Semantic Classes

### Rationale

1. **Zero JavaScript**: Pure CSS approach aligns with performance-first principle
2. **Perfect for Decorative Content**: TUI sections simulate terminal output, not real code
3. **Existing Color Tokens**: Reuses Catppuccin Mocha palette from theme.css
4. **Section-Specific Styling**: Each section has unique TUI aesthetic
5. **Bundle Size**: ~2-4KB CSS vs 280KB (Shiki) or 7KB (Prism)

### Alternatives Considered

| Approach | Bundle Size | Use Case | Recommendation |
|----------|-------------|----------|----------------|
| CSS-only classes | 2-4KB CSS | Decorative TUI | ✅ Recommended |
| Astro Shiki | 280KB | Real code in markdown | Blog posts only |
| Prism.js | 7KB | Client-side highlighting | Not needed |

### Implementation: TUI Syntax Classes

```css
/* src/styles/tui/syntax.css */

/* ============================================
   README.md Style (About Section)
   ============================================ */
.tui-readme {
  font-family: var(--font-mono);
  line-height: 1.8;
  white-space: pre-wrap;
}

.tui-heading {
  color: var(--color-primary); /* Violet */
  font-weight: bold;
}

.tui-list-marker {
  color: var(--color-info); /* Blue */
}

.tui-code {
  color: var(--color-secondary); /* Rose */
  background: var(--color-surface);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

/* ============================================
   Git Log Style (Experience Section)
   ============================================ */
.tui-git-log {
  font-family: var(--font-mono);
}

.tui-commit-hash {
  color: var(--color-warning); /* Yellow */
}

.tui-commit-author {
  color: var(--color-success); /* Green */
}

.tui-commit-date {
  color: var(--color-text-muted);
}

.tui-branch {
  color: var(--color-secondary); /* Rose */
}

.tui-branch-line {
  color: var(--color-info); /* Blue */
}

/* ============================================
   :checkhealth Style (Expertise Section)
   ============================================ */
.tui-checkhealth {
  font-family: var(--font-mono);
}

.tui-status-ok {
  color: var(--color-success); /* Green */
  font-weight: bold;
}

.tui-status-warn {
  color: var(--color-warning); /* Yellow */
  font-weight: bold;
}

.tui-status-error {
  color: var(--color-error); /* Red */
  font-weight: bold;
}

.tui-progress-bar {
  background: var(--color-surface);
  border-radius: 2px;
  height: 0.75rem;
  overflow: hidden;
}

.tui-progress-fill {
  background: var(--color-primary);
  height: 100%;
  transition: width 0.3s ease;
}

/* ============================================
   Terminal Style (Contact Section)
   ============================================ */
.tui-terminal {
  font-family: var(--font-mono);
  background: var(--color-surface);
  padding: 1rem;
  border-left: 3px solid var(--color-primary);
}

.tui-prompt {
  color: var(--color-accent); /* Lavender */
}

.tui-command {
  color: var(--color-text);
}

.tui-output {
  color: var(--color-text-secondary);
}

/* ============================================
   Telescope/fzf Style (Projects Section)
   ============================================ */
.tui-telescope {
  font-family: var(--font-mono);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.tui-search-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.tui-search-icon {
  color: var(--color-text-muted);
}

.tui-search-input {
  color: var(--color-text);
  background: transparent;
  border: none;
  flex: 1;
}

.tui-match-highlight {
  color: var(--color-warning); /* Yellow highlight for fuzzy matches */
  font-weight: bold;
}

.tui-result-selected {
  background: var(--color-surface-elevated);
}
```

### Color Token Mapping Summary

| TUI Element | Color Token | Hex (Catppuccin Mocha) |
|-------------|-------------|------------------------|
| Headings | `--color-primary` | #cba6f7 (Mauve) |
| Prompts | `--color-accent` | #b4befe (Lavender) |
| Success/OK | `--color-success` | #a6e3a1 (Green) |
| Warnings | `--color-warning` | #f9e2af (Yellow) |
| Errors | `--color-error` | #f38ba8 (Red) |
| Code/Emphasis | `--color-secondary` | #f5c2e7 (Pink) |
| Info/Links | `--color-info` | #89b4fa (Blue) |
| Muted | `--color-text-muted` | #a6adc8 (Overlay) |

---

## Performance Budget Summary

| Resource | Allocated Budget | Research Estimate | Status |
|----------|-----------------|-------------------|--------|
| Fonts | <100KB | ~42KB (JetBrains Mono + Nerd Icons) | ✅ 42% used |
| JavaScript | <200KB | +5KB (typing animation) | ✅ 2.5% added |
| CSS | <100KB | +4KB (TUI syntax) | ✅ 4% added |
| **Total Page Weight** | <500KB | +51KB estimated | ✅ 10% impact |

---

## Implementation Dependencies

### New Dependencies

None required - all implementations use existing stack:
- GSAP 3.13.0 (already installed)
- GSAP TextPlugin (peer package, no separate install)

### Font Files to Add

```
public/fonts/
├── jetbrains-mono-latin-400-normal.woff2  (~20KB)
├── jetbrains-mono-latin-700-normal.woff2  (~22KB)
└── nerd-icons-subset.woff2                (~4KB)
```

### New CSS Files

```
src/styles/tui/
├── layout.css      # TUI grid layout
├── sidebar.css     # NvimTree styling
├── statusline.css  # Neovim statusline
├── typography.css  # Monospace fonts
├── syntax.css      # Section-specific TUI styles
└── icons.css       # Nerd Font icons
```

### New Script Files

```
src/scripts/
├── typing-animation.ts   # Hero typing effect
├── tui-navigation.ts     # Sidebar + tab navigation
└── statusline-sync.ts    # Statusline state management
```

---

## Sources

### Fonts
- [JetBrains Mono vs Fira Code comparison](https://firacode.com/how-does-fira-code-compare-to-jetbrains-mono/)
- [Best Programming Fonts 2025](https://www.jhkinfotech.com/blog/code-fonts-for-developers-programmers)
- [JetBrains Mono Fontsource](https://fontsource.org/fonts/jetbrains-mono/install)
- [Font Subsetting with Glyphhanger](https://www.afasterweb.com/2018/03/09/subsetting-fonts-with-glyphhanger/)

### Icons
- [Nerd Fonts Cheat Sheet](https://www.nerdfonts.com/cheat-sheet)
- [Icon Font vs SVG Performance](https://www.keycdn.com/blog/icon-fonts-vs-svgs)

### Animation
- [GSAP Text Animations](https://gsapify.com/gsap-text-animations)
- [Accessible Typewriter Animations](https://www.cyishere.dev/blog/a11y-of-typewriter-animation)
- [prefers-reduced-motion - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

### Syntax Highlighting
- [Astro Syntax Highlighting](https://docs.astro.build/en/guides/syntax-highlighting/)
- [Catppuccin Mocha for Shiki](https://shiki.style/themes)
- [CSS-Only Syntax Highlighting](https://dev.to/madsstoumann/syntax-highlight-css-with-semantic-html-and-get-dark-mode-for-free-4mim)
