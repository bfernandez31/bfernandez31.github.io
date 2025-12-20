# Tasks: Fix Explorer Visibility on Desktop

**Input**: Design documents from `/specs/PBF-33-fix-explorer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Visual testing only - no automated tests requested. Manual verification across breakpoints.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- CSS changes in `src/components/layout/TuiLayout.astro` (primary)
- Reference CSS in `src/styles/tui/layout.css` (no changes needed)

---

## Phase 1: Setup (Analysis)

**Purpose**: Understand current CSS state and confirm root cause

- [ ] T001 Read current TuiLayout.astro scoped styles in src/components/layout/TuiLayout.astro
- [ ] T002 [P] Read layout.css grid definition in src/styles/tui/layout.css to confirm correct structure
- [ ] T003 Start dev server with `bun run dev` for visual verification

---

## Phase 2: User Story 1 - Desktop Content Visibility (Priority: P1) 🎯 MVP

**Goal**: Display sidebar explorer and main content side-by-side on desktop viewports (≥1024px)

**Independent Test**: Open portfolio at http://localhost:4321 on desktop viewport (≥1024px), verify sidebar and content are both visible simultaneously

### Implementation for User Story 1

- [ ] T004 [US1] Remove `.tui-layout` grid properties (display, grid-template-rows) from scoped styles in src/components/layout/TuiLayout.astro - keep only height, overflow, background-color, color, font-family
- [ ] T005 [US1] Remove `.tui-main` flex container rule entirely from scoped styles in src/components/layout/TuiLayout.astro
- [ ] T006 [US1] Remove `.tui-content` flex properties from scoped styles in src/components/layout/TuiLayout.astro
- [ ] T007 [US1] Verify desktop layout at 1024px viewport - sidebar (250px) and content visible side-by-side
- [ ] T008 [US1] Verify desktop layout at 1440px viewport - proportions maintained
- [ ] T009 [US1] Verify desktop layout at 2560px viewport - wide screen behavior correct

**Checkpoint**: Desktop layout fixed - sidebar and content visible side-by-side without overlap

---

## Phase 3: User Story 2 - Tablet Sidebar Toggle (Priority: P2)

**Goal**: Ensure tablet (768-1023px) collapsible sidebar behavior works correctly after CSS fix

**Independent Test**: Open portfolio at tablet viewport (768-1023px), toggle sidebar, verify overlay behavior

### Verification for User Story 2

- [ ] T010 [US2] Verify sidebar toggle works at 768px viewport in src/components/layout/TuiLayout.astro
- [ ] T011 [US2] Verify sidebar collapses/expands correctly at 800px viewport
- [ ] T012 [US2] Verify clicking file in sidebar closes it and scrolls to section at 1000px viewport

**Checkpoint**: Tablet toggle behavior verified - no regression from desktop fix

---

## Phase 4: User Story 3 - Mobile Sidebar Overlay (Priority: P3)

**Goal**: Confirm mobile (<768px) sidebar overlay behavior remains unchanged after CSS fix

**Independent Test**: Open portfolio at mobile viewport (<768px), toggle sidebar, verify overlay from left

### Verification for User Story 3

- [ ] T013 [US3] Verify sidebar hidden by default at 320px viewport
- [ ] T014 [US3] Verify sidebar slides in as overlay when toggle clicked at 375px viewport
- [ ] T015 [US3] Verify tapping outside sidebar closes it at 425px viewport
- [ ] T016 [US3] Verify sidebar auto-closes after navigation at 767px viewport

**Checkpoint**: Mobile overlay behavior verified - no regression from desktop fix

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and build verification

- [ ] T017 Verify smooth transition at 1024px breakpoint boundary (resize across boundary)
- [ ] T018 Verify smooth transition at 768px breakpoint boundary (resize across boundary)
- [ ] T019 Run `bun run build` to verify no build errors
- [ ] T020 Run `bun run preview` and test all breakpoints against production build
- [ ] T021 Run `bun run lint` to verify no CSS/code quality issues
- [ ] T022 Verify no horizontal scrollbar appears at any viewport width
- [ ] T023 Verify TopBar, StatusLine, CommandLine span full width at all breakpoints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup - PRIMARY FIX
- **User Story 2 (Phase 3)**: Depends on User Story 1 - VERIFICATION ONLY
- **User Story 3 (Phase 4)**: Depends on User Story 1 - VERIFICATION ONLY (can run parallel with US2)
- **Polish (Phase 5)**: Depends on all user stories being verified

### User Story Dependencies

- **User Story 1 (P1)**: Core CSS fix - MUST complete first
- **User Story 2 (P2)**: Verification task only - can start after US1 complete
- **User Story 3 (P3)**: Verification task only - can start after US1 complete (parallel with US2)

### Within Each User Story

- CSS removal tasks T004-T006 can execute sequentially in single edit session
- Verification tasks (T007-T016) can run in parallel across different viewport sizes
- Build and lint (T019-T021) should run sequentially

### Parallel Opportunities

```bash
# After T006 completes, verification can run in parallel:
Task: T007 [US1] "Verify desktop layout at 1024px viewport"
Task: T008 [US1] "Verify desktop layout at 1440px viewport"
Task: T009 [US1] "Verify desktop layout at 2560px viewport"

# US2 and US3 can run in parallel after US1:
Task: T010-T012 [US2] "Tablet verification tasks"
Task: T013-T016 [US3] "Mobile verification tasks"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: User Story 1 (T004-T009)
3. **STOP and VALIDATE**: Verify desktop layout works
4. If desktop works → proceed to verification phases

### Incremental Delivery

1. Complete Setup → Understand current state
2. Complete US1 → Fix desktop layout → Test
3. Verify US2 → Tablet works → Confirm no regression
4. Verify US3 → Mobile works → Confirm no regression
5. Polish → Build, lint, cross-cutting validation

### Single Developer Strategy

This is a small CSS fix suitable for a single developer:

1. Read files (T001-T002)
2. Start dev server (T003)
3. Make CSS edits (T004-T006) - single editing session
4. Verify all viewports (T007-T016) - systematic browser testing
5. Build and validate (T017-T023)

Estimated time: ~15-30 minutes

---

## Notes

- This is a CSS-only fix with zero JavaScript changes
- All changes are in a single file: `src/components/layout/TuiLayout.astro`
- The correct grid layout already exists in `src/styles/tui/layout.css` - we're removing conflicts
- Keep scoped styles for: viewport sizing, colors, font, content sub-components, overlay, accessibility
- Remove scoped styles for: grid layout, flex containers that conflict with grid
- Test all 5 breakpoints: 320px, 768px, 1024px, 1440px, 2560px
- Commit after T006 (implementation) and again after T023 (verification complete)
