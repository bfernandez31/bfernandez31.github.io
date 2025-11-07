/**
 * Navigation Type Definitions
 *
 * Based on contracts/navigation.contract.ts
 * @feature 005-1510-convert-multi
 */

import type { SectionId } from "./section";

export interface NavigationLink {
	/**
	 * Anchor link to section (e.g., "#about")
	 */
	href: `#${SectionId}`;

	/**
	 * ID of the target section
	 */
	targetSectionId: SectionId;

	/**
	 * Display text for the link
	 */
	label: string;

	/**
	 * Accessible label for screen readers
	 */
	ariaLabel: string;

	/**
	 * ARIA current attribute
	 */
	ariaCurrent: "page" | null;

	/**
	 * Whether this link is currently active
	 */
	isActive: boolean;

	/**
	 * Display order in navigation
	 */
	order: number;
}

/**
 * Navigation configuration constants
 */
export const navigationConfig = {
	/**
	 * IntersectionObserver threshold
	 * 0.3 = 30% of section visible
	 */
	observerThreshold: 0.3,

	/**
	 * Root margin for observer
	 */
	observerRootMargin: "0px",

	/**
	 * Debounce delay for URL updates (ms)
	 */
	urlUpdateDebounceMs: 100,

	/**
	 * Focus delay after scroll (ms)
	 */
	focusDelayMs: 800,

	/**
	 * Screen reader announcement duration (ms)
	 */
	announcementDurationMs: 1000,
} as const;

/**
 * CSS classes for navigation components
 */
export const navigationCSSClasses = {
	base: "portfolio-nav",
	link: {
		base: "portfolio-nav__link",
		active: "portfolio-nav__link--active",
		hover: "portfolio-nav__link--hover",
		focus: "portfolio-nav__link--focus",
	},
	menu: {
		base: "portfolio-nav__menu",
		open: "portfolio-nav__menu--open",
		closed: "portfolio-nav__menu--closed",
	},
	burger: {
		base: "portfolio-nav__burger",
		open: "portfolio-nav__burger--open",
		closed: "portfolio-nav__burger--closed",
	},
} as const;

/**
 * Validation function for NavigationLink
 */
export function validateNavigationLink(link: NavigationLink): void {
	if (!link.href.startsWith("#")) {
		throw new Error(
			`NavigationLink href must start with '#'. Got: ${link.href}`,
		);
	}

	const expectedHref = `#${link.targetSectionId}`;
	if (link.href !== expectedHref) {
		throw new Error(
			`NavigationLink href must match targetSectionId. Expected: ${expectedHref}, Got: ${link.href}`,
		);
	}

	if (!link.label || link.label.trim().length === 0) {
		throw new Error("NavigationLink label is required and must be non-empty");
	}

	if (!link.ariaLabel || link.ariaLabel.trim().length === 0) {
		throw new Error(
			"NavigationLink ariaLabel is required and must be non-empty",
		);
	}

	if (link.ariaCurrent !== null && link.ariaCurrent !== "page") {
		throw new Error(
			`NavigationLink ariaCurrent must be 'page' or null. Got: ${link.ariaCurrent}`,
		);
	}

	if (typeof link.isActive !== "boolean") {
		throw new Error(
			`NavigationLink isActive must be boolean. Got: ${typeof link.isActive}`,
		);
	}

	if (typeof link.order !== "number" || link.order < 1) {
		throw new Error(
			`NavigationLink order must be a positive number. Got: ${link.order}`,
		);
	}
}
