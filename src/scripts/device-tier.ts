/**
 * Device Tier Detection Utility
 * Feature: 003-1507-architecture-globale
 *
 * Detects device capabilities and provides adaptive configuration
 * for optimal performance across all device tiers.
 */

import { prefersReducedMotion } from "./accessibility";
import { FPS_TARGETS, NEURAL_NETWORK_DEFAULTS } from "./animation-config";

/**
 * Device tier categories
 */
export type DeviceTier = "desktop" | "tablet" | "mobile" | "low-end";

/**
 * Detect device capability tier based on hardware and viewport
 */
export const getDeviceTier = (): DeviceTier => {
	if (typeof window === "undefined") return "desktop";

	const width = window.innerWidth;
	const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	const cores = navigator.hardwareConcurrency || 4;
	const memory = (navigator as any).deviceMemory || 8; // GB

	// Low-end device detection
	if (cores <= 2 || memory <= 2) {
		return "low-end";
	}

	// Enhanced mobile detection
	const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
	const isSmallViewport = width < 768;
	const isMobileUA = isMobile || /Mobile|Tablet/i.test(navigator.userAgent);

	// Prioritize viewport size for responsive behavior
	if (isSmallViewport || (hasTouch && isMobileUA)) {
		return "mobile";
	}

	if (width < 1024 || (hasTouch && !isMobileUA)) {
		return "tablet";
	}

	// High-end detection for desktop
	if (cores >= 8 && memory >= 8) {
		return "desktop";
	}

	// Default to desktop for larger viewports
	return "desktop";
};

/**
 * Get target FPS based on device tier
 */
export const getTargetFPS = (): number => {
	const tier = getDeviceTier();

	// Map tier to FPS_TARGETS keys
	const tierMap: Record<DeviceTier, keyof typeof FPS_TARGETS> = {
		desktop: "DESKTOP",
		tablet: "TABLET",
		mobile: "MOBILE",
		"low-end": "LOW_END",
	};

	return FPS_TARGETS[tierMap[tier]];
};

/**
 * Get neural network node count based on device capability
 */
export const getNeuralNodeCount = (): number => {
	// Respect reduced motion preference
	if (prefersReducedMotion()) {
		return NEURAL_NETWORK_DEFAULTS.REDUCED_MOTION_NODE_COUNT;
	}

	const tier = getDeviceTier();

	switch (tier) {
		case "desktop":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_DESKTOP;
		case "tablet":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_TABLET;
		case "mobile":
		case "low-end":
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_MOBILE;
		default:
			return NEURAL_NETWORK_DEFAULTS.NODE_COUNT_MOBILE;
	}
};

/**
 * Get animation quality preset based on device
 */
export const getAnimationQuality = ():
	| "high"
	| "medium"
	| "low"
	| "minimal" => {
	if (prefersReducedMotion()) {
		return "minimal";
	}

	const tier = getDeviceTier();

	switch (tier) {
		case "desktop":
			return "high";
		case "tablet":
			return "medium";
		case "mobile":
			return "low";
		case "low-end":
			return "minimal";
		default:
			return "low";
	}
};

/**
 * Check if device supports advanced animations
 */
export const supportsAdvancedAnimations = (): boolean => {
	const tier = getDeviceTier();
	return tier === "desktop" || tier === "tablet";
};

/**
 * Get performance configuration based on device
 */
export const getPerformanceConfig = () => {
	const tier = getDeviceTier();
	const quality = getAnimationQuality();

	return {
		tier,
		targetFPS: getTargetFPS(),
		neuralNodes: getNeuralNodeCount(),
		quality,
		enableParticles: tier === "desktop" || tier === "tablet",
		enableBlur: tier === "desktop",
		enableGlow: tier === "desktop",
		enableShadows: tier !== "low-end",
		maxAnimations: tier === "desktop" ? 10 : tier === "tablet" ? 5 : 3,
		scrollSmoothing: tier !== "low-end",
		prefersReducedMotion: prefersReducedMotion(),
	};
};

/**
 * Device capability detection utilities
 */
export const deviceCapabilities = {
	/**
	 * Check if device has good GPU support
	 */
	hasGoodGPU(): boolean {
		const canvas = document.createElement("canvas");
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		if (!gl) return false;

		const renderer = (gl as WebGLRenderingContext).getParameter(
			(gl as WebGLRenderingContext).RENDERER,
		);

		// Check for known low-end GPUs
		const lowEndGPUs = ["Mali", "Adreno", "PowerVR"];
		return !lowEndGPUs.some((gpu) => renderer.includes(gpu));
	},

	/**
	 * Check available memory (rough estimate)
	 */
	getMemoryEstimate(): number {
		return (
			(navigator as any).deviceMemory ||
			(performance as any).memory?.jsHeapSizeLimit / (1024 * 1024 * 1024) ||
			4
		); // Default to 4GB if not available
	},

	/**
	 * Check connection quality
	 */
	getConnectionQuality(): "fast" | "slow" | "unknown" {
		const connection =
			(navigator as any).connection ||
			(navigator as any).mozConnection ||
			(navigator as any).webkitConnection;

		if (!connection) return "unknown";

		const effectiveType = connection.effectiveType;
		if (effectiveType === "4g") return "fast";
		if (effectiveType === "3g" || effectiveType === "2g") return "slow";

		return "unknown";
	},

	/**
	 * Check battery status (if available)
	 */
	async getBatteryStatus(): Promise<"charging" | "high" | "low" | "unknown"> {
		if (!("getBattery" in navigator)) return "unknown";

		try {
			const battery = await (navigator as any).getBattery();
			if (battery.charging) return "charging";
			if (battery.level > 0.2) return "high";
			return "low";
		} catch {
			return "unknown";
		}
	},
};

/**
 * Log device capabilities in development mode
 */
if (import.meta.env.DEV && typeof window !== "undefined") {
	window.addEventListener("DOMContentLoaded", () => {
		const config = getPerformanceConfig();
		console.log("[Device Tier]", config);

		// Log additional capabilities
		console.log("[GPU Support]", deviceCapabilities.hasGoodGPU());
		console.log("[Memory]", `${deviceCapabilities.getMemoryEstimate()}GB`);
		console.log("[Connection]", deviceCapabilities.getConnectionQuality());
	});
}
