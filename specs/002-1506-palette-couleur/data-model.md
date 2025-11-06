# Data Model: Site-Wide Color Palette

**Feature**: Site-Wide Color Palette (002-1506-palette-couleur)
**Date**: 2025-11-06

## Overview

This document defines the color palette data model as a collection of color tokens, categorized by semantic purpose. Each token represents a single color definition with validation rules and usage context.

## Entities

### 1. ColorToken

**Description**: A named color definition with semantic meaning, HSL value, hex equivalent, and usage context.

**Attributes**:
- `name` (string, required): Semantic CSS custom property name (e.g., `--color-primary`)
- `hslValue` (HSLColor, required): Color in HSL format for maintainability
- `hexValue` (string, required): Hex equivalent for documentation/reference (e.g., `#cba6f7`)
- `category` (ColorCategory, required): Semantic grouping (base, text, accent, state, semantic)
- `usage` (string, required): Description of where/how to use this color
- `contrastPairs` (array of ColorToken references, optional): Other tokens this color is commonly paired with
- `wcagCompliant` (boolean, required): Whether this token meets WCAG 2.1 AA when used as specified

**Example**:
```json
{
  "name": "--color-primary",
  "hslValue": { "h": 267, "s": 84, "l": 81 },
  "hexValue": "#cba6f7",
  "category": "accent",
  "usage": "Primary action buttons, prominent CTAs, active navigation items",
  "contrastPairs": ["--color-background", "--color-surface"],
  "wcagCompliant": true
}
```

### 2. HSLColor

**Description**: Color representation in HSL (Hue, Saturation, Lightness) format for mathematical manipulation.

**Attributes**:
- `h` (number, required): Hue in degrees (0-360)
- `s` (number, required): Saturation percentage (0-100)
- `l` (number, required): Lightness percentage (0-100)

**Validation Rules**:
- `h` must be within 0-360 range
- `s` must be within 0-100 range
- `l` must be within 0-100 range

**Example**:
```json
{
  "h": 267,
  "s": 84,
  "l": 81
}
```

### 3. ColorCategory

**Description**: Enumeration of semantic color groupings.

**Values**:
- `base`: Background and surface colors (e.g., `--color-background`, `--color-surface`)
- `text`: Text and foreground colors (e.g., `--color-text`, `--color-text-muted`)
- `accent`: Brand accent colors (e.g., `--color-primary`, `--color-secondary`)
- `state`: Interactive state variants (e.g., `--color-primary-hover`, `--color-primary-focus`)
- `semantic`: Purpose-specific colors (e.g., `--color-success`, `--color-error`, `--color-warning`)

### 4. InteractionState

**Description**: Variant of a base color used for interactive element states.

**Attributes**:
- `baseToken` (ColorToken reference, required): The base color this state derives from
- `state` (StateType, required): Type of interaction state (hover, focus, active, disabled)
- `token` (ColorToken, required): The color token for this specific state
- `transformation` (HSLTransformation, required): How the state color is derived from base

**Example**:
```json
{
  "baseToken": "--color-primary",
  "state": "hover",
  "token": {
    "name": "--color-primary-hover",
    "hslValue": { "h": 267, "s": 84, "l": 75 },
    "hexValue": "#b89ce5",
    "category": "state",
    "usage": "Hover state for primary buttons and interactive elements",
    "wcagCompliant": true
  },
  "transformation": {
    "operation": "lightnessAdjustment",
    "value": -6
  }
}
```

### 5. StateType

**Description**: Enumeration of interactive element states.

**Values**:
- `hover`: Mouse hover state
- `focus`: Keyboard focus state (for accessibility)
- `active`: Pressed/clicked state
- `disabled`: Non-interactive/disabled state

### 6. HSLTransformation

**Description**: Mathematical operation applied to derive state colors from base colors.

**Attributes**:
- `operation` (string, required): Type of transformation (e.g., "lightnessAdjustment", "saturationAdjustment")
- `value` (number, required): Amount to adjust (positive or negative)

**Example**:
```json
{
  "operation": "lightnessAdjustment",
  "value": -6
}
```

## Relationships

```
ColorToken (1) ---- (0..*) InteractionState
  └─ category: ColorCategory

InteractionState
  ├─ baseToken: ColorToken (reference)
  ├─ state: StateType
  ├─ token: ColorToken
  └─ transformation: HSLTransformation
```

**Description**:
- A `ColorToken` can have zero or more `InteractionState` variants (e.g., primary has hover, focus, active states)
- Each `InteractionState` references a base `ColorToken` and defines its own `ColorToken` for the state
- `HSLTransformation` describes how the state color is mathematically derived from the base

## Validation Rules

### ColorToken Validation
1. `name` must follow CSS custom property convention: `--color-{semantic-name}`
2. `hexValue` must be valid 6-character hex color with `#` prefix
3. `hslValue` must have all three components (h, s, l) within valid ranges
4. If `category` is "state", must be associated with a base `ColorToken` via `InteractionState`
5. `wcagCompliant` must be `true` for all tokens used in text/background or UI component contexts

### Contrast Validation
1. Any `ColorToken` in `text` category must achieve 4.5:1 contrast ratio against all `base` category tokens it's paired with
2. Any `ColorToken` in `accent` category must achieve 3.0:1 contrast ratio when used on `base` backgrounds
3. `state` category tokens must maintain same contrast ratios as their base tokens

### Consistency Rules
1. All state variants of a base color must use the same `HSLTransformation.operation` type
2. Hover states must have smaller `transformation.value` than active states (visual progression)
3. Disabled states must reduce saturation by at least 40% to appear "grayed out"

## State Transitions

**Not Applicable**: Color tokens are static CSS values. State changes are managed via CSS pseudo-classes (`:hover`, `:focus`, `:active`) and do not involve programmatic state machines.

## Example: Complete Color Token with States

**Base Token**: Primary Violet (Catppuccin Mocha Mauve)
```json
{
  "name": "--color-primary",
  "hslValue": { "h": 267, "s": 84, "l": 81 },
  "hexValue": "#cba6f7",
  "category": "accent",
  "usage": "Primary action buttons, prominent CTAs, active navigation items",
  "contrastPairs": ["--color-background", "--color-surface"],
  "wcagCompliant": true
}
```

**Derived States**:
1. **Hover State**:
   ```json
   {
     "baseToken": "--color-primary",
     "state": "hover",
     "token": {
       "name": "--color-primary-hover",
       "hslValue": { "h": 267, "s": 84, "l": 75 },
       "hexValue": "#b89ce5",
       "category": "state",
       "usage": "Hover state for primary buttons",
       "wcagCompliant": true
     },
     "transformation": { "operation": "lightnessAdjustment", "value": -6 }
   }
   ```

2. **Focus State**:
   ```json
   {
     "baseToken": "--color-primary",
     "state": "focus",
     "token": {
       "name": "--color-primary-focus",
       "hslValue": { "h": 232, "s": 97, "l": 85 },
       "hexValue": "#b4befe",
       "category": "state",
       "usage": "Focus ring/outline for primary buttons (uses Lavender for distinction)",
       "wcagCompliant": true
     },
     "transformation": { "operation": "distinctColor", "value": 0 }
   }
   ```

3. **Active State**:
   ```json
   {
     "baseToken": "--color-primary",
     "state": "active",
     "token": {
       "name": "--color-primary-active",
       "hslValue": { "h": 267, "s": 84, "l": 70 },
       "hexValue": "#a687d1",
       "category": "state",
       "usage": "Pressed/clicked state for primary buttons",
       "wcagCompliant": true
     },
     "transformation": { "operation": "lightnessAdjustment", "value": -11 }
   }
   ```

4. **Disabled State**:
   ```json
   {
     "baseToken": "--color-primary",
     "state": "disabled",
     "token": {
       "name": "--color-primary-disabled",
       "hslValue": { "h": 267, "s": 40, "l": 60 },
       "hexValue": "#7d6b9d",
       "category": "state",
       "usage": "Disabled state for primary buttons (grayed out)",
       "wcagCompliant": false
     },
     "transformation": { "operation": "saturationAdjustment", "value": -44 }
   }
   ```

## Complete Color Palette Inventory

### Base Colors (category: base)
- `--color-background`: Catppuccin Mocha Base (`#1e1e2e`, HSL: 240° 21% 15%)
- `--color-surface`: Catppuccin Mocha Surface0 (`#313244`, HSL: 237° 16% 23%)
- `--color-surface-elevated`: Catppuccin Mocha Surface1 (`#45475a`, HSL: 234° 13% 31%)
- `--color-surface-overlay`: Catppuccin Mocha Surface2 (`#585b70`, HSL: 233° 12% 39%)

### Text Colors (category: text)
- `--color-text`: Catppuccin Mocha Text (`#cdd6f4`, HSL: 226° 64% 88%)
- `--color-text-secondary`: Catppuccin Mocha Subtext1 (`#bac2de`, HSL: 227° 35% 80%)
- `--color-text-muted`: Catppuccin Mocha Subtext0 (`#a6adc8`, HSL: 228° 24% 72%)
- `--color-text-overlay`: Catppuccin Mocha Overlay2 (`#9399b2`, HSL: 228° 17% 64%)

### Accent Colors (category: accent)
- `--color-primary`: Catppuccin Mocha Mauve/Violet (`#cba6f7`, HSL: 267° 84% 81%)
- `--color-secondary`: Catppuccin Mocha Pink/Rose (`#f5c2e7`, HSL: 316° 72% 86%)
- `--color-accent`: Catppuccin Mocha Lavender (`#b4befe`, HSL: 232° 97% 85%)

### Semantic Colors (category: semantic)
- `--color-success`: Catppuccin Mocha Green (`#a6e3a1`, HSL: 115° 54% 76%)
- `--color-warning`: Catppuccin Mocha Yellow (`#f9e2af`, HSL: 41° 86% 83%)
- `--color-error`: Catppuccin Mocha Red (`#f38ba8`, HSL: 343° 81% 75%)
- `--color-info`: Catppuccin Mocha Blue (`#89b4fa`, HSL: 217° 92% 76%)

### Interaction State Colors (category: state)
Each accent and semantic color has corresponding state variants:
- `{base}-hover`: Lightness -6% adjustment
- `{base}-focus`: Distinct color (Lavender) or outline
- `{base}-active`: Lightness -11% adjustment
- `{base}-disabled`: Saturation -44%, Lightness -21% adjustment

**Total Token Count**: 30+ color tokens (4 base + 4 text + 3 accent + 4 semantic + 16+ state variants)
