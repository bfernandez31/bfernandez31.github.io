/**
 * Performance Configuration
 *
 * Central configuration for performance budgets, device tier mappings,
 * and optimization thresholds.
 */

export type DeviceTierLevel = "HIGH" | "MID" | "LOW" | "UNKNOWN";

export interface DeviceTierConfig {
	particles: number;
	targetFPS: number;
	enableCursorEffects: boolean;
	enableSmoothScroll: boolean;
}

/**
 * Device tier configuration mappings
 * Defines animation and feature settings based on device capabilities
 */
export const DEVICE_TIER_CONFIGS: Record<DeviceTierLevel, DeviceTierConfig> = {
	HIGH: {
		particles: 30, // Balanced for visibility and performance
		targetFPS: 60,
		enableCursorEffects: true,
		enableSmoothScroll: false, // Disabled temporarily for performance
	},
	MID: {
		particles: 20,
		targetFPS: 30,
		enableCursorEffects: false,
		enableSmoothScroll: false,
	},
	LOW: {
		particles: 15,
		targetFPS: 30,
		enableCursorEffects: false,
		enableSmoothScroll: false,
	},
	UNKNOWN: {
		particles: 20, // Default to balanced
		targetFPS: 30,
		enableCursorEffects: false,
		enableSmoothScroll: false,
	},
};

/**
 * Performance budget type
 */
export interface PerformanceBudget {
	// Core Web Vitals
	maxLCP: number;
	maxFID: number;
	maxCLS: number;

	// Loading metrics
	maxFCP: number;
	maxTTI: number;
	maxTBT: number;

	// Animation performance
	minFPS: number;
	maxCPU: number;
	maxMemory: number;

	// Resource budgets
	maxTotalSize: number;
	maxCriticalSize: number;

	// Lighthouse scores
	minLighthouseMobile: number;
	minLighthouseDesktop: number;
}

/**
 * Performance budgets from contracts/performance-budgets.md
 */
export const PERFORMANCE_CONFIG = {
	budget: {
		// Core Web Vitals
		maxLCP: 2500, // ms
		maxFID: 100, // ms
		maxCLS: 0.1,

		// Loading metrics
		maxFCP: 2000, // ms
		maxTTI: 3500, // ms
		maxTBT: 300, // ms

		// Animation performance
		minFPS: 30,
		maxCPU: 40, // percentage
		maxMemory: 100, // MB

		// Resource budgets
		maxTotalSize: 500, // KB
		maxCriticalSize: 200, // KB

		// Lighthouse scores
		minLighthouseMobile: 85,
		minLighthouseDesktop: 95,
	} as PerformanceBudget,

	// Device tier thresholds (used by device-tier.ts)
	deviceTierThresholds: {
		highEnd: {
			minCores: 8,
			minMemoryGB: 8,
		},
		midRange: {
			minCores: 4,
			minMemoryGB: 4,
		},
	},
};

/**
 * Get device configuration for a specific tier
 */
export function getDeviceConfig(tier: DeviceTierLevel): DeviceTierConfig {
	return DEVICE_TIER_CONFIGS[tier];
}

