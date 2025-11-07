/**
 * Section Type Definitions
 *
 * Based on contracts/section-component.contract.ts
 * @feature 005-1510-convert-multi
 */

export type SectionId = "hero" | "about" | "projects" | "expertise" | "contact";
export type SectionRole = "main" | "region" | "complementary";
export type SectionHeadingLevel = 1 | 2;

export interface SectionProps {
	/**
	 * Unique identifier for the section
	 */
	id: SectionId;

	/**
	 * Data attribute for section identification
	 * Must equal the id value
	 */
	dataSection: string;

	/**
	 * ARIA label for screen reader accessibility
	 */
	ariaLabel: string;

	/**
	 * ARIA landmark role
	 */
	ariaRole: SectionRole;

	/**
	 * Section heading text
	 */
	heading: string;

	/**
	 * Heading level for semantic hierarchy
	 */
	headingLevel: SectionHeadingLevel;

	/**
	 * Minimum height CSS value
	 * Typically '100vh' or '100dvh'
	 */
	minHeight: string;

	/**
	 * Display order (1-5)
	 * Determines the visual order of sections on the page
	 */
	order: number;

	/**
	 * Additional CSS classes for styling
	 */
	className?: string;
}

/**
 * CSS classes for section components
 */
export const sectionCSSClasses = {
	base: "portfolio-section",
	variants: {
		hero: "portfolio-section--hero",
		about: "portfolio-section--about",
		projects: "portfolio-section--projects",
		expertise: "portfolio-section--expertise",
		contact: "portfolio-section--contact",
	},
	states: {
		visible: "portfolio-section--visible",
		active: "portfolio-section--active",
		hidden: "portfolio-section--hidden",
	},
} as const;

/**
 * Validation function for Section props
 */
export function validateSectionProps(props: SectionProps): void {
	const validIds: readonly SectionId[] = [
		"hero",
		"about",
		"projects",
		"expertise",
		"contact",
	];

	if (!validIds.includes(props.id)) {
		throw new Error(
			`Invalid section ID: ${props.id}. Must be one of: ${validIds.join(", ")}`,
		);
	}

	if (props.dataSection !== props.id) {
		throw new Error(
			`dataSection must equal id. Expected: ${props.id}, Got: ${props.dataSection}`,
		);
	}

	if (!props.ariaLabel || props.ariaLabel.trim().length === 0) {
		throw new Error("ariaLabel is required and must be non-empty");
	}

	const validRoles: readonly SectionRole[] = [
		"main",
		"region",
		"complementary",
	];
	if (!validRoles.includes(props.ariaRole)) {
		throw new Error(
			`Invalid ariaRole: ${props.ariaRole}. Must be one of: ${validRoles.join(", ")}`,
		);
	}

	if (!props.heading || props.heading.trim().length === 0) {
		throw new Error("heading is required and must be non-empty");
	}

	if (props.headingLevel !== 1 && props.headingLevel !== 2) {
		throw new Error(`headingLevel must be 1 or 2. Got: ${props.headingLevel}`);
	}

	// Hero section must use h1
	if (props.id === "hero" && props.headingLevel !== 1) {
		throw new Error("Hero section must use headingLevel 1 (h1)");
	}

	// Other sections should use h2
	if (props.id !== "hero" && props.headingLevel !== 2) {
		console.warn(
			`Section ${props.id} should typically use headingLevel 2 (h2)`,
		);
	}
}
