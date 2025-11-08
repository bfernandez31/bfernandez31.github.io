# Data Model: Text Split Animation

**Phase**: 1 - Design & Contracts
**Date**: 2025-11-08

## Overview

This document defines the data entities and state management for the text split animation system. Since this is a client-side animation utility with no persistence, the "data model" describes runtime state and configuration objects.

---

## Core Entities

### 1. AnimationConfig

**Description**: Configuration object derived from HTML data attributes that controls animation behavior.

**Fields**:
| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `type` | `'char' \| 'word' \| 'line'` | Yes | - | Must be one of three values | Splitting granularity |
| `duration` | `number` | No | `0.6` | Range: 0.1 to 5.0 seconds | Animation duration per fragment |
| `delay` | `number` | No | `0.05` (char/word), `0.1` (line) | Range: 0.01 to 1.0 seconds | Stagger delay between fragments |
| `easing` | `string` | No | `'power3.out'` | Valid GSAP easing name | Animation easing function |

**Validation Rules**:
- `duration`: If outside 0.1-5.0 range, fallback to default (0.6s) with console warning
- `delay`: If outside 0.01-1.0 range, fallback to default with console warning
- `easing`: If invalid GSAP easing, fallback to 'power3.out' with console warning
- `type`: If invalid, skip element (do not animate) with console error

**Example**:
```typescript
const config: AnimationConfig = {
  type: 'char',
  duration: 0.6,
  delay: 0.05,
  easing: 'power3.out'
};
```

**Source**: Extracted from HTML element via `element.dataset.splitText`, `element.dataset.splitDuration`, etc.

---

### 2. SplitFragment

**Description**: Represents a single character/word/line span element created during text splitting.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `element` | `HTMLSpanElement` | Yes | DOM span wrapping the fragment |
| `originalText` | `string` | Yes | Text content before wrapping |
| `index` | `number` | Yes | Position in sequence (0-indexed) |

**Relationships**:
- Belongs to one `AnimatedTextElement`
- Multiple `SplitFragment` instances per `AnimatedTextElement`

**State Transitions**:
1. **Created**: Fragment span inserted into DOM, styles applied (`display: inline-block`)
2. **Animating**: GSAP timeline controlling opacity and transform
3. **Completed**: Animation finished, static state (opacity: 1, y: 0)
4. **Destroyed**: Cleanup on navigation, span removed from DOM

**Example**:
```typescript
const fragment: SplitFragment = {
  element: spanElement,
  originalText: 'H',
  index: 0
};
```

---

### 3. AnimatedTextElement

**Description**: Represents a DOM element with `data-split-text` attribute, tracking its animation state and split fragments.

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `element` | `HTMLElement` | Yes | Original element (h1, p, etc.) |
| `config` | `AnimationConfig` | Yes | Animation configuration |
| `fragments` | `SplitFragment[]` | Yes | Array of split text spans |
| `timeline` | `gsap.core.Timeline \| null` | Yes | GSAP animation timeline |
| `observer` | `IntersectionObserver \| null` | Yes | Viewport observer instance |
| `animated` | `boolean` | Yes | Has animation triggered? |

**Validation Rules**:
- `element` must have `data-split-text` attribute
- `fragments` array length must match split text count
- `timeline` must be null before animation, Timeline instance after
- `observer` must be disconnected after animation triggers

**State Transitions**:
1. **Initialized**: Element detected, config parsed, fragments created
2. **Observing**: IntersectionObserver watching for viewport entry
3. **Animating**: Timeline playing, fragments fading in
4. **Completed**: Animation done, observer disconnected
5. **Cleaned**: Timeline killed, observer disconnected, event listeners removed

**Example**:
```typescript
const animatedElement: AnimatedTextElement = {
  element: h1Element,
  config: { type: 'char', duration: 0.6, delay: 0.05, easing: 'power3.out' },
  fragments: [
    { element: span1, originalText: 'H', index: 0 },
    { element: span2, originalText: 'e', index: 1 },
    // ... more fragments
  ],
  timeline: null, // Set when animation starts
  observer: intersectionObserverInstance,
  animated: false
};
```

---

## State Management

### Global State

**Description**: Module-level state tracking all animated elements and global resources.

**Structure**:
```typescript
// src/scripts/text-animations.ts
let animatedElements: AnimatedTextElement[] = [];
let globalObserver: IntersectionObserver | null = null;
let prefersReducedMotion: boolean = false;
```

**State Operations**:
- `initTextAnimations()`: Initialize state, create observer, process elements
- `addAnimatedElement()`: Add element to tracking array
- `removeAnimatedElement()`: Remove element from tracking (on cleanup)
- `cleanupTextAnimations()`: Clear all state, kill timelines, disconnect observers

### State Lifecycle

```
Page Load
   ↓
initTextAnimations() called
   ↓
Query elements with [data-split-text]
   ↓
For each element:
   ├─ Parse config from data attributes
   ├─ Split text into fragments
   ├─ Create AnimatedTextElement
   └─ Observe with IntersectionObserver
   ↓
Element enters viewport (50% visible)
   ↓
IntersectionObserver callback fires
   ↓
If prefers-reduced-motion:
   ├─ Set fragments to final state (instant)
   └─ Mark as animated
Else:
   ├─ Create GSAP timeline
   ├─ Animate fragments with stagger
   └─ Mark as animated
   ↓
Animation complete
   ↓
Unobserve element (no repeat)
   ↓
Page navigation (astro:before-swap)
   ↓
cleanupTextAnimations()
   ↓
Kill all timelines, disconnect observers, clear state
```

---

## Relationships

```
AnimatedTextElement (1) ──has──> (many) SplitFragment
AnimatedTextElement (1) ──uses──> (1) AnimationConfig
AnimatedTextElement (1) ──watched by──> (1) IntersectionObserver
AnimatedTextElement (1) ──animated by──> (1) gsap.core.Timeline

Global State ──tracks──> (many) AnimatedTextElement
Global State ──manages──> (1) IntersectionObserver (shared instance)
```

---

## Edge Cases

### Empty or Whitespace-Only Text
**Scenario**: Element has `data-split-text` but no visible text content.

**Handling**:
- Skip element with console warning: "Text animation skipped: element has no text content"
- Do not create `AnimatedTextElement` or observer
- Element remains in DOM unchanged

**Example**:
```html
<h1 data-split-text="char"></h1> <!-- Skipped -->
<h1 data-split-text="char">   </h1> <!-- Skipped (whitespace only) -->
```

---

### Dynamic Content (Post-Page Load)
**Scenario**: Content added to DOM after `initTextAnimations()` runs (e.g., via fetch).

**Handling**:
- **Out of scope for v1**: Only elements present at page load are processed
- Future enhancement: Export `animateElement(element)` function for manual triggering
- Workaround: Call `initTextAnimations()` again after content insertion

---

### Viewport Resize During Line Animation
**Scenario**: User resizes viewport, changing line breaks mid-animation.

**Handling**:
- **v1 behavior**: Line splits are calculated once at initialization, not recalculated on resize
- **Acceptable limitation**: Line-based animations are for static content (unlikely to resize during animation)
- Future enhancement: Add resize listener to recalculate line splits if animation not yet triggered

---

### Nested HTML Elements
**Scenario**: Element with `data-split-text` contains nested tags (e.g., `<strong>`, `<em>`).

**Handling**:
- **v1 behavior**: Use `element.textContent` which strips nested HTML, extracts plain text only
- **Trade-off**: Loses semantic markup (bold, italic) but simplifies splitting logic
- **Alternative**: Use `element.innerText` (respects visibility) or walk DOM tree recursively (complex)

**Example**:
```html
<!-- Before -->
<h1 data-split-text="char">Hello <strong>World</strong></h1>

<!-- After splitting (strong tag lost) -->
<h1>
  <span class="sr-only">Hello World</span>
  <span aria-hidden="true">
    <span>H</span><span>e</span><span>l</span><span>l</span><span>o</span>
    <span> </span>
    <span>W</span><span>o</span><span>r</span><span>l</span><span>d</span>
  </span>
</h1>
```

**Mitigation**: Document in quickstart.md that split elements should contain plain text only.

---

### Long Text Performance
**Scenario**: Element with 500+ characters triggers performance degradation.

**Handling**:
- **Warning threshold**: If `fragments.length > 500`, log console warning
- **Hard limit**: If `fragments.length > 1000`, skip animation with error
- **Recommendation**: Use word or line splitting for long content, character splitting only for headlines

**Performance Impact**:
- 100 characters: ~5ms initialization, 60fps animation
- 500 characters: ~20ms initialization, 30-60fps animation (device dependent)
- 1000 characters: ~50ms initialization, <30fps animation (unacceptable)

---

### Multiple Animations on Same Element
**Scenario**: Can an element trigger animation multiple times (e.g., scroll out then back in)?

**Handling**:
- **v1 behavior**: Trigger once only (`animated: false` → `true` flag)
- **Implementation**: `observer.unobserve(element)` after first trigger
- **Rationale**: Prevents animation fatigue, improves performance (no re-observation)

**Future Enhancement**: Add `data-split-repeat="true"` attribute for repeat animations.

---

### Special Characters & Emojis
**Scenario**: Text contains emojis (👋), accented characters (é), or multi-byte Unicode.

**Handling**:
- **JavaScript string split**: `'Hello👋'.split('')` → `['H', 'e', 'l', 'l', 'o', '👋']`
- **Character counting**: Use `Array.from(text)` instead of `text.split('')` for proper Unicode handling
- **Emoji support**: Each emoji treated as single character (correct behavior)

**Implementation**:
```typescript
// Correct Unicode-aware splitting
const chars = Array.from(originalText);

// Incorrect (breaks multi-byte characters)
const chars = originalText.split(''); // ❌ Splits emoji into surrogate pairs
```

**Reference**: [MDN Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

---

## Summary

**Key Entities**:
1. **AnimationConfig**: Configuration object from data attributes
2. **SplitFragment**: Individual character/word/line span with metadata
3. **AnimatedTextElement**: Tracked element with config, fragments, timeline, observer

**State Transitions**: Initialized → Observing → Animating → Completed → Cleaned

**Edge Cases Handled**: Empty text, nested HTML (plain text only), special characters, long text (with warnings), viewport resize (v1 limitation documented)
