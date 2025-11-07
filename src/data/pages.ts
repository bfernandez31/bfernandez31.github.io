/**
 * Page Metadata Configuration
 *
 * Centralized page metadata for SEO and Open Graph tags.
 */

export interface PageMetadata {
	path: string;
	title: string;
	description: string;
	ogImage?: string;
	noindex?: boolean;
	canonicalUrl?: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
	home: {
		path: "/",
		title: "Your Name - Full Stack Developer",
		description:
			"Award-winning full stack developer specializing in modern web technologies, performance optimization, and accessible design.",
		ogImage: "/images/og-images/home.webp",
	},
	about: {
		path: "/about",
		title: "About - Your Name",
		description:
			"Learn about my background, experience, and approach to building exceptional web applications.",
		ogImage: "/images/og-images/about.webp",
	},
	projects: {
		path: "/projects",
		title: "Projects - Your Name",
		description:
			"Explore my portfolio of web development projects, from e-commerce platforms to data visualizations.",
		ogImage: "/images/og-images/projects.webp",
	},
	expertise: {
		path: "/expertise",
		title: "Expertise - Your Name",
		description:
			"Technical skills and competencies across frontend, backend, DevOps, and design.",
		ogImage: "/images/og-images/expertise.webp",
	},
	blog: {
		path: "/blog",
		title: "Blog - Your Name",
		description:
			"Insights on web development, performance optimization, and modern JavaScript frameworks.",
		ogImage: "/images/og-images/blog.webp",
	},
	contact: {
		path: "/contact",
		title: "Contact - Your Name",
		description:
			"Get in touch for project inquiries, collaborations, or just to say hello.",
		ogImage: "/images/og-images/contact.webp",
	},
	404: {
		path: "/404",
		title: "404 - Page Not Found",
		description: "The page you are looking for does not exist.",
		noindex: true,
	},
};
