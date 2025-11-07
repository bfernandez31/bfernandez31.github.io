/**
 * Device Tier Detection
 *
 * Client-side classification of device capabilities based on CPU cores,
 * memory, and connection speed. Used to adaptively configure animation
 * quality and resource usage.
 *
 * Algorithm from: specs/011-1522-fix-project/contracts/device-tiers.md
 */

export type DeviceTierLevel = "HIGH" | "MID" | "LOW" | "UNKNOWN";

export interface DeviceTierResult {
	tier: DeviceTierLevel;
	reasons: string[];
	capabilities: {
		cores: number | undefined;
		memoryGB: number | undefined;
		connection: string | undefined;
	};
}

/**
 * Detect device tier based on browser APIs
 *
 * Classification criteria:
 * - HIGH: 8+ cores OR 8GB+ RAM OR (4+ cores AND 4GB+ RAM)
 * - MID: 4+ cores OR 4GB+ RAM (but not HIGH criteria)
 * - LOW: <4 cores AND <4GB RAM, OR mid-range on slow connection
 * - UNKNOWN: APIs unavailable (defaults to MID behavior)
 *
 * @returns DeviceTierResult with tier, reasons, and detected capabilities
 */
export function detectDeviceTier(): DeviceTierResult {
	const reasons: string[] = [];

	// Detect CPU cores
	const cores = navigator.hardwareConcurrency;

	// Detect memory (only available in Chrome/Edge)
	// @ts-expect-error - deviceMemory is not in all TypeScript definitions
	const memoryGB = navigator.deviceMemory as number | undefined;

	// Detect connection speed (only available in Chrome/Edge)
	// @ts-expect-error - connection is experimental API
	const connection =
		navigator.connection ||
		navigator.mozConnection ||
		navigator.webkitConnection;
	const effectiveType = connection?.effectiveType;

	const capabilities = {
		cores,
		memoryGB,
		connection: effectiveType,
	};

	// If no APIs available, return UNKNOWN (defaults to mid-range behavior)
	if (cores === undefined && memoryGB === undefined) {
		reasons.push(
			"Device APIs unavailable (privacy browser or unsupported browser)",
		);
		return {
			tier: "UNKNOWN",
			reasons,
			capabilities,
		};
	}

	// HIGH-END CLASSIFICATION
	// Criteria: 8+ cores OR 8GB+ RAM OR (4+ cores AND 4GB+ RAM)

	if (cores !== undefined && cores >= 8) {
		reasons.push(`CPU cores ≥ 8 (${cores} cores detected)`);
		return {
			tier: "HIGH",
			reasons,
			capabilities,
		};
	}

	if (memoryGB !== undefined && memoryGB >= 8) {
		reasons.push(`Memory ≥ 8GB (${memoryGB}GB detected)`);
		return {
			tier: "HIGH",
			reasons,
			capabilities,
		};
	}

	if (
		cores !== undefined &&
		cores >= 4 &&
		memoryGB !== undefined &&
		memoryGB >= 4
	) {
		reasons.push(
			`CPU cores ≥ 4 AND Memory ≥ 4GB (${cores} cores, ${memoryGB}GB detected)`,
		);
		return {
			tier: "HIGH",
			reasons,
			capabilities,
		};
	}

	// MID-RANGE CLASSIFICATION
	// Criteria: 4+ cores OR 4GB+ RAM (but not high-end)
	// Connection modifier: Downgrade to LOW if on slow connection

	const isMidRangeHardware =
		(cores !== undefined && cores >= 4) ||
		(memoryGB !== undefined && memoryGB >= 4);

	if (isMidRangeHardware) {
		// Check for slow connection (downgrade to LOW)
		const slowConnections = ["slow-2g", "2g", "3g"];
		if (effectiveType && slowConnections.includes(effectiveType)) {
			reasons.push(`Mid-range hardware but slow connection (${effectiveType})`);
			reasons.push(`Downgraded to LOW tier for better performance`);
			return {
				tier: "LOW",
				reasons,
				capabilities,
			};
		}

		// Mid-range with acceptable connection
		if (cores !== undefined && cores >= 4) {
			reasons.push(`CPU cores ≥ 4 (${cores} cores detected)`);
		}
		if (memoryGB !== undefined && memoryGB >= 4) {
			reasons.push(`Memory ≥ 4GB (${memoryGB}GB detected)`);
		}

		return {
			tier: "MID",
			reasons,
			capabilities,
		};
	}

	// LOW-END CLASSIFICATION
	// Criteria: <4 cores AND <4GB RAM

	reasons.push(`Low-end hardware detected`);
	if (cores !== undefined) {
		reasons.push(`CPU cores < 4 (${cores} cores detected)`);
	}
	if (memoryGB !== undefined) {
		reasons.push(`Memory < 4GB (${memoryGB}GB detected)`);
	}
	if (cores === undefined) {
		reasons.push(`CPU cores unavailable, defaulting to LOW tier`);
	}
	if (memoryGB === undefined) {
		reasons.push(`Memory unavailable, defaulting to LOW tier`);
	}

	return {
		tier: "LOW",
		reasons,
		capabilities,
	};
}
