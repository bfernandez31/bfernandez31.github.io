/**
 * Active Navigation Manager
 *
 * Manages active navigation state using IntersectionObserver.
 * Updates navigation links to reflect the currently visible section.
 *
 * @feature 005-1510-convert-multi
 */

import { navigationConfig } from '../types/navigation';

/**
 * Initialize active navigation state management
 * Sets up IntersectionObserver to detect visible sections and update nav state
 */
export function initActiveNavigation(): void {
	const sections = document.querySelectorAll<HTMLElement>('[data-section]');
	const navLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

	if (sections.length === 0 || navLinks.length === 0) {
		console.warn('ActiveNavigation: No sections or nav links found');
		return;
	}

	// Track debounce timeout
	let updateDebounce: number | null = null;

	// Create IntersectionObserver
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const sectionId = entry.target.id;
					updateActiveNav(sectionId);
				}
			});
		},
		{
			threshold: navigationConfig.observerThreshold,
			rootMargin: navigationConfig.observerRootMargin,
		}
	);

	// Start observing all sections
	sections.forEach((section) => observer.observe(section));

	/**
	 * Update active navigation link
	 * @param sectionId - ID of the active section
	 */
	function updateActiveNav(sectionId: string): void {
		// Clear existing active states
		navLinks.forEach((link) => {
			link.removeAttribute('aria-current');
			link.classList.remove('active');
		});

		// Set new active state
		const activeLink = document.querySelector<HTMLAnchorElement>(
			`a[href="#${sectionId}"], a[href="/#${sectionId}"]`
		);
		if (activeLink) {
			activeLink.setAttribute('aria-current', 'page');
			activeLink.classList.add('active');
		}

		// Debounced URL update
		if (updateDebounce) clearTimeout(updateDebounce);
		updateDebounce = window.setTimeout(() => {
			window.history.replaceState(null, '', `#${sectionId}`);
		}, navigationConfig.urlUpdateDebounceMs);
	}

	// Cleanup on page navigation (Astro specific)
	document.addEventListener('astro:before-swap', () => {
		observer.disconnect();
		if (updateDebounce) clearTimeout(updateDebounce);
	});
}
