# Data Model: Portfolio with TUI Aesthetic

**Feature Branch**: `PBF-32-portofolio-with-tui`
**Created**: 2025-12-19
**Phase**: 1 (Design)

This document defines the data entities, relationships, and validation rules for the TUI-aesthetic portfolio feature.

---

## Entity Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TUI Portfolio Data Model                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐         │
│  │   Section    │──────▶│  BufferTab   │       │ StatusLine   │         │
│  │              │       │              │       │    State     │         │
│  └──────────────┘       └──────────────┘       └──────────────┘         │
│         │                      │                      ▲                  │
│         │                      │                      │                  │
│         ▼                      ▼                      │                  │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐         │
│  │  FileEntry   │       │ CommandLine  │       │  TopBarState │         │
│  │              │       │              │       │              │         │
│  └──────────────┘       └──────────────┘       └──────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Entities

### 1. Section

Represents a portfolio section displayed as a navigable "file" in the TUI layout.

```typescript
/**
 * Portfolio section with TUI file metaphor
 * Location: src/types/tui.ts
 */
export interface Section {
  /** Unique section identifier (used for hash navigation) */
  id: SectionId;

  /** Display name shown in sidebar and tabs */
  displayName: string;

  /** Simulated file name (e.g., "hero.tsx") */
  fileName: string;

  /** Nerd Font icon unicode character */
  icon: string;

  /** Display order in sidebar (1-based) */
  order: number;

  /** TUI styling type for this section */
  styleType: SectionStyleType;
}

/**
 * Valid section identifiers
 */
export type SectionId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'projects'
  | 'expertise'
  | 'contact';

/**
 * TUI styling type determining visual treatment
 */
export type SectionStyleType =
  | 'typing'        // Hero: typing animation
  | 'readme'        // About: markdown README style
  | 'git-log'       // Experience: git log style
  | 'telescope'     // Projects: fzf/telescope style
  | 'checkhealth'   // Expertise: :checkhealth style
  | 'terminal';     // Contact: terminal command style
```

**Validation Rules**:
- `id` must be unique and match a valid `SectionId`
- `fileName` must end with `.tsx` extension
- `order` must be positive integer (1-6)
- `icon` must be valid Nerd Font unicode character

**Default Data**:
```typescript
export const SECTIONS: Section[] = [
  { id: 'hero', displayName: 'Hero', fileName: 'hero.tsx', icon: '\uf0a2', order: 1, styleType: 'typing' },
  { id: 'about', displayName: 'About', fileName: 'about.tsx', icon: '\uf0a2', order: 2, styleType: 'readme' },
  { id: 'experience', displayName: 'Experience', fileName: 'experience.tsx', icon: '\uf0a2', order: 3, styleType: 'git-log' },
  { id: 'projects', displayName: 'Projects', fileName: 'projects.tsx', icon: '\uf0a2', order: 4, styleType: 'telescope' },
  { id: 'expertise', displayName: 'Expertise', fileName: 'expertise.tsx', icon: '\uf0a2', order: 5, styleType: 'checkhealth' },
  { id: 'contact', displayName: 'Contact', fileName: 'contact.tsx', icon: '\uf01ea', order: 6, styleType: 'terminal' },
];
```

---

### 2. BufferTab

Represents a navigation tab in the tmux-style top bar.

```typescript
/**
 * Buffer tab for top bar navigation
 * Location: src/types/tui.ts
 */
export interface BufferTab {
  /** Reference to section this tab navigates to */
  sectionId: SectionId;

  /** Display label for the tab */
  label: string;

  /** Window number (tmux-style: 1, 2, 3...) */
  windowNumber: number;

  /** Whether this tab is currently active */
  isActive: boolean;
}
```

**Validation Rules**:
- `sectionId` must reference valid section
- `windowNumber` must be positive integer
- Only one tab can have `isActive: true` at a time

**State Transitions**:
```
┌─────────┐     click/navigate     ┌─────────┐
│ inactive│────────────────────────▶│  active │
└─────────┘                         └─────────┘
     ▲                                   │
     │       scroll to other section     │
     └───────────────────────────────────┘
```

---

### 3. FileEntry

Represents a file entry in the NvimTree-style sidebar.

```typescript
/**
 * Sidebar file entry
 * Location: src/types/tui.ts
 */
export interface FileEntry {
  /** Reference to section */
  sectionId: SectionId;

  /** File name displayed in sidebar */
  fileName: string;

  /** Nerd Font icon for file type */
  icon: string;

  /** Nesting level (0 for flat list per spec Decision 2) */
  level: 0;

  /** Whether this file is currently selected */
  isActive: boolean;

  /** Whether file is expanded (future: for directories) */
  isExpanded?: boolean;
}
```

**Validation Rules**:
- `level` is always `0` (flat list per spec Decision 2)
- `fileName` matches corresponding `Section.fileName`
- Only one entry can have `isActive: true` at a time

---

### 4. StatusLineState

Represents the Neovim-style statusline state.

```typescript
/**
 * Neovim statusline state
 * Location: src/types/tui.ts
 */
export interface StatusLineState {
  /** Vim mode indicator (always NORMAL per spec) */
  mode: VimMode;

  /** Currently active file name */
  activeFile: string;

  /** Current line number (decorative) */
  line: number;

  /** Current column number (decorative) */
  column: number;

  /** File type indicator */
  fileType: string;

  /** Git branch name (static per spec Decision 6) */
  gitBranch: string;
}

/**
 * Vim mode type (limited per spec Decision 3)
 */
export type VimMode = 'NORMAL';
```

**Validation Rules**:
- `mode` is always `'NORMAL'` (decorative only)
- `activeFile` matches currently visible section's `fileName`
- `line` and `column` are positive integers
- `gitBranch` defaults to `'main'` (static per spec Decision 6)

**State Updates**:
```
Section Change → StatusLineState Update
  └── activeFile = newSection.fileName
  └── line = 1 (reset to top)
  └── column = 1 (reset)
```

---

### 5. CommandLine

Represents the decorative command line at bottom of viewport.

```typescript
/**
 * Decorative command line
 * Location: src/types/tui.ts
 */
export interface CommandLine {
  /** Command prompt character */
  prompt: ':';

  /** Displayed command content */
  content: string;

  /** Whether command line is visible */
  isVisible: boolean;
}
```

**Validation Rules**:
- `prompt` is always `':'` (vim command mode style)
- `content` is decorative text (e.g., `"e hero.tsx"`)
- Updates when navigation occurs

**State Transitions**:
```
Navigation Event:
  └── content = `e ${newSection.fileName}`
  └── Brief display, then fade or remain
```

---

### 6. TopBarState

Represents the tmux-style top bar state.

```typescript
/**
 * tmux-style top bar state
 * Location: src/types/tui.ts
 */
export interface TopBarState {
  /** Array of buffer tabs */
  tabs: BufferTab[];

  /** Current time display (HH:MM format) */
  clock: string;

  /** Git branch display (static per spec) */
  gitBranch: string;

  /** Session name (decorative) */
  sessionName: string;
}
```

**Validation Rules**:
- `tabs` array has exactly 6 entries (one per section)
- `clock` is formatted as `HH:MM` (24-hour)
- `gitBranch` is static `'main'` per spec

---

## State Management

### Active Section Tracking

```typescript
/**
 * TUI navigation state
 * Location: src/types/tui.ts
 */
export interface TuiNavigationState {
  /** Currently active section ID */
  activeSectionId: SectionId;

  /** Previous section (for back navigation) */
  previousSectionId: SectionId | null;

  /** Whether sidebar is visible (responsive) */
  isSidebarVisible: boolean;

  /** Whether sidebar is collapsed on mobile */
  isSidebarCollapsed: boolean;
}
```

### State Sync Rules

When active section changes:

1. **Sidebar** → Update `FileEntry.isActive` for matching section
2. **TopBar** → Update `BufferTab.isActive` for matching section
3. **StatusLine** → Update `activeFile`, reset `line`/`column`
4. **CommandLine** → Update `content` to `:e {fileName}`
5. **URL** → Update hash to `#{sectionId}`

```
User Action (click sidebar/tab, scroll)
    │
    ▼
┌────────────────────────────────────────┐
│     Determine New Active Section       │
│  (IntersectionObserver or click target) │
└────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────┐
│         Update Navigation State         │
│  activeSectionId = newSectionId         │
└────────────────────────────────────────┘
    │
    ├───────────────┬───────────────┬──────────────┬──────────────┐
    ▼               ▼               ▼              ▼              ▼
 Sidebar         TopBar        StatusLine     CommandLine       URL
 FileEntry       BufferTab     activeFile     content         hash
 isActive        isActive      line=1         ":e file"       #id
```

---

## Responsive States

### Sidebar Visibility States

```typescript
/**
 * Sidebar visibility based on viewport
 */
export type SidebarState =
  | 'visible'      // Desktop (≥1024px): Always visible
  | 'collapsible'  // Tablet (768-1023px): Toggle button
  | 'hidden';      // Mobile (<768px): Hidden by default, full overlay when open
```

### Breakpoint Configuration

```typescript
/**
 * Responsive breakpoints for TUI layout
 * Location: src/types/tui.ts
 */
export const TUI_BREAKPOINTS = {
  mobile: 768,     // <768px: Sidebar hidden
  tablet: 1024,    // 768-1023px: Sidebar collapsible
  desktop: 1024,   // ≥1024px: Sidebar always visible
} as const;
```

---

## Animation States

### Typing Animation State

```typescript
/**
 * Hero typing animation state
 * Location: src/types/tui.ts
 */
export interface TypingAnimationState {
  /** Full text to be typed */
  fullText: string;

  /** Currently visible text (partial during animation) */
  visibleText: string;

  /** Animation phase */
  phase: TypingPhase;

  /** Cursor blink state */
  cursorVisible: boolean;
}

export type TypingPhase =
  | 'idle'      // Not started
  | 'typing'    // Character-by-character reveal
  | 'complete'  // All text visible, cursor blinking
  | 'reduced';  // prefers-reduced-motion: instant reveal
```

---

## Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TUI Data Flow                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐                                                          │
│   │   Section    │ ◀─── Static configuration (src/data/sections.ts)         │
│   │   (6 items)  │                                                          │
│   └──────┬───────┘                                                          │
│          │                                                                   │
│          │ generates                                                         │
│          ▼                                                                   │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  FileEntry   │      │  BufferTab   │      │ StatusLine   │             │
│   │  (Sidebar)   │      │  (TopBar)    │      │   State      │             │
│   └──────┬───────┘      └──────┬───────┘      └──────┬───────┘             │
│          │                     │                     │                      │
│          └─────────────────────┼─────────────────────┘                      │
│                                │                                             │
│                     ┌──────────▼──────────┐                                 │
│                     │ TuiNavigationState  │ ◀─── Reactive state             │
│                     │  activeSectionId    │      (updated on scroll/click)  │
│                     └──────────┬──────────┘                                 │
│                                │                                             │
│                                │ syncs                                       │
│                                ▼                                             │
│                     ┌─────────────────────┐                                 │
│                     │    CommandLine      │                                 │
│                     │  (":e filename")    │                                 │
│                     └─────────────────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Integration with Existing Data

### Experience Data (Existing)

```typescript
// src/types/experience.ts (existing, unchanged)
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | 'Present';
  description: string[];
  technologies: string[];
}
```

**TUI Integration**: Experience data is rendered using `git-log` style type.

### Skills Data (Existing)

```typescript
// src/data/skills.json (existing, unchanged)
interface Skill {
  name: string;
  category: string;
  yearsExperience: number;
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
}
```

**TUI Integration**: Skills rendered using `checkhealth` style type with progress bars.

### Navigation Data (Existing, Modify)

```typescript
// src/data/navigation.ts (modify for TUI)
export interface NavigationLink {
  href: string;           // "#hero", "#about", etc.
  targetSectionId: string;
  label: string;
  displayOrder: number;

  // NEW: TUI-specific fields
  fileName: string;       // "hero.tsx"
  icon: string;          // Nerd Font icon
  styleType: SectionStyleType;
}
```

---

## Validation Schema (Zod)

```typescript
// src/types/tui.ts
import { z } from 'zod';

export const SectionIdSchema = z.enum([
  'hero', 'about', 'experience', 'projects', 'expertise', 'contact'
]);

export const SectionStyleTypeSchema = z.enum([
  'typing', 'readme', 'git-log', 'telescope', 'checkhealth', 'terminal'
]);

export const SectionSchema = z.object({
  id: SectionIdSchema,
  displayName: z.string().min(1).max(50),
  fileName: z.string().regex(/\.tsx$/),
  icon: z.string().min(1),
  order: z.number().int().positive().max(6),
  styleType: SectionStyleTypeSchema,
});

export const StatusLineStateSchema = z.object({
  mode: z.literal('NORMAL'),
  activeFile: z.string().regex(/\.tsx$/),
  line: z.number().int().positive(),
  column: z.number().int().positive(),
  fileType: z.string(),
  gitBranch: z.string().default('main'),
});

export const TuiNavigationStateSchema = z.object({
  activeSectionId: SectionIdSchema,
  previousSectionId: SectionIdSchema.nullable(),
  isSidebarVisible: z.boolean(),
  isSidebarCollapsed: z.boolean(),
});
```

---

## Summary

| Entity | Purpose | State Type | Persistence |
|--------|---------|------------|-------------|
| Section | Portfolio section configuration | Static | `src/data/sections.ts` |
| BufferTab | Top bar navigation tabs | Derived from Section | In-memory |
| FileEntry | Sidebar file list | Derived from Section | In-memory |
| StatusLineState | Statusline display | Reactive | In-memory |
| CommandLine | Command line display | Reactive | In-memory |
| TopBarState | Top bar composite state | Reactive | In-memory |
| TuiNavigationState | Active section tracking | Reactive | In-memory + URL hash |
| TypingAnimationState | Hero animation state | Reactive | In-memory |

**Key Design Decisions**:
- Static `Section` configuration drives all derived states
- Reactive state synced across components via IntersectionObserver + event handlers
- URL hash reflects active section for deep linking
- Mobile responsiveness handled via `SidebarState` enum
