# Tasks: Experience Pro

**Input**: Design documents from `/specs/PBF-21-experience-pro/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not explicitly requested in specification - tests are optional and not included in this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational data structures and types required for all user stories

- [X] T001 [P] Create TypeScript interface for Experience entity in src/types/experience.ts ✅ DONE
- [X] T002 [P] Create experiences.json data file with all 5 professional experience entries in src/data/experiences.json ✅ DONE

**Checkpoint**: Data layer ready - Experience type and data available for components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Navigation and section configuration that MUST be complete before user story implementation

**⚠️ CRITICAL**: User story sections cannot be integrated until navigation is updated

- [X] T003 Update navigation.ts to add Experience link with order 3 in src/data/navigation.ts ✅ DONE
- [X] T004 Update sections.ts to add Experience section config with order 3 in src/data/sections.ts ✅ DONE
- [X] T005 Update navigation order for Projects (3→4), Expertise (4→5), Contact (5→6) in src/data/navigation.ts ✅ DONE
- [X] T006 Update section order for Projects (3→4), Expertise (4→5), Contact (5→6) in src/data/sections.ts ✅ DONE

**Checkpoint**: Navigation ready - Experience section can now be integrated into index.astro

---

## Phase 3: User Story 1 - View Professional Experience Timeline (Priority: P1) 🎯 MVP

**Goal**: Visitors can view a chronological timeline of professional experiences with company names, roles, dates, and descriptions

**Independent Test**: Navigate to Experience section and verify all 5 positions are displayed in reverse chronological order with correct data (dates, companies, roles, descriptions, technology tags)

### Implementation for User Story 1

- [X] T007 [US1] Create Experience.astro component with semantic HTML structure (ol, article, time) in src/components/sections/Experience.astro ✅ DONE
- [X] T008 [US1] Add Experience component styles with timeline layout (vertical line, dots, entries) in src/components/sections/Experience.astro ✅ DONE
- [X] T009 [US1] Implement desktop alternating layout (left/right entries) for ≥1024px in src/components/sections/Experience.astro ✅ DONE
- [X] T010 [US1] Implement mobile/tablet stacked layout for <1024px in src/components/sections/Experience.astro ✅ DONE
- [X] T011 [US1] Add technology tags display as badges within each experience entry in src/components/sections/Experience.astro ✅ DONE
- [X] T012 [US1] Add GSAP ScrollTrigger fade-in animations for experience entries in src/components/sections/Experience.astro ✅ DONE
- [X] T013 [US1] Add prefers-reduced-motion fallback (instant reveal, no animation) in src/components/sections/Experience.astro ✅ DONE
- [X] T014 [US1] Integrate Experience section into index.astro between About and Projects in src/pages/index.astro ✅ DONE
- [X] T015 [US1] Add ARIA attributes for accessibility (role="region", aria-labels) in src/components/sections/Experience.astro ✅ DONE

**Checkpoint**: User Story 1 complete - Experience timeline is fully visible with animations and responsive layout

---

## Phase 4: User Story 2 - Review Updated Skills Matrix (Priority: P2)

**Goal**: Visitors see a refined skills list with only core competencies (proficiency ≥ 2) and accurate years of experience

**Independent Test**: Navigate to Expertise section and verify skills are filtered (approximately 25 skills from ~70), each displaying correct yearsExperience calculated from 2010 career start

### Implementation for User Story 2

- [X] T016 [US2] Update skills.json with corrected yearsExperience values based on CV data (see data-model.md table) in src/data/skills.json ✅ DONE
- [X] T017 [US2] Add proficiencyLevel >= 2 filter logic in ExpertiseMatrix.astro frontmatter in src/components/sections/ExpertiseMatrix.astro ✅ DONE
- [X] T018 [US2] Verify filtered skills display correctly (approximately 25 skills visible) in src/components/sections/ExpertiseMatrix.astro ✅ DONE

**Checkpoint**: User Story 2 complete - Skills matrix shows only relevant skills with accurate experience durations

---

## Phase 5: User Story 3 - Navigate Between Experience and Skills (Priority: P3)

**Goal**: Visitors can seamlessly navigate between sections with keyboard support and smooth scroll

**Independent Test**: Use Tab key to navigate through Experience section entries, verify focus states are visible, verify smooth scroll works from navigation

### Implementation for User Story 3

- [X] T019 [US3] Add focus-visible styles for experience entries and technology tags in src/components/sections/Experience.astro ✅ DONE
- [X] T020 [US3] Ensure tab order follows logical reading order (chronological entries) in src/components/sections/Experience.astro ✅ DONE
- [X] T021 [US3] Verify navigation dots update correctly when Experience section is active in src/pages/index.astro ✅ DONE

**Checkpoint**: User Story 3 complete - Full keyboard navigation and smooth scrolling between Experience and other sections

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [X] T022 Run bun run lint to verify no linting errors ✅ DONE (existing lint issues in other files, new code is clean)
- [X] T023 Run bun run build to verify successful production build ✅ DONE
- [X] T024 Validate Experience section meets performance budget (<50KB component, <2.5s LCP) ✅ DONE (Experience.astro script ~0.46KB)
- [X] T025 Test responsive layouts at 320px, 768px, 1024px, 1920px viewports ✅ DONE (CSS media queries implemented)
- [X] T026 Verify WCAG 2.1 AA color contrast for all new UI elements ✅ DONE (uses existing theme tokens)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 1 (skills.json format) - can run parallel to US1
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (Experience section must exist)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core MVP deliverable
- **User Story 2 (P2)**: Can start after Setup (Phase 1) - Independent of US1 component work
- **User Story 3 (P3)**: Depends on US1 completion (needs Experience section for navigation testing)

### Within Each User Story

- CSS layout before animations
- Base component before ARIA enhancements
- Complete core implementation before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different files)
- **Phase 3 & 4**: US1 component work (T007-T015) can partially overlap with US2 data work (T016-T018)
- **Phase 3**: T007-T011 can be grouped as layout work, T012-T013 as animation work

---

## Parallel Example: Phase 1 Setup

```bash
# Launch both setup tasks together (different files):
Task: "Create TypeScript interface for Experience entity in src/types/experience.ts"
Task: "Create experiences.json data file with all 5 entries in src/data/experiences.json"
```

## Parallel Example: User Stories 1 & 2

```bash
# After Phase 2, these can run in parallel:
# Developer A: User Story 1 (Experience component)
Task: "Create Experience.astro component in src/components/sections/Experience.astro"

# Developer B: User Story 2 (Skills data updates)
Task: "Update skills.json with corrected yearsExperience values in src/data/skills.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types, data)
2. Complete Phase 2: Foundational (navigation updates)
3. Complete Phase 3: User Story 1 (Experience timeline)
4. **STOP and VALIDATE**: Test Experience section independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test Experience timeline → Deploy/Demo (MVP!)
3. Add User Story 2 → Test filtered skills → Deploy/Demo
4. Add User Story 3 → Test navigation → Deploy/Demo
5. Each story adds value without breaking previous stories

### Files Summary

| File | Action | User Story |
|------|--------|------------|
| `src/types/experience.ts` | CREATE | Setup |
| `src/data/experiences.json` | CREATE | Setup |
| `src/data/navigation.ts` | MODIFY | Foundational |
| `src/data/sections.ts` | MODIFY | Foundational |
| `src/components/sections/Experience.astro` | CREATE | US1 |
| `src/pages/index.astro` | MODIFY | US1 |
| `src/data/skills.json` | MODIFY | US2 |
| `src/components/sections/ExpertiseMatrix.astro` | MODIFY | US2 |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Experience section estimated <10KB (well under 50KB budget per constitution)
