# Feature Specification: Hero Section Redesign

**Feature Branch**: `PBF-30-hero-section`
**Created**: 2025-12-19
**Status**: Draft
**Input**: User description: "Rollback the hero section - current implementation is worse. Remove the background animation canvas (doesn't work). Look at awwwards.com portfolios for better quality hero sections. Add name and surname prominently."

## Auto-Resolved Decisions

### Decision 1: Remove WebGL/Canvas Animation Entirely

- **Decision**: Remove all WebGL 3D background animation code and replace with simple CSS gradient background
- **Policy Applied**: PRAGMATIC
- **Confidence**: High (score: -5) — explicit directive to remove non-working animation
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Loses "award-winning" visual effect from PBF-28, but gains reliability
  2. Significantly reduces bundle size (~30KB savings) and maintenance burden
- **Reviewer Notes**: User explicitly stated "ne marche pas du tout" (doesn't work at all). Removing is the correct action.

### Decision 2: Hero Layout Pattern

- **Decision**: Use name-first hero layout (Name large, role below, CTA at bottom) following awwwards portfolio conventions
- **Policy Applied**: PRAGMATIC
- **Confidence**: High (score: -5) — aligns with explicit request to show "nom et prenom"
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Changes current headline focus from role to name — more personal/portfolio-like
  2. Better alignment with industry-standard portfolio hero sections
- **Reviewer Notes**: Most awwwards portfolio heroes lead with the person's name prominently displayed.

### Decision 3: Animation Approach

- **Decision**: Use simple CSS-only fade-in animations (no JavaScript animation libraries required for hero)
- **Policy Applied**: PRAGMATIC
- **Confidence**: High (score: -5) — simplicity over complexity after previous issues
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Less visually impressive than choreographed GSAP sequences
  2. More reliable, faster initial load, works without JavaScript
- **Reviewer Notes**: CSS animations with `prefers-reduced-motion` support are sufficient for a clean hero.

### Decision 4: Content Structure

- **Decision**: Keep existing CTA button linking to projects section
- **Policy Applied**: PRAGMATIC
- **Confidence**: High — preserves working functionality
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. No change to user journey from hero → projects
  2. Maintains site navigation structure
- **Reviewer Notes**: CTA works well, no reason to modify.

## User Scenarios & Testing

### User Story 1 - First Impression (Priority: P1)

A visitor lands on the portfolio homepage and immediately sees who the developer is, what they do, and has a clear action to learn more.

**Why this priority**: The hero section is the first thing visitors see. It must clearly communicate identity and purpose within seconds.

**Independent Test**: Can be fully tested by loading the homepage and verifying name, role, and CTA are visible and readable within 2 seconds of page load.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** the visitor sees the hero section, **Then** they see the developer's full name prominently displayed
2. **Given** the hero section is visible, **When** the visitor reads the content, **Then** they understand the developer's role/title
3. **Given** the hero section is visible, **When** the visitor wants to explore, **Then** they can click a clear CTA button to navigate to projects

---

### User Story 2 - Accessibility Experience (Priority: P2)

A visitor with reduced motion preference or using assistive technology experiences the hero section without barriers.

**Why this priority**: Accessibility is a core value; all visitors must have equal access to content.

**Independent Test**: Can be tested by enabling `prefers-reduced-motion` and using screen reader to verify content is fully accessible.

**Acceptance Scenarios**:

1. **Given** a visitor has `prefers-reduced-motion: reduce` enabled, **When** the hero loads, **Then** content appears immediately without animation
2. **Given** a visitor uses a screen reader, **When** they navigate to the hero, **Then** they hear the name, role, and CTA text clearly announced
3. **Given** a visitor uses keyboard navigation, **When** they Tab through the hero, **Then** the CTA button receives visible focus and can be activated with Enter

---

### User Story 3 - Mobile Experience (Priority: P2)

A visitor on a mobile device sees a properly sized and readable hero section without layout issues.

**Why this priority**: Mobile users are a significant portion of traffic; layout must adapt gracefully.

**Independent Test**: Can be tested on mobile viewport (320px-767px) to verify text is readable and CTA is tappable.

**Acceptance Scenarios**:

1. **Given** a visitor is on a mobile device, **When** the hero loads, **Then** the name and role text are readable without horizontal scrolling
2. **Given** a visitor is on a mobile device, **When** they want to proceed, **Then** the CTA button is large enough to tap (minimum 44x44px touch target)

---

### Edge Cases

- What happens when JavaScript fails to load? → Content is visible via CSS fallback (no JS required)
- What happens on very slow connections? → Text content loads first via progressive enhancement
- What happens on extremely wide screens (>2560px)? → Content remains centered and readable with max-width constraint

## Requirements

### Functional Requirements

- **FR-001**: Hero section MUST display the developer's full name (first and last name) as the primary visual element
- **FR-002**: Hero section MUST display the developer's professional role/title as secondary text below the name
- **FR-003**: Hero section MUST include a call-to-action button linking to the projects section
- **FR-004**: Hero section MUST NOT use WebGL, Canvas, or complex JavaScript animations
- **FR-005**: Hero section MUST use a simple CSS gradient background using the existing Catppuccin Mocha color palette
- **FR-006**: Hero section MUST support `prefers-reduced-motion` by showing content immediately without animation
- **FR-007**: Hero section MUST maintain proper heading hierarchy (h1 for name)
- **FR-008**: Hero section MUST be fully keyboard navigable with visible focus indicators
- **FR-009**: Hero section MUST remove all existing hero animation module files from `src/scripts/hero/`
- **FR-010**: Hero section MUST render correctly on viewports from 320px to 2560px width

### Key Entities

- **Hero Section**: The full-viewport introductory section containing name, role, and CTA
- **Name Display**: Developer's first and last name (Benoit Fernandez) shown prominently
- **Role Display**: Professional title/role description
- **CTA Button**: Clickable element linking to projects section

## Success Criteria

### Measurable Outcomes

- **SC-001**: Hero section content is fully visible within 1 second of page load (no waiting for animation scripts)
- **SC-002**: Lighthouse Performance score remains at or above 85 for mobile after changes
- **SC-003**: Bundle size decreases by removing unused hero animation code
- **SC-004**: Zero JavaScript errors related to hero animation in browser console
- **SC-005**: All hero content passes WCAG 2.1 AA color contrast requirements
- **SC-006**: CTA button has minimum 44x44px touch target on mobile devices
- **SC-007**: Hero section renders correctly without JavaScript (progressive enhancement)
