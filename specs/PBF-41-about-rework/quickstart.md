# Quickstart: About Section Rework

**Feature**: PBF-41-about-rework
**Estimated Changes**: 3 files

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and on `PBF-41-about-rework` branch

## Implementation Steps

### Step 1: Update TUI Section Configuration

**File**: `src/data/sections.ts`

Change the About section's `fileName` in `TUI_SECTIONS`:

```typescript
// Before
{
  id: "about",
  displayName: "About",
  fileName: "about.tsx",  // ← Current
  // ...
}

// After
{
  id: "about",
  displayName: "About",
  fileName: "about.md",   // ← Updated
  // ...
}
```

### Step 2: Update Buffer Tab Label Generation

**File**: `src/data/sections.ts`

Modify `generateBufferTabs()` to use `fileName` for the label:

```typescript
// Before
export function generateBufferTabs(activeSectionId: SectionId): BufferTab[] {
  return TUI_SECTIONS.map((section, index) => ({
    sectionId: section.id,
    label: section.displayName,  // ← Current
    // ...
  }));
}

// After
export function generateBufferTabs(activeSectionId: SectionId): BufferTab[] {
  return TUI_SECTIONS.map((section, index) => ({
    sectionId: section.id,
    label: section.fileName,     // ← Updated
    // ...
  }));
}
```

### Step 3: Remove Header and Border from AboutReadme

**File**: `src/components/sections/AboutReadme.astro`

1. **Remove the header div** from the template:
```html
<!-- DELETE THIS BLOCK -->
<div class="tui-readme__header">
  <span class="tui-readme__icon" aria-hidden="true"></span>
  <span class="tui-readme__filename">README.md</span>
</div>
```

2. **Remove border properties** from `.tui-readme__content`:
```css
/* Remove these lines */
border: 1px solid var(--color-surface-1, #313244);
border-top: none;
border-radius: 0 0 0.5rem 0.5rem;
```

3. **Remove header-related CSS rules**:
```css
/* DELETE these rule blocks */
.tui-readme__header { ... }
.tui-readme__icon { ... }
.tui-readme__filename { ... }
```

## Verification

```bash
# Start dev server
bun run dev

# Verify in browser at http://localhost:4321:
# 1. Sidebar explorer shows "about.md" (not "about.tsx")
# 2. Buffer tab shows "about.md" (not "About")
# 3. About section has no header bar or border
# 4. Markdown formatting (# headings, - bullets) still visible

# Run linting
bun run lint

# Build for production
bun run build
```

## Success Criteria Checklist

- [ ] Sidebar explorer displays `about.md` for About section
- [ ] Buffer tab displays `about.md` label for About section
- [ ] About section has no "README.md" header bar
- [ ] About section has no visible border
- [ ] Markdown formatting preserved (headings, bullets)
- [ ] All other sections unaffected
- [ ] Build completes without errors
- [ ] Lint passes
