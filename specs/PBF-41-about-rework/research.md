# Research: About Section Rework

**Feature**: PBF-41-about-rework
**Date**: 2025-12-20
**Status**: Complete

## Research Summary

This is a straightforward visual refactoring with no significant technical unknowns. All changes operate within the existing TUI architecture.

## Findings

### 1. TUI Section Configuration

**Decision**: Modify `TUI_SECTIONS` in `src/data/sections.ts`

**Rationale**: The `TUI_SECTIONS` array is the single source of truth for:
- `fileName`: Used by `FileEntry` component in sidebar explorer
- `displayName`: Used by `generateBufferTabs()` for buffer tab labels

Changing `fileName` from `"about.tsx"` to `"about.md"` automatically updates:
- Sidebar explorer file entry
- Any other component consuming `TUI_SECTIONS`

**Alternatives Considered**:
- Hardcoding values in individual components → Rejected (violates DRY, harder to maintain)
- Creating separate config for About → Rejected (unnecessary complexity for single change)

### 2. Buffer Tab Label Source

**Decision**: Modify `generateBufferTabs()` to use `fileName` instead of `displayName` for the label

**Rationale**: Currently `generateBufferTabs()` returns `label: section.displayName` which produces "About". The spec requires the buffer tab to show `about.md` to match the explorer sidebar.

**Alternatives Considered**:
- Adding new property to TUI_SECTIONS → Rejected (adds complexity when existing field suffices)
- Keeping displayName for tabs → Rejected (conflicts with spec requirement for consistency)

### 3. AboutReadme Component Cleanup

**Decision**: Remove header element and border styling from `AboutReadme.astro`

**Rationale**: The component currently includes:
- `.tui-readme__header` div with fake "README.md" filename
- Border on `.tui-readme__content` with `border: 1px solid` and `border-radius`

Removing these creates the "reading a raw markdown file" aesthetic requested in the spec.

**Alternatives Considered**:
- Hiding via CSS only → Rejected (dead HTML remains in DOM)
- Creating variant component → Rejected (over-engineering for single use case)

## Dependencies

No new dependencies required. Changes use existing:
- Astro component system
- TypeScript interfaces (`TuiSection`, `BufferTab`)
- CSS custom properties for styling

## Performance Impact

**Positive**: Removing HTML elements (header div) and CSS (border styles) reduces:
- DOM node count (minor)
- CSS rule complexity (minor)

No performance regressions expected.

## Accessibility Considerations

- Semantic structure preserved (headings, lists)
- No decorative header means fewer elements for screen readers to navigate
- Focus management unaffected
- WCAG compliance maintained
