# Quickstart: Featured Project Section

**Feature Branch**: `PBF-24-featured-project`
**Estimated Implementation Time**: 1-2 hours

## Overview

Add a dedicated featured project section that prominently showcases AI-BOARD at the top of the Projects area. The section uses a hero-style presentation with larger visual footprint than standard hex grid items.

## Prerequisites

- Existing `src/content/projects/ai-board.md` with `featured: true` (already in place)
- Familiarity with Astro components and Content Collections
- Understanding of existing portfolio styling patterns

## Quick Implementation Steps

### 1. Create FeaturedProject Component

Create `src/components/sections/FeaturedProject.astro`:

```astro
---
import { getEntry } from 'astro:content';

// Fetch AI-BOARD entry directly
const aiBoard = await getEntry('projects', 'ai-board');
---

{aiBoard && (
  <article class="featured-project" aria-labelledby="featured-project-title">
    <span class="featured-project__label">Featured Project</span>

    <div class="featured-project__image-wrapper">
      <img
        src={aiBoard.data.image}
        alt={aiBoard.data.imageAlt}
        class="featured-project__image"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="featured-project__content">
      <h3 id="featured-project-title" class="featured-project__title">
        {aiBoard.data.title}
      </h3>

      <p class="featured-project__description">
        {aiBoard.data.description}
      </p>

      <p class="featured-project__meta-narrative">
        ✨ This portfolio was built using AI-BOARD's specification and planning tools.
      </p>

      <ul class="featured-project__technologies" aria-label="Technologies used">
        {aiBoard.data.technologies.map(tech => (
          <li class="featured-project__tech-tag">{tech}</li>
        ))}
      </ul>

      {aiBoard.data.externalUrl && (
        <a
          href={aiBoard.data.externalUrl}
          class="featured-project__cta"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${aiBoard.data.title} live site (opens in new tab)`}
        >
          View Live Site
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  </article>
)}

<style>
  .featured-project {
    display: flex;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    background: var(--color-surface);
    border-radius: var(--radius-large);
    margin-bottom: var(--spacing-xl);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .featured-project.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .featured-project__label {
    position: absolute;
    top: var(--spacing-base);
    left: var(--spacing-base);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-primary);
  }

  .featured-project__image-wrapper {
    flex: 0 0 60%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: var(--radius-medium);
    background: var(--color-surface-elevated);
  }

  .featured-project__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .featured-project__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .featured-project__title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--color-primary);
    margin-bottom: var(--spacing-base);
  }

  .featured-project__description {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-base);
  }

  .featured-project__meta-narrative {
    color: var(--color-secondary);
    font-style: italic;
    margin-bottom: var(--spacing-base);
  }

  .featured-project__technologies {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-small);
    list-style: none;
    padding: 0;
    margin-bottom: var(--spacing-base);
  }

  .featured-project__tech-tag {
    padding: 0.25rem 0.75rem;
    background: var(--color-primary-subtle, rgba(203, 166, 247, 0.15));
    color: var(--color-primary);
    border-radius: var(--radius-small);
    font-size: 0.875rem;
  }

  .featured-project__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-small);
    padding: var(--spacing-small) var(--spacing-base);
    background: var(--color-primary);
    color: var(--color-background);
    text-decoration: none;
    border-radius: var(--radius-medium);
    font-weight: 500;
    transition: background-color var(--transition-color);
    width: fit-content;
  }

  .featured-project__cta:hover {
    background: var(--color-primary-hover);
  }

  .featured-project__cta:focus-visible {
    outline: 2px solid var(--color-primary-focus);
    outline-offset: 2px;
  }

  /* Mobile layout */
  @media (max-width: 767px) {
    .featured-project {
      flex-direction: column;
    }

    .featured-project__image-wrapper {
      flex: none;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .featured-project {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>

<script>
  // Simple fade-in on page load
  const featured = document.querySelector('.featured-project');
  if (featured && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => {
      featured.classList.add('visible');
    });
  }
</script>
```

### 2. Add to index.astro

Import and add the component to the Projects section:

```astro
---
import FeaturedProject from "../components/sections/FeaturedProject.astro";
// ... other imports
---

<!-- Projects Section -->
<section id="projects" data-section="projects" ...>
  <FeaturedProject />
  <ProjectsHexGrid />
</section>
```

### 3. Verify

```bash
bun run dev      # Check at http://localhost:4321/#projects
bun run build    # Verify no build errors
```

## Key Files

| File | Action | Purpose |
|------|--------|---------|
| `src/components/sections/FeaturedProject.astro` | CREATE | New featured project component |
| `src/pages/index.astro` | MODIFY | Add FeaturedProject import and usage |
| `src/content/projects/ai-board.md` | NONE | Existing data source (no changes) |

## Testing Checklist

- [ ] Featured section visible at top of Projects area
- [ ] AI-BOARD title, description, and image display correctly
- [ ] Meta-narrative "built with AI-BOARD" text visible
- [ ] Technology tags display all 4 technologies
- [ ] CTA link opens AI-BOARD site in new tab
- [ ] Mobile layout stacks image above content
- [ ] Animation respects prefers-reduced-motion
- [ ] Keyboard navigation works (Tab to CTA, Enter to activate)
- [ ] Screen reader announces content correctly

## Common Issues

1. **Component not rendering**: Check that `ai-board.md` exists and has valid frontmatter
2. **Image not loading**: Verify image path exists at `/public/images/projects/ai-board.webp`
3. **Styles not applying**: Ensure CSS variables are available from `theme.css`
