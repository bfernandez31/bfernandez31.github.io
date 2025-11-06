# Portfolio

A modern, high-performance portfolio static site built with **Bun** and **Astro**.

## 🚀 Quick Start

### Prerequisites

- Bun ≥1.0.0 ([Install Bun](https://bun.sh))

### Setup

```bash
# Clone the repository
git clone https://github.com/b-fernandez/portfolio.git
cd portfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:4321/portfolio` to see your site!

## 📂 Project Structure

```
portfolio/
├── src/
│   ├── components/        # Reusable components
│   │   ├── layout/        # Header, Footer, Nav
│   │   ├── ui/            # Buttons, Cards, etc.
│   │   └── islands/       # Interactive components (React/Vue)
│   ├── layouts/           # Page templates
│   │   └── BaseLayout.astro
│   ├── pages/             # File-based routing
│   │   ├── index.astro    # Homepage (/)
│   │   └── about.astro    # About page (/about)
│   ├── styles/            # Global styles
│   │   └── global.css
│   └── content/           # Content collections (blog, projects)
│       └── config.ts      # Collection schemas
├── public/                # Static assets (served as-is)
│   ├── favicon.svg
│   ├── robots.txt
│   └── assets/            # Images, fonts, etc.
│       └── sample-image.svg
├── tests/                 # Test files
│   ├── unit/
│   └── integration/
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Pages deployment
```

### Directory Conventions

**Pages (`src/pages/`)**
- Each `.astro` file becomes a route
- `index.astro` → `/`
- `about.astro` → `/about`
- `blog/index.astro` → `/blog`

**Components (`src/components/`)**
- `layout/` → Structural components (Header, Footer, Nav)
- `ui/` → Reusable UI elements (Button, Card, Modal)
- `islands/` → Interactive components with client-side JavaScript

**Content (`src/content/`)**
- Type-safe content collections for blog posts, projects, etc.
- Define schemas in `config.ts`

**Static Assets (`public/`)**
- Files served as-is (no processing)
- Reference with `${import.meta.env.BASE_URL}assets/filename`

## 🧞 Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server (port 4321) |
| `bun run build` | Build for production (outputs to `dist/`) |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Lint code with Biome |
| `bun run format` | Format code with Biome |
| `bun test` | Run tests with Bun's test runner |

## 🛠️ Tech Stack

- **Runtime**: Bun ≥1.0.0
- **Framework**: Astro ≥4.0.0 (static site generator)
- **Language**: TypeScript 5.0+ (strict mode)
- **Linting**: Biome (10-100x faster than ESLint + Prettier)
- **Animation**: GSAP + Lenis (smooth scrolling)
- **Deployment**: GitHub Pages (automated via GitHub Actions)

## 🎯 Features

- ⚡ **Zero JavaScript by default** (Astro Islands architecture)
- 🎨 **Component-based** (organized by layout, UI, and islands)
- 📱 **Responsive** (mobile-first design)
- ♿ **Accessible** (WCAG 2.1 AA compliant)
- 🚀 **Fast builds** (<30s for typical changes)
- 🔧 **Type-safe** (TypeScript strict mode)
- 🎭 **Smooth animations** (GSAP + ScrollTrigger + Lenis)

## 🧩 Extending the Project

### Adding a New Page

Create a new `.astro` file in `src/pages/`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="New Page">
  <main>
    <h1>New Page Content</h1>
  </main>
</BaseLayout>
```

### Adding a New Component

Create components in appropriate subdirectories:

```astro
---
// src/components/ui/Card.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <slot />
</div>
```

### Adding Static Assets

Place files in `public/assets/` and reference them:

```astro
<img src={`${import.meta.env.BASE_URL}assets/image.png`} alt="Description" />
```

### Adding Content Collections

Define collections in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Bun Documentation](https://bun.sh/docs)
- [Biome Documentation](https://biomejs.dev)
- [GSAP Documentation](https://greensock.com/docs)
- [Project Constitution](./.specify/memory/constitution.md)

## 🚢 Deployment

This project deploys automatically to GitHub Pages when you push to the `main` branch.

### Manual Deployment

```bash
# Build and preview
bun run build
bun run preview

# Deploy (automatic via GitHub Actions)
git push origin main
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
