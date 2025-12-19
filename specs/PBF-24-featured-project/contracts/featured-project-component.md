# Component Contract: FeaturedProject.astro

**Feature Branch**: `PBF-24-featured-project`
**Location**: `src/components/sections/FeaturedProject.astro`

## Component Interface

```typescript
/**
 * FeaturedProject Component
 *
 * Displays AI-BOARD as a hero-style featured project at the top of the Projects section.
 * Fetches data from Astro Content Collections (src/content/projects/ai-board.md).
 *
 * @remarks
 * - Static component (no client-side hydration)
 * - Gracefully handles missing content (renders nothing if entry not found)
 * - Respects prefers-reduced-motion preference
 */

// No props required - component fetches its own data
export interface Props {}
```

## Visual Contract

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │                                 │  │ Featured Project             │ │
│  │         Project Image           │  │                              │ │
│  │         (16:9 aspect ratio)     │  │ AI-BOARD                     │ │
│  │                                 │  │ ──────────                   │ │
│  │                                 │  │ AI-powered project           │ │
│  │                                 │  │ management board...          │ │
│  │                                 │  │                              │ │
│  │                                 │  │ ✨ This portfolio was built  │ │
│  │                                 │  │    using AI-BOARD            │ │
│  │                                 │  │                              │ │
│  │                                 │  │ [TypeScript] [Claude API]    │ │
│  │                                 │  │ [Astro] [GSAP]               │ │
│  │                                 │  │                              │ │
│  │                                 │  │ [View Live Site →]           │ │
│  └─────────────────────────────────┘  └──────────────────────────────┘ │
│         60% width                           40% width                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (≤767px)

```
┌─────────────────────────────┐
│     Featured Project        │
├─────────────────────────────┤
│                             │
│      Project Image          │
│      (16:9 aspect ratio)    │
│                             │
├─────────────────────────────┤
│  AI-BOARD                   │
│  ──────────                 │
│  AI-powered project         │
│  management board...        │
│                             │
│  ✨ This portfolio was      │
│     built using AI-BOARD    │
│                             │
│  [TypeScript] [Claude API]  │
│  [Astro] [GSAP]             │
│                             │
│  [View Live Site →]         │
└─────────────────────────────┘
```

## HTML Structure Contract

```html
<article class="featured-project" aria-labelledby="featured-project-title">
  <!-- Section label -->
  <span class="featured-project__label">Featured Project</span>

  <!-- Image container with aspect-ratio placeholder -->
  <div class="featured-project__image-wrapper">
    <img
      src="/images/projects/ai-board.webp"
      alt="AI-BOARD dashboard interface..."
      class="featured-project__image"
      loading="lazy"
      decoding="async"
    />
  </div>

  <!-- Content container -->
  <div class="featured-project__content">
    <h3 id="featured-project-title" class="featured-project__title">
      AI-BOARD
    </h3>

    <p class="featured-project__description">
      AI-powered project management board...
    </p>

    <!-- Meta-narrative highlight -->
    <p class="featured-project__meta-narrative">
      ✨ This portfolio was built using AI-BOARD's specification and planning tools.
    </p>

    <!-- Technology tags -->
    <ul class="featured-project__technologies" aria-label="Technologies used">
      <li class="featured-project__tech-tag">TypeScript</li>
      <li class="featured-project__tech-tag">Claude API</li>
      <li class="featured-project__tech-tag">Astro</li>
      <li class="featured-project__tech-tag">GSAP</li>
    </ul>

    <!-- Call-to-action -->
    <a
      href="https://ai-board-three.vercel.app/"
      class="featured-project__cta"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit AI-BOARD live site (opens in new tab)"
    >
      View Live Site
      <span aria-hidden="true">→</span>
    </a>
  </div>
</article>
```

## CSS Class Contract

| Class | Purpose |
|-------|---------|
| `.featured-project` | Root container, flexbox layout |
| `.featured-project__label` | "Featured Project" label text |
| `.featured-project__image-wrapper` | Image container with aspect-ratio |
| `.featured-project__image` | Project image |
| `.featured-project__content` | Text content container |
| `.featured-project__title` | Project title (h3) |
| `.featured-project__description` | Project description |
| `.featured-project__meta-narrative` | "Built with AI-BOARD" highlight text |
| `.featured-project__technologies` | Tech tag list |
| `.featured-project__tech-tag` | Individual tech tag |
| `.featured-project__cta` | Call-to-action button/link |

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Semantic structure | `<article>` wrapper |
| Heading hierarchy | `<h3>` (within section's `<h2>`) |
| Screen reader labels | `aria-labelledby`, `aria-label` on link |
| External link indication | `(opens in new tab)` in aria-label |
| Focus visibility | `:focus-visible` outline |
| Reduced motion | Animation disabled via media query |
| Color contrast | All colors WCAG AA compliant |

## Animation Contract

```css
/* Default: Fade-in animation */
.featured-project {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.featured-project.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion: Instant reveal */
@media (prefers-reduced-motion: reduce) {
  .featured-project {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

## Integration Contract

The component will be added to `index.astro` within the Projects section, before `ProjectsHexGrid`:

```astro
<!-- Projects Section -->
<section id="projects" data-section="projects" ...>
  <FeaturedProject />      <!-- NEW: Featured project hero -->
  <ProjectsHexGrid />      <!-- EXISTING: Standard project grid -->
</section>
```
