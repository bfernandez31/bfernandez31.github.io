# Tasks: ASCII Art for Name on Hero Section

**Input**: Design documents from `/specs/PBF-38-ascii-art-for/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested in feature specification - test tasks excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required - this feature modifies an existing component with no new dependencies.

*No tasks in this phase.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Review existing code structure to understand current implementation

- [ ] T001 Review existing HeroTui.astro component structure in src/components/sections/HeroTui.astro
- [ ] T002 Review ContactTerminal.astro ASCII art styling for reference in src/components/sections/ContactTerminal.astro
- [ ] T003 Review typing-animation.ts to understand typewriter chain in src/scripts/typing-animation.ts
- [ ] T004 Review index.astro for current HeroTui usage in src/pages/index.astro

**Checkpoint**: Codebase reviewed - user story implementation can now begin

---

## Phase 3: User Story 1 - View ASCII Art Name on Desktop (Priority: P1) 🎯 MVP

**Goal**: Replace plain text name "Benoit Fernandez" with ASCII art using ANSI Shadow style box-drawing characters, matching the CONTACT ASCII in the contact section.

**Independent Test**: Load homepage on desktop browser (≥1024px width) and verify ASCII art name is visible, readable, and styled with --color-primary.

### Implementation for User Story 1

- [ ] T005 [US1] Add ASCII art content and `<pre>` element with `<h1>` wrapper in src/components/sections/HeroTui.astro
- [ ] T006 [US1] Add `.tui-hero__headline-wrapper` styles for semantic h1 wrapper in src/components/sections/HeroTui.astro
- [ ] T007 [US1] Add `.tui-hero__ascii` base styles (font, color, line-height, user-select) in src/components/sections/HeroTui.astro
- [ ] T008 [US1] Add aria-label="Benoit Fernandez" for screen reader accessibility in src/components/sections/HeroTui.astro

**Checkpoint**: ASCII art displays correctly on desktop viewports (≥1024px)

---

## Phase 4: User Story 2 - Responsive ASCII Art on Mobile (Priority: P2)

**Goal**: Scale ASCII art appropriately for mobile viewports (<768px) to remain readable without horizontal scrolling.

**Independent Test**: Load homepage on mobile viewport (<768px) and verify ASCII art is visible and readable without horizontal overflow.

### Implementation for User Story 2

- [ ] T009 [US2] Add CSS clamp() font-size scaling (0.3rem to 0.5rem) in src/components/sections/HeroTui.astro
- [ ] T010 [US2] Add overflow-x: auto fallback for extreme narrow viewports in src/components/sections/HeroTui.astro
- [ ] T011 [US2] Add mobile breakpoint (@media max-width: 767px) font-size override in src/components/sections/HeroTui.astro

**Checkpoint**: ASCII art displays correctly on all viewport sizes (320px to 1920px+)

---

## Phase 5: User Story 3 - Subheadline Animation Preserved (Priority: P3)

**Goal**: Preserve typewriter animation for subheadline while ASCII art name displays statically (no typewriter effect on ASCII art).

**Independent Test**: Load homepage, observe that ASCII art appears immediately while subheadline types out character by character.

### Implementation for User Story 3

- [ ] T012 [US3] Remove headline from typewriter animation chain in src/components/sections/HeroTui.astro script section
- [ ] T013 [US3] Simplify script to only animate subheadline element in src/components/sections/HeroTui.astro
- [ ] T014 [US3] Remove unused headline prop from HeroTui component interface in src/components/sections/HeroTui.astro
- [ ] T015 [US3] Update HeroTui usage in index.astro to remove headline prop in src/pages/index.astro

**Checkpoint**: Subheadline animates with typewriter effect; ASCII art is static

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and cleanup

- [ ] T016 Run bun run build to verify no TypeScript errors
- [ ] T017 Run bun run lint to verify no linting errors
- [ ] T018 Visual verification on desktop (≥1024px), tablet (768-1023px), mobile (<768px)
- [ ] T019 Screen reader verification (aria-label announces "Benoit Fernandez")
- [ ] T020 Run Lighthouse audit to verify performance budget (≥85 mobile, ≥95 desktop)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies - can start immediately
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Can proceed immediately after US1 core implementation (T005-T007)
- **User Story 3 (Phase 5)**: Depends on US1 HTML structure being in place
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - core ASCII art implementation
- **User Story 2 (P2)**: Enhances US1 - adds responsive scaling (can start after T005-T007)
- **User Story 3 (P3)**: Depends on US1 HTML structure - modifies animation behavior

### Within Each User Story

- HTML structure (T005) before styling (T006-T008)
- Base styles before responsive styles
- Core implementation before cleanup

### Parallel Opportunities

Tasks T009-T011 (US2) can run in parallel with T012-T015 (US3) after T005-T008 (US1) complete, as they modify different aspects (CSS responsive vs script logic).

---

## Parallel Example: User Story 2 + 3 After US1

```bash
# After US1 complete, launch US2 and US3 in parallel:
# US2 - Responsive styles:
Task: "Add CSS clamp() font-size scaling in src/components/sections/HeroTui.astro"

# US3 - Animation simplification:
Task: "Remove headline from typewriter animation chain in src/components/sections/HeroTui.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (code review)
2. Complete Phase 3: User Story 1 (ASCII art on desktop)
3. **STOP and VALIDATE**: Test on desktop viewport
4. Deploy if ready - ASCII art visible on desktop

### Incremental Delivery

1. Complete Foundational → Code reviewed
2. Add User Story 1 → Test on desktop → ASCII art works (MVP!)
3. Add User Story 2 → Test on mobile → Responsive scaling works
4. Add User Story 3 → Test animation → Subheadline animates correctly
5. Complete Polish → Full validation

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 20 |
| **Foundational Tasks** | 4 |
| **User Story 1 Tasks** | 4 |
| **User Story 2 Tasks** | 3 |
| **User Story 3 Tasks** | 4 |
| **Polish Tasks** | 5 |
| **Parallel Opportunities** | US2 + US3 can run in parallel after US1 |
| **MVP Scope** | User Story 1 (Tasks T001-T008) |

---

## Notes

- All implementation tasks modify 2 files: `HeroTui.astro` (primary) and `index.astro` (usage update)
- CSS styling uses existing design tokens (--color-primary, --font-mono)
- ASCII art content from research.md (stacked layout, 76 chars × 14 lines)
- No new dependencies required
- Performance impact: +~1.3KB total
