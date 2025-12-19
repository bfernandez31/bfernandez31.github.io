# Data Model: Featured Project - AI-BOARD

**Feature**: PBF-23-featured-project
**Date**: 2025-12-19
**Status**: Complete

## Overview

This feature adds a new project entry to the existing Astro Content Collections and modifies footer attribution text. No new entities or schema changes are required.

## Entities

### 1. AI-BOARD Project Entry

**Type**: Content Collection Entry (Markdown + YAML frontmatter)
**Collection**: `projects`
**Location**: `src/content/projects/ai-board.md`

#### Schema (Existing - No Changes)

```typescript
// From src/content/config.ts
const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  image: z.string(),
  imageAlt: z.string(),
  externalUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().positive(),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});
```

#### Field Specifications for AI-BOARD

| Field | Type | Value | Validation |
|-------|------|-------|------------|
| title | string | "AI-BOARD" | Required, non-empty |
| description | string | "AI-powered project management board that leverages Claude AI to streamline development workflows and automate task specifications" | Required, non-empty |
| technologies | string[] | ["TypeScript", "Claude API", "Astro", "GSAP"] | Required, at least 1 item |
| image | string | "/images/projects/ai-board.webp" | Required, valid path |
| imageAlt | string | "AI-BOARD dashboard interface showing project boards and AI-generated specifications" | Required, non-empty |
| externalUrl | string (URL) | "https://ai-board-three.vercel.app/" | Optional, valid URL |
| githubUrl | string (URL) | (omitted) | Optional |
| featured | boolean | true | Optional, defaults false |
| displayOrder | number | 1 | Required, positive integer |
| status | enum | "completed" | Optional, defaults "completed" |
| startDate | date | 2024-06-01 | Required |
| endDate | date | (omitted) | Optional |
| tags | string[] | ["ai", "productivity", "automation", "spec-kit"] | Optional |

#### Sample Entry

```yaml
---
title: "AI-BOARD"
description: "AI-powered project management board that leverages Claude AI to streamline development workflows and automate task specifications"
image: "/images/projects/ai-board.webp"
imageAlt: "AI-BOARD dashboard interface showing project boards and AI-generated specifications"
technologies: ["TypeScript", "Claude API", "Astro", "GSAP"]
featured: true
displayOrder: 1
externalUrl: "https://ai-board-three.vercel.app/"
startDate: 2024-06-01
status: "completed"
tags: ["ai", "productivity", "automation", "spec-kit"]
---

# AI-BOARD

AI-powered project management tool that transforms how development teams plan and execute features.

## Key Features

- **AI-Powered Specifications**: Automatically generate detailed feature specifications from brief descriptions
- **Task Breakdown**: Intelligent task decomposition with dependency tracking
- **Implementation Planning**: Structured implementation plans following best practices
- **Visual Board Interface**: Kanban-style project board for tracking progress

## Technical Highlights

Built with modern web technologies and powered by Claude AI for intelligent automation.
The board interface provides real-time updates and smooth animations using GSAP.

## What Powers This Portfolio

This very portfolio was built using AI-BOARD's specification and planning tools,
demonstrating the system's capability to manage real-world development projects.
```

---

### 2. Footer Attribution (Modified Element)

**Type**: Astro Component Content
**Location**: `src/components/layout/Footer.astro`

#### Current State

```astro
<p class="footer__built">
  Built with <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a>
  and <a href="https://bun.sh" target="_blank" rel="noopener noreferrer">Bun</a>
</p>
```

#### New State

```astro
<p class="footer__built">
  Powered by <a href="https://ai-board-three.vercel.app/" target="_blank" rel="noopener noreferrer">AI-BOARD</a>
</p>
```

#### Element Structure

| Element | Class | Content | Attributes |
|---------|-------|---------|------------|
| p | footer__built | "Powered by {link}" | - |
| a | (inherited from parent) | "AI-BOARD" | href, target, rel |

---

## Modified Entities (displayOrder Updates)

The following existing project entries require displayOrder increment:

| File | Before | After | Change |
|------|--------|-------|--------|
| neural-portfolio.md | displayOrder: 1 | displayOrder: 2 | +1 |
| ecommerce-platform.md | displayOrder: 2 | displayOrder: 3 | +1 |
| data-visualization.md | displayOrder: 3 | displayOrder: 4 | +1 |
| mobile-app.md | displayOrder: 4 | displayOrder: 5 | +1 |
| saas-platform.md | displayOrder: 5 | displayOrder: 6 | +1 |
| open-source-library.md | displayOrder: 6 | displayOrder: 7 | +1 |

---

## Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     Content Collections                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ projects/                                            │    │
│  │ ├── ai-board.md (NEW - displayOrder: 1, featured)   │    │
│  │ ├── neural-portfolio.md (displayOrder: 2, featured) │    │
│  │ ├── ecommerce-platform.md (displayOrder: 3, featured)│   │
│  │ ├── data-visualization.md (displayOrder: 4)         │    │
│  │ ├── mobile-app.md (displayOrder: 5)                 │    │
│  │ ├── saas-platform.md (displayOrder: 6, featured)    │    │
│  │ └── open-source-library.md (displayOrder: 7)        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   ProjectsHexGrid.astro                      │
│  • Sorts by displayOrder (ascending)                         │
│  • Filters by featured flag when needed                      │
│  • Renders hexagonal cards with hover animations             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Footer.astro                           │
│  • "Powered by AI-BOARD" link                                │
│  • Links to same external URL as project                     │
│  • Creates cross-reference between footer and projects       │
└─────────────────────────────────────────────────────────────┘
```

---

## State Transitions

**N/A** - This feature does not involve state machines or transitions. All content is static.

---

## Validation Rules

### Project Entry Validation

1. **title**: Non-empty string
2. **description**: Non-empty string, recommended <200 characters for card display
3. **technologies**: Array with at least 1 technology string
4. **image**: Valid path starting with "/" pointing to existing WebP file
5. **imageAlt**: Non-empty descriptive alt text
6. **externalUrl**: Valid URL format (https://)
7. **displayOrder**: Positive integer, unique across all projects
8. **startDate**: Valid date in YYYY-MM-DD format

### Footer Link Validation

1. **href**: Valid HTTPS URL
2. **target**: Must be "_blank" for external links
3. **rel**: Must include "noopener noreferrer" for security

---

## Asset Requirements

### Image Asset

| Property | Value |
|----------|-------|
| Path | /public/images/projects/ai-board.webp |
| Format | WebP |
| Dimensions | ~800x600px or 16:9 aspect |
| Size | <100KB optimized |
| Alt Text | "AI-BOARD dashboard interface showing project boards and AI-generated specifications" |

**Note**: Image asset must exist at build time. Placeholder acceptable for initial development.
