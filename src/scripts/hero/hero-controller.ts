/**
 * Hero Animation Controller
 * Feature: PBF-28-rework-the-first
 *
 * Main orchestrator for the award-winning hero section animation.
 * Coordinates background 3D, cursor tracking, and typography reveal subsystems.
 * Handles lifecycle, performance degradation, and accessibility.
 */

import { gsap } from "gsap";
import type {
	HeroControllerOptions,
	IHeroAnimationController,
	HeroState,
	DeviceTier,
	TextElement,
} from "./types";
import { Background3D } from "./background-3d";
import { CursorTracker } from "./cursor-tracker";
import { TypographyReveal } from "./typography-reveal";
import { HeroPerformanceMonitor } from "./performance-monitor";
import { prefersReducedMotion } from "../animation-config";
import { HERO_PARALLAX_CONFIG } from "../../config/performance";

// Global controller reference for cleanup
declare global {
	interface Window {
		__heroController__?: HeroAnimationController;
	}
}

export class HeroAnimationController implements IHeroAnimationController {
	state: HeroState = "IDLE";
	deviceTier: DeviceTier = "MID";
	reducedMotion = false;

	private background: Background3D | null = null;
	private cursor: CursorTracker | null = null;
	private typography: TypographyReveal | null = null;
	private options: HeroControllerOptions | null = null;
	private masterTimeline: gsap.core.Timeline | null = null;
	private heroSection: HTMLElement | null = null;
	private isMobile = false;
	private scrollObserver: IntersectionObserver | null = null;
	private scrollHandler: (() => void) | null = null;
	private lastScrollProgress = 0;
	private performanceMonitor: HeroPerformanceMonitor | null = null;
	private degradationUnsubscribe: (() => void) | null = null;

	async init(options: HeroControllerOptions): Promise<void> {
		this.options = options;
		this.state = "LOADING";

		// Check accessibility preference
		this.reducedMotion = prefersReducedMotion();

		// Detect device tier
		this.deviceTier = options.forceTier ?? this.detectDeviceTier();

		// Detect mobile
		this.isMobile = !window.matchMedia("(hover: hover)").matches;

		// Get hero section element
		this.heroSection = options.canvas.closest(".hero");

		// If reduced motion or skip entrance requested, show content immediately
		if (this.reducedMotion || options.skipEntrance) {
			this.showContentImmediately();
			this.state = "ACTIVE";
			this.heroSection?.classList.add("hero--active");
			options.onEntranceComplete?.();
			return;
		}

		// For LOW tier, skip WebGL entirely
		if (this.deviceTier === "LOW") {
			this.showContentImmediately();
			this.state = "ACTIVE";
			this.heroSection?.classList.add("hero--active");
			options.onEntranceComplete?.();
			return;
		}

		try {
			// Initialize 3D background
			this.background = new Background3D();
			await this.background.init({
				canvas: options.canvas,
				deviceTier: this.deviceTier,
				antialias: this.deviceTier === "HIGH",
				maxPixelRatio: this.deviceTier === "HIGH" ? 2 : 1.5,
			});

			// Initialize cursor tracker (only on desktop with hover)
			if (!this.isMobile) {
				this.cursor = new CursorTracker();
				this.cursor.init([
					{
						selector: ".hero__content",
						factor: HERO_PARALLAX_CONFIG.front * 0.3,
						duration: HERO_PARALLAX_CONFIG.duration,
						ease: HERO_PARALLAX_CONFIG.ease,
					},
				]);

				// Connect cursor to background parallax
				this.cursor.onUpdate((pos) => {
					this.background?.setParallax(pos.x, pos.y);
				});
			}

			// Initialize typography reveal
			this.typography = new TypographyReveal();
			const textElements = this.collectTextElements(options.contentContainer);
			this.typography.init(textElements);

			// Initialize performance monitor (only on MID tier)
			if (this.deviceTier === "MID") {
				this.performanceMonitor = new HeroPerformanceMonitor();
				this.degradationUnsubscribe = this.performanceMonitor.onDegradation(
					(level) => this.handleDegradation(level),
				);
			}

			// Mark hero as active (hides fallback gradient)
			this.heroSection?.classList.add("hero--active");

			// Start entrance animation
			this.state = "ENTRANCE";
			this.playEntrance();
		} catch (error) {
			// Fallback: show content immediately if WebGL fails
			this.showContentImmediately();
			this.state = "ACTIVE";
			this.heroSection?.classList.add("hero--active");
			options.onEntranceComplete?.();
		}
	}

	playEntrance(): void {
		if (this.state !== "ENTRANCE") return;

		this.masterTimeline = gsap.timeline({
			onComplete: () => {
				this.state = "ACTIVE";
				this.options?.onEntranceComplete?.();
			},
		});

		// Canvas fade in
		this.masterTimeline.to(
			".hero__canvas",
			{
				opacity: 1,
				duration: 0.8,
				ease: "power2.out",
			},
			0,
		);

		// Start background animation
		if (this.background) {
			this.masterTimeline.call(() => this.background?.start(), undefined, 0);
		}

		// Typography reveal (starts after slight delay)
		if (this.typography) {
			const typographyInstance = this.typography;
			this.masterTimeline.call(
				() => {
					typographyInstance.play();
				},
				undefined,
				this.isMobile ? 0.3 : 0.5,
			);
		}

		// Enable cursor tracking after entrance
		if (this.cursor) {
			this.masterTimeline.call(() => this.cursor?.enable(), undefined, 1);
		}

		// Start scroll tracking after entrance
		this.masterTimeline.call(() => this.initScrollTracking(), undefined, 1.5);

		// Start performance monitoring after entrance
		if (this.performanceMonitor) {
			this.masterTimeline.call(
				() => this.performanceMonitor?.start(),
				undefined,
				2,
			);
		}
	}

	/**
	 * Handle performance degradation based on level
	 */
	private handleDegradation(level: number): void {
		switch (level) {
			case 1:
				// Level 1: Reduce shape count by 30%
				this.reduceShapeCount();
				break;
			case 2:
				// Level 2: Disable cursor parallax
				this.cursor?.disable();
				break;
			case 3:
				// Level 3: Switch to CSS gradient fallback
				this.switchToFallback();
				break;
		}
	}

	/**
	 * Level 1 degradation: Remove 30% of shapes
	 */
	private reduceShapeCount(): void {
		if (!this.background) return;

		const shapes = [...this.background.shapes];
		const removeCount = Math.ceil(shapes.length * 0.3);

		// Remove shapes from back layer first
		for (let i = 0; i < removeCount && shapes.length > 0; i++) {
			const backShapes = shapes.filter((s) => s.config.layer === "back");
			if (backShapes.length > 0) {
				this.background.removeShape(backShapes[0]);
				shapes.splice(shapes.indexOf(backShapes[0]), 1);
			}
		}
	}

	/**
	 * Level 3 degradation: Switch to CSS fallback
	 */
	private switchToFallback(): void {
		// Stop WebGL animation
		this.background?.stop();

		// Hide canvas, show fallback
		const canvas = this.options?.canvas;
		if (canvas) {
			gsap.to(canvas, { opacity: 0, duration: 0.3 });
		}

		// Remove active class to show fallback gradient
		this.heroSection?.classList.remove("hero--active");
	}

	/**
	 * Initialize scroll progress tracking for parallax fade effect
	 */
	private initScrollTracking(): void {
		if (!this.heroSection || this.reducedMotion) return;

		// Use IntersectionObserver to track hero visibility
		this.scrollObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// Hero is visible, enable scroll handler
						this.enableScrollHandler();
					} else {
						// Hero is not visible, disable scroll handler
						this.disableScrollHandler();
					}
				}
			},
			{ threshold: [0, 0.1, 0.5, 0.9, 1] },
		);

		this.scrollObserver.observe(this.heroSection);
		this.enableScrollHandler();
	}

	/**
	 * Enable scroll-based parallax fade
	 */
	private enableScrollHandler(): void {
		if (this.scrollHandler) return;

		this.scrollHandler = () => {
			this.updateScrollProgress();
		};

		window.addEventListener("scroll", this.scrollHandler, { passive: true });
	}

	/**
	 * Disable scroll handler
	 */
	private disableScrollHandler(): void {
		if (this.scrollHandler) {
			window.removeEventListener("scroll", this.scrollHandler);
			this.scrollHandler = null;
		}
	}

	/**
	 * Update scroll progress and apply parallax fade
	 */
	private updateScrollProgress(): void {
		if (!this.heroSection) return;

		const rect = this.heroSection.getBoundingClientRect();

		// Calculate scroll progress (0 = at top, 1 = fully scrolled past)
		const progress = Math.max(
			0,
			Math.min(1, -rect.top / (rect.height * 0.8)),
		);

		// Only update if progress changed significantly
		if (Math.abs(progress - this.lastScrollProgress) < 0.01) return;
		this.lastScrollProgress = progress;

		// Apply parallax fade to shapes
		if (this.background && progress > 0) {
			// Fade out shapes as we scroll
			const opacity = 1 - progress * 0.8;
			const canvas = this.options?.canvas;
			if (canvas) {
				canvas.style.opacity = String(Math.max(0.2, opacity));
			}
		}

		// Show scroll indicator at 50% scroll through hero
		if (progress > 0.3 && progress < 0.7) {
			this.heroSection.classList.add("hero--scrolled");
		} else {
			this.heroSection.classList.remove("hero--scrolled");
		}

		// Reset hero when scrolling back to top
		if (progress === 0) {
			this.resetHeroState();
		}
	}

	/**
	 * Reset hero to initial active state when scrolling back to top
	 */
	private resetHeroState(): void {
		const canvas = this.options?.canvas;
		if (canvas) {
			gsap.to(canvas, { opacity: 1, duration: 0.3, ease: "power2.out" });
		}
		this.heroSection?.classList.remove("hero--scrolled");
	}

	pause(): void {
		this.background?.stop();
		this.cursor?.disable();
		this.masterTimeline?.pause();
	}

	resume(): void {
		if (this.state === "ACTIVE") {
			this.background?.start();
			this.cursor?.enable();
		}
		if (this.state === "ENTRANCE") {
			this.masterTimeline?.resume();
		}
	}

	destroy(): void {
		this.state = "DESTROYED";

		// Kill master timeline
		this.masterTimeline?.kill();
		this.masterTimeline = null;

		// Stop scroll tracking
		this.disableScrollHandler();
		this.scrollObserver?.disconnect();
		this.scrollObserver = null;

		// Stop performance monitoring
		this.performanceMonitor?.stop();
		this.degradationUnsubscribe?.();
		this.performanceMonitor = null;
		this.degradationUnsubscribe = null;

		// Destroy subsystems
		this.background?.destroy();
		this.cursor?.destroy();
		this.typography?.destroy();

		this.background = null;
		this.cursor = null;
		this.typography = null;

		// Callback
		this.options?.onDestroy?.();

		// Clear global reference
		window.__heroController__ = undefined;
	}

	private showContentImmediately(): void {
		const content = this.options?.contentContainer;
		if (!content) return;

		// Set content visible immediately
		gsap.set(content, { opacity: 1, y: 0 });

		// Set all text elements visible
		const textElements = content.querySelectorAll("[data-hero-text]");
		gsap.set(textElements, {
			opacity: 1,
			y: 0,
			clipPath: "none",
		});
	}

	private collectTextElements(container: HTMLElement): TextElement[] {
		const elements: TextElement[] = [];

		const headline = container.querySelector(
			"[data-hero-text='headline']",
		) as HTMLElement;
		const subheadline = container.querySelector(
			"[data-hero-text='subheadline']",
		) as HTMLElement;
		const cta = container.querySelector(
			"[data-hero-text='cta']",
		) as HTMLElement;

		if (headline) {
			elements.push({ element: headline, type: "headline" });
		}
		if (subheadline) {
			elements.push({ element: subheadline, type: "subheadline" });
		}
		if (cta) {
			elements.push({ element: cta, type: "cta" });
		}

		return elements;
	}

	private detectDeviceTier(): DeviceTier {
		// Check for global device tier (from device-tier.ts)
		const globalTier = (window as { __DEVICE_TIER__?: { tier: DeviceTier } })
			.__DEVICE_TIER__;
		if (globalTier?.tier) {
			return globalTier.tier;
		}

		// Fallback detection
		const cores = navigator.hardwareConcurrency || 4;
		const memory =
			(navigator as { deviceMemory?: number }).deviceMemory || 8;

		if (cores >= 8 && memory >= 8) return "HIGH";
		if (cores >= 4 && memory >= 4) return "MID";
		return "LOW";
	}
}

/**
 * Factory function to initialize hero animation
 * Exposed on window for cleanup from astro:before-swap
 */
export async function initHeroAnimation(
	options: HeroControllerOptions,
): Promise<void> {
	const controller = new HeroAnimationController();
	window.__heroController__ = controller;
	await controller.init(options);
}
