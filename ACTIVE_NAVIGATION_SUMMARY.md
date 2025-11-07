# Active Navigation Indicators - Quick Reference

## Three Core Components

### 1. Active Navigation State Detection
**Decision**: Intersection Observer API with Debounced Hash Updates

**Why**:
- 80-90% less CPU than scroll events
- Works natively with Lenis smooth scroll
- Browser-optimized, runs on separate thread
- 0KB bundle overhead

**Key Implementation**:
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries.find(e => e.isIntersecting);
    if (visible) {
      updateActiveLink(visible.target.id);
      updateURL(visible.target.id);  // Debounced
    }
  },
  {
    rootMargin: '-50% 0px -50% 0px'  // Trigger at center
  }
);

document.querySelectorAll('[data-section]').forEach(s => observer.observe(s));
```

**CSS Pattern**:
```html
<section id="about" data-section="about"><!-- content --></section>
<nav>
  <a href="#about" data-nav-link="about">About</a>
</nav>

<style>
  a[aria-current="page"] {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
  }
</style>
```

**Edge Cases**:
- Boundary between sections → Use `rootMargin: '-50%'` to trigger at center
- Rapid scrolling → Debounce URL updates to 100ms intervals
- Fixed header overlap → Adjust `rootMargin` for header height
- No visible section → Keep last active state, don't clear

---

### 2. Navigation Link Behavior
**Decision**: Lenis scrollToElement() with Manual Focus Management

**Why**:
- Integrates perfectly with existing Lenis smooth scroll
- Manual focus ensures accessibility compliance
- Handles all edge cases (header overlap, scroll completion, mobile)
- Provides screen reader feedback

**Key Implementation**:
```typescript
// Listen to clicks on navigation links
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-nav-link]');
  if (!link) return;

  const sectionId = link.getAttribute('data-nav-link');
  e.preventDefault();

  // Use Lenis (already initialized)
  scrollToElement(`#${sectionId}`, {
    offset: 80  // Account for sticky header
  });

  // After scroll completes, manage focus
  focusSection(sectionId);
});

// Focus management
function focusSection(sectionId) {
  const section = document.getElementById(sectionId);
  const focusable = section.querySelector(
    'a, button, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable) {
    focusable.focus();
  } else {
    section.setAttribute('tabindex', '-1');
    section.focus();
  }
}
```

**Keyboard Support** (Already Works):
- Links are native `<a>` elements → Tab navigation works
- Enter key triggers click → Smooth scroll works
- No additional keyboard handling needed

**Accessibility Requirements**:
- ✅ Use semantic `<a>` tags (keyboard accessible by default)
- ✅ Manage focus after programmatic scroll
- ✅ Announce scroll completion to screen readers
- ✅ Respect sticky header with offset

---

### 3. URL Management
**Decision**: History API with Hash-Based Routing

**Why**:
- Browser back/forward buttons work naturally
- Deep linking supported (can bookmark `/#projects`)
- Silent updates don't create excessive history entries
- Works with Astro static generation

**Key Implementation**:
```typescript
class HistoryManager {
  // Silent update during scroll (doesn't create history entry)
  replaceURL(sectionId) {
    window.history.replaceState(null, '', `#${sectionId}`);
  }

  // User-initiated navigation (creates history entry for back button)
  pushURL(sectionId) {
    window.history.pushState(null, '', `#${sectionId}`);
  }

  // Handle browser back/forward
  constructor() {
    window.addEventListener('popstate', (e) => {
      const hash = window.location.hash.substring(1);
      scrollToElement(`#${hash}`, { offset: 80 });
    });

    // Deep linking: load page with hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
      this.navigateToSection(initialHash);
    }
  }
}
```

**Pattern Recommendations**:
- **Intersection Observer** → `replaceState` (silent, no history entry)
- **User clicks link** → `pushState` (creates history entry)
- **Browser back/forward** → Handled by `popstate` event

**Supported Flows**:
- ✅ Click link → scroll to section → back button returns previous section
- ✅ Scroll manually → URL updates silently → sharing link works
- ✅ Bookmark `/#about` → reloads to that section
- ✅ Deep link `example.com/#projects` → loads projects section

---

## Integration Pattern

```typescript
// Combine all three systems
class NavigationCoordinator {
  private activeNav: ActiveNavigationManager;
  private history: HistoryManager;
  private scrollHandler: SmoothScrollHandler;

  constructor() {
    this.history = new HistoryManager();
    this.activeNav = new ActiveNavigationManager();

    // When scrolling to section (Intersection Observer)
    this.activeNav.on('sectionChanged', (id) => {
      this.history.replaceURL(id);  // Silent update
    });

    // When clicking link
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-nav-link]');
      if (!link) return;

      const id = link.getAttribute('data-nav-link');
      e.preventDefault();
      this.history.pushURL(id);  // Creates history entry
      scrollToElement(`#${id}`, { offset: 80 });
    });
  }
}
```

---

## Performance Budget

| Component | Bundle Size | CPU Impact |
|-----------|-------------|-----------|
| Intersection Observer | 0KB (native) | <1% |
| Lenis scrollTo() | 0KB (existing) | Minimal |
| History API | 0KB (native) | <1ms per update |
| Custom manager classes | ~8-10KB | <1% |
| **Total** | ~8-10KB | <1% |

Budget: 200KB JS, 95%+ performance remaining ✅

---

## Accessibility Compliance

**Keyboard Navigation**:
- ✅ Tab through links (native `<a>` elements)
- ✅ Enter/Space activates link
- ✅ Escape closes any overlays (if applicable)

**Screen Reader**:
- ✅ Links announced with `aria-label` or text
- ✅ Active link identified via `aria-current="page"`
- ✅ Scroll completion announced via sr-only region

**Visual**:
- ✅ Focus indicator visible on links
- ✅ Active state distinct from hover (different color/underline)
- ✅ Color contrast ≥4.5:1 (WCAG AA)

**Motion**:
- ✅ Respect `prefers-reduced-motion` (Lenis handles)
- ✅ No animations for users with motion preferences

---

## Testing Checklist

**Click Navigation**:
- [ ] Click link → smooth scroll animates
- [ ] Tab to link → Enter activates it
- [ ] Focus moves to section content after scroll

**Scroll Detection**:
- [ ] Scroll to section → URL updates silently
- [ ] Scroll between sections → active link changes
- [ ] Active link styled correctly

**Browser Navigation**:
- [ ] Click link → back button works
- [ ] Back button returns to previous section
- [ ] Forward button returns to next section
- [ ] URL history is clean (no duplicate entries)

**Deep Linking**:
- [ ] Load page with `#projects` hash → scrolls to projects
- [ ] Bookmark `example.com/#about` → loads that section
- [ ] Share link with hash → recipient lands on section

**Edge Cases**:
- [ ] Scroll past header without link → URL still updates
- [ ] Rapid clicking links → no animation race conditions
- [ ] Mobile swipe during scroll → animation cancels gracefully
- [ ] Invalid hash (section doesn't exist) → graceful fallback

**Accessibility**:
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces active section
- [ ] Focus indicator visible on links
- [ ] No WCAG AA contrast violations

---

## Common Mistakes to Avoid

1. **Using scroll events instead of Intersection Observer**
   - ❌ `window.addEventListener('scroll', ...)`
   - ✅ Use Intersection Observer API

2. **preventDefault() on every link**
   - ❌ Prevents back button and bookmarking
   - ✅ Only preventDefault() on internal anchor links

3. **pushState for every scroll event**
   - ❌ Creates 60+ history entries during scroll
   - ✅ Use replaceState for scroll, pushState for clicks

4. **Not managing focus after programmatic scroll**
   - ❌ User scrolled to section but can't interact with it
   - ✅ Focus first interactive element after scroll

5. **Ignoring sticky header offset**
   - ❌ Content hidden under header after scroll
   - ✅ Pass offset to scrollToElement()

6. **Using both GSAP ScrollTrigger and Intersection Observer**
   - ❌ Duplicate scroll detection, conflicts
   - ✅ Choose one (Intersection Observer recommended)

7. **Not supporting deep linking**
   - ❌ Can't bookmark sections or share links
   - ✅ Handle initial hash on page load

---

## References

**API Documentation**:
- Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- History API: https://developer.mozilla.org/en-US/docs/Web/API/History_API
- Lenis: https://lenis.darkroom.engineering/

**Standards**:
- WCAG 2.1 Focus Management: https://www.w3.org/WAI/WCAG21/Understanding/focus-order
- HTML Living Standard: https://html.spec.whatwg.org/multipage/

**Related Features**:
- Smooth scroll (already implemented with Lenis)
- GSAP ScrollTrigger (for scroll-driven animations)
- Focus trap utilities (in accessibility.ts)
