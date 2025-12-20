# Feature Specification: About Section Rework

**Feature Branch**: `PBF-41-about-rework`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "Rename the file on the explorer about.tsx to about.md, then in the section for the content remove the fake header README.md and the border. We should display like it's the markdown file that we are reading. Change the buffer tab label to match the file name in the explorer instead of About should show about.md"

## Auto-Resolved Decisions

- **Decision**: Display format for the About section content
- **Policy Applied**: PRAGMATIC
- **Confidence**: High (0.9) - Clear visual refinement with single interpretation
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Simpler, cleaner visual presentation matching the "reading a markdown file" metaphor
  2. Removes visual chrome (header/border) which may reduce visual distinction from other sections
- **Reviewer Notes**: Verify that the About section remains visually distinct and readable without the header/border chrome. Ensure markdown-style formatting (# headings, - bullets) remains intact.

---

- **Decision**: Naming convention alignment (fileName = buffer tab label)
- **Policy Applied**: PRAGMATIC
- **Confidence**: High (0.9) - Direct mapping requested, consistent with explorer
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Improves consistency between sidebar explorer and buffer tabs
  2. Changes from human-readable "About" to technical "about.md" format
- **Reviewer Notes**: Confirm this filename-style labeling aligns with the overall TUI aesthetic and user expectations.

## User Scenarios & Testing

### User Story 1 - View About Section in Explorer (Priority: P1)

A visitor browses the portfolio and sees the sidebar file explorer. The About section should appear as `about.md` rather than `about.tsx` to reinforce the markdown/documentation metaphor.

**Why this priority**: Core visual consistency between the file metaphor and content presentation.

**Independent Test**: Navigate to the portfolio, observe the sidebar explorer shows `about.md` for the About section.

**Acceptance Scenarios**:

1. **Given** the portfolio homepage loads, **When** the user views the sidebar explorer, **Then** the About section file entry displays as `about.md` (not `about.tsx`)
2. **Given** the sidebar is visible, **When** the user clicks on `about.md`, **Then** the page scrolls to the About section

---

### User Story 2 - View About Section Content Without Header Chrome (Priority: P1)

A visitor scrolls to the About section and sees the biography content displayed directly, without the artificial "README.md" header bar or bordered container, giving the impression of reading a raw markdown file.

**Why this priority**: Primary visual change requested - removes fake file header to create authentic markdown reading experience.

**Independent Test**: Navigate to the About section and verify no "README.md" header bar appears above the content and no border surrounds the content area.

**Acceptance Scenarios**:

1. **Given** the About section is in view, **When** the user reads the content, **Then** there is no "README.md" header bar displayed above the biography
2. **Given** the About section is in view, **When** the user views the content container, **Then** there is no visible border wrapping the content area
3. **Given** the About section is in view, **When** the user reads the content, **Then** markdown-style formatting remains visible (# for headings, - for bullets)

---

### User Story 3 - View Buffer Tab with Filename Label (Priority: P2)

A visitor views the top navigation bar buffer tabs. The About section tab should display `about.md` instead of `About` to match the file name shown in the explorer sidebar.

**Why this priority**: Secondary consistency improvement - aligns buffer tabs with explorer filenames.

**Independent Test**: View the top bar and confirm the About section tab displays `about.md`.

**Acceptance Scenarios**:

1. **Given** the portfolio homepage loads, **When** the user views the buffer tabs in the top bar, **Then** the About section tab label shows `about.md` (not `About`)
2. **Given** the About section tab shows `about.md`, **When** the user hovers or activates the tab, **Then** screen readers announce `about.md` appropriately

---

### Edge Cases

- What happens when the browser window is narrow? The `about.md` label should truncate gracefully if necessary (existing truncation behavior preserved).
- How does the About section maintain visual distinction without header/border? The markdown formatting (# headings, content styling) provides sufficient structure.

## Requirements

### Functional Requirements

- **FR-001**: System MUST display `about.md` as the filename in the sidebar explorer for the About section
- **FR-002**: System MUST display `about.md` as the buffer tab label for the About section
- **FR-003**: System MUST NOT display a "README.md" header bar in the About section content area
- **FR-004**: System MUST NOT display a border around the About section content area
- **FR-005**: System MUST preserve markdown-style formatting in the About section (# headings, - bullet points)
- **FR-006**: System MUST maintain responsive behavior for the About section on all device sizes

### Key Entities

- **Section Configuration**: The `TUI_SECTIONS` data structure that defines `fileName` and `displayName` for each section
- **AboutReadme Component**: The Astro component rendering the About section content with markdown-style formatting

## Success Criteria

### Measurable Outcomes

- **SC-001**: Sidebar explorer displays `about.md` for the About section entry
- **SC-002**: Buffer tab displays `about.md` label for the About section
- **SC-003**: About section content renders without a header bar element
- **SC-004**: About section content renders without a visible border
- **SC-005**: Markdown formatting (# headings, - bullets) remains visually styled in the About section
- **SC-006**: All existing functionality (navigation, scrolling, responsive behavior) continues working
