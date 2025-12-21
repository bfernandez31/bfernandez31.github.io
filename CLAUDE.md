# Portfolio Development Guidelines

## Active Technologies
- **Runtime**: Bun ≥1.0.0 (JavaScript runtime and package manager)
- **Framework**: Astro 5.15.3 (static site generator with Islands architecture)
- **Language**: TypeScript 5.9+ (strict mode, native Bun support)
- **Linting**: Biome 2.3.4 (unified linter and formatter)
- **Testing**: Bun test runner (built-in, Jest-compatible API)
- **Animation**: GSAP 3.13.0 + Lenis 1.0.42 (smooth scrolling and UI animations)
- **Deployment**: GitHub Pages (automated via GitHub Actions)
- **Data**: Static content (Markdown via Astro Content Collections, JSON data files)
- TypeScript 5.9+ with Astro 5.15.3 + Astro, GSAP 3.13.0, Lenis 1.0.42 (PBF-41-about-rework)
- N/A (static site, no data persistence) (PBF-41-about-rework)
- TypeScript 5.9+ (Astro 5.15.3 components) + Astro, GSAP 3.13.0 (for other animations, not navigation), Lenis 1.0.42 (smooth scroll) (PBF-42-fix-link)

## Project Structure
```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/       # TuiLayout, TopBar, Sidebar, StatusLine, CommandLine, Footer
│   │   ├── sections/     # HeroTui, AboutReadme, ExperienceGitLog, ProjectsTelescope, ExpertiseCheckhealth, ContactTerminal
│   │   ├── ui/           # BufferTab, FileEntry, LineNumbers, TypewriterText, Button, Card
│   │   └── islands/      # Interactive components (client-side)
│   ├── layouts/          # Page templates
│   ├── pages/            # File-based routing
│   ├── scripts/          # Client-side utilities & animations
│   ├── data/             # Static configuration data (JSON)
│   ├── styles/
│   │   └── tui/          # TUI-specific styles (layout, sidebar, statusline, typography, sections, icons, syntax)
│   ├── types/            # TypeScript interfaces
│   └── content/          # Content collections (Markdown)
├── public/
│   └── fonts/            # Self-hosted fonts (JetBrains Mono, Nerd Font subset)
├── tests/
│   ├── unit/
│   └── integration/
└── .github/workflows/    # CI/CD automation
```

## Single-Page Architecture

6 full-viewport sections with hash-based navigation:
- **Sections**: `#hero`, `#about`, `#experience`, `#projects`, `#expertise`, `#contact`
- **Blog**: Separate multi-page section at `/blog`

**Implementation**:
- IntersectionObserver tracks active section (30% threshold)
- Smooth scroll powered by Lenis + GSAP ScrollTrigger
- Deep linking with browser history management

**Navigation Scripts**:
```javascript
initTuiNavigation();       // Unified TUI navigation (scroll detection, click handlers, history)
```

## TUI (Terminal User Interface) Architecture

Terminal-inspired layout (Neovim/tmux aesthetic).

**Components**:
- **TuiLayout.astro**: Main container with CSS Grid
- **TopBar.astro**: tmux-style bar with buffer tabs, clock, git branch
- **Sidebar.astro**: NvimTree-style file explorer
- **StatusLine.astro**: Neovim statusline (mode, file, position)
- **CommandLine.astro**: Decorative vim command line

**Section Styling**:
- Hero: ASCII art name (box-drawing characters, ANSI Shadow style) with typewriter animation on subheadline
- About: README.md style (markdown formatting, displayed without header bar or border for clean file reading)
- Experience: git log style (branch indicators, commits)
- Projects: Telescope/fzf style (fuzzy finder aesthetic)
- Expertise: `:checkhealth` style (OK/WARN/ERROR indicators)
- Contact: Terminal commands style (`$` prompts, `echo` syntax) with ASCII art "CONTACT" heading

**Layout Architecture**:
- Grid layout properties in global `layout.css`
- Component-scoped styles for visual properties only (colors, fonts)
- Desktop (≥1024px): `grid-template-columns: minmax(200px, 250px) 1fr`
- Tablet/Mobile: Collapsible sidebar overlay

**Typography**:
- JetBrains Mono (Latin subset ~35KB)
- Nerd Font icons (4-icon subset ~2-4KB)
- CSS-only syntax highlighting (~4KB)

## Commands
```bash
bun install              # Install dependencies
bun run dev              # Start development server (port 4321)
bun run build            # Build for production
bun run preview          # Preview production build
bun run lint             # Check code quality
bun run format           # Auto-format code
bun test                 # Run tests
```

## Code Style

### TypeScript
- Strict mode enabled
- Explicit type annotations for function parameters and return types
- Interfaces over types for object shapes
- Zod schemas for runtime validation (content collections)

### Astro Components
- One component per file, PascalCase naming
- Define Props interface at component top
- Prefer component-scoped styles over global
- **Organization**: `layout/` (structural), `sections/` (page sections), `ui/` (primitives), `islands/` (interactive)

### CSS and Styling
- **Always** use CSS custom properties: `var(--color-primary)`
- **Never** hard-code hex/rgb values
- **Always** include interaction states: hover, focus, active, disabled
- **Always** use `var(--transition-color)` for color transitions (respects reduced motion)
- Use semantic color tokens (primary, secondary) not color names

### Image Fallback Pattern
- Provide CSS gradient fallback: `background: linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
- Image displays over gradient when loaded; gradient shows if image fails
- Zero JavaScript - pure CSS solution

## Animation Patterns

### GSAP
- Register plugins before use: `gsap.registerPlugin(ScrollTrigger)`
- Use `gsap.fromTo()` for explicit start/end states
- Use `gsap.quickTo()` for high-frequency updates
- Clean up on unmount: `astro:before-swap` event

### Lenis Smooth Scroll
- Initialized automatically by `initTuiNavigation()`
- easeOutCubic easing (0.6s duration)
- Disabled on LOW tier devices
- Exposed on `window.lenis`
- Checks `prefersReducedMotion()` before initialization

### TUI Typing Animation
- GSAP TextPlugin for character-by-character reveal
- 50-80ms per character, ~530ms cursor blink
- Viewport-triggered via IntersectionObserver
- Progressive enhancement: text visible if JS fails

### Reduced Motion
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.set(element, { opacity: 1 });
} else {
  gsap.to(element, { opacity: 1, duration: 0.6 });
}
```

### Resource Cleanup
```javascript
document.addEventListener('astro:before-swap', () => {
  animation.destroy();
});
```

## Performance

### Device Tier Detection
- `detectDeviceTier()` from `src/scripts/performance/device-tier.ts`
- Tiers: HIGH (modern desktop), MID (mid-range), LOW (old devices)
- Access via `window.__DEVICE_TIER__` or CSS `--device-tier`
- Configuration in `src/config/performance.ts`

### Performance Monitor (Dev Only)
- `performanceMonitor` from `src/scripts/performance/performance-monitor.ts`
- Tracks FPS, Core Web Vitals (LCP, FID, CLS), memory

### Lazy Loading
- `lazyLoader` from `src/scripts/performance/lazy-loader.ts`
- Priority levels: IMMEDIATE, HIGH, MEDIUM, LOW

### Best Practices
- Check device tier before heavy animations
- Pause animations when not visible (Intersection Observer)
- Provide static fallbacks (CSS gradients, semantic HTML)
- Clean up resources on unmount
- Target 60fps on HIGH tier, 30fps on MID/LOW
- Performance budgets: Lighthouse ≥85 mobile / ≥95 desktop

## Accessibility

- Semantic HTML elements
- Alt text for images
- Keyboard navigation (Tab, Enter, Escape)
- WCAG 2.1 AA color contrast
- ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`)
- **Always** respect `prefers-reduced-motion`
- Focus trapping for modals/overlays
- Return focus to trigger on overlay close

## Color Palette

Catppuccin Mocha-based with violet/rose theme accents.

**Key Tokens**:
- `--color-background`: #1e1e2e
- `--color-text`: #cdd6f4 (12.23:1 contrast)
- `--color-primary`: #cba6f7 (Mauve)
- `--color-secondary`: #f5c2e7 (Rose/Pink)
- `--color-accent`: #b4befe (Lavender)

**Location**: `src/styles/theme.css`

## Testing

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Bun test runner (Jest-compatible API)
- File naming: `*.test.ts` or `*.test.tsx`
- Mock `requestAnimationFrame` for animation tests

## Deployment

- **Automatic**: Push to main triggers GitHub Actions
- **Target**: GitHub Pages
- **Build**: Type check + build + optimize + deploy
