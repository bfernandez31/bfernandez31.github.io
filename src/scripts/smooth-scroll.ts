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
 * EaseOutCubic easing function (T021)
 * More responsive than easeInOutExpo for user-initiated scrolling
 */
function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

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
	// Error boundary wrapper (T047)
	try {
		// Respect user's motion preferences (T024)
		if (prefersReducedMotion()) {
			console.log(
				"[SmoothScroll] Reduced motion detected - smooth scroll disabled",
			);
			return null;
		}

		// Check device tier - disable on LOW tier devices (T023)
		const deviceTier =
			typeof window !== "undefined" ? (window as any).__DEVICE_TIER__ : null;
		if (deviceTier?.tier === "LOW") {
			console.log(
				"[SmoothScroll] LOW tier device detected - smooth scroll disabled for performance",
			);
			return null;
		}

		// Initialize Lenis with optimized settings (T020, T021)
		lenis = new Lenis({
			duration: 0.6, // Reduced from 1.2s for better responsiveness (T020)
			easing: easeOutCubic, // Changed from easeInOutExpo (T021)
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 2.0,
			infinite: false,
			// Enable momentum scrolling
			syncTouch: true,
			syncTouchLerp: 0.1,
			// Scroll interruption handling (T025)
			prevent: (_node) => {
				// Allow natural scroll interruption
				return false;
			},
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

		// Section snap removed entirely (T022) - interferes with free scrolling

		// Expose Lenis instance on window for navigation-links.ts compatibility
		window.lenis = lenis;

		console.log(
			"[SmoothScroll] Initialized successfully (optimized: 0.6s duration, easeOutCubic, no snap)",
		);

		return lenis;
	} catch (error) {
		// Progressive enhancement fallback (T047)
		console.error("[SmoothScroll] Failed to initialize:", error);
		console.log("[SmoothScroll] Falling back to native scroll behavior");
		// Site remains functional with native browser scroll
		return null;
	}
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
