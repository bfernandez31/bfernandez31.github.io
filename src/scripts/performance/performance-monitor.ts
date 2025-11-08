/**
 * Performance Monitor
 *
 * Real-time monitoring of Core Web Vitals, FPS, and memory usage
 * for performance budgets validation and debugging.
 */

import type { PerformanceBudget } from "../../config/performance";

interface PerformanceMetrics {
	// Core Web Vitals
	lcp: number | null;
	fid: number | null;
	cls: number | null;
	fcp: number | null;
	ttfb: number | null;

	// Animation Performance
	currentFPS: number;
	averageFPS: number;
	minFPS: number;
	maxFPS: number;
	frameDropCount: number;

	// Resource Usage (Chrome-only)
	heapSize: number | null;
	heapLimit: number | null;

	// Page Load
	domContentLoaded: number;
	loadComplete: number;

	// Violations
	budgetViolations: Array<{
		metric: string;
		value: number;
		threshold: number;
		timestamp: number;
	}>;
}

interface BudgetViolation {
	metric: string;
	value: number;
	threshold: number;
	timestamp: number;
}

class PerformanceMonitor {
	private metrics: PerformanceMetrics = {
		lcp: null,
		fid: null,
		cls: null,
		fcp: null,
		ttfb: null,
		currentFPS: 0,
		averageFPS: 0,
		minFPS: 60,
		maxFPS: 0,
		frameDropCount: 0,
		heapSize: null,
		heapLimit: null,
		domContentLoaded: 0,
		loadComplete: 0,
		budgetViolations: [],
	};

	private frameTimes: number[] = [];
	private lastFrameTime = performance.now();
	private animationFrameId: number | null = null;
	private observer: PerformanceObserver | null = null;
	private isMonitoring = false;

	/**
	 * Start monitoring performance metrics
	 */
	startMonitoring(): void {
		if (this.isMonitoring) {
			console.warn("Performance monitor already running");
			return;
		}

		this.isMonitoring = true;
		console.log("[Performance Monitor] Starting...");

		// Monitor Core Web Vitals using PerformanceObserver
		this.initCoreWebVitalsMonitoring();

		// Monitor FPS using requestAnimationFrame
		this.measureFPS();

		// Monitor memory usage (Chrome-only)
		this.measureMemory();

		// Monitor page load events
		this.monitorPageLoad();
	}

	/**
	 * Stop monitoring and cleanup
	 */
	stopMonitoring(): void {
		if (!this.isMonitoring) return;

		this.isMonitoring = false;
		this.observer?.disconnect();

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		console.log("[Performance Monitor] Stopped");
	}

	/**
	 * Initialize Core Web Vitals monitoring using PerformanceObserver API
	 */
	private initCoreWebVitalsMonitoring(): void {
		if (!("PerformanceObserver" in window)) {
			console.warn("[Performance Monitor] PerformanceObserver not supported");
			return;
		}

		try {
			// Monitor LCP (Largest Contentful Paint)
			const lcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1] as PerformanceEntry;
				this.metrics.lcp = lastEntry.startTime;
			});
			lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

			// Monitor FCP (First Contentful Paint)
			const fcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				for (const entry of entries) {
					if (entry.name === "first-contentful-paint") {
						this.metrics.fcp = entry.startTime;
					}
				}
			});
			fcpObserver.observe({ entryTypes: ["paint"] });

			// Monitor CLS (Cumulative Layout Shift)
			let clsValue = 0;
			const clsObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					// Only count layout shifts without recent user input
					if (!(entry as any).hadRecentInput) {
						clsValue += (entry as any).value;
						this.metrics.cls = clsValue;
					}
				}
			});
			clsObserver.observe({ entryTypes: ["layout-shift"] });

			// Monitor FID (First Input Delay) - requires user interaction
			const fidObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const firstInput = entries[0] as PerformanceEventTiming;
				this.metrics.fid = firstInput.processingStart - firstInput.startTime;
			});
			fidObserver.observe({ entryTypes: ["first-input"] });

			// Navigation timing for TTFB
			const navigationObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				for (const entry of entries) {
					const navEntry = entry as PerformanceNavigationTiming;
					this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
				}
			});
			navigationObserver.observe({ entryTypes: ["navigation"] });

			this.observer = lcpObserver; // Store one observer for cleanup

			console.log(
				"[Performance Monitor] Core Web Vitals monitoring initialized",
			);
		} catch (error) {
			console.error(
				"[Performance Monitor] Failed to initialize Core Web Vitals monitoring:",
				error,
			);
		}
	}

	/**
	 * Measure FPS using requestAnimationFrame
	 */
	private measureFPS = (): void => {
		if (!this.isMonitoring) return;

		const now = performance.now();
		const delta = now - this.lastFrameTime;

		// Update frame times rolling window (last 60 frames)
		this.frameTimes.push(delta);
		if (this.frameTimes.length > 60) {
			this.frameTimes.shift();
		}

		// Calculate current and average FPS
		const avgDelta =
			this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
		const currentFPS = Math.min(60, Math.round(1000 / delta));
		const averageFPS = Math.min(60, Math.round(1000 / avgDelta));

		this.metrics.currentFPS = currentFPS;
		this.metrics.averageFPS = averageFPS;

		// Track min/max FPS
		if (currentFPS > 0) {
			this.metrics.minFPS = Math.min(this.metrics.minFPS, currentFPS);
			this.metrics.maxFPS = Math.max(this.metrics.maxFPS, currentFPS);
		}

		// Count frame drops (below 30fps threshold)
		if (currentFPS < 30) {
			this.metrics.frameDropCount++;
		}

		this.lastFrameTime = now;
		this.animationFrameId = requestAnimationFrame(this.measureFPS);
	};

	/**
	 * Measure memory usage (Chrome-only via performance.memory API)
	 */
	private measureMemory(): void {
		// Chrome-only API
		const perf = performance as any;
		if (!perf.memory) {
			console.log(
				"[Performance Monitor] Memory API not available (Chrome-only)",
			);
			return;
		}

		// Update memory metrics every 5 seconds
		const updateMemory = () => {
			if (!this.isMonitoring) return;

			const heapSize = Math.round(perf.memory.usedJSHeapSize / 1024 / 1024); // Convert to MB
			const heapLimit = Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024);

			this.metrics.heapSize = heapSize;
			this.metrics.heapLimit = heapLimit;

			setTimeout(updateMemory, 5000);
		};

		updateMemory();
		console.log("[Performance Monitor] Memory monitoring initialized");
	}

	/**
	 * Monitor page load events
	 */
	private monitorPageLoad(): void {
		// DOMContentLoaded
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.metrics.domContentLoaded = performance.now();
			});
		} else {
			this.metrics.domContentLoaded = performance.now();
		}

		// Window load
		if (document.readyState !== "complete") {
			window.addEventListener("load", () => {
				this.metrics.loadComplete = performance.now();
			});
		} else {
			this.metrics.loadComplete = performance.now();
		}
	}

	/**
	 * Check performance metrics against budget thresholds
	 */
	checkBudget(budget: PerformanceBudget): void {
		const violations: BudgetViolation[] = [];

		// Check Core Web Vitals
		if (this.metrics.lcp !== null && this.metrics.lcp > budget.maxLCP) {
			violations.push({
				metric: "LCP",
				value: Math.round(this.metrics.lcp),
				threshold: budget.maxLCP,
				timestamp: Date.now(),
			});
		}

		if (this.metrics.fid !== null && this.metrics.fid > budget.maxFID) {
			violations.push({
				metric: "FID",
				value: Math.round(this.metrics.fid),
				threshold: budget.maxFID,
				timestamp: Date.now(),
			});
		}

		if (this.metrics.cls !== null && this.metrics.cls > budget.maxCLS) {
			violations.push({
				metric: "CLS",
				value: Math.round(this.metrics.cls * 1000) / 1000, // Round to 3 decimals
				threshold: budget.maxCLS,
				timestamp: Date.now(),
			});
		}

		if (this.metrics.fcp !== null && this.metrics.fcp > budget.maxFCP) {
			violations.push({
				metric: "FCP",
				value: Math.round(this.metrics.fcp),
				threshold: budget.maxFCP,
				timestamp: Date.now(),
			});
		}

		// Check FPS
		if (this.metrics.averageFPS < budget.minFPS) {
			violations.push({
				metric: "Average FPS",
				value: this.metrics.averageFPS,
				threshold: budget.minFPS,
				timestamp: Date.now(),
			});
		}

		// Check memory (if available)
		if (
			this.metrics.heapSize !== null &&
			this.metrics.heapSize > budget.maxMemory
		) {
			violations.push({
				metric: "Heap Size",
				value: this.metrics.heapSize,
				threshold: budget.maxMemory,
				timestamp: Date.now(),
			});
		}

		// Store violations (limit to last 100 entries)
		this.metrics.budgetViolations.push(...violations);
		if (this.metrics.budgetViolations.length > 100) {
			this.metrics.budgetViolations = this.metrics.budgetViolations.slice(-100);
		}

		// Log violations to console
		if (violations.length > 0) {
			this.logViolations(violations);
		}
	}

	/**
	 * Log budget violations to console
	 */
	private logViolations(violations: BudgetViolation[]): void {
		console.group("[Performance Monitor] Budget Violations");
		violations.forEach((v) => {
			console.warn(`${v.metric}: ${v.value} exceeds threshold ${v.threshold}`);
		});
		console.groupEnd();
	}

	/**
	 * Log all budget violations to console
	 */
	logAllViolations(): void {
		if (this.metrics.budgetViolations.length === 0) {
			console.log("[Performance Monitor] No budget violations");
			return;
		}

		this.logViolations(this.metrics.budgetViolations);
	}

	/**
	 * Get current metrics snapshot
	 */
	exportMetrics(): PerformanceMetrics {
		return { ...this.metrics };
	}

	/**
	 * Get formatted metrics report
	 */
	getReport(): string {
		const m = this.metrics;
		return `
=== Performance Metrics Report ===

Core Web Vitals:
  LCP: ${m.lcp !== null ? `${Math.round(m.lcp)}ms` : "N/A"}
  FID: ${m.fid !== null ? `${Math.round(m.fid)}ms` : "N/A"}
  CLS: ${m.cls !== null ? m.cls.toFixed(3) : "N/A"}
  FCP: ${m.fcp !== null ? `${Math.round(m.fcp)}ms` : "N/A"}
  TTFB: ${m.ttfb !== null ? `${Math.round(m.ttfb)}ms` : "N/A"}

Animation Performance:
  Current FPS: ${m.currentFPS}
  Average FPS: ${m.averageFPS}
  Min FPS: ${m.minFPS}
  Max FPS: ${m.maxFPS}
  Frame Drops: ${m.frameDropCount}

Memory Usage:
  Heap Size: ${m.heapSize !== null ? `${m.heapSize}MB` : "N/A"}
  Heap Limit: ${m.heapLimit !== null ? `${m.heapLimit}MB` : "N/A"}

Page Load:
  DOMContentLoaded: ${Math.round(m.domContentLoaded)}ms
  Load Complete: ${Math.round(m.loadComplete)}ms

Budget Violations: ${m.budgetViolations.length}
    `;
	}

	/**
	 * Record frame time for FPS calculation (exposed for external animations)
	 */
	recordFrameTime(_frameTime: number): void {
		// This method allows external animations to report frame times
		// Currently FPS is measured internally via rAF, but this provides extension point
	}
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export type for external use
export type { PerformanceMetrics, BudgetViolation };
