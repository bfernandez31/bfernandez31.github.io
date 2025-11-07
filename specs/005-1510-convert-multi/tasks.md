# Tasks: Single-Page Portfolio with Sectioned Layout

**Feature**: 005-1510-convert-multi
**Input**: Design documents from `/specs/005-1510-convert-multi/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in spec.md - focusing on implementation and manual testing

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Project Type**: Web (static site with Astro)
- **Structure**: Single project with `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create TypeScript types, data files, and basic CSS infrastructure for single-page architecture

- [ ] T001 [P] Create TypeScript type definitions in src/types/section.ts based on contracts/section-component.contract.ts
- [ ] T002 [P] Create TypeScript type definitions in src/types/navigation.ts based on contracts/navigation.contract.ts
- [ ] T003 [P] Create TypeScript type definitions in src/types/seo.ts based on contracts/seo-metadata.contract.ts
- [ ] T004 [P] Create section configuration data file in src/data/sections.ts with all 5 sections (hero, about, projects, expertise, contact)
- [ ] T005 [P] Create CSS section layout styles in src/styles/sections.css with 100vh/100dvh responsive patterns
- [ ] T006 Import sections.css in src/styles/global.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: JavaScript utilities that enable navigation behavior - MUST be complete before any user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 [P] Implement active navigation manager in src/scripts/active-navigation.ts with IntersectionObserver (30% threshold)
- [ ] T008 [P] Implement navigation link handler in src/scripts/navigation-links.ts with Lenis smooth scroll integration
- [ ] T009 [P] Implement navigation history manager in src/scripts/navigation-history.ts with initial hash and popstate handlers
- [ ] T010 [P] Update navigation data in src/data/navigation.ts to use hash links (#hero, #about, #projects, #expertise, #contact)
- [ ] T011 Update page metadata in src/data/pages.ts for single-page structure with canonical URL

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Seamless Single-Page Navigation (Priority: P1) 🎯 MVP

**Goal**: Visitors can navigate smoothly between sections using navigation links, scrolling, and keyboard shortcuts without page reloads

**Independent Test**: Click all navigation links (hero, about, projects, expertise, contact) and verify smooth scroll to corresponding sections works without page reloads. All content from original pages must be accessible.

**Why MVP**: Core functionality - the entire feature depends on users being able to navigate between sections effectively. Without this, the single-page architecture provides no value.

### Implementation for User Story 1

- [ ] T012 [US1] Update Header component in src/components/layout/Header.astro to use hash anchor links (#hero, #about, #projects, #expertise, #contact)
- [ ] T013 [US1] Update BurgerMenu component in src/components/layout/BurgerMenu.astro to use hash anchor links
- [ ] T014 [US1] Create new single-page index.astro in src/pages/index.astro with all 5 sections and proper semantic HTML structure
- [ ] T015 [US1] Add JSON-LD structured data script to index.astro with WebSite + Person + CreativeWork entities
- [ ] T016 [US1] Add script imports to index.astro (initActiveNavigation, initNavigationLinks, initNavigationHistory)
- [ ] T017 [US1] Test navigation link clicks across all 5 sections (manual QA: smooth scroll, active state updates, URL hash updates)
- [ ] T018 [US1] Test keyboard navigation (Tab through links, Enter to navigate, verify focus indicators)
- [ ] T019 [US1] Test deep linking by visiting URLs with hash fragments (/#about, /#projects, etc.)
- [ ] T020 [US1] Test browser back/forward navigation between sections

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can navigate between all sections using links, keyboard, and browser history

---

## Phase 4: User Story 2 - Content Preservation and Organization (Priority: P1)

**Goal**: All previously available content (About, Projects, Expertise, Contact information) is organized into distinct, easily identifiable sections within the single-page layout

**Independent Test**: Compare content from existing pages (about.astro, expertise.astro, contact.astro) with new sections in index.astro. All text, images, links, and interactive elements must be present and functional.

**Why P1**: Critical for feature success - all existing content must be migrated and remain accessible. Missing content would be a regression from the current multi-page site.

### Implementation for User Story 2

- [ ] T021 [US2] Migrate Hero section content to index.astro with semantic HTML (id="hero", data-section="hero", role="main")
- [ ] T022 [US2] Migrate About section content from src/pages/about.astro to index.astro section (id="about", data-section="about", role="region")
- [ ] T023 [US2] Migrate Projects section content to index.astro section (id="projects", data-section="projects", role="region")
- [ ] T024 [US2] Migrate Expertise section content from src/pages/expertise.astro to index.astro section (id="expertise", data-section="expertise", role="region")
- [ ] T025 [US2] Migrate Contact section content from src/pages/contact.astro to index.astro section (id="contact", data-section="contact", role="region")
- [ ] T026 [US2] Verify all content from about.astro is present in About section (text, images, links)
- [ ] T027 [US2] Verify all content from expertise.astro is present in Expertise section (skills matrix, categories)
- [ ] T028 [US2] Verify all content from contact.astro is present in Contact section (contact form, social links, email)
- [ ] T029 [US2] Test all interactive elements in each section (buttons, forms, links)
- [ ] T030 [US2] Rename deprecated page files (about.astro → about.astro.old, expertise.astro → expertise.astro.old, contact.astro → contact.astro.old)

**Checkpoint**: At this point, all content from the multi-page site is preserved in the single-page layout and remains accessible

---

## Phase 5: User Story 3 - Responsive Fullscreen Sections (Priority: P2)

**Goal**: Each section displays as a visually distinct, full-viewport content block that adapts gracefully to all device screen sizes

**Independent Test**: Load the site on various viewport sizes (desktop 1920px, tablet 768px, mobile 375px) and verify each section occupies appropriate screen space without content overflow or awkward whitespace.

**Why P2**: Important for visual impact and professional appearance, but not blocking basic functionality. Can be refined after P1 stories are complete.

### Implementation for User Story 3

- [ ] T031 [US3] Add portfolio-section CSS class to all sections in index.astro with 100vh/100dvh height
- [ ] T032 [US3] Add section-specific CSS classes (portfolio-section--hero, --about, --projects, --expertise, --contact)
- [ ] T033 [US3] Test desktop viewport (1920x1080): verify each section is exactly 100vh with no vertical gaps
- [ ] T034 [US3] Test tablet viewport (768x1024): verify sections use min-height and content doesn't overflow horizontally
- [ ] T035 [US3] Test mobile viewport (375x667): verify sections adapt to small viewport without horizontal overflow
- [ ] T036 [US3] Test short viewport (1920x600): verify sections allow overflow and content remains accessible
- [ ] T037 [US3] Test device orientation changes: verify section heights recalculate dynamically
- [ ] T038 [US3] Add responsive padding with clamp() for sections (1rem to 3rem vertical, 1rem to 2rem horizontal)
- [ ] T039 [US3] Test mobile burger menu navigation on small viewports

**Checkpoint**: All sections display correctly across desktop, tablet, and mobile viewports with proper fullscreen behavior

---

## Phase 6: User Story 4 - Section Identification and Accessibility (Priority: P2)

**Goal**: Visitors using assistive technologies or automated tools can identify and navigate between distinct sections using semantic HTML landmarks and ARIA attributes

**Independent Test**: Use accessibility auditing tools (axe DevTools, NVDA screen reader) to verify each section has proper landmarks, labels, and keyboard navigation support.

**Why P2**: Essential for accessibility compliance and SEO, but can be implemented alongside P1 stories without blocking basic functionality.

### Implementation for User Story 4

- [ ] T040 [US4] Add data-section attributes to all 5 sections in index.astro matching their IDs
- [ ] T041 [US4] Add ARIA landmarks to sections (role="main" for Hero, role="region" for others)
- [ ] T042 [US4] Add aria-label attributes to all sections with descriptive text
- [ ] T043 [US4] Verify heading hierarchy: Hero uses h1, all other sections use h2
- [ ] T044 [US4] Test with axe DevTools: verify 0 critical accessibility violations
- [ ] T045 [US4] Test with NVDA screen reader: verify sections are announced with proper labels
- [ ] T046 [US4] Test keyboard focus indicators: verify visible focus on all interactive elements
- [ ] T047 [US4] Test aria-current="page" attribute updates on active navigation links
- [ ] T048 [US4] Add screen reader announcements for section navigation in src/scripts/navigation-links.ts
- [ ] T049 [US4] Test with prefers-reduced-motion enabled: verify smooth scroll is disabled and navigation uses instant scroll

**Checkpoint**: All accessibility requirements are met (WCAG 2.1 AA compliance) and assistive technology users can navigate the site effectively

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: SEO optimization, redirects, performance validation, and cleanup

- [ ] T050 [P] Add Astro redirects configuration in astro.config.mjs (/about → /#about, /expertise → /#expertise, /contact → /#contact)
- [ ] T051 [P] Update CLAUDE.md with new single-page navigation patterns and section organization guidelines
- [ ] T052 [P] Validate JSON-LD structured data with Google Rich Results Test
- [ ] T053 Run Lighthouse audit: verify Performance, Accessibility, Best Practices, SEO scores all ≥95
- [ ] T054 Run bun run build and verify total JS bundle size <200KB
- [ ] T055 Test frame rate during scroll: verify 60fps on desktop, 30fps on mobile
- [ ] T056 Cross-browser testing: Chrome, Firefox, Safari, Edge (latest versions)
- [ ] T057 Delete deprecated page files after successful deployment (about.astro.old, expertise.astro.old, contact.astro.old)
- [ ] T058 Run quickstart.md validation: follow all testing checklist items

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase (Phase 2) completion
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel after Phase 2
  - User Story 3 (P2) and User Story 4 (P2) can start after P1 stories or in parallel with them
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on User Story 1, but should be integrated together for MVP
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances User Stories 1 & 2 but doesn't block them
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Can be implemented in parallel with User Story 3

### Within Each User Story

- User Story 1: Navigation components (T012, T013) can run in parallel → index.astro (T014-T016) → Testing (T017-T020)
- User Story 2: All content migration tasks (T021-T025) can run in parallel → Verification tasks (T026-T029) → Deprecation (T030)
- User Story 3: CSS classes (T031-T032) → All testing tasks can run in parallel (T033-T037) → Responsive padding (T038) → Mobile testing (T039)
- User Story 4: ARIA markup tasks (T040-T043) → All testing tasks (T044-T049) can run independently

### Parallel Opportunities

- **Phase 1 (Setup)**: All tasks T001-T005 marked [P] can run in parallel
- **Phase 2 (Foundational)**: All tasks T007-T011 marked [P] can run in parallel
- **Phase 7 (Polish)**: Tasks T050-T052 marked [P] can run in parallel
- **User Story 2**: Content migration tasks T021-T025 can all run in parallel
- **User Story 3**: Testing tasks T033-T037 can run in parallel
- **User Story 4**: ARIA markup tasks T040-T043 can run in parallel; testing tasks T044-T049 can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all foundational JavaScript utilities together:
Task: "Implement active navigation manager in src/scripts/active-navigation.ts"
Task: "Implement navigation link handler in src/scripts/navigation-links.ts"
Task: "Implement navigation history manager in src/scripts/navigation-history.ts"
Task: "Update navigation data in src/data/navigation.ts"
Task: "Update page metadata in src/data/pages.ts"
```

---

## Parallel Example: User Story 2 (Content Migration)

```bash
# Launch all content migration tasks together:
Task: "Migrate Hero section content to index.astro"
Task: "Migrate About section content to index.astro"
Task: "Migrate Projects section content to index.astro"
Task: "Migrate Expertise section content to index.astro"
Task: "Migrate Contact section content to index.astro"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T011) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T012-T020) - Navigation working
4. Complete Phase 4: User Story 2 (T021-T030) - Content migrated
5. **STOP and VALIDATE**: Test navigation and content independently
6. Run basic Lighthouse audit and accessibility checks
7. Deploy/demo if ready (MVP complete!)

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Foundational → Foundation ready
2. **MVP** (Phases 3-4): User Stories 1 & 2 → Navigation + Content → Test independently → Deploy/Demo
3. **Enhancement 1** (Phase 5): User Story 3 → Responsive fullscreen → Test independently → Deploy/Demo
4. **Enhancement 2** (Phase 6): User Story 4 → Accessibility polish → Test independently → Deploy/Demo
5. **Production Ready** (Phase 7): Polish & optimization → Final validation → Production deploy

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Navigation - T012-T020)
   - **Developer B**: User Story 2 (Content Migration - T021-T030)
   - **Developer C**: User Story 3 (Responsive Sections - T031-T039)
3. Stories complete and integrate independently
4. Team reconvenes for Phase 7 (Polish)

---

## Summary Statistics

- **Total Tasks**: 58 tasks
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 5 tasks (BLOCKING)
- **Phase 3 (User Story 1 - P1 MVP)**: 9 tasks
- **Phase 4 (User Story 2 - P1 MVP)**: 10 tasks
- **Phase 5 (User Story 3 - P2)**: 9 tasks
- **Phase 6 (User Story 4 - P2)**: 10 tasks
- **Phase 7 (Polish)**: 9 tasks

**Parallel Opportunities Identified**:
- Phase 1: 5 tasks can run in parallel
- Phase 2: 5 tasks can run in parallel
- User Story 2: 5 content migration tasks can run in parallel
- User Story 3: 5 testing tasks can run in parallel
- User Story 4: 4 markup tasks and 6 testing tasks can run in parallel
- Phase 7: 3 tasks can run in parallel

**MVP Scope (Phases 1-4)**: 30 tasks
**Full Feature (All Phases)**: 58 tasks

**Independent Test Criteria**:
- ✅ User Story 1: Click all navigation links and verify smooth scroll works without page reloads
- ✅ User Story 2: Compare content from old pages with new sections - verify 100% content preservation
- ✅ User Story 3: Test on 3+ viewport sizes - verify proper fullscreen behavior without overflow
- ✅ User Story 4: Run axe DevTools audit - verify 0 critical accessibility violations

**Format Validation**: ✅ ALL tasks follow the required checklist format:
- Checkbox: `- [ ]`
- Task ID: T001-T058 (sequential)
- [P] marker: Present on all parallelizable tasks
- [Story] label: Present on all user story phase tasks (US1, US2, US3, US4)
- Description: Clear action with exact file path included

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- Follow quickstart.md testing checklist after each user story completion
- Respect prefers-reduced-motion preference in all animations and scroll behavior
- Maintain WCAG 2.1 AA accessibility compliance throughout implementation
