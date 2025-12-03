# Feature Specification: Animation Cleanup and Optimization

**Feature Branch**: `PBF-18-fix-the-site`
**Created**: 2025-12-03
**Status**: Draft
**Input**: User description: "Fix animation timing issues where content displays before animations start, remove hero background animation (neural network) which doesn't add value, remove custom cursor animation which isn't working well, clean up for a solid foundation."

## Auto-Resolved Decisions *(mandatory when clarification policies apply)*

- **Decision**: Remove neural network background animation entirely rather than fixing timing
- **Policy Applied**: AUTO → PRAGMATIC (user explicitly stated "pas sur de la plus value" / "faut peut etre l'enlever")
- **Confidence**: High (0.9) - User explicitly questioned the value and suggested removal
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Loses visual differentiation of hero section, but gains cleaner foundation and better performance
  2. Faster implementation than fixing animation timing issues
- **Reviewer Notes**: User can re-add a background animation in a future iteration once core animations are stable

---

- **Decision**: Remove custom cursor animation entirely rather than improving it
- **Policy Applied**: AUTO → PRAGMATIC (user explicitly stated "l'animation du cursor ce n'est pas ouf")
- **Confidence**: High (0.9) - User explicitly expressed dissatisfaction and context suggests cleanup
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Loses branded cursor experience, but gains simplicity and native cursor reliability
  2. Removes performance overhead and complexity
- **Reviewer Notes**: Custom cursor can be reimplemented later with a better design if desired

---

- **Decision**: Keep text split animations but fix initialization timing
- **Policy Applied**: AUTO → CONSERVATIVE (text animations provide value but have timing bugs)
- **Confidence**: Medium (0.6) - User mentioned "content shows then animation starts" as a problem to fix
- **Fallback Triggered?**: Yes - promoted to CONSERVATIVE because this is core UX functionality
- **Trade-offs**:
  1. Requires investigation and fix rather than simple removal
  2. Maintains intended reveal effect for headlines
- **Reviewer Notes**: Text animations are a documented feature (012-1516) worth preserving; only fix timing

---

- **Decision**: Keep smooth scroll disabled (current state)
- **Policy Applied**: AUTO → PRAGMATIC (already disabled for performance debugging per codebase comments)
- **Confidence**: High (0.9) - Code comments indicate this was a deliberate decision
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Native scroll behavior is reliable and performant
  2. Can be re-enabled later once site stability is confirmed
- **Reviewer Notes**: Smooth scroll was disabled in performance optimization work (011-1522); keep disabled for now

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Page Load Experience (Priority: P1)

A visitor navigates to the portfolio homepage and expects content to appear smoothly without jarring visual glitches where text appears, disappears, then animates.

**Why this priority**: This is the first impression of the site. Currently broken animation timing damages professional perception.

**Independent Test**: Can be tested by loading the homepage and observing that text content either appears instantly (reduced motion) or animates in from hidden state without flicker.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page finishes loading, **Then** hero headline and subheadline either animate in smoothly from hidden state OR appear instantly if reduced motion is preferred
2. **Given** a visitor loads the homepage, **When** viewing the hero section, **Then** no content flickers, disappears, or re-renders during the first 3 seconds
3. **Given** a visitor with `prefers-reduced-motion: reduce` setting, **When** loading the page, **Then** all content appears immediately without any animation delay

---

### User Story 2 - Clean Hero Section (Priority: P2)

A visitor views the hero section without distracting background animations that don't add clear value.

**Why this priority**: The neural network animation was questioned for value and may distract from content. Removing it simplifies the visual hierarchy.

**Independent Test**: Can be tested by loading the homepage and confirming the hero section has a clean background without animated canvas elements.

**Acceptance Scenarios**:

1. **Given** a visitor views the hero section, **When** observing the background, **Then** there is no animated neural network or particle system visible
2. **Given** a visitor views the hero section, **When** inspecting the page, **Then** no canvas element exists in the hero section
3. **Given** the site loads on any device tier, **When** measuring performance, **Then** no JavaScript resources are loaded for neural network animation

---

### User Story 3 - Native Cursor Behavior (Priority: P3)

A visitor interacts with the site using their system's native cursor without custom cursor overlays.

**Why this priority**: The custom cursor was deemed "not great" and adds complexity. Native cursor is familiar and reliable.

**Independent Test**: Can be tested by moving the mouse across the page and confirming only the native system cursor appears.

**Acceptance Scenarios**:

1. **Given** a visitor uses a mouse on desktop, **When** moving the cursor across the page, **Then** only the native system cursor appears (no custom circle cursor)
2. **Given** a visitor hovers over links and buttons, **When** interacting, **Then** the native cursor changes to pointer as expected without additional visual effects
3. **Given** the site loads, **When** inspecting loaded scripts, **Then** no custom cursor JavaScript is executed

---

### Edge Cases

- What happens when JavaScript fails to load? Content should be visible without animations.
- How does the site behave with slow network connections? No animation timing race conditions should occur.
- What happens on devices with reduced motion preferences? All content appears instantly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT load or initialize neural network canvas animation in the hero section
- **FR-002**: System MUST NOT load or initialize custom cursor animation or related scripts
- **FR-003**: System MUST ensure hero content (headline, subheadline) is either hidden until animation starts OR visible immediately without animation
- **FR-004**: System MUST NOT show content that then disappears and re-appears during animation initialization
- **FR-005**: Text split animations MUST have proper initial hidden state before viewport trigger
- **FR-006**: System MUST respect `prefers-reduced-motion` preference by showing content instantly
- **FR-007**: System MUST function correctly when JavaScript is disabled (content visible via CSS)
- **FR-008**: System MUST remove all unused animation code files and component references
- **FR-009**: Build process MUST complete without errors after animation removal

### Key Entities *(include if feature involves data)*

- **Animation Scripts**: TypeScript files controlling animation behavior (to be removed: neural-network.ts, custom-cursor.ts)
- **Animation Components**: Astro components rendering animation markup (to be removed: CustomCursor.astro, canvas elements)
- **CSS Animation Classes**: Styles controlling animation states (to be reviewed for proper initial states)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page load shows no visible content flicker or re-rendering in the hero section (0 flicker occurrences)
- **SC-002**: Hero section renders without any canvas element or neural network animation
- **SC-003**: Native system cursor is the only cursor visible throughout the site
- **SC-004**: Reduced motion users see all content immediately upon page load (no delayed reveals)
- **SC-005**: Site functions correctly with JavaScript disabled (graceful degradation)
- **SC-006**: No console errors related to removed animation features
- **SC-007**: All existing text split animations work correctly when triggered (for users without reduced motion preference)
