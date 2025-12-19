# Portfolio Architecture

## Overview

The portfolio features an Awwwards-worthy architecture with advanced animations and interactive elements that create a visually striking, high-performance user experience. The architecture is built on Astro's static site generation with selective client-side hydration for animations.

## Hero Section

### Neural Network Animation

The homepage features an animated neural network visualization that serves as the hero section backdrop.

**Behavior**:
- Displays an animated network of interconnected nodes (particles) with connecting edges
- Nodes pulse and move dynamically across the canvas
- Connections form between nearby nodes, creating organic network patterns
- Animation runs at 60fps on desktop and 30fps on mobile devices
- Automatically pauses when not visible to conserve resources

**Adaptive Performance**:
- Device tier detection classifies devices as HIGH/MID/LOW based on CPU cores, memory, and connection speed
- HIGH tier (8+ cores or 8GB+ RAM): 50 particles, 60fps target, all effects enabled
- MID tier (4+ cores or 4GB+ RAM): 30 particles, 30fps target, cursor effects disabled
- LOW tier (<4 cores and <4GB RAM): 20 particles, 30fps target, smooth scroll disabled, cursor effects disabled
- Animation initializes asynchronously to avoid blocking page load
- Pauses automatically when hero section not visible (Intersection Observer)
- Simplified GSAP intro animation for faster initialization

**Accessibility**:
- Respects `prefers-reduced-motion` user preference
- When reduced motion is enabled, displays static network with subtle opacity pulses only
- Animation is decorative and does not convey essential information
- Content remains accessible without animation

**Technical Details**:
- Renders using Canvas 2D API for optimal performance
- Uses high-DPI (Retina) canvas support for crisp visuals
- GPU-accelerated rendering with transform and opacity properties
- ResizeObserver handles responsive canvas sizing
- Integrates with GSAP ScrollTrigger for lifecycle management

## Navigation System

### Magnetic Burger Menu

The portfolio uses an innovative magnetic burger menu that responds to cursor proximity with a magnetic attraction effect.

**Behavior**:
- Fixed-position burger icon in top-right corner
- Icon exhibits magnetic pull effect when cursor approaches (desktop only)
- Smooth animation follows cursor within threshold distance
- Returns to original position when cursor moves away
- Opens full-screen overlay menu when clicked

**Menu Overlay**:
- Full-screen dark overlay with centered navigation links
- Links animate in with staggered fade and slide effect
- Large, readable typography optimized for all screen sizes
- Menu closes when link is clicked or Escape key is pressed
- Body scroll prevented while menu is open

**Interaction States**:
- Hover: Changes background and border color
- Focus: Visible outline for keyboard navigation
- Active/Open: Burger icon transforms to X close icon
- Disabled during page transitions

**Accessibility**:
- Full keyboard navigation support (Tab, Enter, Escape)
- ARIA attributes (`aria-expanded`, `aria-controls`, `aria-label`)
- Focus trap keeps keyboard navigation within open menu
- Focus returns to burger button when menu closes
- Screen reader announcements for menu state changes
- Magnetic effect disabled for keyboard-only users
- Respects `prefers-reduced-motion` preference

**Touch Support**:
- Works on touch devices without magnetic effect
- Tap to open/close menu
- Touch-friendly link sizing (minimum 44x44px)

## Page Structure

### Single-Page Architecture

The portfolio uses a single-page layout with six full-viewport sections, providing a modern, cohesive browsing experience without page reloads.

**Main Page** (`/`)
- Contains all six sections in a single scrollable page
- Each section occupies full viewport height (100vh on desktop)
- Sections identified by hash anchors: `#hero`, `#about`, `#experience`, `#projects`, `#expertise`, `#contact`
- Smooth scroll navigation between sections
- Content from previously separate pages now consolidated

**Section Overview**:
1. **Hero** (`#hero`) - Neural network animation with introduction
2. **About** (`#about`) - Professional background and skills
3. **Experience** (`#experience`) - Professional experience timeline with career progression
4. **Projects** (`#projects`) - Portfolio showcase
5. **Expertise** (`#expertise`) - Technical skills and competencies
6. **Contact** (`#contact`) - Contact information and form

**URL Structure**:
- Deep linking supported via hash fragments (e.g., `/#about`, `/#experience`, `/#projects`)
- Browser history tracks section navigation
- Back/forward buttons navigate between sections
- Old page URLs redirect to hash anchors (`/about` → `/#about`, `/experience` → `/#experience`)

**Separate Pages**:
- **Blog** (`/blog`) - Multi-page blog section (separate from single-page layout)
- **404** (`/404`) - Error page for invalid routes

### Section Navigation System

The single-page architecture includes an intelligent navigation system that tracks user position and provides smooth transitions between sections.

**Active Section Detection**:
- Uses IntersectionObserver API to track visible section
- 30% visibility threshold determines active section
- Active navigation link updates automatically while scrolling
- `aria-current="page"` attribute updates for accessibility

**Navigation Behavior**:
- Click navigation links or dots to smoothly scroll to target section
- Smooth scroll powered by Lenis library (optimized configuration)
- Scrolling uses "easeOutCubic" easing (0.6s duration) for responsive feel
- Section snap disabled for more natural, free-flowing scrolling
- Smooth scroll automatically disabled on LOW tier devices (native scroll fallback)
- Smooth scroll respects `prefers-reduced-motion` (disabled when user prefers reduced motion)
- Focus automatically moves to target section for keyboard users
- URL hash updates to reflect current section
- Browser history tracks section changes (back/forward buttons work)

**Deep Linking**:
- Direct navigation to sections via URL hash (e.g., `/#contact`)
- Initial page load scrolls to hash target if present
- Shared URLs preserve section context
- Fallback to hero section if hash invalid

**Semantic HTML Structure**:
- Each section uses `<section>` element with unique `id` and `data-section` attributes
- Hero section uses `role="main"` landmark
- Other sections use `role="region"` with descriptive `aria-label`
- Proper heading hierarchy (h1 in Hero, h2 in other sections)

**Vertical Navigation Dots**:
- Fixed-position navigation dots on right side of viewport (desktop only)
- One dot per main section (6 dots total)
- Active dot scales up and changes color to indicate current section
- Hover reveals section label with smooth fade-in animation
- Click dot to scroll to corresponding section
- Synchronized with main navigation active state
- Lazy loaded when user scrolls past hero section to reduce initial page load
- Hidden on mobile/tablet devices (<1024px)
- Fully keyboard accessible with visible focus indicators
- Respects `prefers-reduced-motion` preference

**Scroll Progress Indicator**:
- Fixed-position progress bar at top of viewport
- Displays visual indicator of scroll progress from 0% to 100%
- Violet-to-rose gradient fills left-to-right as user scrolls down
- 4px height (3px on high-DPI displays) for subtle visibility
- Positioned above all other elements (z-index 9999)
- Updates smoothly in sync with Lenis scroll animation
- Lazy loaded on first scroll event to reduce initial page load
- Accessible with ARIA progressbar role and live progress values
- Respects `prefers-reduced-motion` preference (disables transition)
- Does not interfere with user interaction (pointer-events: none)

**Responsive Behavior**:
- Desktop (≥1024px): Sections fixed at 100vh height, navigation dots visible
- Tablet/Mobile (<1024px): Sections use `min-height: 100vh`, navigation dots hidden
- Dynamic viewport units (100dvh) account for mobile browser UI
- Sections allow natural overflow on smaller screens
- Scroll progress bar visible on all screen sizes

## Experience Timeline Section

### Professional Experience Display

The Experience section presents a visual timeline of professional work history, showcasing career progression and key accomplishments in an engaging, easy-to-scan format.

**Behavior**:
- Displays 5 professional experience entries in reverse chronological order (most recent first)
- Each entry shows: job title, company name, location, date range, description, achievements, and technology tags
- Timeline visualization with vertical line connecting all entries
- Position indicators (dots) mark each entry on the timeline
- Desktop layout (≥1024px): Alternating left/right positioning for visual variety
- Mobile/tablet layout (<1024px): Stacked vertical layout for readability
- Smooth fade-in animations as entries enter viewport (via GSAP ScrollTrigger)
- Technology tags displayed as interactive badges linking to skills

**Date Formatting**:
- Current positions display as "2023 - Présent" (endDate: null)
- Past positions show full date range (e.g., "2021 - 2023")
- Supports year-only format (YYYY) for flexibility

**Accessibility**:
- Semantic HTML using `<ol>` for ordered list of experiences
- Each entry wrapped in `<article>` element for proper document structure
- Uses `<time>` elements with datetime attributes for machine-readable dates
- ARIA landmarks with `role="region"` and descriptive `aria-label`
- Keyboard accessible with logical tab order following chronological sequence
- Focus-visible styles for all interactive technology tags
- Respects `prefers-reduced-motion` user preference (instant reveal with no animation)

**Visual Design**:
- Timeline line uses primary color gradient (violet to rose)
- Position dots scale and highlight on scroll into view
- Technology tags use semantic color tokens with hover/focus states
- Consistent spacing and typography matching overall design system
- GPU-accelerated animations (opacity, transform) for smooth 60fps performance

## Visual Effects

### Custom Cursor

The portfolio features a custom cursor that replaces the system cursor on desktop devices, providing a refined, on-brand interaction experience.

**Behavior**:
- Circular cursor with border outline follows mouse movement smoothly
- Uses mix-blend-mode: difference for adaptive contrast against any background
- Scales up (2x size) when hovering over interactive elements
- Smooth animation with natural easing for professional feel
- Automatically detects and adapts to interactive elements (links, buttons, inputs)

**Interactive Element Detection**:
- Automatically grows when hovering over links, buttons, form fields
- Supports custom interactive elements via `data-cursor="hover"` attribute
- Uses static selectors with event delegation for performance
- Maintains consistent hover state across all interactive UI

**Device Support**:
- Desktop only (hover: hover and pointer: fine media queries)
- System cursor hidden on desktop devices
- Automatically disabled on touch devices (tablets, phones)
- Automatically disabled on MID and LOW tier devices for better performance
- Lazy loaded after 2 seconds idle to reduce initial page load
- Reverts to system cursor on touch-enabled screens

**Accessibility**:
- Respects `prefers-reduced-motion` user preference
- When reduced motion is enabled, cursor uses instant position updates (no smooth following)
- Cursor marked as `aria-hidden="true"` (decorative, not functional)
- Does not interfere with keyboard navigation or screen readers
- Interactive elements remain fully accessible without cursor

**Performance**:
- Uses GSAP `quickTo()` for ultra-smooth 60fps position updates (0.6s duration, power3.out easing)
- GPU-accelerated transforms (translateX/Y) for optimal rendering
- Simplified implementation with static selectors instead of MutationObserver
- Minimal CPU overhead (~1-2KB JavaScript)
- Automatic cleanup on page navigation

### Cursor Trail Effect (REMOVED)

**Status**: The cursor trail effect has been removed entirely in the performance optimization update for better performance.

**Reason**: High overhead (60fps canvas drawing with continuous particle spawning) with relatively low user experience value. The custom cursor remains functional without the trail effect.

**Alternative**: The custom cursor still provides visual feedback through size scaling when hovering over interactive elements, which is sufficient for user experience while maintaining optimal performance.

### Text Split Animations

The portfolio provides declarative text reveal animations that split text content into individual fragments and animate them with smooth stagger effects.

**Behavior**:
- Text splits into characters, words, or lines based on specified granularity
- Each fragment animates with fade-in and slide-up effect (opacity 0→1, translateY 20→0)
- Stagger delay creates sequential reveal (default: 50ms for char/word, 100ms for line)
- Animations trigger automatically when element enters viewport (50% threshold)
- Uses IntersectionObserver for efficient viewport detection
- Trigger once only (no repeat on scroll)

**Splitting Modes**:
- **Character**: Best for headlines and short text (<100 characters)
- **Word**: Best for section titles and medium text (100-300 characters)
- **Line**: Best for paragraphs and long text (>300 characters)

**Usage**:
```astro
<!-- Character-by-character reveal -->
<h1 data-split-text="char">Portfolio Headline</h1>

<!-- Word-by-word reveal with custom timing -->
<h2 data-split-text="word" data-split-duration="0.8" data-split-delay="0.1">
  Section Title
</h2>

<!-- Line-by-line reveal -->
<p data-split-text="line">
  Paragraph content that reveals line by line as user scrolls.
</p>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Accessibility**:
- Respects `prefers-reduced-motion` user preference (instant reveal with no animation)
- Screen reader compatible: original text preserved in visually-hidden span
- Split fragments wrapped in `aria-hidden="true"` wrapper
- Screen readers announce complete text naturally without fragmentation

**Performance**:
- GPU-accelerated properties only (opacity, transform)
- 60fps target on HIGH tier devices, 30fps minimum on MID tier
- Performance limits: warns at 500 fragments, hard limit at 1000 fragments
- Initialization under 100ms for 100-character text
- Automatic cleanup on page navigation (astro:before-swap)

**Customization**:
- `data-split-text`: Splitting mode (char, word, line) - required
- `data-split-duration`: Animation duration per fragment (0.1-5.0s, default: 0.6s)
- `data-split-delay`: Stagger delay between fragments (0.01-1.0s, default: 0.05s char/word, 0.1s line)
- `data-split-easing`: GSAP easing function (default: power3.out)

## Animation System

### Core Animation Utilities

**Animation Configuration** (`src/scripts/animation-config.ts`)
- Centralized constants for all animations
- Color configurations matching theme palette
- Timing and easing presets
- Performance thresholds and targets

**GSAP Setup** (`src/scripts/gsap-config.ts`)
- GSAP initialization and registration
- ScrollTrigger configuration
- Global animation utilities
- Reusable animation presets

**Smooth Scrolling** (`src/scripts/scroll-animations.ts`)
- Lenis smooth scroll integration
- Scroll-based animation triggers
- Momentum and easing configuration

**Accessibility Helpers** (`src/scripts/accessibility.ts`)
- Motion preference detection
- Focus management utilities
- Keyboard navigation helpers
- Focus trap implementation

### Performance Monitoring

**Device Tier Detection** (`src/scripts/performance/device-tier.ts`)
- Detects device capabilities using browser APIs (navigator.hardwareConcurrency, navigator.deviceMemory, navigator.connection)
- Classifies devices as HIGH/MID/LOW/UNKNOWN
- HIGH: 8+ CPU cores OR 8GB+ RAM OR (4+ cores AND 4GB+ RAM)
- MID: 4+ CPU cores OR 4GB+ RAM (but not HIGH criteria)
- LOW: <4 CPU cores AND <4GB RAM
- Connection speed downgrades tier by one level if slow (2G/3G)
- Returns configuration mapping for animation quality, particle counts, feature toggles
- Exposed globally via `window.__DEVICE_TIER__` and CSS custom property `--device-tier`

**Performance Monitor** (`src/scripts/performance/performance-monitor.ts`)
- Real-time FPS tracking via requestAnimationFrame (rolling average over last 60 frames)
- Core Web Vitals monitoring via PerformanceObserver (LCP, FID, CLS)
- Memory usage tracking (Chrome-only via performance.memory)
- Budget violation detection and logging
- Development-only feature (not included in production bundle)
- Console reporting every 30 seconds with current metrics
- Automatic performance degradation warnings

**Lazy Loader** (`src/scripts/performance/lazy-loader.ts`)
- Priority-based component loading (IMMEDIATE/HIGH/MEDIUM/LOW)
- Intersection Observer for viewport-based loading
- Idle callback for background loading
- Timeout-based fallback for unsupported browsers
- Error handling with graceful degradation
- Examples: scroll progress (first scroll), navigation dots (hero exit), custom cursor (2s idle)

## User Experience Patterns

### Loading Behavior
- Neural network animation begins within 1 second of page load
- Canvas initializes with high-DPI support automatically
- Smooth transitions between pages maintain context
- No layout shift during animation initialization

### Error Handling
- Graceful degradation if Canvas API unavailable
- Console errors logged for debugging (development only)
- Static fallback content always visible
- Animation failures don't block page functionality

### Responsive Design
- All components adapt from 320px (mobile) to 2560px (desktop)
- Touch-optimized interactions on mobile devices
- Responsive typography using CSS clamp()
- Flexible layouts using Flexbox and Grid

## Performance Targets

### Achieved Metrics (Post-Optimization)
- Lighthouse Performance: ≥85 (mobile), ≥95 (desktop)
- Core Web Vitals: LCP <2.5s, FCP <2s, FID <100ms, CLS <0.1, TTI <3.5s, TBT <300ms
- Animation Performance: 30fps minimum, <40% CPU usage, <100MB memory
- Time to Interactive: <3.5 seconds on Slow 3G
- Hero animation: Adaptive (60fps HIGH tier, 30fps MID/LOW tier)

### Bundle Sizes (Optimized)
- Neural network animation: ~8KB minified (async loaded)
- Magnetic menu effect: ~2KB minified
- Device tier detection: ~2KB minified
- Performance monitor: ~3KB minified (dev only)
- Lazy loader: ~1KB minified
- Total page weight: <500KB uncompressed, <200KB critical assets
- Astro core: 0KB (static HTML by default)

### Performance Budget Enforcement
- Lighthouse CI gates enforce performance thresholds on every PR
- Budget violations block deployment
- Configuration in `lighthouserc.json`
- Runtime monitoring in development mode
- Static performance budgets in `src/config/performance.ts`

## Content Management

### Static Content
- No CMS integration - content managed via code
- Navigation links defined in `src/data/navigation.ts`
- Page metadata in `src/data/pages.ts`
- Skills data in `src/data/skills.json` (planned)

### Future Content Collections
- Projects: Markdown files in `src/content/projects/`
- Blog posts: Markdown files in `src/content/blog/`
- Type-safe schemas with Zod validation
- Automatic route generation for dynamic content

## Browser Support

**Supported Browsers**:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

**Required Features**:
- Canvas 2D API
- CSS Grid and Flexbox
- CSS Custom Properties
- Intersection Observer API
- ES6+ JavaScript

**Graceful Degradation**:
- Core content accessible without JavaScript
- Static navigation fallback if animations fail
- Semantic HTML ensures basic functionality
- Progressive enhancement approach

## Security Considerations

- No user input handling in MVP (navigation only)
- Static site eliminates common vulnerabilities
- Content Security Policy compatible
- No third-party tracking or analytics
- No cookies or local storage used

## Future Enhancements

### Planned Features
- Project showcase with hexagonal grid (User Story 3)
- About page with IDE-style theme (User Story 4)
- Expertise matrix with skills visualization (User Story 4)
- Blog with commit-style posts (User Story 5)
- Contact form with terminal theme (User Story 6)
- Creative 404 page (User Story 7)

### Potential Additions
- Neural pathway animations for menu links
- Scroll-based parallax effects
- Project detail modals
- Blog post animations
- Contact form backend integration
- Analytics and performance monitoring
