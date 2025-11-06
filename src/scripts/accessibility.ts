/**
 * Accessibility Utilities
 * Feature: 003-1507-architecture-globale
 *
 * Helpers for accessibility features including motion preferences,
 * keyboard navigation, and focus management.
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Listen for changes to motion preference
 */
export function onMotionPreferenceChange(
	callback: (prefersReduced: boolean) => void,
): () => void {
	if (typeof window === "undefined") return () => {};

	const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

	const handler = (e: MediaQueryListEvent) => {
		callback(e.matches);
	};

	mediaQuery.addEventListener("change", handler);

	// Return cleanup function
	return () => {
		mediaQuery.removeEventListener("change", handler);
	};
}

/**
 * Trap focus within an element (useful for modals, dropdowns)
 */
export function trapFocus(element: HTMLElement): () => void {
	const focusableElements = element.querySelectorAll(
		'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
	);

	const firstFocusable = focusableElements[0] as HTMLElement;
	const lastFocusable = focusableElements[
		focusableElements.length - 1
	] as HTMLElement;

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key !== "Tab") return;

		if (e.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstFocusable) {
				e.preventDefault();
				lastFocusable.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastFocusable) {
				e.preventDefault();
				firstFocusable.focus();
			}
		}
	};

	element.addEventListener("keydown", handleKeyDown);

	// Return cleanup function
	return () => {
		element.removeEventListener("keydown", handleKeyDown);
	};
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(
	container: HTMLElement,
): NodeListOf<HTMLElement> {
	return container.querySelectorAll(
		'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
	);
}

/**
 * Move focus to first element in container
 */
export function focusFirst(container: HTMLElement): void {
	const focusable = getFocusableElements(container);
	if (focusable.length > 0) {
		focusable[0].focus();
	}
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
	if (typeof window === "undefined") return false;
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		((navigator as { msMaxTouchPoints?: number }).msMaxTouchPoints || 0) > 0
	);
}

/**
 * Check if keyboard navigation is being used
 * Tracks Tab key usage to add visual focus indicators
 */
export function initKeyboardNavDetection(): () => void {
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Tab") {
			document.body.classList.add("using-keyboard");
		}
	};

	const handleMouseDown = () => {
		document.body.classList.remove("using-keyboard");
	};

	document.addEventListener("keydown", handleKeyDown);
	document.addEventListener("mousedown", handleMouseDown);

	// Return cleanup function
	return () => {
		document.removeEventListener("keydown", handleKeyDown);
		document.removeEventListener("mousedown", handleMouseDown);
	};
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
	message: string,
	priority: "polite" | "assertive" = "polite",
): void {
	const announcement = document.createElement("div");
	announcement.setAttribute("role", "status");
	announcement.setAttribute("aria-live", priority);
	announcement.setAttribute("aria-atomic", "true");
	announcement.className = "sr-only";
	announcement.textContent = message;

	document.body.appendChild(announcement);

	// Remove after announcement is made
	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

/**
 * Check if element is visible in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

/**
 * Skip to main content (accessibility landmark)
 */
export function skipToMainContent(): void {
	const main =
		document.querySelector("main") || document.querySelector('[role="main"]');
	if (main instanceof HTMLElement) {
		main.setAttribute("tabindex", "-1");
		main.focus();
		main.removeAttribute("tabindex");
	}
}
