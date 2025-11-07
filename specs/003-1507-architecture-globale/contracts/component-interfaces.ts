/**
 * Component Interfaces and Type Contracts
 * Feature: 003-1507-architecture-globale
 *
 * This file defines TypeScript interfaces for all components in the portfolio architecture.
 * Use these contracts to ensure type safety across Astro components and islands.
 */

// ============================================================================
// ANIMATION COMPONENTS
// ============================================================================

/**
 * Neural Network Animation Configuration
 * Used by HeroNeuralNetwork island component
 */
export interface NeuralNetworkConfig {
	/** Canvas element or selector */
	canvas: HTMLCanvasElement | string;

	/** Number of nodes (neurons) in the network */
	nodeCount?: number; // Default: 100 desktop, 50 mobile

	/** Maximum distance for connecting nodes */
	connectionDistance?: number; // Default: 150px

	/** Animation frame rate target */
	targetFPS?: number; // Default: 60 desktop, 30 mobile

	/** Color configuration using CSS custom properties */
	colors: {
		nodes: string; // e.g., 'var(--color-primary)'
		edges: string; // e.g., 'var(--color-accent)'
		pulses: string; // e.g., 'var(--color-secondary)'
	};

	/** Enable/disable specific features */
	features?: {
		enablePulses?: boolean; // Animated pulses along edges
		enableNodeMovement?: boolean; // Nodes drift slowly
		enableMouseInteraction?: boolean; // Nodes react to cursor
	};
}

/**
 * Magnetic Menu Configuration
 * Used by MagneticBurger island component
 */
export interface MagneticMenuConfig {
	/** Activation radius in pixels from element center */
	threshold?: number; // Default: 100px

	/** Attraction strength (0-1, where 1 is strongest) */
	strength?: number; // Default: 0.4

	/** Animation duration in seconds */
	duration?: number; // Default: 0.25s

	/** GSAP easing function */
	ease?: string; // Default: 'power2.out'

	/** Maximum displacement in pixels */
	maxDisplacement?: number; // Default: 15px
}

/**
 * Neural Pathway Link Configuration
 * Used by NeuralPathwayLinks island component
 */
export interface NeuralPathwayConfig {
	/** Number of nodes in the pathway animation */
	nodeCount: number;

	/** Color for the pathway (CSS custom property) */
	color: string;

	/** Animation duration in seconds */
	animationDuration: number;

	/** Link element to animate */
	linkElement?: HTMLElement;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

/**
 * Base Layout Props
 * Used by BaseLayout.astro
 */
export interface BaseLayoutProps {
	/** Page title (appears in browser tab) */
	title: string;

	/** Meta description for SEO */
	description: string;

	/** Open Graph image URL (absolute path) */
	ogImage?: string;

	/** Canonical URL for SEO */
	canonicalUrl?: string;

	/** Prevent search engine indexing */
	noindex?: boolean;

	/** Additional CSS classes for body element */
	bodyClass?: string;
}

/**
 * Page Layout Props
 * Used by PageLayout.astro (wraps page content with consistent header/footer)
 */
export interface PageLayoutProps extends BaseLayoutProps {
	/** Show/hide navigation menu */
	showNav?: boolean; // Default: true

	/** Show/hide footer */
	showFooter?: boolean; // Default: true

	/** Page-specific CSS class for styling */
	pageClass?: string;
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

/**
 * Hero Section Props
 * Used by Hero.astro
 */
export interface HeroProps {
	/** Headline text */
	headline: string;

	/** Subheadline/tagline */
	subheadline?: string;

	/** Call-to-action button configuration */
	cta?: {
		text: string;
		href: string;
		ariaLabel?: string;
	};

	/** Neural network animation configuration */
	neuralNetworkConfig?: Partial<NeuralNetworkConfig>;

	/** Enable/disable scroll indicator */
	showScrollIndicator?: boolean;
}

/**
 * Projects Hexagonal Grid Props
 * Used by ProjectsHexGrid.astro
 */
export interface ProjectsHexGridProps {
	/** Array of project data */
	projects: ProjectCardData[];

	/** Number of items to show initially (lazy load rest) */
	initialCount?: number; // Default: 12

	/** Hexagon size configuration */
	hexagonSize?: {
		mobile: string; // CSS clamp value, e.g., 'clamp(120px, 35vw, 200px)'
		tablet: string;
		desktop: string;
	};
}

/**
 * Project Card Data
 * Used in hexagonal grid tiles
 */
export interface ProjectCardData {
	/** Project slug (from Content Collection) */
	slug: string;

	/** Project title */
	title: string;

	/** Short description (shown on hover/tap) */
	description: string;

	/** Array of technologies */
	technologies: string[];

	/** Preview image path */
	image: string;

	/** Image alt text */
	imageAlt: string;

	/** Link to project detail page or external URL */
	link: string;

	/** Whether this is a featured project */
	featured?: boolean;
}

/**
 * Expertise Matrix Props
 * Used by ExpertiseMatrix.astro
 */
export interface ExpertiseMatrixProps {
	/** Skills organized by category */
	skillsByCategory: {
		categoryId: string;
		categoryName: string;
		skills: SkillData[];
	}[];

	/** Show/hide proficiency level indicators */
	showProficiency?: boolean; // Default: true

	/** Show/hide years of experience */
	showYears?: boolean; // Default: true
}

/**
 * Skill Data
 * Used in expertise matrix
 */
export interface SkillData {
	id: string;
	name: string;
	proficiencyLevel: 1 | 2 | 3 | 4 | 5;
	yearsExperience: number;
	relatedProjects?: string[]; // Project slugs
	icon?: string; // Icon identifier
}

/**
 * Blog Commits List Props
 * Used by BlogCommits.astro
 */
export interface BlogCommitsProps {
	/** Array of blog post data */
	posts: BlogPostCardData[];

	/** Number of posts to show per page */
	postsPerPage?: number; // Default: 10

	/** Enable/disable infinite scroll */
	infiniteScroll?: boolean; // Default: true

	/** Show/hide featured posts section */
	showFeatured?: boolean;
}

/**
 * Blog Post Card Data
 * Used in commit-style list
 */
export interface BlogPostCardData {
	/** Post slug (from Content Collection) */
	slug: string;

	/** Commit-style title */
	title: string;

	/** 7-character commit hash */
	commitHash: string;

	/** Post description */
	description: string;

	/** Publication date */
	publishDate: Date;

	/** Array of tags */
	tags: string[];

	/** Estimated reading time in minutes */
	readingTime?: number;

	/** Whether this is a featured post */
	featured?: boolean;
}

/**
 * Contact Protocol Form Props
 * Used by ContactProtocol.astro
 */
export interface ContactProtocolProps {
	/** Form submission endpoint (Formspree/Netlify) */
	action: string;

	/** Success message to display (terminal-style) */
	successMessage?: string;

	/** Error message to display (terminal-style) */
	errorMessage?: string;

	/** Alternative contact methods */
	contactMethods?: ContactMethod[];
}

/**
 * Contact Method Data
 * Used for alternative contact links
 */
export interface ContactMethod {
	type: "email" | "github" | "linkedin" | "twitter" | "other";
	label: string;
	value: string; // Email address or URL
	icon?: string; // Icon identifier
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Button Props
 * Used by Button.astro
 */
export interface ButtonProps {
	/** Button variant */
	variant?: "primary" | "secondary" | "outline" | "ghost";

	/** Button size */
	size?: "sm" | "md" | "lg";

	/** Button type attribute */
	type?: "button" | "submit" | "reset";

	/** Disabled state */
	disabled?: boolean;

	/** Link behavior (renders as anchor tag) */
	href?: string;

	/** Accessible label */
	ariaLabel?: string;

	/** Additional CSS classes */
	class?: string;
}

/**
 * Card Props
 * Used by Card.astro
 */
export interface CardProps {
	/** Card variant */
	variant?: "default" | "elevated" | "outlined";

	/** Enable/disable hover effect */
	hoverable?: boolean;

	/** Link behavior (wraps content in anchor) */
	href?: string;

	/** Additional CSS classes */
	class?: string;
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

/**
 * Navigation Link Data
 * Used by Header.astro and BurgerMenu.astro
 */
export interface NavigationLinkData {
	id: string;
	text: string;
	path: string;
	ariaLabel?: string;
	displayOrder: number;
	neuralPathwayConfig?: NeuralPathwayConfig;
}

/**
 * Burger Menu Props
 * Used by BurgerMenu.astro
 */
export interface BurgerMenuProps {
	/** Navigation links */
	links: NavigationLinkData[];

	/** Enable/disable magnetic effect */
	enableMagnetic?: boolean; // Default: true

	/** Magnetic effect configuration */
	magneticConfig?: MagneticMenuConfig;

	/** Enable/disable neural pathway animations */
	enableNeuralPathways?: boolean; // Default: true
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * GSAP ScrollTrigger Configuration
 * Shared type for scroll-based animations
 */
export interface ScrollTriggerConfig {
	trigger: string | HTMLElement;
	start: string;
	end: string;
	scrub?: boolean | number;
	pin?: boolean;
	markers?: boolean; // Debug mode
	onEnter?: () => void;
	onLeave?: () => void;
	onEnterBack?: () => void;
	onLeaveBack?: () => void;
}

/**
 * Animation Performance Metrics
 * For monitoring animation performance
 */
export interface AnimationMetrics {
	averageFPS: number;
	frameDrops: number;
	cpuUsage: number; // Percentage
	isThrottled: boolean;
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Contact Form Data
 * Client-side validation schema
 */
export interface ContactFormData {
	name: string;
	email: string;
	message: string;
	honeypot?: string; // Bot detection
}

/**
 * Form Validation Result
 */
export interface ValidationResult {
	valid: boolean;
	errors: {
		field: string;
		message: string;
	}[];
}
