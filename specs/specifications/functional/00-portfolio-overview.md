# Portfolio Overview

## Purpose

The portfolio is a modern, high-performance static website built to showcase work, projects, and professional information. It provides a fast, accessible, and visually engaging platform for presenting content to visitors.

## Core Capabilities

### Project Initialization
The portfolio supports rapid project setup with a complete development environment configured out-of-the-box. Developers can initialize and begin working on the portfolio within minutes, with all essential tooling pre-configured.

### Content Management
The portfolio uses Astro's content collections system for type-safe content management. Content is organized into collections (blog posts, projects, case studies) with validated schemas ensuring data consistency.

### Professional Experience Timeline
The portfolio displays a comprehensive professional experience timeline showcasing career progression over 14+ years. The Experience section presents positions in reverse chronological order with rich context including company names, roles, dates, key achievements, and associated technologies.

**Experience Display**:
- Timeline visualization with chronological ordering (most recent first)
- 5 professional positions from 2010 to present
- Current position: Tech Lead Frontend at Caisse des dépôts et consignations (2023-Present)
- Previous experience includes roles at SFR (Architect, Tech Lead Frontend, Tech Lead) and various Toulouse-based companies
- Each entry displays: job title, company, location, date range, description, achievements, and technology tags
- Responsive layout: alternating left/right on desktop (≥1024px), stacked vertical on mobile/tablet
- Smooth scroll animations with fade-in effects for experience entries
- Full keyboard accessibility with ARIA landmarks and focus management

### Skills & Expertise Showcase
The portfolio includes a refined skills matrix focused on core competencies. After filtering, approximately 25 high-proficiency skills (proficiency ≥ 2) are displayed across 8 categories:
- **Frontend Development**: Modern frameworks and libraries including Angular, React, TypeScript, JavaScript
- **Backend Development**: Server-side technologies including Java, Spring Boot, Node.js, Python
- **DevOps & Infrastructure**: CI/CD, containerization, cloud platforms
- **Database & Storage**: Relational and NoSQL database systems
- **Testing & Quality**: Testing frameworks and quality assurance tools
- **Design & Architecture**: Design patterns, architectural approaches, UI/UX tools
- **Tools & Workflow**: Version control, IDEs, project management
- **Soft Skills & Management**: Communication, leadership, problem-solving

Each skill includes:
- Proficiency level (1-5 scale, filtered to show only ≥2)
- Years of experience (calculated from 2010 career start date)
- Related projects (linkable to portfolio projects)
- Icon identifier for visual representation

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
The portfolio includes integrated animation capabilities optimized for performance:
- Neural network hero animation with Canvas 2D rendering (adaptive particle counts: 50/30/20 based on device tier)
- Glitch effect on hero title with hover-triggered RGB channel separation animation
- Magnetic menu effect using GSAP quickTo() for smooth cursor interaction
- Text split animations for character/word/line reveals with declarative HTML API
- GSAP for high-performance animations
- ScrollTrigger for scroll-based effects
- Lenis for smooth scrolling (0.6s duration, easeOutCubic easing, no section snap)
- GPU-accelerated transforms
- Device tier detection for adaptive performance (HIGH/MID/LOW classification based on CPU, memory, connection)
- Lazy loading for non-critical animations (scroll progress, navigation dots, custom cursor)
- Performance monitoring with FPS tracking and Core Web Vitals
- Progressive enhancement with static fallbacks
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
- **Single-Page Architecture**: All main content organized into 6 full-viewport sections
- **Section Navigation**: Smooth scrolling between sections via hash anchors (#hero, #about, #experience, #projects, #expertise, #contact)
- **Active Section Tracking**: IntersectionObserver automatically highlights current section in navigation
- **Deep Linking**: Direct access to specific sections via URL hash fragments
- **Magnetic Burger Menu**: Interactive menu with cursor proximity magnetic pull effect
- **Full-Screen Overlay**: Smooth animated menu overlay for mobile/tablet
- **Keyboard and Screen Reader Accessible**: Full ARIA support and keyboard navigation
- **Browser History Integration**: Back/forward buttons navigate between sections
- **URL Redirects**: Old page URLs automatically redirect to hash anchors

### Performance
The portfolio delivers exceptional performance optimized for GitHub Pages hosting:
- Lighthouse Performance score ≥85 (mobile), ≥95 (desktop)
- Core Web Vitals compliance (LCP <2.5s, FCP <2s, FID <100ms, CLS <0.1, TTI <3.5s, TBT <300ms)
- Device-based performance adaptation (HIGH/MID/LOW tier classification)
- Lazy loading strategy for non-critical components
- Optimized animations (30fps minimum, <40% CPU usage, <100MB memory)
- Performance budgets enforced via Lighthouse CI
- Total page weight <500KB, critical assets <200KB
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
