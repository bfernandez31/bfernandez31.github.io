# Data Model: Awwwards-Worthy Portfolio Architecture

**Feature**: `003-1507-architecture-globale`
**Date**: 2025-11-06
**Purpose**: Define data structures and content schemas for portfolio content management

---

## Overview

This portfolio uses Astro Content Collections for type-safe content management. All content is authored in Markdown with YAML frontmatter and validated at build time using Zod schemas.

**Storage Strategy**: File-based content (no database)
- **Projects**: Markdown files in `src/content/projects/`
- **Blog Posts**: Markdown files in `src/content/blog/`
- **Skills**: JSON file in `src/data/skills.json`
- **Navigation**: TypeScript configuration in `src/data/navigation.ts`

---

## Content Collections

### 1. Project Collection

**Location**: `src/content/projects/[slug].md`

**Schema** (defined in `src/content/config.ts`):
```typescript
import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    image: z.string(), // Path relative to public/images/projects/
    imageAlt: z.string(),
    externalUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    displayOrder: z.number().int().positive(),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    startDate: z.date(),
    endDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
  })
});
```

**Attributes**:
- `title`: Project name (e.g., "E-Commerce Platform Redesign")
- `description`: Brief summary (2-3 sentences, used in hexagon overlay)
- `technologies`: Array of tech stack items (e.g., ["React", "TypeScript", "Node.js"])
- `image`: Preview image filename (e.g., "ecommerce-preview.webp")
- `imageAlt`: Accessible alt text for image
- `externalUrl`: Live project URL (optional)
- `githubUrl`: Source code repository (optional)
- `featured`: Whether to highlight in hero or featured section
- `displayOrder`: Sort order in hexagonal grid (1 = first)
- `status`: Project completion state
- `startDate`: Project start (ISO 8601 date)
- `endDate`: Project completion (optional, null if in-progress)
- `tags`: Additional categorization (optional, e.g., ["Frontend", "UI/UX"])

**Validation Rules**:
- `title` required, 3-100 characters
- `description` required, 50-300 characters
- `technologies` must have at least 1 item
- `image` must exist in `public/images/projects/`
- URLs must be valid HTTP/HTTPS
- `displayOrder` must be unique per project
- `endDate` must be after `startDate` if provided

**Example Markdown File** (`src/content/projects/ecommerce-platform.md`):
```markdown
---
title: "E-Commerce Platform Redesign"
description: "Complete UI overhaul of a high-traffic e-commerce site, improving conversion rates by 35% through modern design patterns and performance optimization."
technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"]
image: "ecommerce-preview.webp"
imageAlt: "E-commerce platform dashboard showing product grid and checkout flow"
externalUrl: "https://example-shop.com"
githubUrl: "https://github.com/username/ecommerce-platform"
featured: true
displayOrder: 1
status: "completed"
startDate: 2024-01-15
endDate: 2024-06-30
tags: ["Frontend", "UI/UX", "Performance"]
---

## Project Overview

Detailed project description in Markdown format...

## Key Features

- Feature 1
- Feature 2

## Challenges & Solutions

...
```

---

### 2. Blog Post Collection

**Location**: `src/content/blog/[slug].md`

**Schema** (defined in `src/content/config.ts`):
```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // Commit-style message
    commitHash: z.string().regex(/^[a-f0-9]{7}$/), // 7-char hash
    description: z.string(),
    author: z.string().default('Your Name'),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().int().positive().optional(), // minutes
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
  })
});
```

**Attributes**:
- `title`: Commit-style title (e.g., "feat: Implement dark mode with CSS custom properties")
- `commitHash`: Simulated Git commit hash (7 chars, lowercase hex, e.g., "a3f7b2c")
- `description`: Brief summary for list view (1-2 sentences)
- `author`: Post author name
- `publishDate`: Original publication date
- `updatedDate`: Last update timestamp (optional)
- `tags`: Categorization tags (e.g., ["CSS", "Performance", "Accessibility"])
- `draft`: Hide from production builds if true
- `featured`: Highlight in featured posts section
- `readingTime`: Estimated minutes to read (auto-calculated or manual)
- `coverImage`: Header image filename (optional)
- `coverImageAlt`: Alt text for cover image

**Validation Rules**:
- `title` required, follows conventional commit format (optional but recommended)
- `commitHash` must match pattern `/^[a-f0-9]{7}$/`
- `description` required, 50-200 characters
- `tags` must have at least 1 item
- `publishDate` cannot be in the future
- `updatedDate` must be after `publishDate` if provided
- If `coverImage` provided, `coverImageAlt` required

**Example Markdown File** (`src/content/blog/css-custom-properties.md`):
```markdown
---
title: "feat: Implement dark mode with CSS custom properties"
commitHash: "a3f7b2c"
description: "Learn how to build a maintainable dark mode system using CSS custom properties and the prefers-color-scheme media query."
author: "Your Name"
publishDate: 2024-10-15
tags: ["CSS", "Accessibility", "Design Systems"]
draft: false
featured: true
readingTime: 8
coverImage: "dark-mode-preview.webp"
coverImageAlt: "Side-by-side comparison of light and dark mode interfaces"
---

## Introduction

In this post, I'll walk through implementing a dark mode system...

## Code Examples

```css
:root {
  --color-background: #ffffff;
  --color-text: #1e1e2e;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1e1e2e;
    --color-text: #cdd6f4;
  }
}
```

...
```

---

## Data Files (Non-Collection Content)

### 3. Skills Data

**Location**: `src/data/skills.json`

**Structure**:
```typescript
interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'tools';
  proficiencyLevel: 1 | 2 | 3 | 4 | 5; // 1=Beginner, 5=Expert
  yearsExperience: number;
  relatedProjects: string[]; // Array of project slugs
  icon?: string; // Optional icon identifier (e.g., "react", "typescript")
}

interface SkillsData {
  skills: Skill[];
  categories: {
    id: string;
    name: string;
    displayOrder: number;
  }[];
}
```

**Example** (`src/data/skills.json`):
```json
{
  "categories": [
    { "id": "frontend", "name": "Frontend Development", "displayOrder": 1 },
    { "id": "backend", "name": "Backend Development", "displayOrder": 2 },
    { "id": "devops", "name": "DevOps & Infrastructure", "displayOrder": 3 },
    { "id": "design", "name": "Design & UX", "displayOrder": 4 },
    { "id": "tools", "name": "Tools & Workflow", "displayOrder": 5 }
  ],
  "skills": [
    {
      "id": "typescript",
      "name": "TypeScript",
      "category": "frontend",
      "proficiencyLevel": 5,
      "yearsExperience": 4,
      "relatedProjects": ["ecommerce-platform", "portfolio-site"],
      "icon": "typescript"
    },
    {
      "id": "react",
      "name": "React",
      "category": "frontend",
      "proficiencyLevel": 5,
      "yearsExperience": 5,
      "relatedProjects": ["ecommerce-platform", "dashboard-app"],
      "icon": "react"
    }
  ]
}
```

**Validation** (runtime in component):
- `proficiencyLevel` must be 1-5
- `yearsExperience` must be positive integer
- `relatedProjects` slugs must reference existing projects
- All skills in a category must be sorted by `proficiencyLevel` descending

---

### 4. Navigation Links

**Location**: `src/data/navigation.ts`

**Structure**:
```typescript
interface NavigationLink {
  id: string;
  text: string;
  path: string;
  ariaLabel?: string;
  displayOrder: number;
  neuralPathwayConfig?: {
    nodeCount: number;
    color: string; // CSS custom property reference
    animationDuration: number; // seconds
  };
}

export const navigationLinks: NavigationLink[] = [
  {
    id: 'home',
    text: 'Home',
    path: '/',
    displayOrder: 1,
    neuralPathwayConfig: {
      nodeCount: 5,
      color: 'var(--color-primary)',
      animationDuration: 0.6
    }
  },
  {
    id: 'about',
    text: 'About',
    path: '/about',
    ariaLabel: 'Learn about my background and experience',
    displayOrder: 2,
    neuralPathwayConfig: {
      nodeCount: 6,
      color: 'var(--color-accent)',
      animationDuration: 0.7
    }
  },
  // ... more links
];
```

**Attributes**:
- `id`: Unique identifier for link
- `text`: Visible link text
- `path`: Route path (must match Astro page route)
- `ariaLabel`: Optional accessible label (defaults to `text`)
- `displayOrder`: Order in menu (1 = first)
- `neuralPathwayConfig`: Animation configuration for neural pathway effect

---

### 5. Contact Form Submission (Runtime Only)

**Note**: Contact form submissions are handled via third-party service (Formspree/Netlify Forms). No persistent storage in this application.

**Client-Side Validation Schema**:
```typescript
interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  timestamp: Date; // Auto-generated
  honeypot?: string; // Bot detection field (should be empty)
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0, 'Bot detected'), // Should be empty
});
```

**Submission Flow**:
1. Client-side validation using Zod schema
2. POST to Formspree/Netlify endpoint
3. Display terminal-style success/error message
4. No data persisted in this application

---

## Page Route Metadata

**Location**: `src/data/pages.ts`

**Structure**:
```typescript
interface PageMetadata {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  canonicalUrl?: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  home: {
    path: '/',
    title: 'Your Name - Full Stack Developer',
    description: 'Award-winning full stack developer specializing in modern web technologies, performance optimization, and accessible design.',
    ogImage: '/images/og-images/home.webp'
  },
  about: {
    path: '/about',
    title: 'About - Your Name',
    description: 'Learn about my background, experience, and approach to building exceptional web applications.',
    ogImage: '/images/og-images/about.webp'
  },
  projects: {
    path: '/projects',
    title: 'Projects - Your Name',
    description: 'Explore my portfolio of web development projects, from e-commerce platforms to data visualizations.',
    ogImage: '/images/og-images/projects.webp'
  },
  expertise: {
    path: '/expertise',
    title: 'Expertise - Your Name',
    description: 'Technical skills and competencies across frontend, backend, DevOps, and design.',
    ogImage: '/images/og-images/expertise.webp'
  },
  blog: {
    path: '/blog',
    title: 'Blog - Your Name',
    description: 'Insights on web development, performance optimization, and modern JavaScript frameworks.',
    ogImage: '/images/og-images/blog.webp'
  },
  contact: {
    path: '/contact',
    title: 'Contact - Your Name',
    description: 'Get in touch for project inquiries, collaborations, or just to say hello.',
    ogImage: '/images/og-images/contact.webp'
  },
  404: {
    path: '/404',
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
    noindex: true
  }
};
```

---

## Content Relationships

### Project → Skills
- Projects reference skills via `technologies` array (string matching)
- Skills reference projects via `relatedProjects` array (slug matching)
- **Validation**: Ensure bidirectional consistency at build time

### Blog Posts → Projects
- Blog posts can reference projects in content body (manual markdown links)
- No enforced relationship in frontmatter

### Navigation → Pages
- Navigation links reference page routes via `path` attribute
- **Validation**: Ensure all navigation paths exist in Astro routing

---

## State Transitions

### Project Status
```
in-progress → completed
in-progress → archived
completed → archived
```

### Blog Post Draft Status
```
draft (unpublished) → published (draft: false)
published → draft (can revert if needed)
```

---

## Build-Time Validation

All content collections are validated during `bun run build` using Astro's Content Collections API with Zod schemas. Build will fail if:

- Required frontmatter fields are missing
- Data types don't match schema
- Dates are invalid or illogical (e.g., `endDate` before `startDate`)
- URLs are malformed
- Referenced files don't exist (images, related content)

**Validation Script** (optional, `scripts/validate-content.ts`):
```typescript
import { getCollection } from 'astro:content';
import skillsData from '../src/data/skills.json';

// Validate project-skill relationships
const projects = await getCollection('projects');
const skills = skillsData.skills;

for (const project of projects) {
  for (const tech of project.data.technologies) {
    const skillExists = skills.some(s => s.name === tech);
    if (!skillExists) {
      console.warn(`Project "${project.data.title}" references unknown technology: ${tech}`);
    }
  }
}
```

---

## Summary

**Total Entities**: 6 (Projects, Blog Posts, Skills, Navigation Links, Contact Submissions, Page Metadata)
**Storage**: File-based (Markdown + JSON)
**Validation**: Build-time via Zod schemas
**Relationships**: Loose coupling via slug/ID references
**Type Safety**: Full TypeScript support via Astro Content Collections

All data models align with constitutional requirements:
- Zero runtime JavaScript for content rendering
- Type-safe at build time
- SEO-friendly metadata
- Accessible content structure
