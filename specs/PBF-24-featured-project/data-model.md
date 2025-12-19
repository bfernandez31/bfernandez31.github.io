# Data Model: Featured Project Section

**Feature Branch**: `PBF-24-featured-project`
**Date**: 2025-12-19

## Entities

### FeaturedProject (read-only view)

This feature does not introduce new data entities. It reads from the existing **Project** entity in Astro Content Collections.

**Source**: `src/content/projects/ai-board.md`
**Schema**: `src/content/config.ts` → `projectsCollection`

#### Existing Schema (reference)

```typescript
// From src/content/config.ts
const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    externalUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean().default(false),       // ← Filter criterion
    displayOrder: z.number().int().positive(),
    status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
```

#### AI-BOARD Entry (current data)

```yaml
---
title: "AI-BOARD"
description: "AI-powered project management board that leverages Claude AI to streamline development workflows and automate task specifications"
image: "/images/projects/ai-board.webp"
imageAlt: "AI-BOARD dashboard interface showing project boards and AI-generated specifications"
technologies: ["TypeScript", "Claude API", "Astro", "GSAP"]
featured: true                                    # ← Enables featured display
displayOrder: 1                                   # ← Highest priority
externalUrl: "https://ai-board-three.vercel.app/"
startDate: 2024-06-01
status: "completed"
tags: ["ai", "productivity", "automation", "spec-kit"]
---
```

## Relationships

```
Content Collection: projects
        │
        └── ai-board.md (featured: true, displayOrder: 1)
                │
                ├──→ FeaturedProject.astro (hero display)
                │
                └──→ ProjectsHexGrid.astro (standard grid item)
```

**Note**: AI-BOARD appears in **both** views:
1. **FeaturedProject** component: Hero-style prominent display at top of Projects section
2. **ProjectsHexGrid** component: Standard hex grid item (preserves existing behavior)

This dual display is intentional - the featured section provides immediate visibility, while the grid maintains content completeness.

## State Transitions

Not applicable - this feature reads static content with no user-modifiable state.

## Validation Rules

All validation is handled by Zod schema in `src/content/config.ts`:

| Field | Validation | Required |
|-------|------------|----------|
| title | Non-empty string | ✅ |
| description | Non-empty string | ✅ |
| technologies | Array of strings | ✅ |
| image | Valid path string | ✅ |
| imageAlt | Non-empty string | ✅ |
| externalUrl | Valid URL format | ❌ |
| featured | Boolean (default: false) | ❌ |
| displayOrder | Positive integer | ✅ |

## Data Access Pattern

```typescript
// FeaturedProject.astro frontmatter
import { getEntry } from 'astro:content';

// Fetch AI-BOARD entry directly by slug
const aiBoard = await getEntry('projects', 'ai-board');

// Type-safe access to data
if (aiBoard) {
  const { title, description, technologies, image, imageAlt, externalUrl } = aiBoard.data;
}
```

## No New Entities Required

This feature leverages the existing content collection infrastructure:
- ✅ Uses existing `projectsCollection` schema
- ✅ Uses existing `ai-board.md` content entry
- ✅ No database or storage changes
- ✅ No new entity types
