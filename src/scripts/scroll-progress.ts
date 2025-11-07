/**
 * Scroll Progress Tracking
 * Feature: 008-title-scroll-progress
 *
 * Tracks page scroll position and updates progress bar width.
 * Integrates with Lenis smooth scroll for synchronized updates.
 */

let progressBar: HTMLElement | null = null;
let rafId: number | null = null;

/**
 * Calculate scroll progress as percentage (0-100)
 * Accounts for total scrollable height
 */
function calculateScrollProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;
	const scrollableHeight = scrollHeight - clientHeight;

	if (scrollableHeight <= 0) {
		return 0; // No scrollable content
	}

	const progress = (scrollTop / scrollableHeight) * 100;
	return Math.min(100, Math.max(0, progress)); // Clamp between 0-100
}

/**
 * Update progress bar width and ARIA attributes
 */
function updateProgressBar(): void {
	if (!progressBar) return;

	const progress = calculateScrollProgress();

	// Update width using transform for better performance (GPU-accelerated)
	// But use width for better visual clarity per spec requirements
	progressBar.style.width = `${progress}%`;

	// Update ARIA attribute for accessibility
	const container = progressBar.parentElement;
	if (container) {
		container.setAttribute("aria-valuenow", Math.round(progress).toString());
	}
}

/**
 * Scroll event handler with requestAnimationFrame throttling
 */
function handleScroll(): void {
	if (rafId !== null) return; // Already scheduled

	rafId = requestAnimationFrame(() => {
		updateProgressBar();
		rafId = null;
	});
}

/**
 * Initialize scroll progress tracking
 * Call this once when the ScrollProgress component mounts
 */
export function initScrollProgress(): void {
	// Find progress bar element
	const container = document.getElementById("scroll-progress");
	progressBar = container?.querySelector(".scroll-progress__bar") || null;

	if (!progressBar) {
		console.warn("[ScrollProgress] Progress bar element not found");
		return;
	}

	// Set initial state
	updateProgressBar();

	// Use Lenis scroll event if available for smoother updates
	if (window.lenis) {
		window.lenis.on("scroll", updateProgressBar);
		console.log("[ScrollProgress] Initialized with Lenis integration");
	} else {
		// Fallback to native scroll event
		window.addEventListener("scroll", handleScroll, { passive: true });
		console.log("[ScrollProgress] Initialized with native scroll listener");
	}

	// Handle window resize (changes scrollable height)
	window.addEventListener("resize", handleScroll, { passive: true });
}

/**
 * Lazy-loaded initialization (T039)
 * Triggers on first scroll event to reduce initial bundle size
 */
export function initScrollProgressLazy(): void {
	let hasInitialized = false;

	const onScroll = () => {
		if (!hasInitialized) {
			hasInitialized = true;
			initScrollProgress();
		}
	};

	// Initialize on first scroll
	window.addEventListener("scroll", onScroll, { once: true, passive: true });

	console.log(
		"[ScrollProgress] Lazy initialization registered (will load on first scroll)",
	);
}

/**
 * Destroy scroll progress tracking
 * Cleanup listeners and cancel pending animations
 */
export function destroyScrollProgress(): void {
	if (rafId !== null) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}

	if (window.lenis) {
		// Lenis cleanup handled by Lenis destroy
	} else {
		window.removeEventListener("scroll", handleScroll);
	}

	window.removeEventListener("resize", handleScroll);
	progressBar = null;

	console.log("[ScrollProgress] Destroyed");
}
