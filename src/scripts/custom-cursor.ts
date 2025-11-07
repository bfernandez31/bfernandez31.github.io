/**
 * Custom Cursor Animation
 * Feature: 009-title-custom-cursor
 *
 * Handles smooth cursor following and hover state management using GSAP quickTo.
 * - Uses GSAP quickTo for high-performance position updates (60fps)
 * - Detects hover over interactive elements (data-cursor="hover")
 * - Respects prefers-reduced-motion preference
 * - Disables on touch devices
 */

import { gsap } from "gsap";
import { isTouchDevice, prefersReducedMotion } from "./accessibility";

interface CursorState {
	cursor: HTMLElement | null;
	quickX: ((value: number) => void) | null;
	quickY: ((value: number) => void) | null;
	isHovering: boolean;
	cleanup: (() => void) | null;
}

const state: CursorState = {
	cursor: null,
	quickX: null,
	quickY: null,
	isHovering: false,
	cleanup: null,
};

/**
 * Initialize custom cursor
 * Optimized in Phase 5 (T034-T035):
 * - Removed MutationObserver (use static selector + event delegation)
 * - Added device tier check (disabled on MID/LOW tier devices)
 */
export function initCustomCursor(): void {
	// Don't initialize on touch devices or if user prefers reduced motion
	if (isTouchDevice()) {
		return;
	}

	// T035: Device tier check - disable on MID and LOW tier devices
	const deviceTier =
		typeof window !== "undefined" ? (window as any).__DEVICE_TIER__ : null;
	if (deviceTier && (deviceTier.tier === "MID" || deviceTier.tier === "LOW")) {
		console.log(
			"[CustomCursor] Disabled on MID/LOW tier device for performance",
		);
		return;
	}

	const cursor = document.getElementById("custom-cursor");
	if (!cursor) {
		console.warn("Custom cursor element not found");
		return;
	}

	state.cursor = cursor;

	// Check reduced motion preference
	const shouldReduceMotion = prefersReducedMotion();

	if (shouldReduceMotion) {
		// Use instant position updates without smooth animation
		setupInstantCursor(cursor);
	} else {
		// Use GSAP quickTo for smooth cursor following
		setupSmoothCursor(cursor);
	}

	// Set up hover detection
	setupHoverDetection(cursor);

	// Store cleanup function
	state.cleanup = () => cleanupCustomCursor();
}

/**
 * Set up smooth cursor following with GSAP quickTo
 */
function setupSmoothCursor(cursor: HTMLElement): void {
	// Create quickTo functions for optimal performance
	// These update the cursor position without creating new tweens
	state.quickX = gsap.quickTo(cursor, "x", {
		duration: 0.6,
		ease: "power3.out",
	});

	state.quickY = gsap.quickTo(cursor, "y", {
		duration: 0.6,
		ease: "power3.out",
	});

	// Track mouse movement
	const handleMouseMove = (e: MouseEvent) => {
		if (state.quickX && state.quickY) {
			state.quickX(e.clientX);
			state.quickY(e.clientY);
		}
	};

	document.addEventListener("mousemove", handleMouseMove);

	// Update cleanup to remove listener
	const previousCleanup = state.cleanup;
	state.cleanup = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		if (previousCleanup) previousCleanup();
	};
}

/**
 * Set up instant cursor following (for reduced motion)
 */
function setupInstantCursor(cursor: HTMLElement): void {
	const handleMouseMove = (e: MouseEvent) => {
		gsap.set(cursor, {
			x: e.clientX,
			y: e.clientY,
		});
	};

	document.addEventListener("mousemove", handleMouseMove);

	// Update cleanup to remove listener
	const previousCleanup = state.cleanup;
	state.cleanup = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		if (previousCleanup) previousCleanup();
	};
}

/**
 * Set up hover state detection for interactive elements
 * T034: Simplified to use event delegation instead of MutationObserver
 * Reduces overhead from observing entire DOM tree
 */
function setupHoverDetection(cursor: HTMLElement): void {
	// Interactive element selectors
	const interactiveSelectors = [
		"a[href]",
		"button:not([disabled])",
		'[data-cursor="hover"]',
		"input:not([disabled])",
		"textarea:not([disabled])",
		"select:not([disabled])",
	].join(", ");

	// Use event delegation on document for better performance
	const handleMouseOver = (e: Event) => {
		const target = e.target as Element;
		// Check if target or any parent matches interactive selectors
		if (target.closest(interactiveSelectors)) {
			if (!state.isHovering) {
				state.isHovering = true;
				cursor.classList.add("custom-cursor--hover");
			}
		}
	};

	const handleMouseOut = (e: Event) => {
		const target = e.target as Element;
		// Check if we're leaving an interactive element
		if (target.closest(interactiveSelectors)) {
			const relatedTarget = (e as MouseEvent).relatedTarget as Element;
			// Only remove hover if not moving to another interactive element
			if (!relatedTarget || !relatedTarget.closest(interactiveSelectors)) {
				if (state.isHovering) {
					state.isHovering = false;
					cursor.classList.remove("custom-cursor--hover");
				}
			}
		}
	};

	// Add event listeners to document (event delegation)
	document.addEventListener("mouseover", handleMouseOver);
	document.addEventListener("mouseout", handleMouseOut);

	// Update cleanup to remove listeners
	const previousCleanup = state.cleanup;
	state.cleanup = () => {
		document.removeEventListener("mouseover", handleMouseOver);
		document.removeEventListener("mouseout", handleMouseOut);
		if (previousCleanup) previousCleanup();
	};
}

/**
 * Clean up custom cursor (remove event listeners, kill animations)
 */
export function cleanupCustomCursor(): void {
	if (state.cleanup) {
		state.cleanup();
	}

	// Kill any remaining GSAP animations on the cursor
	if (state.cursor) {
		gsap.killTweensOf(state.cursor);
	}

	// Reset state
	state.cursor = null;
	state.quickX = null;
	state.quickY = null;
	state.isHovering = false;
	state.cleanup = null;
}
