# Animation Architecture

## Overview

The portfolio uses a sophisticated animation system built on GSAP, Canvas 2D, and Lenis to deliver high-performance, accessible animations that enhance the user experience without compromising performance or accessibility.

## Core Animation Principles

### Performance First
- All animations use GPU-accelerated properties (transform, opacity)
- Target frame rates: 60fps desktop, 30fps mobile
- Adaptive performance based on device capabilities
- Real-time frame rate monitoring with automatic quality adjustment
- Resource cleanup on component unmount

### Accessibility First
- Always check `prefers-reduced-motion` user preference
- Provide static or simplified alternatives for all animations
- Decorative animations do not convey essential information
- Keyboard and screen reader users have equal access
- Focus management during transitions

### Progressive Enhancement
- Core functionality works without JavaScript
- Animations enhance but don't block user interactions
- Graceful degradation on older browsers
- Static fallbacks always available

## Animation Technologies

### GSAP (GreenSock Animation Platform)

**Version**: 3.13.0+

**Usage**: High-performance JavaScript animations

**Features Used**:
- `gsap.fromTo()` - Define start and end states for smooth transitions
- `gsap.quickTo()` - Ultra-fast value updates for magnetic effects
- `gsap.timeline()` - Sequence multiple animations
- ScrollTrigger plugin - Scroll-based animation triggers

**Configuration** (`src/scripts/gsap-config.ts`):
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Global defaults
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  markers: false, // Enable in development for debugging
});
```

### Canvas 2D API

**Usage**: Neural network particle animation in hero section

**Features**:
- High-DPI (Retina) canvas support
- Efficient particle system rendering
- RequestAnimationFrame loop for smooth 60fps
- Spatial partitioning for connection detection optimization

**Performance Optimizations**:
- Off-screen canvas caching (if needed)
- Throttled resize handlers with ResizeObserver
- Automatic pause when canvas not visible
- Reduced particle count on low-end devices

### Lenis Smooth Scroll

**Version**: 1.0.42+

**Usage**: Smooth, momentum-based scrolling (optimized for performance)

**Configuration** (`src/scripts/smooth-scroll.ts`):
```typescript
import Lenis from '@studio-freight/lenis';
import { prefersReducedMotion } from '@/scripts/utils/accessibility';
import { getDeviceConfig } from '@/config/performance';

export function initSmoothScroll(): Lenis | null {
  // Check device tier and user preference
  const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
  const config = getDeviceConfig(tier);

  if (!config.enableSmoothScroll || prefersReducedMotion()) {
    console.log('Smooth scroll disabled');
    return null;
  }

  // Custom easeOutCubic easing function (responsive feel)
  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  const lenis = new Lenis({
    duration: 0.6,  // Reduced from 1.2s for better responsiveness
    easing: easeOutCubic,  // Changed from easeInOutExpo
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
    syncTouch: true,
    syncTouchLerp: 0.1,
  });

  // Integrate with GSAP ScrollTrigger
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Add to GSAP ticker for smooth updates
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  // Disable GSAP's lag smoothing to prevent conflicts
  gsap.ticker.lagSmoothing(0);

  // Expose globally for navigation system
  window.lenis = lenis;
  return lenis;
}
```

**Section Snap Functionality**: REMOVED (disabled for performance and better UX)

**Utility Functions**:
```typescript
// Initialize smooth scroll (device tier aware)
export function initSmoothScroll(): Lenis | null;

// Scroll to element smoothly
export function scrollToElement(target: HTMLElement | string, options?: ScrollOptions): void;

// Scroll to top of page
export function scrollToTop(duration?: number): void;

// Pause/resume smooth scroll (for modals)
export function stopSmoothScroll(): void;
export function startSmoothScroll(): void;

// Cleanup
export function destroySmoothScroll(): void;

// Get current instance
export function getSmoothScroll(): Lenis | null;
```

## Animation Components

### Neural Network Hero Animation

**Location**: `src/scripts/neural-network.ts`

**Description**: Canvas-based particle system creating an animated network visualization

**Class**: `NeuralNetworkAnimation`

**Configuration Options**:
```typescript
interface NeuralNetworkConfig {
  colors: {
    nodes: string;    // Node color (from theme)
    edges: string;    // Connection line color
    pulses: string;   // Pulse effect color
  };
  nodeCount?: number;      // Override auto-detected count
  connectionDistance?: number; // Max distance for connections
  speed?: number;          // Animation speed multiplier
}
```

**Features**:
- Dynamic node generation with random positions and velocities
- Distance-based connection rendering
- Pulse effects along connections
- Mouse interaction (future enhancement)
- Viewport-aware rendering (pauses when off-screen)

**Performance** (Optimized):
- Device tier detection adjusts node count:
  - HIGH: 50 nodes, 60fps target
  - MID: 30 nodes, 30fps target
  - LOW: 20 nodes, 30fps target
- Async initialization to avoid blocking page load
- Intersection Observer pauses animation when hero not visible
- Simplified GSAP intro animation (batch fade instead of staggered per-node)
- Uses `requestAnimationFrame` for optimal timing
- Progressive enhancement with CSS gradient fallback

**Reduced Motion**:
- Displays static network when `prefers-reduced-motion: reduce`
- Nodes still visible but stationary
- Subtle opacity pulses only (no movement)

### Magnetic Burger Menu

**Location**: `src/scripts/magnetic-menu.ts`

**Description**: Cursor proximity effect creating magnetic attraction for burger menu icon

**Function**: `initMagneticMenu(element, options)`

**Configuration Options**:
```typescript
interface MagneticOptions {
  threshold?: number;  // Distance threshold (default: 100px)
  strength?: number;   // Pull strength 0-1 (default: 0.4)
  ease?: string;      // GSAP easing (default: 'power2.out')
}
```

**Algorithm**:
1. Calculate distance from cursor to element center
2. If distance < threshold, calculate pull vector
3. Apply falloff curve (closer = stronger pull)
4. Use GSAP `quickTo()` for ultra-smooth 60fps updates
5. Return to original position when cursor exits threshold

**Features**:
- Desktop only (disabled on touch devices)
- No effect during keyboard navigation
- Respects `prefers-reduced-motion`
- Minimal performance impact (~1-2KB, negligible CPU usage)

**Implementation**:
```typescript
export function initMagneticMenu(
  element: HTMLElement,
  options: MagneticOptions = {}
): () => void {
  const threshold = options.threshold ?? 100;
  const strength = options.strength ?? 0.4;

  // Skip on touch devices or reduced motion
  if (window.matchMedia('(pointer: coarse)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  // GSAP quickTo for ultra-fast updates
  const quickX = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power2.out' });
  const quickY = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power2.out' });

  // Mouse move handler
  // ... implementation

  // Return cleanup function
  return () => {
    // Remove listeners, reset position
  };
}
```

### Menu Overlay Animations

**Location**: `src/components/layout/BurgerMenu.astro` (inline script)

**Animations**:

1. **Menu Open**:
   - Overlay fades in (opacity 0 → 1, 300ms)
   - Links stagger in (fade + slide up, 400ms, 50ms stagger)
   - Focus moves to first link

2. **Menu Close**:
   - Overlay fades out (opacity 1 → 0, 200ms)
   - Focus returns to burger button

3. **Burger Icon Transform**:
   - Top line: rotate 45deg + translateY
   - Middle line: opacity 0
   - Bottom line: rotate -45deg + translateY
   - All transitions: CSS with `var(--transition-color)` duration

### Custom Cursor Animation

**Location**: `src/components/ui/CustomCursor.astro` and `src/scripts/custom-cursor.ts`

**Description**: High-performance cursor replacement with smooth mouse tracking and interactive element detection

**Component**: `CustomCursor.astro`

**Configuration Options**:
```typescript
interface Props {
  class?: string;  // Additional CSS classes
}
```

**Visual Design**:
- Fixed position following mouse cursor (position: fixed, z-index: 10000)
- 32px circular outline (2px border) in default state
- `mix-blend-mode: difference` for adaptive contrast
- Scales to 64px (3px border) when hovering interactive elements
- Uses theme color tokens: `var(--color-text)` for border color
- GPU-accelerated positioning with `will-change: transform`

**Mouse Tracking** (`src/scripts/custom-cursor.ts`):

**Functions**:
```typescript
// Initialize custom cursor with smooth tracking
export function initCustomCursor(): void;

// Set up smooth cursor following with GSAP quickTo
function setupSmoothCursor(cursor: HTMLElement): void;

// Set up instant cursor following (for reduced motion)
function setupInstantCursor(cursor: HTMLElement): void;

// Set up hover state detection for interactive elements
function setupHoverDetection(cursor: HTMLElement): void;

// Clean up custom cursor (remove event listeners, kill animations)
export function cleanupCustomCursor(): void;
```

**Algorithm**:
1. Check device capabilities (touch devices skip initialization)
2. Check user motion preferences (`prefers-reduced-motion`)
3. Create GSAP `quickTo()` functions for X and Y position (smooth mode)
   - Or use instant `gsap.set()` for reduced motion mode
4. Track `mousemove` events and update cursor position
5. Monitor DOM for interactive elements (links, buttons, inputs, `[data-cursor="hover"]`)
6. Add/remove `custom-cursor--hover` class on element hover
7. Use MutationObserver to detect dynamically added interactive elements

**Performance**:
- GSAP `quickTo()` provides 60fps position updates without creating new tweens
- Duration: 0.6s with `power3.out` easing for smooth, natural following
- Instant updates for reduced motion (0 duration with `gsap.set()`)
- Passive event listeners where possible
- Minimal DOM queries (cached element references)

**Interactive Element Detection** (Optimized):
```typescript
// Selectors for automatic hover detection
const interactiveSelectors = [
  'a[href]',
  'button:not([disabled])',
  '[data-cursor="hover"]',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
].join(', ');

// Static selector approach with event delegation (MutationObserver removed for performance)
document.querySelectorAll(interactiveSelectors).forEach(element => {
  element.addEventListener('mouseenter', () => {
    cursor.classList.add('custom-cursor--hover');
  });
  element.addEventListener('mouseleave', () => {
    cursor.classList.remove('custom-cursor--hover');
  });
});
```

**CSS Media Queries**:
```css
/* Hide system cursor on desktop */
@media (hover: hover) and (pointer: fine) {
  body { cursor: none; }
}

/* Hide custom cursor on touch devices */
@media (hover: none) or (pointer: coarse) {
  .custom-cursor { display: none; }
}
```

**Accessibility**:
- `aria-hidden="true"` - cursor is decorative only
- `pointer-events: none` - cursor doesn't interfere with interactions
- Respects `prefers-reduced-motion` by using instant position updates
- Disabled on touch devices (system cursor restored)
- Disabled on MID/LOW tier devices for better performance
- Keyboard navigation unaffected by custom cursor
- Scale transition respects reduced motion preferences

**Lifecycle Management**:
```typescript
// Initialize on page load
initCustomCursor();

// Clean up on page navigation (Astro)
document.addEventListener('astro:before-swap', () => {
  cleanupCustomCursor();
});
```

**State Management**:
```typescript
interface CursorState {
  cursor: HTMLElement | null;           // Cursor element reference
  quickX: ((value: number) => void) | null;  // GSAP quickTo X function
  quickY: ((value: number) => void) | null;  // GSAP quickTo Y function
  isHovering: boolean;                  // Current hover state
  cleanup: (() => void) | null;         // Cleanup function
}
```

### Scroll Progress Animation

**Location**: `src/components/ui/ScrollProgress.astro` and `src/scripts/scroll-progress.ts`

**Description**: Visual scroll progress indicator that dynamically tracks page scroll position

**Component**: `ScrollProgress.astro`

**Configuration Options**:
```typescript
interface Props {
  zIndex?: number;  // Z-index for layering (default: 9999)
}
```

**Visual Design**:
- Fixed position at top of viewport (top: 0, left: 0)
- 4px height (3px on high-DPI displays)
- Transparent background, no pointer events
- Gradient fill: `linear-gradient(90deg, var(--color-primary), var(--color-secondary))`
- Width animates from 0% to 100% based on scroll progress
- Smooth transition: 0.1s ease-out (respects reduced motion)

**Scroll Tracking** (`src/scripts/scroll-progress.ts`):

**Functions**:
```typescript
// Initialize scroll progress tracking
export function initScrollProgress(): void;

// Calculate scroll progress percentage (0-100)
function calculateScrollProgress(): number;

// Update progress bar width and ARIA attributes
function updateProgressBar(): void;

// Cleanup listeners and animation frames
export function destroyScrollProgress(): void;
```

**Algorithm**:
1. Calculate scrollable height: `scrollHeight - clientHeight`
2. Calculate current scroll position: `scrollY`
3. Compute percentage: `(scrollY / scrollableHeight) * 100`
4. Clamp value between 0-100%
5. Update progress bar width via CSS width property
6. Update ARIA `aria-valuenow` attribute for accessibility

**Performance**:
- Integrates with Lenis smooth scroll for synchronized updates
- Falls back to native scroll events if Lenis unavailable
- Uses `requestAnimationFrame` throttling to prevent excessive updates
- Handles window resize events (recalculates scrollable height)
- Passive event listeners for better scrolling performance

**Lenis Integration** (with lazy loading):
```typescript
// Lazy load scroll progress on first scroll event
export function initScrollProgressLazy() {
  let hasScrolled = false;

  const onScroll = () => {
    if (!hasScrolled) {
      hasScrolled = true;
      window.removeEventListener('scroll', onScroll);

      // Dynamically import and initialize
      import('./scroll-progress').then(module => {
        module.initScrollProgress();
      });
    }
  };

  window.addEventListener('scroll', onScroll, { once: true, passive: true });
}

// Prefer Lenis scroll event for smoother updates
if (window.lenis) {
  window.lenis.on('scroll', updateProgressBar);
} else {
  window.addEventListener('scroll', handleScroll, { passive: true });
}
```

**Accessibility**:
- ARIA `role="progressbar"` for screen reader support
- `aria-label="Page scroll progress"` describes purpose
- `aria-valuemin="0"`, `aria-valuemax="100"` define range
- `aria-valuenow` updates dynamically with scroll position
- `pointer-events: none` prevents interference with user interaction
- Respects `prefers-reduced-motion` by disabling transition

**Edge Cases Handled**:
- No scrollable content (progress stays at 0%)
- Scroll at top (0%) or bottom (100%) of page
- Window resize during scroll (recalculates dynamically)
- Lenis instance not available (falls back to native events)

### Cursor Trail Animation (REMOVED)

**Status**: The cursor trail has been removed entirely in the performance optimization update.

**Reason**: High overhead (60fps canvas drawing with continuous particle spawning) with relatively low UX value. Performance profiling showed significant CPU usage for minimal visual benefit.

**Location**: `src/scripts/cursor-trail.ts` (DELETED)

**Alternative**: The custom cursor still provides visual feedback through size scaling when hovering over interactive elements, which is sufficient for user experience while maintaining optimal performance.

### Glitch Effect (CSS-only)

**Location**: `src/styles/effects/glitch.css`

**Description**: Pure CSS cyberpunk-style RGB channel separation effect with hover-triggered animation

**CSS Class**: `.glitch-effect`

**Visual Effect**:
- RGB channel separation using layered `text-shadow` offsets
- Red, green, and blue color channels shift in opposite directions
- Creates chromatic aberration effect mimicking analog video glitches
- 0.3s animation duration with cubic-bezier easing (0.25, 0.46, 0.45, 0.94)
- Two animation variants: `glitch` and `glitch-2` for visual variety

**Keyframe Animation**:
```css
@keyframes glitch {
  0% {
    text-shadow:
      0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  /* ... intermediate keyframes with varying offsets ... */
  100% {
    text-shadow:
      -0.025em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}
```

**Trigger Behavior**:
- **Desktop (hover-enabled devices)**: Animation triggers on `:hover` state
- **Touch devices**: Static RGB offset appears on `:active` state (no animation for performance)
- **Reduced motion**: Disables animation, applies subtle static RGB offset instead

**Usage**:
```html
<!-- Basic glitch effect -->
<h1 class="glitch-effect">Glitchy Text</h1>

<!-- Alternative animation variant -->
<h1 class="glitch-effect glitch-effect--alt">Alternate Glitch</h1>
```

**Integration Example** (Hero component):
```astro
<!-- src/components/sections/Hero.astro -->
<h1 class="hero__headline glitch-effect" data-split-text="char">
  {headline}
</h1>
```

**Performance Characteristics**:
- Zero JavaScript required (pure CSS)
- GPU-accelerated `text-shadow` property
- ~2KB CSS footprint (including both animation variants)
- No runtime overhead (browser-native CSS animation)
- Automatically disabled on touch devices via `@media (hover: none)`

**Accessibility**:
- Respects `prefers-reduced-motion` preference (disables animation)
- Provides static fallback: subtle RGB offset without movement
- No screen reader impact (purely visual decoration)
- Does not interfere with text selection or readability

**Media Query Strategy**:
```css
/* Desktop only: hover-triggered animation */
@media (hover: hover) and (pointer: fine) {
  .glitch-effect:hover {
    animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

/* Touch devices: static effect on tap */
@media (hover: none) {
  .glitch-effect:active {
    text-shadow: 0.02em 0 0 rgba(255, 0, 0, 0.5),
                 -0.02em 0 0 rgba(0, 0, 255, 0.5);
  }
}

/* Reduced motion: disable animation */
@media (prefers-reduced-motion: reduce) {
  .glitch-effect:hover {
    animation: none;
    text-shadow: 0.02em 0 0 rgba(255, 0, 0, 0.5),
                 -0.02em 0 0 rgba(0, 0, 255, 0.5);
  }
}
```

**Design Rationale**:
- Pure CSS approach eliminates JavaScript overhead
- Hover trigger provides interactive feedback without being distracting
- RGB offset values scaled in `em` units for responsive sizing
- Opacity (0.75) prevents over-saturation while maintaining visibility
- Cubic-bezier easing creates snappy, mechanical feel matching cyberpunk aesthetic
- Two variants prevent visual monotony when multiple elements use effect

**Browser Compatibility**:
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Graceful degradation: no effect on older browsers (text remains readable)
- No polyfills required

### Text Split Animations

**Location**: `src/scripts/text-animations.ts`

**Description**: Declarative text reveal animation utility that splits text into characters, words, or lines and animates with GSAP stagger effects

**Functions**:
```typescript
// Initialize text animations for all [data-split-text] elements
export function initTextAnimations(): void;

// Clean up all text animations on page navigation
export function cleanupTextAnimations(): void;

// Split element's text content into fragments
function splitText(element: HTMLElement, type: SplitType): SplitFragment[];

// Create GSAP animation timeline for fragments
function createTimeline(fragments: SplitFragment[], config: AnimationConfig): gsap.core.Timeline;

// Animate a single element (called by IntersectionObserver)
function animateElement(element: HTMLElement): void;
```

**Types**:
```typescript
export type SplitType = 'char' | 'word' | 'line';

export interface AnimationConfig {
  type: SplitType;
  duration: number;  // Animation duration per fragment (seconds)
  delay: number;     // Stagger delay between fragments (seconds)
  easing: EasingFunction;  // GSAP easing function name
}

export interface SplitFragment {
  element: HTMLSpanElement;  // DOM span wrapping this fragment
  originalText: string;      // Original text content
  index: number;             // Zero-indexed position
}

export interface AnimatedTextElement {
  element: HTMLElement;      // Original element with data-split-text
  config: AnimationConfig;   // Parsed animation configuration
  fragments: SplitFragment[]; // Array of split text fragments
  timeline: gsap.core.Timeline | null;  // GSAP timeline
  observer: IntersectionObserver | null; // Observer instance
  animated: boolean;         // Has animation been triggered?
}
```

**Configuration Options**:
```typescript
// Default animation values
const DEFAULT_CONFIG = {
  type: 'char',
  duration: 0.6,
  delay: 0.05,
  easing: 'power3.out',
};

// Validation constraints
const CONFIG_CONSTRAINTS = {
  duration: { min: 0.1, max: 5.0 },
  delay: { min: 0.01, max: 1.0 },
  maxFragments: 1000,  // Performance limit (error)
  warnFragments: 500,  // Warning threshold
};
```

**Splitting Algorithms**:

1. **Character Splitting**:
   - Uses `Array.from()` for Unicode support (handles multi-byte characters, emojis)
   - Each character wrapped in `<span style="display: inline-block">`
   - Best for headlines and short text (<100 characters)

2. **Word Splitting**:
   - Uses regex `/(\s+)/` to split while preserving whitespace
   - Each word wrapped in `<span style="display: inline-block">`
   - Best for section titles and medium text (100-300 characters)

3. **Line Splitting**:
   - Uses `Range.getClientRects()` to detect visual line breaks
   - Detects line breaks by comparing `rect.top` values character by character
   - Each line wrapped in `<span style="display: inline-block">`
   - Best for paragraphs and long text (>300 characters)
   - Known limitation: line breaks calculated at initialization, not recalculated on resize

**Animation Pattern**:
```typescript
// Animation effect: fade + slide up
gsap.fromTo(fragments.map(f => f.element),
  {
    opacity: 0,
    y: 20,  // Start 20px below final position
  },
  {
    opacity: 1,
    y: 0,
    duration: config.duration,
    ease: config.easing,
    stagger: {
      amount: config.delay * fragments.length,
      from: 'start',
    },
  }
);
```

**Accessibility Structure**:
```html
<!-- Before splitting -->
<h1 data-split-text="char">Hello World</h1>

<!-- After splitting (simplified) -->
<h1>
  <span class="sr-only">Hello World</span> <!-- Screen readers read this -->
  <span aria-hidden="true">
    <span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>
    <span> </span>
    <span>W</span><span>o</span><span>r</span><span>l</span><span>d</span>
  </span>
</h1>
```

**Performance**:
- IntersectionObserver with 50% threshold for viewport-based triggering
- Global observer shared across all elements (efficient resource usage)
- Trigger once only (unobserve after animation)
- GPU-accelerated properties only (opacity, transform translateY)
- Warning at 500 fragments, error at 1000 fragments
- Initialization target: <100ms for 100-character text
- 60fps on HIGH tier devices, 30fps minimum on MID tier

**Accessibility**:
- `prefers-reduced-motion` support: instant reveal with `gsap.set()` instead of animation
- Screen reader compatibility: original text in `.sr-only` span, split text in `aria-hidden="true"` wrapper
- Semantic HTML preserved for assistive technologies

**Lifecycle Management**:
```typescript
// Initialize on page load
initTextAnimations();

// Cleanup on page navigation (Astro)
document.addEventListener('astro:before-swap', cleanupTextAnimations);
```

**Usage Examples**:
```astro
<!-- Character animation for hero headline -->
<h1 data-split-text="char">Welcome</h1>

<!-- Word animation for section title -->
<h2 data-split-text="word" data-split-delay="0.08">About Me</h2>

<!-- Line animation for paragraph -->
<p data-split-text="line" data-split-duration="0.4">
  Long paragraph that reveals line by line...
</p>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Error Handling**:
- Empty text content: skipped with console warning
- Invalid split type: falls back to defaults with error
- Invalid config values: falls back to defaults with warning
- Too many fragments (>1000): skipped with error
- GSAP not found: error logged (graceful degradation)
- IntersectionObserver not supported: error logged (graceful degradation)

**Known Limitations**:
- Nested HTML tags (strong, em, etc.) are stripped by `textContent` extraction
- Line breaks not recalculated on viewport resize (calculated once at init)
- No manual trigger API (viewport-based only in v1)
- No animation repeat support (trigger once only in v1)

## Performance Monitoring

### Device Tier Detection

**Location**: `src/scripts/performance/device-tier.ts`

**Purpose**: Detect device capabilities and classify for adaptive performance

**Functions**:
```typescript
enum DeviceTierLevel {
  HIGH = 'high',
  MID = 'mid',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

export function detectDeviceTier(): DeviceTierClassification;
export function getDeviceConfig(tier: DeviceTierLevel): DeviceTierConfig;
```

**Detection Criteria** (Priority Order):
1. **CPU Core Count** (`navigator.hardwareConcurrency`):
   - ≥8 cores → HIGH (if not downgraded by other factors)
   - ≥4 cores → MID
   - <4 cores → LOW
2. **Device Memory** (`navigator.deviceMemory`):
   - ≥8GB → HIGH
   - ≥4GB → MID
   - <4GB → LOW
3. **Connection Speed** (`navigator.connection.effectiveType`):
   - 'slow-2g', '2g', '3g' → Downgrade tier by one level
   - '4g' → No adjustment
4. **Fallback**: If APIs unavailable → UNKNOWN (defaults to MID tier)

**Configuration Mapping**:
```typescript
const DEVICE_TIER_CONFIGS = {
  HIGH: { particles: 50, targetFPS: 60, enableCursorEffects: true, enableSmoothScroll: true },
  MID: { particles: 30, targetFPS: 30, enableCursorEffects: false, enableSmoothScroll: true },
  LOW: { particles: 20, targetFPS: 30, enableCursorEffects: false, enableSmoothScroll: false },
  UNKNOWN: { particles: 30, targetFPS: 30, enableCursorEffects: false, enableSmoothScroll: true }
};
```

**Global Exposure**:
- Stored on `window.__DEVICE_TIER__` for access in all scripts
- Set as CSS custom property `--device-tier` for conditional styling
- Evaluated once on page load

### Performance Monitor

**Location**: `src/scripts/performance/performance-monitor.ts`

**Purpose**: Real-time monitoring of animation performance and Core Web Vitals (development only)

**Class**: `PerformanceMonitor`

**Usage**:
```typescript
import { performanceMonitor } from '@/scripts/performance/performance-monitor';

// Initialize in development mode only
if (import.meta.env.DEV) {
  performanceMonitor.startMonitoring();
}
```

**Features**:
- Real-time FPS tracking via requestAnimationFrame (rolling average over last 60 frames)
- Core Web Vitals monitoring via PerformanceObserver (LCP, FID, CLS)
- Memory usage tracking (Chrome-only via performance.memory)
- Budget violation detection and logging
- Console reporting every 30 seconds with current metrics
- Automatic performance degradation warnings

### Lazy Loader

**Location**: `src/scripts/performance/lazy-loader.ts`

**Purpose**: Priority-based lazy loading of non-critical components

**Functions**:
```typescript
enum LazyLoadPriority {
  IMMEDIATE = 0,  // Load immediately (hero, main nav)
  HIGH = 1,       // Load when user scrolls (scroll progress)
  MEDIUM = 2,     // Load when user scrolls past hero (nav dots)
  LOW = 3         // Load after idle timeout (cursor effects)
}

export function lazyLoad(
  id: string,
  loader: () => Promise<void>,
  options: LazyLoadOptions
): Promise<void>;
```

**Trigger Types**:
- **intersection**: Use IntersectionObserver to load when element visible
- **scroll**: Load on first scroll event
- **idle**: Load during browser idle time (requestIdleCallback)
- **timeout**: Load after specified delay

**Usage Examples**:
```typescript
// Scroll progress - load on first scroll
lazyLoad('scroll-progress',
  () => import('@/scripts/scroll-progress').then(m => m.initScrollProgress()),
  { trigger: 'scroll', priority: LazyLoadPriority.HIGH }
);

// Navigation dots - load when hero exits viewport
lazyLoad('navigation-dots',
  () => import('@/scripts/navigation-dots').then(m => m.initNavigationDots()),
  { trigger: 'intersection', priority: LazyLoadPriority.MEDIUM, observerOptions: { threshold: 0.1 } }
);

// Custom cursor - load after 2s idle
lazyLoad('custom-cursor',
  () => import('@/scripts/custom-cursor').then(m => m.initCustomCursor()),
  { trigger: 'idle', priority: LazyLoadPriority.LOW, timeout: 2000 }
);
```

**Error Handling**:
- Graceful degradation if loader Promise rejects
- Component remains unloaded but site stays functional
- Errors logged to console without throwing

## Animation Configuration

### Centralized Constants

**Location**: `src/scripts/animation-config.ts`

**Purpose**: Single source of truth for all animation values

**Structure**:
```typescript
export const NEURAL_NETWORK_DEFAULTS = {
  COLORS: {
    NODES: 'var(--color-primary)',
    EDGES: 'var(--color-accent)',
    PULSES: 'var(--color-secondary)',
  },
  NODE_COUNT: {
    HIGH: 100,
    MID: 75,
    LOW: 50,
  },
  CONNECTION_DISTANCE: 150,
  SPEED: 1.0,
  FPS_TARGET: {
    DESKTOP: 60,
    MOBILE: 30,
  },
};

export const MAGNETIC_MENU_DEFAULTS = {
  THRESHOLD: 100,
  STRENGTH: 0.4,
  EASE: 'power2.out',
};

export const SCROLL_ANIMATION_DEFAULTS = {
  DURATION: 1.2,
  STAGGER: 0.05,
  EASE: 'power2.out',
};
```

### Global Animation Styles

**Location**: `src/styles/animations.css`

**Purpose**: CSS-based animation utilities and reduced motion support

**Contents**:
```css
/* GPU-accelerated transitions */
:root {
  --transition-color: 0.3s ease;
  --transition-transform: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-color: 0.01ms;
    --transition-transform: 0.01ms;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* GPU acceleration hints */
.gpu-accelerated {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## Accessibility Implementation

### Motion Preferences

**Detection**:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

**Response**:
- Neural network: Static display with subtle opacity pulses only
- Magnetic menu: Disabled (no cursor following)
- GSAP animations: Instant transitions (duration: 0.01ms)
- Smooth scroll: Disabled or reduced

### Focus Management

**Location**: `src/scripts/accessibility.ts`

**Function**: `trapFocus(container: HTMLElement)`

**Purpose**: Keep keyboard navigation within modal/menu

**Implementation**:
```typescript
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTab);

  return () => container.removeEventListener('keydown', handleTab);
}
```

## Animation Lifecycle

### Initialization
1. Check `prefers-reduced-motion` preference
2. Detect device tier and set quality level
3. Initialize animation instance with config
4. Start animation loop or GSAP timeline

### Runtime
1. Monitor frame rate continuously
2. Adjust quality if performance drops
3. Pause animations when not visible (Intersection Observer)
4. Handle window resize events

### Cleanup
1. Cancel animation frames
2. Remove event listeners
3. Dispose of GSAP instances
4. Clear canvas context
5. Return element to original state

**Example**:
```typescript
// In Astro component script
document.addEventListener('astro:before-swap', () => {
  animation.destroy();
});
```

## Best Practices

### Do's
- Always check `prefers-reduced-motion` before animating
- Use GPU-accelerated properties (transform, opacity)
- Provide static fallbacks
- Clean up resources on unmount
- Test on low-end devices
- Use GSAP `quickTo()` for frequently updated values
- Centralize animation constants
- Document performance budgets

### Don'ts
- Don't animate layout properties (width, height, top, left)
- Don't block user interaction with animations
- Don't convey essential information through animation alone
- Don't forget to remove event listeners
- Don't use animations longer than 500ms for UI feedback
- Don't trust device detection alone (also monitor FPS)
- Don't hardcode animation values (use config)

## Testing Animation Performance

### Manual Testing
1. Chrome DevTools Performance panel
2. Enable "Show FPS meter" in Rendering panel
3. Use CPU throttling (4x slowdown) to simulate low-end devices
4. Test with `prefers-reduced-motion` enabled
5. Verify animations pause when off-screen

### Automated Testing
```typescript
// tests/unit/animations/neural-network.test.ts
import { describe, test, expect } from 'bun:test';
import { NeuralNetworkAnimation } from '@/scripts/neural-network';

describe('NeuralNetworkAnimation', () => {
  test('respects reduced motion preference', () => {
    // Mock matchMedia
    window.matchMedia = (query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    });

    const canvas = document.createElement('canvas');
    const animation = new NeuralNetworkAnimation(canvas);

    expect(animation.isStatic).toBe(true);
  });
});
```

## Future Enhancements

### Planned Animations
- Neural pathway links in navigation menu (User Story 2 enhancement)
- Hexagonal grid hover effects (User Story 3)
- Scroll-based parallax for sections
- Interactive project tiles with 3D transforms
- Terminal typing effect for contact form
- Commit log timeline animation for blog

### Performance Optimizations
- Web Workers for particle calculations
- OffscreenCanvas for background rendering
- WebGL fallback for complex animations
- Shared animation timeline for synchronized effects

### Accessibility Improvements
- User-controlled animation preferences (settings panel)
- Pause/play controls for looping animations
- Animation speed controls
- High contrast mode support
