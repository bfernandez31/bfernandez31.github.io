# Quickstart: Portfolio Static Site Implementation

**Feature**: Project Initialization with Bun and Astro
**Branch**: `001-1505-initialise-le`
**Prerequisites**: Bun ≥1.0.0 installed on your system

---

## 🚀 Quick Start (5 minutes)

### Step 1: Initialize Astro Project with Bun

```bash
# Create new Astro project using Bun
bun create astro@latest

# When prompted:
# - Project name: portfolio (or your choice)
# - Template: Empty
# - TypeScript: Yes, strict
# - Install dependencies: Yes
# - Git repository: Yes (if not already in one)
```

### Step 2: Navigate to Project

```bash
cd portfolio
```

### Step 3: Add Required Dependencies

```bash
# Add production dependencies
bun add astro gsap @studio-freight/lenis

# Add development dependencies
bun add -d @biomejs/biome @astrojs/check typescript
```

### Step 4: Configure Bun Engine

Edit `package.json` and add the `engines` field:

```json
{
  "engines": {
    "bun": ">=1.0.0"
  }
}
```

### Step 5: Initialize Biome

```bash
# Create biome.json configuration
bunx @biomejs/biome init

# This creates biome.json with default settings
```

### Step 6: Update package.json Scripts

Replace the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "lint": "biome check .",
    "format": "biome format . --write",
    "test": "bun test",
    "astro": "astro"
  }
}
```

### Step 7: Configure Astro

Create or update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',  // Replace with your GitHub username
  base: '/portfolio',                       // Or remove if deploying to root
  output: 'static',
  compressHTML: true,
});
```

### Step 8: Create Directory Structure

```bash
# Create component directories
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/components/islands

# Create other essential directories
mkdir -p src/layouts
mkdir -p src/styles
mkdir -p src/content
mkdir -p public/assets
mkdir -p tests/unit
mkdir -p tests/integration
```

### Step 9: Create Base Layout

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Portfolio static site built with Bun and Astro" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Step 10: Update Homepage

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Portfolio">
  <main>
    <h1>Welcome to Portfolio</h1>
    <p>Built with Bun and Astro</p>
  </main>
</BaseLayout>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
</style>
```

### Step 11: Create Global Styles

Create `src/styles/global.css`:

```css
/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}
```

Import in `BaseLayout.astro` (add to `<head>`):

```astro
<link rel="stylesheet" href="/src/styles/global.css" />
```

### Step 12: Add Essential Static Files

Create `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://YOUR_USERNAME.github.io/portfolio/sitemap-index.xml
```

Create `public/favicon.svg` (simple SVG icon):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="60" fill="#4F46E5"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="72" fill="white" font-family="system-ui">P</text>
</svg>
```

### Step 13: Update .gitignore

Ensure `.gitignore` includes:

```
# Dependencies
node_modules/
bun.lockb.bak

# Build outputs
dist/
.astro/

# Environment
.env
.env.local
.env.production

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

### Step 14: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build with Astro
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 15: Start Development Server

```bash
bun run dev
```

Visit `http://localhost:4321` to see your site!

---

## ✅ Verification Checklist

Run these commands to verify successful initialization:

```bash
# 1. Check Bun version
bun --version  # Should be ≥1.0.0

# 2. Verify dependencies installed
bun install  # Should complete without errors

# 3. Run linting
bun run lint  # Should pass with no errors

# 4. Run type checking
bun run build  # Should complete successfully

# 5. Test development server
bun run dev  # Should start server on port 4321

# 6. Test production build
bun run build && bun run preview  # Should build and preview successfully
```

---

## 📦 What You Get

After completing this quickstart, you'll have:

✅ **Bun Runtime**: Fast package manager and JavaScript runtime
✅ **Astro Framework**: Static site generator with 0KB JavaScript default
✅ **TypeScript**: Type-safe development with strict mode
✅ **Biome**: Fast linting and formatting (10-100x faster than ESLint)
✅ **GSAP**: Animation library ready to use
✅ **Lenis**: Smooth scroll library ready to use
✅ **GitHub Actions**: Automated deployment to GitHub Pages
✅ **Directory Structure**: Organized for scalability
✅ **Base Layout**: Reusable HTML structure
✅ **Type Checking**: Astro file type checking with @astrojs/check

---

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server (port 4321) |
| `bun run build` | Build for production (outputs to `dist/`) |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Lint code with Biome |
| `bun run format` | Format code with Biome |
| `bun test` | Run tests with Bun's test runner |

---

## 📂 Directory Structure Reference

```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/        # Header, Footer, Nav
│   │   ├── ui/            # Buttons, Cards, etc.
│   │   └── islands/       # Interactive components (React/Vue)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro    # Homepage (becomes /)
│   ├── styles/
│   │   └── global.css
│   └── content/           # Future: blog, projects (Content Collections)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── assets/            # Images, fonts
├── tests/
│   ├── unit/
│   └── integration/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── tsconfig.json
├── biome.json
├── package.json
└── README.md
```

---

## 🎯 Next Steps

1. **Add Components**: Create reusable components in `src/components/`
2. **Add Pages**: Create new pages in `src/pages/` (automatic routing)
3. **Add GSAP Animations**: Import GSAP in component scripts
4. **Configure Biome**: Customize `biome.json` for your preferences
5. **Add Tests**: Create test files in `tests/` with `.test.ts` extension
6. **Deploy**: Push to `main` branch to trigger GitHub Pages deployment

---

## 🚨 Troubleshooting

### Bun not found
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

### Port 4321 already in use
```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9

# Or use a different port
bun run dev -- --port 3000
```

### TypeScript errors
```bash
# Run type checking
bun run astro check

# Install missing types
bun add -d @types/node
```

### Build fails
```bash
# Clear Astro cache
rm -rf .astro

# Reinstall dependencies
rm -rf node_modules
bun install
```

---

## 📚 Documentation Links

- [Astro Documentation](https://docs.astro.build)
- [Bun Documentation](https://bun.sh/docs)
- [Biome Documentation](https://biomejs.dev)
- [GSAP Documentation](https://greensock.com/docs)
- [Project Constitution](../../.specify/memory/constitution.md)
- [Implementation Plan](./plan.md)
- [Research Decisions](./research.md)

---

## 🎉 Success Criteria

You've successfully initialized the project when:

- ✅ Development server starts without errors
- ✅ Production build completes successfully
- ✅ Linting passes with no errors
- ✅ TypeScript type checking passes
- ✅ GitHub Actions workflow is configured
- ✅ Site loads at `http://localhost:4321`

**Estimated time**: 5-10 minutes for experienced developers, 15-20 minutes for first-time setup.
