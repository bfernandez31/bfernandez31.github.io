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

## Project Structure
```
portfolio/
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── layout/       # Header, Footer, BurgerMenu
│   │   ├── sections/     # Hero, AboutIDE, ProjectsHexGrid, etc.
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

The portfolio uses a single-page architecture with 5 full-viewport sections:

### Navigation Pattern
- **Main sections**: `#hero`, `#about`, `#projects`, `#expertise`, `#contact`
- **URL structure**: All main content accessible via hash anchors (e.g., `/#about`)
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
- Use GSAP `quickTo()` for frequently updated values (cursor tracking, etc.)
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
- Use `gsap.quickTo()` for high-frequency updates (60fps cursor tracking)
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
- Configured with easeInOutExpo easing (1.2s duration) for natural momentum feel
- Section snap enabled: automatically snaps to nearest section when scroll velocity drops
- Integrates with GSAP ScrollTrigger via `gsap.ticker`
- Exposed on `window.lenis` for navigation system compatibility
- **Always** check `prefersReducedMotion()` before initialization - returns null if user prefers reduced motion
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

### Custom Cursor
- Use `CustomCursor.astro` component for branded cursor experience on desktop
- Place in layout (typically in `PageLayout.astro` after other fixed elements)
- Initialize with `initCustomCursor()` from `src/scripts/custom-cursor.ts`
- Automatically disabled on touch devices via CSS media queries
- Uses GSAP `quickTo()` for ultra-smooth 60fps cursor tracking (0.6s duration, power3.out easing)
- Respects `prefers-reduced-motion` by using instant position updates (no smooth following)
- Always set `aria-hidden="true"` and `pointer-events: none` (decorative only)
- Use `mix-blend-mode: difference` for adaptive contrast on any background
- Interactive element detection: automatically scales up on hover over links, buttons, inputs
- Add `data-cursor="hover"` attribute to custom elements for hover detection
- Uses MutationObserver to track dynamically added interactive elements
- Default size: 32px circle (2px border), hover size: 64px circle (3px border)
- Media queries: `@media (hover: hover) and (pointer: fine)` for desktop only
- Clean up: Call `cleanupCustomCursor()` on page navigation (astro:before-swap)

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

## Recent Changes
- 011-1522-fix-project: Added TypeScript 5.9+ (strict mode) with Bun ≥1.0.0 runtime + Astro 5.15.3 (static site generator), GSAP 3.13.0 (animations), Lenis 1.0.42 (smooth scroll), Biome 2.0.0+ (linting)
- 010-title-cursor-trail: Added luminous particle trail to custom cursor
  - Created cursor-trail.ts script with Canvas 2D particle system
  - Implemented fading particle trail with violet glow effect (60fps)
  - Spawns 2 particles per frame at cursor position (max 30 particles)
  - Particles fade from opacity 1 to 0 with size decay (6px to 0)
  - Added shadow blur effect for luminous appearance matching theme
  - High-DPI (Retina) canvas support for crisp rendering
  - Efficient FIFO particle management prevents array growth
  - Respects prefers-reduced-motion preference (trail disabled completely)
  - Automatically disabled on touch devices
  - Full-viewport canvas overlay positioned at z-index: 9999 (below cursor)
  - Integrated with PageLayout.astro with proper initialization and cleanup
  - Uses requestAnimationFrame for smooth 60fps animation loop
  - Minimal memory footprint (~2-3KB JavaScript)
- 009-title-custom-cursor: Added custom cursor with interactive element detection
  - Created CustomCursor.astro component with circular design (32px default, 64px hover)
  - Implemented custom-cursor.ts script with GSAP quickTo for 60fps position tracking
  - Added mix-blend-mode: difference for adaptive contrast on any background
  - Implemented automatic interactive element detection (links, buttons, inputs, custom via data-cursor)
  - Created MutationObserver system to track dynamically added interactive elements
  - Added smooth follow animation with power3.out easing (0.6s duration)
  - Respects prefers-reduced-motion preference (instant position updates, no smooth following)
  - Automatically disabled on touch devices via CSS media queries
  - Maintains state management for cursor position, hover state, and cleanup
  - Added to PageLayout.astro with proper z-index layering (z-index: 10000)
  - Ensured full accessibility (aria-hidden, pointer-events: none, keyboard navigation unaffected)
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
