# Feature Specification: Fix Explorer Visibility on Desktop

**Feature Branch**: `PBF-33-fix-explorer`
**Created**: 2025-12-19
**Status**: Draft
**Input**: User description: "Quand l'explorer est ouvert on ne voit pas le contenu. Pour mobile ok par contre ne devrais pas etre le cas sur desktop"

## Auto-Resolved Decisions *(mandatory when clarification policies apply)*

- **Decision**: Determined that "explorer" refers to the TUI sidebar (NvimTree-style file explorer) based on codebase context
- **Policy Applied**: AUTO (confirmed by signal analysis)
- **Confidence**: High (0.9) - The codebase clearly shows a TUI sidebar component labeled "EXPLORER" in Sidebar.astro
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Narrow scope focuses only on CSS layout fix, not any sidebar functionality changes
  2. Quick fix without broader refactoring of TUI layout system
- **Reviewer Notes**: Verify the user's "explorer" matches the sidebar component; confirm no other explorer-like UI exists

---

- **Decision**: Bug is a CSS layout conflict between grid-based layout and component-scoped sidebar styles
- **Policy Applied**: AUTO (technical investigation revealed root cause)
- **Confidence**: High (0.9) - Inspection of layout.css and Sidebar.astro shows conflicting styling rules on desktop
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Fixing in one location (consolidating styles) vs maintaining separation of concerns
  2. Simple CSS fix preferred over restructuring component architecture
- **Reviewer Notes**: The grid layout in layout.css expects sidebar to participate in grid, but Sidebar.astro may have conflicting position/display rules

---

- **Decision**: Mobile behavior is correct and should not be changed
- **Policy Applied**: AUTO (per user description)
- **Confidence**: High (1.0) - User explicitly stated "Pour mobile ok"
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. No impact - mobile is confirmed working correctly
  2. Fix must be scoped to desktop (≥1024px) breakpoint only
- **Reviewer Notes**: Ensure any CSS changes are properly scoped to desktop breakpoint to avoid breaking mobile

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Desktop Content Visibility with Explorer Open (Priority: P1)

As a desktop user viewing the portfolio, when the sidebar explorer is visible, I should be able to see the main content area alongside the explorer panel so I can navigate and read content simultaneously.

**Why this priority**: Core functionality - users cannot view portfolio content on desktop if the explorer obscures it

**Independent Test**: Open the portfolio on a desktop browser (≥1024px width), verify the explorer sidebar and main content are both visible side-by-side

**Acceptance Scenarios**:

1. **Given** a desktop viewport (≥1024px), **When** the portfolio loads, **Then** both the sidebar explorer and main content area are visible simultaneously without overlap
2. **Given** a desktop viewport (≥1024px), **When** I scroll through the content, **Then** the sidebar remains visible and doesn't overlap the content area
3. **Given** a desktop viewport (≥1024px), **When** I click a file in the sidebar explorer, **Then** the content scrolls to that section while remaining fully visible

---

### User Story 2 - Sidebar Toggle Behavior on Tablet (Priority: P2)

As a tablet user (768-1023px), when I toggle the sidebar explorer, it should overlay the content (current behavior) and not break the fix applied for desktop.

**Why this priority**: Ensures the desktop fix doesn't regress tablet behavior

**Independent Test**: Open the portfolio on a tablet-sized viewport, toggle the sidebar and verify overlay behavior works correctly

**Acceptance Scenarios**:

1. **Given** a tablet viewport (768-1023px), **When** I toggle the sidebar open, **Then** it overlays the content as an overlay panel
2. **Given** a tablet viewport (768-1023px), **When** I click a file in the sidebar, **Then** the sidebar closes and content scrolls to the section

---

### User Story 3 - Mobile Sidebar Overlay (Priority: P3)

As a mobile user (<768px), the current sidebar overlay behavior should remain unchanged.

**Why this priority**: Regression prevention - mobile is confirmed working, must not break

**Independent Test**: Open portfolio on mobile viewport, toggle sidebar, verify overlay behavior

**Acceptance Scenarios**:

1. **Given** a mobile viewport (<768px), **When** I toggle the sidebar open, **Then** it slides in as an overlay from the left
2. **Given** a mobile viewport (<768px), **When** I tap outside the sidebar, **Then** it closes

---

### Edge Cases

- What happens when resizing browser from mobile to desktop while sidebar is open?
- How does the layout behave at exactly 1024px (breakpoint boundary)?
- Does the sidebar remain correctly positioned when browser window is very wide (>2560px)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display sidebar explorer and main content side-by-side on desktop viewports (≥1024px)
- **FR-002**: System MUST NOT allow sidebar to overlap or obscure main content on desktop viewports
- **FR-003**: System MUST maintain existing overlay behavior for sidebar on tablet viewports (768-1023px)
- **FR-004**: System MUST maintain existing overlay behavior for sidebar on mobile viewports (<768px)
- **FR-005**: System MUST ensure sidebar explorer is always visible on desktop without requiring user toggle
- **FR-006**: System MUST preserve sidebar/content proportions defined in design (sidebar ~200-250px, content fills remaining space)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On desktop viewports (≥1024px), main content is fully visible when sidebar is displayed
- **SC-002**: Zero overlap between sidebar explorer and main content on desktop viewports
- **SC-003**: Mobile and tablet viewport behaviors remain unchanged after fix
- **SC-004**: Layout passes visual regression test across breakpoints (320px, 768px, 1024px, 1440px, 2560px)
- **SC-005**: Users can read and interact with all portfolio sections on desktop with sidebar visible
