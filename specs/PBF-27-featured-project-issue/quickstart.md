# Quickstart: Testing Featured Project Layout and Image Fix

**Feature**: PBF-27-featured-project-issue
**Date**: 2025-12-19

## Prerequisites

- Bun ≥1.0.0 installed
- Clone the repository and checkout the feature branch

```bash
git checkout PBF-27-featured-project-issue
bun install
```

## Running the Development Server

```bash
bun run dev
```

Open http://localhost:4321 in your browser.

## Testing Checklist

### Test 1: Layout Ordering (All Viewports)

**Steps**:
1. Navigate to `http://localhost:4321/#projects`
2. Verify the section title appears first
3. Verify the FeaturedProject card (AI-BOARD) appears below the section title
4. Verify the ProjectsHexGrid appears below the FeaturedProject

**Expected on Mobile (≤767px)**:
- Section title at top
- FeaturedProject card (stacked layout: label → content → image)
- "More Projects" or hex grid items

**Expected on Tablet (768-1023px)**:
- Section title at top
- FeaturedProject card (50/50 split layout)
- Hex grid with offset pattern

**Expected on Desktop (≥1024px)**:
- Section title at top
- FeaturedProject card (60/40 split layout)
- Hex grid with offset pattern

### Test 2: Image Fallback

**Steps**:
1. Navigate to `/#projects` section
2. Observe the FeaturedProject image area
3. Verify a gradient is displayed (violet to rose, 135-degree angle)
4. Open DevTools > Network > disable cache
5. Reload and verify no broken image icon appears

**Expected**:
- Smooth gradient from primary (violet) to secondary (rose)
- No broken image icon
- No alt text visible (image wrapper shows gradient)

### Test 3: Accessibility

**Steps**:
1. Use keyboard (Tab) to navigate to the Projects section
2. Verify heading hierarchy with screen reader or browser outline:
   - h2: "Projects" (or similar section title)
   - h3: "AI-BOARD" (FeaturedProject title)
   - h3: (Other project titles in hex grid, if applicable)
3. Verify all interactive elements (CTA button, hex links) are focusable

**Expected**:
- Logical heading hierarchy (h2 → h3)
- Focus indicators visible on interactive elements
- Screen reader announces section structure correctly

### Test 4: Reduced Motion

**Steps**:
1. Enable "Reduce motion" in OS accessibility settings
2. Navigate to `/#projects`
3. Verify FeaturedProject appears without animation (instant reveal)

**Expected**:
- No fade-in animation
- Content immediately visible
- No layout shift

### Test 5: Responsive Breakpoints

Test at these specific widths:

| Width | Layout | What to Check |
|-------|--------|---------------|
| 320px | Mobile | Stacked layout, section title first |
| 767px | Mobile edge | Just before tablet breakpoint |
| 768px | Tablet | Side-by-side 50/50 layout |
| 1023px | Tablet edge | Just before desktop breakpoint |
| 1024px | Desktop | Side-by-side 60/40 layout |
| 1440px | Large desktop | Content centered, proper max-width |

## Build Verification

```bash
# Type check and build
bun run build

# Preview production build
bun run preview
```

Verify:
- Build completes without errors
- Preview shows same behavior as dev server
- Lighthouse scores maintained (≥85 mobile, ≥95 desktop)

## Common Issues

### Gradient not showing
- Check CSS custom properties `--color-primary` and `--color-secondary` are defined
- Verify `.featured-project__image-wrapper` has the background rule

### Section title not appearing
- Ensure h2 was added to index.astro before FeaturedProject component
- Check CSS for display/visibility issues

### Layout incorrect on specific viewport
- Verify media query breakpoints match spec (767px, 768px, 1023px, 1024px)
- Check for CSS specificity conflicts

## Rollback

If issues are found, revert to previous commit:

```bash
git checkout HEAD~1 -- src/pages/index.astro
git checkout HEAD~1 -- src/components/sections/FeaturedProject.astro
git checkout HEAD~1 -- src/components/sections/ProjectsHexGrid.astro
```
