# Quickstart: Animation Cleanup and Optimization

**Feature Branch**: `PBF-18-fix-the-site`
**Date**: 2025-12-03

## Overview

This feature cleans up the portfolio site by removing low-value animations and fixing text animation timing issues.

## Prerequisites

- Bun ≥1.0.0
- Node.js (for Astro compatibility)
- Git

## Quick Start

```bash
# Clone and checkout the feature branch
git checkout PBF-18-fix-the-site

# Install dependencies
bun install

# Start development server
bun run dev
```

## What's Changing

### Removals

1. **Neural Network Background** (`Hero.astro`)
   - Canvas element removed
   - Animation script removed
   - Clean dark background remains

2. **Custom Cursor** (`PageLayout.astro`)
   - Component and script removed
   - Native browser cursor takes over

### Fixes

3. **Text Animation Timing** (`animations.css`)
   - New CSS hides text until animation triggers
   - No more content flicker on page load

## Files Modified

| File | Change Type |
|------|-------------|
| `src/scripts/neural-network.ts` | DELETE |
| `src/scripts/custom-cursor.ts` | DELETE |
| `src/components/ui/CustomCursor.astro` | DELETE |
| `src/components/sections/Hero.astro` | MODIFY |
| `src/layouts/PageLayout.astro` | MODIFY |
| `src/scripts/animation-config.ts` | MODIFY |
| `src/styles/animations.css` | MODIFY |

## Testing

### Visual Tests

1. Load homepage - verify no content flicker
2. Check hero section - confirm no canvas/neural network
3. Move cursor - verify native system cursor only
4. Enable `prefers-reduced-motion` - verify instant content display

### Build Tests

```bash
# Type check
bun run build

# Preview production build
bun run preview
```

## Rollback

If issues occur, revert to the previous commit:

```bash
git checkout HEAD~1
```

## Success Criteria

- [ ] No visible content flicker in hero section
- [ ] No canvas element in hero
- [ ] Native cursor only (no custom circle)
- [ ] Reduced motion respected
- [ ] Build passes without errors
