# Color Palette Guide

## Overview

This portfolio uses a comprehensive, accessible color palette based on Catppuccin Mocha with violet/rose theme accents. All colors are defined as CSS custom properties for consistency and maintainability.

## Color Token Reference

### Base Colors

- `--color-background`: Primary page background (#1e1e2e - Catppuccin Mocha Base)
- `--color-surface`: Elevated surfaces like cards and panels (#313244 - Surface0)
- `--color-surface-elevated`: Higher elevation elements like modals (#45475a - Surface1)
- `--color-surface-overlay`: Overlay backgrounds (#585b70 - Surface2)

### Text Colors

- `--color-text`: Primary body text (#cdd6f4 - 12.23:1 contrast ratio ✅)
- `--color-text-secondary`: Secondary text, captions, labels (#bac2de - 9.82:1 ✅)
- `--color-text-muted`: Muted text, placeholders (#a6adc8 - 7.45:1 ✅)
- `--color-text-overlay`: Very muted, disabled text (#9399b2 - 5.23:1 ✅)

### Accent Colors

- `--color-primary`: Primary brand color - Violet (#cba6f7 - Mauve)
- `--color-secondary`: Secondary brand color - Rose/Pink (#f5c2e7)
- `--color-accent`: Tertiary accent - Lavender (#b4befe)

### Semantic Colors

- `--color-success`: Success states (#a6e3a1 - Green)
- `--color-warning`: Warning states (#f9e2af - Yellow)
- `--color-error`: Error states (#f38ba8 - Red)
- `--color-info`: Informational states (#89b4fa - Blue)

### Interaction States

All accent and semantic colors have corresponding state variants:

- `{base}-hover`: Lightness -6% (darker on hover)
- `{base}-focus`: Lavender outline for keyboard navigation
- `{base}-active`: Lightness -11% (even darker when pressed)
- `{base}-disabled`: Saturation -44%, appears grayed out

### Borders

- `--color-border`: Default subtle borders
- `--color-border-elevated`: Emphasized borders
- `--color-border-focus`: Focus indicator borders (lavender)

## Usage Guidelines

### Always Use Color Tokens

❌ **Don't** use hard-coded colors:
```css
.button {
  background-color: #cba6f7;
}
```

✅ **Do** use CSS custom properties:
```css
.button {
  background-color: var(--color-primary);
}
```

### Include All Interaction States

Every interactive element should have:
- Default state
- `:hover` state
- `:focus-visible` state (for keyboard navigation)
- `:active` state (pressed/clicked)
- `:disabled` state (if applicable)

### Use the Transition Variable

Always use `var(--transition-color)` for color transitions to respect user motion preferences:

```css
.button {
  background-color: var(--color-primary);
  transition: background-color var(--transition-color);
}
```

This automatically becomes instant (0.01s) when users enable reduced motion.

## Accessibility

All color combinations have been verified to meet WCAG 2.1 AA standards:
- Text: Minimum 4.5:1 contrast ratio
- UI Components: Minimum 3.0:1 contrast ratio
- Focus indicators: Visible and distinct

### Contrast Ratios

See `src/styles/theme.css` for documented contrast ratios for each color pair.

## Examples

### Button Component

```astro
<style>
  .btn {
    background-color: var(--color-primary);
    color: var(--color-background);
    transition: background-color var(--transition-color);
  }

  .btn:hover {
    background-color: var(--color-primary-hover);
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-primary-focus);
    outline-offset: 2px;
  }

  .btn:active {
    background-color: var(--color-primary-active);
  }

  .btn:disabled {
    background-color: var(--color-primary-disabled);
    cursor: not-allowed;
  }
</style>
```

### Link Styling

```css
a {
  color: var(--color-primary);
  transition: color var(--transition-color);
}

a:hover {
  color: var(--color-primary-hover);
}

a:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
}
```

### Card Component

```css
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.card-title {
  color: var(--color-text);
}

.card-subtitle {
  color: var(--color-text-secondary);
}
```

## Implementation Details

- **Location**: `src/styles/theme.css`
- **Import**: Automatically loaded via `global.css`
- **Scope**: Available globally on all pages
- **Performance**: 0KB JavaScript, ~8KB CSS
- **Browser Support**: All modern browsers (HSL format has 98%+ support)

## References

- [Feature Specification](../specs/002-1506-palette-couleur/spec.md)
- [Quickstart Guide](../specs/002-1506-palette-couleur/quickstart.md)
- [Catppuccin Mocha Palette](https://catppuccin.com/palette)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
