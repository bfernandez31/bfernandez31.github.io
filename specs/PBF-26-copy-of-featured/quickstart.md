# Quickstart: Fix Featured Project Preview Layout

**Feature**: PBF-26-copy-of-featured
**Date**: 2025-12-19

## Problem

The Featured Project section has a layout issue on mobile devices where the preview image appears before the project title, making it unclear which project is being featured.

## Solution

Add CSS `order` property to reorder flex children on mobile viewports.

## Implementation

### File to Modify

`src/components/sections/FeaturedProject.astro`

### CSS Change

Add the following rules inside the existing mobile media query:

```css
/* Mobile layout (max-width: 767px) - stacked */
@media (max-width: 767px) {
  .featured-project__label {
    order: 1;
  }

  .featured-project__content {
    order: 2;
  }

  .featured-project__image-wrapper {
    order: 3;
  }

  .featured-project__cta {
    width: 100%;
    justify-content: center;
  }
}
```

### Visual Order After Fix

**Mobile (<768px)**:
1. "Featured Project" label
2. Project title, description, meta-narrative, technologies, CTA
3. Preview image

**Tablet/Desktop**: Unchanged (side-by-side layout)

## Verification

1. Run `bun run dev`
2. Open http://localhost:4321
3. Use DevTools to resize viewport to <768px
4. Verify "AI-BOARD" title appears before the image
5. Resize to tablet (768-1023px) and desktop (1024px+) to confirm no regression

## No Breaking Changes

- HTML structure unchanged (SEO preserved)
- Tablet/desktop layouts unaffected
- No JavaScript added
- Accessibility maintained (DOM order for screen readers)
