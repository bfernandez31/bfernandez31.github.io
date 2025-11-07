/**
 * Navigation Dots Manager
 *
 * Synchronizes navigation dot active states with the active section.
 * Integrates with the existing active-navigation system.
 *
 * @feature 007-title-vertical-navigation
 */

/**
 * Initialize navigation dots functionality
 * - Synchronizes active state with section visibility
 * - Handles smooth scroll on dot click
 */
export function initNavigationDots(): void {
	const navDots = document.querySelector<HTMLElement>("[data-navigation-dots]");

	if (!navDots) {
		// Navigation dots not present on this page (e.g., blog pages)
		return;
	}

	const dotLinks = navDots.querySelectorAll<HTMLAnchorElement>(
		".navigation-dots__link",
	);

	if (dotLinks.length === 0) {
		console.warn("NavigationDots: No dot links found");
		return;
	}

	// Listen to active navigation changes from the main navigation system
	// The active-navigation.ts script already manages active states via IntersectionObserver
	// We just need to sync the dot states with the main nav states

	// Create a MutationObserver to watch for active class changes on main nav links
	const syncActiveDots = () => {
		// Find the currently active main navigation link
		const activeNavLink = document.querySelector<HTMLAnchorElement>(
			'a[href^="#"][aria-current="page"]',
		);

		if (!activeNavLink) {
			return;
		}

		// Extract section ID from the active link
		const href = activeNavLink.getAttribute("href");
		const sectionId = href?.replace(/^\/#?/, "");

		if (!sectionId) {
			return;
		}

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

	// Initial sync
	syncActiveDots();

	// Watch for changes in the document (when active-navigation updates nav links)
	const observer = new MutationObserver(() => {
		syncActiveDots();
	});

	// Observe the document body for attribute changes (aria-current on nav links)
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ["aria-current", "class"],
		subtree: true,
	});

	// Handle dot clicks for smooth scrolling
	dotLinks.forEach((dotLink) => {
		dotLink.addEventListener("click", (e) => {
			e.preventDefault();

			const href = dotLink.getAttribute("href");
			if (!href) return;

			const targetId = href.replace(/^\/#?/, "");
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

	// Cleanup on page navigation
	document.addEventListener("astro:before-swap", () => {
		observer.disconnect();
	});
}
