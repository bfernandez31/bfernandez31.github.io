# Data Model: TUI Layout Grid System

**Feature**: PBF-33-fix-explorer
**Date**: 2025-12-20

## Overview

This feature involves CSS layout entities, not database models. The "data model" represents the CSS Grid structure and its relationships.

## Entity: TUI Layout Grid

The TUI layout uses CSS Grid to organize the interface components.

### Grid Structure

```
┌─────────────────────────────────────────────────────────┐
│                      TOPBAR                             │  auto height
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│   SIDEBAR     │              CONTENT                    │  1fr (flex)
│  200-250px    │            (remaining)                  │
│               │                                         │
├───────────────┴─────────────────────────────────────────┤
│                      STATUS                             │  auto height
├─────────────────────────────────────────────────────────┤
│                     CMDLINE                             │  auto height
└─────────────────────────────────────────────────────────┘
```

### Grid Definition (CSS)

```css
.tui-layout {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  grid-template-columns: minmax(200px, 250px) 1fr;
  grid-template-areas:
    "topbar  topbar"
    "sidebar content"
    "status  status"
    "cmdline cmdline";
}
```

## Entity Relationships

### Grid Areas → Components

| Grid Area | Component | File | Relationship |
|-----------|-----------|------|--------------|
| `topbar` | TopBar.astro | src/components/layout/TopBar.astro | 1:1 |
| `sidebar` | Sidebar.astro | src/components/layout/Sidebar.astro | 1:1 |
| `content` | main#main-content | TuiLayout.astro | 1:1 |
| `status` | StatusLine.astro | src/components/layout/StatusLine.astro | 1:1 |
| `cmdline` | CommandLine.astro | src/components/layout/CommandLine.astro | 1:1 |

### CSS File → Component Mapping

| CSS File | Scopes | Priority |
|----------|--------|----------|
| src/styles/tui/layout.css | Global TUI grid | Lower (loaded first) |
| TuiLayout.astro `<style>` | Component-scoped | Higher (loaded last) |

## Validation Rules

### Desktop Layout (≥1024px)

| Property | Required Value | Validation |
|----------|----------------|------------|
| `grid-template-columns` | `minmax(200px, 250px) 1fr` | Must define 2 columns |
| Sidebar visibility | `display: block` (not none) | Always visible |
| Sidebar width | `250px` | Fixed width on desktop |
| Content overflow | `visible` or `auto` | Must not clip content |

### Tablet Layout (768-1023px)

| Property | Required Value | Validation |
|----------|----------------|------------|
| `grid-template-columns` | `auto 1fr` | Sidebar width adjustable |
| Sidebar collapsed | `width: 0; opacity: 0` when `.is-collapsed` | Toggle-able |

### Mobile Layout (<768px)

| Property | Required Value | Validation |
|----------|----------------|------------|
| `grid-template-columns` | `1fr` | Single column |
| Sidebar display | `display: none` by default | Hidden until toggled |
| Sidebar position | `position: fixed` when `.is-open` | Overlay behavior |

## State Transitions

### Sidebar Visibility States

```
Mobile:
  hidden ──[toggle]──► overlay (is-open) ──[toggle/click-outside]──► hidden

Tablet:
  visible ──[toggle]──► collapsed (is-collapsed) ──[toggle]──► visible

Desktop:
  always-visible (no state changes)
```

### CSS Class States

| Class | Element | Description |
|-------|---------|-------------|
| `.is-open` | `.tui-sidebar` | Sidebar visible as overlay (mobile) |
| `.is-collapsed` | `.tui-sidebar` | Sidebar collapsed to 0 width (tablet) |
| `.is-visible` | `.tui-sidebar-overlay` | Dark backdrop visible (mobile) |

## Conflict Resolution

### Current Conflict

```
layout.css:        grid-template-columns: minmax(200px, 250px) 1fr
TuiLayout.astro:   (not defined - uses CSS default: none)

Result: Single column grid, sidebar has no space allocation
```

### Required Resolution

```
Option A: Remove conflicting styles from TuiLayout.astro
          → layout.css grid takes effect

Option B: Copy grid definition to TuiLayout.astro
          → Duplication but explicit control
```

**Selected**: Option A (remove conflicting styles)
