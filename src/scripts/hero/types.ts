/**
 * Hero Animation Type Definitions
 * Feature: PBF-28-rework-the-first
 *
 * Re-exports TypeScript contracts for the hero animation system.
 * This file provides a clean import path for hero modules.
 */

// Re-export all types from contracts
export type {
	// Enums & Constants
	HeroState,
	DeviceTier,
	ParallaxLayer,
	ShapeType,
	TextType,
	RevealState,
	// Controller
	HeroControllerOptions,
	IHeroAnimationController,
	// Background 3D
	Vec3,
	ShapeConfig,
	GeometricShape,
	Background3DOptions,
	IBackground3D,
	// Cursor Tracker
	ParallaxLayerConfig,
	QuickSetter,
	NormalizedPosition,
	ICursorTracker,
	// Typography Reveal
	TextAnimationConfig,
	TextElement,
	ITypographyReveal,
	// Performance Monitor
	DegradationThresholds,
	PerformanceReport,
	IHeroPerformanceMonitor,
	// Events
	HeroEvents,
	HeroEventListener,
	// Factory Functions
	CreateHeroController,
	CreateBackground3D,
	CreateCursorTracker,
	CreateTypographyReveal,
} from "../../../specs/PBF-28-rework-the-first/contracts/hero-animation";

// Re-export constants
export {
	DEFAULT_SHAPES_BY_TIER,
	DEFAULT_PARALLAX_FACTORS,
	DEFAULT_TEXT_ANIMATIONS,
	DEFAULT_DEGRADATION_THRESHOLDS,
} from "../../../specs/PBF-28-rework-the-first/contracts/hero-animation";
