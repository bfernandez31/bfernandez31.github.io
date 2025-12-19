# Tasks: Featured Project Section for AI-BOARD

**Input**: Design documents from `/specs/PBF-24-featured-project/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested in specification - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing infrastructure and content are in place

- [X] T001 Verify AI-BOARD content entry exists at src/content/projects/ai-board.md with `featured: true`
- [X] T002 [P] Verify project image exists at public/images/projects/ai-board.webp
- [X] T003 [P] Verify theme CSS variables are available (--color-primary, --color-surface, etc.) in src/styles/theme.css

**Checkpoint**: Data source and dependencies verified - component creation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: This feature has no foundational tasks - uses existing Content Collections infrastructure

**⚠️ No blocking prerequisites** - proceeds directly to user story implementation

---

## Phase 3: User Story 1 - Portfolio Visitor Discovers AI-BOARD (Priority: P1) 🎯 MVP

**Goal**: Visitor sees AI-BOARD prominently showcased at top of Projects section with larger visual footprint

**Independent Test**: Navigate to `/#projects` and verify AI-BOARD displays prominently above hex grid with title, description, image, and CTA link

### Implementation for User Story 1

- [X] T004 [US1] Create FeaturedProject.astro component shell at src/components/sections/FeaturedProject.astro
- [X] T005 [US1] Implement content fetching using `getEntry('projects', 'ai-board')` in FeaturedProject.astro
- [X] T006 [US1] Add article wrapper with aria-labelledby for accessibility in FeaturedProject.astro
- [X] T007 [US1] Implement image section with lazy loading and 16:9 aspect-ratio placeholder in FeaturedProject.astro
- [X] T008 [US1] Implement content section with title (h3), description in FeaturedProject.astro
- [X] T009 [US1] Add technology tags list with aria-label in FeaturedProject.astro
- [X] T010 [US1] Implement CTA link with target="_blank" rel="noopener noreferrer" in FeaturedProject.astro
- [X] T011 [US1] Add desktop flexbox layout styles (60% image / 40% content) in FeaturedProject.astro
- [X] T012 [US1] Add component import and render in src/pages/index.astro before ProjectsHexGrid

**Checkpoint**: AI-BOARD visible at top of Projects section with hero-style presentation on desktop

---

## Phase 4: User Story 2 - Visitor Understands AI-BOARD's Significance (Priority: P2)

**Goal**: Visitor sees meta-narrative explaining portfolio was built using AI-BOARD

**Independent Test**: Read featured section content and verify meta-narrative text is visible and styled distinctively

### Implementation for User Story 2

- [X] T013 [US2] Add "Featured Project" label element with uppercase styling in FeaturedProject.astro
- [X] T014 [US2] Add meta-narrative paragraph "✨ This portfolio was built using AI-BOARD..." in FeaturedProject.astro
- [X] T015 [US2] Style meta-narrative with --color-secondary and italic text in FeaturedProject.astro
- [X] T016 [US2] Style technology tags with --color-primary subtle background in FeaturedProject.astro

**Checkpoint**: Meta-narrative clearly visible and creates compelling story about AI-BOARD's significance

---

## Phase 5: User Story 3 - Mobile Visitor Views Featured Project (Priority: P2)

**Goal**: Featured section displays correctly on mobile with stacked layout and readable text

**Independent Test**: View `/#projects` on mobile viewport (≤767px) and verify stacked layout with readable content

### Implementation for User Story 3

- [X] T017 [US3] Add mobile media query (max-width: 767px) with flex-direction: column in FeaturedProject.astro
- [X] T018 [US3] Ensure image takes full width on mobile in FeaturedProject.astro
- [X] T019 [US3] Verify CTA button remains tappable (44px minimum touch target) in FeaturedProject.astro
- [X] T020 [US3] Test tablet layout (768px-1023px) with 50/50 split in FeaturedProject.astro

**Checkpoint**: Featured section works correctly on all viewport sizes (320px to 2560px)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Animation, accessibility, and edge case handling

- [X] T021 [P] Add CSS fade-in animation (opacity 0→1, translateY 20px→0) in FeaturedProject.astro
- [X] T022 [P] Add prefers-reduced-motion media query disabling animations in FeaturedProject.astro
- [X] T023 [P] Add JavaScript to trigger .visible class on page load in FeaturedProject.astro
- [X] T024 [P] Add focus-visible styles for CTA link keyboard navigation in FeaturedProject.astro
- [X] T025 [P] Add conditional render to handle missing AI-BOARD content gracefully in FeaturedProject.astro
- [X] T026 Run `bun run build` to verify no TypeScript errors
- [X] T027 Run `bun run lint` to verify code style compliance
- [X] T028 Manual verification of quickstart.md testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verify existing assets
- **Foundational (Phase 2)**: N/A - no blocking prerequisites for this feature
- **User Story 1 (Phase 3)**: Depends on Setup verification
- **User Story 2 (Phase 4)**: Can start after T004 (component shell exists)
- **User Story 3 (Phase 5)**: Can start after T011 (desktop layout exists)
- **Polish (Phase 6)**: Depends on all user story phases complete

### User Story Dependencies

- **User Story 1 (P1)**: Core component creation - MVP deliverable
- **User Story 2 (P2)**: Adds meta-narrative content - depends on US1 component existing
- **User Story 3 (P2)**: Adds responsive layout - depends on US1 desktop layout existing

### Within Each User Story

- Component shell before content implementation
- Content before styling
- Desktop before mobile responsive
- Core functionality before animations

### Parallel Opportunities

- T002, T003 can run in parallel (Setup phase)
- T021, T022, T023, T024, T025 can run in parallel (Polish phase)
- User Story 2 and 3 can run in parallel after US1 reaches T011

---

## Parallel Example: Setup Phase

```bash
# Launch all verification tasks together:
Task: "Verify project image exists at public/images/projects/ai-board.webp"
Task: "Verify theme CSS variables are available in src/styles/theme.css"
```

## Parallel Example: Polish Phase

```bash
# Launch all polish tasks together:
Task: "Add CSS fade-in animation in FeaturedProject.astro"
Task: "Add prefers-reduced-motion media query in FeaturedProject.astro"
Task: "Add JavaScript to trigger .visible class in FeaturedProject.astro"
Task: "Add focus-visible styles for CTA link in FeaturedProject.astro"
Task: "Add conditional render for missing content in FeaturedProject.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup verification
2. Complete Phase 3: User Story 1 (T004-T012)
3. **STOP and VALIDATE**: Navigate to `/#projects`, verify AI-BOARD displays
4. Deploy if ready - basic featured section functional

### Incremental Delivery

1. Complete Setup → Verified
2. Add User Story 1 → Featured section visible → MVP!
3. Add User Story 2 → Meta-narrative added → Enhanced storytelling
4. Add User Story 3 → Mobile responsive → Full device support
5. Add Polish → Animations + accessibility → Production ready

### Single Developer Flow

1. T001 → T003 (Setup)
2. T004 → T012 (US1 - MVP)
3. T013 → T016 (US2 - Meta-narrative)
4. T017 → T020 (US3 - Mobile)
5. T021 → T028 (Polish)

---

## Notes

- [P] tasks = different files or independent CSS blocks, no dependencies
- [Story] label maps task to specific user story for traceability
- This feature creates 1 new file: `src/components/sections/FeaturedProject.astro`
- This feature modifies 1 file: `src/pages/index.astro` (add import + render)
- All styling is component-scoped (inside FeaturedProject.astro `<style>` block)
- No new dependencies required - uses existing GSAP, Content Collections
- Estimated bundle impact: ~0KB JS (static Astro component)
