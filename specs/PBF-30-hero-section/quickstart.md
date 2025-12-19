# Quickstart: Hero Section Redesign

**Feature**: PBF-30-hero-section
**Time Estimate**: ~2 hours
**Complexity**: Low (primarily deletions and simplifications)

## Prerequisites

- Node.js 18+ or Bun 1.0+
- Access to repository on `PBF-30-hero-section` branch
- Familiarity with Astro components and CSS

## Quick Implementation Steps

### Step 1: Delete Hero Animation Modules

```bash
# Remove entire hero animation directory
rm -rf src/scripts/hero/
```

Files removed:
- `hero-controller.ts`
- `background-3d.ts`
- `cursor-tracker.ts`
- `typography-reveal.ts`
- `performance-monitor.ts`
- `types.ts`

### Step 2: Remove OGL Dependency

```bash
# Remove OGL WebGL library
bun remove ogl
```

### Step 3: Update Hero.astro Component

Replace the current Hero.astro with simplified structure:

```astro
---
interface Props {
  name: string;
  role?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
}

const {
  name,
  role,
  tagline,
  ctaText = "Explore Projects",
  ctaLink = "#projects",
} = Astro.props;
---

<section id="hero" class="hero" role="banner" aria-label="Introduction">
  <div class="hero__content hero__content--animate">
    <h1 class="hero__name">{name}</h1>
    {role && <p class="hero__role">{role}</p>}
    {tagline && <p class="hero__tagline">{tagline}</p>}
    <a href={ctaLink} class="hero__cta">{ctaText}</a>
  </div>
</section>

<style>
  /* See contracts/hero-styles.css for full styling */
  .hero {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(135deg, var(--color-background), var(--color-surface-0));
    padding: var(--space-xl) var(--space-md);
  }

  .hero__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 1200px;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero__content--animate {
    animation: heroFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  }

  @keyframes heroFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hero__name {
    font-size: clamp(3rem, 10vw, 8rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
    margin: 0 0 clamp(1rem, 2.5vw, 2rem);
  }

  .hero__role {
    font-size: clamp(1.25rem, 3vw, 2rem);
    color: var(--color-text-muted);
    margin: 0 0 clamp(0.5rem, 1.5vw, 1rem);
    max-width: 600px;
  }

  .hero__tagline {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: var(--color-text-muted);
    opacity: 0.8;
    margin: 0;
    max-width: 500px;
  }

  .hero__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: var(--space-sm) var(--space-lg);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    background-color: var(--color-primary);
    color: var(--color-background);
    border: 2px solid var(--color-primary);
    border-radius: 8px;
    margin-top: clamp(2rem, 4vw, 3rem);
    transition: background-color var(--transition-color), color var(--transition-color);
    cursor: pointer;
  }

  .hero__cta:hover {
    background-color: transparent;
    color: var(--color-primary);
  }

  .hero__cta:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__content {
      opacity: 1;
      transform: none;
    }
    .hero__content--animate {
      animation: none;
    }
  }
</style>
```

### Step 4: Update index.astro Hero Props

```astro
<Hero
  name="Benoit Fernandez"
  role="Full Stack Developer & Creative Technologist"
  ctaText="Explore Projects"
  ctaLink="#projects"
/>
```

### Step 5: Clean Up Performance Config

Remove hero-specific constants from `src/config/performance.ts`:

```typescript
// DELETE these sections (lines ~126-178):
// - HERO_SHAPE_COUNTS
// - HERO_DEGRADATION_THRESHOLDS
// - HERO_ANIMATION_TIMING
// - HERO_PARALLAX_CONFIG
```

### Step 6: Simplify hero-effects.css

Remove or comment out WebGL-related styles in `src/styles/effects/hero-effects.css`:
- Canvas styling (`.hero__canvas`)
- Fallback gradient (`.hero__fallback`)
- Scroll indicator styles
- Animation-related prefers-reduced-motion overrides

### Step 7: Verify Build

```bash
# Install dependencies (removes ogl from node_modules)
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Verify no errors in console
```

## Verification Checklist

- [ ] Hero displays name prominently as h1
- [ ] Role displays below name
- [ ] CTA button links to #projects
- [ ] Fade-in animation works on page load
- [ ] Content visible immediately with prefers-reduced-motion
- [ ] No JavaScript errors in console
- [ ] No WebGL/OGL references in bundle
- [ ] Build completes without errors
- [ ] Lighthouse Performance score ≥85 (mobile)

## Rollback Instructions

If issues occur, revert to PBF-28:

```bash
git checkout HEAD~1 -- src/components/sections/Hero.astro
git checkout HEAD~1 -- src/scripts/hero/
git checkout HEAD~1 -- package.json
bun install
```

## Common Issues

### Animation not playing
- Check if `hero__content--animate` class is applied
- Verify `prefers-reduced-motion` is not enabled in OS settings

### Build errors about missing hero modules
- Ensure all imports of `src/scripts/hero/*` are removed
- Check `src/pages/index.astro` for stale imports

### OGL still in bundle
- Run `bun install` after removing from package.json
- Check for any other files importing `ogl`
