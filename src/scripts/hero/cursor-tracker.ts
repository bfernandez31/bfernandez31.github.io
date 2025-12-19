/**
 * Cursor Tracker
 * Feature: PBF-28-rework-the-first
 *
 * Tracks cursor position and applies parallax effect to hero layers.
 * Uses GSAP quickTo for 60fps smooth animations.
 * Automatically disabled on touch devices.
 */

import { gsap } from "gsap";
import type {
	ICursorTracker,
	ParallaxLayerConfig,
	NormalizedPosition,
	QuickSetter,
} from "./types";

export class CursorTracker implements ICursorTracker {
	enabled = false;
	position: NormalizedPosition = { x: 0, y: 0 };

	private layers: ParallaxLayerConfig[] = [];
	private quickSetters: Map<string, QuickSetter> = new Map();
	private updateCallbacks: Set<(pos: NormalizedPosition) => void> = new Set();
	private boundHandleMove: (e: MouseEvent) => void;
	private isTouchDevice = false;

	constructor() {
		this.boundHandleMove = this.handleMouseMove.bind(this);
		// Detect touch device
		this.isTouchDevice = !window.matchMedia("(hover: hover)").matches;
	}

	init(layers: ParallaxLayerConfig[]): void {
		// Don't initialize on touch devices
		if (this.isTouchDevice) {
			return;
		}

		this.layers = layers;

		// Create GSAP quickTo setters for each layer element
		for (const layer of layers) {
			const elements = document.querySelectorAll(layer.selector);
			if (elements.length === 0) continue;

			const duration = layer.duration ?? 0.6;
			const ease = layer.ease ?? "power3.out";

			// Create quickTo for smooth 60fps updates
			this.quickSetters.set(layer.selector, {
				x: gsap.quickTo(layer.selector, "x", { duration, ease }),
				y: gsap.quickTo(layer.selector, "y", { duration, ease }),
			});
		}
	}

	enable(): void {
		if (this.enabled || this.isTouchDevice) return;
		this.enabled = true;
		window.addEventListener("mousemove", this.boundHandleMove, {
			passive: true,
		});
	}

	disable(): void {
		if (!this.enabled) return;
		this.enabled = false;
		window.removeEventListener("mousemove", this.boundHandleMove);

		// Reset positions to center
		this.position = { x: 0, y: 0 };
		for (const setter of this.quickSetters.values()) {
			setter.x(0);
			setter.y(0);
		}
		for (const callback of this.updateCallbacks) {
			callback(this.position);
		}
	}

	onUpdate(callback: (position: NormalizedPosition) => void): () => void {
		this.updateCallbacks.add(callback);
		return () => this.updateCallbacks.delete(callback);
	}

	destroy(): void {
		this.disable();
		this.quickSetters.clear();
		this.updateCallbacks.clear();
		this.layers = [];
	}

	private handleMouseMove(e: MouseEvent): void {
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		// Normalize to -1 to 1 range (0 = center)
		this.position = {
			x: (e.clientX - centerX) / centerX,
			y: (e.clientY - centerY) / centerY,
		};

		// Update CSS transform layers via GSAP quickTo
		for (const layer of this.layers) {
			const setter = this.quickSetters.get(layer.selector);
			if (setter) {
				const offset = layer.factor * 100;
				setter.x(this.position.x * offset);
				setter.y(this.position.y * offset);
			}
		}

		// Notify callbacks (for WebGL parallax)
		for (const callback of this.updateCallbacks) {
			callback(this.position);
		}
	}
}
