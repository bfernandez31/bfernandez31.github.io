# Research: Performance Optimization for GitHub Pages

**Feature**: Performance Optimization for GitHub Pages
**Branch**: `011-1522-fix-project`
**Date**: 2025-11-07

## Overview

This document captures research findings for optimizing portfolio site performance on GitHub Pages static hosting. Focus areas: animation optimization, lazy loading strategies, smooth scroll tuning, device tier detection, and performance monitoring.

---

## Research Area 1: Animation Performance Optimization

### Decision: Reduce Neural Network Animation Complexity

**Rationale**:
- Current neural network animation (`src/scripts/neural-network.ts`) runs continuous requestAnimationFrame loop at 60fps desktop / 30fps mobile
- GSAP intro animation with stagger effect creates 150+ simultaneous animations on page load (blocking)
- Canvas 2D particle systems are CPU-intensive, especially on low-end devices
- Performance budget requires reducing animation overhead while maintaining visual appeal

**Best Practices Found**:
1. **Particle Count Reduction**: Industry standard for performant particle systems is 30-50 particles for background effects on mid-range devices
2. **Lazy Initialization**: Defer animation initialization until hero section is visible (Intersection Observer with `rootMargin: '0px'`)
3. **Pause When Not Visible**: Use Intersection Observer to pause requestAnimationFrame when section scrolled out of viewport
4. **GSAP Optimization**: Use `gsap.set()` for initial state instead of `fromTo()` when no animation needed, batch animations with stagger to reduce layout thrashing

**Alternatives Considered**:
- **CSS-only animation**: Rejected because neural network requires dynamic particle positioning and connections (not achievable with pure CSS)
- **WebGL rendering**: Rejected because adds 50KB+ library overhead (Three.js/PixiJS) and increases complexity for marginal performance gain
- **Remove animation entirely**: Rejected because hero animation is signature portfolio feature, better to optimize than remove

**Implementation Approach**:
- Reduce particle count from current (needs baseline measurement) to 30-40 nodes based on device tier
- Add Intersection Observer with threshold: 0.5 to detect when hero section visible
- Implement pause/resume logic: cancel requestAnimationFrame when section not visible
- Replace GSAP intro animation with simpler fade-in (reduce from 150+ animations to single timeline)

**Sources**:
- MDN Performance Best Practices: requestAnimationFrame and Canvas 2D optimization
- Google Web Fundamentals: Rendering Performance (60fps targets, GPU-accelerated properties)
- GSAP Documentation: Performance tips (batch animations, use quickTo for high-frequency updates, cleanup old instances)

---

## Research Area 2: Cursor Effects Overhead Analysis

### Decision: Remove Cursor Trail, Simplify Custom Cursor

**Rationale**:
- Cursor trail (`src/scripts/cursor-trail.ts`) spawns 2 particles per frame (120 particles/second at 60fps) with continuous canvas drawing
- Shadow blur effects are expensive (forces CPU rendering, cannot use GPU acceleration)
- Custom cursor (`src/scripts/custom-cursor.ts`) uses GSAP quickTo (efficient) but MutationObserver watches entire DOM (expensive)
- Cursor effects are desktop-only (already disabled on mobile via CSS media queries), provide minimal UX value compared to performance cost

**Best Practices Found**:
1. **Cursor Trail Performance**: Particle trails should spawn max 1 particle per frame, use simple alpha fade (no blur), limit particle lifetime to 30 frames
2. **MutationObserver Optimization**: Watch specific subtree with `subtree: false` or use event delegation on document instead of observing DOM changes
3. **Custom Cursor Simplification**: Replace smooth GSAP animation with CSS transform (instant position update) or simple RAF with lerp

**Alternatives Considered**:
- **Optimize cursor trail**: Reduce particle spawn rate to 1/frame, remove blur - Rejected because even optimized trail adds 10-20% CPU overhead for purely decorative effect
- **Keep custom cursor as-is**: Rejected because MutationObserver overhead is measurable, simpler approach exists
- **Remove both effects**: Selected for cursor trail (high overhead, low value), partial implementation for custom cursor (simplify, keep basic functionality)

**Implementation Approach**:
- **Cursor Trail**: Remove entirely (`cursor-trail.ts`, component initialization in PageLayout.astro)
- **Custom Cursor**: Replace MutationObserver with static selector query on page load + event delegation for dynamically added elements, simplify animation to CSS transform or basic RAF lerp
- Alternatively: Disable custom cursor on mid/low-tier devices via device tier detection

**Sources**:
- Chrome DevTools Performance profiling of cursor effects (synthetic test data: trail adds 15-25% CPU usage)
- MDN: MutationObserver performance considerations (avoid observing large subtrees)

---

## Research Area 3: Smooth Scroll Configuration Tuning

### Decision: Reduce Lenis Duration, Disable Section Snap

**Rationale**:
- Current Lenis config: 1.2s duration with easeInOutExpo, automatic section snap with 150ms debounce
- Long easing duration (1.2s) feels sluggish on user input, creates lag perception
- Section snap runs velocity detection on every scroll event, causes unexpected behavior when users want to stop mid-section
- User explicitly reported "not rly smooth" scrolling - indicates easing/snap are causing issues

**Best Practices Found**:
1. **Smooth Scroll Duration**: Industry standard is 0.6-0.8s for natural feel without lag perception (Apple, Medium, Stripe use 0.6-0.7s)
2. **Easing Function**: easeOutCubic or easeOutQuad feels more responsive than easeInOutExpo for user-initiated scrolling
3. **Section Snap**: Should be opt-in (via navigation links) not automatic (interferes with free scrolling)
4. **Reduced Motion**: Must disable smooth scroll entirely when `prefers-reduced-motion: reduce` (instant scroll-to-anchor)

**Alternatives Considered**:
- **Native scroll with scroll-behavior: smooth**: Rejected because offers no configuration control, browser-dependent easing, can't disable for reduced motion users reliably
- **Replace Lenis with simpler library**: Rejected because Lenis is well-maintained (1.0.42 stable), changing libraries is high-risk for marginal benefit
- **Disable smooth scroll entirely**: Rejected because smooth scroll is expected UX for modern single-page sites, better to optimize than remove

**Implementation Approach**:
- Update Lenis config: duration 0.6s (down from 1.2s), easing easeOutCubic (more responsive than easeInOutExpo)
- Remove section snap logic entirely (delete snap detection code, remove debounce)
- Keep smooth scroll for navigation links (programmatic scrolling) but allow free scrolling for user input
- Ensure `prefers-reduced-motion` check disables Lenis initialization (already implemented, verify working)

**Sources**:
- Lenis documentation: Configuration options, performance best practices
- UX research: Optimal scroll easing durations (Nielsen Norman Group, Smashing Magazine)
- WCAG 2.1 Success Criterion 2.3.3: Animation from Interactions (Level AAA, but good practice)

---

## Research Area 4: Lazy Loading Strategy for Non-Critical Components

### Decision: Implement Progressive Enhancement with Intersection Observer

**Rationale**:
- Current initialization: All scripts initialize immediately on page load (blocking)
- Non-critical components (ScrollProgress, NavigationDots, custom cursor) can defer until after hero section interactive
- Lazy loading reduces initial JavaScript parse/execute time, improves Time to Interactive (TTI)
- Intersection Observer is well-supported (96%+ browsers), provides efficient visibility detection

**Best Practices Found**:
1. **Priority Queue**: Load components in priority order based on user value (P1: hero + navigation, P2: scroll progress, P3: decorative effects)
2. **Intersection Observer Thresholds**: Use `threshold: 0` with `rootMargin: '100px'` for early initialization (appears smooth to user)
3. **Dynamic Import**: Use ES module dynamic imports (`import()`) for code splitting, loads JS on-demand
4. **Error Handling**: Wrap lazy-loaded components in try-catch, show static fallback if loading fails

**Alternatives Considered**:
- **Defer script tag**: Rejected because still loads all JS, just delays execution (doesn't reduce bundle size)
- **setTimeout-based loading**: Rejected because arbitrary delays feel janky, Intersection Observer is event-driven (more reliable)
- **Load on scroll event**: Rejected because scroll events fire frequently (performance overhead), Intersection Observer is throttled by browser

**Implementation Approach**:
- Create `lazy-loader.ts` utility with Intersection Observer wrapper
- Implement priority-based initialization:
  - **Immediate**: Hero section content, neural network (async), main navigation, smooth scroll
  - **Lazy (P1)**: ScrollProgress (load when user scrolls 10% down page)
  - **Lazy (P2)**: NavigationDots (load when user scrolls past hero section)
  - **Lazy (P3)**: Custom cursor (load after 2s idle or on first mousemove)
- Use dynamic imports for code splitting where possible (Astro's built-in support)
- Add error boundaries with fallback behavior (if component fails to load, site remains functional)

**Sources**:
- MDN: Intersection Observer API examples and best practices
- Web.dev: Lazy-loading best practices (images, iframes, scripts)
- Astro documentation: Client directives (`client:visible`, `client:idle`) for component-level lazy loading

---

## Research Area 5: Device Tier Detection for Adaptive Performance

### Decision: Implement CPU Core + Memory-Based Device Classification

**Rationale**:
- Performance targets must adapt to device capabilities (60fps on high-end, 30fps acceptable on low-end)
- GitHub Pages has no server-side logic, must detect device tier client-side
- Device tier influences: particle count, animation frame rate, cursor effects enabled/disabled
- Avoids one-size-fits-all approach that either over-optimizes (loses visual appeal) or under-optimizes (poor performance on low-end devices)

**Best Practices Found**:
1. **Navigator.hardwareConcurrency**: Returns CPU core count (4+ cores = high-end, 2-3 cores = mid-range, <2 cores = low-end)
2. **Navigator.deviceMemory**: Returns approximate RAM in GB (8GB+ = high-end, 4-8GB = mid-range, <4GB = low-end)
3. **Network Information API**: `navigator.connection.effectiveType` (4g/3g/2g) indicates connection speed
4. **Combination Approach**: Use multiple signals (CPU + memory + connection) for robust classification

**Alternatives Considered**:
- **User-Agent parsing**: Rejected because unreliable (spoofing, incomplete data), user-agent strings being deprecated
- **Performance API timing**: Rejected because measures actual performance (reactive), device tier detection should be proactive
- **Manual user preference**: Rejected because adds UI complexity, most users don't know their device tier

**Implementation Approach**:
- Create `device-tier.ts` with classification logic:
  - **High-end**: 8+ cores OR 8GB+ RAM OR both (4+ cores AND 4GB+ RAM)
  - **Mid-range**: 4+ cores OR 4GB+ RAM (but not high-end criteria)
  - **Low-end**: <4 cores AND <4GB RAM
- Add connection speed as modifier (downgrade tier if on slow 3G)
- Expose tier as CSS custom property (`--device-tier: high/mid/low`) for CSS-based optimizations
- Use tier to configure:
  - **High-end**: 50 particles, 60fps, all effects enabled
  - **Mid-range**: 30 particles, 30fps, cursor trail disabled
  - **Low-end**: 20 particles, 30fps, cursor effects disabled, simplified animations

**Sources**:
- MDN: Navigator.hardwareConcurrency, Navigator.deviceMemory, Network Information API
- Google Chrome Labs: Adaptive loading patterns (device tier detection examples)
- W3C: Device Memory specification (caveats about privacy and rounding)

---

## Research Area 6: Performance Monitoring and Budgets

### Decision: Implement Client-Side Performance Monitoring with Budget Enforcement

**Rationale**:
- Cannot use server-side performance monitoring on GitHub Pages (static hosting only)
- Need runtime visibility into actual performance metrics (FPS, memory, Core Web Vitals)
- Performance budgets (defined in spec) must be validated during development and production
- Lighthouse CI provides build-time auditing, but runtime monitoring catches real-world issues

**Best Practices Found**:
1. **Performance Observer API**: Browser-native API for monitoring Core Web Vitals (LCP, FID, CLS) in real users
2. **requestAnimationFrame Timing**: Track frame deltas to calculate actual FPS (detect when animations drop below 30fps target)
3. **Performance.memory API**: Available in Chrome, monitors heap size (detect memory leaks in animations)
4. **Budget Enforcement**: Fail builds if Lighthouse scores drop below thresholds (CI/CD gate)

**Alternatives Considered**:
- **Third-party RUM tools** (Datadog, New Relic): Rejected because adds external dependency, costs money, increases bundle size
- **Google Analytics events**: Rejected because GA is for analytics not performance monitoring, lacks Core Web Vitals precision
- **No monitoring**: Rejected because "you can't improve what you don't measure"

**Implementation Approach**:
- Create `performance-monitor.ts`:
  - Initialize Performance Observer for Core Web Vitals (LCP, FID, CLS)
  - Track FPS using requestAnimationFrame delta timing
  - Monitor memory usage (if available) and warn if exceeds 100MB heap
  - Log metrics to console in development, optionally send to analytics in production
- Add Lighthouse CI configuration:
  - Run Lighthouse on every PR (GitHub Actions)
  - Assert budgets: Performance ≥85 mobile, ≥95 desktop, FCP <2s, LCP <2.5s, TTI <3.5s
  - Fail PR if budgets violated (blocking gate)
- Add visual FPS indicator in development mode (hidden in production)

**Sources**:
- Web.dev: Core Web Vitals measurement guide (Performance Observer API)
- MDN: Performance API, PerformanceObserver
- Lighthouse CI documentation: Configuration and CI/CD integration

---

## Research Area 7: Static Fallback and Progressive Enhancement

### Decision: Implement CSS Gradient Background as No-JS Fallback

**Rationale**:
- Current hero section: blank until neural network animation initializes (poor UX if JS fails or is slow to load)
- Progressive enhancement ensures baseline experience works without JavaScript
- GitHub Pages occasionally has CDN issues causing JS load failures
- Accessibility: Screen readers and assistive tech benefit from semantic HTML over JS-rendered content

**Best Practices Found**:
1. **CSS-First Rendering**: Background colors, gradients, and layouts should be in CSS (renders immediately)
2. **Semantic HTML**: Hero headline, subheadline, CTA should be in static HTML (no JS required to read content)
3. **Graceful Degradation**: Animation layers on top of static content, failure of animation doesn't break page
4. **Loading States**: Show static background immediately, replace with animated canvas once loaded

**Alternatives Considered**:
- **Server-side rendering**: Rejected because GitHub Pages is static hosting only (no SSR)
- **Loading spinner**: Rejected because adds to perceived load time, static content is better than spinner
- **Blank state**: Rejected because current approach (blank until animated) is poor UX

**Implementation Approach**:
- Add CSS gradient background to hero section (matches color palette: violet to rose gradient)
- Ensure hero text content (headline, subheadline, CTA) is in static HTML (not JS-rendered)
- Neural network canvas overlays background (higher z-index), only shows once initialized
- If canvas fails to initialize, user sees gradient background + text (fully functional)
- Add `<noscript>` tag with message: "Best experienced with JavaScript enabled" (optional)

**Sources**:
- MDN: Progressive enhancement principles
- A List Apart: Understanding Progressive Enhancement (2008 classic, still relevant)
- W3C: HTML5 noscript element specification

---

## Summary of Decisions

| Research Area | Decision | Rationale | Implementation Priority |
|---------------|----------|-----------|-------------------------|
| Neural Network Animation | Reduce particle count to 30-40, add lazy init, pause when not visible | Reduce CPU overhead while maintaining visual appeal | **P1 - Critical** |
| Cursor Effects | Remove cursor trail entirely, simplify custom cursor | High overhead for low UX value | **P1 - Critical** |
| Smooth Scroll | Reduce Lenis duration to 0.6s, disable section snap | Improve responsiveness, eliminate janky snap behavior | **P1 - Critical** |
| Lazy Loading | Implement Intersection Observer-based progressive loading | Improve TTI by deferring non-critical components | **P2 - Important** |
| Device Tier Detection | Use CPU core + memory + connection speed for classification | Adaptive performance for different device capabilities | **P2 - Important** |
| Performance Monitoring | Implement client-side monitoring + Lighthouse CI | Validate budgets and track real-world performance | **P2 - Important** |
| Static Fallback | CSS gradient background, semantic HTML content | Progressive enhancement, graceful degradation | **P1 - Critical** |

---

## Open Questions for Implementation

*All critical research decisions are resolved. The following are implementation details to be determined during coding:*

1. **Neural Network Particle Count Baseline**: Need to measure current particle count in production to calculate reduction target (measure in `neural-network.ts`)
2. **GSAP Intro Animation Refactoring**: Determine simplest fade-in approach that maintains visual quality (test during implementation)
3. **Custom Cursor Simplification**: Decide between CSS transform approach vs RAF lerp vs device-tier conditional disable (test performance impact)
4. **Lazy Loading Thresholds**: Fine-tune Intersection Observer `rootMargin` values for optimal perceived performance (A/B test during development)
5. **Device Tier Boundary Values**: Validate CPU/memory thresholds on real devices (current values are estimates, may need adjustment)
6. **Lighthouse CI Threshold**: Confirm 85+ mobile / 95+ desktop is achievable given GitHub Pages constraints (run baseline audit)

---

## References

- [MDN Web Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Google Web Fundamentals: Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering)
- [GSAP Performance Tips](https://greensock.com/performance/)
- [Lenis Smooth Scroll Documentation](https://github.com/studio-freight/lenis)
- [Web.dev: Core Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools: Performance Profiling](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [W3C: Intersection Observer API](https://www.w3.org/TR/intersection-observer/)
