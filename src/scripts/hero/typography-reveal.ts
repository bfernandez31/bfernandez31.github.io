/**
 * Typography Reveal Animation
 * Feature: PBF-28-rework-the-first
 *
 * Manages theatrical text reveal animations for hero headline, subheadline, and CTA.
 * Uses GSAP timeline for choreographed entrance sequence.
 */

import { gsap } from "gsap";
import type {
	ITypographyReveal,
	TextElement,
	RevealState,
	TextAnimationConfig,
} from "./types";
import { DEFAULT_TEXT_ANIMATIONS } from "./types";

export class TypographyReveal implements ITypographyReveal {
	timeline: gsap.core.Timeline | null = null;
	state: RevealState = "pending";
	totalDuration = 0;

	private elements: TextElement[] = [];
	private resolvePlay: (() => void) | null = null;

	init(elements: TextElement[]): void {
		this.elements = elements.filter((el) => el.element != null);

		if (this.elements.length === 0) {
			this.state = "complete";
			return;
		}

		// Set initial hidden state for each element
		for (const el of this.elements) {
			const config = this.getConfig(el);
			gsap.set(el.element, {
				opacity: 0,
				y: config.fromY,
				clipPath: config.clipPath ? "inset(100% 0 0 0)" : undefined,
				visibility: "visible", // Ensure element is visible for animation
			});
		}

		// Build GSAP timeline
		this.timeline = gsap.timeline({
			paused: true,
			onComplete: () => {
				this.state = "complete";
				this.resolvePlay?.();
			},
		});

		// Add each element animation to timeline
		for (const el of this.elements) {
			const config = this.getConfig(el);

			const animationProps: gsap.TweenVars = {
				opacity: 1,
				y: 0,
				duration: config.duration,
				ease: config.ease ?? "power3.out",
			};

			// Add clip-path animation if enabled
			if (config.clipPath) {
				animationProps.clipPath = "inset(0% 0 0 0)";
			}

			this.timeline.to(el.element, animationProps, config.delay ?? 0);
		}

		this.totalDuration = this.timeline.duration();
	}

	async play(): Promise<void> {
		if (this.state !== "pending" || !this.timeline) {
			return Promise.resolve();
		}

		this.state = "revealing";

		return new Promise((resolve) => {
			this.resolvePlay = resolve;
			this.timeline?.play();
		});
	}

	skip(): void {
		if (!this.timeline) return;

		// Jump to end immediately
		this.timeline.progress(1);
		this.state = "complete";
		this.resolvePlay?.();
	}

	reset(): void {
		if (!this.timeline) return;

		this.timeline.progress(0).pause();
		this.state = "pending";
		this.resolvePlay = null;
	}

	destroy(): void {
		this.timeline?.kill();
		this.timeline = null;
		this.elements = [];
		this.resolvePlay = null;
	}

	private getConfig(el: TextElement): TextAnimationConfig {
		const defaultConfig = DEFAULT_TEXT_ANIMATIONS[el.type];
		return {
			...defaultConfig,
			...el.animationConfig,
		};
	}
}
