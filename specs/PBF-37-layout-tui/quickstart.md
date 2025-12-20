# Quickstart: TUI Layout Redesign

**Feature Branch**: `PBF-37-layout-tui`
**Date**: 2025-12-20

## Prerequisites

- Bun >= 1.0.0
- Node.js >= 18 (fallback only)
- Modern browser with DevTools

## Setup

```bash
# Clone and checkout feature branch
git clone <repo-url>
cd portfolio
git checkout PBF-37-layout-tui

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:4321` in your browser.

## Key Files to Modify

### Priority 1: Tab Styling
```
src/components/ui/BufferTab.astro     # Tab component redesign
src/components/layout/TopBar.astro    # Tab container updates
```

### Priority 2: Horizontal Slide Navigation
```
src/scripts/tui-navigation.ts         # Main navigation logic rewrite
src/styles/tui/layout.css             # Layout for horizontal sections
```

### Priority 3: Per-Section Line Numbers
```
src/components/ui/LineNumbers.astro   # Per-section line count
src/components/layout/TuiLayout.astro # Section-specific line numbers
src/data/sections.ts                  # Line count configuration
```

## Development Workflow

### 1. Visual Tab Styling (CSS Only)

Edit `BufferTab.astro` styles to match mockup:

```bash
# Open mockup reference
open specs/PBF-37-layout-tui/assets/mockup-tab-styling.png

# Edit in dev mode - changes hot reload
bun run dev
```

**Checklist**:
- [ ] Add file icon element
- [ ] Add close button (visible on active)
- [ ] Add vertical separators
- [ ] Style active/inactive/hover states
- [ ] Test keyboard navigation focus styles

### 2. Horizontal Slide Animation

Edit `tui-navigation.ts`:

```bash
# Test on desktop viewport (>= 1024px)
# Use DevTools to toggle device mode

# Test reduced motion
# DevTools → Rendering → Emulate CSS media feature
# Select: prefers-reduced-motion: reduce
```

**Checklist**:
- [ ] Implement slideToSection() with GSAP
- [ ] Handle rapid tab clicks (killTweensOf)
- [ ] Integrate with browser history (popstate)
- [ ] Disable on mobile (< 1024px)
- [ ] Add reduced motion fallback

### 3. Per-Section Line Numbers

Edit `LineNumbers.astro` and section components:

```bash
# Each section should pass its own lineCount
# LineNumbers component already supports startLine prop
```

## Testing

### Manual Testing

```bash
# Run dev server
bun run dev

# Desktop tests (viewport >= 1024px)
1. Click each tab - verify horizontal slide
2. Use keyboard (j/k) - verify slide direction
3. Browser back/forward - verify slide direction
4. Rapid clicks - verify no animation glitches

# Mobile tests (viewport < 768px)
1. Click tabs - verify vertical scroll
2. Swipe between sections - verify smooth scroll

# Accessibility tests
1. Enable reduced motion in OS settings
2. Verify instant section switch (no slide)
3. Tab through elements - verify focus visible
```

### Automated Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/unit/tui-navigation.test.ts
```

### Performance Testing

```bash
# Build and preview production
bun run build
bun run preview

# Run Lighthouse
# Chrome DevTools → Lighthouse → Generate report
# Target: Performance >= 85 (mobile), >= 95 (desktop)
```

## Debugging

### GSAP Animation Issues

```javascript
// Add to browser console for debugging
gsap.ticker.lagSmoothing(0); // Disable lag smoothing
gsap.globalTimeline.timeScale(0.1); // Slow motion

// Check active tweens
console.log(gsap.globalTimeline.getChildren());
```

### Navigation State

```javascript
// Add to tui-navigation.ts temporarily
window.DEBUG_NAV = {
  getCurrentState: () => ({
    currentSectionId,
    currentIndex,
    isAnimating,
    viewportMode
  })
};

// In console
window.DEBUG_NAV.getCurrentState();
```

### Device Tier Detection

```javascript
// Check detected tier
console.log(window.__DEVICE_TIER__);

// Force tier for testing
document.documentElement.style.setProperty('--device-tier', 'LOW');
```

## Common Issues

### Animation Stuttering

1. Check if `will-change: transform` is applied
2. Verify using `xPercent` not `left/right`
3. Check device tier - LOW tier should have simpler animations

### Tabs Not Updating

1. Verify `data-section-id` attribute on tabs
2. Check `updateBufferTabs()` is called on section change
3. Inspect DOM for `.is-active` class

### Line Numbers Wrong

1. Verify `lineCount` prop passed to LineNumbers
2. Check section has `data-section` attribute
3. Ensure line numbers reset on section change

## Build Verification

```bash
# Full build check
bun run build

# Preview production build
bun run preview

# Lint check
bun run lint

# Type check (included in build)
astro check
```
