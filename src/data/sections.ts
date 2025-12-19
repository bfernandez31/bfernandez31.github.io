/**
 * Section Configuration
 *
 * Defines all sections for the single-page portfolio architecture.
 * @feature 005-1510-convert-multi
 * @feature PBF-32-portofolio-with-tui (TUI metadata added)
 */

import type { SectionProps, SectionId } from "../types/section";
import type { Section as TuiSection, BufferTab, FileEntry } from "../types/tui";

export const sections: SectionProps[] = [
	{
		id: "hero",
		dataSection: "hero",
		ariaLabel: "Hero section with introduction and call to action",
		ariaRole: "main",
		heading: "Full Stack Developer & Creative Technologist",
		headingLevel: 1,
		minHeight: "100dvh",
		order: 1,
	},
	{
		id: "about",
		dataSection: "about",
		ariaLabel: "About section with background and experience",
		ariaRole: "region",
		heading: "About",
		headingLevel: 2,
		minHeight: "100dvh",
		order: 2,
	},
	{
		id: "experience",
		dataSection: "experience",
		ariaLabel: "Experience section with professional career history",
		ariaRole: "region",
		heading: "Experience",
		headingLevel: 2,
		minHeight: "100dvh",
		order: 3,
	},
	{
		id: "projects",
		dataSection: "projects",
		ariaLabel: "Projects section showcasing portfolio work",
		ariaRole: "region",
		heading: "Projects",
		headingLevel: 2,
		minHeight: "100dvh",
		order: 4,
	},
	{
		id: "expertise",
		dataSection: "expertise",
		ariaLabel: "Expertise section with technical skills and competencies",
		ariaRole: "region",
		heading: "Expertise",
		headingLevel: 2,
		minHeight: "100dvh",
		order: 5,
	},
	{
		id: "contact",
		dataSection: "contact",
		ariaLabel: "Contact section for inquiries and collaboration",
		ariaRole: "region",
		heading: "Contact",
		headingLevel: 2,
		minHeight: "100dvh",
		order: 6,
	},
];

/**
 * TUI Section metadata
 * Maps sections to TUI-specific display properties
 */
export const TUI_SECTIONS: TuiSection[] = [
	{
		id: 'hero',
		displayName: 'Hero',
		fileName: 'hero.tsx',
		icon: '\uf0a2', // Nerd Font file icon
		order: 1,
		styleType: 'typing',
	},
	{
		id: 'about',
		displayName: 'About',
		fileName: 'about.tsx',
		icon: '\uf0a2',
		order: 2,
		styleType: 'readme',
	},
	{
		id: 'experience',
		displayName: 'Experience',
		fileName: 'experience.tsx',
		icon: '\uf0a2',
		order: 3,
		styleType: 'git-log',
	},
	{
		id: 'projects',
		displayName: 'Projects',
		fileName: 'projects.tsx',
		icon: '\uf0a2',
		order: 4,
		styleType: 'telescope',
	},
	{
		id: 'expertise',
		displayName: 'Expertise',
		fileName: 'expertise.tsx',
		icon: '\uf0a2',
		order: 5,
		styleType: 'checkhealth',
	},
	{
		id: 'contact',
		displayName: 'Contact',
		fileName: 'contact.tsx',
		icon: '\uf01ea', // Nerd Font mail icon
		order: 6,
		styleType: 'terminal',
	},
];

/**
 * Get TUI section by ID
 */
export function getTuiSectionById(id: SectionId): TuiSection | undefined {
	return TUI_SECTIONS.find((section) => section.id === id);
}

/**
 * Get all TUI sections sorted by order
 */
export function getSortedTuiSections(): TuiSection[] {
	return [...TUI_SECTIONS].sort((a, b) => a.order - b.order);
}

/**
 * Generate buffer tabs from TUI sections
 */
export function generateBufferTabs(activeSectionId: SectionId): BufferTab[] {
	return TUI_SECTIONS.map((section, index) => ({
		sectionId: section.id,
		label: section.displayName,
		windowNumber: index + 1,
		isActive: section.id === activeSectionId,
	}));
}

/**
 * Generate file entries from TUI sections
 */
export function generateFileEntries(activeSectionId: SectionId): FileEntry[] {
	return TUI_SECTIONS.map((section) => ({
		sectionId: section.id,
		fileName: section.fileName,
		icon: section.icon,
		level: 0 as const,
		isActive: section.id === activeSectionId,
	}));
}
