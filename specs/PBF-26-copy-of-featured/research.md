# Research: Fix Featured Project Preview Layout

**Feature**: PBF-26-copy-of-featured
**Date**: 2025-12-19

## Research Tasks

### Task 1: Diagnose "preview not working" issue

**Question**: What does "preview is not working" mean in this context?

**Findings**:
- Image file exists: `/public/images/projects/ai-board.webp` (570 bytes)
- Image path in content: `/images/projects/ai-board.webp` (correct for Astro)
- Component has proper `loading="lazy"` and `decoding="async"` attributes
- Fallback background color is applied via CSS

**Decision**: No image loading issue. "Not working" refers to visual layout, not image display.

**Rationale**: Image path is correct, file exists, and component has proper image handling. The user's description "preview is above the title" confirms this is a layout issue.

---

### Task 2: Diagnose "above the title" layout issue

**Question**: Why is the preview image appearing "above the title"?

**Findings**:

Current HTML structure:
```html
<div class="featured-project__container">
  <span class="featured-project__label">Featured Project</span>
  <div class="featured-project__image-wrapper">...</div>
  <div class="featured-project__content">
    <h3>AI-BOARD</h3>
    ...
  </div>
</div>
```

Current mobile CSS:
- Container uses `flex-direction: column` (default)
- Elements render in DOM order: label → image → content

**Decision**: The image wrapper appears before the content (which contains the H3 title) in DOM order.

**Rationale**: On mobile, the visual flow is:
1. Small "Featured Project" label
2. Large preview image (dominates viewport)
3. Project title "AI-BOARD"

Users scrolling on mobile see the image before the title, making it unclear what project they're looking at.

---

### Task 3: Best practice for CSS visual reordering

**Question**: What is the best approach to reorder flex items for mobile only?

**Findings**:
- CSS `order` property reorders flex items visually without changing DOM
- Maintains SEO (DOM order preserved for crawlers)
- Maintains accessibility (focus order follows DOM)
- Well-supported: Chrome 29+, Firefox 28+, Safari 9+, Edge 12+

**Decision**: Use CSS `order` property within mobile media query.

**Rationale**:
- Zero HTML changes reduces regression risk
- Tablet/desktop layouts unaffected (use different flex-direction)
- Pure CSS, no JavaScript overhead
- Follows existing responsive patterns in the component

**Alternatives Considered**:
1. HTML restructure - Rejected (risk of breaking other layouts)
2. Duplicate content - Rejected (violates DRY, maintenance burden)
3. JavaScript reordering - Rejected (unnecessary complexity)

---

## Summary

| Unknown | Resolution |
|---------|------------|
| "Preview not working" | Image loads correctly; issue is layout order |
| "Above the title" | Image appears before content div in DOM on mobile |
| Best fix approach | CSS `order` property in mobile media query |

All unknowns resolved. Ready for Phase 1 design.
