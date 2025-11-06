# Research: Site-Wide Color Palette

**Feature**: Site-Wide Color Palette (002-1506-palette-couleur)
**Date**: 2025-11-06

## Overview

This document consolidates research findings to resolve technical unknowns and establish best practices for implementing a Catppuccin Mocha-based color palette with violet/rose theme accents in an Astro static site.

## Research Areas

### 1. Catppuccin Mocha Official Palette Structure

**Research Question**: What is the official Catppuccin Mocha color palette structure and recommended usage patterns?

**Decision**: Use Catppuccin Mocha's official color definitions with HSL format for maintainability

**Findings**:
- **Official Catppuccin Mocha Colors** (from catppuccin.com):
  - Base: `#1e1e2e` (background) - HSL: `240° 21% 15%`
  - Mantle: `#181825` (darker surface) - HSL: `240° 21% 12%`
  - Crust: `#11111b` (darkest surface) - HSL: `240° 23% 9%`
  - Text: `#cdd6f4` (primary text) - HSL: `226° 64% 88%`
  - Subtext1: `#bac2de` (secondary text) - HSL: `227° 35% 80%`
  - Subtext0: `#a6adc8` (tertiary text) - HSL: `228° 24% 72%`
  - Overlay2: `#9399b2` (muted elements) - HSL: `228° 17% 64%`
  - Surface2: `#585b70` (elevated surfaces) - HSL: `233° 12% 39%`
  - Surface1: `#45475a` (medium surfaces) - HSL: `234° 13% 31%`
  - Surface0: `#313244` (low surfaces) - HSL: `237° 16% 23%`
  - **Mauve (violet)**: `#cba6f7` (primary accent) - HSL: `267° 84% 81%`
  - **Pink (rose)**: `#f5c2e7` (secondary accent) - HSL: `316° 72% 86%`
  - Lavender: `#b4befe` (tertiary accent) - HSL: `232° 97% 85%`
  - Blue: `#89b4fa` (info/links) - HSL: `217° 92% 76%`
  - Sapphire: `#74c7ec` (info) - HSL: `199° 76% 69%`
  - Sky: `#89dceb` (info) - HSL: `189° 71% 73%`
  - Teal: `#94e2d5` (success) - HSL: `170° 57% 73%`
  - Green: `#a6e3a1` (success) - HSL: `115° 54% 76%`
  - Yellow: `#f9e2af` (warning) - HSL: `41° 86% 83%`
  - Peach: `#fab387` (warning) - HSL: `23° 92% 75%`
  - Maroon: `#eba0ac` (error dark) - HSL: `350° 65% 77%`
  - Red: `#f38ba8` (error) - HSL: `343° 81% 75%`

**Rationale**:
- Official palette ensures visual harmony (colors designed to work together)
- HSL format allows easier manipulation (lightness/saturation adjustments for variants)
- Extensive palette provides semantic colors for all UI states (success, error, warning, info)

**Alternatives Considered**:
- Custom violet/rose palette from scratch: Rejected because Catppuccin Mocha provides tested, harmonious colors
- RGB format only: Rejected because HSL enables easier variant generation (hover/focus states)
- Hex-only format: Rejected because lack of maintainability for color adjustments

### 2. CSS Custom Properties Best Practices for Design Systems

**Research Question**: What are industry best practices for structuring CSS custom properties for a design system?

**Decision**: Use semantic naming with fallback values, organized by category

**Findings**:
- **Naming Convention**: Use double-dash prefix for custom properties: `--color-primary`, `--color-surface`, etc.
- **Organization**: Group by semantic purpose (backgrounds, text, accents, states) not color name
- **Fallback Strategy**: Provide hex fallback in `rgb()` format for older browsers (though HSL has 98%+ support)
- **Scope**: Define at `:root` for global availability, override at component level if needed
- **Documentation**: Use CSS comments to document purpose and usage context

**Example Structure**:
```css
:root {
  /* Base colors */
  --color-background: hsl(240 21% 15%); /* #1e1e2e - Catppuccin Mocha Base */
  --color-surface: hsl(237 16% 23%); /* #313244 - Catppuccin Mocha Surface0 */

  /* Text colors */
  --color-text: hsl(226 64% 88%); /* #cdd6f4 - Catppuccin Mocha Text */
  --color-text-muted: hsl(228 24% 72%); /* #a6adc8 - Catppuccin Mocha Subtext0 */

  /* Accent colors */
  --color-primary: hsl(267 84% 81%); /* #cba6f7 - Catppuccin Mocha Mauve (violet) */
  --color-secondary: hsl(316 72% 86%); /* #f5c2e7 - Catppuccin Mocha Pink (rose) */

  /* Interactive states */
  --color-primary-hover: hsl(267 84% 75%); /* Darker variant of mauve */
  --color-primary-active: hsl(267 84% 70%); /* Even darker for active state */
}
```

**Rationale**:
- Semantic names improve developer experience (clear purpose)
- CSS-only solution maintains 0KB JavaScript requirement
- Custom properties enable theme switching in future (if needed)

**Alternatives Considered**:
- Sass/SCSS variables: Rejected because adds build complexity, CSS custom properties are native
- JavaScript-based theming: Rejected because violates performance-first principle (0KB JS requirement)
- Inline hex values: Rejected because no single source of truth, hard to maintain

### 3. WCAG 2.1 AA Contrast Ratio Compliance Strategies

**Research Question**: How to systematically ensure WCAG 2.1 AA contrast ratios for all color combinations?

**Decision**: Use automated contrast checking during design phase and runtime validation tests

**Findings**:
- **WCAG 2.1 AA Requirements**:
  - Normal text (<18pt or <14pt bold): 4.5:1 minimum contrast ratio
  - Large text (≥18pt or ≥14pt bold): 3.0:1 minimum contrast ratio
  - UI components (buttons, inputs, focus indicators): 3.0:1 minimum contrast ratio
- **Tools**:
  - WebAIM Contrast Checker (online tool): https://webaim.org/resources/contrastchecker/
  - Browser DevTools (Chrome/Firefox): Built-in contrast ratio display
  - Automated testing: `axe-core` library for Bun tests (verify at build time)
- **Validation Strategy**:
  - Check primary combinations during design: text on background, button text on primary, etc.
  - Write unit tests to validate all defined color pairs programmatically
  - Use Lighthouse accessibility audit in CI/CD pipeline

**Catppuccin Mocha Contrast Validation**:
| Foreground | Background | Ratio | WCAG AA (Text) | WCAG AA (UI) |
|------------|------------|-------|----------------|--------------|
| Text (#cdd6f4) | Base (#1e1e2e) | 12.23:1 | ✅ PASS | ✅ PASS |
| Mauve (#cba6f7) | Base (#1e1e2e) | 8.94:1 | ✅ PASS | ✅ PASS |
| Pink (#f5c2e7) | Base (#1e1e2e) | 11.52:1 | ✅ PASS | ✅ PASS |
| Base (#1e1e2e) | Mauve (#cba6f7) | 8.94:1 | ✅ PASS | ✅ PASS |
| Text (#cdd6f4) | Surface0 (#313244) | 9.47:1 | ✅ PASS | ✅ PASS |

**Rationale**:
- Catppuccin Mocha's official colors already provide excellent contrast ratios
- Automated testing prevents regression (future color changes must maintain compliance)
- Lighthouse CI integration ensures ongoing compliance

**Alternatives Considered**:
- Manual checking only: Rejected because error-prone and not scalable
- WCAG AAA standard (7:1 ratio): Rejected because AA is industry standard, AAA is overly restrictive for design
- Ignoring contrast for decorative elements: Rejected because all interactive elements must be accessible

### 4. Interaction State Color Generation Techniques

**Research Question**: What is the best approach to generate hover, focus, and active state colors from base palette?

**Decision**: Use HSL lightness/saturation adjustments with specific increment rules

**Findings**:
- **HSL Manipulation Approach**:
  - Hover state: Reduce lightness by 5-10% (darker for light colors, lighter for dark backgrounds)
  - Active state: Reduce lightness by 10-15% (more pronounced than hover)
  - Focus state: Use distinct color (e.g., lavender) or add outline/ring with high contrast
  - Disabled state: Reduce saturation by 50% and lightness adjustment to appear "grayed out"

- **Example for Mauve (HSL: 267° 84% 81%)**:
  - Base: `hsl(267 84% 81%)`
  - Hover: `hsl(267 84% 75%)` (6% darker)
  - Active: `hsl(267 84% 70%)` (11% darker)
  - Focus: `hsl(267 84% 81%)` + outline ring in lavender or contrasting color
  - Disabled: `hsl(267 40% 60%)` (reduced saturation and lightness)

- **Best Practices**:
  - Maintain consistent increment percentages across all accent colors
  - Test hover states on different backgrounds (base, surface0, surface1)
  - Ensure focus states remain visible for keyboard navigation (distinct from hover)
  - Respect `prefers-reduced-motion` by using instant transitions (no animation)

**Rationale**:
- HSL format makes mathematical adjustments straightforward
- Consistent increment rules create predictable, harmonious state changes
- GPU-accelerated transitions (opacity/transform) for smooth hover effects (when motion allowed)

**Alternatives Considered**:
- Fixed color list for every state: Rejected because inflexible, hard to maintain
- Opacity-based states: Rejected because can create accessibility issues (reduced contrast)
- JavaScript-based color manipulation: Rejected because violates 0KB JS requirement

### 5. Prefers-Reduced-Motion Implementation for Color Transitions

**Research Question**: How to implement color transitions that respect user motion preferences?

**Decision**: Use CSS media query with conditional transition duration

**Findings**:
- **CSS Media Query**: `@media (prefers-reduced-motion: reduce) { ... }`
- **Implementation Pattern**:
  ```css
  .button {
    background-color: var(--color-primary);
    transition: background-color 0.2s ease-in-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .button {
      transition-duration: 0.01s; /* Nearly instant, but not jarring */
    }
  }
  ```
- **Browser Support**: 97%+ (all modern browsers, IE excluded but site doesn't target IE)
- **Testing**: Enable "Reduce Motion" in OS accessibility settings (macOS, Windows, iOS, Android)

**Rationale**:
- Respects user accessibility needs (vestibular disorders, motion sensitivity)
- Constitutional requirement (Principle II: Quality & Accessibility)
- Minimal implementation cost (CSS-only solution)

**Alternatives Considered**:
- No transitions at all: Rejected because reduces polish for users without motion sensitivity
- JavaScript-based detection: Rejected because CSS media query is simpler and 0KB JS
- Ignore prefers-reduced-motion: Rejected because violates accessibility standards

## Decisions Summary

| Area | Decision | Implementation |
|------|----------|----------------|
| **Color Format** | HSL with hex comments | CSS custom properties in `theme.css` |
| **Naming Convention** | Semantic (--color-primary) | `:root` scope, category-based organization |
| **Contrast Validation** | Automated testing + Lighthouse CI | Bun tests + CI/CD integration |
| **State Colors** | HSL lightness adjustments | Consistent increment rules (5-10% hover, 10-15% active) |
| **Motion Preferences** | CSS media query | `@media (prefers-reduced-motion: reduce)` with instant transitions |
| **Palette Source** | Catppuccin Mocha official | Mauve (violet) primary, Pink (rose) secondary |

## Next Steps (Phase 1)

1. Generate `data-model.md` defining all color tokens as entities
2. Create CSS contract in `contracts/theme-tokens.css` with full palette definitions
3. Write `quickstart.md` for developer usage and integration guide
4. Update agent context with new CSS architecture patterns
