# Navigation System

## Overview

The portfolio implements a sophisticated single-page navigation system that provides smooth section-to-section transitions, active state tracking, and full accessibility support. The system uses hash-based routing with browser history integration and respects user motion preferences.

## Architecture

### Core Components

The navigation system consists of five primary JavaScript modules that work together to provide smooth navigation across 6 full-viewport sections:

1. **Smooth Scroll Manager** (`src/scripts/smooth-scroll.ts`)
   - Initializes Lenis smooth scroll library
   - Configures section snap functionality
   - Provides utility functions for scrolling
   - Respects user motion preferences

2. **Active Navigation Manager** (`src/scripts/active-navigation.ts`)
   - Tracks which section is currently visible
   - Updates navigation link states
   - Uses IntersectionObserver API

3. **Navigation Link Handler** (`src/scripts/navigation-links.ts`)
   - Handles navigation link clicks
   - Triggers smooth scroll to target sections
   - Manages focus for keyboard users

4. **Navigation History Manager** (`src/scripts/navigation-history.ts`)
   - Handles initial page load with hash
   - Manages browser back/forward navigation
   - Updates URL hash on section changes

5. **Navigation Dots Manager** (`src/scripts/navigation-dots.ts`)
   - Synchronizes dot active states with section visibility
   - Handles dot click events for smooth scrolling
   - Uses MutationObserver to sync with main navigation
   - Manages cleanup on page navigation

### Implementation Pattern

All five modules must be initialized in `index.astro`:

```javascript
import { initSmoothScroll } from '../scripts/smooth-scroll';
import { initActiveNavigation } from '@/scripts/active-navigation';
import { initNavigationLinks } from '@/scripts/navigation-links';
import { initNavigationHistory } from '@/scripts/navigation-history';
import { initNavigationDots } from '@/scripts/navigation-dots';

// Initialize on page load (order matters!)
initSmoothScroll();        // Initialize Lenis first (exposes window.lenis)
initActiveNavigation();    // Tracks active section
initNavigationLinks();     // Handles link clicks (depends on window.lenis)
initNavigationHistory();   // Handles deep linking + history
initNavigationDots();      // Syncs navigation dots with active section
```

## Active Section Tracking

### IntersectionObserver Configuration

```typescript
// src/scripts/active-navigation.ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('data-section');
        updateActiveNavLink(sectionId);
      }
    });
  },
  {
    threshold: 0.3,  // 30% visibility triggers active state
    rootMargin: '0px'
  }
);

// Observe all sections
document.querySelectorAll('[data-section]').forEach((section) => {
  observer.observe(section);
});
```

### Active Link Updates

When a section becomes active:
- Navigation link with matching `href="/#section-id"` gets `aria-current="page"` attribute
- Previous active link has `aria-current` removed
- CSS targets `[aria-current="page"]` for visual styling

```css
/* Active link styling */
nav a[aria-current="page"] {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
```

## Smooth Scroll Navigation

### Lenis Integration

The navigation system uses Lenis for smooth, natural scrolling with section snap functionality:

```typescript
// src/scripts/smooth-scroll.ts - Initialize Lenis with snap
import Lenis from '@studio-freight/lenis';

// Custom easeInOutExpo easing function
function easeInOutExpo(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) {
    return Math.pow(2, 20 * t - 10) / 2;
  }
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
}

const lenis = new Lenis({
  duration: 1.2,
  easing: easeInOutExpo,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
  syncTouch: true,        // Enable momentum scrolling
  syncTouchLerp: 0.1,
});

// Expose on window for navigation-links.ts compatibility
window.lenis = lenis;

// src/scripts/navigation-links.ts - Use global Lenis instance
function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const lenis = window.lenis;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use Lenis for smooth scroll (if available and motion not reduced)
  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(`#${sectionId}`);
  } else {
    // Fallback to native smooth scroll
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  // Focus target for keyboard users
  setTimeout(() => {
    target.focus({ preventScroll: true });
  }, 100);
}
```

**Section Snap Behavior**:
- Monitors scroll velocity continuously
- When velocity drops below 0.1 (user stopped scrolling), triggers snap check
- Finds the closest section within viewport range
- Smoothly snaps to section start using easeInOutExpo (1.2s duration)
- 150ms debounce prevents snap triggering during active scroll
- Minimum 10px distance threshold prevents micro-adjustments

### Reduced Motion Support

The system respects `prefers-reduced-motion` preferences:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Use instant scroll instead of smooth
  target.scrollIntoView({ behavior: 'auto' });
} else {
  // Use Lenis smooth scroll
  lenis.scrollTo(target);
}
```

## Browser History Management

### Hash-Based Routing

The system uses URL hash fragments for section identification:

```typescript
// src/scripts/navigation-history.ts

// On initial page load
function handleInitialHash() {
  const hash = window.location.hash.slice(1);  // Remove '#'
  if (hash) {
    // Wait for page to fully load
    window.addEventListener('load', () => {
      scrollToSection(hash);
    });
  }
}

// On hash change (back/forward buttons)
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    scrollToSection(hash);
  }
});

// Update hash when section changes (without triggering scroll)
function updateHash(sectionId: string) {
  history.replaceState(null, '', `#${sectionId}`);
}
```

### Navigation Events

```typescript
// Listen for navigation link clicks
document.querySelectorAll('a[href^="/#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const sectionId = href.slice(2);  // Remove '/#'

    // Scroll to section
    scrollToSection(sectionId);

    // Update URL hash
    history.pushState(null, '', href);
  });
});
```

## Navigation Dots Component

### Component Structure

The NavigationDots component (`src/components/ui/NavigationDots.astro`) provides a vertical navigation interface positioned on the right side of the viewport:

```astro
---
import { navigationLinks } from "../../data/navigation";

// Filter out blog link (not a section on single-page layout)
const sectionLinks = navigationLinks.filter(
  (link) => !link.href.includes("blog")
);
---

<nav
  class="navigation-dots"
  aria-label="Section navigation"
  data-navigation-dots
>
  <ul class="navigation-dots__list" role="list">
    {sectionLinks.map((link) => (
      <li class="navigation-dots__item">
        <a
          href={link.href}
          class="navigation-dots__link"
          data-section-id={link.targetSectionId}
          aria-label={link.ariaLabel}
        >
          <span class="navigation-dots__dot" aria-hidden="true" />
          <span class="navigation-dots__label">{link.label}</span>
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### Active State Synchronization

The navigation dots sync their active state with the main navigation system using a MutationObserver:

```typescript
// src/scripts/navigation-dots.ts
const syncActiveDots = () => {
  // Find the currently active main navigation link
  const activeNavLink = document.querySelector<HTMLAnchorElement>(
    'a[href^="#"][aria-current="page"]'
  );

  if (!activeNavLink) return;

  // Extract section ID from the active link
  const href = activeNavLink.getAttribute("href");
  const sectionId = href?.replace(/^\/#?/, "");

  // Update dot states
  dotLinks.forEach((dotLink) => {
    const dotSectionId = dotLink.getAttribute("data-section-id");

    if (dotSectionId === sectionId) {
      dotLink.classList.add("active");
      dotLink.setAttribute("aria-current", "page");
    } else {
      dotLink.classList.remove("active");
      dotLink.removeAttribute("aria-current");
    }
  });
};

// Watch for changes when active-navigation updates nav links
const observer = new MutationObserver(() => {
  syncActiveDots();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["aria-current", "class"],
  subtree: true,
});
```

### Smooth Scroll Integration

Navigation dots trigger smooth scrolling using the Lenis library:

```typescript
dotLinks.forEach((dotLink) => {
  dotLink.addEventListener("click", (e) => {
    e.preventDefault();

    const href = dotLink.getAttribute("href");
    const targetId = href?.replace(/^\/#?/, "");
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    // Use Lenis for smooth scrolling if available
    if (window.lenis) {
      window.lenis.scrollTo(targetSection, {
        offset: 0,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      });
    } else {
      // Fallback to native smooth scroll
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Update URL hash
    window.history.pushState(null, "", `#${targetId}`);
  });
});
```

### Visual Styling

The component uses CSS custom properties and respects user motion preferences. With the addition of the Experience section, the navigation dots now include 6 dots total (hero, about, experience, projects, expertise, contact):

```css
.navigation-dots {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

/* Active state */
.navigation-dots__link.active .navigation-dots__dot {
  transform: scale(1.6);
  background-color: var(--color-primary);
}

/* Hover reveals label */
.navigation-dots__link:hover .navigation-dots__label {
  opacity: 1;
  transform: translateX(0);
}

/* Responsive: Hide on mobile/tablet */
@media (max-width: 1024px) {
  .navigation-dots {
    display: none;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .navigation-dots__link,
  .navigation-dots__dot,
  .navigation-dots__label {
    transition-duration: 0.01ms !important;
  }

  .navigation-dots__link.active .navigation-dots__dot {
    transform: scale(1.2); /* Subtle scale instead of large */
  }
}
```

### Accessibility Features

- **Keyboard Navigation**: All dots are keyboard accessible with Tab key
- **Focus Indicators**: Visible outline on focus-visible state
- **ARIA Attributes**: `aria-label` on links, `aria-current="page"` on active dot
- **Semantic HTML**: Uses `<nav>` with `role="list"` for proper structure
- **Screen Reader Support**: Descriptive labels for each dot
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## URL Redirects

Old page URLs redirect to corresponding hash anchors using Astro's redirect configuration:

```javascript
// astro.config.mjs
export default defineConfig({
  redirects: {
    '/about': '/#about',
    '/projects': '/#projects',
    '/expertise': '/#expertise',
    '/contact': '/#contact',
  },
});
```

## Section Structure

### HTML Markup

Each section follows a consistent structure:

```html
<section
  id="hero"
  data-section="hero"
  class="portfolio-section portfolio-section--hero"
  role="main"
  aria-label="Hero section with introduction"
  tabindex="-1"
>
  <!-- Section content -->
</section>
```

**Attributes**:
- `id`: Unique identifier for hash navigation (hero, about, experience, projects, expertise, contact)
- `data-section`: Matches `id`, used by IntersectionObserver
- `class`: Base class + section-specific modifier
- `role`: ARIA landmark (`main` for hero, `region` for others)
- `aria-label`: Descriptive label for screen readers
- `tabindex="-1"`: Allows programmatic focus (for keyboard navigation)

### CSS Classes

```css
/* Base section styles */
.portfolio-section {
  min-height: 100vh;
  min-height: 100dvh;  /* Dynamic viewport height for mobile */
  display: flex;
  flex-direction: column;
  scroll-margin-top: 0;  /* Accounts for fixed headers if added */
}

/* Desktop: Fixed height */
@media (min-width: 1024px) {
  .portfolio-section {
    height: 100vh;
    height: 100dvh;
  }
}

/* Section-specific styles */
.portfolio-section--hero {
  justify-content: center;
  align-items: center;
}

.portfolio-section--about {
  padding: clamp(2rem, 5vw, 4rem);
}
```

## Accessibility

### Keyboard Navigation

**Tab Navigation**:
- Tab through navigation links
- Enter key activates link and scrolls to section
- Focus moves to target section after scroll

**Focus Management**:
```typescript
function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  // Scroll to section
  lenis.scrollTo(target);

  // Focus section for keyboard users (preventScroll avoids double scroll)
  setTimeout(() => {
    target.focus({ preventScroll: true });
  }, 100);
}
```

### Screen Reader Support

**ARIA Attributes**:
- `aria-current="page"` indicates active navigation link
- `aria-label` provides context for each section
- `role="main"` for hero, `role="region"` for other sections

**Announcements**:
```typescript
// Announce section change to screen readers
function announceSection(sectionName: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Navigated to ${sectionName} section`;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000);
}
```

### Motion Preferences

The system checks `prefers-reduced-motion` in multiple places:

```typescript
// Check once at initialization
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Listen for changes
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
motionQuery.addEventListener('change', (e) => {
  if (e.matches) {
    // Disable smooth scroll
    lenis.destroy();
  } else {
    // Re-enable smooth scroll
    initLenis();
  }
});
```

## Performance Considerations

### Lazy Initialization

Navigation scripts use minimal overhead:
- IntersectionObserver is efficient (browser-native)
- Event listeners attached once on page load
- No polling or timers

### Cleanup

```typescript
// Clean up on page navigation (for SPA transitions)
document.addEventListener('astro:before-swap', () => {
  observer.disconnect();
  lenis.destroy();
  // Remove event listeners
});
```

### Bundle Size

| Module | Size (minified) |
|--------|----------------|
| smooth-scroll.ts | ~2.5 KB |
| active-navigation.ts | ~1.5 KB |
| navigation-links.ts | ~1.2 KB |
| navigation-history.ts | ~0.8 KB |
| navigation-dots.ts | ~1.8 KB |
| **Total** | **~7.8 KB** |

Lenis library: ~10 KB (included for smooth scroll + snap functionality)

## Testing

### Manual Test Cases

1. **Smooth Scroll**:
   - Click each navigation link
   - Verify smooth scroll to target section
   - Verify URL hash updates

2. **Active State**:
   - Scroll manually through sections
   - Verify active link updates at 30% visibility
   - Verify `aria-current` attribute changes

3. **Deep Linking**:
   - Visit `/#about` directly
   - Verify page scrolls to About section on load
   - Test with all 5 section hashes

4. **Browser History**:
   - Click multiple navigation links
   - Use browser back button
   - Verify sections scroll back in order
   - Verify URL hash matches visible section

5. **Keyboard Navigation**:
   - Tab through navigation links
   - Press Enter on each link
   - Verify focus moves to target section
   - Verify scroll occurs

6. **Reduced Motion**:
   - Enable OS-level reduced motion preference
   - Click navigation links
   - Verify instant scroll (no animation)

7. **Screen Reader**:
   - Navigate with NVDA/VoiceOver
   - Verify sections are announced
   - Verify active link is announced
   - Verify landmarks are recognized

8. **Navigation Dots**:
   - Click each dot to navigate to section
   - Verify active dot updates when scrolling manually
   - Hover over dots to reveal labels
   - Tab through dots with keyboard
   - Verify dots are hidden on mobile/tablet (<1024px)
   - Test with reduced motion enabled

### Automated Tests

```typescript
// tests/integration/navigation.test.ts
import { describe, test, expect, beforeEach } from 'bun:test';

describe('Section Navigation', () => {
  beforeEach(() => {
    // Set up DOM with sections
  });

  test('updates active link on scroll', () => {
    // Simulate scroll to section
    // Check aria-current attribute
  });

  test('scrolls to section on link click', () => {
    // Click link
    // Check scrollTo was called
  });

  test('handles deep linking', () => {
    // Set window.location.hash
    // Check section is scrolled to
  });

  test('navigation dots sync with active section', () => {
    // Simulate scroll to section
    // Check corresponding dot has active class
    // Check aria-current="page" is set on dot
  });

  test('navigation dots trigger smooth scroll on click', () => {
    // Click navigation dot
    // Check scrollTo was called with correct target
    // Check URL hash was updated
  });
});
```

## Troubleshooting

### Common Issues

**Scroll not smooth**:
- Check Lenis initialization in `scroll-animations.ts`
- Verify Lenis is imported and initialized before navigation links
- Check for CSS `scroll-behavior: auto` override

**Active link not updating**:
- Verify all sections have `data-section` attribute
- Check IntersectionObserver threshold (30%)
- Ensure sections are tall enough to trigger threshold

**Deep linking not working**:
- Check hash format (must be `#section-id`, not `/#section-id`)
- Verify `initNavigationHistory()` is called
- Check for JavaScript errors preventing execution

**Focus issues**:
- Verify sections have `tabindex="-1"` attribute
- Check focus timing (may need delay after scroll)
- Ensure `preventScroll: true` is used in focus call

**Navigation dots not syncing**:
- Verify `data-navigation-dots` attribute is present on component
- Check `data-section-id` attributes match section IDs
- Verify MutationObserver is watching for `aria-current` changes
- Ensure `initNavigationDots()` is called after `initActiveNavigation()`

**Navigation dots visible on mobile**:
- Check media query breakpoint is set to 1024px
- Verify CSS `display: none` is applied at correct breakpoint
- Check for CSS specificity issues overriding mobile styles

## Future Enhancements

- **Scroll Progress Indicator**: Visual indicator of scroll position
- **Section Transitions**: Custom transitions between sections
- **Permalink Copying**: Copy link to specific section
- **Section Preloading**: Preload content for next section
- **Touch Gestures**: Swipe between sections on mobile
