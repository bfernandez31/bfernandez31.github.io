# Technology Stack

## Runtime & Package Management

### Bun (≥1.0.0)

**Purpose**: JavaScript runtime and package manager

**Why Selected**:
- 10-100x faster than npm/yarn for package installation
- Native TypeScript support (no transpilation needed)
- Built-in test runner (no Jest/Vitest required)
- Drop-in Node.js replacement with better performance
- Single binary for multiple tools (runtime, bundler, test runner)

**Usage**:
```bash
# Install dependencies
bun install

# Run scripts
bun run dev
bun run build
bun test
```

**Configuration**:
- `package.json` engines field enforces minimum version
- Uses `bun.lockb` for deterministic dependency resolution

**Version Compatibility**: Minimum 1.0.0 required

## Framework

### Astro (≥4.0.0)

**Purpose**: Static site generator with Islands architecture

**Why Selected**:
- Zero JavaScript by default (optimal performance)
- Islands architecture for selective hydration
- File-based routing (convention over configuration)
- Content collections with type safety
- Built-in optimization (HTML compression, asset hashing)
- Framework-agnostic (can use React, Vue, Svelte components)

**Key Features Used**:
- Static output mode (`output: 'static'`)
- File-based routing in `src/pages/`
- Content collections for type-safe content
- Component-scoped styles
- HTML compression (`compressHTML: true`)

**Configuration** (`astro.config.mjs`):
```javascript
export default defineConfig({
  site: "https://b-fernandez.github.io",
  base: "/portfolio",
  output: "static",
  compressHTML: true,
});
```

**Build Output**:
- Generates static HTML files in `dist/`
- Hashed asset filenames for cache busting
- Minimal JavaScript (only for Islands)
- SEO-optimized HTML

## Language

### TypeScript (5.0+)

**Purpose**: Type-safe JavaScript development

**Why Selected**:
- Bun's native TypeScript support (no compilation step)
- Catch errors at development time
- Better IDE autocomplete and refactoring
- Type-safe content collections
- Strict mode for maximum safety

**Configuration** (`tsconfig.json`):
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

**Key Features**:
- Strict mode enabled
- Path aliases (`@/` → `src/`)
- Astro component type checking
- Zod integration for runtime validation

## Code Quality

### Biome (≥2.0.0)

**Purpose**: Unified linter and formatter

**Why Selected**:
- 10-100x faster than ESLint + Prettier
- Single tool for linting and formatting
- Zero configuration needed
- Compatible with Prettier/ESLint configs
- Git integration for smart caching

**Configuration** (`biome.json`):
```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
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
  }
}
```

**Usage**:
```bash
# Check code quality
bun run lint

# Auto-fix issues and format
bun run format
```

**Checks**:
- Code style consistency
- Common programming errors
- Best practice violations
- Import organization

## Testing

### Bun Test Runner (built-in)

**Purpose**: Unit and integration testing

**Why Selected**:
- Built into Bun runtime (no separate dependency)
- Jest-compatible API (easy migration)
- Faster test execution than Jest/Vitest
- Native TypeScript support
- Snapshot testing included

**Usage**:
```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# Single test file
bun test tests/unit/Button.test.ts
```

**Test Structure**:
```typescript
import { describe, test, expect } from 'bun:test';

describe('Component', () => {
  test('behavior', () => {
    expect(true).toBe(true);
  });
});
```

**Features**:
- Fast execution (milliseconds per test)
- Parallel test running
- Built-in mocking
- Code coverage reporting

## Animation

### GSAP (≥3.13.0)

**Purpose**: High-performance animation library

**Why Selected**:
- Industry-standard animation library
- GPU-accelerated transforms
- 60fps performance
- ScrollTrigger plugin for scroll effects
- Cross-browser compatibility

**Bundle Size**: ~45KB (core + ScrollTrigger)

**Usage Patterns**:
```javascript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Animate element
gsap.to('.element', {
  x: 100,
  duration: 1,
  ease: 'power2.out'
});

// Scroll-triggered animation
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top center',
    end: 'bottom center',
    scrub: true
  },
  y: 100
});
```

**Best Practices**:
- Use GPU-accelerated properties (transform, opacity)
- Respect `prefers-reduced-motion` media query
- Lazy load for non-critical animations
- Reuse timelines for performance

### Lenis (≥1.0.0)

**Purpose**: Smooth scroll library

**Why Selected**:
- Lightweight (~10KB)
- Native-feeling smooth scrolling
- Integrates with GSAP ScrollTrigger
- Touch-friendly on mobile
- Minimal performance impact

**Usage**:
```javascript
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

**Features**:
- Momentum-based scrolling
- Configurable easing
- Scroll direction detection
- Disable/enable programmatically

## Type Checking

### @astrojs/check (≥0.9.0)

**Purpose**: Astro component type checking

**Why Required**:
- Validates Astro component props
- Checks TypeScript in frontmatter
- Integrates with `astro build` command
- Catches template errors at build time

**Usage**:
```bash
# Standalone check
astro check

# Integrated with build
bun run build  # runs astro check first
```

**Validates**:
- Component prop types
- TypeScript errors in components
- Content collection schemas
- Import statements

## Deployment

### GitHub Actions (built-in)

**Purpose**: Automated deployment to GitHub Pages

**Why Selected**:
- Free for public repositories
- Integrated with GitHub
- Simple YAML configuration
- Automatic HTTPS
- Custom domain support

**Workflow** (`.github/workflows/deploy.yml`):
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

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Triggers**:
- Push to main branch
- Manual workflow dispatch

**Process**:
1. Checkout repository
2. Setup Bun runtime
3. Install dependencies
4. Run build (includes type checking)
5. Upload build artifacts
6. Deploy to GitHub Pages

## Dependency Management

### Production Dependencies

**Minimal Set** (3 packages):
```json
{
  "astro": "^5.15.3",           // Framework
  "gsap": "^3.13.0",             // Animation
  "@studio-freight/lenis": "^1.0.42"  // Smooth scroll
}
```

**Bundle Size Impact**:
- Astro: 0KB (build tool, not in bundle)
- GSAP: ~45KB minified
- Lenis: ~10KB minified
- **Total**: ~55KB JavaScript (within 200KB budget)

### Development Dependencies

**Required Tooling** (3 packages):
```json
{
  "@astrojs/check": "^0.9.5",   // Type checking
  "@biomejs/biome": "^2.3.4",   // Linting/formatting
  "typescript": "^5.9.3"         // Type system
}
```

**Not Needed**:
- No transpiler (Bun native TypeScript)
- No test framework (Bun built-in)
- No bundler (Astro built-in)
- No separate formatter (Biome included)

## Performance Characteristics

### Build Performance
- **Installation**: <10 seconds (with Bun)
- **Type Checking**: <2 seconds
- **Build**: <30 seconds
- **Dev Server Startup**: <2 seconds
- **Hot Reload**: <200ms

### Runtime Performance
- **Initial Load**: 0KB JavaScript (pure Astro)
- **With Islands**: Only hydrated component code
- **Time to Interactive**: <3 seconds (3G)
- **Lighthouse Score**: ≥95 (mobile/desktop)

### Resource Usage
- **Disk Space**: ~200MB (including node_modules)
- **Dev Memory**: ~150MB
- **Build Memory**: ~300MB
- **CPU**: Low (efficient build process)

## Browser Support

### Target Browsers
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS Safari 14+, Chrome Android

### JavaScript Target
- ES2020+ (modern browsers)
- No legacy browser support (reduces bundle size)
- Native ESM modules

### CSS Features
- CSS Grid
- CSS Custom Properties
- CSS Container Queries (progressive enhancement)

## Version Compatibility Matrix

| Tool | Minimum Version | Current Version | Notes |
|------|----------------|-----------------|-------|
| Bun | 1.0.0 | 1.0+ | Enforced in package.json |
| Astro | 4.0.0 | 5.15.3 | Static output mode required |
| TypeScript | 5.0.0 | 5.9.3 | Strict mode enabled |
| Biome | 2.0.0 | 2.3.4 | Replaces ESLint + Prettier |
| GSAP | 3.12.0 | 3.13.0 | ScrollTrigger included |
| Node.js | N/A | N/A | Not required (Bun runtime) |

## Technology Decision Rationale

### Why Bun over Node.js?
- **Performance**: 10-100x faster package installation
- **Simplicity**: Single tool for multiple purposes
- **Modern**: Built for TypeScript-first development
- **Future-proof**: Active development and growing ecosystem

### Why Astro over Next.js/Gatsby?
- **Performance**: Zero JavaScript by default
- **Simplicity**: No React runtime needed for static content
- **Flexibility**: Islands architecture for selective interactivity
- **Speed**: Faster builds than other SSGs

### Why Biome over ESLint + Prettier?
- **Speed**: 10-100x faster than ESLint
- **Simplicity**: One tool instead of two
- **Consistency**: Unified configuration
- **Modern**: Built with Rust for performance

### Why GSAP over CSS Animations?
- **Control**: Precise animation control
- **Complexity**: Handle complex animation sequences
- **Performance**: GPU-accelerated, 60fps
- **Compatibility**: Cross-browser consistency

### Why TypeScript over JavaScript?
- **Safety**: Catch errors at development time
- **DX**: Better IDE support and autocomplete
- **Maintenance**: Easier refactoring
- **Documentation**: Types serve as inline docs
