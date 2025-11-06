# Quickstart Guide: Awwwards-Worthy Portfolio Architecture

**Feature**: `003-1507-architecture-globale`
**Last Updated**: 2025-11-06

This guide helps developers quickly implement the portfolio architecture with neural network animations, magnetic menu effects, and hexagonal project grids.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Implementing the Hero Neural Network](#implementing-the-hero-neural-network)
4. [Creating the Magnetic Burger Menu](#creating-the-magnetic-burger-menu)
5. [Building the Hexagonal Projects Grid](#building-the-hexagonal-projects-grid)
6. [Setting Up Content Collections](#setting-up-content-collections)
7. [Performance Optimization](#performance-optimization)
8. [Accessibility Compliance](#accessibility-compliance)
9. [Common Gotchas](#common-gotchas)
10. [Testing Checklist](#testing-checklist)

---

## Prerequisites

Before starting, ensure you have:

- **Bun** ≥1.0.0 installed ([installation guide](https://bun.sh))
- **Astro** ≥4.0.0 project initialized
- **GSAP** ≥3.13.0 and **Lenis** ≥1.0.0 installed
- **Biome** ≥2.0.0 configured for linting
- Existing color palette from feature `002-1506-palette-couleur`

```bash
# Verify versions
bun --version  # Should be ≥1.0.0
bunx astro --version  # Should be ≥4.0.0
```

---

## Project Setup

### 1. Install Dependencies

```bash
# Install GSAP and Lenis if not already present
bun add gsap lenis

# Install TypeScript types
bun add -d @types/node
```

### 2. Configure Astro

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static', // Static site generation
  site: 'https://your-domain.com',
  base: '/portfolio', // Adjust if using subdirectory
  integrations: [],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'lenis']
    }
  }
});
```

### 3. Set Up Content Collections

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    externalUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    displayOrder: z.number().int().positive(),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    startDate: z.date(),
    endDate: z.date().optional(),
  })
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    commitHash: z.string().regex(/^[a-f0-9]{7}$/),
    description: z.string(),
    author: z.string().default('Your Name'),
    publishDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  })
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
```

Create directory structure:

```bash
mkdir -p src/content/projects src/content/blog
```

---

## Implementing the Hero Neural Network

### Step 1: Create the Animation Class

Create `src/scripts/neural-network.ts`:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
}

export class NeuralNetworkAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private animationId: number | null = null;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement, options: {
    nodeCount?: number;
    connectionDistance?: number;
    colors?: {
      nodes: string;
      edges: string;
      pulses: string;
    };
  } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    const isMobile = window.innerWidth < 768;
    const nodeCount = options.nodeCount ?? (isMobile ? 50 : 100);

    this.setupCanvas();
    this.initNodes(nodeCount);
    this.setupScrollTrigger();
  }

  private setupCanvas() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  private initNodes(count: number) {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: 0,
      });
    }

    // GSAP intro animation
    gsap.to(this.nodes, {
      opacity: 1,
      duration: 1.5,
      stagger: 0.02,
      ease: 'power2.out'
    });
  }

  private setupScrollTrigger() {
    ScrollTrigger.create({
      trigger: this.canvas,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => this.start(),
      onLeave: () => this.pause(),
      onEnterBack: () => this.start(),
      onLeaveBack: () => this.pause()
    });
  }

  private animate(currentTime: number) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;

    this.ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (const node of this.nodes) {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(203, 166, 247, ${node.opacity})`; // var(--color-primary)
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }

  start() {
    if (!this.animationId) {
      this.lastTime = performance.now();
      this.animate(this.lastTime);
    }
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.pause();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
```

### Step 2: Create the Astro Component

Create `src/components/sections/Hero.astro`:

```astro
---
export interface Props {
  headline: string;
  subheadline?: string;
}

const { headline, subheadline } = Astro.props;
---

<section class="hero">
  <canvas id="hero-canvas" class="hero__canvas"></canvas>
  <div class="hero__content">
    <h1 class="hero__headline">{headline}</h1>
    {subheadline && <p class="hero__subheadline">{subheadline}</p>}
  </div>
</section>

<script>
  import { NeuralNetworkAnimation } from '@/scripts/neural-network';

  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  if (canvas) {
    new NeuralNetworkAnimation(canvas, {
      colors: {
        nodes: 'var(--color-primary)',
        edges: 'var(--color-accent)',
        pulses: 'var(--color-secondary)'
      }
    });
  }
</script>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero__content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .hero__headline {
    font-size: clamp(2rem, 5vw, 4rem);
    color: var(--color-text);
  }

  .hero__subheadline {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    color: var(--color-text);
    opacity: 0.8;
  }
</style>
```

---

## Creating the Magnetic Burger Menu

### Step 1: Create the Magnetic Effect Script

Create `src/scripts/magnetic-menu.ts`:

```typescript
import { gsap } from 'gsap';

export function initMagneticMenu(element: HTMLElement, options = {}) {
  const threshold = options.threshold ?? 100;
  const strength = options.strength ?? 0.4;
  const duration = options.duration ?? 0.25;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const quickX = gsap.quickTo(element, 'x', { duration, ease: 'power2.out' });
  const quickY = gsap.quickTo(element, 'y', { duration, ease: 'power2.out' });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < threshold) {
      const falloff = 1 - (distance / threshold);
      const moveX = deltaX * strength * falloff;
      const moveY = deltaY * strength * falloff;

      quickX(moveX);
      quickY(moveY);
    }
  };

  const handleMouseLeave = () => {
    quickX(0);
    quickY(0);
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    gsap.set(element, { x: 0, y: 0 });
  };
}
```

### Step 2: Create the Burger Menu Component

Create `src/components/layout/BurgerMenu.astro`:

```astro
---
export interface Props {
  links: { text: string; path: string; }[];
}

const { links } = Astro.props;
---

<button class="burger-menu" aria-label="Toggle menu" aria-expanded="false">
  <span class="burger-line"></span>
  <span class="burger-line"></span>
  <span class="burger-line"></span>
</button>

<nav class="nav-menu" hidden>
  <ul>
    {links.map(link => (
      <li><a href={link.path}>{link.text}</a></li>
    ))}
  </ul>
</nav>

<script>
  import { initMagneticMenu } from '@/scripts/magnetic-menu';

  const button = document.querySelector('.burger-menu') as HTMLElement;
  const menu = document.querySelector('.nav-menu') as HTMLElement;

  if (button && menu) {
    // Initialize magnetic effect
    initMagneticMenu(button, {
      threshold: 100,
      strength: 0.4
    });

    // Toggle menu
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      menu.hidden = isExpanded;
    });
  }
</script>

<style>
  .burger-menu {
    width: 48px;
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 12px;
  }

  .burger-line {
    width: 100%;
    height: 2px;
    background: var(--color-text);
    transition: transform var(--transition-color);
  }

  .nav-menu {
    position: fixed;
    inset: 0;
    background: var(--color-background);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .nav-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-menu a {
    display: block;
    padding: 1rem 2rem;
    font-size: 2rem;
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition-color);
  }

  .nav-menu a:hover {
    color: var(--color-primary);
  }
</style>
```

---

## Building the Hexagonal Projects Grid

Create `src/components/sections/ProjectsHexGrid.astro`:

```astro
---
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const sortedProjects = projects.sort((a, b) =>
  a.data.displayOrder - b.data.displayOrder
);
---

<section class="projects">
  <h2 class="projects__title">Projects</h2>
  <div class="hexagon-grid">
    {sortedProjects.map(project => (
      <a href={`/projects/${project.slug}`} class="hexagon">
        <div class="hexagon-content">
          <img src={`/images/projects/${project.data.image}`} alt={project.data.imageAlt} />
          <div class="hexagon-overlay">
            <h3>{project.data.title}</h3>
            <p>{project.data.description}</p>
          </div>
        </div>
      </a>
    ))}
  </div>
</section>

<style>
  .hexagon-grid {
    --hexagon-size: clamp(120px, 20vw, 200px);
    --spacing: 8px;

    display: grid;
    grid-template-columns: repeat(auto-fit, calc(var(--hexagon-size) + 2 * var(--spacing)));
    justify-content: center;
    gap: var(--spacing);
  }

  .hexagon-grid::before {
    content: "";
    float: left;
    width: calc(var(--hexagon-size) / 2 + var(--spacing));
    height: 100%;
    shape-outside: repeating-linear-gradient(
      transparent 0 calc(var(--hexagon-size) * 1.7324 + 4 * var(--spacing) - 3px),
      #000 0 calc(var(--hexagon-size) * 1.7324 + 4 * var(--spacing))
    );
  }

  .hexagon {
    width: var(--hexagon-size);
    height: calc(var(--hexagon-size) * 1.1547);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    position: relative;
    overflow: hidden;
    transition: transform var(--transition-color);
    will-change: transform;
  }

  @media (hover: hover) {
    .hexagon:hover {
      transform: scale(1.08) translateZ(0);
      z-index: 10;
    }

    .hexagon:hover .hexagon-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hexagon-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .hexagon-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hexagon-overlay {
    position: absolute;
    inset: 0;
    background: var(--color-background);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity var(--transition-color), transform var(--transition-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    text-align: center;
  }

  .hexagon-overlay h3 {
    font-size: 1.25rem;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .hexagon-overlay p {
    font-size: 0.875rem;
    color: var(--color-text);
    opacity: 0.8;
  }
</style>
```

---

## Setting Up Content Collections

### Create Sample Project

Create `src/content/projects/sample-project.md`:

```markdown
---
title: "E-Commerce Platform"
description: "Modern e-commerce site with React and TypeScript"
technologies: ["React", "TypeScript", "Node.js"]
image: "ecommerce.webp"
imageAlt: "E-commerce platform screenshot"
externalUrl: "https://example.com"
featured: true
displayOrder: 1
status: "completed"
startDate: 2024-01-01
endDate: 2024-06-01
---

Full project description goes here...
```

### Create Sample Blog Post

Create `src/content/blog/sample-post.md`:

```markdown
---
title: "feat: Implement dark mode"
commitHash: "a3f7b2c"
description: "How I built a dark mode system with CSS custom properties"
author: "Your Name"
publishDate: 2024-10-15
tags: ["CSS", "Design"]
draft: false
featured: true
---

Blog post content...
```

---

## Performance Optimization

### 1. Enable Image Optimization

Install Astro's image integration:

```bash
bun add @astrojs/image
```

Update `astro.config.mjs`:

```javascript
import image from '@astrojs/image';

export default defineConfig({
  integrations: [image()],
});
```

### 2. Lazy Load Components

Use `client:visible` directive for animations:

```astro
<HeroNeuralNetwork client:visible />
```

### 3. Monitor Performance

Add performance monitoring:

```typescript
// src/scripts/performance.ts
export function monitorFPS() {
  let lastTime = performance.now();
  let frames = 0;

  function measure() {
    frames++;
    const now = performance.now();

    if (now >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (now - lastTime));
      console.log(`FPS: ${fps}`);
      frames = 0;
      lastTime = now;
    }

    requestAnimationFrame(measure);
  }

  requestAnimationFrame(measure);
}
```

---

## Accessibility Compliance

### 1. Respect Reduced Motion

Always check before animating:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Run animations
}
```

### 2. Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```astro
<a href="/projects" class="hexagon" tabindex="0">
  <!-- Content -->
</a>
```

### 3. ARIA Attributes

Add proper ARIA labels:

```astro
<button aria-label="Toggle menu" aria-expanded="false">
  <!-- Burger icon -->
</button>
```

---

## Common Gotchas

### Canvas Not Rendering

**Problem**: Canvas appears blank
**Solution**: Ensure canvas has explicit dimensions:

```css
#hero-canvas {
  width: 100%;
  height: 100%;
}
```

### GSAP Not Working

**Problem**: GSAP animations don't run
**Solution**: Register plugins before use:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Hexagons Overlapping Incorrectly

**Problem**: Hexagonal grid doesn't tessellate properly
**Solution**: Check `shape-outside` formula and spacing calculations

---

## Testing Checklist

- [ ] Neural network animates at 60fps on desktop
- [ ] Neural network degrades gracefully on mobile (30fps)
- [ ] Magnetic menu responds to cursor proximity
- [ ] Burger menu opens/closes correctly
- [ ] Hexagonal grid displays correctly on all screen sizes
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen readers announce all content correctly
- [ ] Lighthouse Performance score ≥95
- [ ] Lighthouse Accessibility score ≥95
- [ ] No console errors on page load
- [ ] Build completes successfully (`bun run build`)

---

## Next Steps

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement components in order of priority (Hero → Navigation → Projects)
3. Test on actual devices (mobile, tablet, desktop)
4. Run Lighthouse audits after each major component
5. Adjust performance budgets if needed

For detailed implementation tasks, proceed to `tasks.md` (generated by `/speckit.tasks` command).
