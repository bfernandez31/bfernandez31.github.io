# Project Structure

## Overview

The portfolio follows Astro's convention-based directory structure, optimized for static site generation and component-based development. The structure supports clear separation of concerns, type-safe content management, and efficient build processes.

## Directory Layout

```
portfolio/
├── src/                        # Source code
│   ├── components/             # Reusable Astro components
│   │   ├── layout/             # Structural components (Header, Footer, Nav)
│   │   ├── ui/                 # UI components (Button, Card, Modal)
│   │   └── islands/            # Client-side interactive components
│   ├── layouts/                # Page layout templates
│   │   └── BaseLayout.astro    # Base HTML structure
│   ├── pages/                  # File-based routing
│   │   ├── index.astro         # Homepage (/)
│   │   └── about.astro         # About page (/about)
│   ├── styles/                 # Global styles
│   │   └── global.css          # CSS reset and base styles
│   └── content/                # Content collections
│       └── config.ts           # Collection schemas
├── public/                     # Static assets (served as-is)
│   ├── favicon.svg             # Site favicon
│   ├── robots.txt              # Search engine directives
│   └── assets/                 # Images, fonts, videos
│       └── sample-image.svg    # Example asset
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .github/                    # GitHub configuration
│   └── workflows/              # GitHub Actions
│       └── deploy.yml          # Deployment automation
├── specs/                      # Feature specifications
│   ├── specifications/         # Functional and technical docs
│   └── [feature-id]/           # Individual feature specs
├── .specify/                   # SpecKit configuration
│   ├── memory/                 # Project constitution
│   └── templates/              # Command templates
├── dist/                       # Build output (generated)
└── node_modules/               # Dependencies (generated)
```

## Source Directory (`src/`)

### Components (`src/components/`)

**Purpose**: Reusable UI building blocks organized by type

**Structure**:
- `layout/` - Structural components that define page structure
  - Header, Footer (with "Powered by AI-BOARD" attribution), Navigation
  - BurgerMenu (magnetic menu with neural pathway animations)
- `sections/` - Page-specific section components
  - Hero (neural network canvas animation)
  - FeaturedProject (AI-BOARD showcase with hero-style card layout)
  - Experience (professional experience timeline)
  - AboutIDE, ProjectsHexGrid, ExpertiseMatrix, BlogCommits, ContactProtocol (planned)
- `ui/` - Generic UI elements
  - Buttons, Cards, Modals
  - Forms, Inputs, Dropdowns
  - ScrollProgress (scroll progress indicator)
- `islands/` - Interactive components with client-side JavaScript
  - Framework-specific components (React, Vue, Svelte)
  - Hydrated with Astro's `client:*` directives
  - Used for animations requiring client-side state

**Conventions**:
- One component per file
- PascalCase file names (e.g., `Button.astro`)
- Props interface defined at component top
- Slot usage for content projection

**Example Component**:
```astro
---
// src/components/ui/Button.astro
interface Props {
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
}

const { variant = 'primary', type = 'button' } = Astro.props;
---

<button type={type} class={`btn btn-${variant}`}>
  <slot />
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color var(--transition-color);
  }
  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-background);
  }
  .btn-primary:hover {
    background-color: var(--color-primary-hover);
  }
  .btn-secondary {
    background-color: var(--color-secondary);
    color: var(--color-background);
  }
  .btn-secondary:hover {
    background-color: var(--color-secondary-hover);
  }
</style>
```

### Layouts (`src/layouts/`)

**Purpose**: Define HTML structure and page templates

**Structure**:
- `BaseLayout.astro` - Core HTML structure (head, body, meta tags)
- `BlogLayout.astro` - Blog post template (extends BaseLayout)
- `ProjectLayout.astro` - Project case study template

**Conventions**:
- Layouts wrap page content using `<slot />`
- Define common meta tags, scripts, styles
- Handle site-wide elements (navigation, footer)

**Example Layout**:
```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Portfolio site' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content={description}>
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`}>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pages (`src/pages/`)

**Purpose**: File-based routing (files map to URLs)

**Current Structure**:
- `index.astro` → `/` (single-page layout with 6 sections)
- `blog/` → `/blog/*` (multi-page blog section)
- `404.astro` → `/404` (error page)

**Single-Page Architecture**:
The portfolio uses a single-page layout where all main content is consolidated into `index.astro`:
- Contains 6 full-viewport sections: hero, about, experience, projects, expertise, contact
- Each section has unique `id` and `data-section` attributes
- Navigation uses hash anchors (e.g., `/#about`, `/#experience`, `/#projects`)
- Old page URLs redirect to hash anchors via Astro redirects configuration

**Routing Rules**:
- `index.astro` → `/` (single-page with sections `#hero`, `#about`, `#experience`, `#projects`, `#expertise`, `#contact`)
- `blog/index.astro` → `/blog` (separate multi-page section)
- `blog/[slug].astro` → `/blog/post-title` (dynamic routes)
- Redirects: `/about` → `/#about`, `/experience` → `/#experience`, `/projects` → `/#projects`, `/expertise` → `/#expertise`, `/contact` → `/#contact`

**Conventions**:
- Import and use layouts
- Define frontmatter for page-specific logic
- Use `getStaticPaths()` for dynamic routes
- Export `prerender = true` for static generation
- Use semantic HTML with proper ARIA landmarks for sections

**Example Single-Page Structure**:
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/sections/Hero.astro';
import AboutIDE from '../components/sections/AboutIDE.astro';
import Experience from '../components/sections/Experience.astro';
import ProjectsHexGrid from '../components/sections/ProjectsHexGrid.astro';
import ExpertiseMatrix from '../components/sections/ExpertiseMatrix.astro';
import ContactProtocol from '../components/sections/ContactProtocol.astro';
---

<BaseLayout title="Portfolio">
  <section id="hero" data-section="hero" class="portfolio-section portfolio-section--hero" role="main" aria-label="Hero section with introduction">
    <Hero />
  </section>

  <section id="about" data-section="about" class="portfolio-section portfolio-section--about" role="region" aria-label="About section">
    <AboutIDE />
  </section>

  <section id="experience" data-section="experience" class="portfolio-section portfolio-section--experience" role="region" aria-label="Professional experience timeline">
    <Experience />
  </section>

  <section id="projects" data-section="projects" class="portfolio-section portfolio-section--projects" role="region" aria-label="Projects showcase">
    <FeaturedProject />
    <ProjectsHexGrid />
  </section>

  <section id="expertise" data-section="expertise" class="portfolio-section portfolio-section--expertise" role="region" aria-label="Expertise and skills">
    <ExpertiseMatrix />
  </section>

  <section id="contact" data-section="contact" class="portfolio-section portfolio-section--contact" role="region" aria-label="Contact information">
    <ContactProtocol />
  </section>

  <script>
    import { initActiveNavigation } from '@/scripts/active-navigation';
    import { initNavigationLinks } from '@/scripts/navigation-links';
    import { initNavigationHistory } from '@/scripts/navigation-history';

    initActiveNavigation();
    initNavigationLinks();
    initNavigationHistory();
  </script>
</BaseLayout>
```

### Styles (`src/styles/`)

**Purpose**: Global styles, design tokens, CSS utilities

**Structure**:
- `global.css` - CSS reset, base styles, imports theme.css and sections.css
- `theme.css` - Color palette tokens (Catppuccin Mocha-based)
- `sections.css` - Section layout styles for single-page architecture (100vh/100dvh patterns)
- `animations.css` - Global animation styles, GPU-accelerated transitions, reduced-motion queries
- `utilities.css` - Utility classes (optional)

**Conventions**:
- Imported in BaseLayout
- Use CSS custom properties for design tokens
- All colors referenced via `var(--color-*)` tokens
- Minimal global styles (prefer component styles)

**Example Global CSS**:
```css
/* src/styles/global.css */
@import './theme.css';  /* Loads color palette tokens */

:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'Courier New', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
  background-color: var(--color-background);
  color: var(--color-text);
}
```

### Content (`src/content/`)

**Purpose**: Type-safe content collections with validated schemas

**Structure**:
- `config.ts` - Define collection schemas with Zod
- `blog/` - Blog post markdown files (planned)
- `projects/` - Project case study markdown files with frontmatter metadata

**Projects Collection**:
The portfolio includes featured projects displayed in the Projects section. Each project is defined as a Markdown file in `src/content/projects/` with frontmatter metadata.

**Project Schema**:
- `title`: Project name (string)
- `description`: Brief project description (string)
- `image`: Project image path (string)
- `imageAlt`: Image alt text for accessibility (string)
- `technologies`: Array of technology names (string[])
- `featured`: Whether to feature on homepage (boolean)
- `displayOrder`: Display priority (number, 1 = highest)
- `externalUrl`: Live project URL (string, optional)
- `startDate`: Project start date (date)
- `status`: Project status (completed, in-progress, planned)
- `tags`: Topic tags for filtering (string[])

**Example: AI-BOARD Project** (`src/content/projects/ai-board.md`):
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
```

**Conventions**:
- Define Zod schemas for type safety
- Use frontmatter for metadata
- Markdown or MDX for content body
- Query with `getCollection()` or `getEntry()` API
- Projects with `featured: true` appear in FeaturedProject component
- `displayOrder` controls visual hierarchy (1 = top priority)

**FeaturedProject Component** (`src/components/sections/FeaturedProject.astro`):
The FeaturedProject component provides a hero-style showcase for the AI-BOARD project at the top of the Projects section.

**Implementation Details**:
```typescript
// Data fetching
import { getEntry } from "astro:content";
const aiBoard = await getEntry("projects", "ai-board");
```

**Component Structure**:
- `<article>` wrapper with `featured-project` class and `aria-labelledby` attribute
- Featured label overlay positioned absolutely in top-left corner
- Image wrapper with 16:9 aspect ratio and overflow hidden
- Content section with title, description, meta-narrative, technology tags, and CTA
- Conditional rendering: only displays if `aiBoard` data exists

**Styling Pattern**:
- CSS custom properties for spacing, colors, and transitions
- Desktop: Flexbox with 60/40 split (image 60%, content 40%)
- Tablet (768px-1023px): 50/50 split for balance
- Mobile (≤767px): `flex-direction: column` for vertical stacking
- Background: `var(--color-surface)` with large border radius
- Technology tags: Semi-transparent primary color background (`hsl(267 84% 81% / 0.15)`)
- CTA button: Full interaction states with semantic color tokens

**Animation Implementation**:
```typescript
// Client-side script for fade-in
const featured = document.querySelector('.featured-project');
if (featured && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  requestAnimationFrame(() => {
    featured.classList.add('visible');
  });
}
```

**Accessibility Features**:
- Semantic HTML: `<article>`, `<h3>`, `<ul>`, `<time>` elements
- ARIA attributes: `aria-labelledby`, `aria-label`, `aria-hidden`
- Keyboard navigation: Full tab order through content and CTA
- Focus indicators: `outline: 2px solid var(--color-primary-focus)`
- Screen reader support: Descriptive labels and alt text
- Image optimization: `loading="lazy"`, `decoding="async"`

**Performance Characteristics**:
- Static data fetching at build time (no runtime overhead)
- Minimal JavaScript: ~50 bytes for fade-in animation
- GPU-accelerated CSS animations: opacity and transform only
- Component-scoped styles: no global CSS pollution
- Lazy image loading: reduces initial page weight
- Progressive enhancement: works without JavaScript

### Scripts (`src/scripts/`)

**Purpose**: Client-side JavaScript utilities and animation logic

**Structure**:
- `animation-config.ts` - Centralized animation constants and configuration
- `gsap-config.ts` - GSAP initialization and ScrollTrigger setup
- `scroll-animations.ts` - Lenis smooth scroll integration
- `accessibility.ts` - Focus management, keyboard navigation, motion preferences
- `neural-network.ts` - Neural network Canvas animation class
- `magnetic-menu.ts` - Magnetic effect utility for burger menu
- `device-tier.ts` - Device capability detection and performance targeting
- `performance.ts` - Frame rate monitoring and performance utilities
- `active-navigation.ts` - Active section tracking with IntersectionObserver
- `navigation-links.ts` - Navigation link click handler with smooth scroll
- `navigation-history.ts` - Browser history and deep linking management
- `navigation-dots.ts` - Vertical navigation dots synchronization
- `scroll-progress.ts` - Scroll progress tracking and bar updates

**Conventions**:
- Export named functions and classes
- Include JSDoc comments for public APIs
- Check `prefers-reduced-motion` before applying animations
- Clean up resources (event listeners, timers, animation frames)
- Use TypeScript interfaces for configuration objects

### Data (`src/data/`)

**Purpose**: Static structured data for site configuration

**Structure**:
- `navigation.ts` - Navigation links with metadata using hash anchors (e.g., `/#hero`, `/#about`, `/#experience`)
- `pages.ts` - Page metadata for single-page structure (title, description, Open Graph images, canonical URL)
- `sections.ts` - Section configuration data (id, title, aria-label for all 6 sections)
- `experiences.json` - Professional experience entries with timeline data (5 positions from 2010-present)
- `skills.json` - Comprehensive skills matrix with 74 skills across 8 categories (filtered to ~25 with proficiency ≥2)

**Conventions**:
- Use TypeScript for type-safe exports
- Export as constants with clear types
- Keep data separate from component logic
- Use JSON for simple data structures, TypeScript for complex data
- Navigation links use hash anchors for single-page architecture

**Example Navigation Data**:
```typescript
// src/data/navigation.ts
export const navigationLinks = [
  { text: 'Home', path: '/#hero', displayOrder: 1, ariaLabel: 'Navigate to hero section' },
  { text: 'About', path: '/#about', displayOrder: 2, ariaLabel: 'Navigate to about section' },
  { text: 'Experience', path: '/#experience', displayOrder: 3, ariaLabel: 'Navigate to experience section' },
  { text: 'Projects', path: '/#projects', displayOrder: 4, ariaLabel: 'Navigate to projects section' },
  { text: 'Expertise', path: '/#expertise', displayOrder: 5, ariaLabel: 'Navigate to expertise section' },
  { text: 'Contact', path: '/#contact', displayOrder: 6, ariaLabel: 'Navigate to contact section' },
];
```

**Example Experience Data**:
```json
// src/data/experiences.json
{
  "experiences": [
    {
      "id": "cdc-frontend-2023",
      "role": "Tech Lead Frontend",
      "company": "Caisse des dépôts et consignations",
      "location": "Toulouse",
      "startDate": "2023",
      "endDate": null,
      "description": "Projet MADPS - Développement et TMA de l'application SAU",
      "achievements": [
        "Migration Angular 13 vers 17",
        "Mise en place CI/CD avec Jenkins"
      ],
      "technologies": ["angular", "typescript", "git", "jenkins"],
      "type": "full-time",
      "displayOrder": 1
    }
  ]
}
```

**Example Skills Data**:
```json
// src/data/skills.json
{
  "categories": [
    { "id": "frontend", "name": "Frontend Development", "displayOrder": 1 },
    { "id": "backend", "name": "Backend Development", "displayOrder": 2 },
    { "id": "devops", "name": "DevOps & Infrastructure", "displayOrder": 3 },
    { "id": "database", "name": "Database & Storage", "displayOrder": 4 },
    { "id": "testing", "name": "Testing & Quality", "displayOrder": 5 },
    { "id": "design", "name": "Design & Architecture", "displayOrder": 6 },
    { "id": "tools", "name": "Tools & Workflow", "displayOrder": 7 },
    { "id": "soft-skills", "name": "Soft Skills & Management", "displayOrder": 8 }
  ],
  "skills": [
    {
      "id": "angular",
      "name": "Angular",
      "category": "frontend",
      "proficiencyLevel": 4,
      "yearsExperience": 10,
      "relatedProjects": [],
      "icon": "angular"
    },
    {
      "id": "spring-boot",
      "name": "Spring Boot",
      "category": "backend",
      "proficiencyLevel": 3,
      "yearsExperience": 8,
      "relatedProjects": [],
      "icon": "spring"
    }
  ]
}
```

**Experience Data Schema**:
- `experiences`: Array of professional experience entries with:
  - `id`: Unique identifier (kebab-case)
  - `role`: Job title/position
  - `company`: Company or organization name
  - `location`: Work location (city)
  - `startDate`: Start date (ISO 8601 YYYY or YYYY-MM format)
  - `endDate`: End date or null for current position
  - `description`: Role description and key responsibilities
  - `achievements`: Array of key accomplishments
  - `technologies`: Array of skill IDs (references skills.json)
  - `type`: Employment type (full-time, contract, freelance, mixed)
  - `displayOrder`: Display order (1 = most recent)

**Skills Data Schema**:
- `categories`: Array of skill categories with unique IDs, display names, and ordering
- `skills`: Array of 74 individual skills (filtered to ~25 with proficiency ≥2) with:
  - `id`: Unique identifier (kebab-case)
  - `name`: Display name
  - `category`: Reference to category ID
  - `proficiencyLevel`: Integer 1-5 (1=beginner, 5=expert) - filtered to show ≥2 only
  - `yearsExperience`: Years of professional experience (calculated from 2010 career start)
  - `relatedProjects`: Array of project IDs (linkable to portfolio projects)
  - `icon`: Icon identifier for visual representation

**Example Content Config**:
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## Public Directory (`public/`)

**Purpose**: Static assets served without processing

**Conventions**:
- Files copied directly to build output
- No URL transformation (served at root)
- Reference with `${import.meta.env.BASE_URL}assets/filename`
- Store images, fonts, videos, PDFs

**Asset Organization**:
```
public/
├── favicon.svg              # Site favicon
├── robots.txt               # Search engine directives
├── sitemap.xml              # Site map (auto-generated)
└── assets/
    ├── images/              # Images
    ├── fonts/               # Web fonts
    └── videos/              # Video files
```

## Test Directory (`tests/`)

**Purpose**: Unit and integration tests using Bun test runner

**Structure**:
- `unit/` - Component and utility tests
- `integration/` - Page and feature tests
- `helpers/` - Test utilities and mocks

**Conventions**:
- Test files end with `.test.ts` or `.test.tsx`
- Co-locate tests with source when appropriate
- Use Bun's built-in assertions
- Mock external dependencies

**Example Test**:
```typescript
// tests/unit/components/Button.test.ts
import { describe, test, expect } from 'bun:test';

describe('Button Component', () => {
  test('renders with correct variant class', () => {
    // Test implementation
  });
});
```

## Configuration Files

### `astro.config.mjs`

Astro framework configuration:

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://b-fernandez.github.io",
  base: "/portfolio",
  output: "static",
  compressHTML: true,
});
```

**Key Settings**:
- `site` - Full site URL (required for sitemap, RSS)
- `base` - Base path for deployment (GitHub Pages)
- `output` - Build mode (`static` for static site)
- `compressHTML` - Enable HTML compression

### `tsconfig.json`

TypeScript compiler configuration:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Key Settings**:
- `extends` - Inherit Astro's strict TypeScript config
- `paths` - Import aliases (`@/` → `src/`)

### `biome.json`

Biome linter and formatter configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", "dist", ".astro"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single"
    }
  }
}
```

**Key Settings**:
- `vcs` - Git integration
- `formatter` - Code formatting rules
- `linter` - Code quality rules

### `package.json`

Project manifest and scripts:

```json
{
  "name": "portfolio",
  "type": "module",
  "version": "0.1.0",
  "engines": {
    "bun": ">=1.0.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "lint": "biome check .",
    "format": "biome format . --write",
    "test": "bun test"
  },
  "dependencies": {
    "@studio-freight/lenis": "^1.0.42",
    "astro": "^5.15.3",
    "gsap": "^3.13.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.5",
    "@biomejs/biome": "^2.3.4",
    "typescript": "^5.9.3"
  }
}
```

## Build Output (`dist/`)

Generated during `bun run build`:

```
dist/
├── index.html              # Homepage
├── about.html              # About page
├── _astro/                 # Hashed assets (CSS, JS, images)
├── assets/                 # Copied from public/assets/
├── favicon.svg             # Copied from public/
└── robots.txt              # Copied from public/
```

**Characteristics**:
- Fully static HTML files
- Hashed filenames for cache busting
- Optimized and compressed
- Ready for deployment to any static host

## Import Conventions

### Relative Imports
```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Button from '../components/ui/Button.astro';
```

### Alias Imports (if configured)
```astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Button from '@/components/ui/Button.astro';
```

### Asset Imports
```astro
<img src={`${import.meta.env.BASE_URL}assets/image.svg`} alt="Description" />
```

## Best Practices

### Component Organization
- Group related components in subdirectories
- Keep components small and focused
- Use composition over inheritance
- Prefer Astro components over framework islands

### File Naming
- Use PascalCase for components (`Button.astro`)
- Use kebab-case for pages (`blog-post.astro`)
- Use kebab-case for utility files (`format-date.ts`)

### Code Splitting
- Use Astro Islands for interactive components
- Load JavaScript only where needed
- Prefer static HTML when possible
- Use `client:load`, `client:visible`, `client:idle` strategically

### Performance
- Optimize images (use Astro's Image component)
- Minimize global CSS
- Use component-scoped styles
- Enable HTML compression
- Leverage browser caching with hashed assets
