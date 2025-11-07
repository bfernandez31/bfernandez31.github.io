/**
 * GSAP Configuration and Initialization
 * Feature: 003-1507-architecture-globale
 *
 * Centralized GSAP setup with ScrollTrigger integration.
 * Call initGSAP() once in your application to configure GSAP globally.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initialize GSAP with ScrollTrigger and global configuration
 * Call this once when the application loads (typically in a layout or main component)
 */
export function initGSAP(): void {
	// Register ScrollTrigger plugin
	gsap.registerPlugin(ScrollTrigger);

	// Global GSAP defaults
	gsap.defaults({
		ease: "power2.out",
		duration: 0.3,
	});

	// ScrollTrigger global configuration
	ScrollTrigger.config({
		limitCallbacks: true, // Performance optimization
		syncInterval: 8, // Update frequency (ms)
	});

	// Refresh ScrollTrigger on window resize (debounced)
	let resizeTimeout: ReturnType<typeof setTimeout>;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			ScrollTrigger.refresh();
		}, 250);
	});
}

/**
 * Kill all ScrollTriggers and reset GSAP
 * Useful for cleanup or route changes
 */
export function cleanupGSAP(): void {
	ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
	gsap.killTweensOf("*");
}

/**
 * Create a fade-in animation on scroll
 */
export function fadeInOnScroll(
	element: HTMLElement | string,
	options: {
		start?: string;
		end?: string;
		duration?: number;
		y?: number;
		opacity?: number;
	} = {},
): void {
	const {
		start = "top 80%",
		end = "top 20%",
		duration = 0.8,
		y = 30,
		opacity = 0,
	} = options;

	gsap.from(element, {
		y,
		opacity,
		duration,
		ease: "power2.out",
		scrollTrigger: {
			trigger: element,
			start,
			end,
			toggleActions: "play none none reverse",
		},
	});
}

/**
 * Create a stagger fade-in animation for multiple elements
 */
export function staggerFadeIn(
	elements: HTMLElement[] | NodeListOf<Element> | string,
	options: {
		start?: string;
		stagger?: number;
		duration?: number;
		y?: number;
	} = {},
): void {
	const { start = "top 75%", stagger = 0.1, duration = 0.6, y = 20 } = options;

	gsap.from(elements, {
		y,
		opacity: 0,
		duration,
		stagger,
		ease: "power2.out",
		scrollTrigger: {
			trigger:
				typeof elements === "string" ? elements : (elements[0] as HTMLElement),
			start,
			toggleActions: "play none none reverse",
		},
	});
}

/**
 * Export GSAP and ScrollTrigger for use in other modules
 */
export { gsap, ScrollTrigger };
