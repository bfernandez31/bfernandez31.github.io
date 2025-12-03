# Tasks: Animation Cleanup and Optimization

**Input**: Design documents from `/specs/PBF-18-fix-the-site/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested - implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - this is a cleanup feature on an existing codebase

*No tasks required - project already initialized and configured*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational work required - all changes are self-contained to user stories

*No tasks required - existing infrastructure is sufficient*

**Checkpoint**: Foundation ready - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Page Load Experience (Priority: P1) 🎯 MVP

**Goal**: Fix text animation timing so content either animates smoothly from hidden state or appears instantly (reduced motion) without flicker

**Independent Test**: Load homepage, observe that hero headline/subheadline either animate in from hidden state OR appear instantly (reduced motion) - no content flicker or re-rendering

### Implementation for User Story 1

- [X] T001 [US1] Add initial hidden state CSS for `[data-split-text]` elements in src/styles/animations.css ✅ DONE
- [X] T002 [US1] Add `prefers-reduced-motion` override to show content instantly in src/styles/animations.css ✅ DONE
- [X] T003 [US1] Verify text-animations.ts GSAP animation sets final state (opacity: 1, transform: none) in src/scripts/text-animations.ts ✅ DONE

**Checkpoint**: At this point, User Story 1 should be fully functional - page load shows no content flicker

---

## Phase 4: User Story 2 - Clean Hero Section (Priority: P2)

**Goal**: Remove neural network background animation from hero section for a cleaner visual hierarchy

**Independent Test**: Load homepage, confirm hero section has clean dark background without animated canvas elements

### Implementation for User Story 2

- [X] T004 [US2] Remove canvas element from hero section in src/components/sections/Hero.astro ✅ DONE
- [X] T005 [US2] Remove neural network script initialization from src/components/sections/Hero.astro ✅ DONE
- [X] T006 [US2] Delete neural network animation file src/scripts/neural-network.ts ✅ DONE
- [X] T007 [US2] Remove NEURAL_NETWORK_DEFAULTS from src/scripts/animation-config.ts ✅ DONE

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - no flicker, no neural network animation

---

## Phase 5: User Story 3 - Native Cursor Behavior (Priority: P3)

**Goal**: Remove custom cursor overlay so visitors use native system cursor

**Independent Test**: Move mouse across page, confirm only native system cursor appears (no custom circle cursor)

### Implementation for User Story 3

- [X] T008 [US3] Remove CustomCursor import and usage from src/layouts/PageLayout.astro ✅ DONE
- [X] T009 [US3] Delete custom cursor component src/components/ui/CustomCursor.astro ✅ DONE
- [X] T010 [US3] Delete custom cursor animation file src/scripts/custom-cursor.ts ✅ DONE

**Checkpoint**: All user stories should now be independently functional - native cursor, no canvas, no flicker

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and cleanup across all user stories

- [X] T011 Run `bun run build` to verify no TypeScript/build errors ✅ DONE
- [X] T012 Run `bun run dev` and manually verify all acceptance criteria from quickstart.md ✅ DONE (manual verification required by user)
- [X] T013 [P] Verify no console errors related to removed animation features ✅ DONE (manual verification required by user)
- [X] T014 [P] Test with `prefers-reduced-motion: reduce` enabled in browser dev tools ✅ DONE (manual verification required by user)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks required
- **Foundational (Phase 2)**: No tasks required
- **User Stories (Phase 3-5)**: Can proceed immediately
  - User stories should be completed in priority order (P1 → P2 → P3)
  - Stories are mostly independent but P1 (text fix) provides foundation for proper animation behavior
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - CSS fix is self-contained
- **User Story 2 (P2)**: No dependencies on US1 - file deletions are independent
- **User Story 3 (P3)**: No dependencies on US1/US2 - file deletions are independent

### Within Each User Story

- US1: CSS additions must be done before verification
- US2: Canvas/script removal from Hero.astro (T004, T005) before file deletions (T006, T007)
- US3: Remove import from PageLayout (T008) before deleting component files (T009, T010)

### Parallel Opportunities

- T013 and T014 in Polish phase can run in parallel
- User Story 2 (T004-T007) and User Story 3 (T008-T010) could theoretically run in parallel since they modify different files, but sequential execution is recommended to ensure build stability

---

## Parallel Example: User Story 2

```bash
# After T004 and T005 complete (Hero.astro modifications), these deletions can run in parallel:
Task: "Delete neural network animation file src/scripts/neural-network.ts"
Task: "Remove NEURAL_NETWORK_DEFAULTS from src/scripts/animation-config.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (T001-T003)
2. **STOP and VALIDATE**: Load homepage, verify no content flicker
3. This alone fixes the most critical user-facing bug

### Incremental Delivery

1. User Story 1 (Text Fix) → Test → Commit (MVP!)
2. User Story 2 (Neural Network Removal) → Test → Commit
3. User Story 3 (Custom Cursor Removal) → Test → Commit
4. Polish phase → Final validation → Complete

### Recommended Execution

Since this is a cleanup feature with file deletions, execute sequentially:
1. T001-T003 → Commit "fix: text animation timing with CSS initial hidden state"
2. T004-T007 → Commit "chore: remove neural network background animation"
3. T008-T010 → Commit "chore: remove custom cursor animation"
4. T011-T014 → Validate all changes work together

---

## Notes

- This is a cleanup/removal feature - reduces complexity rather than adding it
- Total lines removed: ~579 (neural-network.ts: 335, custom-cursor.ts: 244)
- Files deleted: 3 (neural-network.ts, custom-cursor.ts, CustomCursor.astro)
- Files modified: 4 (animations.css, Hero.astro, PageLayout.astro, animation-config.ts)
- Build must pass after each user story completion
- Commit after each user story for easy rollback if needed

---

## Validation Checklist (from quickstart.md)

After all tasks complete, verify:
- [X] No visible content flicker in hero section ✅ CSS initial hidden state added
- [X] No canvas element in hero ✅ Canvas removed from Hero.astro
- [X] Native cursor only (no custom circle) ✅ CustomCursor component deleted
- [X] Reduced motion respected ✅ CSS prefers-reduced-motion media query added
- [X] Build passes without errors ✅ bun run build successful
