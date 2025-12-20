# Tasks: TUI Layout Redesign

**Input**: Design documents from `/specs/PBF-37-layout-tui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No tests requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: TypeScript types and data configuration updates

- [ ] T001 Extend TypeScript interfaces in src/types/tui.ts (add SectionId, BufferTab, NavigationState, LineNumbersConfig, ViewportMode, AnimationState types)
- [ ] T002 [P] Update section configuration data in src/data/sections.ts (add lineCount, icon, fileName properties per section)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CSS infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create CSS custom properties for tab styling in src/styles/tui/tabs.css (file icons, separators, active/inactive states, hover states)
- [ ] T004 [P] Add CSS for horizontal section container layout in src/styles/tui/layout.css (flexbox/grid for horizontal sections, overflow hidden, viewport sizing)
- [ ] T005 [P] Add CSS GPU-acceleration hints in src/styles/tui/layout.css (will-change: transform, translateZ(0) for section containers)
- [ ] T006 Import new tabs.css in main stylesheet src/styles/tui/index.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Desktop Tab Navigation (Priority: P1)

**Goal**: Horizontal slide animation between sections on desktop when clicking tabs or using keyboard navigation

**Independent Test**: Click each buffer tab and observe horizontal slide animation; use j/k keys; test browser back/forward

### Implementation for User Story 1

- [ ] T007 [US1] Refactor tui-navigation.ts core structure in src/scripts/tui-navigation.ts (add state management for currentSectionIndex, isAnimating, viewportMode)
- [ ] T008 [US1] Implement slideToSection() function in src/scripts/tui-navigation.ts (GSAP timeline with xPercent animation, direction based on target index)
- [ ] T009 [US1] Implement rapid click handling in src/scripts/tui-navigation.ts (gsap.killTweensOf() to cancel in-progress animations)
- [ ] T010 [US1] Integrate browser history in src/scripts/tui-navigation.ts (popstate listener, history.pushState on section change with updateHistory flag)
- [ ] T011 [US1] Implement keyboard navigation with slide in src/scripts/tui-navigation.ts (j/k and arrow key handlers trigger slideToSection)
- [ ] T012 [US1] Add viewport mode detection in src/scripts/tui-navigation.ts (matchMedia for 1024px breakpoint, resize listener to update viewportMode)
- [ ] T013 [US1] Implement reduced motion fallback in src/scripts/tui-navigation.ts (gsap.matchMedia() for prefers-reduced-motion with instant fade)
- [ ] T014 [US1] Update TuiLayout.astro container in src/components/layout/TuiLayout.astro (add section container wrapper for horizontal layout, section positioning)
- [ ] T015 [US1] Dispatch tui:section-change and tui:animation-state custom events in src/scripts/tui-navigation.ts (per contracts/README.md specification)
- [ ] T016 [US1] Update StatusLine component sync in src/components/layout/StatusLine.astro (listen to tui:section-change event, update displayed section info)

**Checkpoint**: At this point, User Story 1 should be fully functional - horizontal slide navigation works on desktop

---

## Phase 4: User Story 2 - Authentic Buffer Tab Styling (Priority: P1)

**Goal**: Buffer tabs match Neovim aesthetic from mockup with file icons, separators, active/inactive states, and close indicator

**Independent Test**: Visual inspection of tab bar matches mockup reference; active tab clearly distinguishable from inactive tabs

### Implementation for User Story 2

- [ ] T017 [P] [US2] Refactor BufferTab.astro component structure in src/components/ui/BufferTab.astro (add icon element, close button element, separator pseudo-element)
- [ ] T018 [P] [US2] Style BufferTab inactive state in src/components/ui/BufferTab.astro (muted colors, transparent background per research.md CSS)
- [ ] T019 [US2] Style BufferTab active state in src/components/ui/BufferTab.astro (primary color, surface-2 background, bottom border, visible close button)
- [ ] T020 [US2] Style BufferTab hover state in src/components/ui/BufferTab.astro (surface-1 background, text color change)
- [ ] T021 [US2] Add vertical separator styling in src/components/ui/BufferTab.astro (::after pseudo-element with pipe character, hide on last-child and active)
- [ ] T022 [US2] Update TopBar.astro tab container in src/components/layout/TopBar.astro (horizontal overflow scroll, hidden scrollbar, scroll-snap)
- [ ] T023 [US2] Add file icon display logic in src/components/ui/BufferTab.astro (use icon from section data, Nerd Font character with fallback)
- [ ] T024 [US2] Add close button interaction in src/components/ui/BufferTab.astro (decorative close button with hover state, no actual close functionality)
- [ ] T025 [US2] Update BufferTab active state sync in src/components/layout/TopBar.astro (listen to tui:section-change, toggle is-active class on tabs)

**Checkpoint**: At this point, User Story 2 should be fully functional - tabs match Neovim aesthetic from mockup

---

## Phase 5: User Story 3 - Per-Section Line Numbers (Priority: P2)

**Goal**: Each section displays its own line numbers starting from 1, simulating individual file buffers

**Independent Test**: Navigate to each section and verify line numbers start at 1 and reflect the section's content

### Implementation for User Story 3

- [ ] T026 [P] [US3] Update LineNumbers.astro component in src/components/ui/LineNumbers.astro (accept sectionId and lineCount props, always start from 1)
- [ ] T027 [P] [US3] Define default line counts per section in src/data/sections.ts (hero: 15, about: 40, experience: 60, projects: 50, expertise: 35, contact: 25)
- [ ] T028 [US3] Update HeroTui.astro to pass section-specific line numbers in src/components/sections/HeroTui.astro (lineCount from sections data)
- [ ] T029 [P] [US3] Update AboutReadme.astro to pass section-specific line numbers in src/components/sections/AboutReadme.astro (lineCount from sections data)
- [ ] T030 [P] [US3] Update ExperienceGitLog.astro to pass section-specific line numbers in src/components/sections/ExperienceGitLog.astro (lineCount from sections data)
- [ ] T031 [P] [US3] Update ProjectsTelescope.astro to pass section-specific line numbers in src/components/sections/ProjectsTelescope.astro (lineCount from sections data)
- [ ] T032 [P] [US3] Update ExpertiseCheckhealth.astro to pass section-specific line numbers in src/components/sections/ExpertiseCheckhealth.astro (lineCount from sections data)
- [ ] T033 [P] [US3] Update ContactTerminal.astro to pass section-specific line numbers in src/components/sections/ContactTerminal.astro (lineCount from sections data)
- [ ] T034 [US3] Verify line numbers reset on section change (visual verification during development)

**Checkpoint**: At this point, User Story 3 should be fully functional - each section shows its own line numbers starting at 1

---

## Phase 6: User Story 4 - Mobile Scroll Preservation (Priority: P2)

**Goal**: On mobile devices, users continue to experience smooth vertical scrolling between sections

**Independent Test**: Access portfolio on mobile device or emulator and verify smooth vertical scrolling remains functional

### Implementation for User Story 4

- [ ] T035 [US4] Implement mobile scroll behavior in src/scripts/tui-navigation.ts (detect viewport < 1024px, use Lenis scrollTo instead of slide animation)
- [ ] T036 [US4] Add CSS for mobile section layout in src/styles/tui/layout.css (vertical stacking, full viewport height sections)
- [ ] T037 [US4] Handle viewport resize during navigation in src/scripts/tui-navigation.ts (complete current animation, apply new behavior on next navigation)
- [ ] T038 [US4] Test mobile tab click behavior (verify vertical scroll to section, not horizontal slide)

**Checkpoint**: At this point, User Story 4 should be fully functional - mobile scroll behavior preserved

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance optimization, and integration verification

- [ ] T039 Run bun run lint to verify code quality
- [ ] T040 Run bun run build to verify production build succeeds
- [ ] T041 Test reduced motion preference in browser DevTools (Rendering > Emulate CSS media feature)
- [ ] T042 [P] Performance verification with Lighthouse (target: Performance >= 85 mobile, >= 95 desktop)
- [ ] T043 [P] Test 60fps animation on HIGH tier device using browser performance profiler
- [ ] T044 Validate quickstart.md test scenarios (manual testing checklist)
- [ ] T045 Cross-browser testing (Chrome, Firefox, Safari for desktop; mobile browsers)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion (navigation logic)
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion (tab styling CSS)
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion (can run parallel with US1/US2)
- **User Story 4 (Phase 6)**: Depends on User Story 1 (extends navigation logic with mobile behavior)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Can run in parallel with US1, US3
- **User Story 3 (P2)**: Can start after Foundational - Can run in parallel with US1, US2
- **User Story 4 (P2)**: Depends on User Story 1 - Extends the navigation system

### Within Each User Story

- CSS/types before component logic
- Core implementation before integrations
- Event dispatching before event listeners
- Story complete before moving to dependent stories

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T003, T004, T005 can run in parallel (different CSS concerns)
- After Foundational: US1, US2, US3 can start in parallel
- T017, T018 can run in parallel (different style states)
- T026, T027 can run in parallel (different files)
- T028, T029, T030, T031, T032, T033 can run in parallel (different section components)
- T042, T043 can run in parallel (different performance checks)

---

## Parallel Example: User Story 3 Section Updates

```bash
# Launch all section component updates together:
Task: "Update HeroTui.astro to pass section-specific line numbers"
Task: "Update AboutReadme.astro to pass section-specific line numbers"
Task: "Update ExperienceGitLog.astro to pass section-specific line numbers"
Task: "Update ProjectsTelescope.astro to pass section-specific line numbers"
Task: "Update ExpertiseCheckhealth.astro to pass section-specific line numbers"
Task: "Update ContactTerminal.astro to pass section-specific line numbers"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

Both P1 user stories form the MVP:

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Desktop Tab Navigation)
4. Complete Phase 4: User Story 2 (Buffer Tab Styling)
5. **STOP and VALIDATE**: Test horizontal slide + tab styling independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test horizontal slide -> Demo
3. Add User Story 2 -> Test tab styling -> Demo (MVP Complete!)
4. Add User Story 3 -> Test per-section line numbers -> Demo
5. Add User Story 4 -> Test mobile preservation -> Demo
6. Polish -> Full validation -> Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (navigation logic)
   - Developer B: User Story 2 (tab styling)
   - Developer C: User Story 3 (line numbers)
3. User Story 4 depends on US1 completion
4. Polish phase after all stories complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- User Stories 1 & 2 are both P1 - complete both for MVP
- No tests included (not requested in feature specification)
