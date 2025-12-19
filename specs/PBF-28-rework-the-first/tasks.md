# Tasks: Award-Winning Hero Section Rework

**Input**: Design documents from `/specs/PBF-28-rework-the-first/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/hero-animation.ts, quickstart.md

**Tests**: No tests explicitly requested in the feature specification. Tests are excluded from this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

## User Story Mapping

| Story | Title | Priority | Spec Reference |
|-------|-------|----------|----------------|
| US1 | First Impression Impact | P1 | Hero entrance animation, cursor interactivity, mobile adaptation |
| US2 | Scroll Engagement Hook | P2 | Scroll-triggered effects, parallax, visual cues |
| US3 | Awwwards Judge Evaluation | P2 | Performance targets, accessibility, responsiveness |
| US4 | Performance-Constrained Visitor | P3 | Device tier adaptation, graceful degradation |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create project structure for hero animation system

- [X] T001 Install OGL dependency with `bun add ogl`
- [X] T002 [P] Create hero module directory structure at src/scripts/hero/
- [X] T003 [P] Create hero CSS effects file at src/styles/effects/hero-effects.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create TypeScript type imports for contracts in src/scripts/hero/types.ts (re-export from specs/PBF-28-rework-the-first/contracts/hero-animation.ts)
- [X] T005 [P] Create prefersReducedMotion utility export in src/scripts/animation-config.ts (if not exists)
- [X] T006 [P] Add hero performance settings to src/config/performance.ts (degradation thresholds, shape counts by tier)
- [X] T007 Update global.css to import src/styles/effects/hero-effects.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First Impression Impact (Priority: P1)

**Goal**: Deliver a visually striking hero section with 3D background, choreographed entrance animation, and cursor interactivity within 3 seconds of page load

**Independent Test**: Load homepage on desktop and mobile; verify entrance animation completes in <3s, cursor parallax works on desktop, and content is immediately visible with prefers-reduced-motion

### Implementation for User Story 1

#### Core Modules

- [X] T008 [P] [US1] Create Background3D class in src/scripts/hero/background-3d.ts implementing IBackground3D interface with OGL renderer, scene setup, and geometric shapes
- [X] T009 [P] [US1] Create CursorTracker class in src/scripts/hero/cursor-tracker.ts implementing ICursorTracker interface with GSAP quickTo for 60fps parallax
- [X] T010 [P] [US1] Create TypographyReveal class in src/scripts/hero/typography-reveal.ts implementing ITypographyReveal interface with GSAP timeline entrance

#### Controller

- [X] T011 [US1] Create HeroAnimationController class in src/scripts/hero/hero-controller.ts implementing IHeroAnimationController interface, orchestrating background, cursor, and typography subsystems
- [X] T012 [US1] Export initHeroAnimation factory function from src/scripts/hero/hero-controller.ts with window.__heroController__ for cleanup

#### Component Integration

- [X] T013 [US1] Update Hero.astro component in src/components/sections/Hero.astro with canvas element, data-hero-text attributes, and fallback gradient
- [X] T014 [US1] Add client-side script to Hero.astro that imports and initializes hero animation on DOMContentLoaded
- [X] T015 [US1] Add cleanup listener for astro:before-swap event in Hero.astro script

#### Styling

- [X] T016 [US1] Add hero canvas and fallback CSS to src/styles/effects/hero-effects.css (z-index layering, gradient fallback, hero--active class)
- [X] T017 [US1] Add hero content initial hidden state CSS in src/styles/effects/hero-effects.css (opacity: 0, transform for entrance)
- [X] T018 [US1] Add prefers-reduced-motion styles in src/styles/effects/hero-effects.css (content visible immediately, no animation)

#### Mobile Adaptation

- [X] T019 [US1] Add touch device detection in cursor-tracker.ts (disable parallax when hover: hover fails)
- [X] T020 [US1] Add mobile-specific entrance animation timing in hero-controller.ts (simplified sequence)

**Checkpoint**: User Story 1 complete - hero shows entrance animation, cursor parallax works on desktop, mobile has adapted experience, reduced motion shows static content

---

## Phase 4: User Story 2 - Scroll Engagement Hook (Priority: P2)

**Goal**: Create seamless scroll transition from hero with parallax effects and visual cues that encourage continued scrolling

**Independent Test**: Scroll from hero to About section; verify parallax/fade effects on scroll, scroll indicator appears at 50%, and returning to top resets hero smoothly

### Implementation for User Story 2

- [X] T021 [US2] Add scroll progress tracking in hero-controller.ts using IntersectionObserver or scroll events
- [X] T022 [US2] Implement parallax fade effect on scroll in hero-controller.ts (shapes and content fade based on scroll position)
- [X] T023 [P] [US2] Add scroll indicator element to Hero.astro (arrow or text encouraging scroll)
- [X] T024 [US2] Add scroll indicator CSS animation in src/styles/effects/hero-effects.css (bounce, fade-in at 50% scroll)
- [X] T025 [US2] Implement hero reset on scroll-to-top in hero-controller.ts (smooth state restoration)

**Checkpoint**: User Story 2 complete - scroll creates depth effect, indicator guides users, returning to top works smoothly

---

## Phase 5: User Story 3 - Awwwards Judge Evaluation (Priority: P2)

**Goal**: Ensure hero meets Awwwards criteria: creativity (unique visual), usability (accessible interactions), design (cohesive aesthetic), and performance (Lighthouse 85+ mobile)

**Independent Test**: Run Lighthouse audit, test keyboard navigation, verify all interactive elements have feedback, and check responsiveness across breakpoints

### Implementation for User Story 3

#### Accessibility

- [X] T026 [P] [US3] Add aria-hidden="true" to canvas element in Hero.astro
- [X] T027 [P] [US3] Ensure CTA button has proper focus-visible styles in src/styles/effects/hero-effects.css
- [X] T028 [US3] Add keyboard navigation support in hero-controller.ts (no focus traps, logical tab order)

#### Responsiveness

- [X] T029 [US3] Add responsive shape positioning in background-3d.ts (adjust positions based on viewport width)
- [X] T030 [US3] Add viewport size validation in hero-controller.ts (handle 320px to 2560px widths)
- [X] T031 [P] [US3] Add responsive typography sizing in src/styles/effects/hero-effects.css using clamp()

#### Performance Optimization

- [X] T032 [US3] Implement lazy initialization in hero-controller.ts (client:visible directive pattern)
- [X] T033 [US3] Add canvas resize handler in background-3d.ts with debounce for performance
- [X] T034 [US3] Optimize OGL imports in background-3d.ts (import only needed geometry types)

#### Visual Cohesion

- [X] T035 [P] [US3] Map Catppuccin Mocha colors to shape materials in background-3d.ts (violet primary, rose secondary, lavender accent)
- [X] T036 [P] [US3] Add perspective grid effect to background-3d.ts (optional, for architectural depth)

**Checkpoint**: User Story 3 complete - passes Lighthouse 85+ mobile, WCAG AA compliant, responsive across all viewports

---

## Phase 6: User Story 4 - Performance-Constrained Visitor (Priority: P3)

**Goal**: Ensure hero works on mid-range mobile devices (4GB RAM, 3G network) with automatic performance adaptation

**Independent Test**: Test on budget Android device or throttled connection; verify content visible in 3s, animation degrades gracefully, LOW tier shows CSS fallback

### Implementation for User Story 4

#### Performance Monitoring

- [X] T037 [US4] Create HeroPerformanceMonitor class in src/scripts/hero/performance-monitor.ts implementing IHeroPerformanceMonitor interface
- [X] T038 [US4] Integrate performance monitor with hero-controller.ts (frame rate sampling, degradation triggers)

#### Degradation Levels

- [X] T039 [US4] Implement level 1 degradation in background-3d.ts (removeShape to reduce count by 30%)
- [X] T040 [US4] Implement level 2 degradation in hero-controller.ts (disable cursor parallax)
- [X] T041 [US4] Implement level 3 degradation in hero-controller.ts (switch to CSS gradient fallback, stop WebGL)

#### Device Tier Adaptation

- [X] T042 [US4] Add device tier shape count selection in background-3d.ts using DEFAULT_SHAPES_BY_TIER from contracts
- [X] T043 [US4] Add LOW tier shortcut in hero-controller.ts (skip WebGL init, show static immediately)

#### Progressive Enhancement

- [X] T044 [US4] Add noscript fallback in Hero.astro (visible content without JavaScript)
- [X] T045 [US4] Add WebGL context loss handling in background-3d.ts (graceful fallback to gradient)
- [X] T046 [US4] Ensure critical content (headline, CTA) is visible within 2s in hero-controller.ts

**Checkpoint**: User Story 4 complete - works on mid-tier devices, degrades gracefully, static fallback always available

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations and cleanup affecting multiple user stories

- [X] T047 [P] Deprecate old neural-network.ts in src/scripts/ (add deprecation comment, do not delete yet)
- [X] T048 [P] Add hero animation config export to src/scripts/animation-config.ts (entrance timing, parallax factors)
- [X] T049 Code cleanup: remove console.log statements from hero modules
- [X] T050 Verify all hero modules respect prefers-reduced-motion preference
- [X] T051 Run build verification: `bun run build` and check for TypeScript errors
- [X] T052 Run quickstart.md validation: test installation steps and verify expected output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start first - core hero functionality
  - US2 (P2): Can run parallel to US3, may reuse US1 components
  - US3 (P2): Can run parallel to US2, focuses on quality/accessibility
  - US4 (P3): Can start after US1 (needs background-3d.ts for degradation)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 completion (needs hero-controller.ts and background-3d.ts)
- **User Story 3 (P2)**: Can start after Foundational, but should have US1 modules available for testing
- **User Story 4 (P3)**: Depends on US1 completion (needs background-3d.ts for degradation logic)

### Within Each User Story

- Core modules before controller
- Controller before component integration
- Styling in parallel with implementation
- Mobile/accessibility concerns after core implementation

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- US1: T008, T009, T010 (core modules) can run in parallel
- US1: T016, T017, T018 (styling) can run in parallel
- US3: T026, T027 (accessibility) and T031, T035, T036 (styling) can run in parallel
- Polish: T047, T048 can run in parallel

---

## Parallel Example: User Story 1 Core Modules

```bash
# Launch all core modules for User Story 1 together:
Task: "Create Background3D class in src/scripts/hero/background-3d.ts"
Task: "Create CursorTracker class in src/scripts/hero/cursor-tracker.ts"
Task: "Create TypographyReveal class in src/scripts/hero/typography-reveal.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test hero entrance, cursor parallax, and reduced motion
5. Deploy/demo if ready - hero is functional

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 (First Impression) = Test entrance animation, cursor effect
3. Add User Story 2 (Scroll Hook) = Test scroll behavior
4. Add User Story 3 (Awwwards Ready) = Test performance, accessibility
5. Add User Story 4 (Performance) = Test on budget devices
6. Each story adds value without breaking previous stories

### Key Files Summary

| File | Created/Modified | User Stories |
|------|------------------|--------------|
| src/scripts/hero/background-3d.ts | Created | US1, US3, US4 |
| src/scripts/hero/cursor-tracker.ts | Created | US1, US4 |
| src/scripts/hero/typography-reveal.ts | Created | US1 |
| src/scripts/hero/hero-controller.ts | Created | US1, US2, US4 |
| src/scripts/hero/performance-monitor.ts | Created | US4 |
| src/scripts/hero/types.ts | Created | All |
| src/components/sections/Hero.astro | Modified | US1, US2, US3, US4 |
| src/styles/effects/hero-effects.css | Created | US1, US2, US3 |
| src/config/performance.ts | Modified | US4 |
| src/scripts/animation-config.ts | Modified | US1 |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- OGL tree-shaking: only import needed geometry types (Box, Torus, etc.)
- Total hero system budget: 30KB (well within 200KB JS limit)
- Performance targets: Lighthouse 85+ mobile, 95+ desktop, LCP <2.5s
