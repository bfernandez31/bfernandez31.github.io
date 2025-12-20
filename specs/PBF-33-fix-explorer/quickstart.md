# Quickstart: Fix Explorer Visibility on Desktop

**Feature**: PBF-33-fix-explorer
**Estimated Time**: 15 minutes

## Problem Summary

The TUI sidebar (explorer) is invisible on desktop because component-scoped CSS in `TuiLayout.astro` overrides the global grid layout.

## Quick Fix

### Step 1: Open the File

```bash
code src/components/layout/TuiLayout.astro
```

### Step 2: Modify the `<style>` Block (lines 96-189)

**Remove** the following CSS rules from the scoped `<style>` block:

```css
/* REMOVE these lines (97-106): */
.tui-layout {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  /* ... other properties ... */
}

/* REMOVE these lines (108-112): */
.tui-main {
  display: flex;
  overflow: hidden;
  min-height: 0;
}

/* REMOVE these lines (114-118): */
.tui-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
```

**Keep** only these scoped styles:

```css
<style>
  /* Keep viewport sizing only - no grid/flex overrides */
  .tui-layout {
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    background-color: var(--color-background, #1e1e2e);
    color: var(--color-text, #cdd6f4);
    font-family: var(--font-mono, monospace);
  }

  /* Keep content sub-components */
  .tui-content__gutter { /* ... existing styles ... */ }
  .tui-content__viewport { /* ... existing styles ... */ }

  /* Keep overlay and accessibility */
  .tui-sidebar-overlay { /* ... existing styles ... */ }
  .tui-skip-link { /* ... existing styles ... */ }

  /* Keep media queries for content gutter */
  @media (max-width: 767px) { /* ... */ }
  @media (prefers-reduced-motion: reduce) { /* ... */ }
</style>
```

### Step 3: Verify the Fix

```bash
# Start dev server
bun run dev

# Test in browser at http://localhost:4321
# Resize browser to verify:
# - Desktop (≥1024px): Sidebar + content side-by-side
# - Tablet (768-1023px): Collapsible sidebar
# - Mobile (<768px): Hidden sidebar with toggle
```

### Step 4: Run Build

```bash
bun run build
bun run preview
```

## Verification Checklist

- [ ] Desktop (1024px+): Sidebar and content visible side-by-side
- [ ] Sidebar width is 250px on desktop
- [ ] Content fills remaining horizontal space
- [ ] Clicking sidebar files scrolls to sections
- [ ] Tablet (768-1023px): Toggle button collapses/expands sidebar
- [ ] Mobile (<768px): Sidebar slides from left on toggle
- [ ] No CSS errors in browser console
- [ ] Build completes without errors

## Troubleshooting

### Sidebar still hidden?

Check browser DevTools → Elements → Computed styles for `.tui-layout`:
- `grid-template-columns` should be `minmax(200px, 250px) 1fr`
- If missing, scoped styles are still overriding

### Content overlaps sidebar?

Check that `.tui-content` has `grid-area: content` from layout.css
- Should NOT have `flex: 1` from scoped styles

### Mobile broken after fix?

Ensure you kept the `@media (max-width: 767px)` queries
- layout.css handles mobile sidebar positioning
