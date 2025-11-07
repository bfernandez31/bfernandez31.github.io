/**
 * Cursor Trail Effect
 * Feature: 010-title-cursor-trail
 *
 * Adds a luminous particle trail to the custom cursor using Canvas 2D.
 * - Creates fading particles that follow the cursor
 * - Uses requestAnimationFrame for 60fps performance
 * - Respects prefers-reduced-motion preference
 * - Disables on touch devices
 */

import { isTouchDevice, prefersReducedMotion } from "./accessibility";

interface Particle {
	x: number;
	y: number;
	alpha: number;
	size: number;
}

interface CursorTrailState {
	canvas: HTMLCanvasElement | null;
	ctx: CanvasRenderingContext2D | null;
	particles: Particle[];
	animationFrameId: number | null;
	lastMouseX: number;
	lastMouseY: number;
	cleanup: (() => void) | null;
}

const state: CursorTrailState = {
	canvas: null,
	ctx: null,
	particles: [],
	animationFrameId: null,
	lastMouseX: 0,
	lastMouseY: 0,
	cleanup: null,
};

// Configuration
const MAX_PARTICLES = 30;
const PARTICLE_SPAWN_RATE = 2; // Particles per frame
const PARTICLE_INITIAL_SIZE = 6;
const PARTICLE_FADE_SPEED = 0.05;
const PARTICLE_SIZE_DECAY = 0.95;
const PARTICLE_COLOR = "hsl(267 84% 81%)"; // --color-primary (violet)

/**
 * Initialize cursor trail effect
 */
export function initCursorTrail(): void {
	// Don't initialize on touch devices or if user prefers reduced motion
	if (isTouchDevice() || prefersReducedMotion()) {
		return;
	}

	const canvas = document.getElementById(
		"cursor-trail-canvas",
	) as HTMLCanvasElement;
	if (!canvas) {
		console.warn("Cursor trail canvas element not found");
		return;
	}

	state.canvas = canvas;
	state.ctx = canvas.getContext("2d");

	if (!state.ctx) {
		console.warn("Failed to get 2D context for cursor trail");
		return;
	}

	// Set up canvas dimensions to match viewport
	setupCanvasDimensions();

	// Track mouse movement
	const handleMouseMove = (e: MouseEvent) => {
		state.lastMouseX = e.clientX;
		state.lastMouseY = e.clientY;
	};

	document.addEventListener("mousemove", handleMouseMove);

	// Handle window resize
	const handleResize = () => {
		setupCanvasDimensions();
	};

	window.addEventListener("resize", handleResize);

	// Start animation loop
	startAnimation();

	// Store cleanup function
	state.cleanup = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("resize", handleResize);
		stopAnimation();
	};
}

/**
 * Set up canvas dimensions for high-DPI displays
 */
function setupCanvasDimensions(): void {
	if (!state.canvas) return;

	const dpr = window.devicePixelRatio || 1;
	const rect = state.canvas.getBoundingClientRect();

	// Set actual canvas size (accounting for device pixel ratio)
	state.canvas.width = rect.width * dpr;
	state.canvas.height = rect.height * dpr;

	// Scale context to account for device pixel ratio
	if (state.ctx) {
		state.ctx.scale(dpr, dpr);
	}

	// Set display size via CSS (already set in component)
	state.canvas.style.width = `${rect.width}px`;
	state.canvas.style.height = `${rect.height}px`;
}

/**
 * Start the animation loop
 */
function startAnimation(): void {
	if (state.animationFrameId !== null) return;

	const animate = () => {
		updateParticles();
		renderParticles();
		state.animationFrameId = requestAnimationFrame(animate);
	};

	state.animationFrameId = requestAnimationFrame(animate);
}

/**
 * Stop the animation loop
 */
function stopAnimation(): void {
	if (state.animationFrameId !== null) {
		cancelAnimationFrame(state.animationFrameId);
		state.animationFrameId = null;
	}
}

/**
 * Update particles (spawn new, update existing, remove faded)
 */
function updateParticles(): void {
	// Spawn new particles at cursor position
	for (let i = 0; i < PARTICLE_SPAWN_RATE; i++) {
		if (state.particles.length >= MAX_PARTICLES) {
			// Remove oldest particle to make room
			state.particles.shift();
		}

		state.particles.push({
			x: state.lastMouseX,
			y: state.lastMouseY,
			alpha: 1,
			size: PARTICLE_INITIAL_SIZE,
		});
	}

	// Update existing particles
	for (let i = state.particles.length - 1; i >= 0; i--) {
		const particle = state.particles[i];

		// Fade out
		particle.alpha -= PARTICLE_FADE_SPEED;

		// Shrink
		particle.size *= PARTICLE_SIZE_DECAY;

		// Remove if fully faded
		if (particle.alpha <= 0) {
			state.particles.splice(i, 1);
		}
	}
}

/**
 * Render all particles to canvas
 */
function renderParticles(): void {
	if (!state.ctx || !state.canvas) return;

	// Clear canvas
	state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

	// Draw particles
	for (const particle of state.particles) {
		state.ctx.save();

		// Set particle style
		state.ctx.fillStyle = PARTICLE_COLOR;
		state.ctx.globalAlpha = particle.alpha;

		// Draw circle
		state.ctx.beginPath();
		state.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
		state.ctx.fill();

		// Add glow effect
		state.ctx.shadowBlur = 20;
		state.ctx.shadowColor = PARTICLE_COLOR;

		state.ctx.restore();
	}
}

/**
 * Clean up cursor trail (remove listeners, stop animation)
 */
export function cleanupCursorTrail(): void {
	if (state.cleanup) {
		state.cleanup();
	}

	// Clear particles
	state.particles = [];

	// Reset state
	state.canvas = null;
	state.ctx = null;
	state.animationFrameId = null;
	state.lastMouseX = 0;
	state.lastMouseY = 0;
	state.cleanup = null;
}
