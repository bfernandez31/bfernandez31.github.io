# Tasks: Hero Section Redesign

**Input**: Design documents from `/specs/PBF-30-hero-section/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/hero-styles.css

**Tests**: No tests requested in feature specification - tests are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Cleanup & Dependency Removal)

**Purpose**: Remove unused code and dependencies before implementing new hero section

- [ ] T001 Delete hero animation directory `src/scripts/hero/` (6 files: hero-controller.ts, background-3d.ts, cursor-tracker.ts, typography-reveal.ts, performance-monitor.ts, types.ts)
- [ ] T002 Remove OGL dependency from `package.json` using `bun remove ogl`
- [ ] T003 Run `bun install` to update lockfile and node_modules

---

## Phase 2: Foundational (Configuration Cleanup)

**Purpose**: Remove hero-specific configuration that blocks clean implementation

**⚠️ CRITICAL**: Must complete before hero component can be simplified

- [ ] T004 Remove HERO_* constants from `src/config/performance.ts` (HERO_SHAPE_COUNTS, HERO_DEGRADATION_THRESHOLDS, HERO_ANIMATION_TIMING, HERO_PARALLAX_CONFIG)
- [ ] T005 [P] Clean up or remove WebGL-related styles from `src/styles/effects/hero-effects.css` (canvas styling, fallback gradient, scroll indicator)

**Checkpoint**: Foundation ready - hero component redesign can now begin

---

## Phase 3: User Story 1 - First Impression (Priority: P1) 🎯 MVP

**Goal**: A visitor lands on the portfolio homepage and immediately sees who the developer is, what they do, and has a clear action to learn more.

**Independent Test**: Load the homepage and verify name (h1), role, and CTA are visible and readable within 2 seconds of page load.

### Implementation for User Story 1

- [ ] T006 [US1] Update Hero.astro Props interface in `src/components/sections/Hero.astro` (change `headline`→`name`, `subheadline`→`role`, add optional `tagline`)
- [ ] T007 [US1] Replace Hero.astro template structure in `src/components/sections/Hero.astro` (remove canvas, fallback div, scroll indicator; add semantic h1 for name, p for role)
- [ ] T008 [US1] Implement component-scoped CSS styles in `src/components/sections/Hero.astro` per `contracts/hero-styles.css` specification
- [ ] T009 [US1] Remove JavaScript animation imports and script block from `src/components/sections/Hero.astro`
- [ ] T010 [US1] Update Hero component usage in `src/pages/index.astro` (change props from `headline/subheadline` to `name="Benoit Fernandez" role="Full Stack Developer & Creative Technologist"`)
- [ ] T011 [US1] Add CSS fade-in animation to hero content in `src/components/sections/Hero.astro` using `@keyframes heroFadeIn`

**Checkpoint**: At this point, User Story 1 should be fully functional - name, role, and CTA visible on homepage load

---

## Phase 4: User Story 2 - Accessibility Experience (Priority: P2)

**Goal**: A visitor with reduced motion preference or using assistive technology experiences the hero section without barriers.

**Independent Test**: Enable `prefers-reduced-motion`, use screen reader, verify content is fully accessible and appears immediately.

### Implementation for User Story 2

- [ ] T012 [US2] Add `@media (prefers-reduced-motion: reduce)` rules to Hero.astro styles (disable animation, show content immediately)
- [ ] T013 [US2] Verify semantic HTML structure in `src/components/sections/Hero.astro` (h1 for name, role="banner", aria-label="Introduction")
- [ ] T014 [US2] Add focus-visible styles for CTA button in `src/components/sections/Hero.astro` (outline: 2px solid, outline-offset: 4px)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mobile Experience (Priority: P2)

**Goal**: A visitor on a mobile device sees a properly sized and readable hero section without layout issues.

**Independent Test**: Test on mobile viewport (320px-767px), verify text is readable and CTA is tappable.

### Implementation for User Story 3

- [ ] T015 [US3] Verify responsive typography in `src/components/sections/Hero.astro` uses clamp() (name: 3rem-8rem, role: 1.25rem-2rem)
- [ ] T016 [US3] Ensure CTA button has minimum 48px height in `src/components/sections/Hero.astro` for touch target accessibility
- [ ] T017 [US3] Add responsive padding using `100dvh` for dynamic viewport height on mobile in `src/components/sections/Hero.astro`

**Checkpoint**: All user stories should now be independently functional across all devices

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [ ] T018 Verify build succeeds with `bun run build`
- [ ] T019 Verify no JavaScript errors in browser console related to hero
- [ ] T020 Verify OGL is not in production bundle (check build output size)
- [ ] T021 Run Lighthouse audit, confirm Performance score ≥85 (mobile)
- [ ] T022 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS hero component work
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P2)
  - Or in parallel since they modify different concerns within the same file
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Builds on US1 implementation (same file, accessibility additions)
- **User Story 3 (P2)**: Builds on US1 implementation (same file, responsive additions)

### Within Each User Story

- Props interface before template structure
- Template structure before styles
- Styles before JavaScript removal
- Core implementation before verification

### Parallel Opportunities

- T001, T002 can run in parallel (different concerns: files vs package.json)
- T004, T005 can run in parallel (different files)
- US2 and US3 tasks could run in parallel if different developers (adding to same file in different areas)

---

## Parallel Example: Setup Phase

```bash
# Launch deletion and dependency removal in parallel:
Task: "Delete hero animation directory src/scripts/hero/"
Task: "Remove OGL dependency from package.json"
```

---

## Parallel Example: Foundational Phase

```bash
# Launch config and style cleanup in parallel:
Task: "Remove HERO_* constants from src/config/performance.ts"
Task: "Clean up WebGL-related styles from src/styles/effects/hero-effects.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (delete files, remove OGL)
2. Complete Phase 2: Foundational (clean config and styles)
3. Complete Phase 3: User Story 1 (hero component redesign)
4. **STOP and VALIDATE**: Test hero displays name, role, CTA correctly
5. Deploy/demo if ready - this is the MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test hero loads correctly → Deploy (MVP!)
3. Add User Story 2 → Test accessibility → Deploy
4. Add User Story 3 → Test mobile → Deploy
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All user stories modify the same Hero.astro file but in different sections
- This is primarily a ROLLBACK/SIMPLIFICATION feature - most work is deletion
- Total bundle reduction expected: ~30KB (OGL + hero modules)
- No new dependencies added - pure CSS solution
