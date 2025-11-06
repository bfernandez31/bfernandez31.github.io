# Feature Specification: Site-Wide Color Palette

**Feature Branch**: `002-1506-palette-couleur`
**Created**: 2025-11-06
**Status**: Draft
**Input**: User description: "#1506 palette couleur - Define site-wide color palette based on Catppuccin Mocha with violet/rose theme"

## Auto-Resolved Decisions

- **Decision**: Dark theme aesthetic and color harmony approach
- **Policy Applied**: AUTO
- **Confidence**: High (score: 0.9) - User provided explicit base colors and theme preference (Catppuccin Mocha)
- **Fallback Triggered?**: No - Clear user requirements with specific hex values and theme constraints
- **Trade-offs**:
  1. Limited to Catppuccin Mocha palette ensures visual consistency but reduces creative freedom
  2. Violet/rose focus may limit broader color usage, traded for distinctive brand identity
- **Reviewer Notes**: Verify that the selected violet/rose shades provide sufficient contrast ratios for WCAG 2.1 AA compliance, especially for interactive elements

---

- **Decision**: Color naming convention and format (HSL vs HEX vs RGB)
- **Policy Applied**: AUTO (with industry standard defaults)
- **Confidence**: Medium (score: 0.6) - Based on modern CSS practices and Catppuccin's official format
- **Fallback Triggered?**: No - Following Catppuccin Mocha's official HSL format aligns with user's primary color specification
- **Trade-offs**:
  1. HSL format improves maintainability and theme variations but requires browser support (universally available)
  2. Semantic naming (primary, secondary, accent) over color names (violet, rose) improves reusability
- **Reviewer Notes**: Confirm that HSL format aligns with existing codebase conventions in Astro/CSS files

---

- **Decision**: Semantic color roles beyond primary and background
- **Policy Applied**: AUTO (with accessibility standards)
- **Confidence**: High (score: 0.9) - Standard UI pattern requirements
- **Fallback Triggered?**: No - Essential for accessible, functional interface
- **Trade-offs**:
  1. Comprehensive palette (text, borders, surfaces, states) increases initial definition work but prevents inconsistent ad-hoc colors
  2. Accessibility-first approach may limit pure aesthetic choices but ensures usability
- **Reviewer Notes**: Validate that all color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text, 3:1 for UI components)

---

- **Decision**: Animation and interaction state colors
- **Policy Applied**: AUTO (aligned with GSAP/Lenis integration)
- **Confidence**: Medium (score: 0.6) - Inferred from project's animation dependencies
- **Fallback Triggered?**: No - Based on existing tech stack (GSAP + Lenis mentioned in CLAUDE.md)
- **Trade-offs**:
  1. Hover, focus, and active states double the color definitions but ensure smooth interactive feedback
  2. Motion-sensitive variants respect prefers-reduced-motion but add complexity
- **Reviewer Notes**: Ensure hover/focus states are visually distinct enough for keyboard navigation users

## User Scenarios & Testing

### User Story 1 - Visual Consistency Across Pages (Priority: P1)

As a **visitor** browsing the portfolio site, I need all pages to use a consistent, harmonious color scheme so that the site feels professional and cohesive.

**Why this priority**: Core brand identity requirement; impacts first impression and user trust

**Independent Test**: Navigate between different pages (home, about, projects) and verify that background, text, and accent colors remain consistent and visually harmonious

**Acceptance Scenarios**:

1. **Given** I am viewing the homepage, **When** I navigate to any other page, **Then** the background color is consistently #1e1e2e across all pages
2. **Given** I am on any page with interactive elements (buttons, links), **When** I observe the UI, **Then** all primary action elements use the specified violet (258 90% 66%) consistently
3. **Given** I view multiple sections on the same page, **When** I observe the color usage, **Then** text colors, borders, and surfaces follow the defined Catppuccin Mocha-based palette without introducing arbitrary colors

---

### User Story 2 - Accessible Interactive Elements (Priority: P1)

As a **user with visual impairments** or using assistive technologies, I need sufficient color contrast on interactive elements so that I can identify and use buttons, links, and forms.

**Why this priority**: Legal compliance (WCAG 2.1 AA) and inclusive design requirement

**Independent Test**: Use a contrast checker tool to verify all text/background and interactive element combinations meet WCAG 2.1 AA standards (4.5:1 for text, 3:1 for UI components)

**Acceptance Scenarios**:

1. **Given** I am viewing a page with buttons, **When** I check contrast ratios, **Then** button text against the primary violet background meets or exceeds 4.5:1 contrast ratio
2. **Given** I am reading body text, **When** I check text against the #1e1e2e background, **Then** the contrast ratio meets or exceeds 4.5:1
3. **Given** I am navigating with keyboard focus, **When** I tab through interactive elements, **Then** focus states have clearly visible color indicators with sufficient contrast

---

### User Story 3 - Recognizable Hover and Focus States (Priority: P2)

As a **user interacting with the site**, I need clear visual feedback when hovering over or focusing on interactive elements so that I understand what is clickable and where my focus is.

**Why this priority**: Enhances usability and provides immediate feedback; secondary to foundational color consistency

**Independent Test**: Hover over and tab through interactive elements to verify distinct visual state changes occur using defined palette colors

**Acceptance Scenarios**:

1. **Given** I hover my mouse over a button, **When** the hover state activates, **Then** the button color shifts to a defined hover variant (lighter or darker shade from the palette)
2. **Given** I am navigating with keyboard, **When** I tab to a focusable element, **Then** a visible focus ring or background color change appears using palette-defined colors
3. **Given** I am viewing a link, **When** I hover over it, **Then** the link color changes to a defined accent or secondary color from the palette

---

### User Story 4 - Harmonious Violet/Rose Aesthetic (Priority: P2)

As a **visitor appreciating design**, I want the site to feature a modern, trendy violet/rose color scheme that feels harmonious and visually appealing so that I enjoy the browsing experience.

**Why this priority**: Brand differentiation and aesthetic appeal; important but secondary to accessibility and consistency

**Independent Test**: Review the site's overall visual appearance and confirm the violet/rose tones create a cohesive, modern aesthetic aligned with Catppuccin Mocha's design philosophy

**Acceptance Scenarios**:

1. **Given** I view the homepage hero section, **When** I observe the color usage, **Then** violet and rose tones are prominently featured in accents, gradients, or highlights
2. **Given** I am browsing project cards or portfolio items, **When** I see secondary colors, **Then** they complement the primary violet without clashing (harmonious hues)
3. **Given** I am viewing the site on different devices, **When** colors render, **Then** the violet/rose palette maintains its intended warmth and vibrancy across screens

---

### User Story 5 - Reduced Motion Respect (Priority: P3)

As a **user with motion sensitivity**, I need color transitions and animations to respect my system preferences so that I can browse comfortably without triggering discomfort.

**Why this priority**: Accessibility enhancement for specific user group; lower priority than core contrast and consistency

**Independent Test**: Enable prefers-reduced-motion system setting and verify that color transitions are instant or minimal

**Acceptance Scenarios**:

1. **Given** I have enabled prefers-reduced-motion, **When** I hover over interactive elements, **Then** color changes happen instantly without gradual transitions
2. **Given** I have enabled prefers-reduced-motion, **When** I navigate between pages, **Then** background or theme color changes occur without animated transitions

---

### Edge Cases

- What happens when a user's browser doesn't support HSL color format? (Fallback to hex values should be available)
- How does the palette handle high-contrast mode or forced color adjustments? (System overrides should be respected)
- What happens when printing the site? (Palette should include print-friendly alternatives or rely on browser defaults)
- How are error states, warnings, and success messages colored to remain distinct from the violet/rose theme?

## Requirements

### Functional Requirements

- **FR-001**: System MUST define a site-wide color palette based on Catppuccin Mocha color system
- **FR-002**: Background color MUST be #1e1e2e across all pages and components
- **FR-003**: Primary action elements (buttons, CTAs) MUST use the specified primary violet color: 258 90% 66% (HSL format)
- **FR-004**: Palette MUST include semantic color definitions for: background, foreground (text), primary, secondary, accent, surface, border, muted
- **FR-005**: Palette MUST include interaction state colors: hover, focus, active, disabled for all interactive elements
- **FR-006**: All text color and background color combinations MUST meet WCAG 2.1 AA contrast ratio standards (minimum 4.5:1 for normal text, 3:1 for large text and UI components)
- **FR-007**: Palette MUST feature violet and rose tones as dominant accent colors, harmonized with Catppuccin Mocha's design philosophy
- **FR-008**: System MUST provide color definitions in a reusable format (CSS custom properties, design tokens, or similar) accessible to all components
- **FR-009**: Error, warning, success, and info states MUST have distinct, accessible colors that don't rely solely on the violet/rose theme
- **FR-010**: Color transitions for hover and focus states MUST respect prefers-reduced-motion media query
- **FR-011**: Palette MUST include at least 3 shades or tints for key colors (primary, secondary) to support visual hierarchy

### Key Entities

- **Color Palette**: Central definition of all approved colors for the site, including semantic names (primary, secondary, accent), HSL values, hex equivalents, and usage context (backgrounds, text, borders, states)
- **Color Token**: Individual color definition with semantic name, HSL value, hex fallback, contrast ratio validation, and assigned role (e.g., primary-violet, surface-dark, text-muted)
- **Interaction State**: Variant of a base color used for hover, focus, active, or disabled states, derived systematically from the base palette

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of pages use the #1e1e2e background color consistently (verified via automated style audit)
- **SC-002**: 100% of primary action elements (buttons, CTAs) use the specified primary violet (258 90% 66%)
- **SC-003**: 100% of text/background color combinations achieve WCAG 2.1 AA contrast ratios (minimum 4.5:1 for body text)
- **SC-004**: Zero instances of hard-coded colors outside the defined palette in production code (verified via linting/code review)
- **SC-005**: Visitors can visually distinguish between default, hover, and focus states on interactive elements within 0.5 seconds
- **SC-006**: Site maintains visual harmony across all pages as validated by design review (subjective but documented)
- **SC-007**: Color palette documentation is complete and accessible to developers and designers (single source of truth)
- **SC-008**: 95% of users report the site's visual appearance as professional and cohesive (post-launch survey)
