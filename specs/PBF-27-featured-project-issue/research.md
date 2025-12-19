# Research: Featured Project Layout and Image Fix

**Feature**: PBF-27-featured-project-issue
**Date**: 2025-12-19

## Research Questions

### RQ-1: Why does FeaturedProject appear before the section title?

**Investigation**:
- Analyzed `src/pages/index.astro` (lines 124-134): Projects section contains `<FeaturedProject />` followed by `<ProjectsHexGrid />`
- Analyzed `src/components/sections/ProjectsHexGrid.astro` (line 34): Contains `<h2 class="hex-grid__title">Featured Projects</h2>` inside the component
- Analyzed `src/components/sections/FeaturedProject.astro`: Has no h2 section title, only a `<span class="featured-project__label">Featured Project</span>` (singular)

**Root Cause**:
The section title "Featured Projects" is embedded inside `ProjectsHexGrid.astro`, not at the parent section level. Since `FeaturedProject` is rendered before `ProjectsHexGrid` in `index.astro`, the visual order is:
1. FeaturedProject (no h2)
2. ProjectsHexGrid > h2.hex-grid__title ("Featured Projects")
3. ProjectsHexGrid > hex items

**Decision**: Extract section title to parent level in `index.astro`
**Rationale**: Follows semantic HTML best practices (section title at section level), allows proper visual hierarchy on all devices
**Alternatives considered**:
1. Reorder components in index.astro - Rejected: Would put hex grid before featured project
2. Add h2 to FeaturedProject.astro - Rejected: Duplicates title concept, still doesn't match "Featured Projects" plural

---

### RQ-2: Why is the AI-BOARD image broken?

**Investigation**:
- Ran `ls -la /public/images/projects/`: All files are exactly 570 bytes
- 570 bytes is too small for any real WebP/PNG/JPEG image (indicates placeholder/dummy file)
- The `ai-board.webp` file exists at the correct path referenced in content collection
- Browser shows broken image icon because the file is not valid image data

**Root Cause**:
The image file at `/public/images/projects/ai-board.webp` is a 570-byte placeholder file, not a valid WebP image. This is true for all project images in the directory.

**Decision**: Implement CSS gradient fallback background
**Rationale**:
- Zero JavaScript overhead (performance first)
- Immediate visual feedback (no layout shift)
- Consistent with theme colors (uses CSS custom properties)
- Works for all placeholder images, not just ai-board
**Alternatives considered**:
1. Create/upload real screenshot - Out of scope (requires asset creation)
2. JavaScript onerror handler - Rejected: Adds JS, potential CLS
3. Use placeholder.svg - Rejected: Also 570 bytes (placeholder file)

---

### RQ-3: What CSS pattern should be used for image fallback?

**Investigation**:
- Reviewed existing codebase patterns in `src/styles/theme.css`
- Identified available CSS custom properties: `--color-primary` (violet), `--color-secondary` (rose)
- Existing gradient usage in `sections.css` and component styles

**Decision**: Background gradient on image wrapper
**Rationale**:
- Pattern: Set gradient on `.featured-project__image-wrapper`
- Image loads on top with `object-fit: cover`
- If image fails/is placeholder, gradient shows through transparent/broken area
- Uses existing theme colors for visual consistency

**Implementation**:
```css
.featured-project__image-wrapper {
  /* Existing styles... */
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
}
```

---

### RQ-4: How should the section title be structured for accessibility?

**Investigation**:
- Reviewed WCAG 2.1 heading hierarchy requirements
- Current page structure: h1 (hero) → h2 (About) → h2 (Experience) → h2 (Projects title inside hex-grid)
- `FeaturedProject.astro` uses `h3` for project title (correct - sub-heading within section)

**Decision**: Add h2 section title at parent section level
**Rationale**:
- Proper heading hierarchy: section h2 → article h3s
- Screen readers announce section structure correctly
- Visual hierarchy matches document outline

**Implementation**:
```html
<!-- In index.astro Projects section -->
<h2 class="projects-section__title">Projects</h2>
<FeaturedProject />
<ProjectsHexGrid />
```

And modify `ProjectsHexGrid.astro` to either:
- Change h2 to h3 ("More Projects") - Maintains heading hierarchy
- Or remove the internal h2 entirely if hex-grid items are self-explanatory

---

## Summary of Decisions

| Question | Decision | Confidence |
|----------|----------|------------|
| Layout ordering | Add h2 at section level in index.astro | High |
| ProjectsHexGrid title | Change to h3 "More Projects" or remove | Medium |
| Image fallback | CSS gradient background | High |
| Gradient colors | primary → secondary (135deg) | High |

## Dependencies

- No external dependencies added
- Uses existing CSS custom properties from `theme.css`
- No JavaScript changes required

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gradient looks odd with partial image load | Low | Use solid fallback color under gradient |
| Heading structure affects existing SEO | Low | Proper semantic structure is better for SEO |
| Style conflicts with existing hex-grid | Low | Use scoped BEM class names |
