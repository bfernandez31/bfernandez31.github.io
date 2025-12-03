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

### Native Scroll

**Usage**: Standard browser scroll behavior for reliable, performant navigation

**Implementation**:
- No smooth scroll library required
- Native browser scroll behavior across all devices
- Instant response to user input
- Zero JavaScript overhead for scroll management
- Compatible with all browsers and devices

**Design Decision**:
- Smooth scroll (Lenis) disabled for better performance and native feel
- Native scroll provides immediate, predictable response
- Reduces complexity and eliminates potential scroll conflicts
- Better compatibility with browser features (back/forward, accessibility tools)

**Navigation Integration**:
- Navigation links use standard anchor hash navigation
- Browser handles scroll-to-target natively
- Focus management still handled by JavaScript for accessibility
- URL hash updates work naturally with browser behavior

## Animation Components

### Hero Section (Simplified)

**Status**: Neural network animation removed for better performance

**Current Implementation**:
- Clean, minimal hero section with dark background
- No canvas or particle system animations
- Text-focused layout without distracting background effects
- Zero animation overhead in hero section

**Performance Benefits**:
- Instant page load without canvas initialization
- No ongoing animation loop consuming CPU/GPU
- Reduced JavaScript bundle size
- Better Core Web Vitals scores (LCP, FCP)

**Design Decision**:
- Neural network animation removed as it didn't add clear value
- Clean background provides better focus on content
- Maintains professional appearance without complexity
- Allows for faster, more stable page loads

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

### Custom Cursor (Removed)

**Status**: Custom cursor animation removed for better performance and native experience

**Design Decision**:
- Custom cursor removed to reduce JavaScript complexity
- Native browser cursor provides familiar, reliable experience
- No performance overhead from cursor tracking
- Better accessibility with native cursor states
- Maintains professional appearance without custom effects

**Benefits of Removal**:
- Zero JavaScript for cursor management
- No GSAP quickTo() calls or mousemove event listeners
- Simpler codebase without cursor-related components
- Better compatibility across browsers and devices
- Native cursor already provides excellent UX

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
- Uses native scroll events for optimal performance
- Uses `requestAnimationFrame` throttling to prevent excessive updates
- Handles window resize events (recalculates scrollable height)
- Passive event listeners for better scrolling performance

**Implementation** (with lazy loading):
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

// Use native scroll events
window.addEventListener('scroll', handleScroll, { passive: true });
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

### Cursor Effects (Removed)

**Status**: Cursor trail and custom cursor both removed for better performance

**Reason**:
- Cursor trail: High overhead with 60fps canvas drawing
- Custom cursor: Unnecessary complexity for limited UX benefit
- Both removed as part of animation cleanup and optimization

**Impact**:
- Reduced JavaScript bundle size
- Lower CPU/GPU usage
- Native browser cursor provides familiar, reliable experience

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

**Initial Hidden State** (Fixed in PBF-18):
```css
/* src/styles/animations.css */
/* Hide text with data-split-text until animation initializes */
[data-split-text] {
  opacity: 0;
}

/* Prevent flicker on reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-split-text] {
    opacity: 1;
  }
}
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

**Structure** (Updated in PBF-18):
```typescript
// Neural network constants removed (feature removed)

export const MAGNETIC_MENU_DEFAULTS = {
  THRESHOLD: 100,
  STRENGTH: 0.4,
  EASE: 'power2.out',
};

export const TEXT_ANIMATION_DEFAULTS = {
  DURATION: 0.6,
  DELAY: {
    CHAR: 0.05,
    WORD: 0.05,
    LINE: 0.1,
  },
  EASE: 'power3.out',
};
```

### Global Animation Styles

**Location**: `src/styles/animations.css`

**Purpose**: CSS-based animation utilities and reduced motion support

**Contents** (Updated in PBF-18):
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

  /* Show text immediately when reduced motion enabled */
  [data-split-text] {
    opacity: 1 !important;
  }
}

/* Hide text split elements until animation initializes */
[data-split-text] {
  opacity: 0;
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
- Text split animations: Instant display (no animation)
- Magnetic menu: Disabled (no cursor following)
- GSAP animations: Instant transitions (duration: 0.01ms)
- Scroll: Native browser behavior (no smooth scroll)

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
