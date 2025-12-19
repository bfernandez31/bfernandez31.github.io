# Tasks: Featured Project Layout and Image Fix

**Input**: Design documents from `/specs/PBF-27-featured-project-issue/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: No automated tests requested for this bug fix. Manual testing via quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Preparation and analysis before implementation

- [ ] T001 Review current layout structure in src/pages/index.astro to understand Projects section markup
- [ ] T002 [P] Review FeaturedProject component in src/components/sections/FeaturedProject.astro
- [ ] T003 [P] Review ProjectsHexGrid component in src/components/sections/ProjectsHexGrid.astro

**Checkpoint**: Codebase understanding complete - ready to implement fixes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational blocking tasks - this is a targeted CSS/HTML bug fix with no shared infrastructure changes

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - View Featured Project Section (Priority: P1) 🎯 MVP

**Goal**: Fix the visual hierarchy so section title appears before FeaturedProject card, and ensure the project image displays correctly (gradient fallback for broken images)

**Independent Test**: Navigate to `http://localhost:4321/#projects` and verify:
1. Section title "Projects" appears above the AI-BOARD featured project card
2. Image area shows gradient (violet to rose) instead of broken image icon

### Implementation for User Story 1

- [ ] T004 [US1] Add section title h2 element with class "projects-section__title" before FeaturedProject component in src/pages/index.astro
- [ ] T005 [US1] Add CSS styles for ".projects-section__title" in src/pages/index.astro (scoped styles)
- [ ] T006 [US1] Add CSS gradient fallback background to ".featured-project__image-wrapper" in src/components/sections/FeaturedProject.astro
- [ ] T007 [US1] Modify ProjectsHexGrid h2 title to h3 "More Projects" in src/components/sections/ProjectsHexGrid.astro
- [ ] T008 [US1] Update ".hex-grid__title" CSS to use h3 typography in src/components/sections/ProjectsHexGrid.astro

**Checkpoint**: User Story 1 complete - section title visible, image shows gradient fallback, heading hierarchy correct (h2 → h3)

---

## Phase 4: User Story 2 - Responsive Layout Consistency (Priority: P2)

**Goal**: Ensure layout ordering and visual hierarchy are consistent across mobile (≤767px), tablet (768-1023px), and desktop (≥1024px) breakpoints

**Independent Test**: Test Projects section at 320px, 768px, and 1440px viewport widths and verify:
1. Section title always appears first
2. Featured project card layout is appropriate for each breakpoint
3. No layout shifts or broken elements

### Implementation for User Story 2

- [ ] T009 [US2] Verify/adjust mobile styles for section title at ≤767px breakpoint in src/pages/index.astro
- [ ] T010 [US2] Verify/adjust tablet styles for section title at 768-1023px breakpoint in src/pages/index.astro
- [ ] T011 [US2] Verify gradient fallback displays correctly across all breakpoints in src/components/sections/FeaturedProject.astro
- [ ] T012 [US2] Test and verify ProjectsHexGrid h3 title alignment at all breakpoints in src/components/sections/ProjectsHexGrid.astro

**Checkpoint**: User Story 2 complete - responsive layout consistent across all breakpoints

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and accessibility checks

- [ ] T013 Run development server and perform manual testing per quickstart.md checklist
- [ ] T014 Test keyboard navigation and heading hierarchy with screen reader or browser outline
- [ ] T015 Verify prefers-reduced-motion support is maintained (no new animations added)
- [ ] T016 Run `bun run build` and verify production build succeeds with no errors
- [ ] T017 Run `bun run lint` and fix any Biome linting issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A for this bug fix
- **User Story 1 (Phase 3)**: Depends on Setup completion (understanding codebase)
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (responsive adjustments to new elements)
- **Polish (Phase 5)**: Depends on User Story 2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories
- **User Story 2 (P2)**: Builds on User Story 1 changes - verifies responsive behavior of new elements

### Within Each User Story

- T004 must complete before T005 (title element needed before styling)
- T006 is independent (different file)
- T007 must complete before T008 (element change before style adjustment)
- T004-T008 can largely run in sequence as they modify related concerns

### Parallel Opportunities

Within Setup phase:
- T002 and T003 can run in parallel (different files)

Within User Story 1:
- T006 can run in parallel with T004-T005 (different file: FeaturedProject.astro)
- T007-T008 can run in parallel with T004-T005 (different file: ProjectsHexGrid.astro)

Within User Story 2:
- T009-T010 can run in parallel with T011 and T012 (different files)

---

## Parallel Example: User Story 1

```bash
# Launch modifications to different files in parallel:
Task: "Add section title h2 element in src/pages/index.astro" (T004)
Task: "Add CSS gradient fallback in src/components/sections/FeaturedProject.astro" (T006)
Task: "Modify h2 to h3 in src/components/sections/ProjectsHexGrid.astro" (T007)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (review existing code)
2. Skip Phase 2: Foundational (N/A)
3. Complete Phase 3: User Story 1 (T004-T008)
4. **STOP and VALIDATE**: Test layout ordering and image fallback manually
5. Commit if ready

### Incremental Delivery

1. Setup → Understanding complete
2. User Story 1 → Test layout + image fix → Commit (MVP!)
3. User Story 2 → Test responsive consistency → Commit
4. Polish → Final validation → PR ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This is a CSS/HTML bug fix - no JavaScript changes required
- Verify changes at all 3 breakpoints (mobile ≤767px, tablet 768-1023px, desktop ≥1024px)
- Use CSS custom properties for colors: `var(--color-primary)`, `var(--color-secondary)`
- Commit after each user story is validated
