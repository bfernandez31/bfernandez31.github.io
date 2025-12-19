# Research: Hero Section Redesign

**Feature**: PBF-30-hero-section
**Date**: 2025-12-19
**Status**: Complete

## Research Tasks

### 1. Current Implementation Analysis

**Task**: Analyze existing hero section implementation to understand what needs to be removed/changed.

**Findings**:

#### Files to Delete (src/scripts/hero/)
| File | Lines | Size | Purpose |
|------|-------|------|---------|
| hero-controller.ts | 474 | ~15KB | Main orchestrator for all hero animations |
| background-3d.ts | 375 | ~12KB | OGL WebGL 3D background renderer |
| cursor-tracker.ts | 120 | ~4KB | Cursor position tracking for parallax |
| typography-reveal.ts | 121 | ~4KB | GSAP timeline for text reveal animations |
| performance-monitor.ts | 134 | ~4KB | FPS monitoring and degradation logic |
| types.ts | 57 | ~2KB | TypeScript interfaces and re-exports |
| **Total** | **1,281** | **~48KB** | |

#### Current Hero.astro Structure
- WebGL canvas element (`#hero-canvas`)
- Fallback gradient div (`.hero__fallback`)
- Content wrapper with animation states
- h1 headline with `glitch-effect` class
- Scroll indicator at bottom
- ~35 line script block initializing animations

#### Dependencies to Remove
- `ogl: ^1.0.11` (~24KB minified) - Only used by background-3d.ts
- Total bundle savings: ~30KB (OGL + hero modules)

**Decision**: Remove all WebGL animation infrastructure in favor of CSS-only styling
**Rationale**: User explicitly stated animation "ne marche pas du tout" (doesn't work at all)
**Alternatives Considered**:
- Fix WebGL issues → Rejected (high maintenance burden, unreliable)
- Simplify to Canvas 2D → Rejected (still requires JavaScript, complexity)

---

### 2. Awwwards Portfolio Hero Patterns

**Task**: Research best practices for developer portfolio hero sections.

**Findings**:

#### Name-First Layout Pattern
Award-winning portfolios consistently prioritize the developer's name as the primary visual element:
- **Typography scale**: 120px-170px for name (using `clamp()` for responsiveness)
- **Hierarchy**: Name (h1, largest) → Role (subtitle, 25-30% of name size) → CTA
- **Placement**: Vertically centered in full-height viewport
- **Examples**: Bastian Gasser, Nicholas Ruggeri (Site of the Day), Constance Souville

#### Background Approaches
Three tiers observed in award-winners:

| Tier | Approach | Performance | When to Use |
|------|----------|-------------|-------------|
| Minimal | Solid dark background | Zero JS | Emphasis on typography |
| Subtle | Gradient with fade-in | ~1-2KB CSS | Clean, modern look |
| Complex | WebGL 3D shapes | ~30KB JS | Premium devices only |

**Decision**: Use Tier 2 (Subtle gradient with CSS fade-in)
**Rationale**: Balances visual appeal with reliability and performance
**Alternatives Considered**:
- Tier 1 (Solid) → Too plain for portfolio
- Tier 3 (WebGL) → Already failed, user rejected

#### Typography Patterns
- Single typeface family with weight variations
- High contrast (WCAG 2.1 AA minimum)
- Character spacing slightly increased at large sizes
- Sans-serif dominates modern portfolios

#### CTA Styling
- Height: 48px base, expandable to 72px
- Border radius: 8px standard or pill-button style
- Primary dark, white, outline variants
- Transitions: 0.3s ease for hover states
- Touch-friendly: minimum 44-48px tap target

**Decision**: Maintain existing CTA styling (already meets best practices)
**Rationale**: CTA works well, no changes needed per spec
**Alternatives Considered**: None needed

---

### 3. CSS Gradient Background Best Practices

**Task**: Research gradient implementations for dark-themed portfolios.

**Findings**:

#### Recommended Gradient Pattern
```css
.hero {
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-surface-0) 50%,
    var(--color-background) 100%
  );
}
```

Or with subtle accent color:
```css
.hero {
  background:
    radial-gradient(
      ellipse at 30% 20%,
      hsla(var(--primary-hsl), 0.08) 0%,
      transparent 50%
    ),
    var(--color-background);
}
```

#### Best Practices
- Use CSS custom properties for colors (theme consistency)
- Low opacity accent colors (0.05-0.15) for subtle effect
- Radial gradients for "spotlight" effect on name
- Avoid animation on gradient (performance, accessibility)

**Decision**: Simple linear gradient using Catppuccin Mocha colors
**Rationale**: Matches existing theme, minimal complexity
**Alternatives Considered**:
- Radial gradient → Saved for future enhancement
- Animated gradient → Rejected (accessibility concerns)

---

### 4. CSS-Only Animation Patterns

**Task**: Research CSS animation approaches for hero content reveal.

**Findings**:

#### Recommended Pattern (Fade-In)
```css
.hero__content {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__content {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

#### Best Practices
- GPU-accelerated properties only (opacity, transform)
- Duration: 0.4-0.8s for content reveals
- Easing: ease-out or cubic-bezier for natural feel
- prefers-reduced-motion: instant reveal, no animation

**Decision**: Simple CSS fade-in with translateY
**Rationale**: Reliable, performant, accessible
**Alternatives Considered**:
- GSAP timeline → Rejected (overkill for simple fade)
- No animation → Rejected (feels abrupt)

---

### 5. Performance Configuration Cleanup

**Task**: Identify hero-specific performance constants to remove.

**Findings**:

#### Constants to Remove from src/config/performance.ts
```typescript
// Lines 126-178 - Hero Animation Performance Settings
export const HERO_SHAPE_COUNTS: Record<DeviceTierLevel, number>
export const HERO_DEGRADATION_THRESHOLDS
export const HERO_ANIMATION_TIMING
export const HERO_PARALLAX_CONFIG
```

#### Constants to Keep
- Device tier detection (used by other features)
- General performance budgets (Lighthouse targets)
- Lenis/ScrollTrigger configuration

**Decision**: Remove only HERO_* constants, preserve general config
**Rationale**: Other features depend on performance config
**Alternatives Considered**: None needed

---

## Summary of Decisions

| Area | Decision | Bundle Impact |
|------|----------|---------------|
| Animation System | Remove entirely | -48KB source |
| OGL Dependency | Remove from package.json | -24KB bundle |
| Background | CSS gradient | 0KB |
| Content Animation | CSS fade-in | ~500 bytes |
| Layout | Name-first hierarchy | 0KB |
| Performance Config | Remove HERO_* only | ~1KB source |

**Total Bundle Reduction**: ~30KB minified

## Open Questions

None. All clarifications resolved.
