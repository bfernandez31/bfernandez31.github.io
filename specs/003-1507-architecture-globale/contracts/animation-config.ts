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
	// Particle counts
	NODE_COUNT_DESKTOP: 100,
	NODE_COUNT_TABLET: 75,
	NODE_COUNT_MOBILE: 50,

	// Visual properties
	NODE_RADIUS: 3, // pixels
	EDGE_WIDTH: 1, // pixels
	CONNECTION_DISTANCE: 150, // pixels
	PULSE_SPEED: 0.02, // units per frame

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
// NEURAL PATHWAY LINKS CONFIG
// ============================================================================

/**
 * Default configuration for neural pathway link animations
 */
export const NEURAL_PATHWAY_DEFAULTS = {
	// Visual properties
	NODE_COUNT_MIN: 3,
	NODE_COUNT_MAX: 8,
	LINE_WIDTH: 2, // pixels
	GLOW_BLUR: 8, // pixels

	// Animation timing
	APPEAR_DURATION: 0.6, // seconds
	DISAPPEAR_DURATION: 0.3, // seconds
	PULSE_INTERVAL: 2.0, // seconds between pulses
	EASING: EASINGS.EASE_IN_OUT,

	// Colors (per link, configurable)
	DEFAULT_COLOR: "var(--color-accent)",

	// Interaction behavior
	TRIGGER: "hover", // 'hover' | 'click' | 'always'
	HOVER_DELAY: 0.1, // seconds before showing

	// Reduced motion fallback
	REDUCED_MOTION_STYLE: "underline-only", // No pathway animation
} as const;

// ============================================================================
// SCROLL ANIMATIONS CONFIG
// ============================================================================

/**
 * Standard ScrollTrigger configurations for common patterns
 */
export const SCROLL_TRIGGER_PRESETS = {
	// Fade in on scroll into view
	FADE_IN: {
		start: "top 80%",
		end: "top 20%",
		scrub: false,
		once: true,
	},

	// Parallax effect
	PARALLAX: {
		start: "top bottom",
		end: "bottom top",
		scrub: 1,
		ease: EASINGS.LINEAR,
	},

	// Pin section while scrolling
	PIN: {
		start: "top top",
		end: "+=100%",
		pin: true,
		scrub: true,
	},

	// Horizontal scroll
	HORIZONTAL: {
		start: "top top",
		end: () => `+=${window.innerWidth}`,
		scrub: 1,
		pin: true,
	},

	// Stagger children on scroll
	STAGGER_IN: {
		start: "top 75%",
		toggleActions: "play none none reverse",
	},
} as const;

/**
 * Lenis smooth scroll configuration
 */
export const SMOOTH_SCROLL_CONFIG = {
	duration: 1.2, // Scroll animation duration
	easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)), // Custom easing
	smooth: true,
	smoothTouch: false, // Disable on touch devices (feels unnatural)
	wheelMultiplier: 1.0, // Scroll speed multiplier
	touchMultiplier: 2.0,
} as const;

// ============================================================================
// HEXAGONAL GRID ANIMATIONS
// ============================================================================

/**
 * Animation configuration for hexagonal project grid
 */
export const HEXAGON_ANIMATION_DEFAULTS = {
	// Entrance animation (when grid appears)
	ENTRANCE_STAGGER: 0.05, // seconds between each hexagon
	ENTRANCE_DURATION: 0.5, // seconds per hexagon
	ENTRANCE_EASING: EASINGS.EASE_OUT,
	ENTRANCE_FROM: {
		opacity: 0,
		scale: 0.8,
		y: 20,
	},

	// Hover animation
	HOVER_SCALE: 1.08, // Scale multiplier
	HOVER_DURATION: 0.3, // seconds
	HOVER_EASING: EASINGS.EASE_OUT,
	HOVER_Z_INDEX: 10,

	// Tap/click animation (mobile)
	TAP_SCALE: 0.96, // Slightly smaller on press
	TAP_DURATION: 0.15, // Quick feedback

	// Overlay reveal (project info)
	OVERLAY_DURATION: 0.3,
	OVERLAY_EASING: EASINGS.EASE_IN_OUT,
	OVERLAY_INITIAL_Y: 20, // pixels to slide up from

	// Reduced motion fallback
	REDUCED_MOTION_HOVER_SCALE: 1.02, // Subtle scale only
	REDUCED_MOTION_DURATION: 0.1,
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
	const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	const cores = navigator.hardwareConcurrency || 4;
	const memory = (navigator as any).deviceMemory || 8; // GB

	// Low-end device detection
	if (cores <= 2 || memory <= 2) return "low-end";

	// Screen size detection
	if (width < 768) return "mobile";
	if (width < 1024) return "tablet";
	return "desktop";
};

/**
 * Get FPS target based on device tier
 */
export const getTargetFPS = (): number => {
	const tier = getDeviceTier();
	return FPS_TARGETS[tier.toUpperCase() as keyof typeof FPS_TARGETS];
};

/**
 * Get node count for neural network based on device
 */
export const getNeuralNodeCount = (): number => {
	const tier = getDeviceTier();

	if (prefersReducedMotion()) {
		return NEURAL_NETWORK_DEFAULTS.REDUCED_MOTION_NODE_COUNT;
	}

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
	NEURAL_PATHWAY_DEFAULTS,
	SCROLL_TRIGGER_PRESETS,
	SMOOTH_SCROLL_CONFIG,
	HEXAGON_ANIMATION_DEFAULTS,
} as const;
