/**
 * Neural Network Animation
 * Feature: 003-1507-architecture-globale
 *
 * Canvas 2D-based particle system for hero section.
 * Features adaptive performance, device tier detection, and accessibility support.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	FrameRateMonitor,
	getNeuralNodeCount,
	getTargetFPS,
	NEURAL_NETWORK_DEFAULTS,
	prefersReducedMotion,
} from "./animation-config";

gsap.registerPlugin(ScrollTrigger);

interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	opacity: number;
	radius: number;
}

interface Edge {
	from: Node;
	to: Node;
	pulse: number;
}

export interface NeuralNetworkOptions {
	nodeCount?: number;
	connectionDistance?: number;
	colors?: {
		nodes: string;
		edges: string;
		pulses: string;
	};
}

export class NeuralNetworkAnimation {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private nodes: Node[] = [];
	private edges: Edge[] = [];
	private animationId: number | null = null;
	private lastTime = 0;
	private nodeCount: number;
	private connectionDistance: number;
	private colors: {
		nodes: string;
		edges: string;
		pulses: string;
	};
	private targetFPS: number;
	private frameMonitor: FrameRateMonitor;
	private isReducedMotion: boolean;
	private scrollTrigger: ScrollTrigger | null = null;

	constructor(canvas: HTMLCanvasElement, options: NeuralNetworkOptions = {}) {
		this.canvas = canvas;
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Canvas 2D context not available");
		}
		this.ctx = context;

		this.isReducedMotion = prefersReducedMotion();
		this.nodeCount = options.nodeCount ?? getNeuralNodeCount();
		this.connectionDistance =
			options.connectionDistance ?? NEURAL_NETWORK_DEFAULTS.CONNECTION_DISTANCE;
		this.colors = options.colors ?? {
			nodes: NEURAL_NETWORK_DEFAULTS.COLORS.NODES,
			edges: NEURAL_NETWORK_DEFAULTS.COLORS.EDGES,
			pulses: NEURAL_NETWORK_DEFAULTS.COLORS.PULSES,
		};
		this.targetFPS = getTargetFPS();
		this.frameMonitor = new FrameRateMonitor();

		this.setupCanvas();
		this.initNodes(this.nodeCount);
		this.setupScrollTrigger();

		console.log(
			`[NeuralNetwork] Initialized with ${this.nodeCount} nodes, target ${this.targetFPS}fps`,
		);
	}

	private setupCanvas(): void {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const rect = this.canvas.getBoundingClientRect();

		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;
		this.canvas.style.width = `${rect.width}px`;
		this.canvas.style.height = `${rect.height}px`;

		this.ctx.scale(dpr, dpr);

		// Handle resize
		window.addEventListener("resize", () => this.handleResize());
	}

	private handleResize(): void {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const rect = this.canvas.getBoundingClientRect();

		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;
		this.canvas.style.width = `${rect.width}px`;
		this.canvas.style.height = `${rect.height}px`;

		this.ctx.scale(dpr, dpr);

		// Reposition nodes within new bounds
		const width = rect.width;
		const height = rect.height;

		for (const node of this.nodes) {
			if (node.x > width) node.x = width;
			if (node.y > height) node.y = height;
		}
	}

	private initNodes(count: number): void {
		const width = this.canvas.width / window.devicePixelRatio;
		const height = this.canvas.height / window.devicePixelRatio;

		for (let i = 0; i < count; i++) {
			this.nodes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.2, // Reduced velocity for calmer movement
				vy: (Math.random() - 0.5) * 0.2,
				opacity: 1, // Start fully visible - no fade animation
				radius: NEURAL_NETWORK_DEFAULTS.NODE_RADIUS,
			});
		}
	}

	private setupScrollTrigger(): void {
		// Start immediately, don't wait for scroll
		this.start();
	}

	private updateNodes(): void {
		const width = this.canvas.width / window.devicePixelRatio;
		const height = this.canvas.height / window.devicePixelRatio;

		for (const node of this.nodes) {
			if (!this.isReducedMotion) {
				// Update position
				node.x += node.vx;
				node.y += node.vy;

				// Bounce off edges
				if (node.x <= 0 || node.x >= width) {
					node.vx *= -1;
					node.x = Math.max(0, Math.min(width, node.x));
				}
				if (node.y <= 0 || node.y >= height) {
					node.vy *= -1;
					node.y = Math.max(0, Math.min(height, node.y));
				}
			}
		}
	}

	private detectEdges(): void {
		this.edges = [];

		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = i + 1; j < this.nodes.length; j++) {
				const nodeA = this.nodes[i];
				const nodeB = this.nodes[j];

				const dx = nodeA.x - nodeB.x;
				const dy = nodeA.y - nodeB.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < this.connectionDistance) {
					this.edges.push({
						from: nodeA,
						to: nodeB,
						pulse: Math.random(),
					});
				}
			}
		}
	}

	private drawNodes(): void {
		const nodeColor = this.getComputedColor(this.colors.nodes);

		for (const node of this.nodes) {
			this.ctx.beginPath();
			this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
			this.ctx.fillStyle = `rgba(${nodeColor}, ${node.opacity})`;
			this.ctx.fill();
		}
	}

	private drawEdges(): void {
		const edgeColor = this.getComputedColor(this.colors.edges);

		for (const edge of this.edges) {
			const dx = edge.to.x - edge.from.x;
			const dy = edge.to.y - edge.from.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const opacity = Math.min(
				edge.from.opacity,
				edge.to.opacity,
				1 - distance / this.connectionDistance,
			);

			this.ctx.beginPath();
			this.ctx.moveTo(edge.from.x, edge.from.y);
			this.ctx.lineTo(edge.to.x, edge.to.y);
			this.ctx.strokeStyle = `rgba(${edgeColor}, ${opacity * 0.3})`;
			this.ctx.lineWidth = NEURAL_NETWORK_DEFAULTS.EDGE_WIDTH;
			this.ctx.stroke();

			// Draw pulse
			if (!this.isReducedMotion) {
				edge.pulse += NEURAL_NETWORK_DEFAULTS.PULSE_SPEED;
				if (edge.pulse > 1) edge.pulse = 0;

				const pulseX = edge.from.x + dx * edge.pulse;
				const pulseY = edge.from.y + dy * edge.pulse;

				const pulseColor = this.getComputedColor(this.colors.pulses);
				this.ctx.beginPath();
				this.ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
				this.ctx.fillStyle = `rgba(${pulseColor}, ${opacity})`;
				this.ctx.fill();
			}
		}
	}

	private animate(currentTime: number): void {
		const deltaTime = currentTime - this.lastTime;
		this.lastTime = currentTime;

		// FPS throttling
		const targetFrameTime = 1000 / this.targetFPS;
		if (deltaTime < targetFrameTime * 0.9) {
			this.animationId = requestAnimationFrame((t) => this.animate(t));
			return;
		}

		// Record frame for monitoring
		this.frameMonitor.recordFrame();

		// Check for performance degradation
		if (this.frameMonitor.shouldDegrade() && this.nodes.length > 20) {
			console.warn(
				"[NeuralNetwork] Performance degradation detected - reducing nodes",
			);
			this.nodes = this.nodes.slice(0, Math.floor(this.nodes.length * 0.7));
		}

		const width = this.canvas.width / window.devicePixelRatio;
		const height = this.canvas.height / window.devicePixelRatio;

		// Clear canvas
		this.ctx.clearRect(0, 0, width, height);

		// Update and draw
		this.updateNodes();
		this.detectEdges();
		this.drawEdges();
		this.drawNodes();

		this.animationId = requestAnimationFrame((t) => this.animate(t));
	}

	/**
	 * Get RGB values from CSS custom property
	 */
	private getComputedColor(cssVar: string): string {
		if (typeof window === "undefined") return "203, 166, 247";

		const value = getComputedStyle(document.documentElement)
			.getPropertyValue(cssVar)
			.trim();

		// If it's a hex color, convert to RGB
		if (value.startsWith("#")) {
			const hex = value.slice(1);
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			return `${r}, ${g}, ${b}`;
		}

		// If it's already RGB, extract numbers
		const rgb = value.match(/\d+/g);
		if (rgb) {
			return rgb.slice(0, 3).join(", ");
		}

		// Fallback to primary violet
		return "203, 166, 247";
	}

	start(): void {
		if (!this.animationId) {
			this.lastTime = performance.now();
			this.animate(this.lastTime);
			console.log("[NeuralNetwork] Started");
		}
	}

	pause(): void {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
			console.log("[NeuralNetwork] Paused");
		}
	}

	destroy(): void {
		this.pause();
		if (this.scrollTrigger) {
			this.scrollTrigger.kill();
		}
		window.removeEventListener("resize", () => this.handleResize());
		console.log("[NeuralNetwork] Destroyed");
	}
}
