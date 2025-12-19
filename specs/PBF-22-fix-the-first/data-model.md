# Data Model: Hero Section Polish & Animation Fixes

**Feature**: PBF-22-fix-the-first
**Date**: 2025-12-19
**Status**: Complete

## Overview

This feature is primarily a refactoring task with no new data entities. This document defines the component interfaces and CSS contracts affected by the changes.

---

## Entities

### 1. Hero Component Props (Unchanged)

The Hero component's TypeScript interface remains unchanged:

```typescript
// src/components/sections/Hero.astro
export interface Props {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}
```

**No changes required** - The props interface is already correct.

---

### 2. Hero CSS Structure (Modified)

**Before** (current state with issues):
```css
.hero                     /* Container */
.hero__canvas             /* Neural network background */
.hero__content            /* Text content wrapper */
.hero__headline           /* Main headline - has data-split-text="char" */
.hero__subheadline        /* Secondary text - has data-split-text="word" */
.hero__cta                /* Call-to-action button */
```

**After** (improved structure):
```css
.hero                     /* Container - unchanged */
.hero__canvas             /* Neural network background - unchanged */
.hero__content            /* Text content wrapper - new animation entry point */
.hero__headline           /* Main headline - NO data-split-text, keeps glitch-effect */
.hero__subheadline        /* Secondary text - NO data-split-text */
.hero__cta                /* Call-to-action button - spacing adjusted */
```

---

### 3. Removed Entity: CustomCursor

The following entity is being **completely removed**:

```typescript
// DELETED: src/scripts/custom-cursor.ts

// State management interface - TO BE DELETED
interface CursorState {
  isInitialized: boolean;
  isHovering: boolean;
  position: { x: number; y: number };
  cleanup: (() => void) | null;
}

// Exported functions - TO BE DELETED
export function initCustomCursor(): void;
export function initCustomCursorLazy(): void;
export function cleanupCustomCursor(): void;
```

**Impact**: No other components depend on the custom cursor. It is self-contained.

---

## CSS Variable Contracts

### Hero Color Variables (to be used)

These variables are defined in `src/styles/theme.css` and should be used in Hero.astro:

| Variable | Value | Usage in Hero |
|----------|-------|---------------|
| `--color-text` | #cdd6f4 | Headline, subheadline text |
| `--color-background` | #1e1e2e | CTA button text, hero background |
| `--color-primary` | #cba6f7 | CTA button background |
| `--color-secondary` | #f5c2e7 | CTA hover state |

### Hero Spacing Variables (new)

New CSS custom properties to add for responsive spacing:

```css
/* Add to Hero.astro <style> block */
.hero {
  --hero-space-sm: clamp(1rem, 2vw, 1.5rem);
  --hero-space-md: clamp(1.5rem, 3vw, 2rem);
  --hero-space-lg: clamp(2rem, 4vw, 3rem);
}
```

| Variable | Mobile (320px) | Desktop (1440px) | Usage |
|----------|---------------|------------------|-------|
| `--hero-space-sm` | 1rem | 1.5rem | Small gaps |
| `--hero-space-md` | 1.5rem | 2rem | Headline to subheadline |
| `--hero-space-lg` | 2rem | 3rem | Subheadline to CTA |

---

## Animation State Machine

### Hero Content Animation (Simplified)

**New State Machine** (replaces complex text-split):

```
State: hidden
  ↓ (page load + 100ms delay)
State: visible
  → No further transitions
```

**CSS Implementation**:
```css
.hero__content {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.hero__content.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fallback for no-JS or reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**JavaScript Trigger** (simplified):
```typescript
// In Hero.astro <script>
const heroContent = document.querySelector('.hero__content');
if (heroContent) {
  // Small delay to ensure CSS is applied
  requestAnimationFrame(() => {
    heroContent.classList.add('visible');
  });
}
```

---

## Component Relationships

```
PageLayout.astro
├── [REMOVED] CustomCursor.astro
├── ScrollProgress.astro
├── BurgerMenu.astro
└── main
    └── (page content)

index.astro
└── Hero.astro
    ├── canvas#hero-canvas (NeuralNetworkAnimation)
    └── div.hero__content
        ├── h1.hero__headline.glitch-effect
        ├── p.hero__subheadline
        └── a.hero__cta
```

---

## Validation Rules

### FR-002: Headline to Subheadline Spacing
- **Minimum**: 1rem (16px) at 320px viewport
- **Target**: 2rem (32px) at 1440px viewport
- **Implementation**: `margin-bottom: clamp(1rem, 2.5vw, 2rem)`

### FR-003: Subheadline to CTA Spacing
- **Minimum**: 1.5rem (24px) at 320px viewport
- **Target**: 3rem (48px) at 1440px viewport
- **Implementation**: `margin-bottom: clamp(1.5rem, 4vw, 3rem)`

### FR-005: Animation Duration
- **Maximum**: 1 second total
- **Implementation**: 0.6s transition duration with no additional delay
- **Validation**: Timer-based test in browser DevTools

### FR-006: Color Contrast
- **Requirement**: WCAG 2.1 AA (4.5:1 for normal text)
- **Current Values**: #cdd6f4 on #1e1e2e = 12.23:1 (exceeds AA)
- **Implementation**: Use `var(--color-text)` for all text

---

## Files Affected Summary

| File | Action | Changes |
|------|--------|---------|
| `src/components/ui/CustomCursor.astro` | DELETE | Remove entire file |
| `src/scripts/custom-cursor.ts` | DELETE | Remove entire file |
| `src/layouts/PageLayout.astro` | MODIFY | Remove import and usage |
| `src/components/sections/Hero.astro` | MODIFY | CSS spacing, colors, simplified animation |
| `CLAUDE.md` | OPTIONAL | Remove Custom Cursor documentation section |
