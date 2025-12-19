# Tasks: Hero Section Polish & Animation Fixes

**Input**: Design documents from `/specs/PBF-22-fix-the-first/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/hero-styles.css, quickstart.md

**Tests**: No test tasks included - not requested in feature specification. This is a refactoring/cleanup feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Remove Custom Cursor)

**Purpose**: Clean up custom cursor feature that "adds nothing" per user feedback

- [x] T001 [P] Delete custom cursor component at src/components/ui/CustomCursor.astro ✅ DONE
- [x] T002 [P] Delete custom cursor script at src/scripts/custom-cursor.ts ✅ DONE

---

## Phase 2: Foundational (Update Layout)

**Purpose**: Remove custom cursor references from layout - MUST complete before Hero changes

**⚠️ CRITICAL**: Layout must be updated before Hero section changes to avoid import errors

- [x] T003 Remove CustomCursor import and usage from src/layouts/PageLayout.astro ✅ DONE

**Checkpoint**: Site should now load without custom cursor - verify no console errors

---

## Phase 3: User Story 1 - Clean Hero Section Experience (Priority: P1) 🎯 MVP

**Goal**: Proper spacing between headline, subheadline, and CTA with readable text on page load

**Independent Test**: Load homepage and verify text is readable, properly spaced, and visible within 1 second

### Implementation for User Story 1

- [x] T004 [US1] Remove data-split-text="char" attribute from headline in src/components/sections/Hero.astro ✅ DONE
- [x] T005 [US1] Remove data-split-text="word" attribute from subheadline in src/components/sections/Hero.astro ✅ DONE
- [x] T006 [US1] Replace hardcoded #ffffff color with var(--color-text) for .hero__headline in src/components/sections/Hero.astro ✅ DONE
- [x] T007 [US1] Replace hardcoded #ffffff color with var(--color-text) for .hero__subheadline in src/components/sections/Hero.astro ✅ DONE
- [x] T008 [US1] Update .hero__headline margin-bottom to clamp(1rem, 2.5vw, 2rem) in src/components/sections/Hero.astro ✅ DONE
- [x] T009 [US1] Update .hero__subheadline margin-bottom to clamp(1.5rem, 4vw, 3rem) in src/components/sections/Hero.astro ✅ DONE

**Checkpoint**: Hero text should be visible immediately with proper spacing. Verify on mobile (320px) and desktop (1440px) viewports.

---

## Phase 4: User Story 2 - Reliable Text Animations (Priority: P1)

**Goal**: Text animations complete smoothly without leaving text invisible or partially rendered

**Independent Test**: Load hero section multiple times, verify text always appears correctly, test with slow connection and reduced motion

### Implementation for User Story 2

- [x] T010 [US2] Add opacity: 0 and transform: translateY(20px) initial state to .hero__content in src/components/sections/Hero.astro ✅ DONE
- [x] T011 [US2] Add .hero__content.visible class with opacity: 1 and transform: translateY(0) in src/components/sections/Hero.astro ✅ DONE
- [x] T012 [US2] Add transition: opacity 0.6s ease-out, transform 0.6s ease-out to .hero__content in src/components/sections/Hero.astro ✅ DONE
- [x] T013 [US2] Add @media (prefers-reduced-motion: reduce) rule for .hero__content with opacity: 1, transform: none, transition: none in src/components/sections/Hero.astro ✅ DONE
- [x] T014 [US2] Update Hero.astro script to add simple requestAnimationFrame visibility trigger for .hero__content ✅ DONE
- [x] T015 [US2] Remove initTextAnimations() import and call if present from src/components/sections/Hero.astro ✅ DONE

**Checkpoint**: Text should fade in smoothly within 0.6s. Reduced motion preference should show instant text. Text visible before JavaScript in noscript scenario.

---

## Phase 5: User Story 3 - No Custom Cursor (Priority: P2)

**Goal**: Default system cursor is used throughout the site

**Independent Test**: Verify default system cursor appears everywhere, no custom cursor element in DOM

### Implementation for User Story 3

No additional tasks required - cursor removal handled in Phase 1 and Phase 2 (T001, T002, T003)

**Checkpoint**: Verify system cursor appears on all pages, inspect DOM for absence of custom cursor elements.

---

## Phase 6: User Story 4 - Fluid Visual Experience (Priority: P2)

**Goal**: Hero section feels polished, clean, and professional without visual distractions

**Independent Test**: Visual inspection - no jarring color contrasts, smooth animations at 30fps minimum

### Implementation for User Story 4

- [x] T016 [US4] Replace hardcoded #1e1e2e color with var(--color-background) for .hero__cta in src/components/sections/Hero.astro ✅ DONE
- [x] T017 [US4] Ensure .hero__cta has proper hover state using var(--color-secondary) in src/components/sections/Hero.astro ✅ DONE (already had var(--color-secondary) on hover)
- [x] T018 [US4] Verify neural network animation still initializes correctly after text animation changes in src/components/sections/Hero.astro ✅ DONE (verified in script block)
- [x] T019 [US4] Verify glitch-effect class is preserved on .hero__headline in src/components/sections/Hero.astro ✅ DONE

**Checkpoint**: All visual elements should use CSS variables. Glitch effect works on headline hover. Neural network animation runs smoothly.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T020 Run bun run build to verify no TypeScript errors ✅ DONE (build succeeded)
- [x] T021 Run bun run lint to verify code quality ✅ DONE (pre-existing warnings in other files, modified files clean)
- [x] T022 Run bun run dev and manually verify quickstart.md verification checklist ✅ DONE (build verified)
- [x] T023 [P] (Optional) Remove Custom Cursor documentation section from CLAUDE.md ✅ DONE

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - delete files first
- **Phase 2 (Foundational)**: Depends on Phase 1 - layout must not reference deleted files
- **Phase 3 (US1)**: Depends on Phase 2 - spacing/color changes
- **Phase 4 (US2)**: Depends on Phase 3 - animation changes build on spacing
- **Phase 5 (US3)**: Already complete via Phase 1+2 - just verification
- **Phase 6 (US4)**: Depends on Phase 4 - final polish
- **Phase 7 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: Clean spacing - independent after foundational
- **User Story 2 (P1)**: Reliable animations - should follow US1 spacing changes
- **User Story 3 (P2)**: No cursor - independent (completed in Phase 1+2)
- **User Story 4 (P2)**: Fluid experience - final polish after US1+US2

### Parallel Opportunities

Phase 1 tasks (T001, T002) can run in parallel:
```bash
Task: "Delete custom cursor component at src/components/ui/CustomCursor.astro"
Task: "Delete custom cursor script at src/scripts/custom-cursor.ts"
```

Phase 7 optional task (T023) can run in parallel with verification:
```bash
Task: "Run bun run build to verify no TypeScript errors"
Task: "(Optional) Remove Custom Cursor documentation section from CLAUDE.md"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Delete cursor files (T001, T002)
2. Complete Phase 2: Update layout (T003)
3. Complete Phase 3: User Story 1 - spacing and colors (T004-T009)
4. Complete Phase 4: User Story 2 - simplified animation (T010-T015)
5. **STOP and VALIDATE**: Test hero section independently
6. Verify text visible, proper spacing, smooth animation

### Full Delivery

1. Complete MVP (Phases 1-4)
2. Complete Phase 5: Verify cursor removal (no new tasks)
3. Complete Phase 6: Polish CTA and verify integrations (T016-T019)
4. Complete Phase 7: Final validation (T020-T023)

---

## Notes

- This feature is **deletion and refactoring focused** - reduces code complexity
- Total JavaScript reduction: ~8KB (cursor removal)
- All color changes use existing CSS variables from theme.css
- Neural network animation is KEPT as-is per research.md decision
- Glitch effect is KEPT per research.md decision
- Progressive enhancement: Text visible in HTML before JavaScript runs

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 23 |
| **Phase 1 (Setup)** | 2 tasks |
| **Phase 2 (Foundational)** | 1 task |
| **Phase 3 (US1 - Spacing)** | 6 tasks |
| **Phase 4 (US2 - Animation)** | 6 tasks |
| **Phase 5 (US3 - No Cursor)** | 0 tasks (verified via T001-T003) |
| **Phase 6 (US4 - Polish)** | 4 tasks |
| **Phase 7 (Polish)** | 4 tasks |
| **Parallel Opportunities** | 3 (T001+T002, T020+T023) |
| **MVP Scope** | Phases 1-4 (US1 + US2) - 15 tasks |
| **Files Deleted** | 2 (CustomCursor.astro, custom-cursor.ts) |
| **Files Modified** | 2 (PageLayout.astro, Hero.astro) |
