# Feature Specification: Portfolio with TUI Aesthetic

**Feature Branch**: `PBF-32-portofolio-with-tui`
**Created**: 2025-12-19
**Status**: Draft
**Input**: User description: "Create a modern portfolio with Terminal User Interface (TUI) aesthetic inspired by Neovim and tmux"

## Auto-Resolved Decisions *(mandatory when clarification policies apply)*

### Decision 1: Layout Replacement Strategy

- **Decision**: TUI layout replaces the current layout entirely rather than being an alternative view
- **Policy Applied**: CONSERVATIVE (AUTO fallback due to low confidence score)
- **Confidence**: High (0.85) — User description clearly says "Create a portfolio" not "Add a TUI view", and the detailed structure implies complete replacement
- **Fallback Triggered?**: No — The intent was clear from context despite AUTO's low signal score
- **Trade-offs**:
  1. Simplifies implementation (one layout to maintain), but loses the current design
  2. Users familiar with current site will need to adapt to new navigation paradigm
- **Reviewer Notes**: Confirm stakeholder acceptance of full redesign vs. keeping current layout as fallback

### Decision 2: Sidebar File Hierarchy Structure

- **Decision**: Sidebar displays flat list of .tsx "files" (6 items) without directory nesting
- **Policy Applied**: CONSERVATIVE
- **Confidence**: High (0.9) — Description explicitly lists files as `hero.tsx`, `about.tsx`, etc. without mentioning folders
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Simpler implementation and clearer navigation
  2. Less authentic NvimTree feel (real NvimTree shows directories)
- **Reviewer Notes**: Could add decorative directory icons later as enhancement

### Decision 3: Command Line Functionality

- **Decision**: Command line is decorative only (displays static text like `:e hero.tsx`), no actual command execution
- **Policy Applied**: CONSERVATIVE
- **Confidence**: Medium (0.65) — Description mentions "command line" without specifying functionality; CONSERVATIVE avoids scope creep
- **Fallback Triggered?**: Yes — AUTO would suggest "maybe add some commands" but CONSERVATIVE keeps scope minimal
- **Trade-offs**:
  1. Faster implementation, simpler maintenance
  2. Missed opportunity for interactive easter eggs or navigation shortcuts
- **Reviewer Notes**: Consider adding basic commands (`:q`, `:help`) as future enhancement

### Decision 4: Keyboard Navigation Approach

- **Decision**: Standard web keyboard navigation (Tab/Shift+Tab, Enter, Escape) rather than vim keybindings (j/k/h/l)
- **Policy Applied**: CONSERVATIVE
- **Confidence**: High (0.85) — Accessibility standards require standard keyboard navigation; vim bindings would confuse non-developer visitors
- **Fallback Triggered?**: No — This is a clear accessibility requirement
- **Trade-offs**:
  1. Maintains accessibility compliance (WCAG 2.1 AA)
  2. Less immersive TUI experience for vim users
- **Reviewer Notes**: Vim keybindings could be added as opt-in feature via command like `:set vim`

### Decision 5: Line Numbers Interactivity

- **Decision**: Line numbers are decorative only (visual element in content gutter)
- **Policy Applied**: CONSERVATIVE
- **Confidence**: High (0.8) — No functional benefit to clickable line numbers in a portfolio context
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Simpler implementation
  2. Authentic TUI feel maintained without unnecessary complexity
- **Reviewer Notes**: None

### Decision 6: Git Branch Display

- **Decision**: Git branch in top bar shows static "main" text, not dynamically fetched
- **Policy Applied**: CONSERVATIVE
- **Confidence**: High (0.9) — Static site cannot fetch live git data without backend; static display achieves visual goal
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. No backend complexity or build-time data injection
  2. Branch name is decorative fiction rather than real data
- **Reviewer Notes**: Could inject branch name at build time if authenticity is important

## User Scenarios & Testing *(mandatory)*

### User Story 1 - TUI-Style Portfolio Viewing (Priority: P1)

As a visitor (recruiter, developer, or potential collaborator), I want to browse the portfolio through a terminal-inspired interface so that I can experience the developer's technical identity while accessing standard portfolio content.

**Why this priority**: This is the core value proposition — the TUI aesthetic IS the feature. Without this working, there is no feature.

**Independent Test**: Can be fully tested by loading the site and verifying the TUI layout displays correctly with all structural elements (top bar, sidebar, content area, statusline, command line).

**Acceptance Scenarios**:

1. **Given** a visitor loads the portfolio homepage, **When** the page renders, **Then** they see a full TUI layout with tmux-style top bar at top, file tree sidebar on left, main content area with line numbers, Neovim-style statusline near bottom, and command line at very bottom
2. **Given** a visitor views the page on desktop (≥1024px), **When** they scan the layout, **Then** all TUI elements are visible and properly positioned (sidebar ~200-250px wide, content area fills remaining space)
3. **Given** a visitor views the page on mobile (<768px), **When** they scan the layout, **Then** the sidebar collapses to a toggle button and content fills the viewport

---

### User Story 2 - Section Navigation via Sidebar (Priority: P1)

As a visitor, I want to click on file names in the sidebar to navigate between portfolio sections so that I can access content using the familiar NvimTree pattern.

**Why this priority**: Navigation is critical — users must be able to access all content. Equal priority to core layout.

**Independent Test**: Can be fully tested by clicking each sidebar file and verifying the corresponding section scrolls into view.

**Acceptance Scenarios**:

1. **Given** the visitor clicks `hero.tsx` in the sidebar, **When** the click registers, **Then** the viewport scrolls smoothly to the hero section and the sidebar shows `hero.tsx` as active
2. **Given** the visitor clicks `experience.tsx` in the sidebar, **When** navigation completes, **Then** the statusline updates to show "experience.tsx" as the active file
3. **Given** the visitor uses keyboard navigation (Tab to sidebar, Enter on file), **When** they activate a file, **Then** navigation occurs just as with mouse click

---

### User Story 3 - Buffer Tab Navigation (Priority: P2)

As a visitor, I want to use buffer-style tabs in the top bar to switch between sections so that I have an alternative navigation method familiar to tmux/vim users.

**Why this priority**: Secondary navigation pattern provides redundancy and authentic tmux feel.

**Independent Test**: Can be fully tested by clicking top bar tabs and verifying section navigation matches sidebar behavior.

**Acceptance Scenarios**:

1. **Given** the visitor clicks a tab labeled "about" in the top bar, **When** the click registers, **Then** the viewport navigates to the about section and both sidebar and tab show about as active
2. **Given** multiple tabs exist, **When** a tab is active, **Then** it displays with distinct visual highlighting (different background or underline)
3. **Given** the visitor scrolls manually, **When** a new section enters the viewport, **Then** the corresponding tab updates to show as active

---

### User Story 4 - Hero Section with Typing Animation (Priority: P2)

As a visitor, I want to see the hero section with a typing animation and blinking cursor so that I get an immediate impression of the developer's terminal-native identity.

**Why this priority**: First impression matters but is less critical than navigation working correctly.

**Independent Test**: Can be fully tested by loading the hero section and observing the typing animation play through with cursor blinking.

**Acceptance Scenarios**:

1. **Given** the visitor arrives at the hero section, **When** it becomes visible, **Then** the main headline text types out character by character at a readable pace (50-80ms per character)
2. **Given** the typing animation is in progress, **When** the visitor observes, **Then** they see a blinking block cursor (█) at the typing position with ~530ms blink interval
3. **Given** the visitor has `prefers-reduced-motion` enabled, **When** hero loads, **Then** the text appears immediately (no typing animation) and cursor is static

---

### User Story 5 - Section-Specific Content Styling (Priority: P2)

As a visitor, I want each section to have unique TUI-inspired styling matching its purpose so that the portfolio feels cohesive and creative.

**Why this priority**: Visual polish important for portfolio impact but can be iterated after core functionality.

**Independent Test**: Can be tested by scrolling through each section and verifying the appropriate style treatment is applied.

**Acceptance Scenarios**:

1. **Given** the visitor views the about section, **When** content renders, **Then** it displays in README.md style with markdown-like formatting (headers with #, lists with -, code blocks)
2. **Given** the visitor views the experience section, **When** content renders, **Then** it displays in git log style with branch visualization and commit-like entries
3. **Given** the visitor views the projects section, **When** content renders, **Then** it displays in Telescope/fzf style with a search bar UI element (decorative or functional)
4. **Given** the visitor views the expertise section, **When** content renders, **Then** it displays in :checkhealth style with OK/WARN indicators and progress bars
5. **Given** the visitor views the contact section, **When** content renders, **Then** it displays terminal commands with $ prompts and echo syntax

---

### User Story 6 - Responsive TUI Layout (Priority: P3)

As a visitor on mobile or tablet, I want the TUI layout to adapt gracefully so that I can still navigate and view content on smaller screens.

**Why this priority**: Mobile support important but secondary to desktop experience for developer portfolio.

**Independent Test**: Can be tested by viewing the site at various viewport widths and verifying layout adaptations.

**Acceptance Scenarios**:

1. **Given** the visitor views on tablet (768px-1023px), **When** the layout renders, **Then** the sidebar becomes collapsible with a toggle button
2. **Given** the visitor views on mobile (<768px), **When** the layout renders, **Then** the sidebar is hidden by default, accessible via toggle, and content uses full viewport width
3. **Given** the visitor on mobile opens the sidebar, **When** they select a file, **Then** the sidebar closes automatically after navigation

---

### Edge Cases

- What happens when JavaScript fails to load? — Content remains visible with static styling, navigation falls back to native anchor scrolling
- How does the typing animation handle very long text? — Animation truncates to first ~100 characters, remaining text appears after animation completes
- What happens when the viewport is extremely narrow (<320px)? — Layout stacks vertically, sidebar becomes full-width overlay
- How do screen readers interpret the TUI metaphor? — Semantic HTML ensures content is accessible; file names are announced as navigation links, not as actual files

## Requirements *(mandatory)*

### Functional Requirements

**Layout Structure:**
- **FR-001**: System MUST display a top bar containing window tabs, a clock display, and a git branch indicator
- **FR-002**: System MUST display a left sidebar styled as NvimTree file explorer showing 6 navigable "files" (hero.tsx, about.tsx, experience.tsx, projects.tsx, expertise.tsx, contact.tsx)
- **FR-003**: System MUST display a central content area with line numbers visible in a left gutter column
- **FR-004**: System MUST display a Neovim-style statusline showing mode indicator (NORMAL), active file name, and cursor position (Ln, Col)
- **FR-005**: System MUST display a command line at the very bottom of the viewport

**Navigation:**
- **FR-006**: Users MUST be able to navigate to any section by clicking its corresponding file in the sidebar
- **FR-007**: Users MUST be able to navigate to any section by clicking its tab in the top bar
- **FR-008**: System MUST update the active state of both sidebar and tabs when navigation occurs
- **FR-009**: System MUST update the statusline to reflect the currently active section/file
- **FR-010**: Navigation between sections MUST use smooth scrolling with fluid transitions

**Section Styling:**
- **FR-011**: Hero section MUST display a typing animation effect with a visible blinking block cursor
- **FR-012**: About section MUST be styled to resemble a README.md file (markdown aesthetic)
- **FR-013**: Experience section MUST be styled to resemble git log output with branch visualization
- **FR-014**: Projects section MUST be styled to resemble Telescope/fzf interface with a search bar element
- **FR-015**: Projects section MUST NOT include the "More Projects" grid block (ProjectsHexGrid removed)
- **FR-016**: Expertise section MUST be styled to resemble Neovim :checkhealth output with progress bars
- **FR-017**: Contact section MUST be styled as terminal commands with $ prompts and echo syntax

**Typography & Icons:**
- **FR-018**: System MUST use a monospace font family throughout the interface
- **FR-019**: System MUST display Nerd Font icons for file types and UI elements (󰊢, 󰉋, 󰀄, 󰇮)
- **FR-020**: Code content MUST display with syntax highlighting appropriate to the content type

**Visual Effects:**
- **FR-021**: Cursor element MUST blink with approximately 530ms on/off interval
- **FR-022**: Interactive elements MUST display subtle hover effects
- **FR-023**: Transitions between states MUST be smooth (200-300ms duration)

**Color Preservation:**
- **FR-024**: System MUST preserve the existing Catppuccin Mocha color palette (violet/rose theme)
- **FR-025**: All TUI elements MUST use CSS custom properties from the existing theme.css

**Accessibility:**
- **FR-026**: All navigation MUST be fully accessible via keyboard (Tab, Enter, Escape)
- **FR-027**: System MUST respect `prefers-reduced-motion` preference (disable animations, show static content)
- **FR-028**: All interactive elements MUST have visible focus indicators
- **FR-029**: Screen readers MUST be able to access all content with proper semantic structure

### Key Entities

- **Section/File**: Represents a portfolio section, displayed as a .tsx file in the sidebar. Properties: id (string), displayName (string), icon (Nerd Font character), order (number)
- **BufferTab**: Represents a navigation tab in the top bar. Properties: sectionId (string), label (string), isActive (boolean)
- **StatuslineState**: Represents the current state of the statusline. Properties: mode (NORMAL), activeFile (string), line (number), column (number)
- **CommandLine**: Represents the command line display. Properties: prompt (string e.g., ":"), content (string e.g., "e hero.tsx")

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can identify the portfolio as terminal/TUI-themed within 3 seconds of page load (qualitative: user testing)
- **SC-002**: All 6 sections are accessible via sidebar navigation with less than 1 second perceived navigation time
- **SC-003**: Hero typing animation completes within 3-5 seconds at readable pace (50-80ms per character)
- **SC-004**: Layout adapts correctly across 3 viewport categories: desktop (≥1024px), tablet (768-1023px), mobile (<768px)
- **SC-005**: All interactive elements pass WCAG 2.1 AA accessibility audit (keyboard navigation, focus indicators, screen reader compatibility)
- **SC-006**: Page maintains smooth 60fps scrolling on desktop, 30fps minimum on mobile
- **SC-007**: No horizontal scrolling occurs at any supported viewport width (≥320px)
- **SC-008**: Visitors with `prefers-reduced-motion` see fully functional site with no animations (instant content display)
- **SC-009**: Portfolio maintains Lighthouse performance score ≥85 on mobile, ≥95 on desktop (current baseline)
- **SC-010**: First Contentful Paint occurs within 2 seconds on standard 4G connection
