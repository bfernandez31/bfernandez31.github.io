# Quickstart: Performance Optimization for GitHub Pages

**Feature**: Performance Optimization for GitHub Pages
**Branch**: `011-1522-fix-project`
**Target**: Developers implementing or reviewing this feature

---

## Overview

This quickstart guide provides step-by-step instructions for implementing the performance optimization feature. It covers setup, implementation priorities, testing, and validation.

**Problem**: Portfolio site is laggy on GitHub Pages, hero section loading indefinitely, smooth scrolling not working since single-page conversion.

**Solution**: Reduce animation overhead, optimize Lenis smooth scroll, implement lazy loading, add device tier detection, enforce performance budgets.

**Expected Outcome**: Lighthouse 85+ (mobile), 95+ (desktop), FCP <2s, LCP <2.5s, smooth 30fps+ animations.

---

## Prerequisites

Before starting, ensure you have:

- ✅ Bun ≥1.0.0 installed (`bun --version`)
- ✅ Repository cloned and on branch `011-1522-fix-project`
- ✅ Dependencies installed (`bun install`)
- ✅ Development server running (`bun run dev` on port 4321)
- ✅ Chrome DevTools or equivalent for performance profiling
- ✅ Baseline performance metrics recorded (see [Baseline Measurement](#baseline-measurement))

---

## Quick Reference

### Key Files Modified

| File | Change | Priority |
|------|--------|----------|
| `src/scripts/cursor-trail.ts` | **DELETE** (remove entirely) | P1 |
| `src/scripts/neural-network.ts` | Reduce particles, add lazy init, pause when not visible | P1 |
| `src/scripts/smooth-scroll.ts` | Reduce duration to 0.6s, disable section snap | P1 |
| `src/pages/index.astro` | Add CSS gradient fallback, preload hints | P1 |
| `src/scripts/scroll-progress.ts` | Add lazy loading (Intersection Observer) | P2 |
| `src/scripts/navigation-dots.ts` | Add lazy loading (Intersection Observer) | P2 |
| `src/scripts/custom-cursor.ts` | Simplify animation, remove MutationObserver | P2 |
| `src/layouts/PageLayout.astro` | Update component initialization order | P2 |

### Key Files Created

| File | Purpose | Priority |
|------|---------|----------|
| `src/scripts/performance/device-tier.ts` | Device capability detection | P1 |
| `src/scripts/performance/lazy-loader.ts` | Intersection Observer utilities | P2 |
| `src/scripts/performance/performance-monitor.ts` | FPS tracking, Core Web Vitals | P2 |
| `src/config/performance.ts` | Performance budgets, device configs | P1 |
| `tests/unit/performance/device-tier.test.ts` | Unit tests for device tier | P2 |
| `tests/integration/performance-audit.test.ts` | Lighthouse CI integration | P2 |
| `.github/workflows/lighthouse-ci.yml` | CI/CD performance gates | P2 |
| `lighthouserc.json` | Lighthouse budget configuration | P2 |

---

## Phase 1: Baseline Measurement (30 minutes)

**Goal**: Establish current performance metrics before optimization.

### Step 1.1: Run Lighthouse Audit

```bash
# Build production version
bun run build

# Preview production build
bun run preview

# In separate terminal, run Lighthouse CI
bun dlx @lhci/cli@0.12.x autorun --config=lighthouserc.json
```

**Record**: Performance scores (mobile/desktop), LCP, FCP, CLS, TBT, TTI

### Step 1.2: Measure Animation Performance

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Navigate to homepage, scroll through all sections
4. Stop recording after 30 seconds
5. **Record**:
   - Average FPS (look for frame rate graph, target >30fps)
   - Frame drops (red bars indicate janky frames)
   - Long tasks (yellow blocks >50ms indicate main thread blocking)

### Step 1.3: Measure Bundle Sizes

```bash
# After building, check dist/ folder sizes
cd dist
du -sh * | sort -h

# Record critical assets:
ls -lh index.html        # Target: <50KB
ls -lh _astro/*.css      # Target: <100KB total
ls -lh _astro/*.js       # Target: <200KB total
```

### Step 1.4: Count Neural Network Particles

```javascript
// Add temporary console.log in src/scripts/neural-network.ts
console.log('Particle count:', this.nodes.length);
```

**Record all metrics in**: `specs/011-1522-fix-project/contracts/baseline-metrics.json`

---

## Phase 2: Critical Path Optimizations (4-6 hours)

**Goal**: Implement P1 optimizations for immediate performance gains.

### Step 2.1: Remove Cursor Trail (30 minutes)

**Why**: High overhead (60fps canvas drawing), low UX value.

1. **Delete file**: `src/scripts/cursor-trail.ts`
2. **Remove component**: `src/components/layout/CursorTrail.astro` (if exists)
3. **Update PageLayout.astro**:
   ```diff
   - import CursorTrail from '@/components/layout/CursorTrail.astro';
   - <CursorTrail />
   ```
4. **Remove initialization**:
   ```diff
   - import { initCursorTrail } from '@/scripts/cursor-trail';
   - initCursorTrail();
   ```

**Test**: Reload page, verify cursor trail is gone, check for console errors.

---

### Step 2.2: Implement Device Tier Detection (1 hour)

**Why**: Enables adaptive performance based on device capabilities.

1. **Create**: `src/scripts/performance/device-tier.ts`
   - Implement `detectDeviceTier()` function (see `contracts/device-tiers.md` for algorithm)
   - Export `DeviceTierLevel` enum and `DeviceTierResult` interface

2. **Create**: `src/config/performance.ts`
   - Define `DEVICE_TIER_CONFIGS` mapping
   - Export `getDeviceConfig(tier)` function

3. **Integrate in PageLayout.astro**:
   ```astro
   <script>
     import { detectDeviceTier } from '@/scripts/performance/device-tier';

     const deviceTierResult = detectDeviceTier();
     console.log('Device Tier:', deviceTierResult.tier, deviceTierResult.reasons);

     // Store globally for other scripts
     (window as any).__DEVICE_TIER__ = deviceTierResult;

     // Expose as CSS custom property
     document.documentElement.style.setProperty('--device-tier', deviceTierResult.tier);
   </script>
   ```

**Test**: Open console, verify device tier logged correctly. Test on different devices (mobile emulation, throttling).

---

### Step 2.3: Optimize Neural Network Animation (2 hours)

**Why**: Reduce particle count, add lazy initialization, pause when not visible.

1. **Update `src/scripts/neural-network.ts`**:

   ```typescript
   import { getDeviceConfig } from '@/config/performance';

   // Get device-appropriate particle count
   const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
   const config = getDeviceConfig(tier);

   // Initialize with reduced particle count
   constructor(canvas: HTMLCanvasElement) {
     this.particleCount = config.particles; // Was hardcoded, now dynamic
     this.targetFPS = config.targetFPS;
     // ... rest of initialization
   }

   // Add pause/resume methods
   pause() {
     this.isPaused = true;
     if (this.animationFrameId) {
       cancelAnimationFrame(this.animationFrameId);
     }
   }

   resume() {
     if (this.isPaused) {
       this.isPaused = false;
       this.animate();
     }
   }
   ```

2. **Add Intersection Observer** (in component or init script):

   ```typescript
   const heroSection = document.querySelector('#hero');
   const canvas = heroSection?.querySelector('.neural-network-canvas');

   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         neuralNetwork.resume();
       } else {
         neuralNetwork.pause();
       }
     });
   }, { threshold: 0.5 });

   if (heroSection) observer.observe(heroSection);
   ```

3. **Simplify GSAP Intro Animation**:
   - Replace complex stagger animation with simple fade-in
   - Use `gsap.set()` for initial state, `gsap.to()` for fade (1 timeline instead of 150+ animations)

**Test**: Verify particle count matches tier (console.log), confirm animation pauses when scrolling away from hero.

---

### Step 2.4: Optimize Smooth Scroll (1 hour)

**Why**: Reduce duration, disable janky section snap.

1. **Update `src/scripts/smooth-scroll.ts`**:

   ```typescript
   import Lenis from '@studio-freight/lenis';
   import { prefersReducedMotion } from '@/scripts/utils/accessibility';
   import { getDeviceConfig } from '@/config/performance';

   export function initSmoothScroll() {
     // Check tier and user preference
     const tier = (window as any).__DEVICE_TIER__?.tier ?? 'mid';
     const config = getDeviceConfig(tier);

     if (!config.enableSmoothScroll || prefersReducedMotion()) {
       console.log('Smooth scroll disabled');
       return null;
     }

     const lenis = new Lenis({
       duration: 0.6,           // Reduced from 1.2s
       easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic (was easeInOutExpo)
       smoothWheel: true,
       // REMOVE section snap logic entirely
     });

     // Integrate with GSAP
     gsap.ticker.add((time) => {
       lenis.raf(time * 1000);
     });

     gsap.ticker.lagSmoothing(0);

     window.lenis = lenis;
     return lenis;
   }
   ```

2. **Remove section snap code**:
   - Delete velocity detection logic
   - Delete debounced snap function
   - Keep smooth scroll for navigation links only

**Test**: Scroll with mouse wheel - should feel more responsive, no unexpected snapping. Test on mobile (touch scroll).

---

### Step 2.5: Add CSS Gradient Fallback (30 minutes)

**Why**: Progressive enhancement - show background while JS loads.

1. **Update `src/pages/index.astro`** (hero section):

   ```astro
   <section
     id="hero"
     data-section="hero"
     class="portfolio-section portfolio-section--hero"
     role="main"
     aria-label="Hero section with introduction"
     style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);"
   >
     <!-- Static HTML content (always visible) -->
     <div class="hero-content">
       <h1 class="hero-headline">Your Name</h1>
       <p class="hero-subheadline">Creative Developer</p>
       <a href="#contact" class="cta-button">Get in Touch</a>
     </div>

     <!-- Canvas overlay (loaded async) -->
     <canvas class="neural-network-canvas" aria-hidden="true"></canvas>
   </section>
   ```

2. **Add preload hints** in `<head>`:

   ```astro
   <head>
     <!-- Preload critical assets -->
     <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin />
     <link rel="preload" href="/_astro/main.css" as="style" />
   </head>
   ```

**Test**: Disable JavaScript in browser, verify hero content and gradient background still visible and functional.

---

## Phase 3: Lazy Loading & Monitoring (3-4 hours)

**Goal**: Defer non-critical components, add performance monitoring.

### Step 3.1: Create Lazy Loader Utility (1 hour)

**Create**: `src/scripts/performance/lazy-loader.ts`

```typescript
interface LazyLoadOptions {
  trigger: 'intersection' | 'idle' | 'timeout';
  observerOptions?: IntersectionObserverInit;
  timeout?: number;
}

export async function lazyLoad(
  id: string,
  loader: () => Promise<void>,
  options: LazyLoadOptions
): Promise<void> {
  if (options.trigger === 'intersection') {
    const target = document.querySelector(`[data-lazy="${id}"]`);
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loader().catch(err => console.error(`Failed to load ${id}:`, err));
          observer.disconnect();
        }
      });
    }, options.observerOptions);

    observer.observe(target);
  } else if (options.trigger === 'timeout') {
    setTimeout(() => {
      loader().catch(err => console.error(`Failed to load ${id}:`, err));
    }, options.timeout ?? 1000);
  } else if (options.trigger === 'idle') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loader());
    } else {
      setTimeout(() => loader(), options.timeout ?? 2000);
    }
  }
}
```

### Step 3.2: Lazy Load Scroll Progress (30 minutes)

**Update `src/scripts/scroll-progress.ts`**:

```typescript
// Defer initialization until user scrolls
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
```

**Update PageLayout.astro**: Replace immediate init with lazy init.

**Test**: Verify scroll progress bar appears after first scroll event (not immediately on page load).

---

### Step 3.3: Lazy Load Navigation Dots (30 minutes)

**Update `src/scripts/navigation-dots.ts`**:

Similar to scroll progress, defer until user scrolls past hero section.

```typescript
export function initNavigationDotsLazy() {
  const heroSection = document.querySelector('#hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // User scrolled past hero, load nav dots
        import('./navigation-dots').then(module => {
          module.initNavigationDots();
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);
}
```

**Test**: Scroll past hero, verify navigation dots appear with slight delay.

---

### Step 3.4: Implement Performance Monitor (1 hour)

**Create**: `src/scripts/performance/performance-monitor.ts`

```typescript
import { PERFORMANCE_CONFIG } from '@/config/performance';

class PerformanceMonitor {
  private frameTimes: number[] = [];
  private lastFrameTime = performance.now();
  private observer: PerformanceObserver | null = null;

  startMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            console.log('CLS:', (entry as any).value);
          }
        });
      });

      this.observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
    }

    // Monitor FPS
    this.measureFPS();
  }

  private measureFPS() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;

    this.frameTimes.push(delta);
    if (this.frameTimes.length > 60) this.frameTimes.shift();

    const avgDelta = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
    const currentFPS = Math.round(1000 / avgDelta);

    // Check budget
    if (currentFPS < PERFORMANCE_CONFIG.budget.minFPS) {
      console.warn(`FPS below budget: ${currentFPS} < ${PERFORMANCE_CONFIG.budget.minFPS}`);
    }

    this.lastFrameTime = now;
    requestAnimationFrame(() => this.measureFPS());
  }

  stopMonitoring() {
    this.observer?.disconnect();
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

**Initialize in PageLayout.astro** (development mode only):

```astro
<script>
  if (import.meta.env.DEV) {
    import('@/scripts/performance/performance-monitor').then(module => {
      module.performanceMonitor.startMonitoring();
    });
  }
</script>
```

**Test**: Open console in development, verify FPS and Core Web Vitals logged.

---

## Phase 4: Testing & Validation (2-3 hours)

### Step 4.1: Run Lighthouse Audit (Post-Optimization)

```bash
bun run build
bun run preview
bun dlx @lhci/cli@0.12.x autorun
```

**Compare**: Before vs After metrics (see `contracts/performance-budgets.md`)

**Expected Improvements**:
- Performance score: +20-40 points (mobile), +10-20 points (desktop)
- LCP: -1000ms to -2000ms
- FCP: -500ms to -1000ms
- TBT: -100ms to -200ms

---

### Step 4.2: Device Tier Testing

| Device | Test Actions | Expected Behavior |
|--------|--------------|-------------------|
| Desktop (8+ cores) | Open site, check console | Tier: HIGH, 50 particles, 60fps |
| Chrome DevTools (4x throttle) | Enable CPU throttling | Tier: MID, 30 particles, 30fps |
| Chrome DevTools (6x throttle + Slow 3G) | Enable throttling + network | Tier: LOW, 20 particles, native scroll |
| Privacy browser (Brave) | Disable shields or test with APIs blocked | Tier: UNKNOWN (defaults to MID) |

---

### Step 4.3: Animation Performance Testing

1. **FPS Test**:
   - Open Chrome DevTools → Performance → Record
   - Scroll through site for 30 seconds
   - Check frame rate graph: Should maintain 30fps minimum (60fps on high-end)

2. **CPU Test**:
   - Open Activity Monitor / Task Manager
   - Monitor browser CPU usage during animations
   - Should stay below 40% on mid-range devices

3. **Memory Test**:
   - Open Chrome DevTools → Memory → Take heap snapshot
   - Interact with site for 5 minutes
   - Take second snapshot, compare
   - Heap growth should be <10MB (no memory leaks)

---

### Step 4.4: Progressive Enhancement Testing

1. **No JavaScript**:
   - Disable JavaScript in browser settings
   - Reload page
   - Verify: Hero content visible, gradient background, navigation links work (native scroll)

2. **Slow Connection**:
   - Enable "Slow 3G" in Chrome DevTools Network tab
   - Hard refresh page
   - Verify: FCP <2s, LCP <2.5s (Lighthouse on Slow 3G profile)

3. **Reduced Motion**:
   - Enable "Prefers Reduced Motion" in OS settings
   - Reload page
   - Verify: No smooth scroll, no animations (instant transitions only)

---

## Phase 5: CI/CD Integration (1 hour)

### Step 5.1: Create Lighthouse CI Configuration

**Create**: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Step 5.2: Add GitHub Actions Workflow

**Create**: `.github/workflows/lighthouse-ci.yml`

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build production
        run: bun run build

      - name: Run Lighthouse CI
        run: |
          bun dlx @lhci/cli@0.12.x autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Test**: Push to branch, verify workflow runs successfully, check for performance budget violations.

---

## Troubleshooting

### Issue: Device Tier Always Returns UNKNOWN

**Cause**: Browser APIs not available (privacy browser, unsupported browser)

**Fix**: Verify fallback logic works correctly (defaults to MID tier)

**Test**:
```javascript
console.log('hardwareConcurrency:', navigator.hardwareConcurrency);
console.log('deviceMemory:', (navigator as any).deviceMemory);
```

---

### Issue: Neural Network Animation Not Pausing

**Cause**: Intersection Observer threshold too high or hero section not observed

**Fix**: Lower threshold to 0.3, verify observer is attached to correct element

**Debug**:
```javascript
observer.observe(heroSection);
console.log('Observing hero section:', heroSection);
```

---

### Issue: Smooth Scroll Still Feels Laggy

**Cause**: Lenis duration still too high, or device tier detection failing

**Fix**: Reduce duration to 0.4s, test on actual device (not emulator)

**Test**: Try different easing functions (easeOutQuad might feel snappier than easeOutCubic)

---

### Issue: Lighthouse Score Not Improving

**Cause**: Bundle size still too large, render-blocking resources, poor caching

**Fix**:
1. Check bundle sizes: `ls -lh dist/_astro/*.js`
2. Verify code splitting: Look for separate chunks in dist/
3. Check for render-blocking: Lighthouse report "Opportunities" section
4. Ensure preload hints in HTML head for critical assets

---

## Success Checklist

Before merging this feature, ensure:

- ✅ Device tier detection works on multiple devices (high, mid, low)
- ✅ Neural network particle count adapts to tier (50/30/20)
- ✅ Smooth scroll duration reduced to 0.6s, section snap disabled
- ✅ Cursor trail removed entirely (file deleted, no errors)
- ✅ CSS gradient fallback visible when JS disabled
- ✅ Lazy loading defers scroll progress and navigation dots
- ✅ Performance monitor logs FPS and Core Web Vitals in dev mode
- ✅ Lighthouse CI workflow passes (85+ mobile, 95+ desktop)
- ✅ All unit tests pass (`bun test`)
- ✅ Biome linting passes (`bun run lint`)
- ✅ No console errors on page load or interaction
- ✅ Site remains functional with JS disabled (progressive enhancement)
- ✅ Reduced motion preference respected (no animations)

---

## Next Steps

After completing this feature:

1. **Merge to main**: Create PR, run Lighthouse CI, address any violations
2. **Deploy to GitHub Pages**: Automated via GitHub Actions on merge
3. **Monitor real-world metrics**: Set up analytics to track actual user performance
4. **Iterate**: Identify additional optimizations based on production data

---

## Additional Resources

- [Feature Spec](./spec.md) - Full requirements and user stories
- [Research](./research.md) - Best practices and decision rationale
- [Data Model](./data-model.md) - Entity definitions and state management
- [Performance Budgets Contract](./contracts/performance-budgets.md) - Detailed budget thresholds
- [Device Tiers Contract](./contracts/device-tiers.md) - Classification algorithm and config
- [CLAUDE.md](/CLAUDE.md) - Project guidelines and conventions

---

**Estimated Total Time**: 10-15 hours (including testing and iteration)

**Priority Order**: Phase 1 (baseline) → Phase 2 (critical optimizations) → Phase 3 (lazy loading) → Phase 4 (testing) → Phase 5 (CI/CD)
