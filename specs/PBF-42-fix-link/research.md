# Research: Fix Navigation Links (PBF-42)

**Date**: 2025-12-21
**Feature Branch**: `PBF-42-fix-link`

## Research Tasks

### 1. Navigation Handler Pattern (from PBF-37)

**Question**: How did commit `ff275e8` (PBF-37) fix the blank screen issue for sidebar/tabs?

**Findings**:
- Changed from GSAP-based animations to pure CSS transitions
- Applied `is-active` and `is-previous` CSS classes to control section visibility
- Added `background-color: var(--color-background)` to prevent content bleed-through
- Critical fix: Mark ALL sections before target as `is-previous` (not just immediately previous)
- Navigation handler in `setupClickHandlers()` only registered for `.tui-file-entry` and `.tui-buffer-tab`

**Decision**: Apply same pattern to CTA buttons and internal hash links
**Rationale**: Proven fix pattern, maintains consistency, no new dependencies
**Alternatives Considered**:
1. Custom GSAP-based animation for CTAs - Rejected (more complex, already removed GSAP from navigation)
2. Event delegation on document - Rejected (less explicit, harder to debug)

### 2. CTA Button Implementation

**Question**: How are CTA buttons currently implemented and why don't they work?

**Findings** (from `src/components/sections/HeroTui.astro:61-64`):
```html
<a href={ctaLink} class="tui-hero__cta">
  <span class="tui-hero__cta-icon" aria-hidden="true">$</span>
  {ctaText}
</a>
```

Default `ctaLink = "#projects"` - plain browser anchor navigation.

**Root Cause**:
1. No `data-section-id` attribute on the element
2. Not matched by `.tui-file-entry` or `.tui-buffer-tab` selector
3. Browser handles as native hash navigation → triggers `popstate` → but no animation state sync
4. CSS classes (`is-active`, `is-previous`) never applied → blank screen

**Decision**: Two approaches available:
- **Option A**: Add `data-section-id` to CTA and add `.tui-hero__cta` to selector in `setupClickHandlers()`
- **Option B**: Create generic internal link handler that matches any `a[href^="#"]`

**Chosen**: **Option B** (generic handler)
**Rationale**:
- More maintainable - automatically works for any future internal links
- Single point of change in navigation script
- Aligns with FR-001: "register click handlers for ALL internal navigation links"

### 3. Internal Link Detection Pattern

**Question**: Best practice for detecting and handling internal hash links?

**Findings**:
- Selector `a[href^="#"]` matches all anchor links starting with `#`
- Need to exclude skip links and other non-section anchors
- Can validate against `SECTION_IDS` array at runtime

**Decision**: Use selector `a[href^="#"]:not(.tui-skip-link)` combined with runtime validation
**Rationale**: Explicit exclusion of skip links, runtime validation ensures only valid sections trigger navigation
**Alternatives Considered**:
1. Explicit class like `.tui-nav-link` on all internal links - Rejected (requires modifying every component)
2. Data attribute `data-navigate="true"` - Rejected (same issue)

### 4. Edge Cases Analysis

**Question**: What edge cases need handling?

**Findings**:
1. **Link to current section**: Already handled in `navigateToSection()` - returns early if `sectionId === currentSectionId`
2. **Invalid section ID**: Filter against `SECTION_IDS` array before calling `navigateToSection()`
3. **External links**: `a[href^="#"]` won't match external URLs
4. **Same-page anchors to non-sections**: (e.g., `#footnote`) - Filter against `SECTION_IDS`
5. **Skip link**: Excluded by `:not(.tui-skip-link)` selector
6. **Browser history**: Current `popstate` handler already works once classes are properly applied

**Decision**: No additional edge case handling needed beyond SECTION_IDS validation
**Rationale**: Existing navigation infrastructure handles all cases

### 5. Graceful Degradation

**Question**: How does navigation work if JavaScript fails to load?

**Findings**:
- Current: CTA links use `href="#projects"` - browser hash navigation works
- Problem: On desktop, CSS positions sections with `translateX(100%)` - hash navigation doesn't apply classes
- Solution: `<noscript>` fallback or CSS-only initial state

**Current Behavior** (from `layout.css`):
- `:first-child` rule ensures hero shows initially
- With JS disabled, all sections remain in default state (hidden to right)
- Only hero visible, other sections inaccessible without JS

**Decision**: Accept current graceful degradation (hero-only without JS)
**Rationale**:
- Portfolio is inherently interactive (animations, typewriter effects)
- Hero contains essential info and external links
- Progressive enhancement is satisfied: basic content available, JS adds navigation
- Matches FR-007: "links should still navigate via native browser hash behavior"

## Summary

| Topic | Decision | Confidence |
|-------|----------|------------|
| Handler Pattern | Extend `setupClickHandlers()` with generic `a[href^="#"]` selector | High |
| Section ID Extraction | Parse from `href` attribute, e.g., `href.substring(1)` | High |
| Validation | Check against `SECTION_IDS` array before navigation | High |
| Skip Link Exclusion | Use `:not(.tui-skip-link)` in selector | High |
| Graceful Degradation | Accept hero-only display without JS | Medium |

## Implementation Approach

**Minimal Change Strategy** (2 locations):

1. **`src/scripts/tui-navigation.ts`** - Modify `setupClickHandlers()`:
   ```typescript
   // Add generic internal link handler
   const internalLinks = document.querySelectorAll<HTMLAnchorElement>(
     'a[href^="#"]:not(.tui-skip-link):not(.tui-file-entry):not(.tui-buffer-tab)'
   );
   internalLinks.forEach((link) => {
     link.addEventListener("click", handleInternalLinkClick);
   });
   ```

2. **New handler function** `handleInternalLinkClick()`:
   ```typescript
   function handleInternalLinkClick(event: Event): void {
     event.preventDefault();
     const target = event.currentTarget as HTMLAnchorElement;
     const href = target.getAttribute("href");
     if (!href) return;

     const sectionId = href.substring(1) as SectionId;
     if (SECTION_IDS.includes(sectionId)) {
       navigateToSection(sectionId, "click");
     }
   }
   ```

No changes needed to `HeroTui.astro` - the generic handler will work with existing `href="#projects"`.
