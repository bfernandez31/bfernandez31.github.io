/**
 * Experience Types
 *
 * TypeScript interfaces for professional work experience entries.
 * Used for displaying career timeline in the Experience section.
 * @feature PBF-21-experience-pro
 */

/**
 * Employment type for experience entries
 */
export type ExperienceType = "full-time" | "contract" | "freelance" | "mixed";

/**
 * Represents a professional work experience entry.
 * Used for displaying career timeline in the Experience section.
 */
export interface Experience {
	/** Unique identifier (e.g., "cdc-frontend-2023") */
	id: string;

	/** Job title/role */
	role: string;

	/** Company or organization name */
	company: string;

	/** Work location (city) */
	location: string;

	/** Start date in ISO 8601 format (YYYY or YYYY-MM) */
	startDate: string;

	/** End date in ISO 8601 format, or null if current position */
	endDate: string | null;

	/** Role description and key responsibilities */
	description: string;

	/** List of key achievements or accomplishments */
	achievements: string[];

	/** Array of skill IDs (references skills.json) */
	technologies: string[];

	/** Employment type */
	type: ExperienceType;

	/** Display order (1 = most recent, higher = older) */
	displayOrder: number;
}

/**
 * Experience data file structure
 */
export interface ExperienceData {
	experiences: Experience[];
}
