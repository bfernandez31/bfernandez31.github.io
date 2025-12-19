# Quickstart: Award-Winning Hero Section Rework

**Feature**: PBF-28-rework-the-first
**Date**: 2025-12-19

## Prerequisites

- Bun ≥1.0.0 installed
- Existing portfolio codebase with Astro 5.15.3
- GSAP 3.13.0 already installed
- Basic knowledge of TypeScript and WebGL concepts

## Installation

### Step 1: Install OGL

```bash
bun add ogl
```

### Step 2: Verify Package Installation

```bash
# Verify ogl is in dependencies
grep '"ogl"' package.json
```

Expected output: `"ogl": "^x.x.x"`

## File Structure

Create the following new files:

```
src/scripts/hero/
├── hero-controller.ts    # Main orchestrator
├── background-3d.ts      # OGL WebGL background
├── cursor-tracker.ts     # Mouse parallax system
└── typography-reveal.ts  # Text entrance animation
```

## Quick Implementation

### 1. Update Hero.astro Component

```astro
---
// src/components/sections/Hero.astro
export interface Props {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

const { headline, subheadline, ctaText, ctaLink } = Astro.props;
---

<section class="hero" id="hero" data-section="hero">
  <!-- WebGL Canvas Layer -->
  <canvas id="hero-canvas" class="hero__canvas" aria-hidden="true"></canvas>

  <!-- Fallback gradient (visible if JS/WebGL fails) -->
  <div class="hero__fallback"></div>

  <!-- Content Layer -->
  <div class="hero__content">
    <h1 class="hero__headline" data-hero-text="headline">{headline}</h1>
    {subheadline && (
      <p class="hero__subheadline" data-hero-text="subheadline">{subheadline}</p>
    )}
    {ctaText && ctaLink && (
      <a href={ctaLink} class="hero__cta" data-hero-text="cta">
        {ctaText}
      </a>
    )}
  </div>
</section>

<script>
  import { initHeroAnimation } from "../../scripts/hero/hero-controller";

  // Initialize hero on DOM ready
  document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
    const content = document.querySelector(".hero__content") as HTMLElement;

    if (canvas && content) {
      try {
        await initHeroAnimation({
          canvas,
          contentContainer: content,
          onEntranceComplete: () => {
            console.log("[Hero] Entrance animation complete");
          }
        });
      } catch (error) {
        console.error("[Hero] Failed to initialize:", error);
        // Fallback visible automatically via CSS
      }
    }
  });

  // Cleanup on page navigation
  document.addEventListener("astro:before-swap", () => {
    window.__heroController__?.destroy();
  });
</script>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--color-background);
  }

  .hero__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero__fallback {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      135deg,
      var(--color-background) 0%,
      color-mix(in oklch, var(--color-primary), var(--color-background) 85%) 50%,
      var(--color-background) 100%
    );
    opacity: 1;
    transition: opacity 0.3s ease-out;
  }

  /* Hide fallback when canvas is active */
  .hero.hero--active .hero__fallback {
    opacity: 0;
    pointer-events: none;
  }

  .hero__content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 800px;
    padding: 2rem;
    /* Initially hidden for entrance animation */
    opacity: 0;
    transform: translateY(20px);
  }

  /* Show immediately if reduced motion or JS fails */
  @media (prefers-reduced-motion: reduce) {
    .hero__content {
      opacity: 1;
      transform: none;
    }
  }

  .hero__headline {
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: clamp(1rem, 3vw, 2rem);
    line-height: 1.1;
  }

  .hero__subheadline {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: var(--color-text);
    opacity: 0.9;
    margin-bottom: clamp(1.5rem, 4vw, 3rem);
    line-height: 1.5;
  }

  .hero__cta {
    display: inline-block;
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-background);
    background: var(--color-primary);
    border-radius: 8px;
    text-decoration: none;
    transition: var(--transition-color), transform 0.2s ease;
  }

  @media (hover: hover) {
    .hero__cta:hover {
      background: var(--color-secondary);
      transform: translateY(-2px);
    }
  }

  .hero__cta:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
  }
</style>
```

### 2. Create Hero Controller Stub

```typescript
// src/scripts/hero/hero-controller.ts
import { gsap } from "gsap";
import type { HeroControllerOptions, IHeroAnimationController, HeroState, DeviceTier } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";
import { Background3D } from "./background-3d";
import { CursorTracker } from "./cursor-tracker";
import { TypographyReveal } from "./typography-reveal";
import { prefersReducedMotion } from "../animation-config";
import { detectDeviceTier } from "../performance/device-tier";

declare global {
  interface Window {
    __heroController__?: HeroAnimationController;
  }
}

class HeroAnimationController implements IHeroAnimationController {
  state: HeroState = "IDLE";
  deviceTier: DeviceTier = "MID";
  reducedMotion: boolean = false;

  private background: Background3D | null = null;
  private cursor: CursorTracker | null = null;
  private typography: TypographyReveal | null = null;
  private options: HeroControllerOptions | null = null;

  async init(options: HeroControllerOptions): Promise<void> {
    this.options = options;
    this.state = "LOADING";
    this.reducedMotion = prefersReducedMotion();
    this.deviceTier = options.forceTier ?? detectDeviceTier()?.tier ?? "MID";

    // If reduced motion, skip all animations
    if (this.reducedMotion || options.skipEntrance) {
      this.showContentImmediately();
      this.state = "ACTIVE";
      return;
    }

    // Initialize subsystems
    this.background = new Background3D();
    await this.background.init({
      canvas: options.canvas,
      deviceTier: this.deviceTier,
    });

    // Only enable cursor tracking on desktop with hover
    if (window.matchMedia("(hover: hover)").matches && this.deviceTier !== "LOW") {
      this.cursor = new CursorTracker();
      this.cursor.init([
        { selector: ".hero__shapes--front", factor: 0.15 },
        { selector: ".hero__shapes--mid", factor: 0.08 },
        { selector: ".hero__shapes--back", factor: 0.03 },
      ]);
      this.cursor.onUpdate((pos) => {
        this.background?.setParallax(pos.x, pos.y);
      });
    }

    this.typography = new TypographyReveal();
    this.typography.init([
      { element: options.contentContainer.querySelector("[data-hero-text='headline']")!, type: "headline" },
      { element: options.contentContainer.querySelector("[data-hero-text='subheadline']")!, type: "subheadline" },
      { element: options.contentContainer.querySelector("[data-hero-text='cta']")!, type: "cta" },
    ].filter(e => e.element));

    // Mark canvas as active
    options.canvas.closest(".hero")?.classList.add("hero--active");

    this.state = "ENTRANCE";
    this.playEntrance();
  }

  playEntrance(): void {
    if (this.state !== "ENTRANCE") return;

    const masterTimeline = gsap.timeline({
      onComplete: () => {
        this.state = "ACTIVE";
        this.options?.onEntranceComplete?.();
      }
    });

    // Background fade in
    if (this.background) {
      masterTimeline.to(".hero__canvas", { opacity: 1, duration: 0.8 }, 0);
      this.background.start();
    }

    // Typography reveal
    if (this.typography) {
      masterTimeline.add(() => this.typography?.play(), 0.5);
    }

    // Enable cursor tracking after entrance
    masterTimeline.add(() => this.cursor?.enable(), 1);
  }

  private showContentImmediately(): void {
    const content = this.options?.contentContainer;
    if (content) {
      gsap.set(content, { opacity: 1, y: 0 });
      gsap.set(content.querySelectorAll("[data-hero-text]"), { opacity: 1, y: 0, clipPath: "none" });
    }
  }

  pause(): void {
    this.background?.stop();
    this.cursor?.disable();
  }

  resume(): void {
    if (this.state === "ACTIVE") {
      this.background?.start();
      this.cursor?.enable();
    }
  }

  destroy(): void {
    this.state = "DESTROYED";
    this.background?.destroy();
    this.cursor?.destroy();
    this.typography?.destroy();
    this.options?.onDestroy?.();
    window.__heroController__ = undefined;
  }
}

export async function initHeroAnimation(options: HeroControllerOptions): Promise<void> {
  const controller = new HeroAnimationController();
  window.__heroController__ = controller;
  await controller.init(options);
}

export { HeroAnimationController };
```

### 3. Create Background 3D Stub

```typescript
// src/scripts/hero/background-3d.ts
import { Renderer, Camera, Transform, Program, Mesh, Box, Torus } from "ogl";
import type { Background3DOptions, IBackground3D, GeometricShape, ShapeConfig } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";
import { DEFAULT_SHAPES_BY_TIER, DEFAULT_PARALLAX_FACTORS } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";

export class Background3D implements IBackground3D {
  renderer!: Renderer;
  scene!: Transform;
  camera!: Camera;
  shapes: GeometricShape[] = [];
  animating = false;

  private canvas!: HTMLCanvasElement;
  private animationId: number | null = null;
  private lastTime = 0;

  async init(options: Background3DOptions): Promise<void> {
    this.canvas = options.canvas;

    // Create WebGL renderer
    this.renderer = new Renderer({
      canvas: this.canvas,
      antialias: options.antialias ?? true,
      alpha: true,
      dpr: Math.min(options.maxPixelRatio ?? 2, window.devicePixelRatio),
    });

    const gl = this.renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Create camera
    this.camera = new Camera(gl, { fov: 45, near: 1, far: 1000 });
    this.camera.position.set(0, 0, 300);

    // Create scene
    this.scene = new Transform();

    // Add shapes based on device tier
    const shapeConfigs = options.shapes ?? DEFAULT_SHAPES_BY_TIER[options.deviceTier];
    for (const config of shapeConfigs) {
      this.addShape(config);
    }

    // Handle resize
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  addShape(config: ShapeConfig): GeometricShape {
    const gl = this.renderer.gl;

    // Create geometry based on type
    let geometry;
    switch (config.type) {
      case "cube":
        geometry = new Box(gl, { width: 20, height: 20, depth: 20 });
        break;
      case "torus":
        geometry = new Torus(gl, { radius: 15, tube: 3 });
        break;
      default:
        geometry = new Box(gl, { width: 20, height: 20, depth: 20 });
    }

    // Create wireframe program
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision mediump float;
        uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 0.6);
        }
      `,
      uniforms: {
        uColor: { value: this.hexToVec3(config.color ?? "#cba6f7") },
      },
    });

    const mesh = new Mesh(gl, { geometry, program, mode: gl.LINE_LOOP });
    mesh.position.set(config.position.x, config.position.y, config.position.z);
    mesh.setParent(this.scene);

    const shape: GeometricShape = {
      mesh,
      config,
      parallaxFactor: DEFAULT_PARALLAX_FACTORS[config.layer],
    };

    this.shapes.push(shape);
    return shape;
  }

  removeShape(shape: GeometricShape): void {
    const index = this.shapes.indexOf(shape);
    if (index !== -1) {
      shape.mesh.setParent(null);
      this.shapes.splice(index, 1);
    }
  }

  setParallax(deltaX: number, deltaY: number): void {
    for (const shape of this.shapes) {
      const offset = shape.parallaxFactor * 100;
      shape.mesh.position.x = shape.config.position.x + deltaX * offset;
      shape.mesh.position.y = shape.config.position.y + deltaY * offset;
    }
  }

  update(delta: number): void {
    // Rotate shapes
    for (const shape of this.shapes) {
      const speed = shape.config.rotationSpeed ?? { x: 0.2, y: 0.3, z: 0.1 };
      shape.mesh.rotation.x += speed.x * delta;
      shape.mesh.rotation.y += speed.y * delta;
      shape.mesh.rotation.z += speed.z * delta;
    }

    // Render
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  start(): void {
    if (this.animating) return;
    this.animating = true;
    this.lastTime = performance.now();
    this.animate();
  }

  stop(): void {
    this.animating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resize(): void {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
  }

  destroy(): void {
    this.stop();
    window.removeEventListener("resize", this.resize.bind(this));
    // WebGL cleanup handled by renderer
  }

  private animate(): void {
    if (!this.animating) return;

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(delta);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private hexToVec3(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ];
    }
    return [0.8, 0.65, 0.97]; // Default violet
  }
}
```

### 4. Create Cursor Tracker Stub

```typescript
// src/scripts/hero/cursor-tracker.ts
import { gsap } from "gsap";
import type { ICursorTracker, ParallaxLayerConfig, NormalizedPosition } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";

export class CursorTracker implements ICursorTracker {
  enabled = false;
  position: NormalizedPosition = { x: 0, y: 0 };

  private layers: ParallaxLayerConfig[] = [];
  private quickSetters: Map<string, { x: gsap.QuickToFunc; y: gsap.QuickToFunc }> = new Map();
  private updateCallbacks: Set<(pos: NormalizedPosition) => void> = new Set();
  private boundHandleMove: (e: MouseEvent) => void;

  constructor() {
    this.boundHandleMove = this.handleMouseMove.bind(this);
  }

  init(layers: ParallaxLayerConfig[]): void {
    this.layers = layers;

    // Create quickTo setters for each layer
    for (const layer of layers) {
      const duration = layer.duration ?? 0.6;
      const ease = layer.ease ?? "power3.out";

      this.quickSetters.set(layer.selector, {
        x: gsap.quickTo(layer.selector, "x", { duration, ease }),
        y: gsap.quickTo(layer.selector, "y", { duration, ease }),
      });
    }
  }

  enable(): void {
    if (this.enabled) return;
    this.enabled = true;
    window.addEventListener("mousemove", this.boundHandleMove, { passive: true });
  }

  disable(): void {
    if (!this.enabled) return;
    this.enabled = false;
    window.removeEventListener("mousemove", this.boundHandleMove);
  }

  onUpdate(callback: (position: NormalizedPosition) => void): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  destroy(): void {
    this.disable();
    this.quickSetters.clear();
    this.updateCallbacks.clear();
  }

  private handleMouseMove(e: MouseEvent): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.position = {
      x: (e.clientX - centerX) / centerX,
      y: (e.clientY - centerY) / centerY,
    };

    // Update CSS transform layers
    for (const layer of this.layers) {
      const setter = this.quickSetters.get(layer.selector);
      if (setter) {
        const offset = layer.factor * 100;
        setter.x(this.position.x * offset);
        setter.y(this.position.y * offset);
      }
    }

    // Notify callbacks (for WebGL layers)
    for (const callback of this.updateCallbacks) {
      callback(this.position);
    }
  }
}
```

### 5. Create Typography Reveal Stub

```typescript
// src/scripts/hero/typography-reveal.ts
import { gsap } from "gsap";
import type { ITypographyReveal, TextElement, RevealState } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";
import { DEFAULT_TEXT_ANIMATIONS } from "@specs/PBF-28-rework-the-first/contracts/hero-animation";

export class TypographyReveal implements ITypographyReveal {
  timeline: gsap.core.Timeline | null = null;
  state: RevealState = "pending";
  totalDuration = 0;

  private elements: TextElement[] = [];
  private resolvePlay: (() => void) | null = null;

  init(elements: TextElement[]): void {
    this.elements = elements;

    // Set initial hidden state
    for (const el of elements) {
      const config = { ...DEFAULT_TEXT_ANIMATIONS[el.type], ...el.animationConfig };
      gsap.set(el.element, {
        opacity: 0,
        y: config.fromY,
        clipPath: config.clipPath ? "inset(100% 0 0 0)" : undefined,
      });
    }

    // Build timeline
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.state = "complete";
        this.resolvePlay?.();
      },
    });

    for (const el of elements) {
      const config = { ...DEFAULT_TEXT_ANIMATIONS[el.type], ...el.animationConfig };

      this.timeline.to(
        el.element,
        {
          opacity: 1,
          y: 0,
          clipPath: config.clipPath ? "inset(0% 0 0 0)" : undefined,
          duration: config.duration,
          ease: config.ease,
        },
        config.delay
      );
    }

    this.totalDuration = this.timeline.duration();
  }

  async play(): Promise<void> {
    if (this.state !== "pending" || !this.timeline) return Promise.resolve();

    this.state = "revealing";

    return new Promise((resolve) => {
      this.resolvePlay = resolve;
      this.timeline?.play();
    });
  }

  skip(): void {
    if (!this.timeline) return;
    this.timeline.progress(1);
    this.state = "complete";
  }

  reset(): void {
    if (!this.timeline) return;
    this.timeline.progress(0).pause();
    this.state = "pending";
  }

  destroy(): void {
    this.timeline?.kill();
    this.timeline = null;
    this.elements = [];
  }
}
```

## Testing

### Run Development Server

```bash
bun run dev
```

### Verify Hero Animation

1. Open http://localhost:4321 in Chrome DevTools
2. Check Console for `[Hero] Entrance animation complete`
3. Move cursor to verify parallax effect
4. Toggle `prefers-reduced-motion` in DevTools to test accessibility

### Performance Check

```bash
# Build production version
bun run build

# Run Lighthouse audit
npx lighthouse http://localhost:4321 --view
```

Target scores:
- Performance: ≥85 (mobile), ≥95 (desktop)
- Accessibility: 100
- Best Practices: 100

## Troubleshooting

| Issue | Solution |
|-------|----------|
| WebGL context error | Check browser WebGL support; fallback gradient should appear |
| Parallax not working | Verify `(hover: hover)` media query matches; check device tier |
| Entrance animation stutters | Reduce shape count; check device tier detection |
| Content invisible | Verify `data-hero-text` attributes; check Console for errors |

## Next Steps

After implementing the basic structure:

1. **Tune shape positions and rotations** for best visual effect
2. **Add perspective grid** to Background3D for depth
3. **Implement performance degradation** based on frame rate
4. **Test on real mobile devices** (Moto G Power, Samsung A series)
5. **Submit to Awwwards** when ready!
