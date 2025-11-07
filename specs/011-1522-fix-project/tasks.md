# Tasks: Performance Optimization for GitHub Pages

**Input**: Design documents from `/specs/011-1522-fix-project/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/ (complete)

**Tests**: Not requested in specification - no test tasks generated

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single-page web app**: `src/`, `tests/` at repository root
- All paths use src/ structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and performance configuration structure

- [ ] T001 Create performance monitoring directory structure: src/scripts/performance/ with subdirectories for utilities
- [ ] T002 Create performance configuration file at src/config/performance.ts with budget and device tier mappings
- [ ] T003 [P] Verify existing GSAP and Lenis dependencies are at correct versions (GSAP 3.13.0, Lenis 1.0.42) in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement device tier detection system in src/scripts/performance/device-tier.ts with classification algorithm from contracts/device-tiers.md
- [ ] T005 [P] Create device tier configuration mappings in src/config/performance.ts with particle counts, FPS targets, and feature flags
- [ ] T006 [P] Export device tier type definitions (DeviceTierLevel enum, DeviceTierResult interface) in src/scripts/performance/device-tier.ts
- [ ] T007 Integrate device tier detection into src/layouts/PageLayout.astro with global variable exposure (window.__DEVICE_TIER__)
- [ ] T008 Add CSS custom property --device-tier to document root for styling-based optimizations in src/layouts/PageLayout.astro
- [ ] T009 Remove cursor trail entirely: delete src/scripts/cursor-trail.ts file
- [ ] T010 Remove cursor trail component initialization from src/layouts/PageLayout.astro

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Fast Initial Page Load (Priority: P1) 🎯 MVP

**Goal**: Visitor sees hero section content within 2 seconds on mid-range mobile with Slow 3G connection

**Independent Test**: Throttle network to "Slow 3G" in Chrome DevTools, hard refresh page, measure FCP <2s and LCP <2.5s via Lighthouse

### Implementation for User Story 1

- [ ] T011 [P] [US1] Add CSS gradient fallback background to hero section in src/pages/index.astro using var(--color-primary) to var(--color-secondary)
- [ ] T012 [P] [US1] Add preload hints for critical assets (fonts, main CSS) in <head> of src/pages/index.astro
- [ ] T013 [P] [US1] Ensure hero text content (headline, subheadline, CTA) is in static HTML (not JS-rendered) in src/pages/index.astro
- [ ] T014 [US1] Modify neural network initialization to be asynchronous (non-blocking) in src/scripts/neural-network.ts
- [ ] T015 [US1] Implement device tier-based particle count configuration in src/scripts/neural-network.ts (50 HIGH, 30 MID, 20 LOW)
- [ ] T016 [US1] Add Intersection Observer to pause neural network animation when hero section not visible in src/scripts/neural-network.ts
- [ ] T017 [US1] Simplify GSAP intro animation to single fade-in timeline (replace complex stagger) in src/scripts/neural-network.ts
- [ ] T018 [US1] Add error boundary with static fallback if neural network fails to initialize in src/scripts/neural-network.ts
- [ ] T019 [US1] Update neural network canvas positioning to overlay on top of CSS gradient background in src/pages/index.astro styles

**Checkpoint**: At this point, User Story 1 should be fully functional - hero loads fast with static content visible immediately, neural network animates after without blocking

---

## Phase 4: User Story 2 - Smooth, Responsive Scrolling (Priority: P1)

**Goal**: Visitor scrolls through portfolio with immediate responsiveness, no lag or unexpected snapping

**Independent Test**: Scroll through all 5 sections using mouse wheel, trackpad, and touch, verify 60fps maintained via Chrome DevTools Performance monitor

### Implementation for User Story 2

- [ ] T020 [US2] Reduce Lenis smooth scroll duration from 1.2s to 0.6s in src/scripts/smooth-scroll.ts
- [ ] T021 [US2] Change Lenis easing function from easeInOutExpo to easeOutCubic in src/scripts/smooth-scroll.ts
- [ ] T022 [US2] Remove section snap functionality entirely (delete velocity detection and debounced snap logic) in src/scripts/smooth-scroll.ts
- [ ] T023 [US2] Add device tier check to conditionally disable Lenis on LOW tier devices in src/scripts/smooth-scroll.ts
- [ ] T024 [US2] Ensure prefers-reduced-motion check disables smooth scroll (use instant scroll-to-anchor) in src/scripts/smooth-scroll.ts
- [ ] T025 [US2] Add scroll interruption handling to prevent queued scroll animations in src/scripts/smooth-scroll.ts
- [ ] T026 [US2] Verify smooth scroll works with navigation links (programmatic scrolling) in src/scripts/navigation-links.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - page loads fast AND scrolling is smooth and responsive

---

## Phase 5: User Story 3 - Reduced Animation Overhead (Priority: P2)

**Goal**: Mid-range device experiences smooth, stable 30fps animations without CPU spikes or battery drain

**Independent Test**: Open site on mid-range device, monitor CPU in Task Manager, verify animations maintain 30fps minimum over 5 minutes

### Implementation for User Story 3

- [ ] T027 [P] [US3] Create performance monitor utility in src/scripts/performance/performance-monitor.ts with FPS tracking via requestAnimationFrame
- [ ] T028 [P] [US3] Add Core Web Vitals monitoring using PerformanceObserver API in src/scripts/performance/performance-monitor.ts
- [ ] T029 [P] [US3] Add memory usage tracking (Chrome-only performance.memory API) in src/scripts/performance/performance-monitor.ts
- [ ] T030 [US3] Add budget violation detection comparing metrics against PERFORMANCE_CONFIG.budget in src/scripts/performance/performance-monitor.ts
- [ ] T031 [US3] Initialize performance monitor in development mode only in src/layouts/PageLayout.astro (conditional on import.meta.env.DEV)
- [ ] T032 [US3] Add pause/resume methods to neural network animation class in src/scripts/neural-network.ts
- [ ] T033 [US3] Register neural network animation cleanup handler for astro:before-swap event in src/scripts/neural-network.ts
- [ ] T034 [US3] Simplify custom cursor to remove MutationObserver (use static selector query + event delegation) in src/scripts/custom-cursor.ts
- [ ] T035 [US3] Add device tier check to disable custom cursor on MID and LOW tier devices in src/scripts/custom-cursor.ts
- [ ] T036 [US3] Ensure all animations respect prefers-reduced-motion preference (disable neural network, cursor effects) in relevant scripts

**Checkpoint**: All three user stories should now work independently - fast load, smooth scroll, and optimized animations on all device tiers

---

## Phase 6: User Story 4 - Optimized Asset Loading (Priority: P2)

**Goal**: Portfolio loads efficiently with total initial page weight under 500KB (200KB critical assets)

**Independent Test**: Run production build, analyze dist/ folder, verify critical assets (HTML + CSS + JS for hero) under 200KB uncompressed

### Implementation for User Story 4

- [ ] T037 [P] [US4] Create lazy loader utility in src/scripts/performance/lazy-loader.ts with Intersection Observer wrapper
- [ ] T038 [P] [US4] Add priority-based lazy loading queue system in src/scripts/performance/lazy-loader.ts (IMMEDIATE, HIGH, MEDIUM, LOW)
- [ ] T039 [US4] Convert scroll progress initialization to lazy load (trigger on first scroll event) in src/scripts/scroll-progress.ts
- [ ] T040 [US4] Convert navigation dots initialization to lazy load (trigger when hero section exits viewport) in src/scripts/navigation-dots.ts
- [ ] T041 [US4] Convert custom cursor initialization to lazy load (trigger after 2s idle or first mousemove) in src/scripts/custom-cursor.ts
- [ ] T042 [US4] Update PageLayout.astro to use lazy initialization for scroll progress, navigation dots, and custom cursor
- [ ] T043 [US4] Add dynamic imports for lazy-loaded components to enable code splitting in src/scripts/performance/lazy-loader.ts
- [ ] T044 [US4] Add error handling for failed lazy loads with graceful fallback (site remains functional) in src/scripts/performance/lazy-loader.ts

**Checkpoint**: Asset loading optimized - non-critical components defer until after hero is interactive, reducing initial bundle size

---

## Phase 7: User Story 5 - Progressive Enhancement (Priority: P3)

**Goal**: Portfolio remains fully functional when JavaScript is disabled or fails to load

**Independent Test**: Disable JavaScript in browser settings, reload page, verify all text content readable and navigation links work with native scroll

### Implementation for User Story 5

- [ ] T045 [US5] Verify hero section renders without JavaScript (static HTML + CSS gradient) in src/pages/index.astro
- [ ] T046 [US5] Verify hash-based navigation works without JavaScript (native browser scroll-to-anchor) in src/pages/index.astro
- [ ] T047 [US5] Add error boundary to catch GSAP or Lenis library load failures in src/scripts/smooth-scroll.ts
- [ ] T048 [US5] Add error boundary to catch neural network animation failures in src/scripts/neural-network.ts
- [ ] T049 [US5] Ensure all animation initialization is wrapped in try-catch with console error logging in src/layouts/PageLayout.astro
- [ ] T050 [US5] Add optional <noscript> tag with "Best experienced with JavaScript enabled" message in src/layouts/PageLayout.astro
- [ ] T051 [US5] Verify CTA button and navigation links are functional HTML anchor tags (no JS required) in src/pages/index.astro

**Checkpoint**: All user stories complete - site is performant, accessible, and progressively enhanced for all scenarios

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T052 [P] Update CLAUDE.md with new performance utilities and animation patterns
- [ ] T053 [P] Create Lighthouse CI configuration file lighthouserc.json with performance budgets from contracts/performance-budgets.md
- [ ] T054 [P] Add GitHub Actions workflow .github/workflows/lighthouse-ci.yml for automated performance audits
- [ ] T055 Run baseline performance audit and record metrics in specs/011-1522-fix-project/contracts/baseline-metrics.json
- [ ] T056 Run post-optimization Lighthouse audit and compare against baseline (target: 85+ mobile, 95+ desktop)
- [ ] T057 Test device tier detection on multiple devices (high-end desktop, mid-range laptop, mobile emulation)
- [ ] T058 Verify all animations maintain target FPS on mid-range device (30fps minimum over 5 minutes)
- [ ] T059 Verify total page weight meets budget (≤500KB total, ≤200KB critical assets) in production build
- [ ] T060 Verify CSS gradient fallback displays correctly when JavaScript disabled or loading
- [ ] T061 [P] Run Biome linting and fix any violations (bun run lint && bun run format)
- [ ] T062 Validate all acceptance scenarios from spec.md user stories
- [ ] T063 Run quickstart.md validation (follow step-by-step guide, ensure accuracy)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel if staffed appropriately
  - OR sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P2) → US4 (P2) → US5 (P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Sequential tasks within a story build on previous tasks (e.g., modify neural-network.ts tasks must run in order)
- Each story should be independently completable and testable
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: T002 and T003 can run in parallel
- **Phase 2 Foundational**: T005 and T006 can run in parallel after T004 completes
- **Phase 3 User Story 1**: T011, T012, T013 can run in parallel (different files)
- **Phase 5 User Story 3**: T027, T028, T029 can run in parallel (performance-monitor.ts subtasks)
- **Phase 6 User Story 4**: T037 and T038 can run in parallel
- **Phase 8 Polish**: T052, T053, T054, T061 can run in parallel (different files)
- **All user stories (Phase 3-7)** can be worked on in parallel by different team members after Phase 2 completes

---

## Parallel Example: User Story 1

```bash
# Launch all static content tasks for User Story 1 together:
Task: "Add CSS gradient fallback background to hero section in src/pages/index.astro"
Task: "Add preload hints for critical assets in <head> of src/pages/index.astro"
Task: "Ensure hero text content is in static HTML in src/pages/index.astro"

# Then work on neural network optimization sequentially:
Task: "Modify neural network initialization to be asynchronous in src/scripts/neural-network.ts"
Task: "Implement device tier-based particle count in src/scripts/neural-network.ts"
Task: "Add Intersection Observer to pause animation in src/scripts/neural-network.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only - Both P1)

1. Complete Phase 1: Setup (3 tasks, ~30 minutes)
2. Complete Phase 2: Foundational (7 tasks, ~2 hours) - CRITICAL BLOCKING PHASE
3. Complete Phase 3: User Story 1 (9 tasks, ~3 hours) - Fast initial page load
4. Complete Phase 4: User Story 2 (7 tasks, ~2 hours) - Smooth responsive scrolling
5. **STOP and VALIDATE**: Test both user stories independently
   - Verify hero loads <2s on Slow 3G (US1)
   - Verify scrolling is smooth with no snapping (US2)
6. Deploy MVP to GitHub Pages for user feedback

**MVP Deliverable**: Site loads fast, scrolls smoothly - core performance issues resolved

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (~3 hours)
2. Add User Story 1 + 2 (both P1) → Test independently → Deploy (MVP - ~5 hours total)
3. Add User Story 3 (P2) → Test independently → Deploy (optimized animations - ~3 hours)
4. Add User Story 4 (P2) → Test independently → Deploy (lazy loading complete - ~2 hours)
5. Add User Story 5 (P3) → Test independently → Deploy (progressive enhancement - ~2 hours)
6. Complete Phase 8: Polish → Final audit and validation (~2 hours)

**Total Estimated Time**: 15-17 hours across 2-3 days of focused work

### Parallel Team Strategy

With multiple developers after Foundational phase complete:

1. **Developer A**: User Story 1 (Fast Initial Page Load) - 3 hours
2. **Developer B**: User Story 2 (Smooth Scrolling) - 2 hours
3. **Developer C**: User Story 3 (Animation Overhead) - 3 hours
4. Then integrate and proceed with US4 and US5 sequentially

**Timeline with parallel work**: ~8-10 hours elapsed time (vs 15-17 hours sequential)

---

## Notes

- [P] tasks = different files, no dependencies - safe to run in parallel
- [Story] label (US1-US5) maps task to specific user story for traceability
- Each user story is independently completable and testable
- Device tier detection (Phase 2) is CRITICAL and blocks all user story work
- All optimization tasks respect accessibility (prefers-reduced-motion, keyboard nav)
- Performance budgets enforced via Lighthouse CI in Phase 8
- Avoid: Cross-story dependencies that break independence, same-file conflicts when parallelizing
- Expected Outcome: Lighthouse 85+ (mobile), 95+ (desktop), LCP <2.5s, FCP <2s, 30fps animations

---

## Success Metrics (from contracts/performance-budgets.md)

**This feature is successful when**:

✅ All Core Web Vitals meet Max thresholds (LCP ≤2.5s, FID ≤100ms, CLS ≤0.1)
✅ Lighthouse Performance score ≥85 (mobile), ≥95 (desktop)
✅ Total page weight ≤500KB (critical assets ≤200KB)
✅ Animations maintain ≥30fps on mid-range devices
✅ Zero layout shift violations from animation initialization
✅ Site remains functional with JavaScript disabled (progressive enhancement)

**Validation Method**: Run Lighthouse CI audit, compare metrics against baselines in contracts/baseline-metrics.json
