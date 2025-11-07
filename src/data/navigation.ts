/**
 * Navigation Links Configuration
 *
 * Centralized navigation structure for the portfolio.
 * Used by BurgerMenu and other navigation components.
 */

export interface NavigationLink {
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

export const navigationLinks: NavigationLink[] = [
	{
		id: "home",
		text: "Home",
		path: "/",
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
		path: "/about",
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
		path: "/projects",
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
		path: "/expertise",
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
		path: "/contact",
		ariaLabel: "Get in touch with me",
		displayOrder: 6,
		neuralPathwayConfig: {
			nodeCount: 8,
			color: "var(--color-primary)",
			animationDuration: 0.8,
		},
	},
];
