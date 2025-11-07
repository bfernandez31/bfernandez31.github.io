# Portfolio Overview

## Purpose

The portfolio is a modern, high-performance static website built to showcase work, projects, and professional information. It provides a fast, accessible, and visually engaging platform for presenting content to visitors.

## Core Capabilities

### Project Initialization
The portfolio supports rapid project setup with a complete development environment configured out-of-the-box. Developers can initialize and begin working on the portfolio within minutes, with all essential tooling pre-configured.

### Content Management
The portfolio uses Astro's content collections system for type-safe content management. Content is organized into collections (blog posts, projects, case studies) with validated schemas ensuring data consistency.

### Static Site Generation
The portfolio generates static HTML pages at build time, resulting in:
- Zero JavaScript by default (Astro Islands architecture)
- Fast page loads (<2.5s Largest Contentful Paint)
- SEO-optimized output
- Deployable to any static hosting service

### Visual Design
The portfolio features a cohesive, accessible visual design:
- Comprehensive color palette based on Catppuccin Mocha
- Violet/rose theme accents for brand identity
- WCAG 2.1 AA compliant contrast ratios
- Smooth interaction states with reduced motion support

### Responsive Design
The portfolio adapts to all screen sizes and devices:
- Mobile-first approach
- Touch-friendly interactions
- Responsive images and typography
- Accessible navigation patterns

### Smooth Animations
The portfolio includes integrated animation capabilities:
- Neural network hero animation with Canvas 2D rendering (60fps desktop, 30fps mobile)
- Magnetic menu effect using GSAP quickTo() for smooth cursor interaction
- GSAP for high-performance animations
- ScrollTrigger for scroll-based effects
- Lenis for smooth scrolling
- GPU-accelerated transforms
- Adaptive performance based on device capabilities
- Respects `prefers-reduced-motion` preferences

### Development Workflow
The portfolio provides a streamlined development experience:
- Hot module replacement (changes reflect immediately)
- Type checking with TypeScript
- Automated linting and formatting
- Built-in test runner
- Component-based architecture

## User Experience

### Navigation
Users can navigate the portfolio through:
- **Single-Page Architecture**: All main content organized into 5 full-viewport sections
- **Section Navigation**: Smooth scrolling between sections via hash anchors (#hero, #about, #projects, #expertise, #contact)
- **Active Section Tracking**: IntersectionObserver automatically highlights current section in navigation
- **Deep Linking**: Direct access to specific sections via URL hash fragments
- **Magnetic Burger Menu**: Interactive menu with cursor proximity magnetic pull effect
- **Full-Screen Overlay**: Smooth animated menu overlay for mobile/tablet
- **Keyboard and Screen Reader Accessible**: Full ARIA support and keyboard navigation
- **Browser History Integration**: Back/forward buttons navigate between sections
- **URL Redirects**: Old page URLs automatically redirect to hash anchors

### Performance
The portfolio delivers exceptional performance:
- Lighthouse Performance score ≥95
- Core Web Vitals compliance (LCP <2.5s, FID <100ms, CLS <0.1)
- Optimized images and assets
- Compressed HTML output

### Accessibility
The portfolio meets WCAG 2.1 AA standards:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators
- Motion preference support

## Deployment

The portfolio deploys automatically to GitHub Pages:
- Push to main branch triggers deployment
- Automated build and optimization
- Custom domain support
- HTTPS enabled by default
