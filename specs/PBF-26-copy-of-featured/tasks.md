# Tasks: Fix Featured Project Preview Layout

**Input**: Design documents from `/specs/PBF-26-copy-of-featured/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested - visual regression testing only (manual verification)

**Organization**: Tasks organized by user story for independent verification at each breakpoint.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required - this is a CSS-only fix to an existing component

- [ ] T001 Verify dev environment works by running `bun run dev`

**Checkpoint**: Development server running at http://localhost:4321

---

## Phase 2: User Story 1 - View Featured Project on Desktop (Priority: P1) 🎯 MVP

**Goal**: Verify desktop layout is unaffected by upcoming mobile CSS changes

**Independent Test**: Load homepage on 1024px+ viewport, confirm Featured Project displays with side-by-side 60/40 layout, image visible, proper hierarchy

### Implementation for User Story 1

- [ ] T002 [US1] Document current desktop layout state before changes in src/components/sections/FeaturedProject.astro

**Checkpoint**: Desktop baseline documented - ready to make changes

---

## Phase 3: User Story 2 - View Featured Project on Mobile (Priority: P1) 🎯 MVP

**Goal**: Fix mobile layout so content appears before image

**Independent Test**: Load homepage on <768px viewport, verify:
1. "Featured Project" label appears first
2. Project title "AI-BOARD" appears before image
3. Image appears after all text content
4. CTA button spans full width

### Implementation for User Story 2

- [ ] T003 [US2] Add CSS `order` property for `.featured-project__label` (order: 1) in mobile media query in src/components/sections/FeaturedProject.astro
- [ ] T004 [US2] Add CSS `order` property for `.featured-project__content` (order: 2) in mobile media query in src/components/sections/FeaturedProject.astro
- [ ] T005 [US2] Add CSS `order` property for `.featured-project__image-wrapper` (order: 3) in mobile media query in src/components/sections/FeaturedProject.astro
- [ ] T006 [US2] Verify mobile layout fix using DevTools responsive mode (<768px viewport)

**Checkpoint**: Mobile layout fixed - content appears before image

---

## Phase 4: User Story 3 - View Featured Project on Tablet (Priority: P2)

**Goal**: Verify tablet layout is unaffected by mobile CSS changes

**Independent Test**: Load homepage on 768-1023px viewport, confirm side-by-side 50/50 layout maintained

### Implementation for User Story 3

- [ ] T007 [US3] Verify tablet layout (768-1023px) is unchanged after mobile fix in src/components/sections/FeaturedProject.astro

**Checkpoint**: Tablet layout verified - no regression

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all viewports and build validation

- [ ] T008 Verify desktop layout (1024px+) still displays correctly
- [ ] T009 Run build verification with `bun run build`
- [ ] T010 Run linting check with `bun run lint`
- [ ] T011 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify dev environment
- **User Story 1 (Phase 2)**: Depends on Setup - document baseline
- **User Story 2 (Phase 3)**: Depends on Setup - implement CSS fix
- **User Story 3 (Phase 4)**: Depends on User Story 2 - verify no regression
- **Polish (Phase 5)**: Depends on all user stories - final validation

### User Story Dependencies

- **User Story 1 (P1)**: Independent - baseline documentation only
- **User Story 2 (P1)**: Independent - CSS-only change, single file
- **User Story 3 (P2)**: Depends on US2 completion to verify no regression

### Within User Story 2 (Main Implementation)

- T003, T004, T005 can be combined into a single CSS edit
- T006 is verification after CSS changes

### Parallel Opportunities

- T002, T003-T005 conceptually could run in parallel (different scopes)
- However, all tasks modify or verify the same file, so sequential execution is safer
- T008, T009, T010 can run in parallel (different verification scopes)

---

## Parallel Example: Polish Phase

```bash
# Launch verification tasks together:
Task: "Verify desktop layout (1024px+) still displays correctly"
Task: "Run build verification with bun run build"
Task: "Run linting check with bun run lint"
```

---

## Implementation Strategy

### MVP First (User Story 2 - Mobile Fix)

1. Complete Phase 1: Setup (verify dev environment)
2. Complete Phase 2: Document desktop baseline
3. Complete Phase 3: Implement CSS fix for mobile
4. **STOP and VALIDATE**: Test mobile layout independently
5. Verify no regression on tablet/desktop

### Incremental Delivery

This is a single CSS change, so delivery is atomic:
1. Make CSS change → Test mobile → Verify tablet → Verify desktop → Build → Done

### Estimated Scope

- **Total tasks**: 11
- **User Story 1**: 1 task (baseline documentation)
- **User Story 2**: 4 tasks (CSS implementation + verification)
- **User Story 3**: 1 task (regression verification)
- **Polish**: 4 tasks (cross-viewport validation + build)

### File Changes Summary

| File | Change Type |
|------|-------------|
| `src/components/sections/FeaturedProject.astro` | CSS addition (3 `order` properties in mobile media query) |

---

## Notes

- This is a CSS-only fix - no JavaScript changes
- All changes are in the `<style>` block of a single Astro component
- HTML structure remains unchanged (SEO preserved)
- Accessibility maintained (DOM order for screen readers unchanged)
- Changes scoped to mobile media query only (≤767px)
- Tablet (768-1023px) and Desktop (1024px+) layouts unaffected
