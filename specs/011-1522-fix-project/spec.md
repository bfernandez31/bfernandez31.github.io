# Feature Specification: Performance Optimization for GitHub Pages

**Feature Branch**: `011-1522-fix-project`
**Created**: 2025-11-07
**Status**: Draft
**Input**: User description: "#1522 Fix project issue - Site is laggy on GitHub Pages, smooth scrolling not working well since single-page conversion, hero section loading indefinitely"

## Auto-Resolved Decisions *(mandatory when clarification policies apply)*

### Decision 1: Performance Budget Targets

- **Decision**: Define aggressive performance budgets optimized for GitHub Pages static hosting with limited computational resources
- **Policy Applied**: AUTO → PRAGMATIC (confidence: High, netScore: -4)
- **Confidence**: High (0.9) - Signals: explicit speed directive ("laggy", "not smooth"), deployment context ("GitHub page"), user frustration indicators ("loading for eternity")
- **Fallback Triggered?**: No - clear user intent to prioritize speed over polish
- **Trade-offs**:
  1. **Scope**: Reduced animation complexity and particle counts may slightly diminish visual impact but dramatically improve perceived performance
  2. **Timeline**: Optimization work can be done incrementally (hero first, then other sections)
  3. **Quality**: Focus on "good enough" animations that feel smooth over pixel-perfect animations that stutter
- **Reviewer Notes**: Validate performance budgets on actual GitHub Pages deployment, not local dev environment. Test on mid-range devices (not just high-end developer machines).

### Decision 2: Lazy Loading Strategy

- **Decision**: Implement progressive enhancement with aggressive lazy loading - defer all non-critical animations and visual enhancements until after initial page load and hero section rendering
- **Policy Applied**: AUTO → PRAGMATIC (confidence: High, netScore: -5)
- **Confidence**: High (0.9) - Signals: loading issue ("loading on hero page for eternity"), deployment constraint ("GitHub page"), speed priority
- **Fallback Triggered?**: No - user explicitly prioritized initial load time
- **Trade-offs**:
  1. **UX**: Slight delay before secondary animations activate, but users can interact with content immediately
  2. **Complexity**: Requires Intersection Observer and conditional loading logic
  3. **Visual**: May see brief "pop-in" of animated elements (acceptable trade-off for speed)
- **Reviewer Notes**: Ensure lazy-loaded elements don't cause layout shift (CLS metric). Consider adding loading indicators for deferred animations if delay is noticeable.

### Decision 3: Smooth Scroll Tuning

- **Decision**: Reduce Lenis smooth scroll duration and disable automatic section snap functionality to eliminate janky scrolling behavior
- **Policy Applied**: AUTO → PRAGMATIC (confidence: Medium, netScore: -3)
- **Confidence**: Medium (0.6) - Signals: explicit complaint ("not rly smooth"), speed context, user frustration
- **Fallback Triggered?**: No - user directly identified scroll as problematic
- **Trade-offs**:
  1. **UX**: Less "fancy" momentum scrolling, but more responsive and predictable
  2. **Accessibility**: Simpler scroll behavior is easier to control for users with motor impairments
  3. **Polish**: Lose the "Awwwards" feel but gain reliability on low-end devices
- **Reviewer Notes**: Test scroll behavior on mobile devices and with mouse wheel vs trackpad. Consider making smooth scroll opt-in via user preference.

### Decision 4: Animation Reduction Hierarchy

- **Decision**: Prioritize core functionality over visual flourishes - disable cursor trail, simplify neural network, reduce custom cursor complexity, keep scroll progress (minimal overhead)
- **Policy Applied**: AUTO → PRAGMATIC (confidence: High, netScore: -4)
- **Confidence**: High (0.9) - Signals: deployment constraint ("GitHub page"), performance issue ("laggy"), speed priority
- **Fallback Triggered?**: No - clear user need for performance over aesthetics
- **Trade-offs**:
  1. **Visual Impact**: Portfolio will look less impressive but will be functional and accessible
  2. **Mobile**: Better mobile experience (cursor effects already disabled on touch devices)
  3. **Accessibility**: Reduced animations improve experience for users with motion sensitivity
- **Reviewer Notes**: Before disabling effects entirely, test if optimizations (reduced particle counts, lower frame rates) can preserve some visual interest while meeting performance targets.

### Decision 5: GitHub Pages Constraints

- **Decision**: Assume standard GitHub Pages hosting (static files only, no server-side optimization, CDN with varying cache performance) and optimize for worst-case scenarios
- **Policy Applied**: AUTO → CONSERVATIVE (confidence: Medium, netScore: 0)
- **Confidence**: Medium (0.6) - Signals: explicit context ("GitHub page"), constraint-based reasoning
- **Fallback Triggered?**: Yes - deployment constraints could impact security/reliability (conservative approach safer)
- **Trade-offs**:
  1. **Scope**: Cannot rely on server-side solutions (compression, lazy loading, code splitting beyond Astro's built-in capabilities)
  2. **Performance**: Must optimize bundle size and minimize external dependencies
  3. **Monitoring**: Cannot use server-side analytics for performance tracking
- **Reviewer Notes**: Verify Astro's build output is optimized for GitHub Pages. Check if additional build plugins or configuration can improve bundle size.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast Initial Page Load (Priority: P1)

A visitor lands on the portfolio homepage and sees the hero section content (headline, subheadline, CTA) within 2 seconds, even on a mid-range mobile device with a 3G connection. The neural network animation appears shortly after without blocking initial content rendering.

**Why this priority**: First impressions are critical for portfolio sites. Current "loading for eternity" issue means visitors may leave before seeing any content, defeating the purpose of the portfolio.

**Independent Test**: Can be fully tested by throttling network to "Slow 3G" in Chrome DevTools, hard refreshing the page, and measuring time to First Contentful Paint (FCP) and Largest Contentful Paint (LCP). Success = visible, interactive hero within 2s.

**Acceptance Scenarios**:

1. **Given** a visitor on a mobile device with slow connection, **When** they navigate to the homepage, **Then** hero text content renders within 2 seconds (measured via Lighthouse FCP metric)
2. **Given** hero content is visible, **When** neural network animation initializes, **Then** it does not block user interaction with CTA button or navigation links
3. **Given** JavaScript fails to load or is disabled, **When** user views hero section, **Then** static content remains fully readable and CTA remains clickable

---

### User Story 2 - Smooth, Responsive Scrolling (Priority: P1)

A visitor scrolls through the single-page portfolio using mouse wheel, trackpad, or touch gestures. Scrolling feels immediately responsive with no lag, jank, or unexpected snapping behavior. All five sections (#hero, #about, #projects, #expertise, #contact) are easily accessible.

**Why this priority**: User explicitly reported "not rly smooth" scrolling as a critical issue. Broken scrolling makes the site unusable and frustrating, especially after the single-page conversion.

**Independent Test**: Can be fully tested by scrolling through all sections using different input methods (mouse wheel, trackpad, touch) and verifying no frame drops occur (maintain 60fps during scroll). Use Chrome DevTools Performance monitor to track frame rate.

**Acceptance Scenarios**:

1. **Given** user scrolls with mouse wheel, **When** they scroll through any section, **Then** scroll speed matches input velocity with no artificial easing delays
2. **Given** user is scrolling through content, **When** they stop scrolling mid-section, **Then** content stops immediately without auto-snapping to section boundaries
3. **Given** user clicks navigation link (e.g., "Projects"), **When** smooth scroll animation begins, **Then** page scrolls to target section within 800ms with easeOutCubic easing
4. **Given** user prefers reduced motion (system setting), **When** they navigate between sections, **Then** scroll is instant with no smooth animation

---

### User Story 3 - Reduced Animation Overhead (Priority: P2)

A visitor with a mid-range device (e.g., 2019 MacBook Air, iPhone 11) experiences smooth, stable animations throughout the site. Neural network animation runs at consistent frame rate without causing CPU spikes or battery drain. No visual elements interfere with content readability.

**Why this priority**: Site performance must work on average hardware, not just high-end developer machines. Current laggy behavior suggests too many animations running simultaneously.

**Independent Test**: Can be fully tested by opening site on mid-range device, monitoring CPU usage in Task Manager/Activity Monitor, and verifying animations maintain target frame rate (30fps minimum) without thermal throttling over 5 minutes of interaction.

**Acceptance Scenarios**:

1. **Given** visitor views hero section, **When** neural network animation runs for 5 minutes, **Then** animation maintains minimum 30fps without degradation and CPU usage stays below 40%
2. **Given** multiple animations are active (neural network + scroll progress + custom cursor), **When** user interacts with the page, **Then** no single animation causes frame drops in other animations
3. **Given** user has "prefers-reduced-motion" enabled, **When** they view the site, **Then** all non-essential animations (neural network, cursor trail) are disabled, leaving only static visuals

---

### User Story 4 - Optimized Asset Loading (Priority: P2)

The portfolio site loads efficiently over GitHub Pages CDN with minimal bundle size. JavaScript and CSS files are optimized, code-split where possible, and non-critical resources are deferred. Total page weight stays under 500KB (uncompressed) for initial load.

**Why this priority**: GitHub Pages has limited bandwidth and caching capabilities. Excessive asset sizes compound the slow loading problem, especially for international visitors far from GitHub's CDN edge nodes.

**Independent Test**: Can be fully tested by running production build (`bun run build`), analyzing bundle sizes in dist/ folder, and verifying total size of critical assets (HTML, CSS, JS needed for hero section) is under 200KB. Use Lighthouse or WebPageTest for real-world loading analysis.

**Acceptance Scenarios**:

1. **Given** production build is complete, **When** analyzing dist/ folder, **Then** total size of critical assets (main CSS, main JS, index.html) is under 200KB uncompressed
2. **Given** user loads homepage, **When** monitoring Network tab, **Then** no more than 3 render-blocking resources are loaded before First Contentful Paint
3. **Given** Astro build process runs, **When** generating production output, **Then** Astro's built-in code splitting creates separate bundles for each major component (Hero, Projects, etc.) loaded on-demand

---

### User Story 5 - Progressive Enhancement (Priority: P3)

The portfolio remains fully functional when JavaScript is disabled or fails to load. Core content (text, images, navigation links) remains accessible. Animations and interactive enhancements gracefully degrade without breaking the user experience.

**Why this priority**: GitHub Pages occasionally has CDN issues, and some users browse with JavaScript disabled. Site should follow progressive enhancement principles to ensure baseline functionality always works.

**Independent Test**: Can be fully tested by disabling JavaScript in browser settings, reloading the page, and verifying all text content is readable, all navigation links work (even if smooth scroll is disabled), and layout remains intact.

**Acceptance Scenarios**:

1. **Given** JavaScript is disabled in browser, **When** user views homepage, **Then** all hero content (headline, subheadline, CTA) renders correctly with proper styling
2. **Given** JavaScript fails to load due to network error, **When** user clicks navigation links, **Then** hash-based navigation still works (browser default scroll-to-anchor behavior)
3. **Given** GSAP or Lenis libraries fail to load, **When** neural network animation attempts to initialize, **Then** error is caught gracefully and static fallback is displayed (solid color background or CSS gradient)

---

### Edge Cases

- **What happens when** user rapidly scrolls up and down multiple times (stress test for smooth scroll performance)?
  - Expected: Scroll remains responsive, Lenis queue doesn't accumulate pending animations causing delays
- **What happens when** user has ultra-low-end device (e.g., 2015 smartphone, <2GB RAM)?
  - Expected: Site still loads and remains interactive, even if animations are disabled or simplified via device tier detection
- **What happens when** GitHub Pages CDN is slow or user has intermittent connection (packet loss)?
  - Expected: Site gracefully handles loading errors, shows static content first, retries animation asset loading in background
- **How does system handle** browser without Canvas 2D support or WebGL disabled?
  - Expected: Neural network animation gracefully fails, shows CSS gradient fallback background
- **What happens when** user resizes browser window while neural network animation is running?
  - Expected: Animation gracefully handles resize event, repositions particles within new bounds without crashing or causing memory leaks
- **How does system handle** user navigating away from hero section quickly (before neural network animation completes initialization)?
  - Expected: Animation cleanup runs immediately, cancels pending initialization, prevents orphaned animation frames

## Requirements *(mandatory)*

### Functional Requirements

#### Performance Optimization

- **FR-001**: System MUST render hero section First Contentful Paint (FCP) within 2 seconds on a simulated "Slow 3G" connection as measured by Lighthouse
- **FR-002**: System MUST maintain minimum 30fps frame rate for neural network animation on mid-range devices (4-core CPU, 8GB RAM)
- **FR-003**: System MUST keep total initial bundle size (HTML + critical CSS + critical JS) under 200KB uncompressed
- **FR-004**: System MUST defer non-critical animations (cursor trail, complex GSAP animations) until after hero section is interactive

#### Scroll Behavior

- **FR-005**: System MUST use native browser scroll or lightweight smooth scroll implementation (Lenis duration <0.8s) for immediate responsiveness
- **FR-006**: System MUST disable automatic section snap functionality to eliminate jerky scrolling behavior
- **FR-007**: System MUST respect `prefers-reduced-motion` preference by disabling smooth scroll and using instant scroll-to-anchor behavior
- **FR-008**: System MUST allow users to interrupt smooth scroll animations mid-scroll without queuing up additional scroll events

#### Animation Optimization

- **FR-009**: System MUST reduce neural network particle count to 30-50 nodes (from current count) based on device tier detection
- **FR-010**: System MUST disable cursor trail animation entirely (high overhead, low value for user experience)
- **FR-011**: System MUST simplify custom cursor to basic position tracking without smooth following animation (or disable on lower-end devices)
- **FR-012**: System MUST use Intersection Observer to pause neural network animation when hero section is not visible in viewport
- **FR-013**: System MUST implement lazy loading for ScrollProgress component (defer initialization until user begins scrolling)

#### Loading Strategy

- **FR-014**: System MUST load and initialize neural network animation asynchronously without blocking hero content rendering
- **FR-015**: System MUST display static fallback content (CSS gradient background) while neural network animation initializes
- **FR-016**: System MUST implement error boundaries to catch animation initialization failures and display fallback without crashing page
- **FR-017**: System MUST preload critical hero section assets (fonts, CSS) using `<link rel="preload">` in HTML head

#### Resource Management

- **FR-018**: System MUST properly clean up animation resources (cancel requestAnimationFrame, remove event listeners) when components unmount or user navigates away
- **FR-019**: System MUST limit GSAP animation instances to prevent memory leaks (destroy completed animations)
- **FR-020**: System MUST debounce window resize handlers to prevent excessive recalculations during resize events

#### Progressive Enhancement

- **FR-021**: System MUST render all hero text content (headline, subheadline, CTA) in static HTML without requiring JavaScript
- **FR-022**: System MUST maintain functional hash-based navigation (`#hero`, `#about`, etc.) when JavaScript is disabled
- **FR-023**: System MUST gracefully handle missing or failed animation library loads (GSAP, Lenis) without breaking page functionality

### Key Entities

- **Performance Budget**: Target metrics for page load (FCP <2s, LCP <2.5s, TTI <3.5s, CLS <0.1, FID <100ms) optimized for GitHub Pages hosting constraints
- **Device Tier**: Classification of user's device capabilities (high-end, mid-range, low-end) based on CPU core count, memory, and connection speed to dynamically adjust animation quality
- **Animation State**: Tracking system for all active animations (neural network, scroll progress, custom cursor) to coordinate resource usage and prevent conflicts
- **Lazy Load Queue**: Priority-ordered list of non-critical components to initialize after hero section is interactive (ScrollProgress P1, NavigationDots P2, custom cursor P3)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse performance score improves from current baseline to 85+ (mobile) and 95+ (desktop) on production GitHub Pages deployment
- **SC-002**: First Contentful Paint (FCP) reduces to under 2 seconds when tested on "Slow 3G" network throttling in Chrome DevTools
- **SC-003**: Largest Contentful Paint (LCP) reduces to under 2.5 seconds when tested on "Slow 3G" network throttling
- **SC-004**: Time to Interactive (TTI) reduces to under 3.5 seconds on mid-range mobile devices (Moto G4, iPhone 8 equivalent)
- **SC-005**: Total Blocking Time (TBT) reduces to under 300ms, allowing users to interact with hero CTA immediately after visual rendering
- **SC-006**: Cumulative Layout Shift (CLS) remains under 0.1 (good rating) with no unexpected jumps when animations initialize
- **SC-007**: Neural network animation maintains consistent 30fps minimum frame rate on mid-range devices without thermal throttling over 5 minutes
- **SC-008**: Scroll input latency reduces to under 16ms (60fps response time) for immediate feedback on mouse wheel or trackpad gestures
- **SC-009**: Total initial page weight (all assets loaded before TTI) reduces to under 500KB uncompressed, under 200KB gzip-compressed
- **SC-010**: Bundle size for critical path assets (HTML + critical CSS + critical JS needed for hero) reduces to under 200KB uncompressed
- **SC-011**: CPU usage during neural network animation stays below 40% on mid-range devices (4-core CPU) to prevent battery drain and thermal throttling
- **SC-012**: Memory usage remains stable below 100MB heap size after 5 minutes of interaction with all animations running
- **SC-013**: 95% of users successfully navigate between sections on first attempt without experiencing scroll lag or unexpected snapping (measured via analytics event tracking)
- **SC-014**: Zero JavaScript errors reported in production logs related to animation initialization or cleanup failures

### Qualitative Outcomes

- **SC-015**: Users perceive site as "fast and responsive" with no noticeable lag when scrolling or interacting with navigation
- **SC-016**: Hero section appears to load "instantly" with content visible before animations begin (perceived performance improvement)
- **SC-017**: Smooth scroll feels "natural and predictable" without unexpected momentum or snapping behavior
- **SC-018**: Site remains fully functional and accessible on low-end devices and slow connections, meeting baseline usability standards

## Assumptions

1. **Hosting Environment**: Site is deployed on GitHub Pages with standard static file hosting (no server-side optimization, no custom CDN configuration, no edge functions)
2. **Target Audience**: Portfolio visitors primarily use modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled, but site must gracefully degrade for edge cases
3. **Device Distribution**: 40% mobile visitors, 50% desktop, 10% tablet - optimizations must prioritize mobile performance without regressing desktop experience
4. **Network Conditions**: Average visitor has 4G or better connection, but site must remain usable on 3G (assume 1.5 Mbps download, 400ms RTT)
5. **Browser Support**: Modern evergreen browsers (last 2 versions) - no IE11 support required, can use modern JavaScript features (ES2020+)
6. **Animation Value**: Visual animations are "nice-to-have" enhancements, not core functionality - can be reduced or disabled if necessary to meet performance targets
7. **Existing Infrastructure**: Can leverage Astro's built-in optimizations (code splitting, CSS bundling, HTML compression) without adding complex build tools
8. **Testing Capabilities**: Have access to Chrome DevTools Lighthouse, Network throttling, Performance monitor, and Rendering panel for performance validation
9. **GitHub Pages Caching**: Assume standard GitHub Pages CDN caching (no control over cache headers or edge behavior) - must optimize for cold cache scenarios
10. **User Preferences**: Majority of users have default browser settings, but must respect `prefers-reduced-motion` and handle JavaScript disabled scenarios

## Constraints

1. **GitHub Pages Hosting**: Cannot use server-side rendering, edge functions, or custom CDN configuration - limited to static file hosting with standard GitHub Pages CDN
2. **Bundle Size Budget**: Total initial load must stay under 500KB uncompressed to accommodate slow connections and GitHub Pages bandwidth limitations
3. **No Backend Services**: Cannot implement server-side performance monitoring, analytics, or adaptive serving - all optimization must be client-side
4. **Astro Static Output**: Must maintain `output: "static"` mode in Astro config (no SSR or hybrid rendering available on GitHub Pages)
5. **Existing Architecture**: Must preserve single-page architecture with hash-based navigation (#hero, #about, #projects, #expertise, #contact) - no multi-page conversion
6. **Accessibility Requirements**: All performance optimizations must maintain WCAG 2.1 AA compliance (keyboard navigation, screen reader support, color contrast)
7. **Animation Library Dependencies**: Currently depend on GSAP (3.13.0) and Lenis (1.0.42) - replacing libraries would require significant refactoring (prefer optimization over replacement)
8. **Device Support**: Must support devices as old as 2018 (iPhone 8, mid-range Android) - cannot assume latest hardware capabilities
9. **Progressive Enhancement**: Must maintain functional baseline experience when JavaScript fails to load or is disabled by user
10. **No Breaking Changes**: Performance fixes must not break existing navigation system, deep linking, or browser history management

## Dependencies

1. **Astro Build System**: Relies on Astro 5.15.3 build optimizations (code splitting, CSS bundling, HTML compression) for production output
2. **GSAP Library**: Neural network animation depends on GSAP for intro animations and ScrollTrigger integration - performance tuning required
3. **Lenis Library**: Current smooth scroll implementation uses Lenis 1.0.42 - may need to simplify or replace for performance
4. **Browser APIs**: Depends on Intersection Observer (for lazy loading), requestAnimationFrame (for animations), Performance API (for monitoring)
5. **GitHub Pages Deployment**: Build and deployment pipeline relies on GitHub Actions workflow - any build optimizations must be compatible
6. **TypeScript Compiler**: TypeScript 5.9+ required for type checking - must ensure optimizations don't introduce type errors
7. **Biome Linter**: Code changes must pass Biome linting/formatting checks to maintain code quality standards

## Open Questions

*None - all critical decisions have been auto-resolved using PRAGMATIC policy as appropriate for this performance optimization task. Reviewer should validate performance budgets and device tier thresholds during implementation.*

## Related Features

- **003-1507-architecture-globale**: Original Awwwards-worthy portfolio architecture implementation - established animation patterns and performance targets
- **005-1510-convert-multi**: Single-page architecture conversion - introduced scrolling system that is now causing performance issues
- **006-title-lenis-smooth**: Lenis smooth scroll integration with section snap - primary source of "not smooth" scrolling behavior
- **007-title-vertical-navigation**: Navigation dots component - adds minimal overhead but should be profiled
- **008-title-scroll-progress**: Scroll progress indicator - lightweight component, good candidate for lazy loading
- **009-title-custom-cursor**: Custom cursor with interactive element detection - high overhead due to GSAP quickTo and MutationObserver
- **010-title-cursor-trail**: Luminous particle trail cursor effect - very high overhead (60fps canvas drawing), primary candidate for removal

## Notes

### Performance Audit Context

Based on codebase analysis, identified performance bottlenecks:

1. **Neural Network Animation** (`src/scripts/neural-network.ts`):
   - Currently initializes immediately on page load (blocking)
   - GSAP intro animation with stagger effect for node opacity (150+ animations)
   - Continuous requestAnimationFrame loop (60fps target on desktop, 30fps on mobile)
   - No lazy loading or Intersection Observer pause mechanism

2. **Cursor Trail** (`src/scripts/cursor-trail.ts`):
   - Spawns 2 particles per frame at cursor position (max 30 particles)
   - Continuous canvas drawing at 60fps with shadow blur effects
   - High CPU overhead for visual effect that doesn't enhance UX

3. **Custom Cursor** (`src/scripts/custom-cursor.ts`):
   - GSAP quickTo for position tracking (60fps)
   - MutationObserver watching entire DOM for interactive elements
   - Significant overhead for desktop-only feature

4. **Smooth Scroll** (`src/scripts/smooth-scroll.ts`):
   - Lenis configured with 1.2s duration easeInOutExpo
   - Automatic section snap with 150ms debounce
   - Snap detection runs on every scroll event (potential frame drops)

5. **Bundle Size Concerns**:
   - GSAP core + ScrollTrigger plugin (~50KB gzipped)
   - Lenis library (~15KB gzipped)
   - Multiple animation scripts with complex logic
   - No code splitting for animation features

### Optimization Strategy Priority

**Phase 1 - Quick Wins (Target: 1-2 days)**:
- Remove cursor trail entirely (high impact, low effort)
- Reduce neural network node count from current to 30-40 based on device tier
- Disable section snap in Lenis configuration
- Add CSS fallback background for hero section

**Phase 2 - Loading Optimization (Target: 2-3 days)**:
- Implement async neural network initialization with Intersection Observer
- Add lazy loading for ScrollProgress and NavigationDots
- Simplify custom cursor or disable on mid/low-tier devices
- Add preload hints for critical assets

**Phase 3 - Fine Tuning (Target: 1-2 days)**:
- Optimize Lenis configuration (reduce duration to 0.6-0.8s)
- Implement proper animation cleanup (prevent memory leaks)
- Add performance monitoring and device tier detection
- Run Lighthouse audits and address remaining issues

### Testing Plan

1. **Baseline Metrics**: Run Lighthouse on current production deployment, record FCP, LCP, TTI, TBT, CLS scores
2. **Network Throttling**: Test on Slow 3G, Fast 3G, 4G profiles to validate loading performance
3. **Device Emulation**: Test on Moto G4, iPhone 8, mid-range laptop profiles in Chrome DevTools
4. **Real Device Testing**: If possible, test on actual 2018-2019 era devices (iPhone 8, MacBook Air 2019)
5. **Regression Testing**: Ensure navigation system, deep linking, accessibility features remain functional after optimizations
6. **Analytics Validation**: Monitor bounce rate, time on page, scroll depth metrics before/after deployment to validate user experience improvements
