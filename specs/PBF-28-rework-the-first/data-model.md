# Data Model: Award-Winning Hero Section Rework

**Feature**: PBF-28-rework-the-first
**Date**: 2025-12-19
**Status**: Phase 1 Complete

## Entity Overview

The hero section consists of four primary entities (from spec Key Entities):

1. **HeroAnimationController** - Orchestrates all hero animations
2. **InteractiveLayer** - Manages cursor tracking and parallax
3. **TypographyAnimation** - Controls text reveal sequences
4. **PerformanceMonitor** - Tracks frame rate and triggers degradation

---

## Entity 1: HeroAnimationController

### Purpose
Central orchestrator for all hero animations. Manages lifecycle, coordinates entrance sequence, and handles cleanup.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `state` | `HeroState` | Yes | Current animation state |
| `masterTimeline` | `gsap.core.Timeline \| null` | No | GSAP master timeline |
| `backgroundAnimation` | `Background3D \| null` | No | OGL 3D background instance |
| `cursorTracker` | `CursorTracker \| null` | No | Cursor parallax system |
| `typographyReveal` | `TypographyReveal \| null` | No | Text animation controller |
| `deviceTier` | `DeviceTier` | Yes | HIGH \| MID \| LOW |
| `reducedMotion` | `boolean` | Yes | User prefers reduced motion |

### State Machine

```
┌─────────────┐
│   IDLE      │  Initial state before initialization
└─────┬───────┘
      │ init()
      ▼
┌─────────────┐
│  LOADING    │  Assets loading, canvas setup
└─────┬───────┘
      │ onReady()
      ▼
┌─────────────┐
│  ENTRANCE   │  Playing entrance animation (≤3s)
└─────┬───────┘
      │ onEntranceComplete()
      ▼
┌─────────────┐
│   ACTIVE    │  Idle animations + cursor tracking active
└─────┬───────┘
      │ destroy() or page navigation
      ▼
┌─────────────┐
│  DESTROYED  │  Cleanup complete, resources released
└─────────────┘
```

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init()` | `canvas: HTMLCanvasElement` | `Promise<void>` | Initialize all subsystems |
| `playEntrance()` | `none` | `void` | Start master entrance timeline |
| `pause()` | `none` | `void` | Pause all animations |
| `resume()` | `none` | `void` | Resume all animations |
| `destroy()` | `none` | `void` | Cleanup resources |

### Validation Rules

- `state` must transition through valid state machine paths only
- `deviceTier` must be detected before `init()` completes
- `reducedMotion` must be checked on every `init()` call

---

## Entity 2: Background3D

### Purpose
Manages the OGL-based 3D geometric background with layered depth and perspective grid.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `renderer` | `ogl.Renderer` | Yes | OGL WebGL renderer |
| `scene` | `ogl.Transform` | Yes | Root scene graph |
| `camera` | `ogl.Camera` | Yes | Perspective camera |
| `shapes` | `GeometricShape[]` | Yes | Array of 3D shapes |
| `grid` | `PerspectiveGrid \| null` | No | Background grid mesh |
| `animating` | `boolean` | Yes | Animation loop active |

### GeometricShape Sub-Entity

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `mesh` | `ogl.Mesh` | Yes | OGL mesh object |
| `type` | `ShapeType` | Yes | cube \| octahedron \| torus |
| `layer` | `ParallaxLayer` | Yes | front \| mid \| back |
| `basePosition` | `Vec3` | Yes | Starting position |
| `rotationSpeed` | `Vec3` | Yes | Idle rotation velocity |
| `parallaxFactor` | `number` | Yes | Mouse movement multiplier |

### ShapeType Enum

```typescript
type ShapeType = 'cube' | 'octahedron' | 'torus' | 'icosahedron' | 'tetrahedron';
```

### ParallaxLayer Enum

```typescript
type ParallaxLayer = 'front' | 'mid' | 'back';
```

### Layer Configuration

| Layer | Z-Position | Parallax Factor | Shape Count (HIGH) | Shape Count (MID) | Shape Count (LOW) |
|-------|------------|-----------------|-------------------|-------------------|-------------------|
| front | -50 to -100 | 0.15 | 3 | 2 | 1 |
| mid | -150 to -250 | 0.08 | 5 | 3 | 2 |
| back | -300 to -500 | 0.03 | 4 | 2 | 0 |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init()` | `canvas: HTMLCanvasElement, options: BackgroundOptions` | `Promise<void>` | Setup WebGL context |
| `addShape()` | `config: ShapeConfig` | `GeometricShape` | Create and add shape |
| `setParallax()` | `deltaX: number, deltaY: number` | `void` | Update shape positions |
| `animate()` | `delta: number` | `void` | Frame update |
| `destroy()` | `none` | `void` | Release WebGL resources |

---

## Entity 3: CursorTracker

### Purpose
Tracks cursor position and applies parallax effect to hero layers using GSAP quickTo for 60fps performance.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `enabled` | `boolean` | Yes | Tracking active (false on touch devices) |
| `position` | `{ x: number, y: number }` | Yes | Normalized cursor position (-1 to 1) |
| `layers` | `ParallaxLayerConfig[]` | Yes | Layers to animate |
| `quickSetters` | `Map<string, QuickSetter>` | Yes | GSAP quickTo instances |
| `lastUpdate` | `number` | Yes | Timestamp of last update |

### ParallaxLayerConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `selector` | `string` | Yes | CSS selector for layer |
| `factor` | `number` | Yes | Parallax multiplier (0-1) |
| `duration` | `number` | No | Animation duration (default: 0.6s) |
| `ease` | `string` | No | GSAP easing (default: power3.out) |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init()` | `layers: ParallaxLayerConfig[]` | `void` | Create quickTo setters |
| `update()` | `e: MouseEvent` | `void` | Handle mousemove |
| `enable()` | `none` | `void` | Start tracking |
| `disable()` | `none` | `void` | Stop tracking |
| `destroy()` | `none` | `void` | Remove listeners |

### Validation Rules

- `factor` must be between 0 and 1
- `duration` must be positive
- Tracking disabled if `(hover: hover)` media query fails

---

## Entity 4: TypographyReveal

### Purpose
Manages the theatrical text reveal animation for headline and subheadline using GSAP timeline.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `timeline` | `gsap.core.Timeline \| null` | No | GSAP timeline |
| `elements` | `TextElement[]` | Yes | Elements to animate |
| `state` | `RevealState` | Yes | pending \| revealing \| complete |
| `totalDuration` | `number` | Yes | Calculated total duration |

### TextElement

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `element` | `HTMLElement` | Yes | DOM element reference |
| `type` | `TextType` | Yes | headline \| subheadline \| cta |
| `animationConfig` | `TextAnimationConfig` | Yes | Animation settings |

### TextAnimationConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `fromY` | `number` | Yes | Starting Y offset (px) |
| `duration` | `number` | Yes | Animation duration (s) |
| `clipPath` | `boolean` | No | Use clip-path reveal |
| `delay` | `number` | No | Start delay from timeline start |

### Default Configurations

| TextType | fromY | duration | clipPath | delay |
|----------|-------|----------|----------|-------|
| headline | 50 | 0.8 | true | 0.5 |
| subheadline | 30 | 0.6 | false | 0.8 |
| cta | 0 | 0.5 | false | 1.5 |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `init()` | `elements: TextElement[]` | `void` | Setup timeline |
| `play()` | `none` | `Promise<void>` | Start reveal animation |
| `skip()` | `none` | `void` | Jump to end (reduced motion) |
| `reset()` | `none` | `void` | Reset to initial state |
| `destroy()` | `none` | `void` | Kill timeline |

---

## Entity 5: PerformanceMonitor (Extended)

### Purpose
Extended from existing FrameRateMonitor to support hero-specific degradation triggers.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `frameTimes` | `number[]` | Yes | Rolling frame time buffer |
| `heroController` | `HeroAnimationController` | Yes | Reference to controller |
| `degradationLevel` | `number` | Yes | Current degradation (0-3) |
| `thresholds` | `DegradationThresholds` | Yes | FPS triggers |

### DegradationThresholds

```typescript
interface DegradationThresholds {
  level1: 45;  // Reduce shape count
  level2: 30;  // Disable parallax
  level3: 20;  // Fallback to CSS gradient
}
```

### Degradation Actions

| Level | Trigger (FPS) | Action |
|-------|---------------|--------|
| 0 | ≥45 | Full quality |
| 1 | <45 | Remove 30% of shapes |
| 2 | <30 | Disable cursor parallax |
| 3 | <20 | Switch to CSS gradient fallback |

---

## Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    HeroAnimationController                       │
│                         (orchestrator)                           │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Background3D   │  │  CursorTracker   │  │TypographyReveal  │
│  (OGL renderer)  │  │  (GSAP quickTo)  │  │  (GSAP timeline) │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                    │
           ▼                    │
┌──────────────────┐            │
│ GeometricShape[] │◄───────────┘ (parallax updates)
└──────────────────┘

         ┌─────────────────────────────────────┐
         │        PerformanceMonitor           │
         │     (watches all, triggers          │
         │      degradation on controller)     │
         └─────────────────────────────────────┘
```

---

## CSS Custom Properties Interface

The hero system uses these CSS custom properties for theming:

| Property | Default | Usage |
|----------|---------|-------|
| `--color-primary` | `#cba6f7` | Primary shape color (violet) |
| `--color-secondary` | `#f5c2e7` | Accent shape color (rose) |
| `--color-accent` | `#b4befe` | Grid/highlight color (lavender) |
| `--color-background` | `#1e1e2e` | Base background |
| `--color-text` | `#cdd6f4` | Text color |

---

## Static Fallback (prefers-reduced-motion or JS failure)

When animations cannot run, the hero displays:

```css
.hero--static {
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    color-mix(in oklch, var(--color-primary), var(--color-background) 85%) 50%,
    var(--color-background) 100%
  );
}

.hero--static .hero__content {
  opacity: 1;
  transform: none;
}
```

This ensures content is always visible (FR-007, SC-007).
