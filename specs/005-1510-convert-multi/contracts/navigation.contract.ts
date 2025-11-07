/**
 * Navigation Contract
 *
 * Defines the interface for navigation components (Header, BurgerMenu)
 * and navigation link behavior in the single-page portfolio.
 *
 * @feature 005-1510-convert-multi
 * @version 1.0.0
 */

import type { SectionId } from './section-component.contract';

/**
 * Navigation Link interface
 * Represents a single link in the navigation menu
 */
export interface NavigationLink {
  /**
   * Anchor link to section (e.g., "#about")
   * Must start with '#' and reference a valid section ID
   */
  href: `#${SectionId}`;

  /**
   * ID of the target section
   * Must match an existing section ID
   */
  targetSectionId: SectionId;

  /**
   * Display text for the link
   */
  label: string;

  /**
   * Accessible label for screen readers
   * Should be descriptive (e.g., "Navigate to About section")
   */
  ariaLabel: string;

  /**
   * ARIA current attribute
   * Set to 'page' when this link's target section is active
   * Set to null when inactive
   */
  ariaCurrent: 'page' | null;

  /**
   * Whether this link is currently active
   * Managed by IntersectionObserver
   */
  isActive: boolean;

  /**
   * Display order in navigation
   * Used for keyboard navigation and visual ordering
   */
  order: number;
}

/**
 * Navigation Menu interface
 * Implemented by Header and BurgerMenu components
 */
export interface NavigationMenu {
  /**
   * Array of navigation links
   * Must have exactly 5 links (one per section)
   */
  links: NavigationLink[];

  /**
   * Whether the menu is currently open/visible
   * Relevant for BurgerMenu component
   */
  isOpen?: boolean;

  /**
   * Callback when a link is clicked
   * Handles smooth scroll and focus management
   */
  onLinkClick: (href: string) => void;

  /**
   * Callback when active link changes
   * Updates aria-current and active class
   */
  onActiveLinkChange: (targetSectionId: SectionId) => void;
}

/**
 * Navigation Manager Contract
 * Handles active navigation state management
 */
export interface NavigationManagerContract {
  /**
   * Initialize the navigation manager
   * Sets up IntersectionObserver and event listeners
   */
  init(): void;

  /**
   * Update active navigation link based on visible section
   * Called by IntersectionObserver callback
   */
  updateActiveLink(sectionId: SectionId): void;

  /**
   * Handle navigation link click
   * Triggers smooth scroll and updates URL
   */
  handleLinkClick(event: MouseEvent | KeyboardEvent, href: string): void;

  /**
   * Cleanup resources on unmount
   * Removes event listeners and disconnects IntersectionObserver
   */
  destroy(): void;

  /**
   * Get currently active section ID
   */
  getCurrentSection(): SectionId | null;
}

/**
 * Smooth Scroll Handler Contract
 * Manages smooth scroll behavior with Lenis
 */
export interface SmoothScrollHandlerContract {
  /**
   * Scroll to a target section
   * Uses Lenis for smooth animation if enabled
   */
  scrollToSection(targetId: SectionId): void;

  /**
   * Update scroll behavior based on user preferences
   * Disables smooth scroll if prefers-reduced-motion
   */
  updateMotionPreference(): void;

  /**
   * Check if smooth scroll is enabled
   */
  isSmoothScrollEnabled(): boolean;

  /**
   * Stop current scroll animation
   */
  stopScroll(): void;
}

/**
 * Focus Management Contract
 * Handles keyboard focus after scroll completion
 */
export interface FocusManagementContract {
  /**
   * Move focus to target section
   * Called after scroll animation completes
   */
  focusSection(sectionId: SectionId): void;

  /**
   * Get first focusable element in section
   * Used for keyboard navigation
   */
  getFirstFocusableElement(sectionId: SectionId): HTMLElement | null;

  /**
   * Announce section change to screen readers
   * Uses ARIA live region
   */
  announceNavigation(sectionId: SectionId, sectionLabel: string): void;
}

/**
 * Validation function for NavigationLink
 */
export function validateNavigationLink(link: NavigationLink): void {
  if (!link.href.startsWith('#')) {
    throw new Error(`NavigationLink href must start with '#'. Got: ${link.href}`);
  }

  const expectedHref = `#${link.targetSectionId}`;
  if (link.href !== expectedHref) {
    throw new Error(`NavigationLink href must match targetSectionId. Expected: ${expectedHref}, Got: ${link.href}`);
  }

  if (!link.label || link.label.trim().length === 0) {
    throw new Error('NavigationLink label is required and must be non-empty');
  }

  if (!link.ariaLabel || link.ariaLabel.trim().length === 0) {
    throw new Error('NavigationLink ariaLabel is required and must be non-empty');
  }

  if (link.ariaCurrent !== null && link.ariaCurrent !== 'page') {
    throw new Error(`NavigationLink ariaCurrent must be 'page' or null. Got: ${link.ariaCurrent}`);
  }

  if (typeof link.isActive !== 'boolean') {
    throw new Error(`NavigationLink isActive must be boolean. Got: ${typeof link.isActive}`);
  }

  if (typeof link.order !== 'number' || link.order < 1) {
    throw new Error(`NavigationLink order must be a positive number. Got: ${link.order}`);
  }
}

/**
 * Validation function for NavigationMenu
 */
export function validateNavigationMenu(menu: NavigationMenu): void {
  if (!Array.isArray(menu.links)) {
    throw new Error('NavigationMenu links must be an array');
  }

  if (menu.links.length !== 5) {
    throw new Error(`NavigationMenu must have exactly 5 links (one per section). Got: ${menu.links.length}`);
  }

  // Validate each link
  menu.links.forEach((link, index) => {
    try {
      validateNavigationLink(link);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`NavigationMenu link at index ${index} is invalid: ${message}`);
    }
  });

  // Check for duplicate hrefs
  const hrefs = menu.links.map(link => link.href);
  const uniqueHrefs = new Set(hrefs);
  if (uniqueHrefs.size !== hrefs.length) {
    throw new Error('NavigationMenu links must have unique hrefs');
  }

  // Check for duplicate orders
  const orders = menu.links.map(link => link.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    throw new Error('NavigationMenu links must have unique order values');
  }

  // Only one link can have ariaCurrent="page"
  const activeCount = menu.links.filter(link => link.ariaCurrent === 'page').length;
  if (activeCount > 1) {
    throw new Error('NavigationMenu can have only one active link (ariaCurrent="page")');
  }

  // Validate callbacks
  if (typeof menu.onLinkClick !== 'function') {
    throw new Error('NavigationMenu onLinkClick must be a function');
  }

  if (typeof menu.onActiveLinkChange !== 'function') {
    throw new Error('NavigationMenu onActiveLinkChange must be a function');
  }
}

/**
 * CSS classes contract for navigation components
 */
export const navigationCSSContract = {
  /**
   * Base navigation class
   */
  base: 'portfolio-nav',

  /**
   * Navigation link classes
   */
  link: {
    base: 'portfolio-nav__link',
    active: 'portfolio-nav__link--active',
    hover: 'portfolio-nav__link--hover',
    focus: 'portfolio-nav__link--focus',
  },

  /**
   * Navigation menu classes
   */
  menu: {
    base: 'portfolio-nav__menu',
    open: 'portfolio-nav__menu--open',
    closed: 'portfolio-nav__menu--closed',
  },

  /**
   * Burger menu specific classes
   */
  burger: {
    base: 'portfolio-nav__burger',
    open: 'portfolio-nav__burger--open',
    closed: 'portfolio-nav__burger--closed',
  },
} as const;

/**
 * IntersectionObserver configuration for active navigation
 */
export const navigationObserverConfig = {
  /**
   * Threshold at which section becomes active
   * 0.3 = 30% of section visible
   */
  threshold: 0.3,

  /**
   * Root margin (optional)
   * Can be used to offset for sticky headers
   */
  rootMargin: '0px',
} as const;

/**
 * Debounce configuration for URL updates
 */
export const urlUpdateConfig = {
  /**
   * Delay in milliseconds before updating URL
   * Prevents excessive history entries during rapid scrolling
   */
  debounceMs: 100,
} as const;

/**
 * Focus management configuration
 */
export const focusManagementConfig = {
  /**
   * Delay in milliseconds before focusing section
   * Should match or exceed scroll animation duration
   */
  focusDelayMs: 800,

  /**
   * CSS selector for focusable elements
   */
  focusableSelector: 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',

  /**
   * Duration for screen reader announcement
   * Announcement removed after this delay
   */
  announcementDurationMs: 1000,
} as const;

/**
 * Type exports for TypeScript consumers
 */
export type NavigationLinkHref = NavigationLink['href'];
export type NavigationLinkAriaCurrent = NavigationLink['ariaCurrent'];
