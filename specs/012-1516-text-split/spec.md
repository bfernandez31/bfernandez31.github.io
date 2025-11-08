# Feature Specification: Text Split Animation

**Feature Branch**: `012-1516-text-split`
**Created**: 2025-11-08
**Status**: Draft
**Input**: User description: "#1516 Text Split Animation - Goal: Text reveal animation utility - splitText utility in animations.ts - Split by character/word/line - GSAP stagger animation - data-split-text attribute - Configurable delay - Deliverable: src/scripts/text-animations.ts"

## Auto-Resolved Decisions

### Decision 1: Animation trigger mechanism
- **Decision**: Text animations should trigger automatically on scroll into view (via IntersectionObserver) rather than requiring manual JavaScript calls
- **Policy Applied**: AUTO
- **Confidence**: High (score: +3) - Aligns with existing portfolio patterns (neural network, scroll progress) and standard modern web animation practices
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. **Scope**: Adds automatic triggering logic, slightly larger implementation (~50 LOC)
  2. **UX**: Better user experience with zero configuration needed for common use cases
  3. **Developer experience**: Declarative API via HTML attributes is more accessible than imperative JavaScript
- **Reviewer Notes**: Validate that automatic triggering meets 90% of use cases; ensure manual trigger API is still available for advanced scenarios

### Decision 2: Default animation parameters
- **Decision**: Use sensible defaults for animation timing (0.6s duration, 0.05s stagger delay, power3.out easing) matching existing GSAP configurations in the portfolio
- **Policy Applied**: AUTO
- **Confidence**: High (score: +2) - Matches existing animation patterns in custom cursor, smooth scroll, and neural network
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. **Consistency**: Maintains visual coherence across the entire portfolio
  2. **Performance**: Tested values that respect 60fps target on HIGH tier devices
  3. **Flexibility**: All defaults are overridable via data attributes
- **Reviewer Notes**: Confirm that easing and timing feel natural for text reveals across different content lengths

### Decision 3: Reduced motion handling
- **Decision**: Respect `prefers-reduced-motion` by showing text instantly with no animation, maintaining full accessibility
- **Policy Applied**: CONSERVATIVE (fallback from AUTO due to accessibility signals)
- **Confidence**: High (score: +3) - Non-negotiable accessibility requirement per WCAG 2.1 and portfolio constitution
- **Fallback Triggered?**: Yes - Accessibility and WCAG compliance keywords triggered CONSERVATIVE policy
- **Trade-offs**:
  1. **Accessibility**: Ensures users with motion sensitivity can consume content comfortably
  2. **Implementation**: Adds ~10 LOC for motion preference detection
  3. **Testing**: Requires additional test scenarios for reduced motion state
- **Reviewer Notes**: Validate that instant reveal provides equivalent information hierarchy to animated version

### Decision 4: Character wrapping for animation
- **Decision**: Wrap each character/word/line in `<span>` elements with `display: inline-block` and `aria-hidden="true"` for animation, preserving original text in a visually hidden span for screen readers
- **Policy Applied**: CONSERVATIVE
- **Confidence**: High (score: +3) - Accessibility requirement to prevent screen readers from reading fragmented text
- **Fallback Triggered?**: No
- **Trade-offs**:
  1. **Accessibility**: Screen readers announce natural text flow instead of individual characters
  2. **DOM size**: Increases DOM nodes proportionally to character count (acceptable for headlines)
  3. **SEO**: Search engines index original text content, not wrapper spans
- **Reviewer Notes**: Test with screen readers (NVDA, JAWS, VoiceOver) to confirm natural reading experience

## User Scenarios & Testing

### User Story 1 - Character-by-character reveal for hero headlines (Priority: P1)

As a portfolio visitor, when I land on the homepage, I see the hero headline text reveal character-by-character with a smooth stagger effect, creating an engaging first impression that draws attention to key messaging.

**Why this priority**: Hero section is the highest-impact area (100% visitor exposure). Text reveal adds professional polish and guides visual attention to primary messaging. This is the MVP - a working character animation proves the core utility.

**Independent Test**: Can be fully tested by adding `data-split-text="char"` to the hero `<h1>` element and observing staggered character reveal on page load. Delivers immediate visual impact without requiring word or line splitting.

**Acceptance Scenarios**:

1. **Given** a hero headline with `data-split-text="char"`, **When** the page loads and the element enters viewport, **Then** each character fades in sequentially with 50ms stagger delay
2. **Given** a hero headline with `data-split-text="char" data-split-delay="0.1"`, **When** animation triggers, **Then** each character uses 100ms stagger delay
3. **Given** a user with `prefers-reduced-motion: reduce`, **When** page loads, **Then** all text appears instantly without animation
4. **Given** a screen reader user, **When** accessing animated text, **Then** the full text is announced naturally without fragmentation

---

### User Story 2 - Word-by-word reveal for section titles (Priority: P2)

As a portfolio visitor scrolling through sections, I see section titles reveal word-by-word as they enter the viewport, creating rhythm and visual interest without overwhelming the reading experience.

**Why this priority**: Extends the animation system to a second common use case (section headings). Word-level animation is less granular than character-level, suitable for body content. Still delivers value independently.

**Independent Test**: Can be fully tested by adding `data-split-text="word"` to any `<h2>` or `<h3>` section title. Works independently of character animation and proves the splitting logic handles different granularities.

**Acceptance Scenarios**:

1. **Given** a section heading with `data-split-text="word"`, **When** the user scrolls it into view, **Then** each word fades in sequentially with default stagger
2. **Given** a heading with `data-split-text="word" data-split-duration="0.8"`, **When** animation triggers, **Then** each word uses 0.8s fade duration
3. **Given** multiple headings with word animation, **When** user scrolls quickly, **Then** each heading animates independently without overlap or interference

---

### User Story 3 - Line-by-line reveal for paragraphs (Priority: P3)

As a portfolio visitor reading content, I see paragraphs reveal line-by-line as I scroll, creating a subtle reading guide that doesn't distract from content comprehension.

**Why this priority**: Handles longer content blocks where character/word animation would be excessive. Lowest priority because line animation is less commonly needed (most impact is in headlines/titles).

**Independent Test**: Can be fully tested by adding `data-split-text="line"` to a multi-line `<p>` element. Works independently and proves the utility handles all three splitting modes.

**Acceptance Scenarios**:

1. **Given** a paragraph with `data-split-text="line"`, **When** scrolled into view, **Then** each line fades in sequentially from top to bottom
2. **Given** a paragraph with dynamic content (varying line breaks at different viewport widths), **When** viewport resizes, **Then** line splits recalculate correctly
3. **Given** a paragraph with `data-split-text="line" data-split-stagger="0.15"`, **When** animation triggers, **Then** each line uses 0.15s stagger delay

---

### Edge Cases

- **Empty elements**: What happens when an element with `data-split-text` contains no text or only whitespace?
- **Dynamic content**: How does the system handle text that changes after initial page load (e.g., content loaded via fetch)?
- **Viewport resize**: If a user resizes the viewport during a line-based animation, do line breaks recalculate correctly?
- **Multiple animations**: Can the same element have multiple split animations (e.g., trigger again on hover)?
- **Long text**: How does performance degrade with very long strings (e.g., 1000+ characters)?
- **Special characters**: Do emojis, accented characters, and non-Latin scripts split correctly?
- **Nested elements**: What happens if `data-split-text` is applied to an element containing `<strong>` or `<em>` tags?
- **Page navigation**: Do animations clean up properly on Astro page transitions (`astro:before-swap`)?

## Requirements

### Functional Requirements

- **FR-001**: System MUST split text content into individual characters when `data-split-text="char"` attribute is present
- **FR-002**: System MUST split text content into individual words when `data-split-text="word"` attribute is present
- **FR-003**: System MUST split text content into individual lines when `data-split-text="line"` attribute is present
- **FR-004**: System MUST animate split text elements with GSAP stagger animation (fade from opacity 0 to 1, translate from y: 20px to 0)
- **FR-005**: System MUST respect `data-split-duration` attribute for custom animation duration (default: 0.6s)
- **FR-006**: System MUST respect `data-split-delay` attribute for custom stagger delay between elements (default: 0.05s for char/word, 0.1s for line)
- **FR-007**: System MUST automatically trigger animations when element enters viewport using IntersectionObserver (50% threshold)
- **FR-008**: System MUST disable all text animations when user has `prefers-reduced-motion: reduce` preference
- **FR-009**: System MUST preserve original text for screen readers by wrapping split elements in `aria-hidden="true"` and including visually hidden original text
- **FR-010**: System MUST wrap split characters/words/lines in `<span>` elements with `display: inline-block` for animatable layout
- **FR-011**: System MUST clean up event listeners and animation instances on page navigation (`astro:before-swap` event)
- **FR-012**: System MUST handle empty or whitespace-only text gracefully without errors
- **FR-013**: System MUST allow animations to trigger only once per element (no repeat on scroll)
- **FR-014**: System MUST use `power3.out` easing by default, overridable via `data-split-easing` attribute

### Key Entities

- **AnimatedTextElement**: Represents a DOM element with `data-split-text` attribute, tracking its split type, animation state, and configuration parameters
- **SplitFragment**: Represents a single character/word/line span created during text splitting, including its animation timeline and cleanup handlers

## Success Criteria

### Measurable Outcomes

- **SC-001**: Text reveal animations execute at 60fps on HIGH tier devices and 30fps minimum on MID tier devices
- **SC-002**: Animation initialization (splitting + GSAP timeline setup) completes in under 100ms for headlines with up to 100 characters
- **SC-003**: Animations respect `prefers-reduced-motion` preference with 100% reliability (no animated frames shown to users who request reduced motion)
- **SC-004**: Screen readers announce text naturally without reading individual character spans or "span" element names
- **SC-005**: All text animations clean up properly on page navigation with zero memory leaks (verified via Chrome DevTools heap snapshots)
- **SC-006**: Visual polish: Text reveal animations feel smooth and professional, enhancing brand perception without distracting from content
- **SC-007**: Developer experience: Adding text animation requires only a single HTML attribute (`data-split-text="char"`) with no JavaScript configuration for basic use cases
- **SC-008**: Accessibility: 100% WCAG 2.1 AA compliance for animated text (contrast, keyboard navigation, reduced motion support)

## Scope

### In Scope

- Character-level text splitting and stagger animation
- Word-level text splitting and stagger animation
- Line-level text splitting and stagger animation
- Configurable animation parameters via data attributes (duration, delay, easing)
- Automatic animation triggering via IntersectionObserver
- Reduced motion support with instant text reveal
- Screen reader accessibility with preserved text semantics
- Cleanup on Astro page navigation
- Integration with existing GSAP configuration and animation patterns

### Out of Scope

- Custom animation effects beyond fade + translateY (no rotate, scale, color transitions)
- Manual JavaScript API for programmatic animation control (only declarative HTML attributes in v1)
- Animation replay on repeated scroll (animations trigger once only)
- Text animation for dynamically inserted content (only processes elements present at page load)
- Advanced typography effects (text gradients, outline animations, text masking)
- Performance optimization for very long text blocks (>500 characters) - focus on headlines/titles

## Assumptions

- The portfolio already uses GSAP 3.13.0+ with ScrollTrigger registered
- The portfolio uses Astro's view transitions (listens for `astro:before-swap` event)
- Text to be animated is primarily in headlines, titles, and short content blocks (<200 characters)
- Most use cases are satisfied by fade + translateY animation (no need for complex custom effects in v1)
- Users access the portfolio via modern browsers supporting IntersectionObserver (Safari 12.1+, Chrome 58+, Firefox 55+)
- Line-based splitting is used sparingly (performance impact acceptable for <10 elements per page)

## Dependencies

- **GSAP 3.13.0+**: Core animation library (already installed)
- **IntersectionObserver API**: For automatic viewport-based animation triggering (natively supported in target browsers)
- **CSS custom properties**: For animation timing values (`--transition-duration` integration optional)
- **Existing accessibility utilities**: `prefers-reduced-motion` detection pattern from `src/scripts/accessibility.ts`

## Open Questions

None - all ambiguities resolved via AUTO policy with high confidence based on existing portfolio patterns and standard web animation practices.
