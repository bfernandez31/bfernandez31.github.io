/**
 * Navigation Links Configuration
 *
 * Centralized navigation structure for the portfolio.
 * Used by BurgerMenu and other navigation components.
 */

import type { NavigationLink as NavigationLinkType } from "../types/navigation";

// Extended navigation link with animation config
export interface ExtendedNavigationLink {
	id: string;
	text: string;
	path: string;
	ariaLabel?: string;
	displayOrder: number;
	neuralPathwayConfig?: {
		nodeCount: number;
		color: string;
		animationDuration: number;
	};
}

// Legacy navigation links for backward compatibility
export const extendedNavigationLinks: ExtendedNavigationLink[] = [
	{
		id: "home",
		text: "Home",
		path: "/#hero",
		displayOrder: 1,
		neuralPathwayConfig: {
			nodeCount: 5,
			color: "var(--color-primary)",
			animationDuration: 0.6,
		},
	},
	{
		id: "about",
		text: "About",
		path: "/#about",
		ariaLabel: "Learn about my background and experience",
		displayOrder: 2,
		neuralPathwayConfig: {
			nodeCount: 6,
			color: "var(--color-accent)",
			animationDuration: 0.7,
		},
	},
	{
		id: "projects",
		text: "Projects",
		path: "/#projects",
		ariaLabel: "View my portfolio projects",
		displayOrder: 3,
		neuralPathwayConfig: {
			nodeCount: 7,
			color: "var(--color-primary)",
			animationDuration: 0.7,
		},
	},
	{
		id: "expertise",
		text: "Expertise",
		path: "/#expertise",
		ariaLabel: "Explore my technical skills and expertise",
		displayOrder: 4,
		neuralPathwayConfig: {
			nodeCount: 6,
			color: "var(--color-secondary)",
			animationDuration: 0.6,
		},
	},
	{
		id: "blog",
		text: "Blog",
		path: "/blog",
		ariaLabel: "Read my blog posts and articles",
		displayOrder: 5,
		neuralPathwayConfig: {
			nodeCount: 5,
			color: "var(--color-accent)",
			animationDuration: 0.6,
		},
	},
	{
		id: "contact",
		text: "Contact",
		path: "/#contact",
		ariaLabel: "Get in touch with me",
		displayOrder: 6,
		neuralPathwayConfig: {
			nodeCount: 8,
			color: "var(--color-primary)",
			animationDuration: 0.8,
		},
	},
];

// Navigation links for single-page architecture (T010)
// Used by active navigation, history management, and navigation link handlers
export const navigationLinks: NavigationLinkType[] = [
	{
		href: "#hero",
		targetSectionId: "hero",
		label: "Home",
		ariaLabel: "Navigate to Home section",
		ariaCurrent: null,
		isActive: false,
		order: 1,
	},
	{
		href: "#about",
		targetSectionId: "about",
		label: "About",
		ariaLabel: "Navigate to About section",
		ariaCurrent: null,
		isActive: false,
		order: 2,
	},
	{
		href: "#projects",
		targetSectionId: "projects",
		label: "Projects",
		ariaLabel: "Navigate to Projects section",
		ariaCurrent: null,
		isActive: false,
		order: 3,
	},
	{
		href: "#expertise",
		targetSectionId: "expertise",
		label: "Expertise",
		ariaLabel: "Navigate to Expertise section",
		ariaCurrent: null,
		isActive: false,
		order: 4,
	},
	{
		href: "#contact",
		targetSectionId: "contact",
		label: "Contact",
		ariaLabel: "Navigate to Contact section",
		ariaCurrent: null,
		isActive: false,
		order: 5,
	},
];
