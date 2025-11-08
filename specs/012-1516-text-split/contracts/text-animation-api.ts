/**
 * Text Animation API Contract
 *
 * This file defines the TypeScript interfaces and types for the text split
 * animation system. It serves as the contract between the utility implementation
 * and its consumers (Astro components, integration tests).
 *
 * @module text-animation-api
 * @version 1.0.0
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Text splitting granularity options.
 *
 * - `char`: Split by individual characters (for headlines, short text)
 * - `word`: Split by whitespace-separated words (for titles, medium text)
 * - `line`: Split by visual line breaks (for paragraphs, long text)
 */
export type SplitType = 'char' | 'word' | 'line';

/**
 * Valid GSAP easing function names.
 *
 * Common easing functions supported by GSAP. This is not exhaustive but
 * covers the most commonly used options. See GSAP docs for full list:
 * https://greensock.com/docs/v3/Eases
 */
export type EasingFunction =
  | 'power1.out' | 'power1.in' | 'power1.inOut'
  | 'power2.out' | 'power2.in' | 'power2.inOut'
  | 'power3.out' | 'power3.in' | 'power3.inOut'
  | 'power4.out' | 'power4.in' | 'power4.inOut'
  | 'back.out' | 'back.in' | 'back.inOut'
  | 'elastic.out' | 'elastic.in' | 'elastic.inOut'
  | 'bounce.out' | 'bounce.in' | 'bounce.inOut'
  | 'circ.out' | 'circ.in' | 'circ.inOut'
  | 'expo.out' | 'expo.in' | 'expo.inOut'
  | 'sine.out' | 'sine.in' | 'sine.inOut'
  | string; // Allow custom easing strings

// ============================================================================
// Configuration Interfaces
// ============================================================================

/**
 * Animation configuration derived from HTML data attributes.
 *
 * This interface represents the parsed and validated configuration for a
 * single animated text element. Values are extracted from data-* attributes
 * and validated against acceptable ranges.
 *
 * @example
 * ```html
 * <h1
 *   data-split-text="char"
 *   data-split-duration="0.8"
 *   data-split-delay="0.1"
 *   data-split-easing="power2.out"
 * >
 *   Animated Headline
 * </h1>
 * ```
 *
 * Becomes:
 * ```typescript
 * {
 *   type: 'char',
 *   duration: 0.8,
 *   delay: 0.1,
 *   easing: 'power2.out'
 * }
 * ```
 */
export interface AnimationConfig {
  /**
   * Text splitting type (character, word, or line).
   *
   * @required
   */
  type: SplitType;

  /**
   * Duration of animation for each individual fragment (in seconds).
   *
   * @default 0.6
   * @range 0.1 to 5.0 seconds
   */
  duration: number;

  /**
   * Stagger delay between consecutive fragments (in seconds).
   *
   * @default 0.05 for char/word, 0.1 for line
   * @range 0.01 to 1.0 seconds
   */
  delay: number;

  /**
   * GSAP easing function name.
   *
   * @default 'power3.out'
   * @see https://greensock.com/docs/v3/Eases
   */
  easing: EasingFunction;
}

/**
 * Default animation configuration values.
 *
 * Used as fallback when data attributes are missing or invalid.
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
// Entity Interfaces
// ============================================================================

/**
 * Represents a single split text fragment (character/word/line).
 *
 * Each fragment is wrapped in a <span> element and animated individually
 * as part of a GSAP stagger animation.
 */
export interface SplitFragment {
  /**
   * DOM span element wrapping this fragment.
   */
  element: HTMLSpanElement;

  /**
   * Original text content before wrapping.
   */
  originalText: string;

  /**
   * Zero-indexed position in the sequence of fragments.
   *
   * Used for stagger calculations and debugging.
   */
  index: number;
}

/**
 * Represents an animated text element being tracked by the system.
 *
 * This is the primary entity managing the lifecycle of a text animation,
 * from initialization through cleanup.
 */
export interface AnimatedTextElement {
  /**
   * Original DOM element with data-split-text attribute.
   */
  element: HTMLElement;

  /**
   * Parsed and validated animation configuration.
   */
  config: AnimationConfig;

  /**
   * Array of split text fragments (characters/words/lines).
   */
  fragments: SplitFragment[];

  /**
   * GSAP timeline animating the fragments.
   *
   * Null before animation starts, Timeline instance during/after animation.
   */
  timeline: gsap.core.Timeline | null;

  /**
   * IntersectionObserver instance watching this element.
   *
   * Null after animation triggers (observer disconnected).
   */
  observer: IntersectionObserver | null;

  /**
   * Has this element's animation been triggered?
   *
   * Used to prevent repeat animations (trigger once only).
   */
  animated: boolean;
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Initialize text animations for all elements with data-split-text attribute.
 *
 * This function should be called once on page load (typically in an Astro
 * component's <script> tag with client:visible or client:idle directive).
 *
 * @example
 * ```astro
 * <script>
 *   import { initTextAnimations } from '@/scripts/text-animations';
 *   initTextAnimations();
 * </script>
 * ```
 *
 * @returns void
 */
export function initTextAnimations(): void;

/**
 * Clean up all text animations on page navigation.
 *
 * Kills GSAP timelines, disconnects IntersectionObservers, removes event
 * listeners, and clears global state. Should be called on Astro page
 * transitions (astro:before-swap event).
 *
 * @example
 * ```typescript
 * document.addEventListener('astro:before-swap', cleanupTextAnimations);
 * ```
 *
 * @returns void
 */
export function cleanupTextAnimations(): void;

// ============================================================================
// Internal Utility Functions (not exported in implementation)
// ============================================================================

/**
 * Parse animation configuration from element's data attributes.
 *
 * @param element - DOM element with data-split-text attribute
 * @returns Validated AnimationConfig object
 *
 * @internal
 */
declare function parseConfig(element: HTMLElement): AnimationConfig;

/**
 * Split element's text content into character/word/line fragments.
 *
 * @param element - DOM element containing text to split
 * @param type - Split type (char, word, line)
 * @returns Array of SplitFragment objects
 *
 * @internal
 */
declare function splitText(element: HTMLElement, type: SplitType): SplitFragment[];

/**
 * Create GSAP animation timeline for split fragments.
 *
 * @param fragments - Array of fragments to animate
 * @param config - Animation configuration
 * @returns GSAP Timeline instance
 *
 * @internal
 */
declare function createTimeline(
  fragments: SplitFragment[],
  config: AnimationConfig
): gsap.core.Timeline;

/**
 * Create IntersectionObserver to trigger animations on viewport entry.
 *
 * @param callback - Function called when element enters viewport
 * @returns IntersectionObserver instance
 *
 * @internal
 */
declare function createObserver(
  callback: (element: HTMLElement) => void
): IntersectionObserver;

/**
 * Check if user prefers reduced motion.
 *
 * @returns true if prefers-reduced-motion: reduce is set
 *
 * @internal
 */
declare function prefersReducedMotion(): boolean;

// ============================================================================
// Data Attribute Schema
// ============================================================================

/**
 * HTML data attribute schema for text animations.
 *
 * These attributes control animation behavior when added to HTML elements.
 *
 * @example
 * ```html
 * <!-- Minimal usage (all defaults) -->
 * <h1 data-split-text="char">Hello</h1>
 *
 * <!-- Full customization -->
 * <h1
 *   data-split-text="word"
 *   data-split-duration="0.8"
 *   data-split-delay="0.1"
 *   data-split-easing="power2.out"
 * >
 *   Custom Animation
 * </h1>
 *
 * <!-- Line-based split for paragraphs -->
 * <p data-split-text="line" data-split-delay="0.15">
 *   Multi-line paragraph reveals line by line as user scrolls.
 *   Each line fades in with a 150ms stagger delay.
 * </p>
 * ```
 */
export interface DataAttributeSchema {
  /**
   * Split type (required).
   *
   * @attribute data-split-text
   * @values "char" | "word" | "line"
   * @required
   */
  'data-split-text': SplitType;

  /**
   * Animation duration in seconds (optional).
   *
   * @attribute data-split-duration
   * @type number (as string, e.g., "0.8")
   * @default "0.6"
   * @range "0.1" to "5.0"
   */
  'data-split-duration'?: string;

  /**
   * Stagger delay in seconds (optional).
   *
   * @attribute data-split-delay
   * @type number (as string, e.g., "0.1")
   * @default "0.05" (char/word) or "0.1" (line)
   * @range "0.01" to "1.0"
   */
  'data-split-delay'?: string;

  /**
   * GSAP easing function name (optional).
   *
   * @attribute data-split-easing
   * @type string (GSAP easing name)
   * @default "power3.out"
   * @see https://greensock.com/docs/v3/Eases
   */
  'data-split-easing'?: EasingFunction;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error codes for text animation failures.
 */
export enum TextAnimationError {
  /** Element has no text content */
  EMPTY_TEXT = 'EMPTY_TEXT',

  /** Invalid split type attribute value */
  INVALID_SPLIT_TYPE = 'INVALID_SPLIT_TYPE',

  /** Configuration value out of valid range */
  INVALID_CONFIG = 'INVALID_CONFIG',

  /** Too many fragments (performance limit exceeded) */
  TOO_MANY_FRAGMENTS = 'TOO_MANY_FRAGMENTS',

  /** GSAP not available */
  GSAP_NOT_FOUND = 'GSAP_NOT_FOUND',

  /** IntersectionObserver not supported */
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
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid SplitType.
 *
 * @param value - Value to check
 * @returns true if value is 'char', 'word', or 'line'
 */
export function isSplitType(value: unknown): value is SplitType {
  return value === 'char' || value === 'word' || value === 'line';
}

/**
 * Type guard to check if a number is within a valid range.
 *
 * @param value - Number to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns true if value is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max;
}
