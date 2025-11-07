# Contract: Performance Budgets

**Feature**: Performance Optimization for GitHub Pages
**Branch**: `011-1522-fix-project`
**Date**: 2025-11-07
**Status**: Design Contract

## Purpose

This contract defines the measurable performance budgets and thresholds that the portfolio site must meet after optimization. These budgets serve as acceptance criteria for the feature and gates for CI/CD deployment.

---

## Core Web Vitals Budgets

### Largest Contentful Paint (LCP)

**Metric**: Time until largest content element is rendered (hero headline or background)

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile (Slow 3G) | ≤2.0s | ≤2.5s | TBD (measure) | TBD |
| Desktop (4G) | ≤1.5s | ≤2.0s | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: LCP ≤ Max threshold on 95th percentile of test runs
- ❌ **FAIL**: LCP > Max threshold on more than 5% of test runs

**Measurement Method**:
- Lighthouse CI (3 runs, median value)
- Chrome DevTools Performance panel
- Real User Monitoring (optional): PerformanceObserver API

---

### First Input Delay (FID)

**Metric**: Time from user interaction to browser response (e.g., click CTA button)

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile | ≤50ms | ≤100ms | TBD (measure) | TBD |
| Desktop | ≤50ms | ≤100ms | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: FID ≤ Max threshold on all test interactions
- ❌ **FAIL**: FID > Max threshold on any primary interaction (navigation, CTA clicks)

**Measurement Method**:
- Web Vitals library (`onFID()` callback)
- Chrome User Experience Report (CrUX)
- Lighthouse estimates (not actual FID, use TBT as proxy)

---

### Cumulative Layout Shift (CLS)

**Metric**: Sum of all unexpected layout shifts during page lifecycle

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile | ≤0.05 | ≤0.1 | TBD (measure) | TBD |
| Desktop | ≤0.05 | ≤0.1 | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: CLS ≤ Max threshold with no single shift >0.05
- ❌ **FAIL**: CLS > Max threshold OR any shift >0.1 (jarring shift)

**Measurement Method**:
- Lighthouse CI
- Layout Instability API (`PerformanceObserver` for 'layout-shift' entries)
- Visual regression testing (Percy, Chromatic)

**Common Causes to Avoid**:
- Lazy-loaded animations causing layout reflow
- Unsized images or fonts loading (FOUT/FOIT)
- Dynamic content injection above fold

---

## Additional Performance Budgets

### First Contentful Paint (FCP)

**Metric**: Time until first text or image is rendered

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile (Slow 3G) | ≤1.5s | ≤2.0s | TBD (measure) | TBD |
| Desktop (4G) | ≤1.0s | ≤1.5s | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: FCP ≤ Max threshold (Lighthouse "good" rating)
- ❌ **FAIL**: FCP > Max threshold

**Optimization Levers**:
- Inline critical CSS
- Preload fonts
- Remove render-blocking JavaScript
- Static HTML hero content (no JS-required rendering)

---

### Time to Interactive (TTI)

**Metric**: Time until page is fully interactive (event handlers registered, main thread idle)

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile (Slow 3G) | ≤3.0s | ≤3.5s | TBD (measure) | TBD |
| Desktop (4G) | ≤2.0s | ≤2.5s | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: TTI ≤ Max threshold (all critical JS loaded and executed)
- ❌ **FAIL**: TTI > Max threshold

**Optimization Levers**:
- Lazy load non-critical JavaScript
- Reduce JavaScript parse/execute time
- Defer animation initialization until post-TTI

---

### Total Blocking Time (TBT)

**Metric**: Sum of time main thread is blocked by long tasks (>50ms) between FCP and TTI

| Device | Target | Max | Current Baseline | Improvement Required |
|--------|--------|-----|------------------|---------------------|
| Mobile | ≤150ms | ≤300ms | TBD (measure) | TBD |
| Desktop | ≤100ms | ≤200ms | TBD (measure) | TBD |

**Acceptance Criteria**:
- ✅ **PASS**: TBT ≤ Max threshold (minimal main thread blocking)
- ❌ **FAIL**: TBT > Max threshold OR any single task >200ms

**Optimization Levers**:
- Break up long JavaScript tasks (async/await, yield to main thread)
- Reduce GSAP animation initialization overhead
- Use `requestIdleCallback` for non-critical work

---

## Resource Budgets

### Total Page Weight

**Metric**: Sum of all assets loaded before TTI (HTML + CSS + JS + fonts + images)

| Resource Type | Target | Max | Notes |
|---------------|--------|-----|-------|
| HTML | ≤30KB | ≤50KB | index.html (uncompressed) |
| Critical CSS | ≤50KB | ≤100KB | Inline + blocking stylesheets |
| Critical JS | ≤100KB | ≤150KB | Scripts needed for hero section |
| Fonts | ≤50KB | ≤100KB | WOFF2 subset, preloaded |
| Images (hero) | ≤100KB | ≤200KB | Hero background (if any), optimized |
| **Total** | **≤400KB** | **≤500KB** | **Critical path assets only** |

**Acceptance Criteria**:
- ✅ **PASS**: Total page weight ≤ Max threshold (uncompressed, before gzip)
- ❌ **FAIL**: Total page weight > Max threshold

**Notes**:
- Non-critical assets (lazy-loaded scripts, below-fold images) excluded from total
- Measurements in uncompressed bytes (gzip typically reduces by 70-80%)
- GitHub Pages serves gzip by default, but budget is uncompressed for consistency

---

### JavaScript Bundle Size

**Metric**: Total JavaScript loaded and parsed

| Bundle | Target | Max | Contents |
|--------|--------|-----|----------|
| Astro runtime | ≤5KB | ≤10KB | Minimal (static pages) |
| GSAP + plugins | ≤40KB | ≤50KB | gsap.min.js + ScrollTrigger |
| Lenis | ≤10KB | ≤15KB | lenis.min.js |
| Animation scripts | ≤50KB | ≤75KB | neural-network, smooth-scroll, utils |
| **Total** | **≤150KB** | **≤200KB** | **All critical JS** |

**Acceptance Criteria**:
- ✅ **PASS**: Total JS ≤ Max threshold (minified, uncompressed)
- ❌ **FAIL**: Total JS > Max threshold

**Code Splitting Strategy**:
- **Critical (loaded immediately)**: smooth-scroll, animation-config, device-tier
- **High priority (lazy, 0.5s delay)**: neural-network, scroll-progress
- **Low priority (lazy, 2s delay)**: custom-cursor, navigation-dots

---

## Animation Performance Budgets

### Frame Rate (FPS)

**Metric**: Frames per second during neural network animation

| Device Tier | Target FPS | Min FPS | Measurement Period | Violation Threshold |
|-------------|------------|---------|-------------------|---------------------|
| High-end | 60fps | 55fps | 5 seconds | <55fps for >1s |
| Mid-range | 30fps | 25fps | 5 seconds | <25fps for >1s |
| Low-end | 30fps | 20fps | 5 seconds | <20fps for >1s |

**Acceptance Criteria**:
- ✅ **PASS**: Average FPS ≥ Target FPS, min FPS ≥ Min FPS over 5-second window
- ❌ **FAIL**: Average FPS < Target FPS OR min FPS < Min FPS for >1 second

**Measurement Method**:
```typescript
const frameTimes: number[] = [];
let lastFrameTime = performance.now();

function measureFrame() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  frameTimes.push(delta);
  if (frameTimes.length > 300) frameTimes.shift(); // Keep last 5s @ 60fps

  const avgDelta = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
  const currentFPS = 1000 / avgDelta;

  if (currentFPS < TARGET_FPS) console.warn('FPS below target:', currentFPS);

  lastFrameTime = now;
  requestAnimationFrame(measureFrame);
}
```

---

### CPU Usage

**Metric**: CPU utilization percentage during animations

| Device Tier | Target CPU | Max CPU | Notes |
|-------------|------------|---------|-------|
| High-end | ≤30% | ≤40% | 8+ core CPU |
| Mid-range | ≤35% | ≤50% | 4-core CPU |
| Low-end | ≤40% | ≤60% | 2-core CPU |

**Acceptance Criteria**:
- ✅ **PASS**: Average CPU usage ≤ Max CPU during 5-second animation window
- ❌ **FAIL**: Average CPU usage > Max CPU for >2 seconds

**Measurement Method**:
- Chrome DevTools Performance Monitor (CPU usage graph)
- Manual observation in Activity Monitor / Task Manager
- Note: No standard browser API for CPU usage, manual testing required

---

### Memory Usage

**Metric**: Heap size during page lifecycle

| Metric | Target | Max | Notes |
|--------|--------|-----|-------|
| Initial heap | ≤30MB | ≤50MB | After page load, before animations |
| Peak heap | ≤80MB | ≤100MB | During active animations |
| Heap growth | ≤5MB/min | ≤10MB/min | Detect memory leaks |

**Acceptance Criteria**:
- ✅ **PASS**: Peak heap ≤ Max AND heap growth ≤ Max over 5 minutes
- ❌ **FAIL**: Peak heap > Max OR heap growth > Max (indicates memory leak)

**Measurement Method** (Chrome only):
```typescript
if ('memory' in performance) {
  const { usedJSHeapSize, jsHeapSizeLimit } = (performance as any).memory;
  const heapMB = (usedJSHeapSize / 1024 / 1024).toFixed(2);
  console.log(`Heap: ${heapMB} MB`);
}
```

---

## Lighthouse Score Budgets

**Metric**: Lighthouse audit scores (0-100 scale)

| Category | Mobile Target | Desktop Target | Min Acceptable |
|----------|---------------|----------------|----------------|
| Performance | ≥85 | ≥95 | 80 / 90 |
| Accessibility | ≥95 | ≥95 | 90 |
| Best Practices | ≥95 | ≥95 | 90 |
| SEO | ≥95 | ≥95 | 90 |

**Acceptance Criteria**:
- ✅ **PASS**: All scores ≥ Target on median of 3 Lighthouse runs
- ⚠️ **WARN**: Any score between Min Acceptable and Target (requires justification)
- ❌ **FAIL**: Any score < Min Acceptable

**CI/CD Integration**:
```yaml
# .github/workflows/lighthouse-ci.yml
- name: Run Lighthouse CI
  run: |
    bun run build
    bun dlx @lhci/cli@0.12.x autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

# lighthouserc.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

---

## Testing Conditions

### Network Profiles

| Profile | Bandwidth (down/up) | Latency (RTT) | Use Case |
|---------|---------------------|---------------|----------|
| Slow 3G | 1.5 Mbps / 400 Kbps | 400ms | Worst-case mobile |
| Fast 3G | 4 Mbps / 1 Mbps | 150ms | Average mobile |
| 4G | 20 Mbps / 10 Mbps | 50ms | Good mobile / Desktop |
| WiFi | 50 Mbps / 50 Mbps | 10ms | Best-case desktop |

**Primary Test Profile**: Slow 3G (most stringent, ensures site works for lowest-tier users)

---

### Device Profiles

| Device | CPU | Memory | Screen | Primary Metrics |
|--------|-----|--------|--------|----------------|
| Moto G4 (mobile low-end) | 4 cores | 2GB | 1080x1920 | LCP, FCP, TBT, FPS |
| iPhone 8 (mobile mid-range) | 2 cores | 2GB | 750x1334 | All metrics |
| MacBook Air 2019 (desktop mid-range) | 4 cores | 8GB | 2560x1600 | FPS, CPU, Memory |
| Desktop High-end | 8+ cores | 16GB+ | 1920x1080+ | Baseline (best-case) |

**Primary Test Device**: Moto G4 or iPhone 8 equivalent (mid-range mobile, representative of average user)

---

## Budget Violation Handling

### Development (Local)
- **Warn**: Console.warn when metrics exceed Target thresholds
- **Error**: Console.error when metrics exceed Max thresholds (does not block)
- **Log**: Performance metrics logged to console every 5 seconds during development

### CI/CD (Pull Request)
- **Warn**: Comment on PR if any metric between Target and Max (requires review)
- **Fail**: Block PR merge if any metric exceeds Max threshold
- **Report**: Post Lighthouse report to PR comment for visibility

### Production (Deployed)
- **Monitor**: Performance Observer collects metrics, logs violations to console
- **Optional**: Send metrics to analytics service (e.g., Google Analytics custom events)
- **Alert**: (Future) Set up alerting if real user metrics degrade >10% from baseline

---

## Baseline Measurement Plan

**Before implementing optimizations, measure current performance:**

1. Run Lighthouse CI on current production build (record all metrics)
2. Test on Slow 3G + Moto G4 emulation (Chrome DevTools)
3. Measure neural network particle count (count nodes in current implementation)
4. Profile CPU/Memory usage during 5-minute animation window
5. Record bundle sizes (HTML, CSS, JS) from production build

**Store baseline in**: `specs/011-1522-fix-project/contracts/baseline-metrics.json`

**Example baseline format**:
```json
{
  "date": "2025-11-07",
  "branch": "main",
  "commit": "abc123",
  "lighthouse": {
    "mobile": {
      "performance": 45,
      "accessibility": 98,
      "lcp": 4200,
      "fcp": 3100,
      "cls": 0.15
    },
    "desktop": {
      "performance": 72,
      "accessibility": 98,
      "lcp": 2800,
      "fcp": 1900,
      "cls": 0.08
    }
  },
  "resources": {
    "totalPageWeight": 680,
    "jsTotal": 245,
    "cssTotal": 135
  },
  "animations": {
    "neuralNetworkParticles": 120,
    "averageFPS": 22,
    "peakCPU": 65,
    "peakMemory": 145
  }
}
```

---

## Success Metrics Summary

**This feature is successful when**:

✅ All Core Web Vitals meet Max thresholds (LCP ≤2.5s, FID ≤100ms, CLS ≤0.1)
✅ Lighthouse Performance score ≥85 (mobile), ≥95 (desktop)
✅ Total page weight ≤500KB (critical assets)
✅ Animations maintain ≥30fps on mid-range devices
✅ Zero layout shift violations (CLS from animations)
✅ Site remains functional with JavaScript disabled (progressive enhancement)

**Stretch goals** (beyond minimum acceptance):

🎯 Lighthouse Performance ≥95 (both mobile and desktop)
🎯 LCP ≤2.0s on Slow 3G mobile
🎯 Total page weight ≤400KB (10% under budget)
🎯 Animations maintain 60fps on high-end devices, 30fps on low-end

---

**Contract Status**: Awaiting baseline measurements
**Next Steps**: Run baseline audit, implement optimizations, re-test against budgets
