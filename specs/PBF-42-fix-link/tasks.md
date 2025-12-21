# Tasks: Fix Navigation Links

**Input**: Design documents from `/specs/PBF-42-fix-link/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

**Tests**: Not explicitly requested in feature specification. Manual verification steps are provided in quickstart.md.

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and reproduce the issue

- [ ] T001 Verify Bun and dependencies with `bun install`
- [ ] T002 Start dev server with `bun run dev` and confirm site loads at http://localhost:4321
- [ ] T003 Reproduce issue: Click "Explore Projects" CTA in hero section and confirm blank screen on desktop viewport (≥1024px)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: This is a minimal bug fix - no foundational infrastructure needed

**Note**: This feature modifies a single file (`src/scripts/tui-navigation.ts`) with ~15 lines of code. No new dependencies, models, or infrastructure required.

**Checkpoint**: Ready for user story implementation

---

## Phase 3: User Story 1 - Navigate via CTA Button (Priority: P1) 🎯 MVP

**Goal**: Enable clicking the "Explore Projects" button (and any CTA) to navigate correctly without blank screens

**Independent Test**: Click the "Explore Projects" button on the hero section and verify the projects section displays with visible content

### Implementation for User Story 1

- [ ] T004 [US1] Add `handleInternalLinkClick()` function before `setupClickHandlers()` in src/scripts/tui-navigation.ts
- [ ] T005 [US1] Add internal link handler registration to `setupClickHandlers()` in src/scripts/tui-navigation.ts
- [ ] T006 [US1] Verify CTA click navigates correctly: Click "Explore Projects" → Projects section visible

**Checkpoint**: At this point, User Story 1 should be fully functional - CTA buttons work correctly

---

## Phase 4: User Story 2 - Navigate Back from Projects (Priority: P2)

**Goal**: Enable navigation back from projects section without blank screens

**Independent Test**: Navigate to projects, then use any "back" link or navigation element to return, verifying content displays correctly

### Implementation for User Story 2

- [ ] T007 [US2] Verify back navigation works: Navigate to projects, click any internal link to return → No blank screen

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - forward and back navigation via links works

---

## Phase 5: User Story 3 - Consistent Navigation Behavior (Priority: P3)

**Goal**: Ensure all navigation methods (scroll, tabs, sidebar, buttons) behave consistently

**Independent Test**: Navigate to each section using each navigation method and compare behavior

### Implementation for User Story 3

- [ ] T008 [P] [US3] Verify sidebar navigation still works: Click sidebar entries → Correct section displays
- [ ] T009 [P] [US3] Verify buffer tab navigation still works: Click tabs in top bar → Correct section displays
- [ ] T010 [P] [US3] Verify keyboard navigation still works: Press j/k keys → Section changes correctly
- [ ] T011 [P] [US3] Verify scroll navigation still works: Scroll on desktop → Section changes correctly
- [ ] T012 [P] [US3] Verify mobile navigation works: Resize to mobile viewport → Scroll navigation works

**Checkpoint**: All navigation methods work consistently without regressions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and build verification

- [ ] T013 Run linting with `bun run lint` and fix any issues
- [ ] T014 Run build with `bun run build` and verify success
- [ ] T015 Preview production build with `bun run preview` and verify navigation works in production build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: N/A for this feature - no blocking infrastructure
- **User Story 1 (Phase 3)**: Can start after Setup verification
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (same code change)
- **User Story 3 (Phase 5)**: Depends on User Story 1 completion (regression testing)
- **Polish (Phase 6)**: Depends on all user stories being verified

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - core implementation
- **User Story 2 (P2)**: Implicitly satisfied by US1 implementation (same handler)
- **User Story 3 (P3)**: Verification only - no new implementation needed

### Within Each User Story

- T004 → T005 → T006 (sequential: handler function → registration → verification)
- T008-T012 can run in parallel (different navigation methods, no file dependencies)

### Parallel Opportunities

- Phase 5 verification tasks (T008-T012) can all run in parallel
- All are independent manual tests on different navigation features

---

## Parallel Example: User Story 3 Verification

```bash
# Launch all regression tests for User Story 3 in parallel:
Task: "Verify sidebar navigation still works"
Task: "Verify buffer tab navigation still works"
Task: "Verify keyboard navigation still works"
Task: "Verify scroll navigation still works"
Task: "Verify mobile navigation works"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup verification
2. Complete Phase 3: User Story 1 implementation (T004, T005, T006)
3. **STOP and VALIDATE**: Test CTA button independently
4. If working, MVP is complete

### Incremental Delivery

1. Setup → Verify issue reproduces
2. Add User Story 1 → CTA buttons work → Core fix complete (MVP!)
3. Verify User Story 2 → Back navigation works → Confidence increased
4. Verify User Story 3 → All navigation consistent → Full validation
5. Polish → Build and lint pass → Ready for merge

### Single Developer Strategy

This is a minimal bug fix (~15 lines) that can be completed in a single session:

1. T001-T003: Setup and reproduce (~5 min)
2. T004-T006: Implement and verify fix (~15 min)
3. T007-T012: Verify no regressions (~10 min)
4. T013-T015: Build validation (~5 min)

Total estimated time: ~35 minutes

---

## Notes

- [P] tasks = different verification methods, no dependencies
- [Story] label maps task to specific user story for traceability
- User Story 1 is the only implementation story - US2 and US3 are verification only
- The fix is a single code change that satisfies all three user stories
- All verification can be done manually in browser as described in quickstart.md
- Commit after T006 (implementation complete) and after T015 (full validation)
