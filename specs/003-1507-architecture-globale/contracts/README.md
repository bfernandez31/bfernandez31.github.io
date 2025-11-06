# Contracts Directory

**Feature**: `003-1507-architecture-globale`

This directory contains TypeScript interfaces, type definitions, and configuration contracts for the Awwwards-worthy portfolio architecture.

## Purpose

Contracts serve as the **single source of truth** for:
1. Component prop interfaces
2. Data model types
3. Animation configurations
4. API response shapes (if applicable)

By centralizing type definitions, we ensure:
- **Type safety** across Astro components and TypeScript islands
- **Consistency** in component APIs
- **Discoverability** (developers know where to find type definitions)
- **Documentation** (interfaces serve as inline docs)

## Files

### `component-interfaces.ts`

Defines TypeScript interfaces for all components in the portfolio:

- **Animation Components**: `NeuralNetworkConfig`, `MagneticMenuConfig`, `NeuralPathwayConfig`
- **Layout Components**: `BaseLayoutProps`, `PageLayoutProps`
- **Section Components**: `HeroProps`, `ProjectsHexGridProps`, `ExpertiseMatrixProps`, `BlogCommitsProps`, `ContactProtocolProps`
- **UI Components**: `ButtonProps`, `CardProps`
- **Navigation Components**: `NavigationLinkData`, `BurgerMenuProps`
- **Data Structures**: `ProjectCardData`, `BlogPostCardData`, `SkillData`, `ContactMethod`

**Usage Example**:
```typescript
import type { HeroProps } from '@/specs/003-1507-architecture-globale/contracts/component-interfaces';

const heroConfig: HeroProps = {
  headline: "Full Stack Developer",
  subheadline: "Building exceptional web experiences",
  cta: {
    text: "View Projects",
    href: "/projects",
  },
  neuralNetworkConfig: {
    nodeCount: 100,
    colors: {
      nodes: 'var(--color-primary)',
      edges: 'var(--color-accent)',
      pulses: 'var(--color-secondary)'
    }
  }
};
```

### `animation-config.ts`

Centralized configuration for all GSAP animations, transitions, and motion effects:

- **Performance Constants**: FPS targets, frame time thresholds, bundle budgets
- **Easing Functions**: Standard GSAP easing presets
- **Duration Constants**: Micro-interactions to dramatic effects
- **Component-Specific Configs**: Neural network, magnetic menu, hexagonal grid defaults
- **Scroll Animation Presets**: Common ScrollTrigger patterns
- **Accessibility Helpers**: Reduced motion detection, safe duration/easing functions
- **Device Detection**: Capability tier detection for adaptive performance
- **Performance Monitoring**: `FrameRateMonitor` class for runtime optimization

**Usage Example**:
```typescript
import { ANIMATION_CONFIG, getSafeDuration, getNeuralNodeCount } from '@/specs/003-1507-architecture-globale/contracts/animation-config';

// Get device-appropriate node count
const nodeCount = getNeuralNodeCount(); // 100 desktop, 50 mobile, 20 if reduced motion

// Respect user motion preferences
const duration = getSafeDuration(ANIMATION_CONFIG.DURATIONS.NORMAL); // 0.3s or 0.1s

// Use standard easing
gsap.to(element, {
  duration,
  ease: ANIMATION_CONFIG.EASINGS.EASE_OUT,
  x: 100
});
```

## Integration with Codebase

### Astro Components

```astro
---
// src/components/sections/Hero.astro
import type { HeroProps } from '@/specs/003-1507-architecture-globale/contracts/component-interfaces';

export interface Props extends HeroProps {}

const { headline, subheadline, cta } = Astro.props;
---

<section class="hero">
  <h1>{headline}</h1>
  {subheadline && <p>{subheadline}</p>}
  {cta && <a href={cta.href}>{cta.text}</a>}
</section>
```

### TypeScript Islands

```typescript
// src/components/islands/HeroNeuralNetwork.tsx
import type { NeuralNetworkConfig } from '@/specs/003-1507-architecture-globale/contracts/component-interfaces';
import { NEURAL_NETWORK_DEFAULTS, getNeuralNodeCount } from '@/specs/003-1507-architecture-globale/contracts/animation-config';

export interface Props {
  config?: Partial<NeuralNetworkConfig>;
}

export default function HeroNeuralNetwork({ config }: Props) {
  const nodeCount = config?.nodeCount ?? getNeuralNodeCount();
  const colors = config?.colors ?? NEURAL_NETWORK_DEFAULTS.COLORS;

  // Component logic...
}
```

### Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Align schemas with data-model.md contracts
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    // ... matches ProjectCardData interface
  })
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
```

## Validation

All contracts should be validated in the following ways:

1. **Type Checking**: Run `bun run build` to ensure TypeScript compilation succeeds
2. **Astro Build**: Content Collections validate against Zod schemas at build time
3. **Linting**: Biome checks for unused types and interface consistency
4. **Manual Review**: Verify contracts align with data-model.md and feature spec

## Maintenance

When adding new components or modifying existing ones:

1. **Update Interfaces**: Add/modify interfaces in `component-interfaces.ts`
2. **Update Configs**: Add configuration constants in `animation-config.ts` if applicable
3. **Sync Documentation**: Ensure `data-model.md` and component JSDoc comments are updated
4. **Version Control**: Document breaking changes in PR descriptions

## Best Practices

### Do's ✅

- Use explicit interfaces (not `any` or loose types)
- Export all public-facing types
- Document complex interfaces with JSDoc comments
- Use `readonly` for configuration objects
- Prefer `interface` over `type` for object shapes
- Use `as const` for configuration constants

### Don'ts ❌

- Don't use `any` type (use `unknown` if truly generic)
- Don't create duplicate interfaces (DRY principle)
- Don't expose internal implementation types
- Don't hard-code values that should be configurable
- Don't skip JSDoc for non-obvious interfaces

## Related Files

- **Data Model**: `/specs/003-1507-architecture-globale/data-model.md` - Content structure definitions
- **Research**: `/specs/003-1507-architecture-globale/research.md` - Technical decisions and rationale
- **Plan**: `/specs/003-1507-architecture-globale/plan.md` - Implementation plan overview
- **Content Config**: `/src/content/config.ts` - Astro Content Collections schemas

## Questions?

If you're unsure about:
- **Which interface to use**: Check component JSDoc or refer to `data-model.md`
- **Configuration values**: See `animation-config.ts` defaults or research findings
- **Type mismatches**: Ensure Astro component props extend the correct interface

For feature-specific questions, consult the full specification at `/specs/003-1507-architecture-globale/spec.md`.
