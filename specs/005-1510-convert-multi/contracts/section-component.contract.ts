/**
 * Section Component Contract
 *
 * Defines the interface for all section components used in the single-page portfolio.
 * Each section component must adhere to this contract to ensure consistent behavior
 * and accessibility across the application.
 *
 * @feature 005-1510-convert-multi
 * @version 1.0.0
 */

export interface SectionProps {
  /**
   * Unique identifier for the section
   * Must match one of: 'hero', 'about', 'projects', 'expertise', 'contact'
   */
  id: 'hero' | 'about' | 'projects' | 'expertise' | 'contact';

  /**
   * Data attribute for section identification
   * Must equal the id value (e.g., data-section="hero")
   */
  dataSection: string;

  /**
   * ARIA label for screen reader accessibility
   * Should be descriptive and unique per section
   */
  ariaLabel: string;

  /**
   * ARIA landmark role
   * - 'main': For the primary content section (Hero)
   * - 'region': For other sections
   * - 'complementary': For supporting content
   */
  ariaRole: 'main' | 'region' | 'complementary';

  /**
   * Section heading text
   * Used for semantic HTML structure and SEO
   */
  heading: string;

  /**
   * Heading level for semantic hierarchy
   * - 1: Primary heading (Hero section only)
   * - 2: Secondary headings (all other sections)
   */
  headingLevel: 1 | 2;

  /**
   * Additional CSS classes for styling
   * Optional, allows for section-specific customization
   */
  className?: string;
}

export interface SectionComponentContract {
  /**
   * Render the section with required HTML structure
   *
   * Required HTML structure:
   * <section id={id} data-section={dataSection} role={ariaRole} aria-label={ariaLabel}>
   *   <h1|h2>{heading}</h1|h2>
   *   {content}
   * </section>
   */
  render(props: SectionProps): HTMLElement;

  /**
   * Validate that all required props are provided
   * Throws error if validation fails
   */
  validateProps(props: SectionProps): void;

  /**
   * Get the minimum height CSS value for this section
   * Returns responsive height based on viewport
   */
  getMinHeight(): string;

  /**
   * Check if section should use GPU-accelerated animations
   * Returns false if user has prefers-reduced-motion enabled
   */
  shouldAnimate(): boolean;
}

/**
 * Validation function for Section props
 * Ensures all required fields are present and valid
 */
export function validateSectionProps(props: SectionProps): void {
  const validIds = ['hero', 'about', 'projects', 'expertise', 'contact'] as const;

  if (!validIds.includes(props.id)) {
    throw new Error(`Invalid section ID: ${props.id}. Must be one of: ${validIds.join(', ')}`);
  }

  if (props.dataSection !== props.id) {
    throw new Error(`dataSection must equal id. Expected: ${props.id}, Got: ${props.dataSection}`);
  }

  if (!props.ariaLabel || props.ariaLabel.trim().length === 0) {
    throw new Error('ariaLabel is required and must be non-empty');
  }

  const validRoles = ['main', 'region', 'complementary'] as const;
  if (!validRoles.includes(props.ariaRole)) {
    throw new Error(`Invalid ariaRole: ${props.ariaRole}. Must be one of: ${validRoles.join(', ')}`);
  }

  if (!props.heading || props.heading.trim().length === 0) {
    throw new Error('heading is required and must be non-empty');
  }

  if (props.headingLevel !== 1 && props.headingLevel !== 2) {
    throw new Error(`headingLevel must be 1 or 2. Got: ${props.headingLevel}`);
  }

  // Hero section must use h1
  if (props.id === 'hero' && props.headingLevel !== 1) {
    throw new Error('Hero section must use headingLevel 1 (h1)');
  }

  // Other sections should use h2
  if (props.id !== 'hero' && props.headingLevel !== 2) {
    console.warn(`Section ${props.id} should typically use headingLevel 2 (h2)`);
  }
}

/**
 * CSS styles contract for section components
 * All sections must implement these CSS classes
 */
export const sectionCSSContract = {
  /**
   * Base section class
   * Applied to all <section> elements
   */
  base: 'portfolio-section',

  /**
   * Section-specific classes
   * Applied based on section ID
   */
  variants: {
    hero: 'portfolio-section--hero',
    about: 'portfolio-section--about',
    projects: 'portfolio-section--projects',
    expertise: 'portfolio-section--expertise',
    contact: 'portfolio-section--contact',
  },

  /**
   * State classes
   * Applied dynamically based on IntersectionObserver
   */
  states: {
    visible: 'portfolio-section--visible',
    active: 'portfolio-section--active',
    hidden: 'portfolio-section--hidden',
  },
} as const;

/**
 * Required CSS properties for all section components
 * Must be implemented in component styles
 */
export const requiredCSSProperties = {
  /**
   * Height and spacing
   */
  height: '100vh', // Fallback
  heightModern: '100dvh', // Modern browsers
  minHeight: '100vh', // Prevent content cutoff
  minHeightModern: '100dvh', // Modern browsers

  /**
   * Layout
   */
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

  /**
   * Overflow handling
   */
  overflowX: 'hidden',
  overflowY: 'auto',

  /**
   * Responsive padding
   */
  padding: 'clamp(1rem, 5vh, 3rem) clamp(1rem, 5vw, 2rem)',
} as const;

/**
 * Type export for TypeScript consumers
 */
export type SectionId = SectionProps['id'];
export type SectionRole = SectionProps['ariaRole'];
export type SectionHeadingLevel = SectionProps['headingLevel'];
