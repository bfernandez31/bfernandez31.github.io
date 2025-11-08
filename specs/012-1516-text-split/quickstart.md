# Quickstart: Text Split Animation

**Feature**: Text Split Animation Utility
**Version**: 1.0.0
**Date**: 2025-11-08

## Overview

Add smooth, professional text reveal animations to your portfolio with a single HTML attribute. Split text by character, word, or line and animate with GSAP stagger effects.

**Use Cases**:
- Hero headline character-by-character reveals
- Section title word-by-word animations
- Paragraph line-by-line reading guides

**Key Features**:
- ✅ Declarative HTML API (zero JavaScript configuration)
- ✅ Automatic viewport-based triggering
- ✅ Full accessibility (screen readers + reduced motion)
- ✅ 60fps performance on HIGH tier devices
- ✅ Zero new dependencies (uses existing GSAP)

---

## Basic Usage

### 1. Character-by-Character (Headlines)

```astro
---
// src/pages/index.astro (or any Astro component)
---

<h1 data-split-text="char">Welcome to My Portfolio</h1>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Result**: Each character fades in and slides up with a 50ms stagger delay. Animation triggers when headline is 50% visible in viewport.

---

### 2. Word-by-Word (Section Titles)

```astro
<h2 data-split-text="word">Featured Projects</h2>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Result**: Each word fades in sequentially with default 50ms stagger. Perfect for section headings.

---

### 3. Line-by-Line (Paragraphs)

```astro
<p data-split-text="line" data-split-delay="0.15">
  This paragraph reveals line by line as you scroll.
  Each line fades in with a 150ms stagger delay,
  creating a subtle reading guide effect.
</p>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Result**: Each line of text fades in sequentially, adjusting to viewport width automatically.

---

## Customization

### Available Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-split-text` | `char`, `word`, `line` | (required) | Splitting granularity |
| `data-split-duration` | Number (0.1-5.0) | `0.6` | Animation duration per fragment (seconds) |
| `data-split-delay` | Number (0.01-1.0) | `0.05` (char/word), `0.1` (line) | Stagger delay between fragments (seconds) |
| `data-split-easing` | GSAP easing name | `power3.out` | Easing function |

### Examples

**Slower animation with longer stagger**:
```html
<h1 data-split-text="char" data-split-duration="0.8" data-split-delay="0.1">
  Slow Reveal
</h1>
```

**Word animation with custom easing**:
```html
<h2 data-split-text="word" data-split-easing="power2.out">
  Custom Easing
</h2>
```

**Fast line animation**:
```html
<p data-split-text="line" data-split-duration="0.4" data-split-delay="0.08">
  Quick paragraph reveal with shorter delays
</p>
```

---

## Integration Patterns

### Single Page (index.astro)

```astro
---
// src/pages/index.astro
import PageLayout from '@/layouts/PageLayout.astro';
---

<PageLayout>
  <section id="hero">
    <h1 data-split-text="char">John Doe</h1>
    <p data-split-text="word">Full Stack Developer</p>
  </section>

  <section id="about">
    <h2 data-split-text="word">About Me</h2>
    <p data-split-text="line">
      I build fast, accessible web applications...
    </p>
  </section>
</PageLayout>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';

  // Initialize once on page load
  initTextAnimations();

  // Cleanup on navigation (Astro view transitions)
  import { cleanupTextAnimations } from '@/scripts/text-animations';
  document.addEventListener('astro:before-swap', cleanupTextAnimations);
</script>
```

---

### Shared Layout (PageLayout.astro)

**Option 1: Global initialization in layout**

```astro
---
// src/layouts/PageLayout.astro
---

<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <slot />

    <script>
      import { initTextAnimations, cleanupTextAnimations } from '@/scripts/text-animations';

      // Initialize for all pages using this layout
      initTextAnimations();

      // Cleanup on navigation
      document.addEventListener('astro:before-swap', cleanupTextAnimations);
    </script>
  </body>
</html>
```

**Option 2: Per-page initialization (more control)**

```astro
---
// Individual page imports and initializes only when needed
// See "Single Page" example above
---
```

---

### Lazy Loading (Recommended)

Use Astro client directives to defer animation initialization:

```astro
<!-- Load when component visible (best for hero sections) -->
<h1 data-split-text="char">Hero Headline</h1>

<script client:visible>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

```astro
<!-- Load after 2 seconds idle (best for below-fold content) -->
<h2 data-split-text="word">Section Title</h2>

<script client:idle>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

---

## Accessibility

### Reduced Motion Support

Users with `prefers-reduced-motion: reduce` preference see **instant text reveal** with no animation:

```typescript
// Automatically handled by the utility
if (prefersReducedMotion) {
  // Text appears immediately (opacity: 1, no translateY)
} else {
  // Full stagger animation
}
```

**Testing**: Enable "Reduce motion" in OS settings (macOS: System Preferences → Accessibility → Display → Reduce motion).

---

### Screen Reader Compatibility

Split text is hidden from screen readers using `aria-hidden="true"`. Original text is preserved in a visually-hidden span:

```html
<!-- Before animation -->
<h1 data-split-text="char">Hello World</h1>

<!-- After splitting (simplified) -->
<h1>
  <span class="sr-only">Hello World</span> <!-- Screen readers read this -->
  <span aria-hidden="true"> <!-- Visual animation (hidden from assistive tech) -->
    <span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>
    <span> </span>
    <span>W</span><span>o</span><span>r</span><span>l</span><span>d</span>
  </span>
</h1>
```

**Testing**: Use screen readers (NVDA, JAWS, VoiceOver) to verify natural text announcement.

---

## Performance

### Optimization Tips

1. **Limit character animations to short text** (<100 characters)
   - Headlines, taglines, short phrases
   - Use word or line splitting for longer content

2. **Avoid animating large blocks of text**
   - Performance degrades beyond 500 characters
   - Hard limit at 1000 characters (automatic skip with error)

3. **Lazy-load animations**
   - Use `client:visible` or `client:idle` directives
   - Reduces initial JavaScript bundle size

4. **Limit concurrent animations**
   - Maximum 10-20 animated elements per page
   - Stagger page sections (trigger animations as user scrolls)

### Performance Targets

| Device Tier | FPS Target | Max Characters | Initialization Time |
|-------------|------------|----------------|---------------------|
| HIGH        | 60fps      | 500            | <50ms               |
| MID         | 30fps      | 300            | <100ms              |
| LOW         | 15fps      | 100            | <200ms              |

---

## Common Patterns

### Hero Section

```astro
<section id="hero">
  <!-- Large headline: character animation -->
  <h1 data-split-text="char" data-split-duration="0.6" data-split-delay="0.05">
    John Doe
  </h1>

  <!-- Subtitle: word animation with delay -->
  <p data-split-text="word" data-split-delay="0.08">
    Full Stack Developer & Designer
  </p>
</section>
```

---

### About Section

```astro
<section id="about">
  <!-- Section title: word animation -->
  <h2 data-split-text="word">About Me</h2>

  <!-- Paragraph: line animation (subtle) -->
  <p data-split-text="line" data-split-delay="0.1">
    I'm a passionate developer with 10 years of experience building
    fast, accessible web applications. I specialize in modern JavaScript
    frameworks and performance optimization.
  </p>
</section>
```

---

### Project Titles

```astro
<article class="project-card">
  <!-- Project name: word animation -->
  <h3 data-split-text="word" data-split-easing="power2.out">
    E-Commerce Platform
  </h3>

  <!-- Description: no animation (too long) -->
  <p>Full-stack application built with Next.js and PostgreSQL...</p>
</article>
```

---

## Troubleshooting

### Animation Not Triggering

**Problem**: Text appears instantly without animation.

**Possible Causes**:
1. **JavaScript not loaded**: Check browser console for errors
2. **GSAP missing**: Ensure GSAP 3.13.0+ is installed and imported
3. **Element already visible**: IntersectionObserver requires element to be below viewport on load
4. **Reduced motion enabled**: Check OS accessibility settings (expected behavior)

**Solution**:
```typescript
// Check if GSAP is available
if (typeof gsap === 'undefined') {
  console.error('GSAP not found. Install with: bun add gsap');
}

// Check if element is in viewport on load
const rect = element.getBoundingClientRect();
console.log('Element position:', rect.top); // Should be > viewport height
```

---

### Text Appears Fragmented

**Problem**: Screen readers announce individual characters ("H", "e", "l", "l", "o") instead of "Hello".

**Cause**: Visually-hidden span missing or `aria-hidden` not applied to split wrapper.

**Solution**: Verify implementation matches accessibility pattern (see data-model.md). This should not happen with correct implementation but can occur if DOM is manually manipulated.

---

### Performance Issues

**Problem**: Animation stutters or drops frames.

**Cause**: Too many fragments being animated simultaneously.

**Solution**:
1. Reduce text length (<200 characters for character animations)
2. Use word or line splitting instead of character splitting
3. Limit concurrent animations (<10 elements)
4. Check browser DevTools Performance panel for bottlenecks

```typescript
// Add performance monitoring (development only)
const startTime = performance.now();
splitText(element, 'char');
const endTime = performance.now();
console.log(`Split time: ${endTime - startTime}ms`); // Should be <50ms
```

---

### Long Text Warning

**Problem**: Console warning "Too many fragments, animation may be slow".

**Cause**: Element has >500 characters with character-level splitting.

**Solution**: Use word or line splitting for longer content:

```diff
- <p data-split-text="char">Long paragraph...</p>
+ <p data-split-text="line">Long paragraph...</p>
```

---

## Best Practices

### ✅ DO

- Use character splitting for headlines and short text (<100 characters)
- Use word splitting for section titles and medium text (100-300 characters)
- Use line splitting for paragraphs and long text (>300 characters)
- Lazy-load animations with `client:visible` or `client:idle`
- Test with screen readers and reduced motion enabled
- Limit to 10-20 animated elements per page

### ❌ DON'T

- Don't animate very long text blocks (>500 characters) with character splitting
- Don't nest `data-split-text` elements (unexpected behavior)
- Don't use on elements with nested HTML tags (semantic markup lost)
- Don't trigger multiple animations on the same element (not supported in v1)
- Don't animate elements containing images or complex content (text only)

---

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome  | 58+            | Full support |
| Firefox | 55+            | Full support |
| Safari  | 12.1+          | Full support |
| Edge    | 79+            | Full support (Chromium) |
| IE 11   | ❌ Not supported | IntersectionObserver not available |

**Fallback**: On unsupported browsers, text appears instantly without animation (graceful degradation).

---

## Migration from Manual GSAP

If you previously wrote custom GSAP animations for text, here's how to migrate:

**Before** (manual GSAP):
```typescript
const chars = element.textContent.split('');
const spans = chars.map(char => {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.display = 'inline-block';
  return span;
});
element.innerHTML = '';
spans.forEach(span => element.appendChild(span));

gsap.fromTo(spans, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05 });
```

**After** (text animation utility):
```astro
<h1 data-split-text="char">Same Text</h1>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';
  initTextAnimations();
</script>
```

**Benefits**: 80% less code, automatic accessibility, viewport triggering, reduced motion support, no manual cleanup.

---

## Next Steps

1. **Read full specification**: [spec.md](./spec.md)
2. **Understand data model**: [data-model.md](./data-model.md)
3. **Review API contract**: [contracts/text-animation-api.ts](./contracts/text-animation-api.ts)
4. **Implementation tasks**: Run `/speckit.tasks` to generate task breakdown
5. **Testing**: See `tests/unit/text-animations.test.ts` for test examples

---

## FAQ

**Q: Can I trigger animations manually (not on scroll)?**
A: Not in v1. Animations trigger automatically when element enters viewport. Future enhancement may add manual API.

**Q: Can animations repeat (e.g., on hover)?**
A: Not in v1. Animations trigger once only. Future enhancement may add `data-split-repeat` attribute.

**Q: Does this work with Astro View Transitions?**
A: Yes. Cleanup is automatically handled via `astro:before-swap` event listener.

**Q: Can I animate text with bold/italic tags?**
A: No. Nested HTML is stripped (uses `textContent`). Apply `data-split-text` to plain text elements only.

**Q: What happens if JavaScript fails to load?**
A: Text appears instantly without animation. Site remains fully functional (progressive enhancement).

**Q: How do I test reduced motion support?**
A: Enable "Reduce motion" in OS settings (macOS: System Preferences → Accessibility → Display). Reload page to verify instant reveal.

---

**Version**: 1.0.0 | **Last Updated**: 2025-11-08 | **Status**: Implementation Ready
