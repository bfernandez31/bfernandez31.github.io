# Research: Animation Cleanup and Optimization

**Feature Branch**: `PBF-18-fix-the-site`
**Date**: 2025-12-03

## Executive Summary

This feature involves cleanup work with no external dependencies to research. The technical decisions are straightforward removals and a CSS-based timing fix.

## Decision 1: Neural Network Animation Removal

**Decision**: Complete removal of neural-network.ts and related canvas elements

**Rationale**:
- User explicitly questioned the value: "pas sur de la plus value"
- User suggested removal: "faut peut etre l'enlever"
- Removing reduces JavaScript bundle size (~335 lines)
- Simplifies hero section, improves performance
- No visual replacement needed - clean dark background is acceptable

**Alternatives Considered**:
1. **Fix timing issues**: Rejected - user doesn't see value in the animation regardless of timing
2. **Replace with simpler animation**: Rejected - adds complexity when user wants cleanup
3. **Disable on mobile only**: Rejected - doesn't address fundamental lack of value

**Implementation Approach**:
- Delete `/src/scripts/neural-network.ts`
- Remove canvas element from `Hero.astro`
- Remove script block initializing neural network
- Remove neural network constants from `animation-config.ts`
- Keep background color (already styled with `var(--color-background)`)

## Decision 2: Custom Cursor Removal

**Decision**: Complete removal of custom-cursor.ts and CustomCursor.astro

**Rationale**:
- User explicitly stated: "l'animation du cursor ce n'est pas ouf" (not great)
- Custom cursor adds 244 lines of JavaScript
- Requires GSAP for smooth tracking
- Complexity in hover detection, device detection
- Native cursor is familiar and reliable

**Alternatives Considered**:
1. **Improve cursor design**: Rejected - user wants cleanup, not redesign
2. **Simplify to basic dot**: Rejected - still adds complexity for minimal value
3. **Keep on desktop only**: Rejected - already implemented, user still unsatisfied

**Implementation Approach**:
- Delete `/src/scripts/custom-cursor.ts`
- Delete `/src/components/ui/CustomCursor.astro`
- Remove import and usage from `PageLayout.astro`
- Browser native cursor takes over automatically

## Decision 3: Text Animation Timing Fix

**Decision**: Add CSS initial hidden state for `[data-split-text]` elements

**Rationale**:
- User reported: "le contenu s'affiche puis l'animation se lance" (content displays then animation starts)
- Current issue: Text is visible → IntersectionObserver triggers → Text splits and animates → Flicker
- Fix: CSS hides text initially → IntersectionObserver triggers → Text splits and animates → Smooth reveal
- Preserves intended text reveal animation (documented feature 012-1516)
- Minimal change with maximum impact

**Alternatives Considered**:
1. **Remove text animations entirely**: Rejected - user wants to keep them working
2. **Use JavaScript to hide on load**: Rejected - CSS is faster, no flash of content
3. **Lower IntersectionObserver threshold**: Rejected - doesn't prevent initial visibility

**Implementation Approach**:
- Add CSS rule in `animations.css`:
```css
[data-split-text] {
  opacity: 0;
  transform: translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  [data-split-text] {
    opacity: 1;
    transform: none;
  }
}
```
- GSAP animation already sets final state (opacity: 1, y: 0)
- Reduced motion users see content immediately (no animation needed)

## Decision 4: Smooth Scroll State

**Decision**: Keep smooth scroll disabled (current state)

**Rationale**:
- Already disabled in codebase for performance debugging
- Native scroll behavior is reliable
- Can be re-enabled in future if desired
- Not part of current cleanup scope

**Alternatives Considered**:
1. **Re-enable smooth scroll**: Rejected - not requested, adds complexity
2. **Remove smooth scroll code entirely**: Rejected - too aggressive for cleanup scope

**Implementation Approach**:
- No changes required
- Current disabled state maintained

## Files to Modify/Delete

### Files to DELETE
| File | Lines | Reason |
|------|-------|--------|
| `src/scripts/neural-network.ts` | 335 | Neural network animation |
| `src/scripts/custom-cursor.ts` | 244 | Custom cursor animation |
| `src/components/ui/CustomCursor.astro` | 99 | Custom cursor component |

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/components/sections/Hero.astro` | Remove canvas, neural network script, keep text animation |
| `src/layouts/PageLayout.astro` | Remove CustomCursor import and usage |
| `src/scripts/animation-config.ts` | Remove NEURAL_NETWORK_DEFAULTS |
| `src/styles/animations.css` | Add `[data-split-text]` initial hidden state |

### Files to KEEP (no changes)
- `src/scripts/text-animations.ts` - Works correctly, CSS fix is sufficient
- `src/scripts/accessibility.ts` - Used by other scripts
- `src/styles/global.css` - No animation-specific code
- `src/pages/index.astro` - No changes needed

## Performance Impact

### Before Cleanup
- neural-network.ts: ~335 lines (Canvas 2D, requestAnimationFrame)
- custom-cursor.ts: ~244 lines (GSAP quickTo, event listeners)
- **Total removable**: ~579 lines of animation code

### After Cleanup
- Reduced JavaScript bundle
- Faster initial load (no canvas initialization)
- No requestAnimationFrame loops for neural network
- No GSAP cursor tracking
- Cleaner, more maintainable codebase

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Visual regression | Low | Medium | CSS gradient fallback already exists |
| Build failure | Low | Low | Straightforward file deletion |
| Missing import cleanup | Low | Low | TypeScript will catch unused imports |
| Text animation break | Low | Medium | CSS change is additive, GSAP already handles reveal |

## No External Research Required

This cleanup feature involves:
- File deletion (no new technology)
- Import removal (standard TypeScript)
- CSS addition (standard browser feature)
- No external APIs or libraries to research
