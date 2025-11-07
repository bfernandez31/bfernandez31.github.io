/**
 * Smooth Scroll Initialization with Lenis
 * Feature: 006-title-lenis-smooth
 *
 * Provides buttery-smooth scrolling using Lenis library with snap functionality.
 * Integrates with GSAP ScrollTrigger for synchronized animations.
 */

import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./animation-config";

// Extend Window interface for Lenis
declare global {
	interface Window {
		lenis?: Lenis;
	}
}

let lenis: Lenis | null = null;

/**
 * EaseInOutExpo easing function
 * Exponential easing for smooth acceleration and deceleration
 */
function easeInOutExpo(t: number): number {
	if (t === 0) return 0;
	if (t === 1) return 1;
	if (t < 0.5) {
		return 2 ** (20 * t - 10) / 2;
	}
	return (2 - 2 ** (-20 * t + 10)) / 2;
}

/**
 * Initialize Lenis smooth scrolling with snap functionality
 * Call this once when the application loads
 */
export function initSmoothScroll(): Lenis | null {
	// Respect user's motion preferences
	if (prefersReducedMotion()) {
		console.log(
			"[SmoothScroll] Reduced motion detected - smooth scroll disabled",
		);
		return null;
	}

	// Initialize Lenis with easeInOutExpo and snap
	lenis = new Lenis({
		duration: 1.2,
		easing: easeInOutExpo,
		orientation: "vertical",
		gestureOrientation: "vertical",
		smoothWheel: true,
		wheelMultiplier: 1.0,
		touchMultiplier: 2.0,
		infinite: false,
		// Enable momentum scrolling
		syncTouch: true,
		syncTouchLerp: 0.1,
	});

	// Integrate Lenis with GSAP ScrollTrigger
	lenis.on("scroll", () => {
		ScrollTrigger.update();
	});

	// Add Lenis to GSAP ticker for smooth updates
	gsap.ticker.add((time) => {
		lenis?.raf(time * 1000); // Convert to milliseconds
	});

	// Disable GSAP's lag smoothing to prevent conflicts
	gsap.ticker.lagSmoothing(0);

	// Setup snap functionality for sections
	setupSectionSnap(lenis);

	// Expose Lenis instance on window for navigation-links.ts compatibility
	window.lenis = lenis;

	console.log("[SmoothScroll] Initialized successfully with snap");

	return lenis;
}

/**
 * Setup section snap functionality
 * Snaps to portfolio sections when scroll velocity is low
 */
function setupSectionSnap(lenisInstance: Lenis): void {
	const sections = document.querySelectorAll<HTMLElement>("[data-section]");
	if (sections.length === 0) return;

	let snapTimeout: ReturnType<typeof setTimeout> | null = null;
	let isSnapping = false;

	lenisInstance.on("scroll", ({ velocity }: { velocity: number }) => {
		// Only snap when scroll velocity is low (user stopped scrolling)
		if (Math.abs(velocity) < 0.1 && !isSnapping) {
			if (snapTimeout) clearTimeout(snapTimeout);

			snapTimeout = setTimeout(() => {
				const scrollY = window.scrollY;
				const viewportHeight = window.innerHeight;
				let closestSection: HTMLElement | null = null;
				let closestDistance = Number.POSITIVE_INFINITY;

				// Find the closest section to snap to
				sections.forEach((section) => {
					const rect = section.getBoundingClientRect();
					const sectionTop = scrollY + rect.top;
					const distance = Math.abs(sectionTop - scrollY);

					// Consider sections within viewport range
					if (distance < viewportHeight && distance < closestDistance) {
						closestDistance = distance;
						closestSection = section;
					}
				});

				// Snap to closest section
				if (closestSection && closestDistance > 10) {
					isSnapping = true;
					lenisInstance.scrollTo(closestSection, {
						duration: 1.2,
						easing: easeInOutExpo,
						onComplete: () => {
							isSnapping = false;
						},
					});
				}
			}, 150); // Debounce snap trigger
		}
	});
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
