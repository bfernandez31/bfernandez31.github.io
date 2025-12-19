# Tasks: Featured Project - AI-BOARD

**Input**: Design documents from `/specs/PBF-23-featured-project/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md
**Tests**: Not requested for this feature

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/` at repository root (Astro static site)
- **Content**: `src/content/projects/` (Content Collections)
- **Components**: `src/components/layout/` (Layout components)
- **Assets**: `public/images/projects/` (Static images)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare image asset required for project content

- [ ] T001 [P] Create placeholder image at public/images/projects/ai-board.webp

**Checkpoint**: Image asset exists, build can proceed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update existing project displayOrder values to make room for AI-BOARD at position 1

**CRITICAL**: These changes MUST be complete before AI-BOARD project is added to prevent displayOrder conflicts

- [ ] T002 [P] Update displayOrder from 1 to 2 in src/content/projects/neural-portfolio.md
- [ ] T003 [P] Update displayOrder from 2 to 3 in src/content/projects/ecommerce-platform.md
- [ ] T004 [P] Update displayOrder from 3 to 4 in src/content/projects/data-visualization.md
- [ ] T005 [P] Update displayOrder from 4 to 5 in src/content/projects/mobile-app.md
- [ ] T006 [P] Update displayOrder from 5 to 6 in src/content/projects/saas-platform.md
- [ ] T007 [P] Update displayOrder from 6 to 7 in src/content/projects/open-source-library.md

**Checkpoint**: All existing projects have displayOrder 2-7, position 1 is available

---

## Phase 3: User Story 1 - Discover AI-BOARD as Featured Project (Priority: P1)

**Goal**: Portfolio visitor discovers AI-BOARD as a prominently featured project that powers the portfolio they are viewing

**Independent Test**: Navigate to `/#projects` and verify:
- AI-BOARD appears first (displayOrder: 1)
- Title, description, and image display correctly
- External link opens https://ai-board-three.vercel.app/ in new tab
- Technology tags visible (TypeScript, Claude API, Astro, GSAP)

### Implementation for User Story 1

- [ ] T008 [US1] Create AI-BOARD project entry at src/content/projects/ai-board.md with frontmatter (title, description, image, imageAlt, technologies, featured: true, displayOrder: 1, externalUrl, startDate, status, tags)
- [ ] T009 [US1] Add markdown content body describing AI-BOARD features and portfolio integration in src/content/projects/ai-board.md
- [ ] T010 [US1] Verify build passes with `bun run build`
- [ ] T011 [US1] Verify AI-BOARD appears first in projects section via dev server

**Checkpoint**: User Story 1 complete - AI-BOARD visible as top featured project with working external link

---

## Phase 4: User Story 2 - See Portfolio Attribution (Priority: P2)

**Goal**: Portfolio visitor sees footer attribution "Powered by AI-BOARD" with link to the AI-BOARD project

**Independent Test**: Scroll to footer on any page and verify:
- Shows "Powered by AI-BOARD" (not "Built with Astro and Bun")
- Link opens https://ai-board-three.vercel.app/ in new tab
- Link has proper hover/focus states

### Implementation for User Story 2

- [ ] T012 [US2] Replace footer attribution text from "Built with Astro and Bun" to "Powered by AI-BOARD" in src/components/layout/Footer.astro
- [ ] T013 [US2] Update link href to https://ai-board-three.vercel.app/ with target="_blank" rel="noopener noreferrer" in src/components/layout/Footer.astro
- [ ] T014 [US2] Verify footer link styling (hover/focus states) works correctly via dev server

**Checkpoint**: User Story 2 complete - Footer shows "Powered by AI-BOARD" with working link

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all changes

- [ ] T015 Run quickstart.md verification checklist
- [ ] T016 Verify all 7 projects display in correct order (AI-BOARD first, then 2-7)
- [ ] T017 Verify external links open in new tab (both project card and footer)
- [ ] T018 Verify accessibility (keyboard navigation, focus indicators, link announcements)
- [ ] T019 Run final build with `bun run build` to confirm no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - create placeholder image first
- **Foundational (Phase 2)**: Depends on Setup completion - updates existing project displayOrders
- **User Story 1 (Phase 3)**: Depends on Foundational - creates AI-BOARD project entry
- **User Story 2 (Phase 4)**: No dependency on User Story 1 - can run in parallel
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (displayOrder renumbering) - Independently testable
- **User Story 2 (P2)**: No dependencies on other stories - Independently testable

### Within Each User Story

- Content creation before verification
- Build verification before visual verification
- Core implementation before polish

### Parallel Opportunities

**Phase 2 (All Parallel)**:
```bash
# All displayOrder updates can run in parallel (6 different files):
T002: src/content/projects/neural-portfolio.md
T003: src/content/projects/ecommerce-platform.md
T004: src/content/projects/data-visualization.md
T005: src/content/projects/mobile-app.md
T006: src/content/projects/saas-platform.md
T007: src/content/projects/open-source-library.md
```

**User Stories (Parallel After Phase 2)**:
```bash
# User Story 1 and User Story 2 can run in parallel:
# Developer A: T008-T011 (AI-BOARD project entry)
# Developer B: T012-T014 (Footer attribution)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Create placeholder image
2. Complete Phase 2: Update all existing displayOrder values
3. Complete Phase 3: Create AI-BOARD project entry
4. **STOP and VALIDATE**: Test AI-BOARD appears first in projects
5. Deploy/demo if ready

### Full Implementation

1. Complete Setup + Foundational (T001-T007)
2. Add User Story 1 (T008-T011) - AI-BOARD as featured project
3. Add User Story 2 (T012-T014) - Footer attribution change
4. Polish (T015-T019) - Verification and accessibility checks
5. Deploy

### Parallel Team Strategy

With multiple developers:
1. Phase 2: All displayOrder updates in parallel (6 files, 6 developers max)
2. Once Phase 2 done:
   - Developer A: User Story 1 (AI-BOARD project)
   - Developer B: User Story 2 (Footer changes)
3. Both stories complete and verify independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No tests included (not requested in spec)
- Commit after each task or logical group
- Image asset is placeholder initially - replace with real screenshot when available
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
