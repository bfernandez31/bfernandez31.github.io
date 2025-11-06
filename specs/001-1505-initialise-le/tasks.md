# Tasks: Project Initialization with Bun and Astro

**Input**: Design documents from `/specs/001-1505-initialise-le/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in feature specification - tasks focus on initialization and validation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Project Type**: Web (frontend-only static site)
- All paths relative to repository root
- Structure: `src/`, `public/`, `tests/`, `.github/workflows/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure using Bun + Astro

- [X] T001 Verify Bun installation (≥1.0.0) and display version
- [X] T002 Initialize Astro project using `bun create astro@latest` with Empty template, TypeScript strict mode
- [X] T003 Add required dependencies: `bun add astro gsap @studio-freight/lenis`
- [X] T004 [P] Add dev dependencies: `bun add -d @biomejs/biome @astrojs/check typescript`
- [X] T005 [P] Update package.json with engines field: `"engines": { "bun": ">=1.0.0" }`
- [X] T006 [P] Update package.json scripts section with all required commands (dev, build, preview, lint, format, test, astro)
- [X] T007 Initialize Biome configuration using `bunx @biomejs/biome init`
- [X] T008 [P] Create astro.config.mjs with static output, site URL, base path, and compressHTML settings
- [X] T009 [P] Update tsconfig.json to extend Astro strict config and enable strict mode
- [X] T010 [P] Create directory structure: src/components/{layout,ui,islands}, src/layouts, src/styles, src/content, public/assets, tests/{unit,integration}
- [X] T011 [P] Create .github/workflows directory for GitHub Actions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T012 [P] Create src/layouts/BaseLayout.astro with HTML5 structure, meta tags, and slot for content
- [X] T013 [P] Create src/styles/global.css with CSS reset and base styles
- [X] T014 [P] Create public/robots.txt with sitemap reference and basic directives
- [X] T015 [P] Create public/favicon.svg with simple SVG icon
- [X] T016 [P] Update .gitignore to include node_modules/, dist/, .astro/, .env*, editor files, OS files
- [X] T017 Create .github/workflows/deploy.yml with GitHub Pages deployment workflow for Bun + Astro

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Initialize Project Structure (Priority: P1) 🎯 MVP

**Goal**: Set up a new project with Bun and Astro with all essential files and directories in place. Developer can initialize the project and have a working skeleton ready for development.

**Independent Test**: Run initialization process and verify all expected files/directories exist with correct configuration. Development server should start successfully and serve a default landing page.

**Acceptance Scenarios**:
1. All core directories (src, public, config) created with appropriate structure
2. Bun installs all required packages successfully without errors
3. Astro development server runs successfully and serves default landing page
4. Configuration files (package.json, astro.config.mjs, tsconfig.json) present and properly configured

### Implementation for User Story 1

- [X] T018 [P] [US1] Create src/pages/index.astro homepage with BaseLayout import and welcome content
- [X] T019 [P] [US1] Update BaseLayout.astro to import global.css in head section
- [X] T020 [US1] Validate package.json structure against contracts/package-json.schema.json
- [X] T021 [US1] Validate astro.config.mjs structure against contracts/astro-config.schema.ts
- [X] T022 [US1] Run `bun install` and verify all dependencies install without errors
- [X] T023 [US1] Run `bun run dev` and verify development server starts on port 4321
- [X] T024 [US1] Verify homepage loads at http://localhost:4321 with welcome content
- [X] T025 [US1] Create README.md with project description, setup instructions, and command reference

**Checkpoint**: At this point, User Story 1 should be fully functional - project initializes successfully with working dev server

---

## Phase 4: User Story 2 - Verify Development Environment (Priority: P2)

**Goal**: Verify that the initialized project works correctly and is ready for feature development. Developer can run standard development commands and see expected outputs.

**Independent Test**: Run development server, build project, and execute linting/formatting tools. Verify hot module replacement works and build completes successfully.

**Acceptance Scenarios**:
1. Development server starts and hot module replacement works with changes reflected immediately
2. Source file modifications trigger browser auto-refresh
3. Production build completes successfully and generates optimized output
4. Linting and formatting tools execute without configuration errors

### Implementation for User Story 2

- [X] T026 [P] [US2] Test hot module replacement by modifying src/pages/index.astro and verifying browser auto-refresh
- [X] T027 [P] [US2] Run `bun run lint` and verify Biome linting executes without errors
- [X] T028 [P] [US2] Run `bun run format` and verify Biome formatting executes without errors
- [X] T029 [US2] Run `bun run build` (includes astro check) and verify TypeScript type checking passes
- [X] T030 [US2] Verify build output in dist/ directory with optimized HTML, CSS, and assets
- [X] T031 [US2] Run `bun run preview` and verify production build serves correctly
- [X] T032 [US2] Validate build performance: build time <30s for initial build
- [X] T033 [US2] Validate page performance: HTML <50KB, CSS <100KB, total page load <500KB (uncompressed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - project initializes and all development commands execute successfully

---

## Phase 5: User Story 3 - Extend Project Structure (Priority: P3)

**Goal**: Ensure the minimal structure is extensible and provides clear patterns for where different types of files belong (components, pages, layouts, utilities). Developer can add new features without confusion.

**Independent Test**: Add sample components, pages, and utilities following the established structure and verify they work correctly. Proves the structure supports growth.

**Acceptance Scenarios**:
1. New page added to pages/ directory is recognized and served by Astro routing
2. Shared components can be imported and used across multiple pages
3. Assets added to public/ directory are accessible and correctly served
4. Project-specific utilities have a clear location following established patterns

### Implementation for User Story 3

- [X] T034 [P] [US3] Create sample component in src/components/ui/Button.astro demonstrating component structure
- [X] T035 [P] [US3] Create sample layout component in src/components/layout/Header.astro demonstrating layout patterns
- [X] T036 [P] [US3] Create second page in src/pages/about.astro to demonstrate routing
- [X] T037 [US3] Import and use Button component in src/pages/index.astro to demonstrate component reuse
- [X] T038 [US3] Import and use Header component in BaseLayout.astro to demonstrate layout composition
- [X] T039 [US3] Add sample image to public/assets/ and reference in src/pages/index.astro to demonstrate asset serving
- [X] T040 [US3] Create src/content/config.ts with empty content collection schema to demonstrate content structure pattern
- [X] T041 [US3] Verify /about page is accessible and renders correctly
- [X] T042 [US3] Verify component imports work across multiple pages without errors
- [X] T043 [US3] Update README.md with directory structure explanation and extension patterns

**Checkpoint**: All user stories should now be independently functional - project is ready for feature development

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validations that affect the entire project

- [X] T044 [P] Run full validation checklist from quickstart.md (Bun version, dependency install, lint, build, dev server, preview)
- [ ] T045 [P] Validate constitutional compliance: Lighthouse Performance ≥95, Core Web Vitals targets, 0KB JavaScript initial load
- [X] T046 [P] Verify all package.json scripts execute successfully: dev, build, preview, lint, format, test
- [ ] T047 [P] Validate GitHub Actions workflow syntax and permissions using `gh workflow view deploy.yml`
- [X] T048 [P] Add example Bun test file in tests/unit/example.test.ts demonstrating test structure
- [X] T049 [P] Run `bun test` and verify test runner executes successfully
- [ ] T050 Update README.md with troubleshooting section and next steps for feature development
- [X] T051 Create CONTRIBUTING.md with development workflow and code standards
- [X] T052 Verify all configuration contracts are satisfied (package.json, astro.config.mjs schemas)
- [X] T053 Final build verification: `bun run build && bun run preview` completes successfully with no errors
- [ ] T054 Document all technology decisions from research.md in README.md references section

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
  - Tasks T001-T011 initialize project structure and configuration

- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - Tasks T012-T017 create base layouts, styles, and deployment configuration
  - **CRITICAL**: Phase 2 MUST complete before ANY user story work begins

- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - **User Story 1 (P1)**: Tasks T018-T025 - Can start after Foundational
  - **User Story 2 (P2)**: Tasks T026-T033 - Can start after User Story 1 completes
  - **User Story 3 (P3)**: Tasks T034-T043 - Can start after User Story 2 completes

- **Polish (Phase 6)**: Tasks T044-T054 - Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - initializes project structure
- **User Story 2 (P2)**: Depends on User Story 1 (needs working project to verify development environment)
- **User Story 3 (P3)**: Depends on User Story 2 (needs verified environment to test extensibility)

### Within Each User Story

**User Story 1 (Initialize Project Structure)**:
- T018-T019 (create pages and layouts) can run in parallel [P]
- T020-T021 (validate configurations) can run in parallel, must wait for T005-T009
- T022 (install dependencies) must complete before T023 (dev server)
- T023-T024 (dev server and verification) are sequential
- T025 (README) can run in parallel with T023-T024

**User Story 2 (Verify Development Environment)**:
- T026-T028 (HMR, lint, format tests) can run in parallel [P]
- T029-T031 (build, dist verification, preview) are sequential
- T032-T033 (performance validation) can run in parallel with T031

**User Story 3 (Extend Project Structure)**:
- T034-T036 (create sample components and pages) can run in parallel [P]
- T037-T039 (use components and assets) must wait for T034-T036
- T040 (content config) can run in parallel with T034-T036 [P]
- T041-T042 (verification) are sequential, depend on T037-T039
- T043 (README update) can run anytime after T034-T040

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T004 (dev dependencies) || T003 (production dependencies)
- T005-T006 (package.json updates) || T007 (Biome init) || T008 (Astro config) || T009 (tsconfig)
- T010-T011 (directory creation) can run together

**Foundational Phase (Phase 2)**:
- ALL tasks T012-T017 can run in parallel [P] - different files, no dependencies

**User Story 1**:
- T018 (index page) || T019 (BaseLayout update) || T025 (README)
- T020 (package.json validation) || T021 (astro config validation)

**User Story 2**:
- T026 (HMR test) || T027 (lint) || T028 (format)
- T032 (build performance) || T033 (page performance)

**User Story 3**:
- T034 (Button) || T035 (Header) || T036 (about page) || T040 (content config)

**Polish Phase**:
- T044 (quickstart validation) || T045 (constitutional compliance) || T046 (script validation) || T047 (workflow validation) || T048-T049 (test setup)

---

## Parallel Example: User Story 1

```bash
# After Foundational Phase completes, launch these User Story 1 tasks in parallel:

# Parallel batch 1 - Create core pages and documentation:
Task T018: "Create src/pages/index.astro homepage with BaseLayout import and welcome content"
Task T019: "Update BaseLayout.astro to import global.css in head section"
Task T025: "Create README.md with project description, setup instructions, and command reference"

# Wait for T005-T009 from Setup Phase, then parallel batch 2 - Validate configurations:
Task T020: "Validate package.json structure against contracts/package-json.schema.json"
Task T021: "Validate astro.config.mjs structure against contracts/astro-config.schema.ts"

# Sequential after T022 completes:
Task T022: "Run bun install and verify all dependencies install without errors"
Task T023: "Run bun run dev and verify development server starts on port 4321"
Task T024: "Verify homepage loads at http://localhost:4321 with welcome content"
```

---

## Parallel Example: User Story 2

```bash
# After User Story 1 completes, launch these User Story 2 tasks in parallel:

# Parallel batch 1 - Development environment tests:
Task T026: "Test hot module replacement by modifying src/pages/index.astro and verifying browser auto-refresh"
Task T027: "Run bun run lint and verify Biome linting executes without errors"
Task T028: "Run bun run format and verify Biome formatting executes without errors"

# Sequential build verification:
Task T029: "Run bun run build (includes astro check) and verify TypeScript type checking passes"
Task T030: "Verify build output in dist/ directory with optimized HTML, CSS, and assets"
Task T031: "Run bun run preview and verify production build serves correctly"

# Parallel batch 2 - Performance validation (can run during T031):
Task T032: "Validate build performance: build time <30s for initial build"
Task T033: "Validate page performance: HTML <50KB, CSS <100KB, total page load <500KB"
```

---

## Parallel Example: User Story 3

```bash
# After User Story 2 completes, launch these User Story 3 tasks in parallel:

# Parallel batch 1 - Create sample components and pages:
Task T034: "Create sample component in src/components/ui/Button.astro demonstrating component structure"
Task T035: "Create sample layout component in src/components/layout/Header.astro demonstrating layout patterns"
Task T036: "Create second page in src/pages/about.astro to demonstrate routing"
Task T040: "Create src/content/config.ts with empty content collection schema"

# Sequential after batch 1 - Use components:
Task T037: "Import and use Button component in src/pages/index.astro to demonstrate component reuse"
Task T038: "Import and use Header component in BaseLayout.astro to demonstrate layout composition"
Task T039: "Add sample image to public/assets/ and reference in src/pages/index.astro"

# Sequential verification:
Task T041: "Verify /about page is accessible and renders correctly"
Task T042: "Verify component imports work across multiple pages without errors"

# Can run anytime after batch 1:
Task T043: "Update README.md with directory structure explanation and extension patterns"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup (T001-T011) - ~5-7 minutes
2. ✅ Complete Phase 2: Foundational (T012-T017) - ~3-5 minutes
3. ✅ Complete Phase 3: User Story 1 (T018-T025) - ~5-8 minutes
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Verify: Project initializes, dev server runs, homepage loads
   - Total time: ~15-20 minutes for complete initialization
5. Ready for feature development

### Incremental Delivery

1. **Foundation** (Setup + Foundational) → ~10 minutes
   - Result: Project structure exists with all config files

2. **+ User Story 1** (Initialize Project Structure) → ~5-8 minutes
   - Result: **MVP Complete!** Working project with dev server
   - Deliverable: Developer can start building features

3. **+ User Story 2** (Verify Development Environment) → ~10-15 minutes
   - Result: All development tools verified and working
   - Deliverable: Production-ready development environment

4. **+ User Story 3** (Extend Project Structure) → ~10-15 minutes
   - Result: Extensibility patterns demonstrated
   - Deliverable: Clear guidance for adding components, pages, assets

5. **+ Polish** (Final validation) → ~10-15 minutes
   - Result: Full constitutional compliance validated
   - Deliverable: Production-ready portfolio project

**Total Estimated Time**: 45-65 minutes for complete implementation
**MVP Time**: 15-20 minutes (User Story 1 only)

### Parallel Team Strategy

With multiple developers (or AI agents):

1. **Team completes Setup + Foundational together** (~10 min)

2. **Once Foundational is done, parallelize user stories**:
   - Developer A: User Story 1 (Initialize) - 5-8 min
   - Wait for US1, then Developer A: User Story 2 (Verify) - 10-15 min
   - Wait for US2, then Developer A: User Story 3 (Extend) - 10-15 min

3. **Or stagger for validation**:
   - Complete US1 → Test independently → Deploy/Demo
   - Complete US2 → Test independently → Validate tools
   - Complete US3 → Test independently → Document patterns

**Note**: User stories have sequential dependencies in this feature, so parallel execution provides limited time savings. Focus on parallel execution within each phase (marked with [P] tasks).

---

## Success Criteria Mapping

Each user story maps to specific success criteria from spec.md:

**User Story 1 (Initialize Project Structure)**:
- ✅ SC-001: Initialization completes in under 5 minutes
- ✅ SC-002: Dev server starts on first attempt without manual configuration
- ✅ SC-005: All config files pass validation checks
- ✅ SC-008: Essential development commands execute successfully

**User Story 2 (Verify Development Environment)**:
- ✅ SC-003: Dev server responds to file changes within 2 seconds
- ✅ SC-004: Production build completes successfully without errors
- ✅ SC-008: All development commands (dev, build, preview, test, lint) execute successfully

**User Story 3 (Extend Project Structure)**:
- ✅ SC-006: Structure accommodates 10+ pages and 20+ components without reorganization
- ✅ SC-007: Documentation is clear enough for independent setup within 10 minutes

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Sequential dependencies**: User Stories have dependencies (US2 depends on US1, US3 depends on US2)
- **Independent testing**: Each user story delivers independently testable value
- **No test tasks**: Tests not explicitly requested in spec - focus on initialization and validation
- **Commit strategy**: Commit after each phase completion for rollback capability
- **Validation checkpoints**: Stop at phase checkpoints to validate independently
- **Time estimates**: Based on quickstart.md estimates (5-10 min for experienced devs, 15-20 min for first-time setup)
- **Constitutional compliance**: All tasks align with project constitution v1.1.0 (Bun + Astro + GSAP standards)
