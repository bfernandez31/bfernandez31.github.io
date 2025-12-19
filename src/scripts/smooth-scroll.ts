/**
 * Smooth Scroll Initialization with Lenis
 * Feature: 006-title-lenis-smooth
 *
 * Provides buttery-smooth scrolling using Lenis library with snap functionality.
 * Integrates with GSAP ScrollTrigger for synchronized animations.
 */

import type Lenis from "@studio-freight/lenis";

// Extend Window interface for Lenis
declare global {
	interface Window {
		lenis?: Lenis;
	}
}

let lenis: Lenis | null = null;

/**
 * Initialize Lenis smooth scrolling with performance optimizations
 * Call this once when the application loads
 *
 * Performance optimizations (Phase 4 - T020-T026):
 * - Reduced duration from 1.2s to 0.6s for better responsiveness
 * - Changed easing to easeOutCubic (more responsive than easeInOutExpo)
 * - Removed section snap (interferes with free scrolling)
 * - Device tier detection (disabled on LOW tier devices)
 * - Scroll interruption handling (prevents queued animations)
 *
 * Progressive enhancement (T047):
 * - Error boundary for library load failures
 * - Falls back to native scroll if initialization fails
 */
export function initSmoothScroll(): Lenis | null {
	// Temporarily disabled for performance debugging
	console.log(
		"[SmoothScroll] Disabled - using native scroll for better performance",
	);
	return null;
}

/**
 * Destroy smooth scroll instance
 */
export function destroySmoothScroll(): void {
	if (lenis) {
		lenis.destroy();
		lenis = null;
		console.log("[SmoothScroll] Destroyed");
	}
}

/**
 * Get current Lenis instance
 */
export function getSmoothScroll(): Lenis | null {
	return lenis;
}

/**
 * Scroll to a specific element smoothly
 */
export function scrollToElement(
	target: HTMLElement | string,
	options: {
		offset?: number;
		duration?: number;
		easing?: (t: number) => number;
	} = {},
): void {
	if (!lenis) {
		console.warn(
			"[SmoothScroll] Not initialized - using native scroll behavior",
		);
		const element =
			typeof target === "string" ? document.querySelector(target) : target;
		element?.scrollIntoView({ behavior: "smooth" });
		return;
	}

	const { offset = 0, duration, easing } = options;

	lenis.scrollTo(target, {
		offset,
		duration,
		easing,
	});
}

/**
 * Scroll to top of page
 */
export function scrollToTop(duration = 1.5): void {
	if (!lenis) {
		window.scrollTo({ top: 0, behavior: "smooth" });
		return;
	}

	lenis.scrollTo(0, { duration });
}

/**
 * Stop smooth scroll (e.g., during modal open)
 */
export function stopSmoothScroll(): void {
	lenis?.stop();
}

/**
 * Resume smooth scroll (e.g., after modal close)
 */
export function startSmoothScroll(): void {
	lenis?.start();
}
