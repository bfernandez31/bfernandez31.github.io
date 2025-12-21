# Quickstart: Fix Navigation Links (PBF-42)

**Branch**: `PBF-42-fix-link`
**Estimated Effort**: ~30 minutes (bug fix)

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and on `PBF-42-fix-link` branch

## Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
# Site available at http://localhost:4321
```

## Issue Reproduction

1. Open http://localhost:4321 in browser (desktop viewport ≥1024px)
2. Click "Explore Projects" button in hero section
3. **Expected**: Projects section slides into view with content visible
4. **Actual**: Blank screen (CSS classes not applied)

## Implementation Steps

### Step 1: Add Internal Link Handler (tui-navigation.ts)

Location: `src/scripts/tui-navigation.ts`

After the existing `setupClickHandlers()` function (lines 236-250), add a new handler for internal links:

```typescript
// In setupClickHandlers() function, after buffer tabs handler:

// Internal hash links (CTAs, back links, etc.)
const internalLinks = document.querySelectorAll<HTMLAnchorElement>(
  'a[href^="#"]:not(.tui-skip-link):not(.tui-file-entry):not(.tui-buffer-tab)'
);
internalLinks.forEach((link) => {
  link.addEventListener("click", handleInternalLinkClick);
});
```

### Step 2: Add Handler Function

Add new function before `setupClickHandlers()`:

```typescript
/**
 * Handle click on internal hash link
 */
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

## Verification

### Manual Testing

1. **Hero CTA**: Click "Explore Projects" → Projects section displays correctly
2. **Back navigation**: Navigate to projects, use any link to return → No blank screen
3. **Sidebar**: Click sidebar entries → Still works (regression check)
4. **Buffer tabs**: Click tabs in top bar → Still works (regression check)
5. **Keyboard**: Use j/k keys → Still works (regression check)
6. **Scroll**: Scroll on desktop → Section changes correctly (regression check)
7. **Mobile**: Resize to mobile viewport → Scroll navigation works

### Automated Testing

```bash
# Run unit tests
bun test

# Run linting
bun run lint
```

## Build & Verify

```bash
# Build for production
bun run build

# Preview production build
bun run preview
# Test navigation in production build
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CTA still not working | Selector not matching | Check for typos in selector string |
| Sidebar broken | Wrong selector exclusion | Verify `:not(.tui-file-entry)` in selector |
| No visual transition | CSS classes not applied | Verify `navigateToSection()` is called |
| Console errors | Missing type cast | Ensure `as SectionId` after `substring(1)` |

## Files Changed

- `src/scripts/tui-navigation.ts` - Add internal link handler (~15 lines)

## Success Criteria

From spec.md:
- [x] SC-001: All CTA buttons navigate to target sections with 100% content visible
- [x] SC-002: Zero blank screens when navigating via any button or link
- [x] SC-003: Navigation via buttons identical to sidebar/tabs
- [x] SC-004: Existing navigation methods continue working
- [x] SC-005: Users can navigate to any section and return without issues
