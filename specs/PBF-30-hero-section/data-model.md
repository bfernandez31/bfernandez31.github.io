# Data Model: Hero Section Redesign

**Feature**: PBF-30-hero-section
**Date**: 2025-12-19

## Entities

### 1. HeroProps (Component Interface)

The Hero component's props interface, defining the configurable content.

```typescript
interface HeroProps {
  /** Developer's full name (first and last) - displayed as h1 */
  name: string;

  /** Professional role/title - displayed as subtitle */
  role?: string;

  /** Optional tagline or brief description */
  tagline?: string;

  /** CTA button text */
  ctaText?: string;

  /** CTA button link (hash anchor or URL) */
  ctaLink?: string;
}
```

**Default Values**:
| Field | Default |
|-------|---------|
| name | (required) |
| role | undefined |
| tagline | undefined |
| ctaText | "Explore Projects" |
| ctaLink | "#projects" |

**Validation Rules**:
- `name` is required and must be non-empty string
- `ctaLink` must be valid hash anchor or URL if provided

---

### 2. HeroSection (DOM Structure)

The rendered hero section structure.

```html
<section id="hero" class="hero" role="banner" aria-label="Introduction">
  <!-- Content Container -->
  <div class="hero__content">
    <!-- Name (Primary) -->
    <h1 class="hero__name">{name}</h1>

    <!-- Role (Secondary) -->
    {role && <p class="hero__role">{role}</p>}

    <!-- Tagline (Tertiary) -->
    {tagline && <p class="hero__tagline">{tagline}</p>}

    <!-- CTA Button -->
    <a href={ctaLink} class="hero__cta">{ctaText}</a>
  </div>
</section>
```

**State Transitions**:
| State | Class | Description |
|-------|-------|-------------|
| Initial | `hero__content` | Content hidden (opacity: 0) |
| Animated | `hero__content--visible` | Content visible (opacity: 1) |
| Reduced Motion | `hero__content` | Content visible immediately |

---

### 3. HeroCSSVariables (Styling Tokens)

CSS custom properties used by the hero section.

```css
:root {
  /* Typography Scale */
  --hero-name-size: clamp(3rem, 10vw, 8rem);
  --hero-role-size: clamp(1.25rem, 3vw, 2rem);
  --hero-tagline-size: clamp(1rem, 2vw, 1.25rem);

  /* Spacing */
  --hero-name-margin: clamp(1rem, 2.5vw, 2rem);
  --hero-role-margin: clamp(0.5rem, 1.5vw, 1rem);
  --hero-cta-margin: clamp(2rem, 4vw, 3rem);

  /* Animation */
  --hero-animation-duration: 0.6s;
  --hero-animation-delay: 0.2s;

  /* Background */
  --hero-bg-gradient: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-surface-0) 100%
  );
}
```

**Responsive Breakpoints**:
| Breakpoint | Name Size | Role Size |
|------------|-----------|-----------|
| Mobile (<768px) | 3rem | 1.25rem |
| Tablet (768-1023px) | 5rem | 1.5rem |
| Desktop (≥1024px) | 8rem | 2rem |

---

### 4. FileDeletions (Cleanup Entities)

Files to be removed from the codebase.

```typescript
interface FileDeletion {
  path: string;
  reason: string;
  size: string;
}

const deletions: FileDeletion[] = [
  {
    path: "src/scripts/hero/hero-controller.ts",
    reason: "WebGL animation orchestrator - replaced by CSS",
    size: "~15KB"
  },
  {
    path: "src/scripts/hero/background-3d.ts",
    reason: "OGL 3D background renderer - removed",
    size: "~12KB"
  },
  {
    path: "src/scripts/hero/cursor-tracker.ts",
    reason: "Cursor parallax tracking - removed",
    size: "~4KB"
  },
  {
    path: "src/scripts/hero/typography-reveal.ts",
    reason: "GSAP text animations - replaced by CSS",
    size: "~4KB"
  },
  {
    path: "src/scripts/hero/performance-monitor.ts",
    reason: "Hero-specific FPS monitoring - removed",
    size: "~4KB"
  },
  {
    path: "src/scripts/hero/types.ts",
    reason: "Hero TypeScript interfaces - no longer needed",
    size: "~2KB"
  }
];
```

---

### 5. DependencyChanges (Package Updates)

Changes to package.json dependencies.

```typescript
interface DependencyChange {
  name: string;
  action: "remove" | "add" | "update";
  version?: string;
  reason: string;
}

const changes: DependencyChange[] = [
  {
    name: "ogl",
    action: "remove",
    version: "^1.0.11",
    reason: "WebGL library only used by hero animation - removed"
  }
];
```

**Bundle Impact**:
- OGL removal: -24KB (minified)
- Hero modules removal: -6KB (minified)
- Total savings: ~30KB

---

## Relationships

```
HeroProps ──defines──> Hero.astro
     │
     └──renders──> HeroSection (DOM)
                        │
                        └──styled-by──> HeroCSSVariables
                                              │
                                              └──uses──> theme.css tokens

FileDeletions ──removes──> src/scripts/hero/*
       │
       └──enables──> OGL DependencyChange removal
```

## Migration Notes

### From PBF-28 to PBF-30

| Old (PBF-28) | New (PBF-30) |
|--------------|--------------|
| `headline` prop | `name` prop |
| `subheadline` prop | `role` prop |
| `hero__headline` class | `hero__name` class |
| `hero__subheadline` class | `hero__role` class |
| WebGL canvas background | CSS gradient |
| GSAP animation | CSS `@keyframes` |
| `glitch-effect` class | Removed |
| `data-hero-text` attributes | Removed |
| Scroll indicator | Removed |
