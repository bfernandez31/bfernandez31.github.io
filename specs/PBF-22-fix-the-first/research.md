# Research: Hero Section Polish & Animation Fixes

**Feature**: PBF-22-fix-the-first
**Date**: 2025-12-19
**Status**: Complete

## Overview

This document resolves all technical unknowns for the hero section fix. The feature focuses on simplification and cleanup rather than new functionality.

---

## Research Task 1: Custom Cursor Removal Impact

### Question
What are all the files and references that need to be updated when removing the custom cursor?

### Findings

**Files to DELETE**:
1. `src/components/ui/CustomCursor.astro` (99 lines)
2. `src/scripts/custom-cursor.ts` (244 lines)

**Files to MODIFY**:
1. `src/layouts/PageLayout.astro` - Remove import and `<CustomCursor />` component usage (lines 3, 26)

**Documentation to UPDATE**:
1. `CLAUDE.md` - Remove Custom Cursor section from documentation (optional, can be done as cleanup)

**No test files to delete** - Custom cursor has no dedicated unit tests.

### Decision
- **Action**: Delete `CustomCursor.astro` and `custom-cursor.ts`
- **Rationale**: User explicitly stated cursor "n'apporte rien" (adds nothing). Removing reduces bundle by ~8KB and eliminates complexity.
- **Alternatives Considered**:
  - Fix cursor behavior: Rejected because user sees no value in the feature
  - Simplify cursor: Still adds maintenance burden for no perceived benefit

---

## Research Task 2: Text Animation Simplification Strategy

### Question
How should hero text animations be simplified while maintaining accessibility and visual appeal?

### Findings

**Current Implementation Issues**:
- Character-level splitting creates 45+ DOM elements for headline
- Animation takes too long to complete (45 chars × 0.05s delay = 2.25s)
- Complex GSAP timeline with staggered reveals
- User reported "le texte est null" - possibly animations failing or timing out

**Best Practices for Hero Text**:
1. **Progressive Enhancement**: Text visible before JavaScript loads
2. **Simple Transitions**: Fade-in + slight translate (0.6-0.8s max)
3. **No Splitting**: Keep text in single element for better performance
4. **CSS-first**: Use CSS transitions when possible over GSAP

**Accessible Animation Patterns**:
- Total animation duration ≤1 second
- Respect prefers-reduced-motion (instant display)
- Content visible in HTML before animation runs

### Decision
- **Action**: Remove `data-split-text` attributes from hero, use simple CSS fade-in + GSAP for subtle entrance
- **Rationale**: Simpler animations are more reliable and faster
- **Implementation**:
  ```css
  /* Hero content starts invisible */
  .hero__content {
    opacity: 0;
    transform: translateY(20px);
  }

  /* Animate on load via GSAP or CSS animation */
  .hero__content.visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  ```
- **Alternatives Considered**:
  - Word-level splitting: Still too complex for reliability
  - Pure CSS @keyframes: Could work but less control over timing

---

## Research Task 3: Hero Spacing Best Practices

### Question
What spacing values should be used for proper visual hierarchy in the hero section?

### Findings

**Current Issues**:
- Headline `margin-bottom: 1rem` - Too tight for 2-4rem text
- No spacing between subheadline and CTA
- Fixed padding doesn't scale with viewport

**Typography Spacing Guidelines**:
- Headlines: margin-bottom should be ~50-75% of font-size
- Between text blocks: minimum 1.5rem, ideally 2rem
- Before CTA: 2-3rem for visual breathing room

**Responsive Spacing Pattern**:
```css
/* Base spacing unit */
--space-sm: clamp(0.75rem, 1.5vw, 1rem);
--space-md: clamp(1.25rem, 2.5vw, 2rem);
--space-lg: clamp(2rem, 4vw, 3rem);
```

### Decision
- **Action**: Update Hero.astro CSS with improved spacing
- **Values**:
  - Headline margin-bottom: `clamp(1.5rem, 3vw, 2rem)`
  - Subheadline margin-bottom: `clamp(2rem, 4vw, 3rem)`
  - Content max-width: Keep 800px (appropriate for headline size)
- **Rationale**: Clamp provides responsive scaling without media queries
- **Alternatives Considered**:
  - Fixed rem values: Don't scale well on different viewports
  - CSS Grid gap: Would require restructuring HTML

---

## Research Task 4: CSS Variables for Colors

### Question
Which hardcoded colors in Hero.astro need to be replaced with CSS variables?

### Findings

**Hardcoded Colors in Hero.astro**:
1. Line 97: `color: #ffffff;` → Should be `var(--color-text)`
2. Line 105: `color: #ffffff;` → Should be `var(--color-text)`
3. Line 117: `color: #1e1e2e;` → Should be `var(--color-background)`
4. Line 125: `box-shadow: rgba(203, 166, 247, 0.3)` → Should use `var(--color-primary)` (or CSS color-mix)

**Available CSS Variables** (from theme.css):
- `--color-text`: #cdd6f4 (primary text color)
- `--color-background`: #1e1e2e (dark background)
- `--color-primary`: #cba6f7 (violet accent)
- `--color-secondary`: #f5c2e7 (rose accent)

### Decision
- **Action**: Replace all hardcoded hex colors with CSS variables
- **Rationale**: Consistency with design system, easier theme maintenance
- **Special Case**: box-shadow can use CSS custom property with alpha:
  ```css
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 203, 166, 247), 0.3);
  ```
  Or simpler: use `oklch` or keep the violet hardcoded since it's derived from primary
- **Alternatives Considered**:
  - Create new CSS variables for each shade: Overkill for single use

---

## Research Task 5: Neural Network Animation Retention

### Question
Should the neural network background animation be kept, simplified, or removed?

### Findings

**User Feedback Analysis**:
- User said "épurer" (simplify/clean up) - could mean reduce visual noise
- Did NOT explicitly mention neural network as a problem
- Auto-resolved decision in spec: Keep neural network (CONSERVATIVE)

**Current Neural Network Performance**:
- Already device-tier optimized (50/30/20 nodes)
- Pauses when not visible (Intersection Observer)
- Has error boundary (fallback to dark background)

**Neural Network Value**:
- Provides unique visual identity
- Differentiates from standard portfolios
- Already optimized for performance

### Decision
- **Action**: Keep neural network as-is
- **Rationale**: Already optimized, provides brand identity, no explicit user complaint
- **Alternatives Considered**:
  - Remove entirely: Loses visual identity without clear user request
  - Reduce nodes further: Already at reasonable counts per tier

---

## Research Task 6: Glitch Effect Compatibility

### Question
Should the glitch effect on the headline be kept or removed?

### Findings

**Current Implementation**:
- Pure CSS hover effect (~2KB)
- Located in `src/styles/effects/glitch.css`
- Uses `text-shadow` for RGB channel separation
- Only triggers on hover (desktop devices)

**Potential Issues**:
- Combined with text-split animations could cause visual conflicts
- If text split is removed, glitch effect should work fine independently

### Decision
- **Action**: Keep glitch effect, remove text-split from headline
- **Rationale**: Glitch is lightweight CSS-only enhancement, compatible with simpler animations
- **Alternatives Considered**:
  - Remove glitch: Loses visual flair without user request
  - Replace with different effect: Adds complexity

---

## Summary of Resolutions

| Unknown | Resolution | Confidence |
|---------|------------|------------|
| Custom cursor removal files | Delete 2 files, modify 1 | High |
| Text animation approach | Simple CSS fade + GSAP, remove splitting | High |
| Spacing values | Responsive clamp() values | High |
| Hardcoded colors | Replace with CSS variables | High |
| Neural network fate | Keep as-is | Medium |
| Glitch effect fate | Keep, works with simpler animations | High |

All NEEDS CLARIFICATION items have been resolved. Proceeding to Phase 1.
