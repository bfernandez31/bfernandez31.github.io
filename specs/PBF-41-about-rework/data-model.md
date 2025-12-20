# Data Model: About Section Rework

**Feature**: PBF-41-about-rework
**Date**: 2025-12-20

## Entities

This feature modifies existing data structures rather than introducing new entities.

### TuiSection (Modified)

**Location**: `src/types/tui.ts` (interface), `src/data/sections.ts` (data)

**Current State** (About entry):
```typescript
{
  id: "about",
  displayName: "About",
  fileName: "about.tsx",  // ← Change to "about.md"
  icon: "\uf0a2",
  order: 2,
  styleType: "readme",
  lineCount: 40,
}
```

**Target State**:
```typescript
{
  id: "about",
  displayName: "About",
  fileName: "about.md",   // ← Updated
  icon: "\uf0a2",
  order: 2,
  styleType: "readme",
  lineCount: 40,
}
```

**Validation Rules**:
- `fileName` must be non-empty string
- `fileName` should use appropriate file extension for content type (.md for markdown-style sections)

### BufferTab (Modified Usage)

**Location**: `src/types/tui.ts` (interface), `src/data/sections.ts` (generator)

**Current `generateBufferTabs()` Output**:
```typescript
{
  sectionId: "about",
  label: "About",        // ← Derived from displayName
  icon: "\uf0a2",
  windowNumber: 2,
  isActive: boolean,
  showClose: boolean,
}
```

**Target `generateBufferTabs()` Output**:
```typescript
{
  sectionId: "about",
  label: "about.md",     // ← Derived from fileName
  icon: "\uf0a2",
  windowNumber: 2,
  isActive: boolean,
  showClose: boolean,
}
```

**Validation Rules**:
- `label` must be non-empty string
- For consistency, `label` should match `fileName` in explorer

## Component Changes

### AboutReadme.astro

**Elements to Remove**:

1. **Header Section** (lines 22-26 in current component):
```html
<div class="tui-readme__header">
  <span class="tui-readme__icon" aria-hidden="true"></span>
  <span class="tui-readme__filename">README.md</span>
</div>
```

2. **Border Styles** (in `<style>` block):
```css
.tui-readme__content {
  /* Remove these properties: */
  border: 1px solid var(--color-surface-1, #313244);
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
}
```

3. **Header Styles** (in `<style>` block):
```css
.tui-readme__header { ... }
.tui-readme__icon { ... }
.tui-readme__filename { ... }
```

**Elements to Preserve**:
- Article semantic wrapper
- Title with markdown hash styling
- Section structure
- Paragraph and list formatting
- All responsive styles

## State Transitions

N/A - This feature does not involve state management. All changes are static configuration and styling.

## Relationships

```
TUI_SECTIONS
    │
    ├──► generateBufferTabs() ──► BufferTab[] ──► TopBar.astro
    │         └── label = section.fileName (NEW)
    │
    └──► generateFileEntries() ──► FileEntry[] ──► Sidebar.astro
              └── fileName = section.fileName (unchanged)
```

## Migration

No data migration required. Changes are:
1. Configuration update (sections.ts)
2. Template update (AboutReadme.astro)
3. Function update (generateBufferTabs)

All changes are backward-compatible within the build process.
