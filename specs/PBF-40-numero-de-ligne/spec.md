# Quick Implementation: numero de ligne

**Feature Branch**: `PBF-40-numero-de-ligne`
**Created**: 2025-12-20
**Mode**: Quick Implementation (bypassing formal specification)

## Description

numero de ligne

## Implementation Notes

This feature is being implemented via quick-impl workflow, bypassing formal specification and planning phases.

**Quick-impl is suitable for**:
- Bug fixes (typos, minor logic corrections)
- UI tweaks (colors, spacing, text changes)
- Simple refactoring (renaming, file organization)
- Documentation updates

**For complex features**, use the full workflow: INBOX → SPECIFY → PLAN → BUILD

## Implementation

### Summary

Fixed line numbers to span the full height of scrollable content and synchronized scroll behavior between the gutter and content sections.

### Changes Made

1. **TuiLayout.astro**:
   - Added dynamic line number calculation based on section scroll height
   - Implemented scroll synchronization between gutter and active section
   - Line numbers now extend to cover all scrollable content
   - Added resize handler to recalculate line numbers on window resize

2. **layout.css**:
   - Enabled overflow-y scrolling on `.tui-content__gutter`
   - Hidden scrollbar for cleaner UI (`scrollbar-width: none`)
   - Maintained sync with content viewport

3. **LineNumbers.astro**:
   - Updated component documentation to reflect dynamic behavior

### Technical Details

- **Dynamic Line Count**: Calculates lines based on `scrollHeight / lineHeight` (18px standard)
- **Scroll Sync**: Uses `requestAnimationFrame` for smooth scroll synchronization
- **Performance**: Debounced with RAF to prevent excessive updates
- **Responsive**: Recalculates on section change and window resize

### Testing

- ✓ Type check passes (0 errors)
- ✓ Build succeeds
- ✓ Line numbers extend with scrollable content
- ✓ Scroll synchronization works correctly
