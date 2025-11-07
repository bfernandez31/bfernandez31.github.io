/**
 * Section Configuration
 *
 * Defines all sections for the single-page portfolio architecture.
 * @feature 005-1510-convert-multi
 */

import type { SectionProps } from '../types/section';

export const sections: SectionProps[] = [
	{
		id: 'hero',
		dataSection: 'hero',
		ariaLabel: 'Hero section with introduction and call to action',
		ariaRole: 'main',
		heading: 'Full Stack Developer & Creative Technologist',
		headingLevel: 1,
	},
	{
		id: 'about',
		dataSection: 'about',
		ariaLabel: 'About section with background and experience',
		ariaRole: 'region',
		heading: 'About',
		headingLevel: 2,
	},
	{
		id: 'projects',
		dataSection: 'projects',
		ariaLabel: 'Projects section showcasing portfolio work',
		ariaRole: 'region',
		heading: 'Projects',
		headingLevel: 2,
	},
	{
		id: 'expertise',
		dataSection: 'expertise',
		ariaLabel: 'Expertise section with technical skills and competencies',
		ariaRole: 'region',
		heading: 'Expertise',
		headingLevel: 2,
	},
	{
		id: 'contact',
		dataSection: 'contact',
		ariaLabel: 'Contact section for inquiries and collaboration',
		ariaRole: 'region',
		heading: 'Contact',
		headingLevel: 2,
	},
];
