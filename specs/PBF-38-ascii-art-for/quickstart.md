# Quickstart: ASCII Art for Hero Section

**Feature**: PBF-38-ascii-art-for
**Branch**: `PBF-38-ascii-art-for`

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and on feature branch
- `bun install` completed

## Implementation Steps

### Step 1: Modify HeroTui.astro

**File**: `src/components/sections/HeroTui.astro`

Replace the current headline implementation with ASCII art:

```astro
---
/**
 * HeroTui Component - Modified for ASCII Art
 * Feature: PBF-38-ascii-art-for
 */

interface Props {
  /** Subheadline text (typewriter animation preserved) */
  subheadline?: string;
  /** Typing speed (chars/sec) */
  typingSpeed?: number;
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaLink?: string;
}

const {
  subheadline,
  typingSpeed = 12.5,
  ctaText = "Explore Projects",
  ctaLink = "#projects",
} = Astro.props;
---

<div class="tui-hero">
  <div class="tui-hero__content">
    <!-- ASCII Art Name (replaces typewriter headline) -->
    <h1 class="tui-hero__headline-wrapper">
      <pre class="tui-hero__ascii" aria-label="Benoit Fernandez">
██████╗ ███████╗███╗   ██╗ ██████╗ ██╗████████╗
██╔══██╗██╔════╝████╗  ██║██╔═══██╗██║╚══██╔══╝
██████╔╝█████╗  ██╔██╗ ██║██║   ██║██║   ██║
██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║██║   ██║
██████╔╝███████╗██║ ╚████║╚██████╔╝██║   ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝

███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗
██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝╚══███╔╝
█████╗  █████╗  ██████╔╝██╔██╗ ██║███████║██╔██╗ ██║██║  ██║█████╗    ███╔╝
██╔══╝  ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝   ███╔╝
██║     ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝</pre>
    </h1>

    {subheadline && (
      <p
        class="tui-hero__subheadline"
        id="hero-subheadline"
        data-typewriter={subheadline}
        data-typewriter-speed={typingSpeed * 1.5}
        data-typewriter-delay="0.3"
      >
        <span class="typewriter-text">{subheadline}</span>
      </p>
    )}

    {ctaText && ctaLink && (
      <a href={ctaLink} class="tui-hero__cta">
        <span class="tui-hero__cta-icon" aria-hidden="true">$</span>
        {ctaText}
      </a>
    )}
  </div>
</div>
```

### Step 2: Update CSS Styles

Add ASCII art styles to the `<style>` section:

```css
/* ASCII Art Name */
.tui-hero__headline-wrapper {
  margin: 0 0 1rem;
}

.tui-hero__ascii {
  font-family: var(--font-mono, monospace);
  font-size: clamp(0.3rem, 0.8vw, 0.5rem);
  line-height: 1.2;
  color: var(--color-primary, #cba6f7);
  margin: 0;
  overflow-x: auto;
  user-select: none;
  -webkit-user-select: none;
}

/* Mobile responsive */
@media (max-width: 767px) {
  .tui-hero__ascii {
    font-size: 0.3rem;
  }
}
```

### Step 3: Update Script (Simplify)

Remove headline from typewriter chain, keep subheadline only:

```typescript
<script>
  import { createTypewriterChain } from '../../scripts/typing-animation';

  // Initialize hero typing animation (subheadline only)
  const subheadline = document.getElementById('hero-subheadline');

  if (subheadline) {
    const items = [
      {
        element: subheadline,
        text: subheadline.getAttribute('data-typewriter') || '',
        options: {
          speed: parseFloat(subheadline.getAttribute('data-typewriter-speed') || '18'),
          delay: 0.3,
        },
      },
    ];

    createTypewriterChain(items);
  }
</script>
```

### Step 4: Update Component Usage

In the page that uses HeroTui (likely `src/pages/index.astro`), remove the `headline` prop:

```astro
<!-- Before -->
<HeroTui
  headline="Benoit Fernandez"
  subheadline="Full Stack Developer & Creative Technologist"
/>

<!-- After -->
<HeroTui
  subheadline="Full Stack Developer & Creative Technologist"
/>
```

## Verification

### Manual Testing

1. **Desktop (≥1024px)**:
   ```bash
   bun run dev
   ```
   Open http://localhost:4321 and verify:
   - ASCII art displays in primary color
   - Subheadline types out with animation
   - No horizontal scrolling

2. **Mobile (<768px)**:
   - Use browser DevTools responsive mode
   - Verify ASCII art scales down and remains readable
   - No horizontal overflow

3. **Accessibility**:
   - Use screen reader (VoiceOver/NVDA)
   - Verify "Benoit Fernandez" is announced
   - Tab navigation reaches CTA button

### Automated Testing

```bash
# Run build to check for errors
bun run build

# Run tests
bun test

# Check linting
bun run lint
```

### Performance Check

```bash
# Build and preview
bun run build && bun run preview

# Run Lighthouse audit on http://localhost:4321
# Target: ≥85 mobile, ≥95 desktop
```

## Troubleshooting

### ASCII art looks distorted

- Ensure JetBrains Mono font is loading
- Check monospace font fallback is applied
- Verify no trailing spaces in ASCII art lines

### Text overflows on mobile

- Reduce font-size minimum in clamp()
- Check `overflow-x: auto` is applied
- Verify no padding/margin adding to width

### Subheadline animation not working

- Check `typing-animation.ts` import path
- Verify `id="hero-subheadline"` is set
- Ensure JavaScript is enabled

### Screen reader not announcing name

- Verify `aria-label="Benoit Fernandez"` is on `<pre>` element
- Check `<h1>` wrapper is present for semantic heading structure

## Files Modified

| File | Change |
|------|--------|
| `src/components/sections/HeroTui.astro` | Replace headline with ASCII art |
| `src/pages/index.astro` | Remove `headline` prop from HeroTui usage |

## Performance Impact

- HTML size: +~1.2KB (ASCII art content)
- JavaScript: -~200 bytes (simplified typewriter)
- CSS: +~300 bytes (new styles)
- **Net impact**: Minimal (~1.3KB increase)
