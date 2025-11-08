# Research: Text Split Animation

**Phase**: 0 - Outline & Research
**Date**: 2025-11-08

## Overview

This document consolidates research findings for implementing a text split animation utility using GSAP stagger effects, IntersectionObserver viewport detection, and full accessibility support.

## Research Areas

### 1. Text Splitting Techniques

**Decision**: Use DOM manipulation to wrap each character/word/line in `<span>` elements with `display: inline-block`

**Rationale**:
- `display: inline-block` is required for GSAP transforms (translateY) to work correctly on inline text
- Wrapping preserves document flow and layout (unlike absolute positioning approaches)
- Native browser line-breaking handles responsive behavior for line-based splits
- Simple DOM API (textContent + createElement) avoids heavy libraries

**Alternatives Considered**:
- **CSS-only splitting** (word-spacing, letter-spacing): Cannot achieve stagger animation with different delays per element
- **Canvas/SVG text rendering**: Breaks accessibility, loses text selection, increases complexity
- **SplitText library** (GSAP plugin): Commercial license required ($99/year), adds bundle size, overkill for simple use case
- **CSS clip-path animations**: Cannot reveal text character-by-character, limited browser support for advanced paths

**Implementation Pattern**:
```typescript
function splitText(element: HTMLElement, type: 'char' | 'word' | 'line'): HTMLSpanElement[] {
  const originalText = element.textContent || '';

  // Create visually-hidden span with original text for screen readers
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only'; // Tailwind class or custom visually-hidden
  srSpan.textContent = originalText;

  // Create wrapper for animated fragments
  const wrapper = document.createElement('span');
  wrapper.setAttribute('aria-hidden', 'true');

  // Split based on type
  const fragments = type === 'char'
    ? originalText.split('')
    : type === 'word'
    ? originalText.split(/\s+/)
    : splitByLines(element); // Uses getClientRects() for visual line breaks

  // Wrap each fragment
  const spans = fragments.map(text => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = type === 'word' ? text + ' ' : text;
    return span;
  });

  // Replace element content
  element.textContent = '';
  element.appendChild(srSpan);
  spans.forEach(span => wrapper.appendChild(span));
  element.appendChild(wrapper);

  return spans;
}
```

**Line Splitting Approach**:
- Use `Range.getClientRects()` to detect visual line breaks based on rendering
- More accurate than regex-based splitting (handles dynamic viewport widths)
- Preserve line structure even when viewport resizes (recalculate on window resize)

**Reference**: [MDN Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range), [MDN Element.getClientRects()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects)

---

### 2. GSAP Stagger Animation Best Practices

**Decision**: Use `gsap.fromTo()` with stagger option for explicit animation control

**Rationale**:
- `fromTo()` defines both start and end states explicitly (avoids layout shift)
- Stagger option provides built-in delay calculation per element
- GPU-accelerated properties (opacity, translateY) ensure 60fps performance
- Power3.out easing matches existing portfolio animations

**Implementation Pattern**:
```typescript
gsap.fromTo(
  spans, // Array of split text spans
  {
    opacity: 0,
    y: 20, // Start 20px below final position
  },
  {
    opacity: 1,
    y: 0,
    duration: config.duration || 0.6,
    ease: config.easing || 'power3.out',
    stagger: {
      amount: config.staggerDelay || 0.05, // 50ms between each character
      from: 'start', // Animate from first to last element
    },
  }
);
```

**Configuration Options**:
- **duration**: Time for each individual element animation (default 0.6s)
- **stagger.amount**: Total time spread across all elements (default 0.05s per element)
- **stagger.from**: Start point ('start', 'center', 'end', 'edges', 'random')
- **ease**: Easing function (default 'power3.out' matches custom cursor)

**Performance Considerations**:
- Use `will-change: transform, opacity` CSS hint for long animations (>100 elements)
- Limit concurrent animations to <20 elements to maintain 60fps on MID tier devices
- Use `onComplete` callback to remove will-change after animation finishes

**Reference**: [GSAP Stagger Documentation](https://greensock.com/docs/v3/Staggers), [GSAP Performance Tips](https://greensock.com/docs/v3/GSAP/gsap.config())

---

### 3. IntersectionObserver for Viewport Triggering

**Decision**: Use IntersectionObserver with 50% threshold to trigger animations when element is halfway visible

**Rationale**:
- Performant: Browser natively tracks viewport intersection (no scroll listeners needed)
- Precise: Threshold control ensures animation triggers at desired visibility
- Standard: Supported in all target browsers (Chrome 58+, Firefox 55+, Safari 12.1+)
- Battery-friendly: No polling or continuous calculations

**Implementation Pattern**:
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        animateElement(element);
        observer.unobserve(element); // Trigger once only
      }
    });
  },
  {
    threshold: 0.5, // Trigger when 50% of element is visible
    rootMargin: '0px', // No offset from viewport edges
  }
);

// Observe all elements with data-split-text attribute
document.querySelectorAll('[data-split-text]').forEach((el) => {
  observer.observe(el);
});
```

**Threshold Tuning**:
- 0.5 (50%) - Good balance for headlines (ensures text visible before animating)
- 0.3 (30%) - For longer text blocks (start animation earlier)
- 1.0 (100%) - For short elements (wait until fully visible)

**Edge Cases**:
- Elements taller than viewport: Use `rootMargin` to trigger earlier (e.g., '-100px')
- Elements initially in viewport: Trigger immediately if already visible on page load
- Dynamic content: New IntersectionObserver instance for elements added after page load

**Reference**: [MDN IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

### 4. Accessibility Considerations

**Decision**: Preserve original text for screen readers using visually-hidden span, set split text wrapper to `aria-hidden="true"`

**Rationale**:
- Screen readers should announce complete words/sentences, not individual characters
- Split text spans are purely decorative (animation purposes only)
- Visually-hidden class (sr-only) keeps text in DOM for assistive tech but hidden visually
- No JavaScript errors if animation fails to load (original text remains accessible)

**Implementation Pattern**:
```typescript
// Create screen reader span (NOT hidden from assistive tech)
const srSpan = document.createElement('span');
srSpan.className = 'sr-only'; // Tailwind utility or custom class
srSpan.textContent = originalText;

// Create animated wrapper (hidden from screen readers)
const animatedWrapper = document.createElement('span');
animatedWrapper.setAttribute('aria-hidden', 'true');

// CSS for sr-only class (Tailwind default)
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**prefers-reduced-motion Support**:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Show text instantly with no animation
  gsap.set(spans, { opacity: 1, y: 0 });
} else {
  // Full animation
  gsap.fromTo(spans, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 });
}
```

**Focus Management**:
- Text animations do not change focus order (static content only)
- Ensure focus indicators remain visible during animation (no opacity on parent container)
- Test with keyboard navigation (Tab key should move through content naturally)

**Testing Checklist**:
- [ ] Test with NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- [ ] Verify complete text announced without fragmentation
- [ ] Confirm no "span" or element names read aloud
- [ ] Test with prefers-reduced-motion enabled (instant reveal)
- [ ] Verify keyboard navigation unaffected
- [ ] Check focus indicators visible during animation

**Reference**: [WebAIM: Invisible Content](https://webaim.org/techniques/css/invisiblecontent/), [A11Y Style Guide: Skip Links](https://a11y-style-guide.com/style-guide/section-general.html#kssref-general-skip-links)

---

### 5. Performance Optimization

**Decision**: Use GPU-accelerated properties only (opacity, transform), implement cleanup on navigation, lazy-load animations via client directive

**Rationale**:
- GPU acceleration ensures 60fps on HIGH tier devices
- Cleanup prevents memory leaks on single-page navigation (Astro view transitions)
- Lazy loading reduces initial bundle size (animations not critical path)

**GPU-Accelerated Properties** (SAFE):
- `opacity`: 0 to 1 (fade in)
- `transform: translateY()`: 20px to 0 (slide up)
- `transform: scale()`: 0.8 to 1 (optional scale effect)

**Avoid** (Triggers Layout/Paint):
- `width`, `height`: Forces reflow
- `top`, `left`, `margin`: Triggers layout
- `color`, `background-color`: Repaints only (better than layout but slower than GPU)

**Cleanup Pattern**:
```typescript
let animations: gsap.core.Timeline[] = [];

function initTextAnimations() {
  // ... animation logic
  animations.push(timeline);
}

function cleanupTextAnimations() {
  animations.forEach(anim => anim.kill());
  animations = [];
  observer?.disconnect();
}

// Listen for Astro page navigation
document.addEventListener('astro:before-swap', cleanupTextAnimations);
```

**Lazy Loading Strategy**:
```astro
---
// In Astro component
---

<h1 data-split-text="char">Animated Headline</h1>

<script>
  import { initTextAnimations } from '@/scripts/text-animations';

  // Load animation when component visible (client:visible)
  initTextAnimations();
</script>
```

**Performance Budgets**:
- Initialization: <100ms for 100-character text
- Animation: 60fps on HIGH tier, 30fps on MID tier
- Memory: <1MB overhead for 20 animated elements
- Bundle size: <5KB for text-animations.ts utility

**Reference**: [GSAP Performance Tips](https://greensock.com/docs/v3/GSAP/gsap.config()), [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

### 6. Data Attribute API Design

**Decision**: Use `data-split-text` attribute with optional configuration attributes for declarative API

**Rationale**:
- HTML-first approach reduces JavaScript boilerplate
- Self-documenting code (configuration visible in markup)
- Aligns with Astro's declarative component model
- Easy to use for non-JS developers (add attribute, get animation)

**API Design**:
```html
<!-- Basic usage (defaults) -->
<h1 data-split-text="char">Headline</h1>

<!-- Custom duration (0.8s) -->
<h1 data-split-text="char" data-split-duration="0.8">Slower animation</h1>

<!-- Custom stagger delay (100ms between characters) -->
<h1 data-split-text="char" data-split-delay="0.1">More stagger</h1>

<!-- Custom easing -->
<h1 data-split-text="word" data-split-easing="power2.out">Word animation</h1>

<!-- Line-based split -->
<p data-split-text="line">Multi-line paragraph reveal</p>
```

**Attribute Schema**:
- `data-split-text`: Required, values: 'char' | 'word' | 'line'
- `data-split-duration`: Optional, number (seconds), default: 0.6
- `data-split-delay`: Optional, number (seconds), default: 0.05 for char/word, 0.1 for line
- `data-split-easing`: Optional, GSAP easing name, default: 'power3.out'

**Validation**:
```typescript
function getConfig(element: HTMLElement): AnimationConfig {
  const type = element.dataset.splitText as 'char' | 'word' | 'line';
  const duration = parseFloat(element.dataset.splitDuration || '0.6');
  const delay = parseFloat(element.dataset.splitDelay || (type === 'line' ? '0.1' : '0.05'));
  const easing = element.dataset.splitEasing || 'power3.out';

  // Validate ranges
  if (duration < 0.1 || duration > 5) {
    console.warn(`Invalid duration ${duration}, using default 0.6s`);
    return { ...config, duration: 0.6 };
  }

  return { type, duration, delay, easing };
}
```

**Reference**: [MDN HTMLElement.dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)

---

## Summary

**Technology Choices Confirmed**:
- ✅ **GSAP 3.13.0+**: Already installed, no new dependencies
- ✅ **IntersectionObserver**: Native browser API, no polyfill needed for target browsers
- ✅ **TypeScript**: Strict mode with explicit types
- ✅ **Bun test runner**: For unit and integration tests

**Key Implementation Decisions**:
1. **Text Splitting**: DOM manipulation with `<span>` wrappers + `display: inline-block`
2. **Animation**: GSAP `fromTo()` with stagger option, GPU-accelerated properties only
3. **Triggering**: IntersectionObserver with 50% threshold, trigger once per element
4. **Accessibility**: Visually-hidden original text + `aria-hidden` on split wrapper
5. **Motion Preferences**: Check `prefers-reduced-motion` and use instant reveal if true
6. **Performance**: Cleanup on navigation, lazy-load via client directive, <100ms initialization
7. **API**: Declarative data attributes (`data-split-text`, `data-split-duration`, etc.)

**No Unknowns Remaining**: All technical questions resolved with high confidence based on existing portfolio patterns (GSAP configuration, accessibility helpers, TypeScript utilities) and standard web animation practices.
