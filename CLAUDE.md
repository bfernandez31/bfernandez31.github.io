# portfolio Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-06

## Active Technologies
- **Runtime**: Bun ≥1.0.0 (JavaScript runtime and package manager)
- **Framework**: Astro ≥4.0.0 (static site generator with Islands architecture)
- **Language**: TypeScript 5.0+ (strict mode, native Bun support)
- **Linting**: Biome ≥2.0.0 (unified linter and formatter)
- **Testing**: Bun test runner (built-in, Jest-compatible API)
- **Animation**: GSAP ≥3.13.0 + Lenis ≥1.0.0
- **Deployment**: GitHub Pages (automated via GitHub Actions)
- TypeScript 5.0+ (strict mode, native Bun support) + Astro ≥4.0.0, Biome ≥2.0.0 (linting), GSAP ≥3.13.0 (animations), Lenis ≥1.0.0 (smooth scroll) (002-1506-palette-couleur)
- N/A (CSS custom properties defined in global stylesheet, no data persistence) (002-1506-palette-couleur)
- TypeScript 5.0+ (strict mode) with Bun ≥1.0.0 runtime (003-1507-architecture-globale)
- Static content (Markdown files via Astro Content Collections for blog/projects, JSON for structured data like skills) (003-1507-architecture-globale)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro ≥5.15.3 (static site generator), GSAP ≥3.13.0 (animations), Lenis ≥1.0.42 (smooth scroll) (005-1510-convert-multi)
- Static content (Markdown via Astro Content Collections, JSON data files) (005-1510-convert-multi)
- TypeScript 5.9+ (strict mode) with Bun ≥1.0.0 runtime + Astro 5.15.3 (static site generator), GSAP 3.13.0 (animations), Lenis 1.0.42 (smooth scroll), Biome 2.0.0+ (linting) (011-1522-fix-project)
- Static content (Markdown via Astro Content Collections, JSON data files) - no database (011-1522-fix-project)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + GSAP 3.13.0+ (animation engine), IntersectionObserver API (viewport detection) (012-1516-text-split)
- N/A (client-side animations only, no data persistence) (012-1516-text-split)
- Static JSON data files (src/data/experiences.json, src/data/skills.json) - no database (PBF-21-experience-pro)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, GSAP 3.13.0, Lenis 1.0.42, Biome 2.0.0+ (PBF-22-fix-the-first)
- N/A (static site, no persistence) (PBF-22-fix-the-first)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3 (static site generator), Content Collections (Zod validation) (PBF-23-featured-project)
- Markdown files via Astro Content Collections (src/content/projects/) (PBF-23-featured-project)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3 (static site generator), Content Collections (Zod validation), GSAP 3.13.0 (animations) (PBF-24-featured-project)
- Static Markdown files via Astro Content Collections (`src/content/projects/`) (PBF-24-featured-project)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, GSAP 3.13.0, CSS Custom Properties (PBF-26-copy-of-featured)
- N/A (static site, Markdown via Astro Content Collections) (PBF-26-copy-of-featured)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, CSS Custom Properties (PBF-27-featured-project-issue)
- N/A (static site, CSS-only image fallback) (PBF-27-featured-project-issue)
- TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, GSAP 3.13.0, OGL 1.0.6 (WebGL), Lenis 1.0.42 (PBF-28-rework-the-first)
- N/A (static site, no database) (PBF-28-rework-the-first)

## Project Structure
```
portfolio/
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── layout/       # Header, Footer, BurgerMenu
│   │   ├── sections/     # Hero, FeaturedProject, Experience, ProjectsHexGrid, etc.
│   │   ├── ui/           # Button, Card, etc.
│   │   └── islands/      # Interactive components (client-side)
│   ├── layouts/          # Page templates
│   ├── pages/            # File-based routing
│   ├── scripts/          # Client-side utilities & animations
│   ├── data/             # Static configuration data
│   ├── styles/           # Global styles
│   └── content/          # Content collections
├── public/               # Static assets
├── tests/                # Unit and integration tests
│   ├── unit/
│   └── integration/
├── specs/                # Feature specifications
└── .github/workflows/    # CI/CD automation
```

## Single-Page Architecture

The portfolio uses a single-page architecture with 6 full-viewport sections:

### Navigation Pattern
- **Main sections**: `#hero`, `#about`, `#experience`, `#projects`, `#expertise`, `#contact`
- **URL structure**: All main content accessible via hash anchors (e.g., `/#about`, `/#experience`)
- **Blog**: Separate multi-page section at `/blog` (not included in single-page layout)

### Implementation Details
- **IntersectionObserver**: Tracks active section (30% threshold)
- **Smooth scroll**: Powered by Lenis + GSAP ScrollTrigger
- **Focus management**: Automatic focus on section navigation
- **Deep linking**: Initial page load with hash scrolls to target section
- **History management**: Browser back/forward buttons work correctly

### Navigation Scripts
```javascript
// All five must be initialized in index.astro (order matters!)
initSmoothScroll();        // Initialize Lenis first (exposes window.lenis)
initActiveNavigation();    // Updates active link state
initNavigationLinks();     // Handles link clicks + smooth scroll
initNavigationHistory();   // Handles deep linking + back/forward
initNavigationDots();      // Syncs navigation dots with active section
```

### Section Structure
```astro
<section
  id="hero"
  data-section="hero"
  class="portfolio-section portfolio-section--hero"
  role="main"
  aria-label="Hero section with introduction"
>
  <!-- Content -->
</section>
```

### Redirects
Old page URLs automatically redirect to hash anchors:
- `/about` → `/#about`
- `/experience` → `/#experience`
- `/projects` → `/#projects`
- `/expertise` → `/#expertise`
- `/contact` → `/#contact`

## Commands
```bash
bun install              # Install dependencies
bun run dev              # Start development server (port 4321)
bun run build            # Build for production (includes type check)
bun run preview          # Preview production build
bun run lint             # Check code quality with Biome
bun run format           # Auto-format code with Biome
bun test                 # Run tests with Bun
bun test --watch         # Run tests in watch mode
```

## Code Style

### TypeScript
- **Strict mode enabled** (catch errors at development time)
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over types for object shapes
- Use Zod schemas for runtime validation (content collections)

### Astro Components
- One component per file, PascalCase naming (e.g., `Button.astro`)
- Define Props interface at component top
- Use frontmatter (---) for component logic
- Use `<slot />` for content projection
- Prefer component-scoped styles over global styles
- **Component Organization**:
  - `layout/` - Structural components (Header, Footer, BurgerMenu)
  - `sections/` - Page-specific sections (Hero, AboutIDE, ProjectsHexGrid)
  - `ui/` - Reusable UI primitives (Button, Card, Modal)
  - `islands/` - Client-side interactive components (use sparingly)

### File Naming
- Components: PascalCase (`Button.astro`, `Header.astro`)
- Pages: kebab-case (`index.astro`, `about.astro`)
- Utilities: kebab-case (`format-date.ts`)

### Import Conventions
- Use relative imports for now (alias support planned)
- Group imports: framework → components → utilities → styles
- Use named exports for utilities
- **Script utilities**: Import from `src/scripts/` for animations and client-side logic
- **Data imports**: Import from `src/data/` for static configuration

### CSS and Styling
- **Always** use CSS custom properties for colors (e.g., `var(--color-primary)`)
- **Never** hard-code hex/rgb color values in components
- **Always** include all interaction states: hover, focus, active, disabled
- **Always** use `var(--transition-color)` for color transitions (respects reduced motion)
- Prefer component-scoped styles over global styles
- Use semantic color tokens (primary, secondary) not color names (violet, rose)

### Image Fallback Pattern
- **Always** provide CSS gradient fallback for images that may fail to load
- Use gradient background on image wrapper element: `background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
- Image displays over gradient when loaded successfully
- If image fails, gradient provides visual consistency with brand colors
- Zero JavaScript required - pure CSS solution
- Example: FeaturedProject component image wrapper

### Performance Best Practices
- **Zero JavaScript by default** (Astro Islands architecture)
- Use client directives sparingly (`client:load`, `client:visible`, `client:idle`)
- Optimize images (use Astro's Image component when available)
- Keep component styles scoped
- Use GPU-accelerated properties for animations (transform, opacity)
- **ALWAYS** respect `prefers-reduced-motion` for animations
- Target 60fps on desktop, 30fps on mobile for animations
- Monitor frame rate and adjust animation quality dynamically
- Clean up animation resources on component unmount (event listeners, animation frames)
- Use GSAP `quickTo()` for frequently updated values (position tracking, etc.)
- Pause animations when elements not visible (Intersection Observer)

### Accessibility Standards
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Maintain WCAG 2.1 AA color contrast
- Support screen readers with ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`)
- **ALWAYS** respect `prefers-reduced-motion` preferences
- Implement focus trapping for modals and overlays
- Return focus to trigger element when closing overlays
- Decorative animations must not convey essential information
- Provide static fallbacks for all animations

## Animation Patterns

### GSAP Animations
- **Always** register plugins before use: `gsap.registerPlugin(ScrollTrigger)`
- Use `gsap.fromTo()` for explicit start/end states
- Use `gsap.quickTo()` for high-frequency updates (60fps position tracking)
- Set global defaults via `gsap.defaults({ ease, duration })`
- Clean up on unmount: Listen for `astro:before-swap` event

### Canvas Animations
- Use Canvas 2D for particle systems and generative art
- Support high-DPI displays: Set canvas dimensions to `width * devicePixelRatio`
- Use `requestAnimationFrame` for animation loops
- Implement pause/resume when canvas not visible (Intersection Observer)
- Clean up: Cancel animation frame, clear canvas context

### Lenis Smooth Scroll
- Initialize with `initSmoothScroll()` from `src/scripts/smooth-scroll.ts` (call before navigation scripts)
- Configured with easeOutCubic easing (0.6s duration) for responsive feel (optimized from 1.2s in 011-1522)
- Section snap removed for more natural free scrolling (optimized in 011-1522)
- Device tier aware: automatically disabled on LOW tier devices for better performance
- Integrates with GSAP ScrollTrigger via `gsap.ticker`
- Exposed on `window.lenis` for navigation system compatibility
- **Always** check `prefersReducedMotion()` before initialization - returns null if user prefers reduced motion
- Progressive enhancement: Falls back to native scroll if initialization fails
- Use `scrollToElement(target, options)` for programmatic smooth scrolling
- Use `stopSmoothScroll()` / `startSmoothScroll()` to pause/resume (e.g., during modal open)
- Clean up: Call `destroySmoothScroll()` on page navigation

### Scroll Progress Indicators
- Use `ScrollProgress.astro` component for visual scroll tracking
- Place in layout before other fixed elements for proper z-index layering
- Initialize with `initScrollProgress()` from `src/scripts/scroll-progress.ts`
- Automatically integrates with Lenis smooth scroll for synchronized updates
- Falls back to native scroll events if Lenis unavailable
- Uses `requestAnimationFrame` throttling for performance
- Always include ARIA progressbar role and attributes for accessibility
- Set `pointer-events: none` to prevent interaction interference
- Respects `prefers-reduced-motion` by disabling transitions
- Use CSS `width` property (not transform) for visual clarity
- Handle edge cases: no scrollable content, resize events
- Clean up: Remove listeners and cancel animation frames on unmount

### Glitch Effect (Feature: 013-title-hero-glitch)
- Use `.glitch-effect` CSS class for cyberpunk-style RGB channel separation animation
- Location: `src/styles/effects/glitch.css` (automatically imported via `global.css`)
- Pure CSS implementation (zero JavaScript overhead)
- Hover-triggered on desktop devices (`:hover` state)
- GPU-accelerated `text-shadow` property with 0.3s animation
- Two animation variants:
  - `.glitch-effect` - Default RGB offset animation
  - `.glitch-effect.glitch-effect--alt` - Alternative variant for variety
- Full accessibility support:
  - Respects `prefers-reduced-motion` (disables animation, shows static RGB offset)
  - Desktop only: `@media (hover: hover) and (pointer: fine)`
  - Touch devices: Static effect on `:active` (no animation for performance)
- Usage example:
  ```astro
  <!-- Basic glitch effect -->
  <h1 class="glitch-effect">Hero Title</h1>

  <!-- With alternative animation -->
  <h1 class="glitch-effect glitch-effect--alt">Alternative</h1>
  ```
- ~2KB CSS footprint, no runtime overhead
- Browser-native CSS animation (Chrome 90+, Firefox 88+, Safari 14+)
- Graceful degradation on older browsers (text remains readable)

### Hero Section Animations (Feature: PBF-22-fix-the-first)
- Simple CSS-based fade-in animation for hero content
- Location: `src/components/sections/Hero.astro` (component-scoped styles)
- No text splitting or character-by-character animations
- Progressive enhancement: text visible before JavaScript executes
- Animation pattern:
  ```css
  .hero__content {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .hero__content.visible {
    opacity: 1;
    transform: translateY(0);
  }
  ```
- Full accessibility support:
  - Respects `prefers-reduced-motion` (instant reveal with no animation)
  - Text always visible to screen readers (no complex DOM manipulation)
  - GPU-accelerated properties only (opacity, transform)
- Triggered via `requestAnimationFrame` on page load
- Minimal footprint: ~100 bytes CSS + ~50 bytes JS
- Reliable across all devices (no risk of invisible/null text)

### Text Split Animations (Feature: 012-1516-text-split)
- Use declarative HTML API via `data-split-text` attribute for text reveal animations
- Initialize with `initTextAnimations()` from `src/scripts/text-animations.ts`
- Three splitting modes:
  - `data-split-text="char"` - Character-by-character reveal (headlines, short text <100 chars)
  - `data-split-text="word"` - Word-by-word reveal (section titles, medium text 100-300 chars)
  - `data-split-text="line"` - Line-by-line reveal (paragraphs, long text >300 chars)
- Automatic viewport-based triggering via IntersectionObserver (50% threshold, trigger once only)
- Full accessibility support:
  - Original text preserved in visually-hidden span (`.sr-only` class) for screen readers
  - Split fragments wrapped in `aria-hidden="true"` container
  - Respects `prefers-reduced-motion` preference (instant reveal with no animation)
- Customization via data attributes:
  - `data-split-duration="0.8"` - Animation duration per fragment (default: 0.6s)
  - `data-split-delay="0.1"` - Stagger delay between fragments (default: 0.05s for char/word, 0.1s for line)
  - `data-split-easing="power2.out"` - GSAP easing function (default: power3.out)
- Performance limits:
  - Warning at 500 fragments (console.warn)
  - Hard limit at 1000 fragments (skip animation with console.error)
  - GPU-accelerated properties only (opacity, transform translateY)
- Usage example:
  ```astro
  <h1 data-split-text="char">Animated Headline</h1>
  <h2 data-split-text="word" data-split-delay="0.08">Section Title</h2>
  <p data-split-text="line" data-split-duration="0.4">Paragraph reveal</p>

  <script>
    import { initTextAnimations } from '@/scripts/text-animations';
    initTextAnimations();
  </script>
  ```
- Automatic cleanup on page navigation via `astro:before-swap` event listener
- Line splitting uses `Range.getClientRects()` for visual line break detection (calculated at init, not recalculated on resize)
- Known limitation: Nested HTML tags (strong, em) are stripped by `textContent` - use plain text only
- Zero new dependencies (uses existing GSAP 3.13.0+)

### Reduced Motion Support
```typescript
// Check preference before animating
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Use static alternative or instant transitions
  gsap.set(element, { opacity: 1 }); // Instead of animated fade
} else {
  // Full animation
  gsap.to(element, { opacity: 1, duration: 0.6 });
}
```

### Focus Management
```typescript
// Trap focus in overlays
import { trapFocus } from '@/scripts/accessibility';

const cleanup = trapFocus(menuElement);
// Later: cleanup() to remove listeners
```

### Resource Cleanup
```astro
<script>
  // Initialize animation
  const animation = new NeuralNetworkAnimation(canvas);

  // Clean up on page navigation
  document.addEventListener('astro:before-swap', () => {
    animation.destroy(); // Remove listeners, cancel frames
  });
</script>
```

## Performance Utilities (Feature: 011-1522)

### Device Tier Detection
- Use `detectDeviceTier()` from `src/scripts/performance/device-tier.ts` to classify devices
- Three tiers: HIGH (modern desktop), MID (mid-range laptop/mobile), LOW (old devices)
- Classification based on: CPU cores, memory, connection speed, screen size
- Access globally via `window.__DEVICE_TIER__` (set in PageLayout.astro)
- CSS custom property `--device-tier` available for styling optimizations
- Use tier to adapt: particle counts, FPS targets, feature availability (cursor, smooth scroll)
- Configuration in `src/config/performance.ts` (DEVICE_TIER_CONFIG)

### Performance Monitor (Development Only)
- Use `performanceMonitor` from `src/scripts/performance/performance-monitor.ts`
- Automatically enabled in dev mode (PageLayout.astro checks `import.meta.env.DEV`)
- Tracks: FPS via requestAnimationFrame, Core Web Vitals (LCP, FID, CLS), memory usage
- Budget violation detection: compares metrics against PERFORMANCE_CONFIG.budget
- Console reports every 30s, budget checks every 5s
- Access via `performanceMonitor.getReport()` for current metrics
- Clean up: Call `performanceMonitor.stopMonitoring()` on unmount

### Lazy Loading System
- Use `lazyLoader` from `src/scripts/performance/lazy-loader.ts` for deferred initialization
- Priority levels: IMMEDIATE (hero), HIGH (first scroll), MEDIUM (after 1s), LOW (after 2s idle)
- Examples: scroll progress (first scroll), navigation dots (hero exit)
- Reduces initial bundle size by deferring non-critical components
- Error handling: graceful fallback if lazy load fails (site remains functional)
- Usage: `lazyLoader.load(callback, { priority: 'HIGH', timeout: 2000 })`

### Progressive Enhancement Pattern
```typescript
// Wrap all animation initialization in try-catch
try {
  initSmoothScroll();
  initNeuralNetwork();
} catch (error) {
  console.error('Animation failed:', error);
  // Site remains functional with native behavior
}
```

### Performance Configuration
- Central config in `src/config/performance.ts`
- Defines: performance budgets, device tier mappings, FPS targets
- Budget thresholds: Lighthouse scores, Core Web Vitals, bundle sizes
- Device tier capabilities: particle counts, animation quality, feature flags
- Used by: device tier detection, performance monitor, animation systems

## Testing Patterns
- Unit tests in `tests/unit/` for components and utilities
- Integration tests in `tests/integration/` for pages and features
- Use Bun's built-in test runner (Jest-compatible API)
- Test file naming: `*.test.ts` or `*.test.tsx`
- Focus on user-facing behavior, not implementation details
- **Animation testing**: Mock `requestAnimationFrame` and test reduced motion handling

## Deployment
- **Automatic**: Push to main branch triggers GitHub Actions workflow
- **Manual**: Run workflow from GitHub Actions tab
- **Target**: GitHub Pages at https://b-fernandez.github.io/portfolio
- **Build verification**: Type check + build + optimize + deploy

## Color Palette

The site uses a comprehensive, accessible Catppuccin Mocha-based color palette with violet/rose theme accents.

### Implementation
- **Location**: `src/styles/theme.css` (imported via `global.css`)
- **Format**: CSS custom properties (CSS variables)
- **Performance**: 0KB JavaScript, ~8KB CSS
- **Accessibility**: All combinations meet WCAG 2.1 AA contrast ratios

### Key Color Tokens
- `--color-background`: Primary dark background (#1e1e2e)
- `--color-text`: Primary light text (#cdd6f4, 12.23:1 contrast ✅)
- `--color-primary`: Violet accent (#cba6f7 - Mauve)
- `--color-secondary`: Rose/Pink accent (#f5c2e7)
- `--color-accent`: Lavender accent (#b4befe)

### Usage Guidelines
- **Always** use CSS custom properties (e.g., `var(--color-primary)`)
- **Never** hard-code hex colors in components
- **Always** use `var(--transition-color)` for color transitions (respects reduced motion)
- **Always** include all interaction states: hover, focus, active, disabled

### Documentation
- Full guide: `docs/color-palette.md`
- Contract: `specs/002-1506-palette-couleur/contracts/theme-tokens.css`
- Quickstart: `specs/002-1506-palette-couleur/quickstart.md`

## Performance Optimization Patterns

### Device Tier Detection
- Use `detectDeviceTier()` from `src/scripts/performance/device-tier.ts` to classify devices
- Three tiers: HIGH (modern desktop), MID (mid-range laptop/mobile), LOW (old devices)
- Classification based on: CPU cores, memory, connection speed, screen size
- Access globally via `window.__DEVICE_TIER__` (set in PageLayout.astro)
- CSS custom property `--device-tier` available for styling optimizations
- Use tier to adapt: particle counts, FPS targets, feature availability (cursor, smooth scroll)
- Configuration in `src/config/performance.ts` (DEVICE_TIER_CONFIG)

### Performance Monitor (Development Only)
- Use `performanceMonitor` from `src/scripts/performance/performance-monitor.ts`
- Automatically enabled in dev mode (PageLayout.astro checks `import.meta.env.DEV`)
- Tracks: FPS via requestAnimationFrame, Core Web Vitals (LCP, FID, CLS), memory usage
- Budget violation detection: compares metrics against PERFORMANCE_CONFIG.budget
- Console reports every 30s, budget checks every 5s
- Access via `performanceMonitor.getReport()` for current metrics
- Clean up: Call `performanceMonitor.stopMonitoring()` on unmount

### Lazy Loading System
- Use `lazyLoader` from `src/scripts/performance/lazy-loader.ts` for deferred initialization
- Priority levels: IMMEDIATE (hero), HIGH (first scroll), MEDIUM (after 1s), LOW (after 2s idle)
- Examples: scroll progress (first scroll), navigation dots (hero exit)
- Reduces initial bundle size by deferring non-critical components
- Error handling: graceful fallback if lazy load fails (site remains functional)
- Usage: `lazyLoader.load(callback, { priority: 'HIGH', timeout: 2000 })`

### Progressive Enhancement Pattern
```typescript
// Wrap all animation initialization in try-catch
try {
  initSmoothScroll();
  initNeuralNetwork();
} catch (error) {
  console.error('Animation failed:', error);
  // Site remains functional with native behavior
}
```

### Performance Configuration
- Central config in `src/config/performance.ts`
- Defines: performance budgets, device tier mappings, FPS targets
- Budget thresholds: Lighthouse scores, Core Web Vitals, bundle sizes
- Device tier capabilities: particle counts, animation quality, feature flags
- Used by: device tier detection, performance monitor, animation systems

### Performance Best Practices
- **Always** check device tier before initializing performance-intensive animations
- **Always** use lazy loading for non-critical components (scroll progress, nav dots, cursor)
- **Always** implement async initialization for heavy animations (neural network)
- **Always** pause animations when not visible (Intersection Observer)
- **Always** provide static fallbacks (CSS gradients, semantic HTML)
- **Always** clean up resources on unmount (cancel rAF, remove listeners, clear state)
- Target 30fps minimum on MID/LOW tier devices, 60fps on HIGH tier
- Keep critical assets under 200KB, total page weight under 500KB
- Enforce performance budgets via Lighthouse CI (85+ mobile, 95+ desktop)

## Recent Changes
- PBF-28-rework-the-first: Award-winning hero section with WebGL 3D background
  - **REWORKED**: Award-winning hero section with WebGL 3D background (PBF-28-rework-the-first)
    - Replaced Canvas 2D neural network with OGL-powered 3D geometric shapes (cubes, octahedrons, tori)
    - Created modular hero animation system in src/scripts/hero/ (controller, background, cursor, typography, performance monitor)
    - Implemented cursor-reactive parallax effects with GSAP quickTo() for 60fps smooth tracking (desktop only)
    - Added choreographed entrance animation with Typography reveal (headline → subheadline → CTA)
    - Scroll-triggered parallax fade effects and scroll indicator appearing at 50% progress
    - Three-level automatic performance degradation (reduce shapes → disable parallax → CSS gradient fallback)
    - Device tier adaptation: HIGH (10 shapes, 60fps), MID (7 shapes, 30fps), LOW (static gradient, no WebGL)
    - WebGL context loss handling with graceful CSS gradient fallback
    - Total bundle size: ~30KB (OGL 24KB + hero modules 6KB), within 200KB budget
    - Visual concept: Geometric/Architectural 3D forms with Catppuccin Mocha colors (violet/rose/lavender)
    - Progressive enhancement: CSS gradient visible before JS loads, noscript tag ensures content accessibility
    - Full accessibility: reduced motion shows static content instantly, all subsystems disabled for zero overhead
    - Performance targets met: Lighthouse ≥85 mobile/≥95 desktop, LCP <2.5s, CTA visible within 2s
  - TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, GSAP 3.13.0, OGL 1.0.6 (WebGL), Lenis 1.0.42
  - N/A (static site, no database)
- PBF-27-featured-project-issue: Fixed Projects section layout and image fallback
  - **FIXED**: Section title ordering - added unified "Projects" h2 title in src/pages/index.astro before FeaturedProject component
  - Changed ProjectsHexGrid title from h2 "Featured Projects" to h3 "More Projects" for proper heading hierarchy
  - Ensures correct visual hierarchy across all viewport sizes (mobile/tablet/desktop)
  - **ADDED**: CSS gradient fallback for broken project images in FeaturedProject component
  - Image wrapper displays `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` when image fails to load
  - Zero JavaScript - pure CSS solution for image fallback
  - Gradient provides visual consistency with brand colors (violet-to-rose theme)
  - Image displays over gradient when loaded successfully
  - Tested across all breakpoints: mobile (≤767px), tablet (768-1023px), desktop (≥1024px)
  - No new dependencies or technologies added (CSS-only fix)
  - TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, CSS Custom Properties
  - N/A (static site, CSS-only image fallback)
- PBF-26-copy-of-featured: Added TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, GSAP 3.13.0, CSS Custom Properties
- PBF-24-featured-project: Created FeaturedProject section component for AI-BOARD showcase
  - Built dedicated hero-style component (src/components/sections/FeaturedProject.astro) to prominently display AI-BOARD
  - Uses Astro Content Collections `getEntry()` to fetch AI-BOARD project data from src/content/projects/ai-board.md
  - Displays project image (16:9 aspect ratio), title, description, meta-narrative, technology tags, and CTA button
  - Meta-narrative text: "This portfolio was built using AI-BOARD's specification and planning tools"
  - Responsive layout: 60/40 split on desktop (≥1024px), 50/50 on tablet (768-1023px), stacked vertical on mobile (≤767px)
  - Simple CSS-based fade-in animation (opacity + translateY) with prefers-reduced-motion support
  - Full accessibility: semantic HTML (article, h3, ul), ARIA attributes, keyboard navigation, focus indicators
  - Performance optimized: minimal JavaScript (~50 bytes), GPU-accelerated animations, lazy image loading
  - Positioned at top of Projects section (before ProjectsHexGrid) in src/pages/index.astro
  - Technology stack: TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3, Content Collections (Zod validation)
  - Static Markdown files via Astro Content Collections (`src/content/projects/`)
  - Created AI-BOARD project entry in src/content/projects/ai-board.md with displayOrder: 1 (highest priority)
  - AI-BOARD showcases AI-powered project management: specification generation, task breakdown, implementation planning
  - Technologies: TypeScript, Claude API, Astro, GSAP
  - Links to live deployment at https://ai-board-three.vercel.app/
  - Updated all existing project displayOrder values (1→2, 2→3, 3→4, 4→5, 5→6, 6→7) to make room for AI-BOARD
  - Meta-narrative: This portfolio was built using AI-BOARD's specification and planning tools
  - Replaced footer "Built with Astro and Bun" text with "Powered by AI-BOARD" (links to AI-BOARD URL)
  - Full accessibility: link opens in new tab with rel="noopener noreferrer", proper hover/focus states
  - TypeScript 5.9+ (strict mode, native Bun ≥1.0.0 runtime) + Astro 5.15.3 (static site generator), Content Collections (Zod validation)
  - Markdown files via Astro Content Collections (src/content/projects/)
  - **REMOVED**: Custom cursor feature entirely (deleted CustomCursor.astro, custom-cursor.ts)
    - User feedback: "le cursor n'apporte rien" (cursor adds nothing of value)
    - Reduces bundle size by ~8KB and eliminates maintenance burden
    - Site now uses standard system cursor throughout
  - **SIMPLIFIED**: Hero text animations to CSS-based fade-in (removed data-split-text attributes)
    - Replaced buggy character-by-character animations with simple fade-in
    - Text always visible (no risk of invisible/null text)
    - Progressive enhancement: works before JavaScript loads
    - Minimal footprint: ~100 bytes CSS + ~50 bytes JS
  - **FIXED**: Hero spacing with responsive clamp() values
    - Headline margin-bottom: `clamp(1rem, 2.5vw, 2rem)`
    - Subheadline margin-bottom: `clamp(1.5rem, 4vw, 3rem)`
    - Proper visual hierarchy on all viewport sizes (320px to 2560px)
  - **FIXED**: Color consistency using CSS variables
    - Replaced hardcoded `#ffffff` with `var(--color-text)`
    - Replaced hardcoded `#1e1e2e` with `var(--color-background)`
    - All hero elements now use semantic color tokens from theme.css
  - **ADDED**: Accessibility improvements
    - prefers-reduced-motion support for hero fade-in (instant reveal)
    - Text visible to screen readers without complex DOM manipulation
    - GPU-accelerated properties (opacity, transform) for smooth performance
  - Created new Experience section as 3rd section in single-page layout (between About and Projects)
  - Updated navigation from 5 to 6 sections: #hero, #about, #experience, #projects, #expertise, #contact
  - Created src/types/experience.ts TypeScript interface for Experience entity
  - Created src/data/experiences.json with 5 professional positions (2010-present, 14+ years)
  - Created src/components/sections/Experience.astro with timeline visualization
  - Desktop layout (≥1024px): alternating left/right entry positioning for visual variety
  - Mobile/tablet layout (<1024px): stacked vertical timeline layout
  - Added GSAP ScrollTrigger fade-in animations for experience entries
  - Technology tags displayed as interactive badges linking to related skills
  - Semantic HTML using <ol>, <article>, <time> elements for accessibility
  - Updated src/data/skills.json with corrected yearsExperience values based on 2010 career start
  - Added proficiencyLevel ≥2 filter to ExpertiseMatrix.astro (reduced from ~74 to ~25 skills)
  - Updated navigation.ts and sections.ts to add Experience link with displayOrder 3
  - Reordered existing sections: Projects (3→4), Expertise (4→5), Contact (5→6)
  - Added /experience → /#experience URL redirect in Astro config
  - Full keyboard accessibility with focus-visible styles and logical tab order
  - Respects prefers-reduced-motion preference (instant reveal with no animation)
  - Static JSON data files (src/data/experiences.json, src/data/skills.json) - no database
  - Created src/styles/effects/glitch.css with RGB channel separation animation
  - Hover-triggered cyberpunk-style text effect using keyframe animations
  - Two animation variants (glitch and glitch-2) for visual variety
  - 0.3s animation duration with cubic-bezier easing for snappy feel
  - Uses GPU-accelerated text-shadow property (zero JavaScript)
  - Full accessibility: respects prefers-reduced-motion (static fallback), desktop only (hover: hover media query)
  - Touch devices: static RGB offset on :active (no animation for performance)
  - ~2KB CSS footprint, graceful degradation on older browsers
  - Integrated into Hero component headline with .glitch-effect class
  - Added @import "./effects/glitch.css" to global.css
  - Added device tier detection system (HIGH/MID/LOW) in src/scripts/performance/device-tier.ts
  - Created performance monitor (development only) tracking FPS, Core Web Vitals, memory in src/scripts/performance/performance-monitor.ts
  - Implemented lazy loading system with priority levels in src/scripts/performance/lazy-loader.ts
  - Removed cursor trail entirely for better performance (deleted src/scripts/cursor-trail.ts)
  - Optimized smooth scroll: reduced duration 1.2s→0.6s, changed easing to easeOutCubic, removed section snap
  - Optimized custom cursor: disabled on MID/LOW tier devices, simplified MutationObserver to static selectors
  - Optimized neural network: device-based particle counts (50/30/20), async initialization, Intersection Observer pause
  - Lazy loaded non-critical components: scroll progress (first scroll), navigation dots (hero exit)
  - Added progressive enhancement: error boundaries, noscript tag, static CSS gradient fallback
  - Created centralized performance config in src/config/performance.ts
  - Target performance: Lighthouse ≥85 mobile/≥95 desktop, LCP <2.5s, FCP <2s, 30fps animations
  - Created ScrollProgress.astro component with fixed positioning at viewport top
  - Implemented violet-to-rose gradient progress bar (4px height, 3px on high-DPI)
  - Created scroll-progress.ts script for progress tracking and bar updates
  - Integrated with Lenis smooth scroll for synchronized updates
  - Added fallback to native scroll events if Lenis unavailable
  - Implemented requestAnimationFrame throttling for optimal performance
  - Added ARIA progressbar role with live progress values for accessibility
  - Respects prefers-reduced-motion preference (disables transitions)
  - Handles edge cases: no scrollable content, resize events, scroll at top/bottom
  - Positioned above all elements (z-index 9999) with pointer-events: none
  - Added to PageLayout.astro before BurgerMenu for proper layering
  - Created NavigationDots.astro component with fixed positioning (right: 2rem)
  - Implemented active state synchronization with main navigation via MutationObserver
  - Added smooth scroll integration with Lenis library
  - Implemented hover state revealing section labels with fade-in animation
  - Created navigation-dots.ts script for active state management
  - Added responsive behavior (hidden on mobile/tablet <1024px)
  - Ensured full keyboard accessibility with focus indicators
  - Implemented reduced motion support with subtle scale transforms
  - Added visual feedback with scale animation (1.6x active, 1.4x hover)
  - Integrated with existing navigation system (5 navigation scripts total)
  - Configured easeInOutExpo easing for natural momentum feel (1.2s duration)
  - Implemented automatic section snap when scroll velocity drops below threshold
  - Created smooth-scroll.ts utility module with snap functionality
  - Added velocity-based snap detection (triggers at <0.1 velocity)
  - Implemented 150ms debounce for snap trigger to prevent interference
  - Exposed window.lenis for navigation system compatibility
  - Added utility functions: scrollToElement, scrollToTop, stop/startSmoothScroll
  - Integrated with GSAP ticker for smooth updates (lagSmoothing disabled)
  - Respects prefers-reduced-motion (disables smooth scroll when user prefers reduced motion)
  - Consolidated all main content into index.astro with 5 full-viewport sections
  - Implemented hash-based navigation (#hero, #about, #projects, #expertise, #contact)
  - Created active section tracking with IntersectionObserver (30% threshold)
  - Added smooth scroll navigation with Lenis integration
  - Implemented browser history management and deep linking support
  - Added URL redirects from old page paths to hash anchors
  - Created navigation scripts: active-navigation.ts, navigation-links.ts, navigation-history.ts
  - Implemented sections.css with 100vh/100dvh responsive patterns
  - Ensured full accessibility with ARIA landmarks and keyboard navigation
  - Maintained WCAG 2.1 AA compliance and reduced motion support
  - Created neural network hero animation with Canvas 2D (60fps desktop, 30fps mobile)
  - Implemented magnetic burger menu with cursor proximity effect
  - Added adaptive performance system with device tier detection
  - Established animation utilities (GSAP config, Lenis smooth scroll, accessibility helpers)
  - Implemented focus management and keyboard navigation
  - Created centralized animation configuration system
  - Added performance monitoring with frame rate tracking
  - Ensured full accessibility with reduced motion support and ARIA attributes
  - Established component organization: layout/, sections/, ui/, islands/
  - Created data-driven navigation system
  - Created comprehensive Catppuccin Mocha color token system
  - Updated all components to use semantic color tokens
  - Implemented interaction states (hover, focus, active, disabled)
  - Added reduced motion support via `--transition-color` variable
  - Ensured WCAG 2.1 AA contrast compliance across all combinations
  - Added TypeScript 5.0+ with strict mode
  - Configured Biome for linting and formatting
  - Integrated GSAP and Lenis for animations
  - Set up GitHub Pages deployment automation
  - Created component-based architecture
  - Established testing framework with Bun

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
