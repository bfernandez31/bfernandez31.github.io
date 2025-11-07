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

**Usage**: Smooth, momentum-based scrolling with section snap functionality

**Configuration** (`src/scripts/smooth-scroll.ts`):
```typescript
import Lenis from '@studio-freight/lenis';

// Custom easeInOutExpo easing function
function easeInOutExpo(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) {
    return Math.pow(2, 20 * t - 10) / 2;
  }
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
}

const lenis = new Lenis({
  duration: 1.2,
  easing: easeInOutExpo,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
  syncTouch: true,        // Enable momentum scrolling
  syncTouchLerp: 0.1,
});

// Integrate with GSAP ScrollTrigger
lenis.on('scroll', () => {
  ScrollTrigger.update();
});

// Add to GSAP ticker for smooth updates
gsap.ticker.add((time) => {
  lenis?.raf(time * 1000); // Convert to milliseconds
});

// Disable GSAP's lag smoothing to prevent conflicts
gsap.ticker.lagSmoothing(0);
```

**Section Snap Functionality**:
```typescript
// Setup snap to portfolio sections
function setupSectionSnap(lenisInstance: Lenis): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-section]');
  let snapTimeout: ReturnType<typeof setTimeout> | null = null;
  let isSnapping = false;

  lenisInstance.on('scroll', ({ velocity }: { velocity: number }) => {
    // Snap when scroll velocity is low (user stopped scrolling)
    if (Math.abs(velocity) < 0.1 && !isSnapping) {
      if (snapTimeout) clearTimeout(snapTimeout);

      snapTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        let closestSection: HTMLElement | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        // Find the closest section to snap to
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = scrollY + rect.top;
          const distance = Math.abs(sectionTop - scrollY);

          if (distance < viewportHeight && distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        });

        // Snap to closest section
        if (closestSection && closestDistance > 10) {
          isSnapping = true;
          lenisInstance.scrollTo(closestSection, {
            duration: 1.2,
            easing: easeInOutExpo,
            onComplete: () => {
              isSnapping = false;
            },
          });
        }
      }, 150); // Debounce snap trigger
    }
  });
}
```

**Utility Functions**:
```typescript
// Initialize smooth scroll with snap
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

**Performance**:
- Device detection adjusts node count:
  - High-end: 100 nodes
  - Mid-tier: 50-75 nodes
  - Low-end: 30-50 nodes
- Frame rate monitoring reduces complexity if FPS drops
- Uses `requestAnimationFrame` for optimal timing

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

**Interactive Element Detection**:
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

// MutationObserver for dynamically added elements
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node instanceof Element) {
        if (node.matches(interactiveSelectors)) {
          addListenersToElement(node);
        }
        node.querySelectorAll(interactiveSelectors)
          .forEach(addListenersToElement);
      }
    }
  }
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

**Lenis Integration**:
```typescript
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

## Performance Monitoring

### Device Tier Detection

**Location**: `src/scripts/device-tier.ts`

**Purpose**: Detect device capabilities and return appropriate animation settings

**Functions**:
```typescript
type DeviceTier = 'high' | 'mid' | 'low';

export function getDeviceTier(): DeviceTier;
export function getTargetFPS(tier: DeviceTier): number;
export function getNeuralNodeCount(tier: DeviceTier): number;
```

**Detection Criteria**:
- CPU core count (navigator.hardwareConcurrency)
- Device memory (navigator.deviceMemory)
- Connection speed (navigator.connection)
- GPU performance (via benchmark test)

### Frame Rate Monitor

**Location**: `src/scripts/performance.ts`

**Purpose**: Monitor animation performance and trigger quality adjustments

**Class**: `FrameRateMonitor`

**Usage**:
```typescript
const monitor = new FrameRateMonitor({
  targetFPS: 60,
  sampleSize: 60, // Frames to average
  onDrop: (currentFPS) => {
    // Reduce animation quality
    console.warn(`FPS dropped to ${currentFPS}`);
  }
});

// In animation loop
function animate() {
  monitor.tick();
  // ... render frame
  requestAnimationFrame(animate);
}
```

**Features**:
- Running average FPS calculation
- Threshold-based performance warnings
- Automatic quality reduction triggers
- Debug overlay (development only)

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
