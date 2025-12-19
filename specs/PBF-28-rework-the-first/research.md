# Research Document: Award-Winning Hero Section Rework

**Feature**: PBF-28-rework-the-first
**Date**: 2025-12-19
**Status**: Complete

## Executive Summary

This research resolves the three NEEDS CLARIFICATION items from the Technical Context:

1. **3D Technology Choice**: Recommend **OGL (oframe/ogl)** as a lightweight WebGL alternative (~24KB minified) over Three.js (~150KB)
2. **Visual Concept Theme**: Recommend **Option C: Geometric/Architectural 3D Forms** for maximum Awwwards impact while maintaining performance
3. **Performance Budget Allocation**: OGL + GSAP + cursor tracking fits within 70KB additional budget (well under 200KB total)

---

## Decision 1: 3D Technology Choice

### Problem

The current neural network animation uses Canvas 2D (~8KB) but lacks the depth and "wow" factor required for Awwwards recognition. The spec requires 3D depth (Decision 2), but Three.js at ~150KB gzipped would consume most of the JS budget.

### Options Evaluated

| Library | Bundle Size (min) | Learning Curve | 3D Capability | Awwwards Examples |
|---------|-------------------|----------------|---------------|-------------------|
| **Three.js** | ~150KB gzipped | Medium | Full 3D | Many SOTD winners |
| **OGL** | ~24KB gzipped | Low (Three.js-like API) | WebGL 2D/3D | Codrops tutorials |
| **TWGL.js** | ~10KB | High (raw WebGL) | Raw WebGL | Minimal |
| **Canvas 2D + Perspective** | ~5KB | Low | Faux 3D only | Limited |
| **Pure WebGL** | ~3KB | Very High | Full control | Expert-level |

### Decision

**Use OGL (oframe/ogl)** for the hero background animation.

### Rationale

1. **Bundle Size**: OGL is ~24KB minified with zero dependencies vs Three.js at ~150KB - a 6x reduction
2. **API Similarity**: "The API shares many similarities with Three.js" making it easy to implement 3D effects with transferable knowledge
3. **WebGL 2 Support**: Full WebGL 2 capabilities including shaders, geometry, and GPU-accelerated rendering
4. **Performance**: "Written in ES6 modules with zero dependencies" - tree-shakeable and optimized
5. **Awwwards Track Record**: Featured in Codrops tutorials and creative developer portfolios

### Alternatives Considered

- **Three.js**: Rejected due to bundle size exceeding reasonable budget
- **TWGL.js**: Rejected - too low-level, requires raw WebGL knowledge
- **Canvas 2D with perspective transforms**: Rejected - cannot achieve true 3D depth required for Awwwards

### Sources

- [OGL GitHub Repository](https://github.com/oframe/ogl)
- [WebGL Libraries Comparison](https://github.com/jsulpis/webgl-libs-comparison)
- [TWGL.js](https://twgljs.org/)

---

## Decision 2: Visual Concept Theme

### Problem

Spec FR-016 requires clarification on the visual theme. The hero must be "unique and memorable, avoiding generic particle/node patterns common in developer portfolios" (FR-015).

### Options Evaluated

| Theme | Description | Originality | Implementation Complexity | Performance Impact |
|-------|-------------|-------------|---------------------------|-------------------|
| **(A) Cyberpunk/Neon** | Glowing elements, digital artifacts, RGB splits | Medium (common in tech portfolios) | Medium | Medium |
| **(B) Organic/Fluid** | Morphing shapes, liquid motion, smooth blobs | High | High (requires complex shaders) | High |
| **(C) Geometric/Architectural** | Clean 3D forms, grid structures, perspective lines | High | Medium | Low-Medium |
| **(D) Abstract Particles** | Sophisticated particle system with depth | Low (current approach) | Low | Low |

### Decision

**Use Option C: Geometric/Architectural 3D Forms** with these characteristics:

- **Primary Visual**: Floating 3D geometric primitives (cubes, octahedrons, tori) with subtle wireframe rendering
- **Color Palette**: Catppuccin Mocha theme (violet primary `#cba6f7`, rose secondary `#f5c2e7`, lavender accent `#b4befe`)
- **Depth Effect**: Layered Z-axis positioning with mouse-driven parallax (foreground moves more than background)
- **Grid System**: Subtle perspective grid floor/horizon for architectural feel
- **Interaction**: Shapes rotate subtly on cursor proximity, parallax movement on mouse position

### Rationale

1. **Originality**: Geometric 3D forms are less common than particles/nodes in developer portfolios
2. **Performance**: Clean geometries render efficiently; wireframes reduce fill rate
3. **Accessibility**: Grid provides visual stability; shapes don't require complex shaders
4. **Brand Alignment**: Architectural precision reinforces "creative technologist" positioning (SC-010)
5. **Awwwards Trends**: "Depth and dimension" is a 2025 trend; geometric portfolios like Carl Gordon won awards

### Implementation Approach

```
Hero Background Layers (front to back):
1. Cursor-reactive zone (CSS transforms, no WebGL)
2. Foreground shapes (OGL, 3 large geometries, high parallax factor)
3. Mid-ground shapes (OGL, 5-7 medium geometries, medium parallax)
4. Background grid (CSS gradient + lines, low parallax)
5. Base gradient (CSS, static)
```

### Sources

- [Interactive 3D Hero Section - Carl Gordon Portfolio](https://www.awwwards.com/inspiration/interactive-3d-hero-section-carl-gordon-portfolio-c-2024)
- [Creative WebGL Worlds of Adrián Gubrica](https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/)
- [Best WebGL Websites - Awwwards](https://www.awwwards.com/websites/webgl/)

---

## Decision 3: Performance Budget Allocation

### Problem

The constitution mandates <200KB total JavaScript. Current allocation is ~66KB (GSAP + Lenis + neural network). How much budget remains for the new hero system?

### Current JS Budget Analysis

| Component | Current Size | Status |
|-----------|--------------|--------|
| GSAP Core + ScrollTrigger | ~45KB | Keep |
| Lenis Smooth Scroll | ~10KB | Keep |
| Neural Network Animation | ~8KB | Replace |
| Other utilities | ~3KB | Keep |
| **Current Total** | ~66KB | - |
| **Budget Remaining** | ~134KB | Available |

### Proposed Hero System Allocation

| New Component | Estimated Size | Purpose |
|---------------|----------------|---------|
| OGL (tree-shaken) | ~15KB | WebGL 3D rendering (only core geometry/math) |
| Hero Controller | ~4KB | Animation orchestration |
| Background 3D | ~6KB | Geometric shapes + grid |
| Cursor Tracker | ~2KB | Mouse position + parallax |
| Typography Reveal | ~3KB | GSAP timeline entrance |
| **New Total** | ~30KB | - |

### Decision

**Approved budget: 30KB for new hero system** (fits within 134KB remaining)

### Final Budget Summary

| Category | Allocated | Notes |
|----------|-----------|-------|
| GSAP + Lenis | 55KB | Existing, unchanged |
| OGL + Hero System | 30KB | New hero implementation |
| Other utilities | 5KB | Device tier, performance monitor |
| **Total Used** | 90KB | - |
| **Budget Remaining** | 110KB | Reserve for future features |
| **Constitutional Limit** | 200KB | ✅ Compliant |

### Rationale

1. OGL tree-shaking allows importing only needed modules (geometry, math, program)
2. Hero modules are small, focused files that can be code-split
3. 30KB for a full 3D interactive hero is competitive with Awwwards-winning sites
4. Keeping 110KB reserve allows future enhancements without refactoring

### Sources

- [OGL Documentation](https://oframe.github.io/ogl/)
- [npm-compare: Canvas vs Three vs OGL](https://npm-compare.com/canvas,fabric,p5,paper,pixi.js,three)

---

## Decision 4: Entrance Animation Architecture

### Problem

The spec requires a "choreographed, timeline-based entrance sequence" (Decision 3) completing within 3 seconds (FR-003).

### Decision

**Use GSAP Timeline with nested timelines and stagger**

### Implementation Architecture

```typescript
// Master timeline structure
const heroTimeline = gsap.timeline({
  defaults: { ease: "power3.out" }
});

// Phase 1: Background reveal (0-1s)
const bgTimeline = gsap.timeline();
bgTimeline
  .from(".hero__grid", { opacity: 0, scale: 1.2, duration: 0.8 })
  .from(".hero__shapes", {
    opacity: 0,
    z: -200,
    stagger: 0.1,
    duration: 0.6
  }, "-=0.4");

// Phase 2: Typography reveal (0.5-2s)
const textTimeline = gsap.timeline();
textTimeline
  .from(".hero__headline", {
    opacity: 0,
    y: 50,
    clipPath: "inset(100% 0 0 0)",
    duration: 0.8
  })
  .from(".hero__subheadline", {
    opacity: 0,
    y: 30,
    duration: 0.6
  }, "-=0.3");

// Phase 3: CTA reveal (1.5-2.5s)
const ctaTimeline = gsap.timeline();
ctaTimeline
  .from(".hero__cta", {
    opacity: 0,
    scale: 0.8,
    duration: 0.5
  });

// Compose master timeline
heroTimeline
  .add(bgTimeline, 0)
  .add(textTimeline, 0.5)
  .add(ctaTimeline, 1.5);
```

### Rationale

1. **Nested timelines**: "You can nest timelines within timelines as deeply as you want" for maintainability
2. **Position parameters**: Using `"-=0.4"` creates overlapping animations for fluid choreography
3. **Defaults object**: "A great way to save repetition on properties you may want to be the same on all children"
4. **Clip-path animation**: Modern headline reveal technique seen in Awwwards winners
5. **Total duration**: 2.5s well under 3s requirement

### Sources

- [GSAP Timeline Documentation](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Hero Section Animation - GSAP Forums](https://gsap.com/community/forums/topic/41311-hero-section-animation/)
- [GSAP Mastering Guide - DEV](https://dev.to/aerospace-prog/the-ultimate-guide-to-mastering-gsap-animations-43kh)

---

## Decision 5: Cursor Interactivity Implementation

### Problem

The spec requires "cursor-reactive elements that respond to mouse movement on desktop devices" (FR-002).

### Decision

**Use GSAP `quickTo()` for high-performance 60fps cursor tracking**

### Implementation Architecture

```typescript
// Performance-optimized cursor tracking
const parallaxLayers = [
  { selector: '.hero__shapes--front', factor: 0.15 },
  { selector: '.hero__shapes--mid', factor: 0.08 },
  { selector: '.hero__shapes--back', factor: 0.03 }
];

// Create quickTo setters for each layer
const setters = parallaxLayers.map(layer => ({
  x: gsap.quickTo(layer.selector, "x", { duration: 0.6, ease: "power3.out" }),
  y: gsap.quickTo(layer.selector, "y", { duration: 0.6, ease: "power3.out" }),
  factor: layer.factor
}));

// Single mousemove handler
document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const deltaX = (e.clientX - centerX) / centerX;
  const deltaY = (e.clientY - centerY) / centerY;

  setters.forEach(({ x, y, factor }) => {
    x(deltaX * factor * 100);
    y(deltaY * factor * 100);
  });
});
```

### Rationale

1. **`quickTo()` performance**: "Ensures the cursor reacts almost instantly to the mouse movement, creating a responsive and snappy feel"
2. **Layered parallax**: Different duration/factors "create a sense of depth and fluidity"
3. **Single event listener**: One handler updates all layers for efficiency
4. **60fps target**: GSAP handles frame timing automatically
5. **Device tier awareness**: Can disable on LOW tier devices per existing performance system

### Touch Fallback

On mobile/tablet (no `hover` media query), use device orientation API or disable parallax entirely per spec FR-003 (adapted version).

### Sources

- [GSAP Magnetic Parallax Effect](https://www.antstack.com/blog/gsap-effects-magnetic-parallax-effect/)
- [Parallax Effect on Mouse Position with GSAP](https://breakdance4fun.supadezign.com/parallax-effect-on-mouse-position-with-gsap/)
- [Custom Cursor with GSAP - Medium](https://medium.com/@amilmohd155/elevate-your-ux-build-a-smooth-custom-cursor-with-gsap-and-react-b2a1bb1c01e8)

---

## Post-Phase 0 Constitution Re-Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Performance First** | ✅ PASS | OGL 24KB + 30KB hero system << 200KB budget |
| **I. Performance First** | ✅ PASS | `quickTo()` ensures 60fps cursor tracking |
| **II. Accessibility** | ✅ PASS | prefers-reduced-motion skips all animations |
| **III. Build** | ✅ PASS | No new build tools; OGL via npm |
| **VI. Tooling** | ✅ PASS | `bun add ogl` for installation |

All NEEDS CLARIFICATION items resolved. Proceed to Phase 1.

---

## Appendix: Awwwards Hero Section Research

### Key Trends from 2024-2025 Winners

1. **3D Depth**: "Awwwards 2025 trends emphasize depth and dimension, parallax, and 3D effects"
2. **Cursor Interaction**: "All Awwwards-winning portfolios in 2024-2025 feature mouse interactivity"
3. **Performance**: "Awwwards explicitly requires performance optimization"
4. **Theatrical Reveal**: "Reveal animations and scroll-triggered animations are 2025 best practices"

### Notable References

- [Carl Gordon Portfolio - Interactive 3D Hero](https://www.awwwards.com/inspiration/interactive-3d-hero-section-carl-gordon-portfolio-c-2024)
- [Matt Bierman Portfolio - Interactive WebGL Hero](https://www.awwwards.com/inspiration/interactive-webgl-hero-matt-bierman-portfolio)
- [Awwwards WebGL Collection](https://www.awwwards.com/awwwards/collections/webgl/)
