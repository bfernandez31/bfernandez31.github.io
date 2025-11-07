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
import { prefersReducedMotion, isTouchDevice } from "./accessibility";

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
 */
export function initCustomCursor(): void {
	// Don't initialize on touch devices or if user prefers reduced motion
	if (isTouchDevice()) {
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
 */
function setupHoverDetection(cursor: HTMLElement): void {
	// Select all interactive elements
	const interactiveSelectors = [
		"a[href]",
		"button:not([disabled])",
		'[data-cursor="hover"]',
		"input:not([disabled])",
		"textarea:not([disabled])",
		"select:not([disabled])",
	].join(", ");

	const handleMouseEnter = () => {
		if (!state.isHovering) {
			state.isHovering = true;
			cursor.classList.add("custom-cursor--hover");
		}
	};

	const handleMouseLeave = () => {
		if (state.isHovering) {
			state.isHovering = false;
			cursor.classList.remove("custom-cursor--hover");
		}
	};

	// Add listeners to all interactive elements
	const addListenersToElement = (element: Element) => {
		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);
	};

	// Initial setup
	document
		.querySelectorAll(interactiveSelectors)
		.forEach(addListenersToElement);

	// Use MutationObserver to handle dynamically added elements
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node instanceof Element) {
					// Check if the node itself matches
					if (node.matches(interactiveSelectors)) {
						addListenersToElement(node);
					}
					// Check for matching descendants
					node
						.querySelectorAll(interactiveSelectors)
						.forEach(addListenersToElement);
				}
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Update cleanup to disconnect observer and remove listeners
	const previousCleanup = state.cleanup;
	state.cleanup = () => {
		observer.disconnect();
		document.querySelectorAll(interactiveSelectors).forEach((element) => {
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
		});
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
