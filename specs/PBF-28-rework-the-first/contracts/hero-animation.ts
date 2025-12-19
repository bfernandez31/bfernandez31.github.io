/**
 * Hero Animation TypeScript Contracts
 * Feature: PBF-28-rework-the-first
 *
 * Type definitions for the award-winning hero section animation system.
 * These interfaces define the public API contracts between hero subsystems.
 */

import type { Renderer, Transform, Camera, Mesh, Program } from "ogl";
import type { gsap } from "gsap";

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Hero animation state machine states
 */
export type HeroState =
  | "IDLE"
  | "LOADING"
  | "ENTRANCE"
  | "ACTIVE"
  | "DESTROYED";

/**
 * Device performance tier (from existing performance system)
 */
export type DeviceTier = "HIGH" | "MID" | "LOW";

/**
 * Parallax layer depth classification
 */
export type ParallaxLayer = "front" | "mid" | "back";

/**
 * Geometric shape primitives supported by the 3D background
 */
export type ShapeType =
  | "cube"
  | "octahedron"
  | "torus"
  | "icosahedron"
  | "tetrahedron";

/**
 * Text element types for typography reveal
 */
export type TextType = "headline" | "subheadline" | "cta";

/**
 * Typography reveal state
 */
export type RevealState = "pending" | "revealing" | "complete";

// ============================================================================
// HERO ANIMATION CONTROLLER
// ============================================================================

/**
 * Configuration options for HeroAnimationController initialization
 */
export interface HeroControllerOptions {
  /** Canvas element for WebGL rendering */
  canvas: HTMLCanvasElement;
  /** Container element for text content */
  contentContainer: HTMLElement;
  /** Force specific device tier (for testing) */
  forceTier?: DeviceTier;
  /** Skip entrance animation and show content immediately */
  skipEntrance?: boolean;
  /** Callback when entrance animation completes */
  onEntranceComplete?: () => void;
  /** Callback when controller is destroyed */
  onDestroy?: () => void;
}

/**
 * Main hero animation controller interface
 * Orchestrates all hero subsystems (background, cursor, typography)
 */
export interface IHeroAnimationController {
  /** Current animation state */
  readonly state: HeroState;
  /** Detected device performance tier */
  readonly deviceTier: DeviceTier;
  /** User prefers reduced motion */
  readonly reducedMotion: boolean;

  /**
   * Initialize all hero subsystems
   * @throws Error if canvas context unavailable or WebGL not supported
   */
  init(options: HeroControllerOptions): Promise<void>;

  /**
   * Start the master entrance animation timeline
   * No-op if already playing or in ACTIVE state
   */
  playEntrance(): void;

  /**
   * Pause all running animations
   * Useful when hero scrolls out of view
   */
  pause(): void;

  /**
   * Resume paused animations
   */
  resume(): void;

  /**
   * Clean up all resources, remove event listeners, destroy WebGL context
   * Must be called on page navigation (astro:before-swap)
   */
  destroy(): void;
}

// ============================================================================
// BACKGROUND 3D (OGL)
// ============================================================================

/**
 * 3D vector type for positions and rotations
 */
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Configuration for a single geometric shape
 */
export interface ShapeConfig {
  /** Shape primitive type */
  type: ShapeType;
  /** Parallax layer assignment */
  layer: ParallaxLayer;
  /** Initial position in 3D space */
  position: Vec3;
  /** Scale factor (1 = default size) */
  scale?: number;
  /** Initial rotation (radians) */
  rotation?: Vec3;
  /** Idle rotation speed (radians per second) */
  rotationSpeed?: Vec3;
  /** Custom color (defaults to layer color) */
  color?: string;
  /** Wireframe rendering mode */
  wireframe?: boolean;
}

/**
 * Instance of a geometric shape in the scene
 */
export interface GeometricShape {
  /** OGL mesh reference */
  mesh: Mesh;
  /** Shape configuration */
  config: ShapeConfig;
  /** Calculated parallax factor based on layer */
  parallaxFactor: number;
}

/**
 * Options for Background3D initialization
 */
export interface Background3DOptions {
  /** Target canvas element */
  canvas: HTMLCanvasElement;
  /** Device tier for shape count calculation */
  deviceTier: DeviceTier;
  /** Custom shape configurations (overrides default) */
  shapes?: ShapeConfig[];
  /** Enable perspective grid */
  showGrid?: boolean;
  /** Enable WebGL antialiasing */
  antialias?: boolean;
  /** Maximum pixel ratio (default: 2) */
  maxPixelRatio?: number;
}

/**
 * Background 3D rendering system interface
 */
export interface IBackground3D {
  /** OGL renderer instance */
  readonly renderer: Renderer;
  /** Root scene transform */
  readonly scene: Transform;
  /** Perspective camera */
  readonly camera: Camera;
  /** Active geometric shapes */
  readonly shapes: readonly GeometricShape[];
  /** Animation loop running */
  readonly animating: boolean;

  /**
   * Initialize WebGL context and create scene
   */
  init(options: Background3DOptions): Promise<void>;

  /**
   * Add a geometric shape to the scene
   */
  addShape(config: ShapeConfig): GeometricShape;

  /**
   * Remove a shape from the scene
   */
  removeShape(shape: GeometricShape): void;

  /**
   * Update all shape positions based on cursor parallax
   * @param deltaX Normalized X offset (-1 to 1)
   * @param deltaY Normalized Y offset (-1 to 1)
   */
  setParallax(deltaX: number, deltaY: number): void;

  /**
   * Frame update (called by animation loop)
   * @param delta Time since last frame in seconds
   */
  update(delta: number): void;

  /**
   * Start animation loop
   */
  start(): void;

  /**
   * Stop animation loop
   */
  stop(): void;

  /**
   * Handle window resize
   */
  resize(): void;

  /**
   * Release WebGL resources
   */
  destroy(): void;
}

// ============================================================================
// CURSOR TRACKER
// ============================================================================

/**
 * Configuration for a parallax layer
 */
export interface ParallaxLayerConfig {
  /** CSS selector for elements in this layer */
  selector: string;
  /** Parallax movement multiplier (0-1) */
  factor: number;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** GSAP easing function (default: "power3.out") */
  ease?: string;
}

/**
 * GSAP quickTo setter pair for X/Y animation
 */
export interface QuickSetter {
  x: gsap.QuickToFunc;
  y: gsap.QuickToFunc;
}

/**
 * Cursor position normalized to viewport center
 */
export interface NormalizedPosition {
  /** X position (-1 to 1, where 0 is center) */
  x: number;
  /** Y position (-1 to 1, where 0 is center) */
  y: number;
}

/**
 * Cursor tracker interface for parallax effects
 */
export interface ICursorTracker {
  /** Tracking currently enabled */
  readonly enabled: boolean;
  /** Current normalized cursor position */
  readonly position: NormalizedPosition;

  /**
   * Initialize cursor tracking with layer configurations
   */
  init(layers: ParallaxLayerConfig[]): void;

  /**
   * Enable cursor tracking (add event listeners)
   */
  enable(): void;

  /**
   * Disable cursor tracking (remove event listeners)
   */
  disable(): void;

  /**
   * Add a callback to receive cursor updates
   */
  onUpdate(callback: (position: NormalizedPosition) => void): () => void;

  /**
   * Clean up all listeners and GSAP instances
   */
  destroy(): void;
}

// ============================================================================
// TYPOGRAPHY REVEAL
// ============================================================================

/**
 * Animation configuration for a text element
 */
export interface TextAnimationConfig {
  /** Starting Y offset in pixels */
  fromY: number;
  /** Animation duration in seconds */
  duration: number;
  /** Use clip-path reveal effect */
  clipPath?: boolean;
  /** Delay from timeline start in seconds */
  delay?: number;
  /** GSAP easing function */
  ease?: string;
}

/**
 * Text element configuration
 */
export interface TextElement {
  /** DOM element reference */
  element: HTMLElement;
  /** Element type (determines default animation) */
  type: TextType;
  /** Override default animation config */
  animationConfig?: Partial<TextAnimationConfig>;
}

/**
 * Typography reveal animation interface
 */
export interface ITypographyReveal {
  /** GSAP timeline instance */
  readonly timeline: gsap.core.Timeline | null;
  /** Current reveal state */
  readonly state: RevealState;
  /** Total animation duration in seconds */
  readonly totalDuration: number;

  /**
   * Initialize with text elements
   */
  init(elements: TextElement[]): void;

  /**
   * Play reveal animation
   * @returns Promise that resolves when animation completes
   */
  play(): Promise<void>;

  /**
   * Skip animation and show all content immediately
   * Used for prefers-reduced-motion
   */
  skip(): void;

  /**
   * Reset to initial hidden state
   */
  reset(): void;

  /**
   * Kill timeline and clean up
   */
  destroy(): void;
}

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

/**
 * Degradation level thresholds
 */
export interface DegradationThresholds {
  /** FPS below which level 1 triggers (reduce shapes) */
  level1: number;
  /** FPS below which level 2 triggers (disable parallax) */
  level2: number;
  /** FPS below which level 3 triggers (CSS fallback) */
  level3: number;
}

/**
 * Current performance report
 */
export interface PerformanceReport {
  /** Average FPS over sample window */
  averageFPS: number;
  /** Current degradation level (0-3) */
  degradationLevel: number;
  /** Number of frame samples collected */
  sampleCount: number;
  /** Timestamp of last update */
  lastUpdate: number;
}

/**
 * Hero performance monitor interface
 */
export interface IHeroPerformanceMonitor {
  /** Current degradation level */
  readonly degradationLevel: number;
  /** Get current performance report */
  getReport(): PerformanceReport;

  /**
   * Start monitoring frame rate
   */
  start(): void;

  /**
   * Stop monitoring
   */
  stop(): void;

  /**
   * Record a frame timestamp
   */
  recordFrame(): void;

  /**
   * Check if degradation is needed and trigger appropriate action
   * @returns New degradation level if changed, null otherwise
   */
  checkDegradation(): number | null;

  /**
   * Register callback for degradation level changes
   */
  onDegradation(callback: (level: number) => void): () => void;

  /**
   * Reset monitoring state
   */
  reset(): void;
}

// ============================================================================
// EVENTS
// ============================================================================

/**
 * Custom events emitted by the hero system
 */
export interface HeroEvents {
  "hero:ready": { controller: IHeroAnimationController };
  "hero:entrance-start": { duration: number };
  "hero:entrance-complete": {};
  "hero:degradation": { level: number; action: string };
  "hero:destroy": {};
}

/**
 * Type-safe event listener for hero events
 */
export type HeroEventListener<K extends keyof HeroEvents> = (
  event: CustomEvent<HeroEvents[K]>
) => void;

// ============================================================================
// FACTORY FUNCTIONS (Implementation signatures)
// ============================================================================

/**
 * Create hero animation controller instance
 */
export type CreateHeroController = () => IHeroAnimationController;

/**
 * Create background 3D instance
 */
export type CreateBackground3D = () => IBackground3D;

/**
 * Create cursor tracker instance
 */
export type CreateCursorTracker = () => ICursorTracker;

/**
 * Create typography reveal instance
 */
export type CreateTypographyReveal = () => ITypographyReveal;

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

/**
 * Default shape configurations by device tier
 */
export const DEFAULT_SHAPES_BY_TIER: Record<DeviceTier, ShapeConfig[]> = {
  HIGH: [
    // Front layer (3 shapes)
    {
      type: "octahedron",
      layer: "front",
      position: { x: -150, y: 50, z: -80 },
      scale: 1.2,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "front",
      position: { x: 200, y: -80, z: -60 },
      scale: 0.8,
      wireframe: true,
    },
    {
      type: "torus",
      layer: "front",
      position: { x: 50, y: 120, z: -90 },
      scale: 0.6,
      wireframe: true,
    },
    // Mid layer (5 shapes)
    {
      type: "icosahedron",
      layer: "mid",
      position: { x: -250, y: -100, z: -180 },
      scale: 1.5,
      wireframe: true,
    },
    {
      type: "tetrahedron",
      layer: "mid",
      position: { x: 300, y: 80, z: -200 },
      scale: 1.0,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "mid",
      position: { x: -100, y: 150, z: -220 },
      scale: 0.7,
      wireframe: true,
    },
    {
      type: "octahedron",
      layer: "mid",
      position: { x: 150, y: -150, z: -190 },
      scale: 0.9,
      wireframe: true,
    },
    {
      type: "torus",
      layer: "mid",
      position: { x: -50, y: -50, z: -250 },
      scale: 0.5,
      wireframe: true,
    },
    // Back layer (4 shapes)
    {
      type: "icosahedron",
      layer: "back",
      position: { x: -300, y: 100, z: -350 },
      scale: 2.0,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "back",
      position: { x: 350, y: -50, z: -400 },
      scale: 1.5,
      wireframe: true,
    },
    {
      type: "tetrahedron",
      layer: "back",
      position: { x: 0, y: 200, z: -450 },
      scale: 1.2,
      wireframe: true,
    },
    {
      type: "octahedron",
      layer: "back",
      position: { x: 200, y: -200, z: -380 },
      scale: 1.0,
      wireframe: true,
    },
  ],
  MID: [
    // Front layer (2 shapes)
    {
      type: "octahedron",
      layer: "front",
      position: { x: -150, y: 50, z: -80 },
      scale: 1.2,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "front",
      position: { x: 200, y: -80, z: -60 },
      scale: 0.8,
      wireframe: true,
    },
    // Mid layer (3 shapes)
    {
      type: "icosahedron",
      layer: "mid",
      position: { x: -250, y: -100, z: -180 },
      scale: 1.5,
      wireframe: true,
    },
    {
      type: "tetrahedron",
      layer: "mid",
      position: { x: 300, y: 80, z: -200 },
      scale: 1.0,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "mid",
      position: { x: -100, y: 150, z: -220 },
      scale: 0.7,
      wireframe: true,
    },
    // Back layer (2 shapes)
    {
      type: "icosahedron",
      layer: "back",
      position: { x: -300, y: 100, z: -350 },
      scale: 2.0,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "back",
      position: { x: 350, y: -50, z: -400 },
      scale: 1.5,
      wireframe: true,
    },
  ],
  LOW: [
    // Front layer (1 shape)
    {
      type: "octahedron",
      layer: "front",
      position: { x: -100, y: 30, z: -80 },
      scale: 1.0,
      wireframe: true,
    },
    // Mid layer (2 shapes)
    {
      type: "icosahedron",
      layer: "mid",
      position: { x: 200, y: -80, z: -180 },
      scale: 1.2,
      wireframe: true,
    },
    {
      type: "cube",
      layer: "mid",
      position: { x: -150, y: 100, z: -200 },
      scale: 0.8,
      wireframe: true,
    },
    // No back layer for LOW tier
  ],
};

/**
 * Default parallax factors by layer
 */
export const DEFAULT_PARALLAX_FACTORS: Record<ParallaxLayer, number> = {
  front: 0.15,
  mid: 0.08,
  back: 0.03,
};

/**
 * Default text animation configurations by type
 */
export const DEFAULT_TEXT_ANIMATIONS: Record<TextType, TextAnimationConfig> = {
  headline: {
    fromY: 50,
    duration: 0.8,
    clipPath: true,
    delay: 0.5,
    ease: "power3.out",
  },
  subheadline: {
    fromY: 30,
    duration: 0.6,
    clipPath: false,
    delay: 0.8,
    ease: "power3.out",
  },
  cta: {
    fromY: 0,
    duration: 0.5,
    clipPath: false,
    delay: 1.5,
    ease: "back.out(1.7)",
  },
};

/**
 * Default degradation thresholds
 */
export const DEFAULT_DEGRADATION_THRESHOLDS: DegradationThresholds = {
  level1: 45,
  level2: 30,
  level3: 20,
};
