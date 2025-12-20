# Research: Fix Explorer Visibility on Desktop

**Feature**: PBF-33-fix-explorer
**Date**: 2025-12-20
**Status**: Complete

## Executive Summary

The TUI sidebar (explorer) is not visible on desktop because component-scoped CSS in `TuiLayout.astro` overrides the global grid layout from `layout.css`, omitting the critical `grid-template-columns` property needed to allocate space for the sidebar.

## Root Cause Analysis

### Problem Statement

User report: "Quand l'explorer est ouvert on ne voit pas le contenu. Pour mobile ok par contre ne devrais pas etre le cas sur desktop"

Translation: When the explorer is open, the content is not visible. Mobile works fine, but this should not happen on desktop.

### CSS Cascade Conflict

**Two competing `.tui-layout` definitions:**

1. **layout.css (lines 17-32)** - Correct grid with sidebar column:
```css
.tui-layout {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  grid-template-columns: minmax(200px, 250px) 1fr;  /* ← SIDEBAR + CONTENT */
  grid-template-areas:
    "topbar  topbar"
    "sidebar content"
    "status  status"
    "cmdline cmdline";
  /* ... */
}
```

2. **TuiLayout.astro (lines 97-106)** - Missing grid columns:
```css
.tui-layout {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  /* ❌ MISSING: grid-template-columns */
  /* ❌ MISSING: grid-template-areas */
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  /* ... */
}
```

### Why This Happens

1. Astro component-scoped styles are injected **after** global CSS in the document head
2. Scoped styles have equal specificity (both target `.tui-layout`)
3. CSS cascade rule: later declarations win when specificity is equal
4. Result: `TuiLayout.astro` styles override `layout.css` styles
5. Without `grid-template-columns`, CSS Grid defaults to `1fr` (single column)
6. Sidebar has no allocated column space → content fills entire grid → sidebar invisible

### Flex Container Mismatch

Additionally, `TuiLayout.astro` wraps sidebar and content in a flex `.tui-main` container:
```css
.tui-main {
  display: flex;
  overflow: hidden;
  min-height: 0;
}
```

This bypasses the grid area system defined in `layout.css`:
```css
.tui-sidebar { grid-area: sidebar; }
.tui-content { grid-area: content; }
```

The flex container works on mobile (where sidebar is hidden/overlaid), but conflicts with the grid-based side-by-side layout expected on desktop.

## Solution Design

### Decision: Remove Conflicting Scoped Styles

**Chosen approach**: Remove redundant `.tui-layout` and `.tui-main` styles from `TuiLayout.astro` to allow `layout.css` grid to take effect.

**Rationale**:
- `layout.css` already has the correct, tested grid layout
- Removing duplication reduces CSS maintenance burden
- Single source of truth for TUI grid structure
- No new code needed - just removal of conflicting code

**Alternatives considered**:

| Alternative | Why Rejected |
|-------------|--------------|
| Add grid columns to TuiLayout.astro | Creates duplication, harder to maintain |
| Move all grid to TuiLayout.astro | Breaks separation of concerns, duplicates mobile/tablet logic |
| Use `!important` in layout.css | Anti-pattern, makes future changes harder |
| Increase specificity in layout.css | Adds complexity, fragile solution |

### Specific Changes Required

**File**: `src/components/layout/TuiLayout.astro`

Remove or modify these scoped style rules:

1. **Remove** `.tui-layout` grid properties (lines 97-106):
   - `display: grid` (conflicts with layout.css)
   - `grid-template-rows` (duplicates layout.css)
   - Keep: `height: 100vh/100dvh`, `overflow: hidden`, `background-color`, `color`, `font-family`

2. **Remove** `.tui-main` flex properties (lines 108-112):
   - Delete entire `.tui-main` rule block
   - Grid areas from layout.css will handle sidebar/content positioning

3. **Remove** `.tui-content` flex properties (lines 114-118):
   - Delete flex rules from scoped styles
   - layout.css `.tui-content` rule (lines 58-64) will apply

4. **Keep** the following scoped styles (component-specific):
   - `.tui-content__gutter` styling
   - `.tui-content__viewport` styling
   - `.tui-sidebar-overlay` styling
   - `.tui-skip-link` styling
   - Responsive media queries that don't conflict

### Breakpoint Behavior

After fix:

| Viewport | Expected Behavior | Source |
|----------|-------------------|--------|
| Mobile (<768px) | Sidebar hidden, overlay on toggle | layout.css lines 157-194 |
| Tablet (768-1023px) | Collapsible sidebar, auto-width grid | layout.css lines 197-213 |
| Desktop (≥1024px) | Always-visible 250px sidebar + content | layout.css lines 216-220 |

## Verification Plan

### Visual Checks

1. **Desktop (1024px+)**: Sidebar and content visible side-by-side
2. **Tablet (768-1023px)**: Collapsible sidebar works with toggle
3. **Mobile (<768px)**: Overlay sidebar slides from left
4. **Breakpoint boundaries**: Smooth transitions at 768px and 1024px
5. **Wide viewports (2560px+)**: Layout remains proportional

### Regression Tests

1. Sidebar file navigation still works
2. Section scrolling with sidebar visible
3. Status line and command line remain at bottom
4. Top bar tabs synchronize with sidebar
5. Mobile toggle button shows/hides correctly

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaks mobile layout | Low | High | Test all breakpoints before merge |
| CSS specificity edge cases | Low | Medium | Check browser dev tools for cascade |
| Animation timing affected | Low | Low | Verify sidebar transitions still work |

## Conclusion

The fix is straightforward: remove conflicting scoped styles from `TuiLayout.astro` to let the correct grid layout from `layout.css` take effect. This is a low-risk CSS fix with no JavaScript changes required.
