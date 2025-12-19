# Feature Specification: Featured Project - AI-BOARD

**Feature Branch**: `PBF-23-featured-project`
**Created**: 2025-12-19
**Status**: Draft
**Input**: User description: "dans featured project il faudrait ajouter https://ai-board-three.vercel.app/ d'ailleur le porfolio et powered by ai-board plutot que de mettre Build with Astro and bun ajoute AI-BOARD"

## Auto-Resolved Decisions

### Decision 1: AI-BOARD Project Priority and Display Order

- **Decision**: AI-BOARD will be added as the top featured project with displayOrder: 1 (highest priority), shifting existing projects down
- **Policy Applied**: AUTO (resolved as PRAGMATIC)
- **Confidence**: High (score: 0.85) - User explicitly wants to showcase AI-BOARD as the tool powering the portfolio, implying it should have prominent placement
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Existing projects get pushed down in display order (minor visual hierarchy change)
  2. Emphasizes AI-BOARD as the primary showcase, which aligns with portfolio identity
- **Reviewer Notes**: Verify displayOrder values of existing projects to ensure no conflicts

### Decision 2: Footer Text Replacement Scope

- **Decision**: Replace "Built with Astro and Bun" with "Powered by AI-BOARD" with link to AI-BOARD project URL
- **Policy Applied**: AUTO (resolved as PRAGMATIC)
- **Confidence**: High (score: 0.9) - User explicitly requested this change ("porfolio et powered by ai-board plutot que de mettre Build with Astro and bun")
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. Removes attribution to Astro/Bun (acceptable as these are implementation details, not the primary value proposition)
  2. Creates cross-promotion between footer and featured projects section
- **Reviewer Notes**: Ensure the link opens in a new tab to keep users on the portfolio

### Decision 3: Project Image and Visual Assets

- **Decision**: Use a screenshot or representative image of the AI-BOARD interface as the project card image
- **Policy Applied**: AUTO (resolved as CONSERVATIVE)
- **Confidence**: Medium (score: 0.6) - No image was provided, but every project requires an image per the schema
- **Fallback Triggered?**: Yes - defaulted to CONSERVATIVE to ensure visual consistency
- **Trade-offs**:
  1. Requires obtaining/creating an appropriate screenshot before implementation
  2. Image must match the quality and style of other project cards
- **Reviewer Notes**: User should provide or approve the image before implementation; placeholder can be used initially

## User Scenarios & Testing

### User Story 1 - Discover AI-BOARD as Featured Project (Priority: P1)

A portfolio visitor explores the projects section and discovers AI-BOARD as a prominently featured project that powers the portfolio they are viewing. They can understand what AI-BOARD does and navigate to see it in action.

**Why this priority**: This is the core value delivery - showcasing AI-BOARD as both a featured project and the tool behind the portfolio creates a compelling meta-narrative for visitors.

**Independent Test**: Can be fully tested by navigating to the projects section and verifying AI-BOARD appears as a featured project with working external link.

**Acceptance Scenarios**:

1. **Given** a visitor is on the portfolio homepage, **When** they scroll to the projects section, **Then** they see AI-BOARD displayed as a featured project with title, description, and project image
2. **Given** a visitor views the AI-BOARD project card, **When** they click on it or its external link, **Then** they are directed to https://ai-board-three.vercel.app/ in a new tab
3. **Given** the projects section displays featured projects, **When** AI-BOARD is rendered, **Then** it appears with high visual prominence (displayOrder: 1)

---

### User Story 2 - See Portfolio Attribution (Priority: P2)

A portfolio visitor notices the footer attribution and understands that the portfolio is powered by AI-BOARD, creating interest in the tool and linking to the featured project.

**Why this priority**: Footer attribution reinforces the AI-BOARD branding and provides an additional discovery path, but is secondary to the main project showcase.

**Independent Test**: Can be fully tested by scrolling to any page footer and verifying the "Powered by AI-BOARD" text and link.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page of the portfolio, **When** they view the footer, **Then** they see "Powered by AI-BOARD" instead of "Built with Astro and Bun"
2. **Given** the footer displays "Powered by AI-BOARD", **When** a visitor clicks the AI-BOARD link, **Then** they are directed to https://ai-board-three.vercel.app/ in a new tab
3. **Given** the footer is rendered, **When** viewed on any device size, **Then** the AI-BOARD attribution is legible and properly styled

---

### Edge Cases

- What happens when the AI-BOARD URL becomes unavailable? Links should still function; user would see the external site's error page.
- How does the footer behave on very small screens? The text "Powered by AI-BOARD" should wrap appropriately and remain readable.

## Requirements

### Functional Requirements

- **FR-001**: System MUST display AI-BOARD as a featured project in the projects section
- **FR-002**: AI-BOARD project card MUST include title "AI-BOARD", description, representative image, and relevant technology tags
- **FR-003**: AI-BOARD project MUST link to https://ai-board-three.vercel.app/ via external URL
- **FR-004**: AI-BOARD project MUST have displayOrder: 1 to appear first among featured projects
- **FR-005**: Footer MUST display "Powered by AI-BOARD" text replacing "Built with Astro and Bun"
- **FR-006**: Footer AI-BOARD link MUST navigate to https://ai-board-three.vercel.app/ in a new tab
- **FR-007**: All external links to AI-BOARD MUST open in a new tab to preserve user session on portfolio

### Key Entities

- **AI-BOARD Project**: A content collection entry representing the AI-BOARD project with fields: title, description, image, imageAlt, technologies, featured (true), displayOrder (1), status (completed), startDate, externalUrl, tags
- **Footer Attribution**: Text element in footer component displaying portfolio tooling credit

## Success Criteria

### Measurable Outcomes

- **SC-001**: Visitors can discover AI-BOARD within the first 3 projects visible in the projects section
- **SC-002**: 100% of external links to AI-BOARD successfully navigate to the target URL
- **SC-003**: Footer attribution is visible on all pages without horizontal scrolling on viewports 320px and wider
- **SC-004**: AI-BOARD project card loads and displays within the same performance envelope as existing project cards (no visual lag)
- **SC-005**: Project card hover states and animations work identically to existing featured projects
