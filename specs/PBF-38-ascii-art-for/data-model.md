# Data Model: ASCII Art for Hero Section

**Feature**: PBF-38-ascii-art-for
**Date**: 2025-12-20

## Overview

This feature modifies static UI components - no database entities or persistent storage involved. The data model describes the component structure and configuration for the ASCII art display.

## Entities

### 1. ASCII Art Block

Static content element containing pre-formatted text.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `content` | `string` | Multi-line ASCII art text | Required, monospace characters only |
| `ariaLabel` | `string` | Screen reader accessible name | Required, "Benoit Fernandez" |
| `width` | `number` | Character width | 76 characters (stacked layout) |
| `height` | `number` | Line count | 14 lines (6 + 1 blank + 6 + 1 blank) |

### 2. HeroTui Props (Modified)

Current component props with ASCII art addition:

| Field | Type | Default | Change |
|-------|------|---------|--------|
| `headline` | `string` | Required | **DEPRECATED** - Replaced by ASCII art |
| `subheadline` | `string?` | Optional | Unchanged - retains typewriter |
| `typingSpeed` | `number` | 12.5 | Unchanged - applies to subheadline only |
| `ctaText` | `string` | "Explore Projects" | Unchanged |
| `ctaLink` | `string` | "#projects" | Unchanged |
| `asciiArtName` | `string` | Required | **NEW** - ASCII art content |

**Note**: The `headline` prop becomes a fallback/accessibility label while `asciiArtName` contains the visual ASCII art.

## State Transitions

N/A - This feature involves static content only. No state management required.

## Validation Rules

### ASCII Art Content

1. **Character Set**: Only Unicode box-drawing (U+2500-257F), block elements (U+2580-259F), and spaces
2. **Line Length**: All lines must be ≤ 76 characters for mobile compatibility
3. **Line Count**: Standard ANSI Shadow font produces 6 lines per word + blank line separators

### Responsive Behavior

| Viewport | Font Size | Max Width | Behavior |
|----------|-----------|-----------|----------|
| < 320px | 0.3rem | 218px | `overflow-x: auto` fallback |
| 320-767px | 0.3rem | 218px | Fits within container |
| 768-1023px | clamp() | ~291px | Smooth scaling |
| ≥ 1024px | 0.5rem | 365px | Full size display |

## CSS Design Tokens

### Required Tokens (existing)

```css
--font-mono: "JetBrains Mono", monospace
--color-primary: #cba6f7
--color-text: #cdd6f4
```

### New Component Styles

```css
.tui-hero__ascii {
  font-family: var(--font-mono, monospace);
  font-size: clamp(0.3rem, 0.8vw, 0.5rem);
  line-height: 1.2;
  color: var(--color-primary, #cba6f7);
  margin: 0 0 1rem;
  overflow-x: auto;
  user-select: none;
  -webkit-user-select: none;
}
```

## ASCII Art Content

### Stacked Layout (Recommended)

```
██████╗ ███████╗███╗   ██╗ ██████╗ ██╗████████╗
██╔══██╗██╔════╝████╗  ██║██╔═══██╗██║╚══██╔══╝
██████╔╝█████╗  ██╔██╗ ██║██║   ██║██║   ██║
██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║██║   ██║
██████╔╝███████╗██║ ╚████║╚██████╔╝██║   ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝

███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗
██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝╚══███╔╝
█████╗  █████╗  ██████╔╝██╔██╗ ██║███████║██╔██╗ ██║██║  ██║█████╗    ███╔╝
██╔══╝  ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝   ███╔╝
██║     ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝
```

**Metrics**:
- Width: 76 characters
- Height: 14 lines (including blank line separator)
- Font: ANSI Shadow (FIGlet)
- Character set: Unicode box-drawing + block elements

## Component Relationships

```
HeroTui.astro
├── <h1> (semantic wrapper, visually hidden or styled)
│   └── <pre class="tui-hero__ascii" aria-label="Benoit Fernandez">
│       └── [ASCII art content]
├── <p class="tui-hero__subheadline"> (unchanged, with typewriter)
│   └── TypewriterText animation
└── <a class="tui-hero__cta"> (unchanged)
```

## Accessibility Mapping

| Visual Element | ARIA Role | Screen Reader Announces |
|---------------|-----------|------------------------|
| ASCII Art `<pre>` | decorative | "Benoit Fernandez" (via aria-label) |
| Subheadline | paragraph | Full text content |
| CTA Button | link | Button text + destination |
