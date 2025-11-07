# Data Model: Performance Optimization

**Feature**: Performance Optimization for GitHub Pages
**Branch**: `011-1522-fix-project`
**Date**: 2025-11-07

## Overview

This document defines the data structures, entities, and state management for the performance optimization feature. Since this is a client-side static site optimization, there are no traditional database entities. Instead, we define configuration objects, state management interfaces, and runtime data structures.

---

## Entity 1: DeviceTier

**Purpose**: Classifies user's device capabilities to enable adaptive performance optimizations.

**Data Structure**:
```typescript
enum DeviceTierLevel {
  HIGH = 'high',
  MID = 'mid',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

interface DeviceTierClassification {
  tier: DeviceTierLevel;
  cpuCores: number;
  memory: number; // GB, may be undefined if API not available
  connectionSpeed: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  reasons: string[]; // Human-readable reasons for classification (debugging)
}

interface DeviceTierConfig {
  particles: number; // Neural network particle count
  targetFPS: number; // Animation frame rate target
  enableCursorEffects: boolean;
  enableSmoothScroll: boolean;
  lazyLoadThreshold: number; // ms delay before lazy loading components
}
```

**Classification Logic**:
- **HIGH**: `cpuCores >= 8 OR memory >= 8 OR (cpuCores >= 4 AND memory >= 4)`
- **MID**: `cpuCores >= 4 OR memory >= 4` (but not HIGH criteria)
- **LOW**: `cpuCores < 4 AND memory < 4`
- **UNKNOWN**: Device APIs not available (fallback to MID tier for safety)
- **Connection modifier**: Downgrade tier by one level if `connectionSpeed === 'slow-2g' OR '2g' OR '3g'`

**Configuration Mapping**:
```typescript
const DEVICE_TIER_CONFIGS: Record<DeviceTierLevel, DeviceTierConfig> = {
  [DeviceTierLevel.HIGH]: {
    particles: 50,
    targetFPS: 60,
    enableCursorEffects: true,
    enableSmoothScroll: true,
    lazyLoadThreshold: 0
  },
  [DeviceTierLevel.MID]: {
    particles: 30,
    targetFPS: 30,
    enableCursorEffects: false, // Disable cursor trail, simplify custom cursor
    enableSmoothScroll: true,
    lazyLoadThreshold: 500
  },
  [DeviceTierLevel.LOW]: {
    particles: 20,
    targetFPS: 30,
    enableCursorEffects: false,
    enableSmoothScroll: false, // Disable Lenis, use native scroll
    lazyLoadThreshold: 1000
  },
  [DeviceTierLevel.UNKNOWN]: {
    particles: 30, // Default to MID settings
    targetFPS: 30,
    enableCursorEffects: false,
    enableSmoothScroll: true,
    lazyLoadThreshold: 500
  }
};
```

**Validation Rules**:
- `particles` must be positive integer (min: 10, max: 100)
- `targetFPS` must be 30 or 60 (standard animation frame rates)
- `lazyLoadThreshold` must be non-negative integer (0 = immediate, >0 = delayed in ms)

**State Transitions**:
- Device tier is determined once on page load
- If user changes network conditions (e.g., WiFi to cellular), tier is re-evaluated on next page load (no runtime re-classification to avoid jarring UX changes)

**Persistence**: None - device tier is re-calculated on every page load based on current browser APIs

---

## Entity 2: PerformanceBudget

**Purpose**: Defines performance targets and thresholds for runtime validation and CI/CD gates.

**Data Structure**:
```typescript
interface PerformanceBudget {
  // Core Web Vitals
  lcp: { target: number; max: number }; // Largest Contentful Paint (ms)
  fid: { target: number; max: number }; // First Input Delay (ms)
  cls: { target: number; max: number }; // Cumulative Layout Shift (score)

  // Additional Metrics
  fcp: { target: number; max: number }; // First Contentful Paint (ms)
  tti: { target: number; max: number }; // Time to Interactive (ms)
  tbt: { target: number; max: number }; // Total Blocking Time (ms)

  // Resource Budgets
  totalPageWeight: { target: number; max: number }; // KB (uncompressed)
  criticalAssets: { target: number; max: number }; // KB (uncompressed)

  // Animation Performance
  minFPS: number; // Minimum acceptable frame rate during animations
  maxCPU: number; // Maximum CPU usage percentage during animations
  maxMemory: number; // Maximum heap size in MB

  // Lighthouse Scores (0-100)
  lighthousePerformance: { mobile: number; desktop: number };
  lighthouseAccessibility: number;
}
```

**Default Values** (from spec requirements):
```typescript
const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: { target: 2000, max: 2500 },
  fid: { target: 50, max: 100 },
  cls: { target: 0.05, max: 0.1 },
  fcp: { target: 1500, max: 2000 },
  tti: { target: 3000, max: 3500 },
  tbt: { target: 200, max: 300 },
  totalPageWeight: { target: 400, max: 500 },
  criticalAssets: { target: 150, max: 200 },
  minFPS: 30,
  maxCPU: 40,
  maxMemory: 100,
  lighthousePerformance: { mobile: 85, desktop: 95 },
  lighthouseAccessibility: 95
};
```

**Validation Rules**:
- All `target` values must be less than or equal to `max` values
- Core Web Vitals thresholds align with Google's "good" rating criteria
- Resource budgets must be positive integers
- Lighthouse scores must be in range 0-100

**Usage**:
- **Development**: Runtime monitoring warns when metrics exceed `target` values
- **CI/CD**: Build fails if Lighthouse scores below budget or key metrics exceed `max` values
- **Production**: Performance Observer logs violations to console (optional analytics integration)

**Persistence**: Static configuration (JSON/TypeScript constant), no runtime modification

---

## Entity 3: AnimationState

**Purpose**: Tracks active animations and their resource usage for coordination and cleanup.

**Data Structure**:
```typescript
interface AnimationInstance {
  id: string; // Unique identifier (e.g., 'neural-network', 'scroll-progress')
  type: 'canvas' | 'gsap' | 'css' | 'lenis';
  isActive: boolean; // Currently running
  isPaused: boolean; // Temporarily paused (e.g., section not visible)
  frameCount: number; // Total frames rendered (for debugging)
  averageFPS: number; // Rolling average FPS over last 60 frames
  lastFrameTime: number; // DOMHighResTimeStamp of last frame
  cleanup: (() => void) | null; // Cleanup function to call on destroy
}

interface AnimationStateManager {
  animations: Map<string, AnimationInstance>;
  globalFPS: number; // Overall page FPS (calculated from rAF)
  isPaused: boolean; // Global pause state (e.g., tab not visible)
}
```

**Operations**:
```typescript
interface AnimationStateManagerAPI {
  register(id: string, type: AnimationInstance['type'], cleanup: () => void): void;
  unregister(id: string): void;
  pause(id: string): void;
  resume(id: string): void;
  pauseAll(): void;
  resumeAll(): void;
  getAnimationState(id: string): AnimationInstance | null;
  calculateGlobalFPS(): number;
  getActiveAnimationCount(): number;
  cleanupAll(): void; // Call on page navigation (astro:before-swap)
}
```

**State Transitions**:
```
[Registered] -> [Active] -> [Paused] -> [Active] -> [Destroyed]
                   ^            |
                   |____________|
```

- **Registered**: Animation added to state manager, not yet started
- **Active**: Animation running (requestAnimationFrame loop)
- **Paused**: Animation temporarily stopped (e.g., section not visible, tab backgrounded)
- **Destroyed**: Animation cleaned up, removed from state manager

**Validation Rules**:
- Animation ID must be unique (error if registering duplicate ID)
- Cleanup function must be provided (required for proper resource management)
- FPS values must be non-negative, typically 0-60 range

**Persistence**: In-memory only - state is lost on page navigation (intentional, clean slate on navigation)

---

## Entity 4: LazyLoadQueue

**Purpose**: Manages priority-ordered lazy loading of non-critical components.

**Data Structure**:
```typescript
enum LazyLoadPriority {
  IMMEDIATE = 0, // Load immediately (hero, main nav)
  HIGH = 1,      // Load when user scrolls (scroll progress)
  MEDIUM = 2,    // Load when user scrolls past hero (nav dots)
  LOW = 3        // Load after idle timeout (cursor effects)
}

interface LazyLoadTask {
  id: string; // Component identifier
  priority: LazyLoadPriority;
  loader: () => Promise<void>; // Async loading function
  trigger: 'intersection' | 'scroll' | 'idle' | 'timeout';
  options: IntersectionObserverInit | IdleRequestOptions | { timeout: number };
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

interface LazyLoadQueueManager {
  tasks: Map<string, LazyLoadTask>;
  activeObservers: Map<string, IntersectionObserver>;
}
```

**Priority Mapping** (from research):
```typescript
const LAZY_LOAD_COMPONENTS: LazyLoadTask[] = [
  {
    id: 'scroll-progress',
    priority: LazyLoadPriority.HIGH,
    trigger: 'scroll',
    options: { threshold: 0.1 }, // Load when user scrolls 10%
    loader: () => import('@/scripts/scroll-progress').then(m => m.initScrollProgress())
  },
  {
    id: 'navigation-dots',
    priority: LazyLoadPriority.MEDIUM,
    trigger: 'intersection',
    options: { root: null, rootMargin: '0px', threshold: 0 },
    loader: () => import('@/scripts/navigation-dots').then(m => m.initNavigationDots())
  },
  {
    id: 'custom-cursor',
    priority: LazyLoadPriority.LOW,
    trigger: 'idle',
    options: { timeout: 2000 }, // Load after 2s idle
    loader: () => import('@/scripts/custom-cursor').then(m => m.initCustomCursor())
  }
];
```

**Operations**:
```typescript
interface LazyLoadQueueAPI {
  enqueue(task: LazyLoadTask): void;
  load(id: string): Promise<void>;
  loadByPriority(priority: LazyLoadPriority): Promise<void[]>;
  isLoaded(id: string): boolean;
  cancelAll(): void; // Remove observers, clear queue
}
```

**State Transitions**:
```
[Queued] -> [Loading] -> [Loaded]
                |
                v
            [Failed]
```

**Validation Rules**:
- Task ID must be unique
- Loader function must return Promise<void>
- Trigger type must match options type (e.g., 'intersection' requires IntersectionObserverInit)

**Error Handling**:
- If loader Promise rejects, task is marked as `error: Error`, component remains unloaded
- Page remains functional without lazy-loaded components (progressive enhancement)
- Errors logged to console but do not throw (fail gracefully)

**Persistence**: In-memory only - queue is rebuilt on each page load

---

## Entity 5: PerformanceMetrics

**Purpose**: Runtime tracking of actual performance metrics for monitoring and debugging.

**Data Structure**:
```typescript
interface PerformanceMetrics {
  // Core Web Vitals (updated via PerformanceObserver)
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null; // Time to First Byte

  // Animation Performance (updated via rAF)
  currentFPS: number;
  averageFPS: number; // Rolling average over last 5 seconds
  minFPS: number; // Lowest FPS observed
  maxFPS: number; // Highest FPS observed
  frameDropCount: number; // Frames below target FPS

  // Resource Usage (Chrome-only via performance.memory)
  heapSize: number | null; // Current heap size in MB
  heapLimit: number | null; // Heap size limit in MB

  // Page Load
  domContentLoaded: number; // DOMContentLoaded event time
  loadComplete: number; // window.load event time

  // Violations
  budgetViolations: Array<{
    metric: string;
    value: number;
    threshold: number;
    timestamp: number;
  }>;
}
```

**Operations**:
```typescript
interface PerformanceMetricsAPI {
  startMonitoring(): void; // Initialize PerformanceObserver
  stopMonitoring(): void; // Disconnect observers
  recordFrameTime(frameTime: number): void; // Update FPS calculations
  checkBudget(budget: PerformanceBudget): void; // Compare against budgets
  exportMetrics(): PerformanceMetrics; // Get current snapshot
  logViolations(): void; // Console.warn for budget violations
}
```

**Calculation Logic**:
```typescript
// FPS Calculation (simplified)
const frameTimes: number[] = []; // Rolling window of last 60 frame times
const delta = currentFrameTime - lastFrameTime;
frameTimes.push(delta);
if (frameTimes.length > 60) frameTimes.shift();
const averageDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
const currentFPS = Math.round(1000 / averageDelta);

// Budget Violation Detection
if (metrics.lcp && metrics.lcp > budget.lcp.max) {
  budgetViolations.push({
    metric: 'LCP',
    value: metrics.lcp,
    threshold: budget.lcp.max,
    timestamp: Date.now()
  });
}
```

**Validation Rules**:
- All time-based metrics in milliseconds
- FPS values capped at 60 (browser limit)
- Memory values converted to MB for readability
- Violations array limited to last 100 entries (prevent memory leak)

**Persistence**: In-memory only - metrics reset on page navigation

---

## Data Relationships

```
┌─────────────────────┐
│   DeviceTier        │
│  (classification)   │
└──────────┬──────────┘
           │
           │ influences
           v
┌─────────────────────┐      ┌──────────────────────┐
│  AnimationState     │<─────│  LazyLoadQueue       │
│  (active anims)     │      │  (deferred load)     │
└──────────┬──────────┘      └──────────────────────┘
           │
           │ monitored by
           v
┌─────────────────────┐      ┌──────────────────────┐
│ PerformanceMetrics  │─────>│  PerformanceBudget   │
│  (runtime data)     │      │  (thresholds)        │
└─────────────────────┘      └──────────────────────┘
           │
           │ compares against
           v
      Budget Violations
      (logged/alerted)
```

**Flow**:
1. On page load, `DeviceTier` is determined
2. Device tier influences which animations are enabled and their quality settings
3. `LazyLoadQueue` defers non-critical component loading based on tier's `lazyLoadThreshold`
4. Active animations are registered with `AnimationState` manager
5. `PerformanceMetrics` monitors runtime behavior (FPS, Core Web Vitals)
6. Metrics are compared against `PerformanceBudget` thresholds
7. Violations are logged and optionally sent to analytics

---

## Configuration Files

### `src/config/performance.ts`
Centralized performance configuration (budgets, device tier mappings, lazy load tasks).

```typescript
export const PERFORMANCE_CONFIG = {
  budget: DEFAULT_PERFORMANCE_BUDGET,
  deviceTiers: DEVICE_TIER_CONFIGS,
  lazyLoadTasks: LAZY_LOAD_COMPONENTS,
  monitoring: {
    enabled: true, // Enable runtime monitoring
    logViolations: import.meta.env.DEV, // Log to console in dev only
    sendAnalytics: false // Optional: send to analytics service
  }
};
```

### `src/config/animation.ts`
Animation-specific configuration (updated for performance).

```typescript
export const ANIMATION_CONFIG = {
  neural: {
    particleCountByTier: {
      high: 50,
      mid: 30,
      low: 20
    },
    targetFPSByTier: {
      high: 60,
      mid: 30,
      low: 30
    }
  },
  smoothScroll: {
    duration: 0.6, // Reduced from 1.2s
    easing: 'easeOutCubic', // Changed from easeInOutExpo
    enableSectionSnap: false // Disabled
  },
  cursor: {
    enableTrail: false, // Disabled entirely
    enableCustomCursor: true, // Simplified, tier-dependent
    simplifyOnLowTier: true
  }
};
```

---

## Summary

This performance optimization feature introduces 5 key data entities:

1. **DeviceTier**: Client-side device classification for adaptive performance
2. **PerformanceBudget**: Static thresholds for metrics validation
3. **AnimationState**: Runtime tracking of active animations
4. **LazyLoadQueue**: Priority-based deferred component loading
5. **PerformanceMetrics**: Real-time monitoring of Core Web Vitals and FPS

All entities are in-memory only (no persistence required), validated on creation, and follow progressive enhancement principles (graceful degradation if features unavailable).
