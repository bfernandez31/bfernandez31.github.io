# Research: Featured Project Section for AI-BOARD

**Feature Branch**: `PBF-24-featured-project`
**Research Date**: 2025-12-19

## Phase 0 Research Tasks

### Task 1: Astro Content Collections Filtering Pattern

**Context**: Need to fetch AI-BOARD project from content collection with `featured: true` flag.

**Decision**: Use `getEntry()` by slug for direct retrieval or `getCollection()` with filter.

**Rationale**:
- The ai-board.md entry already has `featured: true` and `displayOrder: 1`
- Using `getEntry('projects', 'ai-board')` is most efficient for a single known entry
- Alternatively, `getCollection('projects').filter(p => p.data.featured)` allows for future multiple featured projects

**Implementation Pattern**:
```typescript
// Option A: Direct retrieval (preferred for single known entry)
import { getEntry } from 'astro:content';
const aiBoard = await getEntry('projects', 'ai-board');

// Option B: Filter-based (future-proof for multiple featured)
import { getCollection } from 'astro:content';
const featured = await getCollection('projects', ({ data }) => data.featured);
```

**Selected Approach**: Option A (direct retrieval by slug) - simpler, more explicit, no filtering overhead.

**Alternatives Considered**:
- Hardcoding AI-BOARD data: Rejected - violates single source of truth principle
- Separate featured content collection: Rejected - over-engineering for single entry

---

### Task 2: Hero-Style Card Layout Pattern

**Context**: Need visually prominent presentation that differentiates from hex grid items.

**Decision**: Use a large card with:
- Full-width layout at top of Projects section
- Prominent image with aspect-ratio placeholder (16:9 or 21:9 for cinematic feel)
- Title + description with meta-narrative emphasis
- Technology tags displayed prominently
- Clear CTA button linking to live deployment

**Rationale**:
- Hero-style presentation creates visual hierarchy
- Larger viewport footprint immediately signals "featured" status
- Consistent with spec requirement FR-003 (visually differentiate from hex grid)
- Responsive breakdown: full-width → stacked layout on mobile

**Layout Structure**:
```
Desktop (≥1024px):
┌─────────────────────────────────────────────────────────────┐
│  [Image 60%]                    │  [Content 40%]           │
│                                 │  Title                    │
│                                 │  Description              │
│                                 │  Meta-narrative           │
│                                 │  [Tech tags]              │
│                                 │  [CTA Button]             │
└─────────────────────────────────────────────────────────────┘

Tablet (768px-1023px):
┌─────────────────────────────────────────────────────────────┐
│  [Image 50%]              │  [Content 50%]                 │
└─────────────────────────────────────────────────────────────┘

Mobile (≤767px):
┌───────────────────────────┐
│  [Image stacked]          │
├───────────────────────────┤
│  [Content stacked]        │
└───────────────────────────┘
```

**Alternatives Considered**:
- Full-screen hero takeover: Rejected - too disruptive to page flow
- Smaller inline card: Rejected - doesn't meet "featured" prominence requirement
- Carousel with multiple featured: Rejected - over-engineering, adds JS complexity

---

### Task 3: Animation Strategy

**Context**: Feature requires smooth entrance animations that respect reduced motion.

**Decision**: Use CSS-based fade-in animation with optional GSAP enhancement.

**Rationale**:
- CSS-only base ensures FR-010 compliance (progressive enhancement)
- prefers-reduced-motion: Instant reveal (no animation)
- Standard motion: Subtle fade-in + slide-up (opacity: 0→1, translateY: 20px→0)
- Duration: 0.6s to match Hero section pattern

**Implementation Pattern**:
```css
.featured-project {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.featured-project.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .featured-project {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Alternatives Considered**:
- Complex GSAP ScrollTrigger animation: Rejected - unnecessary for single component
- No animation at all: Rejected - inconsistent with rest of portfolio

---

### Task 4: Color & Styling Integration

**Context**: Must use existing theme tokens for consistency.

**Decision**: Use violet-to-rose gradient accent consistent with portfolio brand.

**Key Tokens**:
- Background: `var(--color-surface)` or `var(--color-surface-elevated)`
- Title: `var(--color-primary)` (violet)
- Description: `var(--color-text)` / `var(--color-text-secondary)`
- CTA Button: `var(--color-primary)` with hover `var(--color-primary-hover)`
- Tech tags: `var(--color-primary)` with subtle background
- Border/accent: `var(--color-border)` or gradient from `var(--color-primary)` to `var(--color-secondary)`

**Gradient Pattern** (for featured highlight):
```css
.featured-project__highlight {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}
```

---

### Task 5: Accessibility Requirements

**Context**: Must meet FR-007 (reduced motion), FR-008 (WCAG AA), FR-009 (ARIA).

**Decision**: Implement semantic HTML with proper ARIA and keyboard support.

**Implementation**:
- `<article>` wrapper for semantic grouping
- `<h3>` for title (within Projects section's `<h2>` hierarchy)
- `aria-label` on link for screen reader context
- `rel="noopener noreferrer"` and `target="_blank"` for external link
- Focus visible state matching site-wide focus ring
- All color combinations already verified for WCAG AA (see theme.css)

**ARIA Pattern**:
```html
<article class="featured-project" aria-labelledby="featured-title">
  <h3 id="featured-title" class="featured-project__title">AI-BOARD</h3>
  <a
    href="https://ai-board-three.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit AI-BOARD live site (opens in new tab)"
  >
    View Live Site
  </a>
</article>
```

---

### Task 6: Edge Case Handling

**Context**: Spec defines edge cases that must be handled gracefully.

**Decisions**:

1. **Missing AI-BOARD content**: Component renders only if entry exists
   ```typescript
   const aiBoard = await getEntry('projects', 'ai-board');
   // Component only renders if aiBoard is truthy
   ```

2. **Slow image loading**: Use aspect-ratio placeholder
   ```css
   .featured-project__image {
     aspect-ratio: 16 / 9;
     background: var(--color-surface);
   }
   ```

3. **JavaScript failure**: CSS-only visibility, no JS-dependent content
   - Use `<noscript>` fallback if critical functionality requires JS (not applicable here)
   - All content is static HTML, no hydration required

---

## Summary

All research tasks completed. No unresolved clarifications remaining.

| Task | Status | Decision |
|------|--------|----------|
| Content Collection pattern | ✅ Resolved | Use `getEntry('projects', 'ai-board')` |
| Layout pattern | ✅ Resolved | Hero-style card with 60/40 split |
| Animation strategy | ✅ Resolved | CSS fade-in, optional GSAP enhancement |
| Color integration | ✅ Resolved | Use existing theme tokens |
| Accessibility | ✅ Resolved | Semantic HTML + ARIA + focus management |
| Edge cases | ✅ Resolved | Conditional render + aspect-ratio placeholder |
