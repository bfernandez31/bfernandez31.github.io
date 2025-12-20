# Research: TUI Layout Redesign

**Feature Branch**: `PBF-37-layout-tui`
**Date**: 2025-12-20

## Research Topics

1. [Horizontal Slide Animations with GSAP](#1-horizontal-slide-animations-with-gsap)
2. [Reduced Motion Accessibility](#2-reduced-motion-accessibility)
3. [Neovim Buffer Tab Styling](#3-neovim-buffer-tab-styling)

---

## 1. Horizontal Slide Animations with GSAP

### Decision
Use GSAP `transform` (x/xPercent) for horizontal slides with cancel-previous pattern.

### Rationale
- **GPU-accelerated**: `transform` properties don't trigger layout recalculation
- **60fps guaranteed**: GSAP uses `requestAnimationFrame` with automatic lag smoothing
- **Clean interruption**: `killTweensOf()` cleanly cancels in-progress animations

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| CSS `left/right` | Triggers CPU layout recalculation, stuttering |
| CSS `scroll-snap` | Not animatable programmatically |
| Animation queuing | Poor UX for rapid tab switches |

### Implementation Pattern

```typescript
// Configuration
gsap.config({ force3D: true });

// State management
let currentSectionIndex = 0;
let isAnimating = false;

function slideToSection(targetIndex: number, updateHistory = true): void {
  if (isAnimating || targetIndex === currentSectionIndex) return;

  isAnimating = true;
  const sections = document.querySelectorAll<HTMLElement>('.tui-section');
  const direction = targetIndex > currentSectionIndex ? -1 : 1;

  // Kill previous animations
  gsap.killTweensOf(sections);

  // Create timeline
  const tl = gsap.timeline({
    onComplete: () => { isAnimating = false; }
  });

  tl.to(sections[currentSectionIndex], {
    xPercent: direction * -100,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut'
  }, 0)
  .to(sections[targetIndex], {
    xPercent: 0,
    opacity: 1,
    duration: 0.4,
    ease: 'power2.inOut'
  }, 0);

  // Update history
  if (updateHistory) {
    const sectionId = sections[targetIndex].id;
    history.pushState({ index: targetIndex }, '', `#${sectionId}`);
  }

  currentSectionIndex = targetIndex;
}

// Browser history integration
window.addEventListener('popstate', (event) => {
  if (event.state && typeof event.state.index === 'number') {
    slideToSection(event.state.index, false);
  }
});
```

### Key CSS Requirements

```css
.tui-section {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}
```

### Sources
- [GSAP Horizontal Scroll Navigation](https://gsap.com/community/forums/topic/42507-gsap-horizontal-scroll-with-navigation-buttons/)
- [High-Performance Web Animation with GSAP](https://dev.to/kolonatalie/high-performance-web-animation-gsap-webgl-and-the-secret-to-60fps-2l1g)
- [gsap.killTweensOf() Documentation](https://gsap.com/docs/v3/GSAP/gsap.killTweensOf())

---

## 2. Reduced Motion Accessibility

### Decision
Use `gsap.matchMedia()` for conditional animations with instant fallback.

### Rationale
- **WCAG 2.1 AA compliant**: Essential for users with vestibular disorders
- **Already partially implemented**: `animation-config.ts` has helpers
- **GSAP native support**: `gsap.matchMedia()` provides clean abstraction

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|-----------------|
| Skip GSAP loading entirely | Complex dynamic imports, breaks existing animations |
| Reduce duration only | Sliding motion still problematic for vestibular disorders |
| Manual CSS checks | GSAP's matchMedia provides better lifecycle management |

### Implementation Pattern

```typescript
// Recommended approach with gsap.matchMedia()
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Full horizontal slide animation
  gsap.to(section, {
    xPercent: -100,
    duration: 0.4,
    ease: 'power2.inOut'
  });
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  // Instant switch with gentle fade
  gsap.set(currentSection, { visibility: 'hidden' });
  gsap.to(targetSection, {
    opacity: 1,
    duration: 0.15  // Very quick fade
  });
});
```

### What to DISABLE vs REDUCE

| Animation Type | Action | Reason |
|----------------|--------|--------|
| Horizontal slide | DISABLE | Large x-axis movement triggers vestibular issues |
| Parallax effects | DISABLE | Different speeds cause disorientation |
| Opacity fade | REDUCE to 0.15s | Safe, provides visual feedback |
| Color transitions | KEEP | No motion involved |
| Focus indicators | KEEP | Essential for accessibility |

### Sources
- [GSAP Accessible Animation Guide](https://gsap.com/resources/a11y/)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [W3C WCAG Technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html)

---

## 3. Neovim Buffer Tab Styling

### Decision
Adopt mockup styling with file icons, vertical separators, active underline, and close button.

### Rationale
- **Matches mockup**: User-provided reference shows clear expectations
- **Consistent with TUI aesthetic**: Follows Neovim buffer tab conventions
- **Minimal CSS changes**: Builds on existing component structure

### Visual Reference

Based on mockup: `specs/PBF-37-layout-tui/assets/mockup-tab-styling.png`

Key elements:
- `□` File icon (placeholder document icon)
- Tab label with `.tsx` extension
- `×` Close indicator on active tab
- Vertical separator between tabs
- Clear active/inactive distinction

### Implementation Pattern

```css
.tui-buffer-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  background-color: transparent;
  border-bottom: 2px solid transparent;
  transition: background-color var(--transition-fast),
              color var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Separator between tabs */
.tui-buffer-tab::after {
  content: '│';
  position: absolute;
  right: -0.125rem;
  color: var(--color-border);
  opacity: 0.3;
}

.tui-buffer-tab:last-child::after,
.tui-buffer-tab.is-active::after {
  display: none;
}

/* Hover state */
.tui-buffer-tab:hover {
  background-color: var(--color-surface-1);
  color: var(--color-text);
}

/* Active state */
.tui-buffer-tab.is-active {
  background-color: var(--color-surface-2);
  color: var(--color-primary);
  font-weight: 700;
  border-bottom-color: var(--color-primary);
}

/* File icon */
.tui-buffer-tab__icon {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.tui-buffer-tab.is-active .tui-buffer-tab__icon {
  color: var(--color-secondary);
}

/* Close button - visible only on active tab */
.tui-buffer-tab__close {
  display: none;
  width: 1rem;
  height: 1rem;
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: 2px;
}

.tui-buffer-tab.is-active .tui-buffer-tab__close {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-buffer-tab__close:hover {
  background-color: rgba(243, 139, 168, 0.7);
  color: var(--color-background);
}
```

### Tab Container Overflow

```css
.tui-topbar__tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
}

.tui-topbar__tabs::-webkit-scrollbar {
  display: none;
}
```

### Sources
- [bufferline.nvim](https://github.com/akinsho/bufferline.nvim)
- [barbar.nvim](https://github.com/romgrk/barbar.nvim)
- [vim-buffet](https://github.com/bagrat/vim-buffet)

---

## Summary

| Research Area | Decision | Risk Level |
|--------------|----------|------------|
| Horizontal slide | GSAP transform with cancel pattern | Low - proven patterns |
| Reduced motion | gsap.matchMedia() with instant fallback | Low - native support |
| Tab styling | Mockup-based with separators and close button | Low - CSS only |

All research items have been resolved. No NEEDS CLARIFICATION items remain.
