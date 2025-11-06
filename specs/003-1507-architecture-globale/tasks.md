# Tasks: Awwwards-Worthy Portfolio Architecture

**Feature**: `003-1507-architecture-globale`
**Generated**: 2025-11-06
**Input**: Design documents from `/specs/003-1507-architecture-globale/`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Tests**: Not requested in feature specification - tasks focus on implementation only.

## Format: `- [ ] [ID] [P?] [Story?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- All file paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and foundational structure

- [X] T001 Verify Bun ≥1.0.0, Astro ≥4.0.0, GSAP ≥3.13.0, Lenis ≥1.0.0 installed
- [X] T002 Configure Astro with static output and GitHub Pages base path in astro.config.mjs
- [X] T003 [P] Set up Content Collections configuration in src/content/config.ts with Zod schemas for projects and blog
- [X] T004 [P] Create directory structure: src/components/{layout,sections,islands,animations,ui}, src/data/, src/scripts/, public/images/{projects,og-images}
- [X] T005 [P] Configure Biome with TypeScript strict mode and import organization rules in biome.json
- [X] T006 [P] Create animation configuration file src/scripts/animation-config.ts with constants from contracts/animation-config.ts
- [X] T007 Create data files: src/data/navigation.ts (nav links), src/data/skills.json (skills matrix), src/data/pages.ts (page metadata)

**Checkpoint**: Project structure ready - foundational components can now be built

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create BaseLayout.astro in src/layouts/ with meta tags, Open Graph support, and SEO structure
- [X] T009 Create PageLayout.astro in src/layouts/ extending BaseLayout with header/footer slots
- [X] T010 [P] Create global animation utilities in src/scripts/gsap-config.ts (GSAP initialization, ScrollTrigger setup)
- [X] T011 [P] Create smooth scroll initialization in src/scripts/scroll-animations.ts using Lenis
- [X] T012 [P] Create accessibility helpers in src/scripts/accessibility.ts (prefers-reduced-motion, keyboard nav utilities)
- [X] T013 [P] Add global animation styles in src/styles/animations.css (GPU-accelerated transitions, reduced-motion queries)
- [X] T014 Create performance monitoring utility in src/scripts/performance.ts (FrameRateMonitor class from contracts)
- [X] T015 Create device detection utility in src/scripts/device-tier.ts (getDeviceTier, getTargetFPS, getNeuralNodeCount functions)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First Impression & Hero Interaction (Priority: P1) 🎯 MVP

**Goal**: Deliver visually striking hero section with neural network animation that loads in <3s and runs at 60fps (desktop) / 30fps (mobile)

**Independent Test**: Load homepage on desktop and mobile. Verify neural network animation plays smoothly, page reaches interactive state in <3s, and Lighthouse Performance score ≥ 90.

### Implementation for User Story 1

- [X] T016 [P] [US1] Create Node interface and NeuralNetworkAnimation class in src/scripts/neural-network.ts with Canvas 2D rendering
- [X] T017 [P] [US1] Implement canvas setup with high-DPI support and ResizeObserver in src/scripts/neural-network.ts
- [X] T018 [US1] Implement particle system with 50-100 nodes, connection detection, and pulse animation in src/scripts/neural-network.ts
- [X] T019 [US1] Integrate GSAP ScrollTrigger for lifecycle management (start/pause based on viewport) in src/scripts/neural-network.ts
- [X] T020 [US1] Add adaptive performance logic (device tier detection, FPS targeting, node count reduction) in src/scripts/neural-network.ts
- [X] T021 [US1] Add reduced motion support (static network with opacity pulses only) in src/scripts/neural-network.ts
- [X] T022 [US1] Create Hero.astro component in src/components/sections/ with canvas element, headline, subheadline, and CTA
- [X] T023 [US1] Add Hero component styles with responsive layout and canvas positioning in Hero.astro
- [X] T024 [US1] Initialize NeuralNetworkAnimation in Hero.astro client script with color configuration
- [X] T025 [US1] Update src/pages/index.astro to use Hero component with PageLayout wrapper
- [X] T026 [US1] Add homepage metadata to src/data/pages.ts (title, description, OG image)
- [X] T027 [US1] Optimize canvas performance: implement off-screen caching and spatial partitioning if needed

**Checkpoint**: User Story 1 complete - Homepage with neural network hero is fully functional and testable independently

---

## Phase 4: User Story 2 - Navigation Discovery & Exploration (Priority: P1)

**Goal**: Functional magnetic burger menu with neural pathway link animations, accessible via keyboard and screen readers

**Independent Test**: Open burger menu on any page. Verify magnetic effect responds to cursor proximity, neural pathway animations play, and links navigate to correct routes. Keyboard users can tab through links.

### Implementation for User Story 2

- [X] T028 [P] [US2] Create magnetic effect utility in src/scripts/magnetic-menu.ts using GSAP quickTo() with proximity detection
- [X] T029 [P] [US2] Implement distance calculation, threshold checking, and falloff calculation in src/scripts/magnetic-menu.ts
- [X] T030 [US2] Add reduced motion check and cleanup function in src/scripts/magnetic-menu.ts
- [X] T031 [P] [US2] Create BurgerMenu.astro component in src/components/layout/ with button and nav elements
- [X] T032 [US2] Add BurgerMenu styles: button layout, burger lines, full-screen overlay menu in BurgerMenu.astro
- [X] T033 [US2] Implement menu toggle logic with ARIA attributes (aria-expanded, hidden state) in BurgerMenu.astro client script
- [X] T034 [US2] Initialize magnetic effect on burger button in BurgerMenu.astro client script
- [X] T035 [P] [US2] Create NeuralPathwayLinks.tsx island component in src/components/islands/ for link hover animations
- [X] T036 [US2] Implement SVG/Canvas pathway rendering with animated nodes in NeuralPathwayLinks.tsx
- [X] T037 [US2] Add neural pathway animations to menu links with GSAP in NeuralPathwayLinks.tsx
- [X] T038 [US2] Integrate BurgerMenu component into PageLayout.astro header
- [X] T039 [US2] Add keyboard navigation support (Tab, Arrow keys, Enter, Escape) in BurgerMenu.astro
- [X] T040 [US2] Test screen reader compatibility with NVDA/VoiceOver

**Checkpoint**: User Story 2 complete - Navigation menu is fully functional, accessible, and visually engaging

---

## Phase 5: User Story 3 - Projects Showcase Browsing (Priority: P2)

**Goal**: Hexagonal grid layout displaying projects with hover/tap interactions and lazy loading

**Independent Test**: Navigate to `/projects` route. Verify hexagonal grid renders with at least 3-6 project tiles. Hover/click interactions reveal project metadata. Grid adapts responsively on mobile.

### Implementation for User Story 3

- [X] T041 [P] [US3] Create sample project markdown files in src/content/projects/ (at least 6 projects for grid testing)
- [X] T042 [P] [US3] Add project preview images to public/images/projects/ (optimized WebP format)
- [X] T043 [US3] Create ProjectsHexGrid.astro component in src/components/sections/ with hexagonal grid CSS
- [X] T044 [US3] Implement CSS hexagon shape using clip-path polygon in ProjectsHexGrid.astro styles
- [X] T045 [US3] Implement float + shape-outside layout technique for automatic row offsetting in ProjectsHexGrid.astro styles
- [X] T046 [US3] Add responsive hexagon sizing with CSS clamp() for mobile/tablet/desktop in ProjectsHexGrid.astro styles
- [X] T047 [US3] Implement GPU-accelerated hover effect (scale 1.08, z-index change) in ProjectsHexGrid.astro styles
- [X] T048 [US3] Create hexagon overlay component for project metadata (title, description, tech stack) in ProjectsHexGrid.astro
- [X] T049 [US3] Add touch interaction support (tap to reveal overlay on mobile) in ProjectsHexGrid.astro styles
- [X] T050 [US3] Implement lazy loading for projects beyond initial 12 using Intersection Observer in ProjectsHexGrid.astro client script
- [X] T051 [US3] Create src/pages/projects/index.astro with ProjectsHexGrid component and page metadata
- [X] T052 [US3] Create src/pages/projects/[slug].astro for individual project detail pages
- [X] T053 [US3] Add fallback layout for very small screens (<375px) - rounded cards instead of hexagons in ProjectsHexGrid.astro styles
- [X] T054 [US3] Add GSAP entrance animations for hexagons (stagger, fade-in, scale) in ProjectsHexGrid.astro client script

**Checkpoint**: User Story 3 complete - Projects page displays hexagonal grid with all interactions working

---

## Phase 6: User Story 4 - About & Expertise Discovery (Priority: P2)

**Goal**: About page with IDE-style theme and Expertise page with skills matrix layout

**Independent Test**: Navigate to `/about` and `/expertise` routes. Verify IDE theme in About and matrix/grid theme in Expertise. Content is readable, responsive, and visually consistent.

### Implementation for User Story 4

- [X] T055 [P] [US4] Create AboutIDE.astro component in src/components/sections/ with IDE-style layout (line numbers, syntax highlighting theme, terminal elements)
- [X] T056 [P] [US4] Add IDE theme styles: monospace fonts, code editor colors, line number gutter in AboutIDE.astro styles
- [X] T057 [US4] Add biography content with code-style formatting in AboutIDE.astro
- [X] T058 [US4] Create src/pages/about.astro with AboutIDE component and page metadata
- [X] T059 [P] [US4] Populate src/data/skills.json with skill data (categories, proficiency levels, years of experience)
- [X] T060 [P] [US4] Create ExpertiseMatrix.astro component in src/components/sections/ with matrix/grid layout
- [X] T061 [US4] Implement skill grid with category headers and proficiency indicators in ExpertiseMatrix.astro
- [X] T062 [US4] Add hover tooltips showing additional skill details (projects, experience) in ExpertiseMatrix.astro
- [X] T063 [US4] Add responsive layout: matrix on desktop, stacked list on mobile in ExpertiseMatrix.astro styles
- [X] T064 [US4] Create src/pages/expertise.astro with ExpertiseMatrix component and page metadata
- [X] T065 [US4] Add scroll animations for skill categories (fade-in with stagger) using GSAP ScrollTrigger in ExpertiseMatrix.astro client script

**Checkpoint**: User Story 4 complete - About and Expertise pages are visually distinctive and fully functional

---

## Phase 7: User Story 5 - Blog Browsing & Reading (Priority: P3)

**Goal**: Blog page with Git commit-style post list and individual post detail pages

**Independent Test**: Navigate to `/blog` route. Verify commit-style post list renders with timestamps and titles. Clicking a post navigates to detail view. Timeline aesthetic is recognizable.

### Implementation for User Story 5

- [X] T066 [P] [US5] Create sample blog post markdown files in src/content/blog/ (at least 5 posts for testing)
- [X] T067 [P] [US5] Generate 7-character commit hashes for each blog post frontmatter
- [X] T068 [US5] Create BlogCommits.astro component in src/components/sections/ with commit log styling
- [X] T069 [US5] Implement commit-style list layout: hash, timestamp, title (message), author in BlogCommits.astro
- [X] T070 [US5] Add Git log aesthetic: monospace font, commit colors, timeline line in BlogCommits.astro styles
- [X] T071 [US5] Implement post filtering by tag with interactive tag buttons in BlogCommits.astro
- [X] T072 [US5] Add lazy loading for posts beyond initial 10 using Intersection Observer in BlogCommits.astro client script
- [X] T073 [US5] Create src/pages/blog/index.astro with BlogCommits component and page metadata
- [X] T074 [US5] Create src/pages/blog/[slug].astro for individual blog post detail pages
- [X] T075 [US5] Add blog post detail page styles: readable typography, code block styling, image captions in blog/[slug].astro
- [X] T076 [US5] Add reading time calculation utility in src/utils/reading-time.ts
- [X] T077 [US5] Display reading time and metadata in blog post detail pages

**Checkpoint**: User Story 5 complete - Blog section is fully functional with distinctive commit-style aesthetic

---

## Phase 8: User Story 6 - Contact Initiation (Priority: P2)

**Goal**: Contact page with protocol/terminal theme and functional form submission

**Independent Test**: Navigate to `/contact` route. Verify protocol/terminal theme is visually recognizable. Form submission sends data successfully or displays confirmation. Alternative contact links work correctly.

### Implementation for User Story 6

- [X] T078 [P] [US6] Create ContactProtocol.astro component in src/components/sections/ with terminal-style form layout
- [X] T079 [US6] Add protocol/terminal theme styles: monospace font, terminal colors, command prompt aesthetic in ContactProtocol.astro styles
- [X] T080 [US6] Implement contact form with name, email, message fields and honeypot spam protection in ContactProtocol.astro
- [X] T081 [US6] Add client-side form validation using Zod schema in ContactProtocol.astro client script
- [X] T082 [US6] Implement form submission to Formspree or Netlify Forms endpoint in ContactProtocol.astro client script
- [X] T083 [US6] Add terminal-style success message (e.g., "Message sent [200 OK]") in ContactProtocol.astro
- [X] T084 [US6] Add terminal-style error message (e.g., "Error [400 Bad Request]") in ContactProtocol.astro
- [X] T085 [US6] Add alternative contact methods section (email, GitHub, LinkedIn) with icons in ContactProtocol.astro
- [X] T086 [US6] Create src/pages/contact.astro with ContactProtocol component and page metadata
- [X] T087 [US6] Add form loading state with animated terminal cursor in ContactProtocol.astro styles
- [X] T088 [US6] Test form submission flow end-to-end with real Formspree/Netlify endpoint

**Checkpoint**: User Story 6 complete - Contact page is functional with distinctive protocol/terminal aesthetic

---

## Phase 9: User Story 7 - Error Handling & Creative 404 (Priority: P3)

**Goal**: Custom 404 page that maintains portfolio visual identity and provides clear navigation

**Independent Test**: Navigate to a non-existent route (e.g., `/nonexistent`). Verify custom 404 page renders with creative design. Links back to homepage or main sections work correctly.

### Implementation for User Story 7

- [X] T089 [US7] Create 404.astro page in src/pages/ with creative error message
- [X] T090 [US7] Design 404 page with portfolio-consistent visual theme (neural network background, terminal error message, or hexagonal broken grid)
- [X] T091 [US7] Add navigation links back to main sections (Home, Projects, Contact) in 404.astro
- [X] T092 [US7] Add subtle animation or interactive element (optional, budget permitting) in 404.astro
- [X] T093 [US7] Add 404 page metadata with noindex directive in 404.astro
- [X] T094 [US7] Test 404 page rendering on development and production builds

**Checkpoint**: User Story 7 complete - Custom 404 page provides polished error experience

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final optimization

- [X] T095 [P] Add missing alt text and ARIA labels across all components for WCAG 2.1 AA compliance
- [X] T096 [P] Verify all color combinations meet 4.5:1 contrast ratio using existing palette system
- [X] T097 [P] Test keyboard navigation flow across all pages and interactive elements
- [X] T098 [P] Test with screen readers (NVDA on Windows, VoiceOver on macOS) for announcement correctness
- [X] T099 Run Lighthouse audits on all pages: target Performance ≥95, Accessibility ≥95, SEO ≥95
- [X] T100 [P] Optimize images: convert to WebP, add responsive srcset, implement lazy loading
- [X] T101 [P] Add Open Graph images for all pages in public/images/og-images/
- [X] T102 Profile neural network animation performance using Chrome DevTools: verify 60fps desktop, 30fps mobile
- [X] T103 Test on throttled CPU (4x slowdown) to simulate low-end devices and verify graceful degradation
- [X] T104 [P] Update CLAUDE.md with architecture patterns and animation guidelines from this feature
- [X] T105 [P] Run build command and verify no TypeScript errors, no console warnings
- [X] T106 Test responsive layouts on physical devices: iPhone (375px), iPad (768px), desktop (1920px)
- [X] T107 Verify all links work correctly in production build (no 404s, no broken routes)
- [X] T108 Add sitemap.xml and robots.txt configuration in Astro config
- [X] T109 Test smooth scroll behavior with Lenis across all pages
- [X] T110 Run quickstart.md validation: verify all example code works as documented

**Checkpoint**: All polish tasks complete - portfolio is production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) after Phase 2
  - Or sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P2) → US6 (P2) → US4 (P2) → US5 (P3) → US7 (P3)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Hero)**: No dependencies on other stories - Can start after Foundational
- **User Story 2 (P1 - Navigation)**: No dependencies on other stories - Can start after Foundational
- **User Story 3 (P2 - Projects)**: No dependencies on other stories - Can start after Foundational
- **User Story 4 (P2 - About/Expertise)**: No dependencies on other stories - Can start after Foundational
- **User Story 5 (P3 - Blog)**: No dependencies on other stories - Can start after Foundational
- **User Story 6 (P2 - Contact)**: No dependencies on other stories - Can start after Foundational
- **User Story 7 (P3 - 404)**: No dependencies on other stories - Can start after Foundational

**Note**: All user stories are designed to be independently implementable and testable

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no blocking dependencies)
- Sequential tasks within a story follow logical implementation order (utilities → components → pages → integration)
- Complete all tasks in a story before marking the story as done

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T003, T004, T005, T006 can all run in parallel (different files)

**Foundational Phase (Phase 2)**:
- T010, T011, T012, T013 can all run in parallel (different files)

**User Story 1 (Hero)**:
- T016, T017 can run in parallel (different files)

**User Story 2 (Navigation)**:
- T028, T029, T030 can run in parallel (same file but different functions)
- T031, T035 can run in parallel (different components)

**User Story 3 (Projects)**:
- T041, T042 can run in parallel (content creation)

**User Story 4 (About/Expertise)**:
- T055, T056, T057 can run in parallel (About component parts)
- T059, T060 can run in parallel (different files)

**User Story 5 (Blog)**:
- T066, T067 can run in parallel (content creation)

**User Story 6 (Contact)**:
- T078, T079 can run in parallel (component creation and styling)

**Polish Phase (Phase 10)**:
- T095, T096, T097, T098 can all run in parallel (different validation tasks)
- T100, T101, T104, T105 can all run in parallel (different files)

### Parallel Example: Multiple User Stories

Once Foundational phase (Phase 2) is complete, if you have multiple developers:

```bash
# Developer A works on User Story 1 (Hero)
Task T016-T027

# Developer B works on User Story 2 (Navigation)
Task T028-T040

# Developer C works on User Story 3 (Projects)
Task T041-T054

# All three stories can be developed in parallel
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

**Recommended for fastest value delivery:**

1. ✅ Complete Phase 1: Setup (T001-T007)
2. ✅ Complete Phase 2: Foundational (T008-T015) - CRITICAL BLOCKING PHASE
3. ✅ Complete Phase 3: User Story 1 - Hero (T016-T027)
4. ✅ Complete Phase 4: User Story 2 - Navigation (T028-T040)
5. **STOP and VALIDATE**: Test homepage with hero animation and navigation menu
6. Run Lighthouse audits, test on devices, verify <3s load time
7. Deploy to staging/production for demo

**Why this MVP**: User Stories 1 and 2 deliver the core "Awwwards-worthy" experience:
- Visually striking hero with neural network animation (wow factor)
- Functional navigation to explore the site (essential UX)
- Demonstrates performance and animation capabilities
- Can be demoed even without content pages

### Incremental Delivery (Recommended)

**Add value iteratively:**

1. ✅ Foundation (Phase 1 + 2) → Test infrastructure
2. ✅ MVP (US1 + US2) → Deploy homepage with hero and navigation
3. ✅ Add US3 (Projects) → Deploy projects showcase
4. ✅ Add US6 (Contact) → Deploy contact form (enables conversions)
5. ✅ Add US4 (About/Expertise) → Deploy personal branding pages
6. ✅ Add US5 (Blog) → Deploy content marketing
7. ✅ Add US7 (404) → Polish error handling
8. ✅ Polish (Phase 10) → Final optimization and deployment

**Benefits**:
- Each phase adds testable value
- Early feedback on hero animation and navigation
- Prioritizes high-impact features (hero, projects, contact)
- Blog and 404 are nice-to-haves added last

### Parallel Team Strategy

**With 3+ developers:**

1. **Week 1**: All developers collaborate on Foundation (Phase 1 + 2)
2. **Week 2**: Once Foundational is complete:
   - Developer A: User Story 1 (Hero)
   - Developer B: User Story 2 (Navigation)
   - Developer C: User Story 3 (Projects)
3. **Week 3**:
   - Developer A: User Story 4 (About/Expertise)
   - Developer B: User Story 6 (Contact)
   - Developer C: User Story 5 (Blog)
4. **Week 4**:
   - Developer A: User Story 7 (404)
   - Developer B: Polish (Accessibility)
   - Developer C: Polish (Performance optimization)

**Benefits**:
- Maximizes parallel work after foundation is laid
- Each developer owns complete user stories (better context)
- Stories integrate independently (minimal merge conflicts)

---

## Notes

- **[P] markers**: Tasks in different files with no blocking dependencies
- **[Story] labels**: Maps task to specific user story for traceability
- **No tests included**: Feature specification did not request test tasks
- **Performance targets**: Lighthouse 95-100, TTI <3s, 60fps animations (desktop)
- **Bundle budgets**: Neural network ~8KB, Magnetic menu ~2KB, Total animations ~66KB of 200KB JS budget
- **Accessibility**: All tasks must respect `prefers-reduced-motion`, keyboard navigation, and WCAG 2.1 AA
- **Content**: Sample content required for testing (at least 6 projects, 5 blog posts)
- **Commit strategy**: Commit after completing each user story phase, not individual tasks
- **Verification**: Use quickstart.md (specs/003-1507-architecture-globale/quickstart.md) for implementation guidance

---

## Success Metrics

After completing all phases, verify:

- ✅ Lighthouse Performance: 95-100 (desktop), 90-95 (mobile)
- ✅ Time to Interactive: <3 seconds on 4G
- ✅ Neural network animation: 60fps (desktop), 30fps (mobile)
- ✅ All interactive elements respond within 100ms
- ✅ Keyboard navigation works for all elements
- ✅ Screen readers announce all content correctly
- ✅ WCAG 2.1 AA contrast ratios maintained (4.5:1)
- ✅ Zero console errors on page load
- ✅ Build completes in <30 seconds
- ✅ All 7 pages functional and navigable

---

**Total Tasks**: 110
- Setup: 7 tasks
- Foundational: 8 tasks
- User Story 1 (Hero): 12 tasks
- User Story 2 (Navigation): 13 tasks
- User Story 3 (Projects): 14 tasks
- User Story 4 (About/Expertise): 11 tasks
- User Story 5 (Blog): 12 tasks
- User Story 6 (Contact): 11 tasks
- User Story 7 (404): 6 tasks
- Polish: 16 tasks

**Parallel Opportunities**: 32 tasks marked [P] can run in parallel within their phases

**MVP Scope**: 27 tasks (Setup + Foundational + US1 + US2)

**Estimated Timeline**:
- Solo developer: 4-6 weeks (sequential, priority order)
- Team of 3: 2-3 weeks (parallel after foundation)
- MVP only: 1-2 weeks

---

For implementation guidance, see:
- **Quickstart Guide**: `/specs/003-1507-architecture-globale/quickstart.md`
- **Component Interfaces**: `/specs/003-1507-architecture-globale/contracts/component-interfaces.ts`
- **Animation Config**: `/specs/003-1507-architecture-globale/contracts/animation-config.ts`
- **Data Model**: `/specs/003-1507-architecture-globale/data-model.md`
- **Research Decisions**: `/specs/003-1507-architecture-globale/research.md`
