# Responsive Design Patterns

## Overview

The portfolio implements responsive design patterns using mobile-first CSS with progressive enhancement for larger viewports. All components adapt to different screen sizes using breakpoint-based media queries and modern CSS layout techniques.

## Breakpoint System

### Viewport Classifications

The portfolio uses three primary breakpoints:

```css
/* Mobile (default) */
/* max-width: 767px */

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

**Breakpoint Rationale**:
- **767px**: Common smartphone landscape width
- **1023px**: Common tablet landscape width
- **1024px**: Desktop monitors and larger displays

### Mobile-First Approach

All components default to mobile layout without media queries. Larger viewports progressively enhance the experience:

1. **Base styles** apply to all viewports (mobile default)
2. **Tablet styles** override base for 768-1023px range
3. **Desktop styles** override base for ≥1024px range

## Layout Patterns

### Flexbox Ordering Pattern

**Use Case**: Reordering visual presentation without changing DOM structure

**Example**: FeaturedProject component

**Problem**: On mobile, large preview image appears before project title/description, forcing users to scroll past image to read content.

**Solution**: Use CSS `order` property to visually reorder elements within flexbox container:

```css
.container {
  display: flex;
  flex-direction: column;
}

/* Mobile: Content-first ordering */
@media (max-width: 767px) {
  .label {
    order: 1;  /* "Featured Project" label first */
  }

  .content {
    order: 2;  /* Title, description, tags second */
  }

  .image {
    order: 3;  /* Preview image last */
  }
}
```

**Benefits**:
- **SEO**: DOM order unchanged (semantic HTML preserved)
- **Accessibility**: Screen readers follow DOM order, not visual order
- **Performance**: CSS-only solution, zero JavaScript
- **Maintainability**: Single source of truth for content structure

**Trade-offs**:
- Visual order differs from DOM order (may confuse keyboard navigation)
- Focus order follows DOM, not visual layout
- Requires parent container to be flexbox or grid

**Implementation Location**: `src/components/sections/FeaturedProject.astro`

### Horizontal-to-Vertical Stack Pattern

**Use Case**: Side-by-side layout on desktop, stacked on mobile

**Example**: FeaturedProject component

**Implementation**:

```css
/* Mobile: Vertical stack (default) */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet: Horizontal 50/50 split */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    flex-direction: row;
    align-items: flex-start;
  }

  .image {
    flex: 0 0 50%;
  }

  .content {
    flex: 1;
  }
}

/* Desktop: Horizontal 60/40 split */
@media (min-width: 1024px) {
  .container {
    flex-direction: row;
    align-items: flex-start;
  }

  .image {
    flex: 0 0 60%;  /* 60% width, no grow/shrink */
  }

  .content {
    flex: 1;  /* Fill remaining space */
  }
}
```

**Benefits**:
- Optimizes content consumption for viewport size
- Larger images on desktop (more screen real estate)
- Easier reading on mobile (no horizontal scrolling)

### Absolute Positioning on Desktop Pattern

**Use Case**: Floating labels or badges that overlay content on desktop but inline on mobile

**Example**: FeaturedProject "Featured Project" label

**Implementation**:

```css
/* Mobile: Inline label */
.label {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

/* Desktop: Floating label */
@media (min-width: 1024px) {
  .label {
    position: absolute;
    top: 2rem;
    left: 2rem;
    margin-bottom: 0;
  }
}
```

**Benefits**:
- Saves vertical space on desktop
- Maintains document flow on mobile
- Creates visual hierarchy through positioning

**Caution**:
- Ensure sufficient space for absolute positioned elements
- Avoid overlapping content
- Test with varying content lengths

## Responsive Typography

### Fluid Typography with Clamp

**Pattern**: Responsive font sizing that scales smoothly between min and max values

**Implementation**:

```css
.title {
  font-size: clamp(1.5rem, 3vw, 2rem);
}
```

**Parameters**:
- `1.5rem`: Minimum size (mobile)
- `3vw`: Preferred size (scales with viewport)
- `2rem`: Maximum size (desktop)

**Benefits**:
- Smooth scaling without media query breakpoints
- Single declaration for all viewports
- Prevents oversized text on large displays
- Prevents tiny text on small displays

## Component-Specific Patterns

### TUI Layout Component

**Responsive Behavior**:

| Viewport | Sidebar | Content Layout | Toggle Button |
|----------|---------|----------------|---------------|
| Mobile (<768px) | Hidden overlay | Full-width | Visible |
| Tablet (768-1023px) | Collapsible overlay | Full-width when collapsed | Visible |
| Desktop (≥1024px) | Side-by-side grid | Grid column layout | Hidden |

**CSS Implementation**: `src/components/layout/TuiLayout.astro` (structure) + `src/styles/tui/layout.css` (grid layout)

**Key Features**:
- CSS Grid layout for desktop side-by-side display
- Sidebar width: 200-250px (minmax) on desktop
- Content fills remaining space (1fr grid column)
- Grid areas: topbar, sidebar, content, statusline, commandline
- Mobile/tablet: Sidebar becomes full-width overlay
- Component-scoped styles handle only visual properties (colors, fonts)
- Global grid layout defined in `layout.css` for separation of concerns

**Architecture Pattern**:
- **Global Grid Definition** (`layout.css`): Controls layout structure and grid template
- **Scoped Component Styles** (`TuiLayout.astro`): Controls visual properties (colors, fonts, sizing)
- Scoped styles intentionally avoid `display: grid` and `grid-template-*` to prevent conflicts
- Grid areas defined globally, allowing sidebar and content to participate in grid layout

**Common Pitfall**:
- **Issue**: Adding `display: grid` or `grid-template-*` properties in component-scoped styles can override global grid layout
- **Solution**: Keep grid layout properties in global CSS, use only visual properties in scoped styles
- **Fixed**: PBF-33 removed conflicting scoped grid properties, allowing global grid layout to function correctly

### FeaturedProject Component

**Responsive Behavior**:

| Viewport | Layout | Image Width | Visual Order |
|----------|--------|-------------|--------------|
| Mobile (<768px) | Vertical stack | 100% | Label → Content → Image |
| Tablet (768-1023px) | Horizontal split | 50% | Side-by-side |
| Desktop (≥1024px) | Horizontal split | 60% | Side-by-side |

**CSS Implementation**: `src/components/sections/FeaturedProject.astro`

**Key Features**:
- Content-first mobile ordering using `order` property
- Aspect ratio preservation (16:9) across viewports
- Full-width CTA button on mobile, inline on desktop
- Absolute positioned label on desktop, inline on mobile
- Gradient fallback for broken images: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
- Image displays over gradient when loaded successfully

**Section Structure**:
- Projects section begins with unified "Projects" h2 title in `index.astro`
- FeaturedProject component follows the section title
- ProjectsHexGrid displays with "More Projects" h3 subtitle for proper heading hierarchy

### Experience Timeline Component

**Responsive Behavior**:

| Viewport | Layout | Entry Position |
|----------|--------|----------------|
| Mobile (<1024px) | Vertical stack | Center-aligned |
| Desktop (≥1024px) | Alternating layout | Left/right alternating |

**Pattern**: Timeline entries alternate between left and right on desktop for visual variety

### ScrollProgress Component

**Responsive Behavior**:
- Fixed positioning at viewport top across all breakpoints
- Height adjusts based on DPI (4px standard, 3px high-DPI)
- No layout changes between viewports

## Testing Responsive Layouts

### Manual Testing

**Viewports to Test**:
1. **Mobile Portrait**: 375px (iPhone SE)
2. **Mobile Landscape**: 667px (iPhone SE landscape)
3. **Tablet Portrait**: 768px (iPad)
4. **Tablet Landscape**: 1024px (iPad landscape)
5. **Desktop**: 1440px (common laptop)
6. **Large Desktop**: 1920px (FHD monitor)

### DevTools Responsive Mode

**Chrome/Edge**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or enter custom dimensions
4. Test orientation changes

**Firefox**:
1. Open DevTools (F12)
2. Click Responsive Design Mode icon
3. Select device preset or custom size
4. Test touch simulation

### CSS Debugging

**Common Issues**:

1. **Horizontal Overflow**: Check for fixed widths, missing `max-width`, or negative margins
   ```bash
   # Check for overflow issues in DevTools
   document.querySelectorAll('*').forEach(el => {
     if (el.scrollWidth > el.clientWidth) console.log(el)
   })
   ```

2. **Flexbox Order Confusion**: Verify `order` values don't skip numbers (1, 2, 3, not 1, 3, 7)

3. **Media Query Conflicts**: Ensure breakpoints don't overlap unintentionally

## Best Practices

### Mobile-First Development

**Start with mobile styles**:
1. Write base CSS for mobile viewport
2. Add tablet enhancements with `min-width: 768px`
3. Add desktop enhancements with `min-width: 1024px`

**Benefits**:
- Progressive enhancement (works without JS)
- Smaller mobile bundles (fewer overrides)
- Better performance on constrained devices

### Avoid Fixed Widths

**Bad**:
```css
.container {
  width: 600px;  /* Breaks on <600px viewports */
}
```

**Good**:
```css
.container {
  max-width: 600px;  /* Scales down on smaller viewports */
  width: 100%;
}
```

### Use Relative Units

**Prefer**:
- `rem` for font sizes (respects user font settings)
- `em` for spacing relative to font size
- `%` for layout dimensions
- `vw/vh` for viewport-relative sizes

**Avoid**:
- `px` for font sizes (not accessible)
- `px` for layout (not flexible)

### Test Content Extremes

**Test Cases**:
1. **Short content**: Single word titles, minimal descriptions
2. **Long content**: Multi-line titles, paragraph descriptions
3. **No content**: Empty states, missing images
4. **Overflow**: Very long URLs, unbreakable text

## Accessibility Considerations

### Focus Order vs. Visual Order

When using `order` property to reorder elements visually:

**Issue**: Keyboard focus follows DOM order, not visual order

**Solution**: Ensure DOM order is logical for keyboard users

**Example**: FeaturedProject component
- **DOM order**: Label → Image → Content
- **Visual order (mobile)**: Label → Content → Image
- **Focus order**: Follows DOM (label → image → content)

**Mitigation**:
- Test keyboard navigation on mobile
- Ensure focus order makes sense semantically
- Consider restructuring DOM if focus order is confusing

### Screen Reader Compatibility

**Best Practices**:
- Use semantic HTML (`<article>`, `<section>`, `<h1-h6>`)
- Maintain logical heading hierarchy regardless of visual order
- Provide `aria-label` for sections without visible headings
- Don't rely on visual position to convey meaning

### Reduced Motion

All responsive layouts respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;  /* Disable animations */
  }
}
```

**Applied to**:
- Layout transitions (flex-direction changes)
- Opacity/transform animations
- Color transitions

## Performance

### CSS Performance

**Optimizations**:
- Avoid expensive properties in media queries (box-shadow, filter)
- Use GPU-accelerated properties (transform, opacity)
- Minimize layout thrashing (batch DOM reads/writes)

### Layout Shift Prevention

**Cumulative Layout Shift (CLS) Targets**: <0.1

**Techniques**:
1. **Aspect ratio preservation**: Use `aspect-ratio` for images
2. **Fixed heights**: Set min-height for dynamic content
3. **Loading placeholders**: Show skeleton screens during load
4. **Font loading**: Use `font-display: swap` to prevent FOUT

**Implementation**: FeaturedProject image uses `aspect-ratio: 16 / 9` to prevent layout shift during image load

## Browser Support

### CSS Features Used

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Flexbox | 29+ | 28+ | 9+ | 12+ |
| CSS Grid | 57+ | 52+ | 10.1+ | 16+ |
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |
| `clamp()` | 79+ | 75+ | 13.1+ | 79+ |
| `aspect-ratio` | 88+ | 89+ | 15+ | 88+ |

**Fallbacks**:
- `aspect-ratio`: Use padding-bottom hack for older browsers
- `clamp()`: Use media query breakpoints as fallback
- CSS Variables: Provide static fallback values

## Examples

### Complete Responsive Component Example

```astro
---
// src/components/sections/ResponsiveSection.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<section class="responsive-section">
  <span class="responsive-section__label">Section Label</span>

  <div class="responsive-section__image">
    <img src="/placeholder.webp" alt="Placeholder" loading="lazy" />
  </div>

  <div class="responsive-section__content">
    <h2>{title}</h2>
    <p>Content goes here</p>
  </div>
</section>

<style>
  /* Mobile (default) */
  .responsive-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .responsive-section__label {
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .responsive-section__image {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .responsive-section__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Mobile: Content-first ordering */
  @media (max-width: 767px) {
    .responsive-section__label {
      order: 1;
    }

    .responsive-section__content {
      order: 2;
    }

    .responsive-section__image {
      order: 3;
    }
  }

  /* Tablet: Side-by-side */
  @media (min-width: 768px) and (max-width: 1023px) {
    .responsive-section {
      flex-direction: row;
      padding: 2rem;
    }

    .responsive-section__label {
      position: absolute;
      top: 2rem;
      left: 2rem;
    }

    .responsive-section__image {
      flex: 0 0 50%;
    }

    .responsive-section__content {
      flex: 1;
    }
  }

  /* Desktop: Side-by-side with larger image */
  @media (min-width: 1024px) {
    .responsive-section {
      flex-direction: row;
      padding: 2rem;
    }

    .responsive-section__label {
      position: absolute;
      top: 2rem;
      left: 2rem;
    }

    .responsive-section__image {
      flex: 0 0 60%;
    }

    .responsive-section__content {
      flex: 1;
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .responsive-section {
      transition: none;
    }
  }
</style>
```

## Related Documentation

- **[Color System](./color-system.md)** - CSS variable usage in responsive contexts
- **[Project Structure](../architecture/project-structure.md)** - Component organization
- **[Animations](../architecture/animations.md)** - Responsive animation patterns
