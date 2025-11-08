/**
 * Text Split Animation Utility
 *
 * Splits text content by character, word, or line and animates each fragment
 * with GSAP stagger effects. Provides declarative HTML API via data-split-text
 * attributes with automatic viewport-based triggering via IntersectionObserver.
 *
 * @module text-animations
 * @version 1.0.0
 */

import gsap from 'gsap';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Text splitting granularity options.
 */
export type SplitType = 'char' | 'word' | 'line';

/**
 * Valid GSAP easing function names.
 */
export type EasingFunction =
	| 'power1.out'
	| 'power1.in'
	| 'power1.inOut'
	| 'power2.out'
	| 'power2.in'
	| 'power2.inOut'
	| 'power3.out'
	| 'power3.in'
	| 'power3.inOut'
	| 'power4.out'
	| 'power4.in'
	| 'power4.inOut'
	| 'back.out'
	| 'back.in'
	| 'back.inOut'
	| 'elastic.out'
	| 'elastic.in'
	| 'elastic.inOut'
	| 'bounce.out'
	| 'bounce.in'
	| 'bounce.inOut'
	| 'circ.out'
	| 'circ.in'
	| 'circ.inOut'
	| 'expo.out'
	| 'expo.in'
	| 'expo.inOut'
	| 'sine.out'
	| 'sine.in'
	| 'sine.inOut'
	| string;

/**
 * Animation configuration derived from HTML data attributes.
 */
export interface AnimationConfig {
	/** Text splitting type (character, word, or line) */
	type: SplitType;
	/** Duration of animation per fragment (seconds) */
	duration: number;
	/** Stagger delay between fragments (seconds) */
	delay: number;
	/** GSAP easing function name */
	easing: EasingFunction;
}

/**
 * Represents a single split text fragment.
 */
export interface SplitFragment {
	/** DOM span element wrapping this fragment */
	element: HTMLSpanElement;
	/** Original text content before wrapping */
	originalText: string;
	/** Zero-indexed position in sequence */
	index: number;
}

/**
 * Represents an animated text element being tracked.
 */
export interface AnimatedTextElement {
	/** Original DOM element with data-split-text attribute */
	element: HTMLElement;
	/** Parsed and validated animation configuration */
	config: AnimationConfig;
	/** Array of split text fragments */
	fragments: SplitFragment[];
	/** GSAP timeline animating the fragments */
	timeline: gsap.core.Timeline | null;
	/** IntersectionObserver instance watching this element */
	observer: IntersectionObserver | null;
	/** Has this element's animation been triggered? */
	animated: boolean;
}

/**
 * Error codes for text animation failures.
 */
export enum TextAnimationError {
	EMPTY_TEXT = 'EMPTY_TEXT',
	INVALID_SPLIT_TYPE = 'INVALID_SPLIT_TYPE',
	INVALID_CONFIG = 'INVALID_CONFIG',
	TOO_MANY_FRAGMENTS = 'TOO_MANY_FRAGMENTS',
	GSAP_NOT_FOUND = 'GSAP_NOT_FOUND',
	OBSERVER_NOT_SUPPORTED = 'OBSERVER_NOT_SUPPORTED',
}

/**
 * Error messages corresponding to error codes.
 */
export const ERROR_MESSAGES: Record<TextAnimationError, string> = {
	[TextAnimationError.EMPTY_TEXT]:
		'Text animation skipped: element has no text content',
	[TextAnimationError.INVALID_SPLIT_TYPE]:
		'Invalid data-split-text value. Must be "char", "word", or "line"',
	[TextAnimationError.INVALID_CONFIG]:
		'Animation configuration out of valid range, using defaults',
	[TextAnimationError.TOO_MANY_FRAGMENTS]:
		'Too many text fragments (>1000). Use word or line splitting for long content',
	[TextAnimationError.GSAP_NOT_FOUND]:
		'GSAP library not found. Text animations require GSAP 3.13.0+',
	[TextAnimationError.OBSERVER_NOT_SUPPORTED]:
		'IntersectionObserver not supported. Text animations require modern browsers',
};

// ============================================================================
// Constants
// ============================================================================

/**
 * Default animation configuration values.
 */
export const DEFAULT_CONFIG: AnimationConfig = {
	type: 'char',
	duration: 0.6,
	delay: 0.05,
	easing: 'power3.out',
};

/**
 * Configuration validation constraints.
 */
export const CONFIG_CONSTRAINTS = {
	duration: { min: 0.1, max: 5.0 },
	delay: { min: 0.01, max: 1.0 },
	maxFragments: 1000, // Performance limit
	warnFragments: 500, // Warning threshold
} as const;

// ============================================================================
// Global State
// ============================================================================

/** Array of all animated text elements being tracked */
let animatedElements: AnimatedTextElement[] = [];

/** Global IntersectionObserver instance (shared across all elements) */
let globalObserver: IntersectionObserver | null = null;

/** Cached prefers-reduced-motion preference */
let prefersReducedMotion = false;

// ============================================================================
// Internal Utility Functions
// ============================================================================

/**
 * Check if user prefers reduced motion.
 *
 * @returns true if prefers-reduced-motion: reduce is set
 */
function prefersReducedMotionCheck(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Parse animation configuration from element's data attributes.
 *
 * @param element - DOM element with data-split-text attribute
 * @returns Validated AnimationConfig object
 */
function parseConfig(element: HTMLElement): AnimationConfig {
	const type = element.dataset.splitText as SplitType;
	const durationStr = element.dataset.splitDuration;
	const delayStr = element.dataset.splitDelay;
	const easing = element.dataset.splitEasing;

	// Validate split type
	if (!isSplitType(type)) {
		console.error(ERROR_MESSAGES[TextAnimationError.INVALID_SPLIT_TYPE]);
		return DEFAULT_CONFIG;
	}

	// Parse duration with validation
	let duration = durationStr ? Number.parseFloat(durationStr) : DEFAULT_CONFIG.duration;
	if (!isInRange(duration, CONFIG_CONSTRAINTS.duration.min, CONFIG_CONSTRAINTS.duration.max)) {
		console.warn(
			`Invalid duration ${duration}s, using default ${DEFAULT_CONFIG.duration}s`,
		);
		duration = DEFAULT_CONFIG.duration;
	}

	// Parse delay with validation (different defaults for line vs char/word)
	const defaultDelay = type === 'line' ? 0.1 : 0.05;
	let delay = delayStr ? Number.parseFloat(delayStr) : defaultDelay;
	if (!isInRange(delay, CONFIG_CONSTRAINTS.delay.min, CONFIG_CONSTRAINTS.delay.max)) {
		console.warn(`Invalid delay ${delay}s, using default ${defaultDelay}s`);
		delay = defaultDelay;
	}

	return {
		type,
		duration,
		delay,
		easing: (easing as EasingFunction) || DEFAULT_CONFIG.easing,
	};
}

/**
 * Create a single split fragment span element.
 *
 * @param text - Text content for the fragment
 * @param index - Zero-indexed position in sequence
 * @returns SplitFragment object
 */
function createSplitFragment(text: string, index: number): SplitFragment {
	const span = document.createElement('span');
	span.style.display = 'inline-block';
	span.textContent = text;

	return {
		element: span,
		originalText: text,
		index,
	};
}

/**
 * Create IntersectionObserver to trigger animations on viewport entry.
 *
 * @param callback - Function called when element enters viewport
 * @returns IntersectionObserver instance
 */
function createObserver(callback: (element: HTMLElement) => void): IntersectionObserver {
	return new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					callback(entry.target as HTMLElement);
				}
			}
		},
		{
			threshold: 0.5, // Trigger when 50% of element is visible
			rootMargin: '0px',
		},
	);
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Initialize text animations for all elements with data-split-text attribute.
 *
 * This function should be called once on page load.
 */
export function initTextAnimations(): void {
	// Cache reduced motion preference
	prefersReducedMotion = prefersReducedMotionCheck();

	// Query all elements with data-split-text attribute
	const elements = document.querySelectorAll<HTMLElement>('[data-split-text]');

	if (elements.length === 0) {
		return; // No elements to animate
	}

	// Create global observer if needed
	if (!globalObserver) {
		globalObserver = createObserver(animateElement);
	}

	// Process each element
	for (const element of elements) {
		// Skip if already animated
		const existing = animatedElements.find((ae) => ae.element === element);
		if (existing?.animated) {
			continue;
		}

		// Skip if no text content
		const originalText = element.textContent?.trim();
		if (!originalText) {
			console.warn(ERROR_MESSAGES[TextAnimationError.EMPTY_TEXT], element);
			continue;
		}

		// Start observing this element
		globalObserver.observe(element);
	}
}

/**
 * Clean up all text animations on page navigation.
 *
 * Kills GSAP timelines, disconnects IntersectionObservers, removes event
 * listeners, and clears global state.
 */
export function cleanupTextAnimations(): void {
	// Kill all timelines
	for (const animatedElement of animatedElements) {
		if (animatedElement.timeline) {
			animatedElement.timeline.kill();
		}
		if (animatedElement.observer) {
			animatedElement.observer.disconnect();
		}
	}

	// Disconnect global observer
	if (globalObserver) {
		globalObserver.disconnect();
		globalObserver = null;
	}

	// Clear state
	animatedElements = [];
}

/**
 * Split element's text content into fragments based on type.
 *
 * @param element - DOM element containing text to split
 * @param type - Split type (char, word, line)
 * @returns Array of SplitFragment objects
 */
function splitText(element: HTMLElement, type: SplitType): SplitFragment[] {
	const originalText = element.textContent || '';
	const fragments: SplitFragment[] = [];

	if (type === 'char') {
		// Character splitting with Unicode support
		const chars = Array.from(originalText);
		for (let i = 0; i < chars.length; i++) {
			fragments.push(createSplitFragment(chars[i], i));
		}
	} else if (type === 'word') {
		// Word splitting with whitespace preservation
		const words = originalText.split(/(\s+)/);
		for (let i = 0; i < words.length; i++) {
			if (words[i]) {
				// Skip empty strings
				fragments.push(createSplitFragment(words[i], i));
			}
		}
	} else if (type === 'line') {
		// Line splitting using Range.getClientRects()
		const range = document.createRange();
		const textNode = element.firstChild;

		if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
			// Fallback: treat as single line
			fragments.push(createSplitFragment(originalText, 0));
			return fragments;
		}

		// Detect line breaks by checking getBoundingClientRect changes
		let currentLine = '';
		let currentTop = 0;
		let lineIndex = 0;

		for (let i = 0; i < originalText.length; i++) {
			range.setStart(textNode, i);
			range.setEnd(textNode, i + 1);
			const rect = range.getBoundingClientRect();

			if (i === 0) {
				currentTop = rect.top;
				currentLine = originalText[i];
			} else if (rect.top > currentTop) {
				// New line detected
				fragments.push(createSplitFragment(currentLine, lineIndex));
				lineIndex++;
				currentTop = rect.top;
				currentLine = originalText[i];
			} else {
				currentLine += originalText[i];
			}
		}

		// Add last line
		if (currentLine) {
			fragments.push(createSplitFragment(currentLine, lineIndex));
		}
	}

	return fragments;
}

/**
 * Create GSAP animation timeline for split fragments.
 *
 * @param fragments - Array of fragments to animate
 * @param config - Animation configuration
 * @returns GSAP Timeline instance
 */
function createTimeline(fragments: SplitFragment[], config: AnimationConfig): gsap.core.Timeline {
	const timeline = gsap.timeline();

	if (prefersReducedMotion) {
		// Instant reveal for reduced motion
		timeline.set(
			fragments.map((f) => f.element),
			{ opacity: 1, y: 0 },
		);
	} else {
		// Full animation
		timeline.fromTo(
			fragments.map((f) => f.element),
			{
				opacity: 0,
				y: 20, // Start 20px below final position
			},
			{
				opacity: 1,
				y: 0,
				duration: config.duration,
				ease: config.easing,
				stagger: {
					amount: config.delay * fragments.length,
					from: 'start',
				},
			},
		);
	}

	return timeline;
}

/**
 * Animate a single element (called by IntersectionObserver).
 *
 * @param element - DOM element to animate
 */
function animateElement(element: HTMLElement): void {
	// Check if already animated
	const existing = animatedElements.find((ae) => ae.element === element);
	if (existing?.animated) {
		return;
	}

	// Parse configuration
	const config = parseConfig(element);

	// Skip if no text content
	const originalText = element.textContent?.trim();
	if (!originalText) {
		console.warn(ERROR_MESSAGES[TextAnimationError.EMPTY_TEXT], element);
		return;
	}

	// Split text into fragments
	const fragments = splitText(element, config.type);

	// Check fragment count limits
	if (fragments.length > CONFIG_CONSTRAINTS.maxFragments) {
		console.error(ERROR_MESSAGES[TextAnimationError.TOO_MANY_FRAGMENTS], element);
		return;
	}

	if (fragments.length > CONFIG_CONSTRAINTS.warnFragments) {
		console.warn(
			`Performance warning: ${fragments.length} fragments may cause slow animations. Consider using word or line splitting.`,
			element,
		);
	}

	// Create accessibility structure
	// 1. Create visually-hidden span with original text for screen readers
	const srSpan = document.createElement('span');
	srSpan.className = 'sr-only';
	srSpan.textContent = originalText;

	// 2. Create wrapper for animated fragments
	const animatedWrapper = document.createElement('span');
	animatedWrapper.setAttribute('aria-hidden', 'true');

	// 3. Append all fragment spans to wrapper
	for (const fragment of fragments) {
		animatedWrapper.appendChild(fragment.element);
	}

	// 4. Replace element content
	element.textContent = '';
	element.appendChild(srSpan);
	element.appendChild(animatedWrapper);

	// Create animation timeline
	const timeline = createTimeline(fragments, config);

	// Track this element
	const animatedElement: AnimatedTextElement = {
		element,
		config,
		fragments,
		timeline,
		observer: globalObserver,
		animated: true,
	};

	animatedElements.push(animatedElement);

	// Unobserve element (trigger once only)
	if (globalObserver) {
		globalObserver.unobserve(element);
	}
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid SplitType.
 */
export function isSplitType(value: unknown): value is SplitType {
	return value === 'char' || value === 'word' || value === 'line';
}

/**
 * Type guard to check if a number is within a valid range.
 */
export function isInRange(value: number, min: number, max: number): boolean {
	return !Number.isNaN(value) && value >= min && value <= max;
}

// ============================================================================
// Event Listeners
// ============================================================================

// Add cleanup listener for Astro page navigation
if (typeof document !== 'undefined') {
	document.addEventListener('astro:before-swap', cleanupTextAnimations);
}
