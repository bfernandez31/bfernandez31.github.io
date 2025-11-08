---
description: "Task list for Text Split Animation feature implementation"
---

# Tasks: Text Split Animation

**Input**: Design documents from `/specs/012-1516-text-split/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are excluded from this implementation plan.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: Portfolio uses `src/`, `tests/` at repository root
- Paths assume Astro static site structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create text animation utility file and ensure GSAP is available

- [X] T001 Verify GSAP 3.13.0+ is installed and accessible in package.json
- [X] T002 Create src/scripts/text-animations.ts file with module structure and TypeScript interfaces from contracts/text-animation-api.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility functions that MUST be complete before ANY user story animations can work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Implement prefersReducedMotion() helper function in src/scripts/text-animations.ts
- [X] T004 [P] Implement parseConfig() function to extract and validate AnimationConfig from data attributes in src/scripts/text-animations.ts
- [X] T005 [P] Implement createSplitFragment() helper to create individual span elements with display: inline-block in src/scripts/text-animations.ts
- [X] T006 Implement createObserver() function to create IntersectionObserver with 50% threshold in src/scripts/text-animations.ts
- [X] T007 Implement global state management (animatedElements array, globalObserver, prefersReducedMotion flag) in src/scripts/text-animations.ts
- [X] T008 Implement cleanupTextAnimations() function with timeline cleanup and observer disconnection in src/scripts/text-animations.ts
- [X] T009 Add astro:before-swap event listener for automatic cleanup in src/scripts/text-animations.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Character-by-character reveal for hero headlines (Priority: P1) 🎯 MVP

**Goal**: Implement character-level text splitting and GSAP stagger animation that triggers on viewport entry

**Independent Test**: Add `data-split-text="char"` to hero h1 in src/pages/index.astro and verify each character fades in with 50ms stagger delay when scrolling to 50% visibility

### Implementation for User Story 1

- [X] T010 [US1] Implement splitText() function with character splitting logic using Array.from() for Unicode support in src/scripts/text-animations.ts
- [X] T011 [US1] Add accessibility pattern: create visually-hidden span with original text and aria-hidden wrapper for split fragments in splitText() function in src/scripts/text-animations.ts
- [X] T012 [US1] Implement createTimeline() function with GSAP fromTo animation (opacity 0→1, y: 20→0) and stagger configuration in src/scripts/text-animations.ts
- [X] T013 [US1] Implement reduced motion handling in createTimeline() to use gsap.set() instead of animation when user prefers reduced motion in src/scripts/text-animations.ts
- [X] T014 [US1] Implement animateElement() function that orchestrates splitText() and createTimeline() for a single element in src/scripts/text-animations.ts
- [X] T015 [US1] Implement initTextAnimations() function to query all [data-split-text] elements and initialize observers in src/scripts/text-animations.ts
- [X] T016 [US1] Add error handling for empty text content, invalid split types, and fragment count limits (500 warn, 1000 error) in src/scripts/text-animations.ts
- [X] T017 [US1] Add sr-only CSS class for visually-hidden text in src/styles/global.css (position: absolute, width: 1px, height: 1px, overflow: hidden)
- [X] T018 [US1] Test character animation on hero h1 element in src/pages/index.astro with data-split-text="char" attribute

**Checkpoint**: At this point, character-level text animation should work on hero headlines and can be independently tested

---

## Phase 4: User Story 2 - Word-by-word reveal for section titles (Priority: P2)

**Goal**: Extend splitText() to handle word-level splitting with proper whitespace preservation

**Independent Test**: Add `data-split-text="word"` to any section h2 in src/pages/index.astro and verify each word fades in sequentially with 50ms stagger delay

### Implementation for User Story 2

- [X] T019 [US2] Add word splitting logic to splitText() function using regex /\s+/ split with whitespace preservation in src/scripts/text-animations.ts
- [X] T020 [US2] Test word-level animation on section headings (h2/h3) in src/pages/index.astro with data-split-text="word" attribute
- [X] T021 [US2] Verify word animations work with custom duration and delay attributes (data-split-duration, data-split-delay) in src/pages/index.astro

**Checkpoint**: At this point, both character and word-level animations should work independently

---

## Phase 5: User Story 3 - Line-by-line reveal for paragraphs (Priority: P3)

**Goal**: Implement line-level splitting using Range.getClientRects() for visual line break detection

**Independent Test**: Add `data-split-text="line"` to a multi-line paragraph in src/pages/index.astro and verify each line fades in from top to bottom with 100ms stagger delay

### Implementation for User Story 3

- [X] T022 [US3] Add line splitting logic to splitText() function using Range.getClientRects() to detect visual line breaks in src/scripts/text-animations.ts
- [X] T023 [US3] Implement line break detection algorithm that preserves text order and handles multi-line content in splitText() function in src/scripts/text-animations.ts
- [X] T024 [US3] Update default stagger delay logic in parseConfig() to use 0.1s for line splits vs 0.05s for char/word in src/scripts/text-animations.ts
- [X] T025 [US3] Test line-level animation on paragraph elements in src/pages/index.astro with data-split-text="line" attribute
- [X] T026 [US3] Verify line animations handle viewport resize correctly (acceptable limitation: lines calculated at init, not recalculated on resize) in src/pages/index.astro

**Checkpoint**: All three splitting modes (char, word, line) should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and finalize implementation

- [X] T027 [P] Add TypeScript type exports for AnimationConfig, SplitFragment, AnimatedTextElement in src/scripts/text-animations.ts
- [X] T028 [P] Add console warnings for performance issues (>500 characters, invalid config values) in src/scripts/text-animations.ts
- [X] T029 [P] Verify GSAP performance: GPU-accelerated properties only (opacity, transform), 60fps target on HIGH tier devices
- [X] T030 Test reduced motion support: enable prefers-reduced-motion in OS settings and verify instant text reveal with no animation frames in browser
- [X] T031 Test screen reader compatibility: verify NVDA/VoiceOver announce complete text naturally without reading split spans in browser
- [X] T032 Test special characters and emojis: verify Unicode handling with Array.from() correctly splits multi-byte characters in src/pages/index.astro
- [X] T033 Test nested HTML elements: document limitation that nested tags (strong, em) are stripped by textContent in specs/012-1516-text-split/quickstart.md
- [X] T034 Test edge cases: empty text, whitespace-only text, very long text (>500 characters warning, >1000 characters error) in src/pages/index.astro
- [X] T035 Verify cleanup on Astro page navigation: test astro:before-swap listener kills timelines and disconnects observers in browser DevTools
- [X] T036 Update CLAUDE.md to include text animation utility in Animation Patterns section with usage examples
- [X] T037 Run quickstart.md validation: test all examples from specs/012-1516-text-split/quickstart.md in src/pages/index.astro

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories (Phase 3-5) being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after User Story 1 (T019 depends on T010 splitText function existing) - Extends character splitting to word splitting
- **User Story 3 (P3)**: Can start after User Story 1 (T022 depends on T010 splitText function existing) - Extends character splitting to line splitting

**Note**: User Stories 2 and 3 both extend the same splitText() function, so they cannot be worked on in parallel without merge conflicts. Recommend sequential implementation: US1 → US2 → US3.

### Within Each User Story

- Character splitting (US1) MUST be complete before word or line splitting can be added
- parseConfig() and createTimeline() (Foundational) MUST exist before any user story animations work
- Accessibility patterns (sr-only class) MUST exist before character splitting can be tested
- All splitting modes share the same createTimeline() and observer infrastructure

### Parallel Opportunities

- All Setup tasks (T001-T002) can run in parallel
- All Foundational tasks marked [P] (T003-T005) can run in parallel
- Within Phase 6 (Polish), tasks marked [P] (T027-T029) can run in parallel
- Testing tasks (T030-T035) can run in parallel after implementation complete

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational helper functions together:
Task: "Implement prefersReducedMotion() helper in src/scripts/text-animations.ts"
Task: "Implement parseConfig() function in src/scripts/text-animations.ts"
Task: "Implement createSplitFragment() helper in src/scripts/text-animations.ts"
```

## Parallel Example: Polish Phase

```bash
# Launch polish tasks together:
Task: "Add TypeScript type exports in src/scripts/text-animations.ts"
Task: "Add console warnings for performance issues in src/scripts/text-animations.ts"
Task: "Verify GSAP performance targets"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify GSAP, create file structure)
2. Complete Phase 2: Foundational (CRITICAL - all helper functions and infrastructure)
3. Complete Phase 3: User Story 1 (character splitting + animation)
4. **STOP and VALIDATE**: Test character animation on hero headlines independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (char splitting) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (word splitting) → Test independently → Deploy/Demo
4. Add User Story 3 (line splitting) → Test independently → Deploy/Demo
5. Complete Polish phase → Final validation → Production deploy

### Sequential Implementation (Recommended)

Since User Stories 2 and 3 both extend the splitText() function from User Story 1:

1. Team completes Setup + Foundational together (Phase 1-2)
2. Implement User Story 1 completely (character splitting)
3. Test and validate character animations work
4. Extend splitText() for User Story 2 (word splitting)
5. Test and validate word animations work
6. Extend splitText() for User Story 3 (line splitting)
7. Test and validate line animations work
8. Complete Polish phase (testing, documentation, performance validation)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story extends the same core utility (src/scripts/text-animations.ts), so sequential implementation avoids merge conflicts
- Character splitting (US1) is the MVP - proves core utility works
- Word and line splitting (US2, US3) are incremental enhancements to the same splitText() function
- All animations share the same GSAP timeline infrastructure (createTimeline, observer, cleanup)
- Verify reduced motion and screen reader support throughout implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Performance targets: 60fps on HIGH tier, 30fps on MID tier, <100ms initialization for 100 characters
