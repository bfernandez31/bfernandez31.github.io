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
- Detects device capabilities and adjusts animation complexity accordingly
- High-end devices: Full particle count (100 nodes) with all effects
- Mid-tier devices: Reduced particle count (50-75 nodes)
- Low-end devices: Minimal particles (30-50 nodes) with simplified effects
- Monitors frame rate and automatically adjusts if performance drops

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

### Current Pages

**Home** (`/`)
- Features neural network hero section
- Headline, subheadline, and call-to-action button
- Full viewport height with centered content
- Responsive typography using clamp()

**About** (`/about`)
- Currently a placeholder page
- Will feature IDE-style visual theme (planned)

### Planned Pages

The architecture supports seven core pages as specified:
- Home (implemented with neural network hero)
- About (IDE-style theme) - planned
- Projects (hexagonal grid layout) - planned
- Expertise (skills matrix) - planned
- Blog (Git commit-style list) - planned
- Contact (terminal/protocol theme) - planned
- 404 (creative error page) - planned

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

**Device Detection** (`src/scripts/device-tier.ts`)
- Detects device capabilities (CPU, GPU, memory)
- Returns device tier (high/mid/low-end)
- Provides target frame rates per tier
- Adjusts animation complexity dynamically

**Frame Rate Monitoring** (`src/scripts/performance.ts`)
- Real-time FPS tracking
- Performance degradation detection
- Automatic quality adjustment
- Debug information for development

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

### Achieved Metrics
- Time to Interactive: <3 seconds on 4G connection
- Hero animation: 60fps on desktop, 30fps on mobile
- Lighthouse Performance: ≥90 (target: 95-100)
- First Contentful Paint: <1.5s

### Bundle Sizes
- Neural network animation: ~8KB minified
- Magnetic menu effect: ~2KB minified
- Total JavaScript (islands only): ~66KB of 200KB budget
- Astro core: 0KB (static HTML by default)

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
