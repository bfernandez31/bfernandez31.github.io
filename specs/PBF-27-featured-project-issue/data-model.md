# Data Model: Featured Project Layout and Image Fix

**Feature**: PBF-27-featured-project-issue
**Date**: 2025-12-19

## Overview

This feature is a bug fix that does not introduce new data entities. It modifies the presentation layer (HTML/CSS) without affecting the underlying data model.

## Existing Entities (No Changes)

### Project (Content Collection)

**Location**: `src/content/projects/*.md`
**Schema**: Defined in `src/content/config.ts`

```typescript
// Existing schema - NO CHANGES
{
  title: string;
  description: string;
  image: string;           // Path to project image
  imageAlt: string;        // Alt text for accessibility
  technologies: string[];  // Tech stack tags
  featured: boolean;       // Whether to feature prominently
  displayOrder: number;    // Sort order (1 = highest priority)
  externalUrl?: string;    // Optional live site link
  startDate: Date;
  status: "completed" | "in-progress" | "archived";
  tags: string[];
}
```

**AI-BOARD Entry**: `src/content/projects/ai-board.md`
- `displayOrder: 1` (highest priority)
- `featured: true`
- `image: "/images/projects/ai-board.webp"` (path is correct, file is placeholder)

## Assets

### Project Images

**Location**: `public/images/projects/`
**Current State**: All files are 570-byte placeholders

| File | Size | Status |
|------|------|--------|
| ai-board.webp | 570 bytes | Placeholder (broken) |
| data-visualization.webp | 570 bytes | Placeholder |
| ecommerce-platform.webp | 570 bytes | Placeholder |
| mobile-app.webp | 570 bytes | Placeholder |
| neural-portfolio.webp | 570 bytes | Placeholder |
| open-source-library.webp | 570 bytes | Placeholder |
| saas-platform.webp | 570 bytes | Placeholder |
| placeholder.svg | 570 bytes | Placeholder |

**Recommendation**: Future task to replace placeholder images with real screenshots.

## State Transitions

N/A - No state changes in this bug fix.

## Validation Rules

N/A - No new validation rules. Existing content collection validation remains unchanged.

## Relationships

```
index.astro (Page)
├── Projects Section (#projects)
│   ├── [NEW] Section Title (h2)
│   ├── FeaturedProject.astro
│   │   └── ai-board.md (Content Entry)
│   └── ProjectsHexGrid.astro
│       ├── [MODIFIED] Section Title (h3 or removed)
│       └── All project entries (sorted by displayOrder)
```

## Migration

No data migration required. Changes are CSS/HTML only.
