# Tasks: About Section Rework

**Input**: Design documents from `/specs/PBF-41-about-rework/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Tests**: Not requested in feature specification - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup required - this feature modifies existing infrastructure only.

*This phase is empty as the project structure already exists.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update shared configuration that affects multiple user stories

**⚠️ CRITICAL**: User Story 1 and 2 both depend on the sections configuration update.

- [X] T001 Update About section fileName from "about.tsx" to "about.md" in src/data/sections.ts
- [X] T002 Modify generateBufferTabs() to use fileName instead of displayName for label in src/data/sections.ts

**Checkpoint**: Foundation ready - both user stories can now verify their changes

---

## Phase 3: User Story 1 - View About Section in Explorer (Priority: P1) 🎯 MVP

**Goal**: Sidebar explorer displays `about.md` instead of `about.tsx` for the About section

**Independent Test**: Navigate to the portfolio, observe the sidebar explorer shows `about.md` for the About section.

### Implementation for User Story 1

- [X] T003 [US1] Verify FileEntry component in src/components/ui/FileEntry.astro correctly uses fileName from sections.ts (no changes expected)

**Checkpoint**: Sidebar explorer now displays `about.md` for About section. Click navigation to About section still works.

---

## Phase 4: User Story 2 - View About Section Content Without Header Chrome (Priority: P1)

**Goal**: About section content displays without the "README.md" header bar and border, giving the impression of reading a raw markdown file.

**Independent Test**: Navigate to About section and verify no header bar or border appears around content.

### Implementation for User Story 2

- [X] T004 [US2] Remove .tui-readme__header div element from template in src/components/sections/AboutReadme.astro
- [X] T005 [US2] Remove border properties (border, border-top, border-radius) from .tui-readme__content in src/components/sections/AboutReadme.astro
- [X] T006 [US2] Remove unused CSS rules (.tui-readme__header, .tui-readme__icon, .tui-readme__filename) from src/components/sections/AboutReadme.astro

**Checkpoint**: About section displays clean markdown content without fake header bar or border. Markdown formatting (# headings, - bullets) remains visible.

---

## Phase 5: User Story 3 - View Buffer Tab with Filename Label (Priority: P2)

**Goal**: Buffer tab in top bar displays `about.md` instead of `About` to match the explorer sidebar.

**Independent Test**: View the top bar and confirm the About section tab displays `about.md`.

### Implementation for User Story 3

- [X] T007 [US3] Verify BufferTab component in src/components/ui/BufferTab.astro correctly uses label prop (no changes expected - relies on T002)

**Checkpoint**: Buffer tab now displays `about.md` for About section. Tab click navigation still works.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and verification

- [X] T008 Run linting with bun run lint
- [X] T009 Build for production with bun run build
- [X] T010 Run quickstart.md validation checklist in dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies - can start immediately
  - T001 and T002 MUST complete before any user story verification
- **User Story 1 (Phase 3)**: Depends on T001 completion
- **User Story 2 (Phase 4)**: No dependencies on T001/T002 - can run in parallel with Phase 3
- **User Story 3 (Phase 5)**: Depends on T002 completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T001 (fileName config change)
- **User Story 2 (P1)**: Independent - only modifies AboutReadme.astro
- **User Story 3 (P2)**: Depends on T002 (generateBufferTabs change)

### Within Each User Story

- No internal dependencies for this feature (single task per story implementation)
- Verification tasks confirm expected behavior

### Parallel Opportunities

- **T001 and T002**: Sequential within same file (src/data/sections.ts)
- **T003 and T007**: Both are verification tasks, can run after their dependencies
- **T004, T005, T006**: Sequential within same file (AboutReadme.astro), but independent from other phases
- **US1, US3**: Both depend on Phase 2, can verify in parallel after Phase 2 completes
- **US2**: Fully independent, can run in parallel with Phase 2 and Phase 3

---

## Parallel Example: After Phase 2 Completion

```bash
# Launch User Story 1 and User Story 3 verification together:
Task: "Verify FileEntry component uses fileName from sections.ts"
Task: "Verify BufferTab component uses label prop"

# User Story 2 can run independently at any time:
Task: "Remove .tui-readme__header div from AboutReadme.astro"
Task: "Remove border properties from .tui-readme__content"
Task: "Remove unused CSS rules"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 2: Foundational (T001, T002)
2. Complete Phase 3: User Story 1 (T003)
3. Complete Phase 4: User Story 2 (T004-T006)
4. **STOP and VALIDATE**:
   - Explorer shows `about.md`
   - About section has no header/border
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Config ready
2. Add User Story 1 → Explorer shows `about.md` → Verify
3. Add User Story 2 → Clean markdown display → Verify
4. Add User Story 3 → Buffer tabs match explorer → Verify
5. Polish phase → Lint, build, final validation

### Optimal Execution Order

For a single developer:

1. T001 → T002 (foundational, same file)
2. T004 → T005 → T006 (US2, same file, independent of T001/T002)
3. T003 (US1 verification after T001)
4. T007 (US3 verification after T002)
5. T008 → T009 → T010 (polish)

---

## Notes

- No [P] markers used because most tasks operate on the same files sequentially
- US2 (AboutReadme changes) is fully independent and can be done first or in parallel
- T003 and T007 are verification tasks - no code changes expected, just confirmation
- All changes are backward-compatible static configuration updates
- Commit after each task for granular history
