/**
 * Navigation Link Handler
 *
 * Handles navigation link clicks with smooth scroll and focus management.
 * Integrates with Lenis smooth scroll library.
 *
 * @feature 005-1510-convert-multi
 */

import type Lenis from "@studio-freight/lenis";
import { navigationConfig } from "../types/navigation";

// Extend Window interface for Lenis
declare global {
	interface Window {
		lenis?: Lenis;
	}
}

/**
 * Initialize navigation link click handlers
 * Sets up smooth scroll behavior and focus management
 */
export function initNavigationLinks(): void {
	const lenis = window.lenis;
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	// Handle all link clicks with hash anchors
	document.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		const link = target.closest<HTMLAnchorElement>(
			'a[href^="#"], a[href^="/#"]',
		);

		if (!link) return;

		e.preventDefault();
		const href = link.getAttribute("href");
		if (!href) return;

		// Extract section ID from href (remove leading / if present)
		const hash = href.replace(/^\//, "");
		const targetId = hash.slice(1); // Remove #
		const targetElement = document.getElementById(targetId);

		if (!targetElement) {
			console.warn(`NavigationLinks: Target element not found: ${targetId}`);
			return;
		}

		// Smooth scroll with Lenis (if available and motion not reduced)
		if (lenis && !prefersReducedMotion) {
			lenis.scrollTo(hash);
		} else {
			// Fallback to native smooth scroll
			targetElement.scrollIntoView({
				behavior: prefersReducedMotion ? "auto" : "smooth",
				block: "start",
			});
		}

		// Update URL with history entry (user-initiated)
		window.history.pushState(null, "", hash);

		// Focus management - announce to screen readers and manage focus
		setTimeout(() => {
			// Set focus on the section
			targetElement.focus();
			targetElement.setAttribute("tabindex", "-1");

			// Announce to screen readers
			announceNavigation(targetId, link.textContent || targetId);
		}, navigationConfig.focusDelayMs);
	});
}

/**
 * Announce navigation to screen readers
 * Creates a temporary live region announcement
 */
function announceNavigation(_sectionId: string, sectionLabel: string): void {
	const announcement = document.createElement("div");
	announcement.setAttribute("role", "status");
	announcement.setAttribute("aria-live", "polite");
	announcement.setAttribute("aria-atomic", "true");
	announcement.style.position = "absolute";
	announcement.style.left = "-10000px";
	announcement.style.width = "1px";
	announcement.style.height = "1px";
	announcement.style.overflow = "hidden";
	announcement.textContent = `Navigated to ${sectionLabel} section`;

	document.body.appendChild(announcement);

	// Remove announcement after it's been read
	setTimeout(() => {
		announcement.remove();
	}, navigationConfig.announcementDurationMs);
}
