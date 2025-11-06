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
  - Header, Footer, Navigation
  - Page sections (Hero, Features, Testimonials)
- `ui/` - Generic UI elements
  - Buttons, Cards, Modals
  - Forms, Inputs, Dropdowns
- `islands/` - Interactive components with client-side JavaScript
  - Framework-specific components (React, Vue, Svelte)
  - Hydrated with Astro's `client:*` directives

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
  }
  .btn-primary {
    background: #0070f3;
    color: white;
  }
  .btn-secondary {
    background: #eaeaea;
    color: black;
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

**Routing Rules**:
- `index.astro` → `/`
- `about.astro` → `/about`
- `blog/index.astro` → `/blog`
- `blog/[slug].astro` → `/blog/post-title` (dynamic routes)

**Conventions**:
- Import and use layouts
- Define frontmatter for page-specific logic
- Use `getStaticPaths()` for dynamic routes
- Export `prerender = true` for static generation

**Example Page**:
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Button from '../components/ui/Button.astro';
---

<BaseLayout title="Home">
  <main>
    <h1>Welcome to Portfolio</h1>
    <Button variant="primary">Get Started</Button>
  </main>
</BaseLayout>
```

### Styles (`src/styles/`)

**Purpose**: Global styles, design tokens, CSS utilities

**Structure**:
- `global.css` - CSS reset, base styles, design tokens
- `utilities.css` - Utility classes (optional)
- `animations.css` - GSAP/animation styles (optional)

**Conventions**:
- Imported in BaseLayout
- Use CSS custom properties for design tokens
- Minimal global styles (prefer component styles)

**Example Global CSS**:
```css
/* src/styles/global.css */
:root {
  --color-primary: #0070f3;
  --color-secondary: #eaeaea;
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
}
```

### Content (`src/content/`)

**Purpose**: Type-safe content collections with validated schemas

**Structure**:
- `config.ts` - Define collection schemas
- `blog/` - Blog post markdown files
- `projects/` - Project case study files

**Conventions**:
- Define Zod schemas for type safety
- Use frontmatter for metadata
- Markdown or MDX for content
- Query with `getCollection()` API

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
