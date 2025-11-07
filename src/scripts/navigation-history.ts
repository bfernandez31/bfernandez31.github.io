/**
 * Navigation History Manager
 *
 * Handles initial page load with hash and browser back/forward navigation.
 * Ensures deep linking and history navigation work correctly.
 *
 * @feature 005-1510-convert-multi
 */

// Extend Window interface for Lenis
declare global {
	interface Window {
		lenis?: {
			scrollTo: (target: string | HTMLElement) => void;
		};
	}
}

/**
 * Initialize navigation history management
 * Handles initial hash on page load and browser back/forward buttons
 */
export function initNavigationHistory(): void {
	const lenis = window.lenis;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Handle initial page load with hash
	handleInitialHash();

	// Handle browser back/forward buttons
	window.addEventListener('popstate', handlePopState);

	// Cleanup on page navigation (Astro specific)
	document.addEventListener('astro:before-swap', () => {
		window.removeEventListener('popstate', handlePopState);
	});

	/**
	 * Handle initial hash on page load
	 * Scrolls to the target section if hash is present in URL
	 */
	function handleInitialHash(): void {
		const hash = window.location.hash.slice(1); // Remove #
		if (!hash) return;

		const target = document.getElementById(hash);
		if (!target) {
			console.warn(`NavigationHistory: Target element not found: ${hash}`);
			return;
		}

		// Wait for DOM to be fully ready
		setTimeout(() => {
			// Smooth scroll with Lenis
			if (lenis && !prefersReducedMotion) {
				lenis.scrollTo(`#${hash}`);
			} else {
				target.scrollIntoView({
					behavior: prefersReducedMotion ? 'auto' : 'smooth',
					block: 'start',
				});
			}

			// Set focus on the target section
			target.focus();
			target.setAttribute('tabindex', '-1');
		}, 100); // Small delay to ensure Lenis is initialized
	}

	/**
	 * Handle browser back/forward navigation
	 * Scrolls to the target section when user navigates history
	 */
	function handlePopState(): void {
		const hash = window.location.hash.slice(1); // Remove #
		if (!hash) {
			// If no hash, scroll to top
			if (lenis && !prefersReducedMotion) {
				lenis.scrollTo('#hero');
			} else {
				window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
			}
			return;
		}

		const target = document.getElementById(hash);
		if (!target) {
			console.warn(`NavigationHistory: Target element not found: ${hash}`);
			return;
		}

		// Smooth scroll to target
		if (lenis && !prefersReducedMotion) {
			lenis.scrollTo(`#${hash}`);
		} else {
			target.scrollIntoView({
				behavior: prefersReducedMotion ? 'auto' : 'smooth',
				block: 'start',
			});
		}

		// Set focus on the target section
		target.focus();
		target.setAttribute('tabindex', '-1');
	}
}
