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

### Hero Section Animation (SIMPLIFIED)

**Location**: `src/components/sections/Hero.astro` (component-scoped CSS)

**Status**: The complex WebGL 3D hero animation (PBF-28) has been replaced with a simple CSS-only implementation (PBF-30) for improved reliability and performance.

**Description**: Clean, name-first hero layout with simple CSS fade-in animation.

**Animation Pattern**:
- Single fade-in animation for entire hero content container
- No text splitting or character-by-character effects
- No WebGL/Canvas rendering required
- Progressive enhancement approach

**CSS Implementation**:
```css
.hero__content--animate {
  opacity: 0;
  transform: translateY(20px);
  animation: heroFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
}

@keyframes heroFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Reduced Motion Support**:
```css
@media (prefers-reduced-motion: reduce) {
  .hero__content--animate {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

**Features**:
- Zero JavaScript required for content rendering
- GPU-accelerated properties (opacity, transform)
- Immediate content visibility (no animation blocking)
- Minimal footprint (~100 bytes CSS)
- Works before JavaScript loads (progressive enhancement)

**Removed Components** (from PBF-28):
- ~~`src/scripts/hero/hero-controller.ts`~~ (DELETED)
- ~~`src/scripts/hero/background-3d.ts`~~ (DELETED)
- ~~`src/scripts/hero/cursor-tracker.ts`~~ (DELETED)
- ~~`src/scripts/hero/typography-reveal.ts`~~ (DELETED)
- ~~`src/scripts/hero/performance-monitor.ts`~~ (DELETED)
- ~~`src/scripts/hero/types.ts`~~ (DELETED)
- ~~OGL dependency (~24KB)~~ (REMOVED from package.json)

**Bundle Size Reduction**:
- Removed ~30KB of JavaScript (OGL + hero modules)
- Current hero: ~2KB CSS (component-scoped)

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

### Custom Cursor Animation (REMOVED)

**Status**: The custom cursor feature has been removed entirely in PBF-22.

**Reason**: User feedback indicated the cursor "adds nothing of value" to the experience. Removing it reduces bundle size (~8KB), simplifies the codebase, and eliminates potential performance overhead and bugs.

**Location**: Component and script files deleted:
- `src/components/ui/CustomCursor.astro` (DELETED)
- `src/scripts/custom-cursor.ts` (DELETED)

**Alternative**: The portfolio now uses the standard system cursor throughout the site. Interactive elements rely on native browser hover states and CSS transitions for visual feedback.

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

### Hero Text Animations

**Location**: `src/components/sections/Hero.astro` (inline styles and script)

**Description**: Simplified CSS-based fade-in animation for hero section text content

**Animation Pattern**:
- Hero content container fades in with upward slide (translateY)
- No text splitting or character-by-character animation
- Single animation timeline for entire content block

**CSS Implementation**:
```css
.hero__content {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.hero__content.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero__content {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**JavaScript Trigger**:
```typescript
// Simple visibility trigger on page load
requestAnimationFrame(() => {
  const heroContent = document.querySelector('.hero__content');
  heroContent?.classList.add('visible');
});
```

**Benefits**:
- Simpler codebase with fewer potential failure points
- Text is always visible (no risk of invisible/null text)
- Progressive enhancement: text visible even before JavaScript executes
- Reliable performance across all devices
- Reduced bundle size (no text-splitting library required)

**Accessibility**:
- Respects `prefers-reduced-motion` preference (instant reveal, no animation)
- No complex DOM manipulation that could confuse screen readers
- Text remains in natural HTML structure for assistive technologies

**Performance**:
- GPU-accelerated properties only (opacity, transform)
- Single CSS transition (no GSAP overhead for hero text)
- ~100 bytes CSS + ~50 bytes JS (minimal footprint)

**Design Rationale**:
User feedback indicated text split animations were buggy ("les animations bug") and resulted in null/invisible text. The simplified approach prioritizes reliability and readability over visual flair.

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
