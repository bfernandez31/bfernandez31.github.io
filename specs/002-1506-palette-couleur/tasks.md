# Tasks: Site-Wide Color Palette

**Feature**: Site-Wide Color Palette (002-1506-palette-couleur)
**Input**: Design documents from `/specs/002-1506-palette-couleur/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: NOT requested in feature specification - No test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create color palette CSS infrastructure

- [ ] T001 Create theme.css file in src/styles/ directory with Catppuccin Mocha color token definitions
- [ ] T002 Copy contract definitions from specs/002-1506-palette-couleur/contracts/theme-tokens.css to src/styles/theme.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core color system that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Import theme.css in src/styles/global.css using @import statement at the top of the file
- [ ] T004 Ensure src/styles/global.css is imported in src/layouts/Layout.astro to make color tokens available site-wide
- [ ] T005 Verify color token CSS custom properties are available in browser DevTools on development server

**Checkpoint**: Color palette foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Consistency Across Pages (Priority: P1) 🎯 MVP

**Goal**: Establish consistent Catppuccin Mocha-based colors across all pages (background, text, accent colors)

**Independent Test**: Navigate between different pages (home, about, projects) and verify that background is consistently #1e1e2e, text is #cdd6f4, and primary violet accents use #cba6f7 without arbitrary colors

### Implementation for User Story 1

- [ ] T006 [US1] Update src/styles/global.css to use --color-background for body background-color
- [ ] T007 [US1] Update src/styles/global.css to use --color-text for body color (text color)
- [ ] T008 [P] [US1] Audit all existing components in src/components/ and replace hard-coded background colors with var(--color-background) or var(--color-surface)
- [ ] T009 [P] [US1] Audit all existing components in src/components/ and replace hard-coded text colors with var(--color-text), var(--color-text-secondary), or var(--color-text-muted)
- [ ] T010 [P] [US1] Audit all existing pages in src/pages/ and replace hard-coded colors with appropriate CSS custom properties
- [ ] T011 [US1] Verify in browser DevTools that no hard-coded hex colors remain in active stylesheets (search for # in Styles panel)
- [ ] T012 [US1] Test visual consistency by navigating between all pages and confirming uniform color application

**Checkpoint**: At this point, all pages should have consistent Catppuccin Mocha base colors

---

## Phase 4: User Story 2 - Accessible Interactive Elements (Priority: P1) 🎯 MVP

**Goal**: Ensure all interactive elements (buttons, links, forms) meet WCAG 2.1 AA contrast ratios

**Independent Test**: Use Chrome DevTools contrast checker to verify all text/background and interactive element combinations meet WCAG 2.1 AA standards (4.5:1 for text, 3:1 for UI components)

### Implementation for User Story 2

- [ ] T013 [P] [US2] Update all button components in src/components/ to use --color-primary for primary buttons and --color-secondary for secondary buttons
- [ ] T014 [P] [US2] Update all link styles (in global.css or components) to use --color-primary for link color
- [ ] T015 [P] [US2] Update form input styles to use --color-surface for backgrounds, --color-text for text, and --color-border for borders
- [ ] T016 [US2] Manually test contrast ratios using browser DevTools for all interactive elements against backgrounds
- [ ] T017 [US2] Document any custom color combinations in code comments with verified contrast ratios
- [ ] T018 [US2] Run Lighthouse accessibility audit in browser DevTools and verify no color contrast failures

**Checkpoint**: All interactive elements should meet WCAG 2.1 AA contrast requirements

---

## Phase 5: User Story 3 - Recognizable Hover and Focus States (Priority: P2)

**Goal**: Implement clear visual feedback for hover and focus states on interactive elements using defined palette state colors

**Independent Test**: Hover over and tab through interactive elements to verify distinct visual state changes occur using defined palette colors (hover: -6% lightness, focus: lavender outline)

### Implementation for User Story 3

- [ ] T019 [P] [US3] Add hover state styles to all button components using --color-primary-hover and --color-secondary-hover
- [ ] T020 [P] [US3] Add focus state styles to all button components using --color-primary-focus or --color-secondary-focus with 2px outline
- [ ] T021 [P] [US3] Add active state styles to all button components using --color-primary-active and --color-secondary-active
- [ ] T022 [P] [US3] Add disabled state styles to all button components using --color-primary-disabled and --color-secondary-disabled
- [ ] T023 [P] [US3] Add hover and focus state styles to all link elements in global.css or component styles
- [ ] T024 [P] [US3] Add focus state styles to all form inputs using --color-primary-focus for border-color and box-shadow
- [ ] T025 [US3] Add transition property using var(--transition-color) to all interactive elements for smooth color changes
- [ ] T026 [US3] Test keyboard navigation by tabbing through all interactive elements and verifying visible focus indicators
- [ ] T027 [US3] Test mouse hover on all interactive elements and verify smooth color transitions

**Checkpoint**: All interactive elements should have distinct, accessible hover and focus states

---

## Phase 6: User Story 4 - Harmonious Violet/Rose Aesthetic (Priority: P2)

**Goal**: Ensure violet (Mauve) and rose (Pink) accent colors are prominently featured and create cohesive visual harmony

**Independent Test**: Review the site's overall visual appearance and confirm violet/rose tones are prominently featured in accents, gradients, or highlights without clashing

### Implementation for User Story 4

- [ ] T028 [P] [US4] Apply --color-primary (violet) to hero section headings or prominent call-to-action elements
- [ ] T029 [P] [US4] Apply --color-secondary (rose) to secondary accent elements like tags, badges, or decorative borders
- [ ] T030 [P] [US4] Apply --color-accent (lavender) to tertiary accent elements for visual variety
- [ ] T031 [US4] Review all pages and ensure violet/rose/lavender accents are balanced and harmonious
- [ ] T032 [US4] Test on multiple devices/screens to verify violet/rose palette maintains intended warmth and vibrancy

**Checkpoint**: Violet/rose aesthetic should be distinctive and visually appealing across the site

---

## Phase 7: User Story 5 - Reduced Motion Respect (Priority: P3)

**Goal**: Ensure all color transitions respect prefers-reduced-motion system preference

**Independent Test**: Enable prefers-reduced-motion system setting and verify that color changes happen instantly without gradual transitions

### Implementation for User Story 5

- [ ] T033 [US5] Verify all color transitions use var(--transition-color) instead of hard-coded transition durations
- [ ] T034 [US5] Test on macOS by enabling System Preferences → Accessibility → Display → Reduce motion
- [ ] T035 [US5] Test on Windows by enabling Settings → Ease of Access → Display → Show animations (turn off)
- [ ] T036 [US5] Verify that with reduced motion enabled, all color transitions are instant (0.01s) instead of 0.2s
- [ ] T037 [US5] Document prefers-reduced-motion implementation in code comments for future developers

**Checkpoint**: Color transitions should respect user motion preferences across all devices

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T038 [P] Create developer documentation in project root or docs/ explaining how to use color tokens (reference quickstart.md)
- [ ] T039 [P] Configure Biome linting to warn about hard-coded hex colors in component files (add noHexColors rule if available)
- [ ] T040 [P] Add code comments to theme.css documenting usage examples for common patterns
- [ ] T041 Perform final visual audit across all pages to ensure color palette is consistently applied
- [ ] T042 Run full Lighthouse audit and verify 100% accessibility score for color contrast
- [ ] T043 Execute quickstart.md validation steps to ensure implementation matches documented guidelines
- [ ] T044 Update CLAUDE.md with color palette technology stack and usage guidelines

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational (Phase 2) completion
  - US1 (P1) and US2 (P1) are MVP - complete these first
  - US3 (P2) and US4 (P2) depend on US1/US2 foundation
  - US5 (P3) depends on US3 (interaction states)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1)
- **User Story 3 (P2)**: Depends on US1/US2 (needs base colors applied first) - Adds interaction states
- **User Story 4 (P2)**: Depends on US1 (needs base structure) - Can run parallel with US3
- **User Story 5 (P3)**: Depends on US3 (needs transitions to exist) - Final polish

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Sequential tasks must complete in order (e.g., apply colors before testing)
- Verification/testing tasks must come after implementation tasks

### Parallel Opportunities

**Phase 1 (Setup)**: T001 and T002 can run sequentially (copy operation)

**Phase 2 (Foundational)**: T003, T004 must be sequential, T005 is verification

**Phase 3 (US1)**:
- T008, T009, T010 can run in parallel (different files)
- T011, T012 are verification (must be sequential after implementation)

**Phase 4 (US2)**:
- T013, T014, T015 can run in parallel (different components)
- T016, T017, T018 are verification (sequential)

**Phase 5 (US3)**:
- T019, T020, T021, T022, T023, T024 can ALL run in parallel (different state types/components)
- T025 must come after state styles
- T026, T027 are verification

**Phase 6 (US4)**:
- T028, T029, T030 can run in parallel (different elements)
- T031, T032 are verification

**Phase 7 (US5)**: Mostly sequential verification tasks

**Phase 8 (Polish)**:
- T038, T039, T040 can run in parallel (different concerns)
- T041, T042, T043, T044 should be sequential

---

## Parallel Example: User Story 3 (Interaction States)

```bash
# Launch all state style tasks in parallel:
Task: "Add hover state styles to all button components using --color-primary-hover and --color-secondary-hover"
Task: "Add focus state styles to all button components using --color-primary-focus or --color-secondary-focus with 2px outline"
Task: "Add active state styles to all button components using --color-primary-active and --color-secondary-active"
Task: "Add disabled state styles to all button components using --color-primary-disabled and --color-secondary-disabled"
Task: "Add hover and focus state styles to all link elements in global.css or component styles"
Task: "Add focus state styles to all form inputs using --color-primary-focus for border-color and box-shadow"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup → Create theme.css with color tokens
2. Complete Phase 2: Foundational → Import and verify color tokens site-wide
3. Complete Phase 3: User Story 1 → Apply consistent base colors across all pages
4. Complete Phase 4: User Story 2 → Ensure WCAG AA contrast compliance
5. **STOP and VALIDATE**: Test color consistency and accessibility independently
6. Deploy/demo MVP with consistent, accessible colors

### Incremental Delivery

1. **Foundation** (Phase 1-2): Color token system ready
2. **MVP** (Phase 3-4): Consistent colors + Accessibility → Deploy/Demo
3. **Enhanced** (Phase 5-6): Interaction states + Aesthetic polish → Deploy/Demo
4. **Complete** (Phase 7-8): Motion preferences + Final polish → Deploy/Demo
5. Each phase adds value without breaking previous functionality

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (sequential, small tasks)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Visual Consistency)
   - **Developer B**: User Story 2 (Accessibility)
3. After US1/US2:
   - **Developer A**: User Story 3 (Interaction States)
   - **Developer B**: User Story 4 (Violet/Rose Aesthetic)
4. After US3:
   - **Developer A**: User Story 5 (Reduced Motion)
5. All developers: Polish phase together

---

## Notes

- [P] tasks = different files/components, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable
- Use browser DevTools for contrast checking (built-in WCAG validator)
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- No test files are created (tests not requested in specification)
- All color transitions must use var(--transition-color) to respect motion preferences
- Total estimated tasks: 44 tasks across 8 phases
