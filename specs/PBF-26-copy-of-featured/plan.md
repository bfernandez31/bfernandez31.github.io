# Implementation Plan: Fix Featured Project Preview Layout

**Branch**: `PBF-26-copy-of-featured` | **Date**: 2025-12-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/PBF-26-copy-of-featured/spec.md`

## Summary

Fix the Featured Project section layout where the preview image appears above the "Featured Project" label on mobile viewports. The issue is in the HTML structure order within `FeaturedProject.astro` - the image wrapper is rendered after the label but should appear after the content section on mobile (or the label should be visually positioned correctly). Additionally verify that the image loads correctly.

## Technical Context

**Language/Version**: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime)
**Primary Dependencies**: Astro 5.15.3, GSAP 3.13.0, CSS Custom Properties
**Storage**: N/A (static site, Markdown via Astro Content Collections)
**Testing**: Visual regression testing (manual), Lighthouse CI
**Target Platform**: Web (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
**Project Type**: Web (Astro static site)
**Performance Goals**: Lighthouse ≥95 desktop, ≥85 mobile, 60fps animations, CLS <0.1
**Constraints**: <200KB JavaScript, <500KB initial page weight, WCAG 2.1 AA
**Scale/Scope**: Single component fix (FeaturedProject.astro)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Performance First | ✅ PASS | CSS-only fix, no new JavaScript, maintains 0KB JS for static portion |
| II. Quality & Accessibility | ✅ PASS | Fix improves visual hierarchy for all users, maintains semantic HTML |
| III. Build & Deployment | ✅ PASS | No build changes required, single component edit |
| IV. Developer Experience | ✅ PASS | Simple CSS flexbox order change, follows existing patterns |
| V. Content & SEO Excellence | ✅ PASS | No content structure changes, maintains semantic markup |
| VI. Tooling & Runtime | ✅ PASS | Uses existing Bun/Astro toolchain |

**Gate Status**: ✅ PASS - No constitution violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```
specs/PBF-26-copy-of-featured/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # N/A (CSS-only fix)
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A (no API changes)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```
src/
├── components/
│   └── sections/
│       └── FeaturedProject.astro  # Target component for fix
├── content/
│   └── projects/
│       └── ai-board.md            # Content source (verified)
└── styles/                        # Global styles (no changes expected)

public/
└── images/
    └── projects/
        └── ai-board.webp          # Image asset (verified exists - 570 bytes)
```

**Structure Decision**: Single component fix within existing Astro static site structure. No new files needed.

## Complexity Tracking

*No constitution violations to justify.*

---

## Phase 0: Research

### Issue Analysis

#### Problem 1: Visual Hierarchy on Mobile

**Current HTML Structure** (FeaturedProject.astro lines 11-54):
```html
<div class="featured-project__container">
  <span class="featured-project__label">Featured Project</span>     <!-- 1st -->
  <div class="featured-project__image-wrapper">...</div>             <!-- 2nd -->
  <div class="featured-project__content">                            <!-- 3rd -->
    <h3>Title</h3>
    ...
  </div>
</div>
```

**Current CSS** (mobile <767px):
- `flex-direction: column` (default)
- Label appears first ✅
- Image wrapper appears second
- Content (with title) appears third

**Issue**: The label says "Featured Project" but the H3 title containing the actual project name ("AI-BOARD") is inside `.featured-project__content` which renders AFTER the image on mobile. Users reported "preview is above the title" which means the image renders before the project title is visible.

**Root Cause**: On mobile, the visual order is:
1. "Featured Project" label (small text)
2. Large preview image
3. Project title "AI-BOARD"

Users expect: Label → Title → Image (content first, then visual)

#### Problem 2: Image Display

**Verified**: Image file exists at `/public/images/projects/ai-board.webp` (570 bytes)
- Path in content: `/images/projects/ai-board.webp` (correct for Astro public folder)
- Image has `loading="lazy"` and `decoding="async"` attributes
- Fallback background: `var(--color-surface-elevated)` applied

**No image loading issue found** - the image path is correct and file exists.

### Solution Options

#### Option A: CSS Flexbox Order (Recommended)
Use CSS `order` property to reorder elements visually on mobile without changing HTML structure.

```css
@media (max-width: 767px) {
  .featured-project__label { order: 1; }
  .featured-project__content { order: 2; }
  .featured-project__image-wrapper { order: 3; }
}
```

**Pros**: No HTML changes, maintains SEO/accessibility, purely visual fix
**Cons**: None significant

#### Option B: Restructure HTML
Move image inside content div or restructure container.

**Pros**: Semantic grouping
**Cons**: May break tablet/desktop layouts, higher risk of regression

#### Option C: Duplicate Label
Add label inside content section for mobile, hide original.

**Pros**: More control
**Cons**: Duplication, maintenance burden

### Decision

**Selected**: Option A (CSS Flexbox Order)

**Rationale**:
- Minimal code change (CSS only)
- No risk to tablet/desktop layouts
- Maintains semantic HTML structure
- Follows existing responsive pattern in component
- Zero JavaScript, pure CSS

**Alternatives Rejected**:
- Option B: Too invasive, risk of breaking existing responsive layouts
- Option C: Violates DRY principle, unnecessary complexity

---

## Phase 1: Design

### No Data Model Changes

This is a CSS-only fix. No entities, API contracts, or data changes required.

### Component Change Specification

**File**: `src/components/sections/FeaturedProject.astro`

**Change Location**: CSS `<style>` block, mobile media query section (around line 226)

**Current Mobile Styles** (lines 226-231):
```css
@media (max-width: 767px) {
  .featured-project__cta {
    width: 100%;
    justify-content: center;
  }
}
```

**Proposed Addition**:
```css
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
1. "Featured Project" label (order: 1)
2. Project title, description, meta-narrative, technologies, CTA (order: 2)
3. Preview image (order: 3)

**Tablet (768-1023px)**: Side-by-side layout (unchanged)
**Desktop (≥1024px)**: Side-by-side 60/40 layout (unchanged)

### Acceptance Criteria Mapping

| Requirement | Implementation |
|-------------|----------------|
| FR-001: Image displays correctly | ✅ Already working (verified image exists) |
| FR-002: Label and title visible position | ✅ CSS order places content before image on mobile |
| FR-003: Proper visual hierarchy | ✅ Text content prioritized on mobile |
| FR-004: Graceful image loading | ✅ Already implemented (aspect-ratio, background fallback) |
| FR-005: Responsive layout behavior | ✅ Only mobile affected, tablet/desktop unchanged |

### Testing Checklist

1. **Mobile (<768px)**
   - [ ] "Featured Project" label appears first
   - [ ] Project title "AI-BOARD" appears before image
   - [ ] Image appears after all text content
   - [ ] CTA button spans full width

2. **Tablet (768-1023px)**
   - [ ] Side-by-side layout unchanged
   - [ ] 50/50 split maintained
   - [ ] Label positioned absolutely

3. **Desktop (≥1024px)**
   - [ ] Side-by-side layout unchanged
   - [ ] 60/40 split maintained
   - [ ] Label positioned absolutely

4. **Accessibility**
   - [ ] Focus order matches visual order
   - [ ] Screen reader order is logical
   - [ ] Reduced motion preference respected

5. **Performance**
   - [ ] No CLS regression (verify <0.1)
   - [ ] No JavaScript added
   - [ ] Build completes successfully

---

## Constitution Check (Post-Design)

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Performance First | ✅ PASS | CSS-only, 0 bytes JavaScript added, no layout shift impact |
| II. Quality & Accessibility | ✅ PASS | Improves hierarchy, maintains semantic HTML, focus order preserved |
| III. Build & Deployment | ✅ PASS | Single file change, build time unaffected |
| IV. Developer Experience | ✅ PASS | Clear, documented CSS change following existing patterns |
| V. Content & SEO Excellence | ✅ PASS | No content changes, DOM structure unchanged for SEO |
| VI. Tooling & Runtime | ✅ PASS | Standard Astro component edit |

**Final Gate Status**: ✅ PASS - Ready for task generation.

---

## Next Steps

Run `/speckit.tasks` to generate implementation tasks based on this plan.
