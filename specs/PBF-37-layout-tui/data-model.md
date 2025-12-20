# Data Model: TUI Layout Redesign

**Feature Branch**: `PBF-37-layout-tui`
**Date**: 2025-12-20

## Overview

This feature is a frontend-only UI redesign. There is no backend data storage or API.
All state is client-side and ephemeral (navigation state, animation state).

---

## Entities

### 1. Section (Buffer)

Represents a full-viewport content area corresponding to a single "file" tab.

```typescript
// src/types/tui.ts (existing, to be extended)

export type SectionId = 'hero' | 'about' | 'experience' | 'projects' | 'expertise' | 'contact';

export interface Section {
  /** Unique section identifier */
  id: SectionId;
  /** Display label for tab (e.g., "hero.tsx") */
  fileName: string;
  /** File icon (Nerd Font character or fallback) */
  icon: string;
  /** Window number for tab display (1-6) */
  windowNumber: number;
  /** Line count for per-section line numbers */
  lineCount: number;
}
```

**Validation Rules**:
- `id` must be one of the 6 valid SectionId values
- `windowNumber` must be 1-6, unique per section
- `lineCount` must be positive integer (decorative, typically 20-50)

**Source**: `src/data/sections.ts`

---

### 2. BufferTab

Visual tab element in the top bar representing a section.

```typescript
// src/types/tui.ts (new interface)

export interface BufferTab {
  /** Associated section ID */
  sectionId: SectionId;
  /** Display label (e.g., "hero.tsx") */
  label: string;
  /** File icon character */
  icon: string;
  /** Window number (tmux-style: 1, 2, 3...) */
  windowNumber: number;
  /** Whether this tab is currently active */
  isActive: boolean;
  /** Show close button (only when active) */
  showClose: boolean;
}
```

**State Transitions**:
- `isActive: false` → `isActive: true` (tab clicked, keyboard nav, scroll)
- `isActive: true` → `isActive: false` (another tab activated)

---

### 3. NavigationState

Client-side state for managing section navigation and animations.

```typescript
// src/types/tui.ts (new interface)

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type AnimationState = 'idle' | 'animating';
export type NavigationSource = 'click' | 'keyboard' | 'scroll' | 'history';

export interface NavigationState {
  /** Currently active section */
  currentSectionId: SectionId;
  /** Index of current section (0-5) */
  currentIndex: number;
  /** Previous section (for slide direction) */
  previousSectionId: SectionId | null;
  /** Current viewport mode (determines animation type) */
  viewportMode: ViewportMode;
  /** Animation state */
  animationState: AnimationState;
  /** What triggered the navigation */
  lastNavigationSource: NavigationSource;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}
```

**State Transitions**:

```
                     ┌────────────────┐
                     │     idle       │
                     └───────┬────────┘
                             │
        tab click / keypress / hash change
                             │
                             ▼
                     ┌────────────────┐
                     │   animating    │
                     └───────┬────────┘
                             │
            animation complete / cancelled
                             │
                             ▼
                     ┌────────────────┐
                     │     idle       │
                     └────────────────┘
```

**Viewport Mode Rules**:
- `desktop`: >= 1024px → Horizontal slide animation
- `tablet`: 768px - 1023px → Horizontal slide animation
- `mobile`: < 768px → Vertical scroll (no slide)

---

### 4. LineNumbersConfig

Per-section line number configuration.

```typescript
// src/types/tui.ts (new interface)

export interface LineNumbersConfig {
  /** Section this config applies to */
  sectionId: SectionId;
  /** Starting line number (always 1 per spec) */
  startLine: 1;
  /** Total line count for display */
  lineCount: number;
  /** Currently highlighted line (optional) */
  highlightLine?: number;
}
```

**Default Line Counts per Section**:
| Section | Default lineCount | Rationale |
|---------|-------------------|-----------|
| hero | 15 | Compact intro |
| about | 40 | README-style content |
| experience | 60 | Git log entries |
| projects | 50 | Telescope results |
| expertise | 35 | Checkhealth output |
| contact | 25 | Terminal commands |

---

## Relationships

```
┌─────────────────┐
│     Section     │
│ (6 instances)   │
└────────┬────────┘
         │
         │ 1:1
         │
         ▼
┌─────────────────┐
│   BufferTab     │
│ (in TopBar)     │
└────────┬────────┘
         │
         │ many:1
         │
         ▼
┌─────────────────┐
│ NavigationState │
│ (singleton)     │
└────────┬────────┘
         │
         │ 1:many
         │
         ▼
┌─────────────────────┐
│ LineNumbersConfig   │
│ (per section)       │
└─────────────────────┘
```

---

## Data Sources

All data is defined statically at build time:

| Entity | Source File | Format |
|--------|-------------|--------|
| Section definitions | `src/data/sections.ts` | TypeScript |
| BufferTab props | Generated from sections | Runtime |
| NavigationState | `src/scripts/tui-navigation.ts` | Runtime (in-memory) |
| LineNumbersConfig | Component props | Build time |

---

## No Persistent Storage

This feature has:
- No database requirements
- No API endpoints
- No localStorage/sessionStorage usage
- URL hash is the only persistent state (browser history)

All state is reconstructed from:
1. URL hash (`#section-id`) on page load
2. Viewport width on resize
3. Media query for reduced motion preference
