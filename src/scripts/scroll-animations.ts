/**
 * Smooth Scroll Initialization with Lenis
 * Feature: 003-1507-architecture-globale
 *
 * Provides buttery-smooth scrolling using Lenis library.
 * Integrates with GSAP ScrollTrigger for synchronized animations.
 */

import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./animation-config";

let lenis: Lenis | null = null;

/**
 * Initialize Lenis smooth scrolling
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

	// Initialize Lenis
	lenis = new Lenis({
		duration: 1.2,
		easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: "vertical",
		gestureOrientation: "vertical",
		smoothWheel: true,
		wheelMultiplier: 1.0,
		touchMultiplier: 2.0,
		infinite: false,
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

	console.log("[SmoothScroll] Initialized successfully");

	return lenis;
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
