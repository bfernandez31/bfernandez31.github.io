# Color Palette Contracts

**Feature**: Site-Wide Color Palette (002-1506-palette-couleur)

## Overview

This directory contains the CSS contract definitions for the portfolio site's color palette. The contracts define the API surface for color usage throughout the application.

## Files

### `theme-tokens.css`

The primary contract file defining all color tokens as CSS custom properties.

**Structure**:
- **Base Colors**: Background and surface colors for page layout
- **Text Colors**: Foreground colors for content (primary, secondary, muted)
- **Accent Colors**: Brand colors (primary violet, secondary rose, accent lavender)
- **Semantic Colors**: Purpose-specific colors (success, warning, error, info)
- **State Colors**: Interactive state variants (hover, focus, active, disabled)
- **Border Colors**: Border and outline colors
- **Motion Preferences**: Transition timing variables respecting `prefers-reduced-motion`

**Usage**:
1. Import in `src/styles/global.css`:
   ```css
   @import './theme-tokens.css';
   ```
2. Reference colors via CSS custom properties:
   ```css
   .my-component {
     background-color: var(--color-surface);
     color: var(--color-text);
     border: 1px solid var(--color-border);
   }

   .my-button {
     background-color: var(--color-primary);
     transition: background-color var(--transition-color);
   }

   .my-button:hover {
     background-color: var(--color-primary-hover);
   }
   ```

## Contract Guarantees

### 1. WCAG 2.1 AA Compliance

All color combinations documented in `theme-tokens.css` are verified to meet WCAG 2.1 AA contrast ratio requirements:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3.0:1 minimum contrast ratio
- **UI components**: 3.0:1 minimum contrast ratio

Contrast ratios are documented inline as comments (e.g., `Contrast: 12.23:1 with --color-background ✅ WCAG AA`).

### 2. Semantic Naming

All tokens use semantic names (e.g., `--color-primary`, `--color-success`) rather than color names (e.g., `--color-violet`, `--color-green`). This ensures:
- Flexibility to change specific colors without renaming throughout codebase
- Clear intent when using colors (purpose over appearance)
- Easier theming in future (light mode, alternative themes)

### 3. State Consistency

All interactive state colors (hover, focus, active, disabled) follow consistent transformation rules:
- **Hover**: -6% lightness adjustment from base
- **Active**: -11% lightness adjustment from base
- **Focus**: Distinct color (lavender) for clear keyboard navigation
- **Disabled**: -44% saturation, -21% lightness for "grayed out" appearance

### 4. Motion Preferences

All color transitions respect the `prefers-reduced-motion` media query:
- **Default**: 0.2s ease-in-out transitions
- **Reduced Motion**: 0.01s transitions (nearly instant)

Use `var(--transition-color)` for all color transitions to automatically respect user preferences.

### 5. Source Attribution

All colors are sourced from the official Catppuccin Mocha palette. Hex equivalents are documented in comments for reference, but HSL format is used in actual CSS for maintainability and ease of creating variants.

## Validation

### Automated Testing

Contrast ratios MUST be validated via automated tests:
- Unit tests in `tests/unit/color-contrast.test.ts`
- Lighthouse CI accessibility audit in CI/CD pipeline

### Linting

Biome linter SHOULD be configured to enforce:
- No hard-coded hex/rgb color values in component files
- All colors MUST be referenced via `var(--color-*)`

Example Biome rule (planned):
```json
{
  "rules": {
    "style": {
      "noHexColors": "warn"
    }
  }
}
```

## Extension Guidelines

When adding new color tokens:

1. **Follow naming convention**: `--color-{category}-{variant}`
   - Categories: background, surface, text, primary, secondary, accent, success, warning, error, info
   - Variants: hover, focus, active, disabled

2. **Verify contrast ratios**: Use WebAIM Contrast Checker or browser DevTools

3. **Document inline**: Add JSDoc-style comments with:
   - Description of usage
   - Source (Catppuccin color name if applicable)
   - Hex equivalent for reference
   - Contrast ratio validation

4. **Add to data model**: Update `data-model.md` with new ColorToken entity

5. **Test**: Add test cases in `color-contrast.test.ts`

## References

- [Catppuccin Mocha Palette](https://catppuccin.com/palette)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-reduced-motion (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
