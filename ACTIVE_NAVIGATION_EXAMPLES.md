# Active Navigation - Implementation Examples

Complete, copy-paste-ready code examples for implementing active navigation indicators.

---

## File Structure

```
src/
├── scripts/
│   ├── active-navigation.ts      ← NEW: Core active nav manager
│   ├── navigation-history.ts     ← NEW: History API management
│   └── scroll-animations.ts      ← EXISTING: Already has scrollToElement()
├── components/
│   ├── layout/
│   │   ├── Header.astro          ← UPDATE: Add data attributes
│   │   └── BurgerMenu.astro      ← UPDATE: Add data attributes
│   └── sections/
│       ├── Hero.astro            ← UPDATE: Add id and data-section
│       ├── AboutIDE.astro        ← UPDATE: Add id and data-section
│       └── ...
└── data/
    └── navigation.ts             ← EXISTING: Use for active link detection
```

---

## 1. Create Active Navigation Manager

**File**: `src/scripts/active-navigation.ts` (NEW)

```typescript
/**
 * Active Navigation Manager
 * Detects which section is currently in view using Intersection Observer
 * Updates navigation links and optionally updates URL hash
 */

export interface ActiveNavOptions {
  rootMargin?: string;      // Space around viewport (e.g., '-50% 0px')
  updateURL?: boolean;      // Update hash when section becomes active
  debounceMS?: number;      // Debounce URL updates (ms)
  onSectionChange?: (sectionId: string) => void;
}

export class ActiveNavigationManager {
  private observer: IntersectionObserver;
  private activeSection: string | null = null;
  private urlUpdateTimer: ReturnType<typeof setTimeout> | null = null;
  private debounceMS: number;
  private updateURL: boolean;
  private onSectionChange: ((id: string) => void) | null = null;

  constructor(options: ActiveNavOptions = {}) {
    const {
      rootMargin = '-50% 0px -50% 0px',
      updateURL = true,
      debounceMS = 100,
      onSectionChange = null,
    } = options;

    this.updateURL = updateURL;
    this.debounceMS = debounceMS;
    this.onSectionChange = onSectionChange;

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    // Observe all sections
    this.observeSections();
  }

  private observeSections(): void {
    document.querySelectorAll('[data-section]').forEach((section) => {
      this.observer.observe(section);
    });
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    // Find first visible entry
    const visibleEntry = entries.find((entry) => entry.isIntersecting);

    if (visibleEntry) {
      const sectionId = (visibleEntry.target as HTMLElement).getAttribute(
        'data-section'
      );

      if (sectionId && sectionId !== this.activeSection) {
        this.setActive(sectionId);
      }
    }
  }

  private setActive(sectionId: string): void {
    this.activeSection = sectionId;

    // Update navigation links immediately
    this.updateNavigationLinks(sectionId);

    // Debounce URL update
    if (this.updateURL) {
      this.debouncedUpdateURL(sectionId);
    }

    // Call callback
    if (this.onSectionChange) {
      this.onSectionChange(sectionId);
    }
  }

  private updateNavigationLinks(sectionId: string): void {
    // Remove active state from all links
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      link.removeAttribute('aria-current');
    });

    // Set active state on current link
    const activeLink = document.querySelector(
      `[data-nav-link="${sectionId}"]`
    );
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  private debouncedUpdateURL(sectionId: string): void {
    if (this.urlUpdateTimer) {
      clearTimeout(this.urlUpdateTimer);
    }

    this.urlUpdateTimer = setTimeout(() => {
      window.history.replaceState(null, '', `#${sectionId}`);
    }, this.debounceMS);
  }

  public getActiveSection(): string | null {
    return this.activeSection;
  }

  public destroy(): void {
    this.observer.disconnect();
    if (this.urlUpdateTimer) {
      clearTimeout(this.urlUpdateTimer);
    }
  }
}
```

---

## 2. Create History Manager

**File**: `src/scripts/navigation-history.ts` (NEW)

```typescript
/**
 * History Manager
 * Manages URL hash updates and browser back/forward navigation
 * Integrates with Lenis smooth scroll
 */

import { scrollToElement } from './scroll-animations';

export interface HistoryState {
  sectionId: string;
  timestamp: number;
  scrollY: number;
}

export class NavigationHistoryManager {
  private isNavigating = false;

  constructor() {
    this.setupHashChangeListener();
    this.handleInitialHash();
  }

  /**
   * Silently update URL without creating history entry
   * Used during automatic scroll (e.g., Intersection Observer)
   */
  public replaceURL(sectionId: string): void {
    const state: HistoryState = {
      sectionId,
      timestamp: Date.now(),
      scrollY: window.scrollY,
    };

    window.history.replaceState(state, '', `#${sectionId}`);
    console.log(`[History] Replaced URL: #${sectionId}`);
  }

  /**
   * Update URL and create history entry
   * Used for user-initiated navigation (link clicks)
   */
  public pushURL(sectionId: string): void {
    const state: HistoryState = {
      sectionId,
      timestamp: Date.now(),
      scrollY: window.scrollY,
    };

    window.history.pushState(state, '', `#${sectionId}`);
    console.log(`[History] Pushed state: #${sectionId}`);
  }

  /**
   * Get current hash without the # prefix
   */
  public getCurrentHash(): string {
    return window.location.hash.substring(1);
  }

  /**
   * Navigate to section (used by popstate handler)
   */
  private async navigateToSection(sectionId: string): Promise<void> {
    if (this.isNavigating) return;
    this.isNavigating = true;

    try {
      const element = document.getElementById(sectionId);
      if (!element) {
        console.warn(`[History] Section not found: ${sectionId}`);
        return;
      }

      // Use Lenis if available, fallback to native scroll
      scrollToElement(element, { offset: 80 });

      // Update active navigation link
      this.updateActiveLink(sectionId);
    } finally {
      this.isNavigating = false;
    }
  }

  /**
   * Update active navigation link
   */
  private updateActiveLink(sectionId: string): void {
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      link.removeAttribute('aria-current');
    });

    const activeLink = document.querySelector(
      `[data-nav-link="${sectionId}"]`
    );
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  /**
   * Setup listener for hash changes
   */
  private setupHashChangeListener(): void {
    // Browser back/forward button
    window.addEventListener('popstate', (e) => {
      const state = e.state as HistoryState;
      if (state?.sectionId) {
        this.navigateToSection(state.sectionId);
      }
    });
  }

  /**
   * Handle URL hash on initial page load (deep linking)
   */
  private handleInitialHash(): void {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          this.navigateToSection(hash);
        },
        { once: true }
      );
    } else {
      // DOM already ready
      this.navigateToSection(hash);
    }
  }

  /**
   * Reset history (useful on page navigation)
   */
  public reset(): void {
    window.history.replaceState(null, '', window.location.pathname);
  }
}
```

---

## 3. Navigation Link Handler

**File**: `src/scripts/navigation-links.ts` (NEW)

```typescript
/**
 * Navigation Link Handler
 * Handles clicks on navigation links with smooth scroll and focus management
 */

import { scrollToElement } from './scroll-animations';
import { focusFirstInteractive } from './accessibility';

export interface LinkClickOptions {
  scrollOffset?: number;     // Extra space above target (for sticky header)
  manageFocus?: boolean;     // Auto-focus target section
  announceChange?: boolean;  // Announce to screen readers
}

export class NavigationLinkHandler {
  private options: LinkClickOptions;

  constructor(options: LinkClickOptions = {}) {
    this.options = {
      scrollOffset: 80,
      manageFocus: true,
      announceChange: true,
      ...options,
    };

    this.setupLinkListeners();
  }

  private setupLinkListeners(): void {
    // Handle all link clicks
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const sectionId = href.substring(1);
      const targetElement = document.getElementById(sectionId);

      if (!targetElement) {
        console.warn(`[Navigation] Section not found: ${sectionId}`);
        return;
      }

      // Prevent default link behavior
      e.preventDefault();

      // Smooth scroll to section
      this.navigateToSection(targetElement);
    });
  }

  private async navigateToSection(element: HTMLElement): Promise<void> {
    // Perform smooth scroll
    scrollToElement(element, {
      offset: this.options.scrollOffset,
    });

    // Wait a bit for scroll to start, then manage focus
    if (this.options.manageFocus) {
      setTimeout(() => {
        this.manageSectionFocus(element);
      }, 100);
    }

    // Announce to screen readers
    if (this.options.announceChange) {
      const sectionName = element.getAttribute('data-section') ||
        element.id || 'section';
      announceToScreenReader(`Navigated to ${sectionName}`);
    }
  }

  private manageSectionFocus(element: HTMLElement): void {
    // Try to focus interactive element inside section
    const focusableChild = element.querySelector(
      'a[href], button:not([disabled]), textarea:not([disabled]), ' +
        'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (focusableChild) {
      focusableChild.focus();
    } else {
      // Make section itself focusable
      element.setAttribute('tabindex', '-1');
      element.focus();
      // Remove tabindex after focus
      setTimeout(() => {
        element.removeAttribute('tabindex');
      }, 0);
    }
  }
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
```

---

## 4. Update Section Components

**File**: `src/components/sections/Hero.astro` (UPDATE)

```astro
---
interface Props {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

const { headline, subheadline, ctaText, ctaLink } = Astro.props;
---

<section id="hero" data-section="hero" class="hero">
  <div class="hero__content">
    <h1>{headline}</h1>
    <p>{subheadline}</p>
    <a href={ctaLink} class="hero__cta">{ctaText}</a>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .hero__content {
    max-width: 800px;
    padding: 2rem;
  }

  .hero__cta {
    display: inline-block;
    padding: 1rem 2rem;
    margin-top: 2rem;
    background: var(--color-primary);
    color: var(--color-background);
    text-decoration: none;
    border-radius: 0.5rem;
    transition: transform var(--transition-color);
  }

  .hero__cta:hover {
    transform: translateY(-2px);
  }
</style>
```

**Update all section components with**:
- `id="about"`, `id="projects"`, etc. (must match navigation link `data-nav-link` value)
- `data-section="about"`, `data-section="projects"`, etc.

---

## 5. Update Header Component

**File**: `src/components/layout/Header.astro` (UPDATE)

```astro
---
import { navigationLinks } from "../../data/navigation";

const sortedLinks = [...navigationLinks].sort(
  (a, b) => a.displayOrder - b.displayOrder
);
---

<header class="header">
  <div class="header__container">
    <a href="#hero" class="header__logo">
      <span class="header__logo-text">Portfolio</span>
    </a>

    <nav class="header__nav" aria-label="Main navigation">
      <ul class="header__nav-list">
        {
          sortedLinks.map((link) => (
            <li class="header__nav-item">
              <a
                href={`#${link.id}`}
                class="header__nav-link"
                data-nav-link={link.id}
                aria-label={link.ariaLabel || link.text}
              >
                {link.text}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  </div>
</header>

<script>
  import { ActiveNavigationManager } from "../../scripts/active-navigation";
  import { NavigationHistoryManager } from "../../scripts/navigation-history";
  import { NavigationLinkHandler } from "../../scripts/navigation-links";

  // Initialize all navigation systems
  const activeNav = new ActiveNavigationManager({
    updateURL: true,
    debounceMS: 100,
  });

  const history = new NavigationHistoryManager();
  const linkHandler = new NavigationLinkHandler({
    scrollOffset: 80,
    manageFocus: true,
  });

  // Cleanup on page navigation
  document.addEventListener("astro:before-swap", () => {
    activeNav.destroy();
    history.reset();
  });
</script>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .header__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__logo {
    text-decoration: none;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1.5rem;
    transition: color var(--transition-color);
  }

  .header__logo:hover {
    color: var(--color-primary);
  }

  .header__nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .header__nav-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-color);
    position: relative;
    cursor: pointer;
  }

  .header__nav-link:hover {
    color: var(--color-primary);
  }

  .header__nav-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: 0.25rem;
  }

  /* Active state (aria-current="page") */
  .header__nav-link[aria-current="page"] {
    color: var(--color-primary);
  }

  .header__nav-link[aria-current="page"]::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .header__container {
      padding: 1rem;
    }

    .header__nav-list {
      gap: 1rem;
    }
  }
</style>
```

---

## 6. Update BurgerMenu Component

**File**: `src/components/layout/BurgerMenu.astro` (UPDATE)

```astro
---
import { navigationLinks } from "../../data/navigation";

const sortedLinks = [...navigationLinks].sort(
  (a, b) => a.displayOrder - b.displayOrder
);
---

<div class="burger-wrapper">
  <button
    class="burger-menu"
    aria-label="Toggle menu"
    aria-expanded="false"
    aria-controls="nav-menu"
  >
    <span class="burger-line"></span>
    <span class="burger-line"></span>
    <span class="burger-line"></span>
  </button>

  <nav class="nav-menu" id="nav-menu" hidden>
    <ul class="nav-menu__list">
      {
        sortedLinks.map((link) => (
          <li class="nav-menu__item">
            <a
              href={`#${link.id}`}
              class="nav-menu__link"
              data-nav-link={link.id}
              aria-label={link.ariaLabel || link.text}
            >
              {link.text}
            </a>
          </li>
        ))
      }
    </ul>
  </nav>
</div>

<script>
  import { gsap } from "gsap";
  import { initMagneticMenu } from "../../scripts/magnetic-menu";
  import { trapFocus } from "../../scripts/accessibility";
  import { NavigationHistoryManager } from "../../scripts/navigation-history";
  import { NavigationLinkHandler } from "../../scripts/navigation-links";

  const button = document.querySelector(".burger-menu") as HTMLElement;
  const menu = document.querySelector(".nav-menu") as HTMLElement;
  let cleanupMagnetic: (() => void) | null = null;
  let cleanupFocusTrap: (() => void) | null = null;

  // Initialize navigation systems for burger menu
  const history = new NavigationHistoryManager();
  const linkHandler = new NavigationLinkHandler({
    scrollOffset: 80,
    manageFocus: true,
  });

  if (button && menu) {
    cleanupMagnetic = initMagneticMenu(button, {
      threshold: 100,
      strength: 0.4,
    });

    const toggleMenu = (open: boolean) => {
      button.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;

      if (open) {
        cleanupFocusTrap = trapFocus(menu);

        gsap.fromTo(
          menu,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );

        const links = menu.querySelectorAll(".nav-menu__link");
        gsap.fromTo(
          links,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.1,
          }
        );

        const firstLink = links[0] as HTMLElement;
        firstLink?.focus();

        document.body.style.overflow = "hidden";
      } else {
        if (cleanupFocusTrap) {
          cleanupFocusTrap();
          cleanupFocusTrap = null;
        }

        gsap.to(menu, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            menu.hidden = true;
          },
        });

        document.body.style.overflow = "";
        button.focus();
      }
    };

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      toggleMenu(!isExpanded);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        toggleMenu(false);
      }
    });

    const links = menu.querySelectorAll(".nav-menu__link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu(false);
      });
    });

    document.addEventListener("astro:before-swap", () => {
      if (cleanupMagnetic) cleanupMagnetic();
      if (cleanupFocusTrap) cleanupFocusTrap();
      history.reset();
    });
  }
</script>

<style>
  /* [Keep existing styles from BurgerMenu.astro] */
  .burger-wrapper {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
  }

  .burger-menu {
    width: 48px;
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    background: var(--color-surface, rgba(30, 30, 46, 0.9));
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
    border-radius: 8px;
    cursor: pointer;
    padding: 12px;
    transition:
      background-color var(--transition-color),
      border-color var(--transition-color);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  @media (hover: hover) {
    .burger-menu:hover {
      background: var(--color-surface-raised, rgba(30, 30, 46, 1));
      border-color: var(--color-primary, #cba6f7);
    }
  }

  .burger-menu:focus-visible {
    outline: 2px solid var(--color-primary, #cba6f7);
    outline-offset: 4px;
  }

  /* [Keep remaining styles] */
</style>
```

---

## 7. Update Navigation Data

**File**: `src/data/navigation.ts` (UPDATE - ensure IDs match sections)

```typescript
export const navigationLinks: NavigationLink[] = [
  {
    id: "hero",        // ← Must match section id and data-section
    text: "Home",
    path: "/",
    displayOrder: 1,
  },
  {
    id: "about",       // ← Must match section id and data-section
    text: "About",
    path: "/about",
    displayOrder: 2,
  },
  {
    id: "projects",    // ← Must match section id and data-section
    text: "Projects",
    path: "/projects",
    displayOrder: 3,
  },
  // ... etc
];
```

---

## 8. Add CSS for Screen Reader Only Announcements

**File**: `src/styles/global.css` (ADD to existing file)

```css
/**
 * Screen reader only content
 * Visually hidden but announced by screen readers
 */
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

---

## Complete Integration Example

**File**: `src/pages/index.astro` (REFERENCE - shows all pieces working together)

```astro
---
import PageLayout from "../layouts/PageLayout.astro";
import Hero from "../components/sections/Hero.astro";
import AboutIDE from "../components/sections/AboutIDE.astro";
import ProjectsHexGrid from "../components/sections/ProjectsHexGrid.astro";

const metadata = pageMetadata.home;
---

<PageLayout title={metadata.title} description={metadata.description}>
  <!-- Each section needs id and data-section -->
  <Hero
    id="hero"
    data-section="hero"
    headline="Full Stack Developer"
    subheadline="Building amazing web experiences"
    ctaText="Explore"
    ctaLink="#projects"
  />

  <AboutIDE
    id="about"
    data-section="about"
    title="About Me"
    content="..."
  />

  <ProjectsHexGrid
    id="projects"
    data-section="projects"
    title="Projects"
  />
</PageLayout>

<script>
  import { initGSAP } from "../scripts/gsap-config";
  import { initSmoothScroll } from "../scripts/scroll-animations";
  import { initKeyboardNavDetection } from "../scripts/accessibility";

  // Initialize all systems in order
  initGSAP();
  initSmoothScroll();
  initKeyboardNavDetection();

  // Note: Header.astro initializes ActiveNavigationManager,
  // NavigationHistoryManager, and NavigationLinkHandler
</script>
```

---

## Testing Your Implementation

### Automated Testing

```typescript
// tests/integration/navigation.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Active Navigation', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <nav>
        <a href="#hero" data-nav-link="hero">Home</a>
        <a href="#about" data-nav-link="about">About</a>
      </nav>
      <section id="hero" data-section="hero">Hero</section>
      <section id="about" data-section="about">About</section>
    `;
  });

  it('should update active link when section becomes visible', () => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) {
        const id = visible.target.id;
        document.querySelector(`[data-nav-link="${id}"]`)
          ?.setAttribute('aria-current', 'page');
      }
    });

    document.querySelectorAll('[data-section]').forEach(s => observer.observe(s));

    // Simulate intersection
    // (Note: actual Intersection Observer requires browser context)
    // This is pseudo-code for testing approach
  });

  it('should update URL hash when section changes', () => {
    // Test history.replaceState called with correct hash
  });

  it('should handle browser back button', () => {
    // Test popstate event handling
  });
});
```

### Manual Testing Checklist

- [ ] **Click navigation link** → Smooth scroll to section, URL updates
- [ ] **Tab to link** → Enter key activates link, scroll happens
- [ ] **Scroll manually** → URL updates silently, link becomes active
- [ ] **Browser back button** → Return to previous section
- [ ] **Browser forward button** → Go to next section
- [ ] **Bookmark `/#about`** → Reopen in new tab, scrolls to about
- [ ] **Share `example.com/#projects`** → Recipient lands on projects
- [ ] **Keyboard only** → Tab through all links, no mouse needed
- [ ] **Screen reader** (NVDA) → Active link announced, scroll announced
- [ ] **Reduced motion** → No scroll animation, instant jump

---

## Bundle Size Check

After implementation, verify bundle size:

```bash
# Check total JS bundle size
bun build
# Should see: Bundled sizes:
#   total: 45KB

# Individual module sizes (with esbuild analyzer)
npm run build -- --analyze
```

**Expected sizes**:
- active-navigation.ts: ~2.5KB
- navigation-history.ts: ~2KB
- navigation-links.ts: ~1.5KB
- **Total new code**: ~6KB
- **Final bundle**: Should remain under 60KB for animation code ✅

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Links don't scroll | Event listener not attached | Check `data-nav-link` attributes present |
| URL not updating | updateURL option set to false | Check `new ActiveNavigationManager({updateURL: true})` |
| Back button broken | Using pushState for every scroll | Use replaceState in Intersection Observer, pushState only on clicks |
| Focus not moving | manageFocus option disabled | Set `manageFocus: true` in NavigationLinkHandler |
| Sticky header hiding content | No scroll offset | Set scrollOffset to header height (e.g., 80px) |
| Screen reader not announcing | No sr-only region | Ensure announceToScreenReader function called |

---

## References

**Full Documentation**:
- Main research: `/active-navigation-research.md`
- Quick reference: `/ACTIVE_NAVIGATION_SUMMARY.md`
- Implementation: `/ACTIVE_NAVIGATION_EXAMPLES.md` (this file)

**Browser APIs**:
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

**Related Portfolio Code**:
- Smooth scroll: `src/scripts/scroll-animations.ts`
- Accessibility utils: `src/scripts/accessibility.ts`
- Navigation data: `src/data/navigation.ts`
