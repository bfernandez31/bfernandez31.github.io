# Feature Specification: ASCII Art for Name on Hero Section

**Feature Branch**: `PBF-38-ascii-art-for`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "on the hero section replace my name by the same ascii art that u have done for the CONTACT in the contact section."

## Auto-Resolved Decisions *(mandatory when clarification policies apply)*

- **Decision**: Name text to convert to ASCII art
- **Policy Applied**: AUTO (resolved as PRAGMATIC)
- **Confidence**: High (0.9) - The ticket explicitly references "my name" which corresponds to "Benoit Fernandez" as currently displayed in the hero headline.
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. ASCII art is larger than plain text; may impact visual hierarchy and mobile responsiveness
  2. Typewriter animation may need adjustment or removal for ASCII art compatibility
- **Reviewer Notes**: Verify that "Benoit Fernandez" is the correct name to render as ASCII art.

---

- **Decision**: ASCII art style to use (block/box-drawing style)
- **Policy Applied**: AUTO (resolved as PRAGMATIC)
- **Confidence**: High (0.9) - The ticket explicitly references "the same ascii art that u have done for the CONTACT", which uses Unicode box-drawing characters in the contact section.
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Box-drawing ASCII style is decorative but increases page weight slightly
  2. Consistent style across sections strengthens TUI aesthetic
- **Reviewer Notes**: The existing CONTACT ASCII uses double-line box characters (╔═╗ style). The name should use the same character set for visual consistency.

---

- **Decision**: Handling of typewriter animation with ASCII art
- **Policy Applied**: AUTO (resolved as CONSERVATIVE)
- **Confidence**: Medium (0.6) - ASCII art typically doesn't work well with character-by-character typewriter animation due to multi-line nature.
- **Fallback Triggered?**: Yes - Multiple valid approaches exist (remove animation, animate differently, or keep animation for subheadline only)
- **Trade-offs**:
  1. Removing typewriter animation simplifies implementation but loses interactive feel
  2. Keeping animation only for subheadline maintains some interactivity
- **Reviewer Notes**: Consider user experience impact. The subheadline can retain typewriter animation while ASCII art appears statically or with a reveal effect.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View ASCII Art Name on Desktop (Priority: P1)

A visitor lands on the portfolio homepage on a desktop browser and sees the hero section prominently displaying the name "Benoit Fernandez" rendered as decorative ASCII art in the same block-style used for "CONTACT" in the contact section.

**Why this priority**: This is the core functionality - displaying the ASCII art name is the primary goal of the feature.

**Independent Test**: Can be fully tested by loading the homepage on a desktop browser (≥1024px width) and verifying the ASCII art name is visible and readable.

**Acceptance Scenarios**:

1. **Given** the user has a desktop viewport (≥1024px), **When** they load the homepage, **Then** they see "Benoit Fernandez" displayed as ASCII art using the same box-drawing character style as the contact section.
2. **Given** the hero section is visible, **When** the user views the headline, **Then** the ASCII art is clearly legible and styled with the primary color (--color-primary).

---

### User Story 2 - Responsive ASCII Art on Mobile (Priority: P2)

A visitor accesses the portfolio on a mobile device and the ASCII art name scales appropriately to remain readable without horizontal scrolling.

**Why this priority**: Mobile responsiveness is essential for accessibility but secondary to core desktop implementation.

**Independent Test**: Can be tested by loading the homepage on a mobile viewport (<768px) and verifying the ASCII art is visible and readable without horizontal overflow.

**Acceptance Scenarios**:

1. **Given** the user has a mobile viewport (<768px), **When** they view the hero section, **Then** the ASCII art scales down proportionally and remains readable.
2. **Given** the ASCII art is displayed on mobile, **When** the user scrolls horizontally, **Then** there is no horizontal overflow caused by the ASCII art.

---

### User Story 3 - Subheadline Animation Preserved (Priority: P3)

A visitor lands on the portfolio and the subheadline "Full Stack Developer & Creative Technologist" still animates with the typewriter effect while the ASCII art name displays statically.

**Why this priority**: Preserving existing animations maintains the TUI aesthetic, but is lower priority than the core ASCII art display.

**Independent Test**: Can be tested by loading the homepage and observing that the subheadline types out character by character while the ASCII art name is displayed immediately.

**Acceptance Scenarios**:

1. **Given** the user has JavaScript enabled, **When** the hero section loads, **Then** the ASCII art name appears immediately (no typewriter effect).
2. **Given** the ASCII art has loaded, **When** the user watches the hero section, **Then** the subheadline animates with the existing typewriter effect.

---

### Edge Cases

- What happens when viewport is very narrow (<320px)?
  - ASCII art should still be visible, potentially with smaller font size or horizontal scroll as last resort
- How does system handle users with reduced motion preferences?
  - The static ASCII art naturally respects reduced motion; no animation to disable
- What happens if custom fonts fail to load?
  - ASCII art should fall back to system monospace font while maintaining readability

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display "Benoit Fernandez" as ASCII art in the hero section headline
- **FR-002**: ASCII art MUST use the same box-drawing Unicode character style as the CONTACT ASCII in the contact section
- **FR-003**: ASCII art MUST be styled with the primary color variable (--color-primary)
- **FR-004**: ASCII art MUST scale responsively for mobile viewports without horizontal overflow
- **FR-005**: System MUST preserve the typewriter animation for the subheadline
- **FR-006**: ASCII art MUST include appropriate aria-label for screen reader accessibility
- **FR-007**: ASCII art MUST be contained within a semantic HTML element (pre or similar)

### Key Entities

- **ASCII Art Block**: Pre-formatted text element containing the multi-line box-drawing character representation of "Benoit Fernandez"
- **Hero Headline**: The primary heading element in the hero section, now containing ASCII art instead of plain text

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: ASCII art name is visible and legible on all viewport sizes from 320px to 1920px+ width
- **SC-002**: ASCII art maintains consistent styling (color, font) with the contact section ASCII art
- **SC-003**: Page passes accessibility audit with no errors related to the ASCII art element
- **SC-004**: Subheadline typewriter animation still functions correctly after implementation
- **SC-005**: Hero section loads and displays ASCII art within existing performance budgets (Lighthouse ≥85 mobile)
