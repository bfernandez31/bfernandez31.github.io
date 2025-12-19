# Quickstart: Hero Section Polish & Animation Fixes

**Feature**: PBF-22-fix-the-first
**Date**: 2025-12-19

## TL;DR

Fix the ugly hero section by:
1. Deleting the custom cursor (2 files)
2. Simplifying text animations (remove data-split-text)
3. Adding proper spacing (clamp() values)
4. Using CSS variables (replace hardcoded colors)

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and dependencies installed (`bun install`)
- Development server running (`bun run dev`)

## Implementation Steps

### Step 1: Delete Custom Cursor Files

```bash
# Delete these files entirely
rm src/components/ui/CustomCursor.astro
rm src/scripts/custom-cursor.ts
```

### Step 2: Update PageLayout.astro

Remove the CustomCursor import and usage:

```diff
// src/layouts/PageLayout.astro

- import CustomCursor from '../components/ui/CustomCursor.astro';
  import ScrollProgress from '../components/ui/ScrollProgress.astro';
  import BurgerMenu from '../components/layout/BurgerMenu.astro';

  ...

- <CustomCursor />
  <ScrollProgress />
  <BurgerMenu />
```

### Step 3: Update Hero.astro Template

Remove text-split attributes from headline and subheadline:

```diff
// src/components/sections/Hero.astro

- <h1 class="hero__headline glitch-effect" data-split-text="char">{headline}</h1>
+ <h1 class="hero__headline glitch-effect">{headline}</h1>

- {subheadline && <p class="hero__subheadline" data-split-text="word">{subheadline}</p>}
+ {subheadline && <p class="hero__subheadline">{subheadline}</p>}
```

### Step 4: Update Hero.astro CSS

Replace hardcoded colors and improve spacing:

```css
/* Changes in Hero.astro <style> block */

.hero__content {
  /* Add animation properties */
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.hero__content.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__headline {
  color: var(--color-text);  /* Was: #ffffff */
  margin-bottom: clamp(1rem, 2.5vw, 2rem);  /* Was: 1rem */
}

.hero__subheadline {
  color: var(--color-text);  /* Was: #ffffff */
  margin-bottom: clamp(1.5rem, 4vw, 3rem);  /* Was: 2rem */
}

.hero__cta {
  color: var(--color-background);  /* Was: #1e1e2e */
}

/* Add reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hero__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Step 5: Update Hero.astro Script

Simplify animation initialization:

```typescript
// src/components/sections/Hero.astro <script>

import { NeuralNetworkAnimation } from "../../scripts/neural-network";
import { NEURAL_NETWORK_DEFAULTS } from "../../scripts/animation-config";
// REMOVED: import { initTextAnimations } from "../../scripts/text-animations";

// REMOVED: initTextAnimations();

// Simple content reveal (replaces text-split)
const heroContent = document.querySelector('.hero__content');
if (heroContent) {
  requestAnimationFrame(() => {
    heroContent.classList.add('visible');
  });
}

// Neural network initialization (unchanged)
const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
// ... rest unchanged
```

## Verification Checklist

After implementation, verify:

- [ ] No custom cursor appears on any page
- [ ] Hero text is visible immediately (no "null" text)
- [ ] Proper spacing between headline → subheadline → CTA
- [ ] Text fades in smoothly (0.6s)
- [ ] Reduced motion: text visible instantly without animation
- [ ] Neural network animation still works
- [ ] Glitch effect still works on headline hover
- [ ] No console errors
- [ ] Lighthouse Performance ≥85

## Testing Commands

```bash
# Run the development server
bun run dev

# Build for production (includes type check)
bun run build

# Preview production build
bun run preview

# Run linting
bun run lint
```

## Key Files Reference

| File | Action | Purpose |
|------|--------|---------|
| `src/components/ui/CustomCursor.astro` | DELETE | Remove cursor component |
| `src/scripts/custom-cursor.ts` | DELETE | Remove cursor logic |
| `src/layouts/PageLayout.astro` | MODIFY | Remove cursor import/usage |
| `src/components/sections/Hero.astro` | MODIFY | Main changes happen here |
| `specs/PBF-22-fix-the-first/contracts/hero-styles.css` | REFERENCE | Expected CSS structure |
