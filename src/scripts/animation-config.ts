/**
 * Animation Configuration Constants
 * Feature: 003-1507-architecture-globale
 *
 * Centralized configuration for all GSAP animations, transitions, and motion effects.
 * Ensures consistency and respects performance budgets and accessibility preferences.
 */

// ============================================================================
// PERFORMANCE CONSTANTS
// ============================================================================

/**
 * Frame rate targets based on device capability
 */
export const FPS_TARGETS = {
	DESKTOP: 60,
	TABLET: 45,
	MOBILE: 30,
	LOW_END: 24,
} as const;

/**
 * Animation performance thresholds
 * If frame time exceeds these values, trigger performance degradation
 */
export const FRAME_TIME_THRESHOLDS = {
	OPTIMAL: 16.67, // 60fps
	ACCEPTABLE: 22.22, // 45fps
	DEGRADED: 33.33, // 30fps
	CRITICAL: 41.67, // 24fps
} as const;

/**
 * JavaScript bundle size budget for animations
 */
export const ANIMATION_BUNDLE_BUDGET = {
	NEURAL_NETWORK: 8192, // 8KB (3-8KB actual)
	MAGNETIC_MENU: 2048, // 2KB (1-2KB actual)
	SCROLL_ANIMATIONS: 1024, // 1KB
	GSAP_CORE: 46080, // 45KB (GSAP + ScrollTrigger)
	LENIS_SMOOTH_SCROLL: 10240, // 10KB
	TOTAL_BUDGET: 67584, // ~66KB of 200KB total JS budget
} as const;

// ============================================================================
// GSAP EASING FUNCTIONS
// ============================================================================

/**
 * Standard easing functions for consistent animation feel
 * All use GSAP easing names
 */
export const EASINGS = {
	// Natural motion (recommended for most animations)
	EASE_OUT: "power2.out",
	EASE_IN: "power2.in",
	EASE_IN_OUT: "power2.inOut",

	// Bouncy/elastic (use sparingly)
	BOUNCE: "bounce.out",
	ELASTIC: "elastic.out(1, 0.5)",

	// Smooth/organic
	SINE: "sine.inOut",
	EXPO: "expo.out",

	// Linear (avoid for UI, use for scroll scrub)
	LINEAR: "none",

	// Custom cubic-bezier equivalents
	SMOOTH: "power1.out", // Similar to ease
	SNAPPY: "power3.out", // Fast start, slow end
	SWIFT: "power4.out", // Very fast start
} as const;

// ============================================================================
// DURATION CONSTANTS
// ============================================================================

/**
 * Standard animation durations in seconds
 * Based on Material Design and iOS HIG guidelines
 */
export const DURATIONS = {
	// Micro-interactions
	INSTANT: 0.1, // Button press, checkbox toggle
	QUICK: 0.15, // Hover effects, tooltip show
	FAST: 0.2, // Dropdown open, small movements

	// Standard UI animations
	NORMAL: 0.3, // Default for most transitions
	MODERATE: 0.4, // Card flips, panel slides
	COMFORTABLE: 0.5, // Page transitions, large movements

	// Complex animations
	SLOW: 0.7, // Complex state changes
	VERY_SLOW: 1.0, // Intro animations, reveals
	DRAMATIC: 1.5, // Hero entrance, special effects

	// Scroll-based (no fixed duration, use scrub)
	SCRUB: true, // Tied to scroll position
} as const;

// ============================================================================
// NEURAL NETWORK ANIMATION CONFIG
// ============================================================================

/**
 * Default configuration for hero neural network animation
 */
export const NEURAL_NETWORK_DEFAULTS = {
	// Particle counts - Balanced for visibility and performance
	NODE_COUNT_DESKTOP: 30,
	NODE_COUNT_TABLET: 20,
	NODE_COUNT_MOBILE: 15,

	// Visual properties
	NODE_RADIUS: 3, // pixels
	EDGE_WIDTH: 1.5, // pixels - slightly thicker for visibility
	CONNECTION_DISTANCE: 120, // pixels - moderate distance
	PULSE_SPEED: 0.02, // units per frame - smooth animation

	// Colors (using CSS custom properties)
	COLORS: {
		NODES: "var(--color-primary)", // Violet
		EDGES: "var(--color-accent)", // Lavender
		PULSES: "var(--color-secondary)", // Rose/Pink
		GLOW: "var(--color-primary)", // Violet glow
	},

	// Animation timings
	INTRO_DURATION: 1.5, // seconds
	INTRO_STAGGER: 0.02, // seconds between nodes
	FADE_IN_DURATION: 0.8, // seconds
	IDLE_ANIMATION_SPEED: 0.5, // multiplier

	// Performance
	TARGET_FPS_DESKTOP: 60,
	TARGET_FPS_MOBILE: 30,
	ENABLE_OFFSCREEN_CACHING: true,
	ENABLE_SPATIAL_PARTITIONING: true, // Quadtree for >100 nodes

	// Scroll behavior
	SCROLL_FADE_START: "top center",
	SCROLL_FADE_END: "bottom top",
	SCROLL_OPACITY_MIN: 0.3,
	SCROLL_SCALE_MAX: 1.2,

	// Reduced motion fallback
	REDUCED_MOTION_NODE_COUNT: 20,
	REDUCED_MOTION_ANIMATION: "opacity-pulse-only", // No movement
} as const;

// ============================================================================
// MAGNETIC MENU CONFIG
// ============================================================================

/**
 * Default configuration for magnetic burger menu effect
 */
export const MAGNETIC_MENU_DEFAULTS = {
	// Attraction physics
	THRESHOLD: 100, // Activation radius (px)
	STRENGTH: 0.4, // Force multiplier (0-1)
	MAX_DISPLACEMENT: 15, // Maximum movement (px)

	// Animation timing
	DURATION: 0.25, // seconds
	EASING: EASINGS.EASE_OUT,

	// Interaction zones
	ACTIVATION_ZONE: 100, // Distance to start effect (px)
	DEAD_ZONE: 5, // Center area with no effect (px)

	// Reduced motion fallback
	REDUCED_MOTION_DURATION: 0.01, // Near-instant (respects preference)
	REDUCED_MOTION_ENABLED: false, // Disable effect entirely
} as const;

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get safe duration based on motion preference
 * Returns instant duration if user prefers reduced motion
 */
export const getSafeDuration = (normalDuration: number): number => {
	return prefersReducedMotion() ? DURATIONS.INSTANT : normalDuration;
};

/**
 * Get safe easing based on motion preference
 * Returns linear easing if user prefers reduced motion
 */
export const getSafeEasing = (normalEasing: string): string => {
	return prefersReducedMotion() ? EASINGS.LINEAR : normalEasing;
};

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Detect device capability tier
 */
export const getDeviceTier = ():
	| "desktop"
	| "tablet"
	| "mobile"
	| "low-end" => {
	if (typeof window === "undefined") return "desktop";

	const width = window.innerWidth;
	const cores = navigator.hardwareConcurrency || 4;
	const memory = (navigator as { deviceMemory?: number }).deviceMemory || 8; // GB

	// Low-end device detection
	if (cores <= 2 || memory <= 2) return "low-end";

	// Screen size detection
	if (width < 768) return "mobile";
	if (width < 1024) return "tablet";
	return "desktop";
};

/**
 * Get FPS target based on device tier
 * Uses simple device tier detection without requiring performance config
 */
export const getTargetFPS = (): number => {
	// Check for global device tier detection (from device-tier.ts)
	const globalTier =
		typeof window !== "undefined" ? (window as any).__DEVICE_TIER__ : null;

	if (globalTier) {
		// Use device tier FPS targets directly
		switch (globalTier.tier) {
			case "HIGH":
				return 60; // Modern desktop
			case "MID":
			case "LOW":
				return 30; // Mid-range and old devices
			default:
				return 30; // Default to balanced
		}
	}

	// Fallback to old detection
	const tier = getDeviceTier();
	return FPS_TARGETS[tier.toUpperCase() as keyof typeof FPS_TARGETS];
};

/**
 * Get node count for neural network based on device
 * Uses simple device tier detection without requiring performance config
 */
export const getNeuralNodeCount = (): number => {
	if (prefersReducedMotion()) {
		return NEURAL_NETWORK_DEFAULTS.REDUCED_MOTION_NODE_COUNT;
	}

	// Check for global device tier detection (from device-tier.ts)
	const globalTier =
		typeof window !== "undefined" ? (window as any).__DEVICE_TIER__ : null;

	if (globalTier) {
		// Use device tier particle counts directly
		switch (globalTier.tier) {
			case "HIGH":
				return 30; // Modern desktop
			case "MID":
				return 20; // Mid-range
			case "LOW":
				return 15; // Old devices
			default:
				return 20; // Default to balanced
		}
	}

	// Fallback to old detection if device tier not yet initialized
	const tier = getDeviceTier();
	switch (tier) {
		case "desktop":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_DESKTOP;
		case "tablet":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_TABLET;
		case "mobile":
		case "low-end":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_MOBILE;
	}
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Frame rate monitor for adaptive performance
 */
export class FrameRateMonitor {
	private frameTimes: number[] = [];
	private maxSamples = 60;
	private lastFrameTime = performance.now();

	recordFrame(): void {
		const now = performance.now();
		const frameTime = now - this.lastFrameTime;
		this.lastFrameTime = now;

		this.frameTimes.push(frameTime);
		if (this.frameTimes.length > this.maxSamples) {
			this.frameTimes.shift();
		}
	}

	getAverageFPS(): number {
		if (this.frameTimes.length === 0) return 60;
		const avgFrameTime =
			this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		return Math.round(1000 / avgFrameTime);
	}

	shouldDegrade(): boolean {
		const avgFPS = this.getAverageFPS();
		const targetFPS = getTargetFPS();
		return avgFPS < targetFPS * 0.8; // 20% threshold
	}

	reset(): void {
		this.frameTimes = [];
		this.lastFrameTime = performance.now();
	}
}

// ============================================================================
// HERO ANIMATION CONFIG (PBF-28)
// ============================================================================

/**
 * Hero animation configuration
 * Used by src/scripts/hero/hero-controller.ts
 */
export const HERO_ANIMATION_DEFAULTS = {
	// Entrance timing
	ENTRANCE_DURATION: 2.5, // Total entrance animation duration (seconds)
	CANVAS_FADE_DURATION: 0.8, // Canvas fade-in duration (seconds)
	TYPOGRAPHY_DELAY_DESKTOP: 0.5, // Desktop text reveal delay (seconds)
	TYPOGRAPHY_DELAY_MOBILE: 0.3, // Mobile text reveal delay (seconds)
	CURSOR_ENABLE_DELAY: 1, // Delay before cursor tracking (seconds)

	// Parallax factors (movement multiplier)
	PARALLAX_FRONT: 0.15,
	PARALLAX_MID: 0.08,
	PARALLAX_BACK: 0.03,
	PARALLAX_DURATION: 0.6, // Parallax animation duration (seconds)
	PARALLAX_EASING: "power3.out",

	// Performance degradation thresholds
	DEGRADATION_LEVEL1_FPS: 45, // Below this: reduce shapes
	DEGRADATION_LEVEL2_FPS: 30, // Below this: disable parallax
	DEGRADATION_LEVEL3_FPS: 20, // Below this: CSS fallback

	// Shape counts by tier
	SHAPES_HIGH_TIER: 12,
	SHAPES_MID_TIER: 7,
	SHAPES_LOW_TIER: 3,
} as const;

// ============================================================================
// EXPORT ALL CONFIGS
// ============================================================================

export const ANIMATION_CONFIG = {
	FPS_TARGETS,
	FRAME_TIME_THRESHOLDS,
	ANIMATION_BUNDLE_BUDGET,
	EASINGS,
	DURATIONS,
	NEURAL_NETWORK_DEFAULTS,
	MAGNETIC_MENU_DEFAULTS,
	HERO_ANIMATION_DEFAULTS,
} as const;
