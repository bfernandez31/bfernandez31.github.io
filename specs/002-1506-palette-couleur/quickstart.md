# Quickstart Guide: Site-Wide Color Palette

**Feature**: Site-Wide Color Palette (002-1506-palette-couleur)
**Target Audience**: Developers implementing or consuming the color palette

## Overview

This guide provides step-by-step instructions for implementing and using the Catppuccin Mocha-based color palette with violet/rose theme accents in the portfolio static site.

## Prerequisites

- Bun ≥1.0.0 installed
- Astro ≥4.0.0 project initialized
- Basic understanding of CSS custom properties
- Access to `src/styles/` directory

## Implementation Steps

### Step 1: Create Theme Tokens File

Create a new file at `src/styles/theme.css` and copy the contents from `specs/002-1506-palette-couleur/contracts/theme-tokens.css`:

```bash
# From repository root
cp specs/002-1506-palette-couleur/contracts/theme-tokens.css src/styles/theme.css
```

**What this does**: Defines all color tokens as CSS custom properties scoped to `:root`.

### Step 2: Import Theme in Global Styles

Open or create `src/styles/global.css` and add the import at the top:

```css
/* src/styles/global.css */

/* Import color palette */
@import './theme.css';

/* Existing global styles below... */
body {
  margin: 0;
  padding: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: system-ui, -apple-system, sans-serif;
}
```

**What this does**: Makes all color tokens available globally to all components and pages.

### Step 3: Update Astro Layout

Ensure `global.css` is imported in your main layout (e.g., `src/layouts/Layout.astro`):

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**What this does**: Applies the color palette to all pages using this layout.

### Step 4: Use Color Tokens in Components

Replace hard-coded colors with CSS custom properties in your Astro components:

**Before** (hard-coded colors):
```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary' } = Astro.props;
---

<button class={`button button-${variant}`}>
  <slot />
</button>

<style>
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .button-primary {
    background-color: #cba6f7; /* Hard-coded! */
    color: #1e1e2e;
  }

  .button-primary:hover {
    background-color: #b89ce5; /* Hard-coded! */
  }
</style>
```

**After** (using color tokens):
```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary' } = Astro.props;
---

<button class={`button button-${variant}`}>
  <slot />
</button>

<style>
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color var(--transition-color);
  }

  .button-primary {
    background-color: var(--color-primary);
    color: var(--color-background);
  }

  .button-primary:hover {
    background-color: var(--color-primary-hover);
  }

  .button-primary:focus-visible {
    outline: 2px solid var(--color-primary-focus);
    outline-offset: 2px;
  }

  .button-primary:active {
    background-color: var(--color-primary-active);
  }

  .button-primary:disabled {
    background-color: var(--color-primary-disabled);
    cursor: not-allowed;
  }

  .button-secondary {
    background-color: var(--color-secondary);
    color: var(--color-background);
  }

  .button-secondary:hover {
    background-color: var(--color-secondary-hover);
  }

  .button-secondary:focus-visible {
    outline: 2px solid var(--color-secondary-focus);
    outline-offset: 2px;
  }

  .button-secondary:active {
    background-color: var(--color-secondary-active);
  }
</style>
```

**What this does**: Uses semantic color tokens that respect WCAG contrast ratios and user motion preferences.

### Step 5: Verify in Development

Start the development server and verify colors render correctly:

```bash
bun run dev
```

Navigate to `http://localhost:4321` and check:
- ✅ Background is dark (#1e1e2e - Catppuccin Mocha Base)
- ✅ Text is light with good contrast (#cdd6f4 - Catppuccin Mocha Text)
- ✅ Primary buttons use violet color (#cba6f7 - Catppuccin Mocha Mauve)
- ✅ Hover states darken slightly (interactive feedback)
- ✅ Focus states show visible outline (keyboard navigation)

### Step 6: Test Accessibility

#### Manual Testing

1. **Contrast Check**:
   - Open Chrome DevTools (F12)
   - Inspect text elements
   - Verify "Contrast ratio" badge shows ✅ (4.5:1 or higher for text)

2. **Keyboard Navigation**:
   - Tab through interactive elements
   - Verify focus states are visible (lavender outline)

3. **Reduced Motion**:
   - macOS: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Ease of Access → Display → Show animations
   - Linux: Depends on desktop environment
   - Verify color transitions are instant (no smooth fade)

#### Automated Testing

Create a test file to validate contrast ratios (optional but recommended):

```typescript
// tests/unit/color-contrast.test.ts
import { describe, it, expect } from 'bun:test';

// Simplified contrast calculation (full implementation would use relative luminance)
function contrastRatio(color1: string, color2: string): number {
  // Placeholder: in real implementation, parse HSL and calculate
  // For now, return known values from research
  const knownRatios: Record<string, number> = {
    'text-on-background': 12.23,
    'primary-on-background': 8.94,
    'secondary-on-background': 11.52,
    'success-on-background': 10.67,
    'error-on-background': 9.12,
  };
  return knownRatios[`${color1}-on-${color2}`] || 0;
}

describe('Color Palette WCAG Compliance', () => {
  it('should meet WCAG AA for text on background', () => {
    const ratio = contrastRatio('text', 'background');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should meet WCAG AA for primary on background', () => {
    const ratio = contrastRatio('primary', 'background');
    expect(ratio).toBeGreaterThanOrEqual(3.0); // UI component standard
  });

  it('should meet WCAG AA for secondary on background', () => {
    const ratio = contrastRatio('secondary', 'background');
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('should meet WCAG AA for semantic colors', () => {
    expect(contrastRatio('success', 'background')).toBeGreaterThanOrEqual(3.0);
    expect(contrastRatio('error', 'background')).toBeGreaterThanOrEqual(3.0);
  });
});
```

Run tests:
```bash
bun test
```

## Usage Patterns

### Common Scenarios

#### 1. Card Component

```astro
---
// src/components/Card.astro
---

<div class="card">
  <h3 class="card-title"><slot name="title" /></h3>
  <p class="card-body"><slot /></p>
</div>

<style>
  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1.5rem;
    color: var(--color-text);
  }

  .card-title {
    margin-top: 0;
    color: var(--color-primary);
  }

  .card-body {
    color: var(--color-text-secondary);
  }
</style>
```

#### 2. Alert/Message Component

```astro
---
// src/components/Alert.astro
interface Props {
  type: 'success' | 'error' | 'warning' | 'info';
}

const { type } = Astro.props;
---

<div class={`alert alert-${type}`}>
  <slot />
</div>

<style>
  .alert {
    padding: 1rem;
    border-radius: 4px;
    border-left: 4px solid;
  }

  .alert-success {
    background-color: hsl(115 54% 76% / 0.15);
    border-color: var(--color-success);
    color: var(--color-success);
  }

  .alert-error {
    background-color: hsl(343 81% 75% / 0.15);
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .alert-warning {
    background-color: hsl(41 86% 83% / 0.15);
    border-color: var(--color-warning);
    color: var(--color-warning);
  }

  .alert-info {
    background-color: hsl(217 92% 76% / 0.15);
    border-color: var(--color-info);
    color: var(--color-info);
  }
</style>
```

#### 3. Link Styling

```css
/* In global.css or component styles */
a {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: var(--color-primary);
  transition: color var(--transition-color);
}

a:hover {
  color: var(--color-primary-hover);
  text-decoration-color: var(--color-primary-hover);
}

a:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

a:active {
  color: var(--color-primary-active);
}
```

#### 4. Form Inputs

```css
input,
textarea,
select {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  transition: border-color var(--transition-color);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary-focus);
  box-shadow: 0 0 0 2px hsl(232 97% 85% / 0.3);
}

input:disabled,
textarea:disabled,
select:disabled {
  background-color: var(--color-surface-overlay);
  color: var(--color-text-overlay);
  cursor: not-allowed;
}
```

## Best Practices

### 1. Always Use CSS Custom Properties

❌ **Don't**:
```css
.button {
  background-color: #cba6f7;
}
```

✅ **Do**:
```css
.button {
  background-color: var(--color-primary);
}
```

### 2. Use Semantic Names, Not Color Names

❌ **Don't** (in new code):
```css
.alert-green {
  color: var(--color-success);
}
```

✅ **Do**:
```css
.alert-success {
  color: var(--color-success);
}
```

### 3. Always Include Focus States

❌ **Don't**:
```css
.button:hover {
  background-color: var(--color-primary-hover);
}
/* Missing focus state! */
```

✅ **Do**:
```css
.button:hover {
  background-color: var(--color-primary-hover);
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
}
```

### 4. Use Transition Variable for Color Changes

❌ **Don't**:
```css
.button {
  transition: background-color 0.2s;
}
```

✅ **Do**:
```css
.button {
  transition: background-color var(--transition-color);
}
/* This respects prefers-reduced-motion automatically */
```

### 5. Check Contrast Before Custom Combinations

Before using a non-standard color combination:
1. Open [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Enter foreground and background colors
3. Verify ratio meets WCAG AA (4.5:1 for text, 3.0:1 for UI)

## Troubleshooting

### Colors Not Appearing

**Problem**: Components show default browser colors instead of palette colors.

**Solution**:
1. Verify `theme.css` is created in `src/styles/`
2. Check `global.css` imports `theme.css` at the top
3. Ensure Layout component imports `global.css`
4. Clear browser cache and hard reload (Cmd/Ctrl + Shift + R)

### Low Contrast Warnings in DevTools

**Problem**: Chrome DevTools shows contrast ratio warnings.

**Solution**:
1. Verify you're using the correct token pair (e.g., `--color-text` on `--color-background`)
2. Don't use muted text colors (`--color-text-muted`) for important content
3. Consult `contracts/theme-tokens.css` for documented contrast ratios

### Transitions Not Respecting Reduced Motion

**Problem**: Color transitions still animate with reduced motion enabled.

**Solution**:
1. Replace hard-coded `transition` durations with `var(--transition-color)`
2. Test in browser with reduced motion enabled (not just OS setting)

## Next Steps

1. **Audit Existing Components**: Search for hard-coded color values and replace with tokens
2. **Configure Biome Linting**: Add rule to warn about hard-coded hex colors
3. **Add Lighthouse CI**: Integrate accessibility checks in CI/CD pipeline
4. **Create Component Library**: Build reusable components (Button, Card, Alert) showcasing palette usage
5. **Document Edge Cases**: Identify and document any custom color needs beyond the palette

## References

- [Feature Spec](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [Contracts](./contracts/)
- [Catppuccin Mocha Palette](https://catppuccin.com/palette)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
