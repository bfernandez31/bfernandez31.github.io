/**
 * Magnetic Menu Effect
 * Feature: 003-1507-architecture-globale
 *
 * Creates a magnetic cursor effect using GSAP quickTo() for optimal performance.
 * Respects user motion preferences for accessibility.
 */

import { gsap } from "gsap";
import { MAGNETIC_MENU_DEFAULTS, prefersReducedMotion } from "./animation-config";

export interface MagneticOptions {
	threshold?: number; // Activation radius (px)
	strength?: number; // Force multiplier (0-1)
	duration?: number; // Animation duration (s)
	ease?: string; // GSAP ease
}

/**
 * Initialize magnetic effect on an element
 * Returns cleanup function
 */
export function initMagneticMenu(
	element: HTMLElement,
	options: MagneticOptions = {},
): () => void {
	// Respect user's motion preferences
	if (
		prefersReducedMotion() ||
		!MAGNETIC_MENU_DEFAULTS.REDUCED_MOTION_ENABLED
	) {
		return () => {}; // no-op cleanup
	}

	const {
		threshold = MAGNETIC_MENU_DEFAULTS.THRESHOLD,
		strength = MAGNETIC_MENU_DEFAULTS.STRENGTH,
		duration = MAGNETIC_MENU_DEFAULTS.DURATION,
		ease = MAGNETIC_MENU_DEFAULTS.EASING,
	} = options;

	// Create GSAP quickTo for optimal performance
	const quickX = gsap.quickTo(element, "x", { duration, ease });
	const quickY = gsap.quickTo(element, "y", { duration, ease });

	/**
	 * Calculate distance and apply magnetic force
	 */
	const handleMouseMove = (e: MouseEvent) => {
		const rect = element.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const deltaX = e.clientX - centerX;
		const deltaY = e.clientY - centerY;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		if (distance < threshold) {
			// Calculate falloff (strength decreases with distance)
			const falloff = 1 - distance / threshold;
			const moveX = deltaX * strength * falloff;
			const moveY = deltaY * strength * falloff;

			// Apply magnetic force
			quickX(moveX);
			quickY(moveY);
		}
	};

	/**
	 * Reset position when mouse leaves
	 */
	const handleMouseLeave = () => {
		quickX(0);
		quickY(0);
	};

	// Attach event listeners
	element.addEventListener("mousemove", handleMouseMove);
	element.addEventListener("mouseleave", handleMouseLeave);

	// Return cleanup function
	return () => {
		element.removeEventListener("mousemove", handleMouseMove);
		element.removeEventListener("mouseleave", handleMouseLeave);
		gsap.set(element, { x: 0, y: 0 });
	};
}
