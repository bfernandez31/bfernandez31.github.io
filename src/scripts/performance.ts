/**
 * Performance Monitoring Utility
 * Feature: 003-1507-architecture-globale
 *
 * Monitors frame rate and provides adaptive performance degradation
 * to maintain smooth animations across all device tiers.
 */

/**
 * Frame rate monitor for adaptive performance
 * Tracks frame times and provides performance metrics
 */
export class FrameRateMonitor {
  private frameTimes: number[] = [];
  private maxSamples = 60;
  private lastFrameTime = performance.now();

  /**
   * Record a frame time sample
   */
  recordFrame(): void {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  /**
   * Get average FPS over the sample period
   */
  getAverageFPS(): number {
    if (this.frameTimes.length === 0) return 60;
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return Math.round(1000 / avgFrameTime);
  }

  /**
   * Check if performance should be degraded
   * Returns true if FPS drops below 80% of target
   */
  shouldDegrade(targetFPS = 60): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS < targetFPS * 0.8; // 20% threshold
  }

  /**
   * Get the 95th percentile frame time for worst-case analysis
   */
  get95thPercentileFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67;

    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index];
  }

  /**
   * Check if any frames exceeded budget (jank detection)
   */
  hasJank(budgetMs = 16.67): boolean {
    return this.frameTimes.some(time => time > budgetMs * 2); // 2x budget = jank
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(targetFPS = 60): number {
    const avgFPS = this.getAverageFPS();
    const score = Math.min(100, Math.max(0, (avgFPS / targetFPS) * 100));
    return Math.round(score);
  }

  /**
   * Reset the monitor
   */
  reset(): void {
    this.frameTimes = [];
    this.lastFrameTime = performance.now();
  }

  /**
   * Get detailed performance metrics
   */
  getMetrics() {
    const avgFPS = this.getAverageFPS();
    const p95FrameTime = this.get95thPercentileFrameTime();
    const hasJank = this.hasJank();

    return {
      averageFPS: avgFPS,
      samples: this.frameTimes.length,
      p95FrameTime: Math.round(p95FrameTime * 100) / 100,
      hasJank,
      recommendation: this.getPerformanceRecommendation(avgFPS)
    };
  }

  /**
   * Get performance recommendation based on current metrics
   */
  private getPerformanceRecommendation(avgFPS: number): string {
    if (avgFPS >= 55) return 'optimal';
    if (avgFPS >= 45) return 'good';
    if (avgFPS >= 30) return 'acceptable';
    if (avgFPS >= 24) return 'degraded';
    return 'critical';
  }
}

/**
 * Singleton instance for global performance monitoring
 */
export const globalFrameRateMonitor = new FrameRateMonitor();

/**
 * Auto-start monitoring in development mode
 */
if (import.meta.env.DEV && typeof window !== 'undefined') {
  let rafId: number;

  const monitorFrame = () => {
    globalFrameRateMonitor.recordFrame();
    rafId = requestAnimationFrame(monitorFrame);
  };

  // Start monitoring
  rafId = requestAnimationFrame(monitorFrame);

  // Log metrics periodically in dev
  setInterval(() => {
    const metrics = globalFrameRateMonitor.getMetrics();
    if (metrics.hasJank || metrics.averageFPS < 50) {
      console.warn('[Performance]', metrics);
    }
  }, 5000);

  // Cleanup on page navigation
  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(rafId);
  });
}