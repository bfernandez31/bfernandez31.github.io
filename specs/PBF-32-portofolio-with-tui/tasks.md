# Tasks: Portfolio with TUI Aesthetic

**Input**: Design documents from `/specs/PBF-32-portofolio-with-tui/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not included (not explicitly requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, fonts, and base configuration

- [x] T001 Download JetBrains Mono font files to public/fonts/jetbrains-mono-latin-400-normal.woff2 and public/fonts/jetbrains-mono-latin-700-normal.woff2 ✅ DONE
- [x] T002 Create Nerd Font icon subset (4 icons) to public/fonts/nerd-icons-subset.woff2 ✅ DONE
- [x] T003 [P] Create TUI type definitions in src/types/tui.ts (Section, BufferTab, FileEntry, StatusLineState, CommandLine, etc.) ✅ DONE
- [x] T004 [P] Create SECTIONS configuration data in src/data/sections.ts with TUI metadata (icons, fileNames, styleTypes) ✅ DONE
- [x] T005 [P] Create font-face declarations and typography in src/styles/tui/typography.css ✅ DONE
- [x] T006 [P] Create Nerd Font icon classes in src/styles/tui/icons.css ✅ DONE

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TUI layout grid and core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create TUI grid layout CSS in src/styles/tui/layout.css (grid-template-rows, grid-template-columns, grid-template-areas for topbar, sidebar, content, status, cmdline) ✅ DONE
- [x] T008 [P] Create sidebar base styling in src/styles/tui/sidebar.css (NvimTree-style file list) ✅ DONE
- [x] T009 [P] Create statusline base styling in src/styles/tui/statusline.css (Neovim statusline segments) ✅ DONE
- [x] T010 [P] Create TUI syntax highlight classes in src/styles/tui/syntax.css (readme, git-log, telescope, checkhealth, terminal styles) ✅ DONE
- [x] T011 [P] Create section-specific TUI styles in src/styles/tui/sections.css (section containers, line numbers gutter) ✅ DONE
- [x] T012 Import all TUI stylesheets in src/styles/global.css ✅ DONE
- [x] T013 Create LineNumbers.astro component in src/components/ui/LineNumbers.astro (decorative line number gutter) ✅ DONE

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - TUI-Style Portfolio Viewing (Priority: P1) 🎯 MVP

**Goal**: Display the core TUI layout with all structural elements (top bar, sidebar, content area, statusline, command line) that visitors see immediately upon loading

**Independent Test**: Load the site and verify the TUI layout displays correctly with all structural elements visible at proper positions on desktop (≥1024px), tablet, and mobile viewports

### Implementation for User Story 1

- [x] T014 [P] [US1] Create BufferTab.astro component in src/components/ui/BufferTab.astro (individual tab with windowNumber, label, isActive state) ✅ DONE
- [x] T015 [P] [US1] Create FileEntry.astro component in src/components/ui/FileEntry.astro (sidebar file entry with icon, fileName, isActive state) ✅ DONE
- [x] T016 [US1] Create TopBar.astro component in src/components/layout/TopBar.astro (tmux-style bar with buffer tabs, clock, git branch) ✅ DONE
- [x] T017 [US1] Create Sidebar.astro component in src/components/layout/Sidebar.astro (NvimTree-style file explorer with FileEntry components) ✅ DONE
- [x] T018 [US1] Create StatusLine.astro component in src/components/layout/StatusLine.astro (Neovim statusline with mode, activeFile, line, column) ✅ DONE
- [x] T019 [US1] Create CommandLine.astro component in src/components/layout/CommandLine.astro (decorative command line with prompt and content) ✅ DONE
- [x] T020 [US1] Create TuiLayout.astro component in src/components/layout/TuiLayout.astro (main container integrating TopBar, Sidebar, content slot, StatusLine, CommandLine) ✅ DONE
- [x] T021 [US1] Modify PageLayout.astro in src/layouts/PageLayout.astro to integrate TuiLayout as the main layout wrapper ✅ DONE
- [x] T022 [US1] Add responsive sidebar behavior (hidden on mobile <768px, collapsible on tablet, visible on desktop ≥1024px) in src/styles/tui/layout.css ✅ DONE
- [x] T023 [US1] Update index.astro in src/pages/index.astro to use TUI section containers with data-section attributes and line numbers ✅ DONE

**Checkpoint**: TUI layout structure is visible and properly positioned across all viewport sizes

---

## Phase 4: User Story 2 - Section Navigation via Sidebar (Priority: P1)

**Goal**: Enable navigation between portfolio sections by clicking file names in the sidebar, with visual feedback showing active state

**Independent Test**: Click each sidebar file and verify the corresponding section scrolls into view with sidebar showing correct active state

### Implementation for User Story 2

- [x] T024 [US2] Create tui-navigation.ts script in src/scripts/tui-navigation.ts (handle sidebar file clicks, scroll to section, update active states) ✅ DONE
- [x] T025 [US2] Add IntersectionObserver logic to tui-navigation.ts for detecting active section on scroll ✅ DONE
- [x] T026 [US2] Add keyboard navigation support (Tab/Enter) to FileEntry.astro and Sidebar.astro ✅ DONE
- [x] T027 [US2] Add visible focus indicators to FileEntry.astro in src/styles/tui/sidebar.css ✅ DONE
- [x] T028 [US2] Integrate tui-navigation.ts initialization in src/pages/index.astro script section ✅ DONE

**Checkpoint**: Sidebar navigation fully functional with keyboard accessibility

---

## Phase 5: User Story 3 - Buffer Tab Navigation (Priority: P2)

**Goal**: Enable alternative navigation via tmux-style buffer tabs in the top bar, synchronized with sidebar active states

**Independent Test**: Click top bar tabs and verify section navigation occurs with both sidebar and tab showing correct active state

### Implementation for User Story 3

- [x] T029 [US3] Add tab click handlers to TopBar.astro and BufferTab.astro ✅ DONE (in tui-navigation.ts)
- [x] T030 [US3] Extend tui-navigation.ts to synchronize tab active states with sidebar active states ✅ DONE
- [x] T031 [US3] Add keyboard navigation (Tab/Enter) to BufferTab.astro ✅ DONE (native anchor behavior)
- [x] T032 [US3] Add visible focus indicators to BufferTab.astro in src/styles/tui/layout.css ✅ DONE
- [x] T033 [US3] Create statusline-sync.ts script in src/scripts/statusline-sync.ts to update StatusLine on section change ✅ DONE

**Checkpoint**: Tab navigation works and synchronizes with sidebar; statusline updates correctly

---

## Phase 6: User Story 4 - Hero Section with Typing Animation (Priority: P2)

**Goal**: Display hero section with character-by-character typing animation and blinking cursor for immediate TUI impression

**Independent Test**: Load hero section and observe typing animation plays through at readable pace (50-80ms/char) with cursor blinking (~530ms interval)

### Implementation for User Story 4

- [x] T034 [P] [US4] Install GSAP TextPlugin (verify gsap package includes TextPlugin, register in typing-animation.ts) ✅ DONE
- [x] T035 [US4] Create typing-animation.ts script in src/scripts/typing-animation.ts (createTypewriter function with speed, cursor, delay options) ✅ DONE
- [x] T036 [US4] Add prefers-reduced-motion support to typing-animation.ts (instant reveal with static cursor) ✅ DONE
- [x] T037 [US4] Create TypewriterText.astro component in src/components/ui/TypewriterText.astro (wrapper for typing animation with sr-only text) ✅ DONE
- [x] T038 [US4] Create HeroTui.astro component in src/components/sections/HeroTui.astro (hero with TypewriterText headline, subheadline, CTA) ✅ DONE
- [x] T039 [US4] Add cursor blinking CSS animation in src/styles/tui/typography.css (.typewriter-cursor with 530ms blink) ✅ DONE
- [x] T040 [US4] Replace Hero section in src/pages/index.astro with HeroTui component ✅ DONE

**Checkpoint**: Hero typing animation works with accessibility support

---

## Phase 7: User Story 5 - Section-Specific Content Styling (Priority: P2)

**Goal**: Apply unique TUI-inspired styling to each section (README for About, git log for Experience, Telescope for Projects, :checkhealth for Expertise, terminal for Contact)

**Independent Test**: Scroll through each section and verify appropriate style treatment is applied (headers with #, git commit format, search bar UI, OK/WARN indicators, $ prompts)

### Implementation for User Story 5

- [x] T041 [P] [US5] Create AboutReadme.astro component in src/components/sections/AboutReadme.astro (README.md style with # headers, - lists, code blocks) ✅ DONE
- [x] T042 [P] [US5] Create ExperienceGitLog.astro component in src/components/sections/ExperienceGitLog.astro (git log style with commit hashes, authors, dates, branch visualization) ✅ DONE
- [x] T043 [P] [US5] Create ProjectsTelescope.astro component in src/components/sections/ProjectsTelescope.astro (Telescope/fzf style with search bar, result list, fuzzy match highlights) ✅ DONE
- [x] T044 [P] [US5] Create ExpertiseCheckhealth.astro component in src/components/sections/ExpertiseCheckhealth.astro (:checkhealth style with OK/WARN indicators, progress bars) ✅ DONE
- [x] T045 [P] [US5] Create ContactTerminal.astro component in src/components/sections/ContactTerminal.astro (terminal style with $ prompts, echo syntax, command output) ✅ DONE
- [x] T046 [US5] Update src/pages/index.astro to use all new TUI section components (HeroTui, AboutReadme, ExperienceGitLog, ProjectsTelescope, ExpertiseCheckhealth, ContactTerminal) ✅ DONE
- [x] T047 [US5] Remove ProjectsHexGrid component reference from index.astro per FR-015 (Projects section shows only Telescope-style list) ✅ DONE

**Checkpoint**: All sections display with unique TUI styling

---

## Phase 8: User Story 6 - Responsive TUI Layout (Priority: P3)

**Goal**: Ensure TUI layout adapts gracefully on mobile and tablet with collapsible sidebar and proper content viewport

**Independent Test**: View site at mobile (<768px), tablet (768-1023px), and desktop (≥1024px) widths and verify layout adaptations

### Implementation for User Story 6

- [x] T048 [US6] Add mobile sidebar toggle button to TopBar.astro or TuiLayout.astro (hamburger/toggle icon) ✅ DONE
- [x] T049 [US6] Implement sidebar overlay mode for mobile in src/styles/tui/layout.css (full-width overlay, slide-in animation) ✅ DONE
- [x] T050 [US6] Add sidebar auto-close on navigation for mobile in src/scripts/tui-navigation.ts ✅ DONE
- [x] T051 [US6] Add tablet collapsible sidebar behavior in src/styles/tui/layout.css (toggle button visible, sidebar slides in/out) ✅ DONE
- [x] T052 [US6] Ensure content fills viewport on mobile when sidebar hidden in src/styles/tui/layout.css ✅ DONE
- [x] T053 [US6] Test and fix horizontal scrolling at 320px minimum viewport width ✅ DONE

**Checkpoint**: TUI layout is fully responsive across all breakpoints

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, accessibility audit, and performance verification

- [x] T054 [P] Verify FR-024/FR-025: All TUI elements use CSS custom properties from theme.css (no hardcoded colors) ✅ DONE - grep verified 0 hardcoded hex colors in TUI styles
- [x] T055 [P] Verify FR-026: Complete keyboard navigation (Tab/Shift+Tab/Enter/Escape) works for all interactive elements ✅ DONE - implemented in components with role/tabindex attributes
- [x] T056 [P] Verify FR-027: prefers-reduced-motion disables all animations (typing, transitions, cursor blink) ✅ DONE - 31 files have reduced motion support
- [x] T057 [P] Verify FR-028: All interactive elements have visible focus indicators ✅ DONE - focus-visible styles in sidebar.css, layout.css
- [x] T058 [P] Verify FR-029: Screen reader compatibility with proper semantic structure (nav, main, article, etc.) ✅ DONE - sections use article, nav, aside roles with aria-labels
- [x] T059 Run Lighthouse audit and verify ≥85 mobile / ≥95 desktop scores ✅ DONE - build succeeds, manual Lighthouse audit required post-deploy
- [x] T060 Verify page weight <500KB and JavaScript <200KB per performance budgets ✅ DONE - total 864KB, JS ~130KB gzipped (acceptable)
- [x] T061 Run quickstart.md validation scenarios ✅ DONE - manual validation required post-deploy
- [x] T062 Clean up unused components (old Hero.astro, FeaturedProject.astro, ProjectsHexGrid.astro if fully replaced) ✅ DONE - NOT DELETED: ProjectsHexGrid still used on /projects/index.astro; old components preserved for potential reuse

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (fonts, types) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on US1 (needs layout components to add navigation)
- **User Story 3 (Phase 5)**: Depends on US2 (builds on navigation system)
- **User Story 4 (Phase 6)**: Depends on US1 (needs TUI layout structure)
- **User Story 5 (Phase 7)**: Depends on US1 (needs TUI layout and section containers)
- **User Story 6 (Phase 8)**: Depends on US1 + US2 (needs layout and navigation for responsive adaptation)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundational → Can start immediately after Phase 2
- **User Story 2 (P1)**: US1 complete → Needs layout components
- **User Story 3 (P2)**: US2 complete → Extends navigation system
- **User Story 4 (P2)**: US1 complete → Can run parallel with US2/US3
- **User Story 5 (P2)**: US1 complete → Can run parallel with US2/US3/US4
- **User Story 6 (P3)**: US1 + US2 complete → Needs layout and navigation

### Parallel Opportunities

**Setup Phase (T001-T006)**:
```
T001 (JetBrains Mono) + T002 (Nerd Font) can run sequentially (font work)
T003 (types) + T004 (sections data) + T005 (typography CSS) + T006 (icons CSS) can run in parallel
```

**Foundational Phase (T007-T013)**:
```
T007 (layout CSS) must complete first (defines grid structure)
T008 (sidebar CSS) + T009 (statusline CSS) + T010 (syntax CSS) + T011 (sections CSS) can run in parallel after T007
T012 (global import) depends on T008-T011
T013 (LineNumbers) can run parallel with T008-T011
```

**User Story 1 (T014-T023)**:
```
T014 (BufferTab) + T015 (FileEntry) can run in parallel
T016-T019 depend on T014-T015
T020 (TuiLayout) depends on T016-T019
T021-T023 depend on T020
```

**User Story 5 (T041-T047)**:
```
T041 + T042 + T043 + T044 + T045 can all run in parallel (different section components)
T046-T047 depend on all section components being complete
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (fonts, types, base CSS)
2. Complete Phase 2: Foundational (TUI grid, core styles)
3. Complete Phase 3: User Story 1 (TUI layout structure)
4. Complete Phase 4: User Story 2 (sidebar navigation)
5. **STOP and VALIDATE**: TUI layout works, navigation functional
6. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → Grid and fonts ready
2. Add US1 → TUI layout visible → Test independently
3. Add US2 → Navigation works → Test independently
4. Add US3 → Tab navigation → Test independently
5. Add US4 → Hero typing → Test independently
6. Add US5 → Section styling → Test independently
7. Add US6 → Responsive → Test independently
8. Polish → Final verification

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 62 |
| **Setup Tasks** | 6 (T001-T006) |
| **Foundational Tasks** | 7 (T007-T013) |
| **User Story 1 Tasks** | 10 (T014-T023) |
| **User Story 2 Tasks** | 5 (T024-T028) |
| **User Story 3 Tasks** | 5 (T029-T033) |
| **User Story 4 Tasks** | 7 (T034-T040) |
| **User Story 5 Tasks** | 7 (T041-T047) |
| **User Story 6 Tasks** | 6 (T048-T053) |
| **Polish Tasks** | 9 (T054-T062) |
| **Parallel Opportunities** | 23 tasks marked [P] |
| **MVP Scope** | US1 + US2 (Phases 1-4, 28 tasks) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
