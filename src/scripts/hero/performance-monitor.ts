/**
 * Hero Performance Monitor
 * Feature: PBF-28-rework-the-first
 *
 * Monitors frame rate and triggers performance degradation when needed.
 * Implements automatic quality reduction to maintain smooth animation.
 */

import type {
	IHeroPerformanceMonitor,
	PerformanceReport,
	DegradationThresholds,
} from "./types";
import { DEFAULT_DEGRADATION_THRESHOLDS } from "./types";

export class HeroPerformanceMonitor implements IHeroPerformanceMonitor {
	degradationLevel = 0;

	private frameTimes: number[] = [];
	private maxSamples = 30; // 0.5 seconds at 60fps
	private lastFrameTime = 0;
	private isMonitoring = false;
	private thresholds: DegradationThresholds;
	private degradationCallbacks: Set<(level: number) => void> = new Set();
	private checkInterval: ReturnType<typeof setInterval> | null = null;
	private sampleCount = 0;

	constructor(thresholds: DegradationThresholds = DEFAULT_DEGRADATION_THRESHOLDS) {
		this.thresholds = thresholds;
	}

	start(): void {
		if (this.isMonitoring) return;
		this.isMonitoring = true;
		this.lastFrameTime = performance.now();
		this.frameTimes = [];
		this.sampleCount = 0;

		// Check for degradation every 2 seconds
		this.checkInterval = setInterval(() => {
			this.checkDegradation();
		}, 2000);
	}

	stop(): void {
		this.isMonitoring = false;
		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}
	}

	recordFrame(): void {
		if (!this.isMonitoring) return;

		const now = performance.now();
		const frameTime = now - this.lastFrameTime;
		this.lastFrameTime = now;

		// Ignore first frame (can have large delta)
		if (this.sampleCount === 0) {
			this.sampleCount++;
			return;
		}

		this.frameTimes.push(frameTime);
		this.sampleCount++;

		// Keep rolling window
		if (this.frameTimes.length > this.maxSamples) {
			this.frameTimes.shift();
		}
	}

	getReport(): PerformanceReport {
		return {
			averageFPS: this.getAverageFPS(),
			degradationLevel: this.degradationLevel,
			sampleCount: this.sampleCount,
			lastUpdate: performance.now(),
		};
	}

	checkDegradation(): number | null {
		const avgFPS = this.getAverageFPS();
		let newLevel = 0;

		// Determine degradation level based on FPS thresholds
		if (avgFPS < this.thresholds.level3) {
			newLevel = 3; // Critical - switch to CSS fallback
		} else if (avgFPS < this.thresholds.level2) {
			newLevel = 2; // Disable parallax
		} else if (avgFPS < this.thresholds.level1) {
			newLevel = 1; // Reduce shape count
		}

		// Only notify if level changed
		if (newLevel !== this.degradationLevel) {
			this.degradationLevel = newLevel;

			// Notify all callbacks
			for (const callback of this.degradationCallbacks) {
				callback(newLevel);
			}

			return newLevel;
		}

		return null;
	}

	onDegradation(callback: (level: number) => void): () => void {
		this.degradationCallbacks.add(callback);
		return () => this.degradationCallbacks.delete(callback);
	}

	reset(): void {
		this.frameTimes = [];
		this.sampleCount = 0;
		this.degradationLevel = 0;
		this.lastFrameTime = performance.now();
	}

	private getAverageFPS(): number {
		if (this.frameTimes.length < 5) {
			return 60; // Assume good performance until we have enough samples
		}

		const avgFrameTime =
			this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		return Math.round(1000 / avgFrameTime);
	}
}
