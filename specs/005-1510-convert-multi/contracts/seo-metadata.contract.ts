/**
 * SEO Metadata Contract
 *
 * Defines the interface for SEO metadata and structured data (JSON-LD)
 * for the single-page portfolio.
 *
 * @feature 005-1510-convert-multi
 * @version 1.0.0
 */

/**
 * Page Metadata interface
 * Represents meta tags for SEO and social sharing
 */
export interface PageMetadata {
	/**
	 * Page title
	 * Displayed in browser tab and search results
	 * Recommended: 50-60 characters
	 */
	title: string;

	/**
	 * Meta description
	 * Displayed in search results
	 * Recommended: 150-160 characters
	 */
	description: string;

	/**
	 * Open Graph image URL
	 * Used for social media sharing (Twitter, Facebook, LinkedIn)
	 * Recommended: 1200x630px
	 */
	ogImage: string;

	/**
	 * Canonical URL
	 * Prevents duplicate content issues
	 * For single-page portfolio, should point to root domain
	 */
	canonical: string;

	/**
	 * Keywords (optional)
	 * Comma-separated list of relevant keywords
	 * Note: Less important for modern SEO but can help with internal search
	 */
	keywords?: string;

	/**
	 * Author name (optional)
	 * For portfolio sites, typically the person's name
	 */
	author?: string;

	/**
	 * Twitter card type (optional)
	 * Default: 'summary_large_image'
	 */
	twitterCard?: "summary" | "summary_large_image" | "app" | "player";
}

/**
 * JSON-LD Structured Data interface
 * Based on Schema.org vocabulary
 */
export interface JSONLDStructuredData {
	/**
	 * Schema.org context
	 * Always 'https://schema.org'
	 */
	"@context": "https://schema.org";

	/**
	 * Root type
	 * For portfolio, use 'WebSite'
	 */
	"@type": "WebSite";

	/**
	 * Website name
	 */
	name: string;

	/**
	 * Website URL
	 */
	url: string;

	/**
	 * Website description
	 */
	description: string;

	/**
	 * Main entity (Person)
	 * Represents the portfolio owner
	 */
	mainEntity: PersonEntity;

	/**
	 * Potential actions
	 * Actions users can take on the site
	 */
	potentialAction?: ActionEntity;
}

/**
 * Person Entity interface
 * Represents the portfolio owner in structured data
 */
export interface PersonEntity {
	/**
	 * Entity type
	 */
	"@type": "Person";

	/**
	 * Person's full name
	 */
	name: string;

	/**
	 * Person's URL (typically portfolio URL)
	 */
	url: string;

	/**
	 * Brief description/bio
	 */
	description: string;

	/**
	 * Profile image URL
	 * Recommended: High-resolution, professional photo
	 */
	image: string;

	/**
	 * Job title
	 */
	jobTitle: string;

	/**
	 * Email address
	 */
	email: string;

	/**
	 * Social media profiles
	 * Array of URLs to GitHub, LinkedIn, Twitter, etc.
	 */
	sameAs: string[];

	/**
	 * Skills/expertise (optional)
	 */
	knowsAbout?: string[];

	/**
	 * Work examples (optional)
	 * References to CreativeWork entities
	 */
	hasPart?: CreativeWorkEntity[];
}

/**
 * Creative Work Entity interface
 * Represents projects in the portfolio
 */
export interface CreativeWorkEntity {
	/**
	 * Entity type
	 */
	"@type": "CreativeWork";

	/**
	 * Project name
	 */
	name: string;

	/**
	 * Project description
	 */
	description: string;

	/**
	 * Project URL
	 * Can be a hash fragment (e.g., /#projects) or external URL
	 */
	url: string;

	/**
	 * Project image (optional)
	 */
	image?: string;

	/**
	 * Creator (references the Person entity)
	 */
	creator?: {
		"@type": "Person";
		name: string;
	};

	/**
	 * Date published (optional)
	 */
	datePublished?: string;

	/**
	 * Technologies used (optional)
	 */
	keywords?: string[];
}

/**
 * Action Entity interface
 * Represents actions users can take (e.g., contact)
 */
export interface ActionEntity {
	/**
	 * Action type
	 */
	"@type": "Action";

	/**
	 * Action target URL
	 */
	target: string;

	/**
	 * Action name (optional)
	 */
	name?: string;
}

/**
 * Validation function for PageMetadata
 */
export function validatePageMetadata(metadata: PageMetadata): void {
	if (!metadata.title || metadata.title.trim().length === 0) {
		throw new Error("PageMetadata title is required and must be non-empty");
	}

	if (metadata.title.length > 60) {
		console.warn(
			`PageMetadata title exceeds recommended length (60 chars). Got: ${metadata.title.length}`,
		);
	}

	if (!metadata.description || metadata.description.trim().length === 0) {
		throw new Error(
			"PageMetadata description is required and must be non-empty",
		);
	}

	if (metadata.description.length > 160) {
		console.warn(
			`PageMetadata description exceeds recommended length (160 chars). Got: ${metadata.description.length}`,
		);
	}

	if (!metadata.ogImage || metadata.ogImage.trim().length === 0) {
		throw new Error("PageMetadata ogImage is required and must be non-empty");
	}

	if (!metadata.canonical || metadata.canonical.trim().length === 0) {
		throw new Error("PageMetadata canonical is required and must be non-empty");
	}

	// Validate URL formats
	try {
		new URL(metadata.ogImage, "https://example.com"); // Allow relative URLs
	} catch {
		throw new Error(
			`PageMetadata ogImage must be a valid URL. Got: ${metadata.ogImage}`,
		);
	}

	try {
		new URL(metadata.canonical);
	} catch {
		throw new Error(
			`PageMetadata canonical must be a valid absolute URL. Got: ${metadata.canonical}`,
		);
	}
}

/**
 * Validation function for JSON-LD structured data
 */
export function validateJSONLDStructuredData(data: JSONLDStructuredData): void {
	if (data["@context"] !== "https://schema.org") {
		throw new Error('JSON-LD @context must be "https://schema.org"');
	}

	if (data["@type"] !== "WebSite") {
		throw new Error('JSON-LD root @type must be "WebSite" for portfolio');
	}

	if (!data.name || data.name.trim().length === 0) {
		throw new Error("JSON-LD name is required and must be non-empty");
	}

	if (!data.url || data.url.trim().length === 0) {
		throw new Error("JSON-LD url is required and must be non-empty");
	}

	try {
		new URL(data.url);
	} catch {
		throw new Error(
			`JSON-LD url must be a valid absolute URL. Got: ${data.url}`,
		);
	}

	if (!data.mainEntity) {
		throw new Error("JSON-LD mainEntity (Person) is required");
	}

	validatePersonEntity(data.mainEntity);
}

/**
 * Validation function for Person entity
 */
export function validatePersonEntity(person: PersonEntity): void {
	if (person["@type"] !== "Person") {
		throw new Error('Person entity @type must be "Person"');
	}

	if (!person.name || person.name.trim().length === 0) {
		throw new Error("Person entity name is required and must be non-empty");
	}

	if (!person.url || person.url.trim().length === 0) {
		throw new Error("Person entity url is required and must be non-empty");
	}

	if (!person.jobTitle || person.jobTitle.trim().length === 0) {
		throw new Error("Person entity jobTitle is required and must be non-empty");
	}

	if (!person.email || person.email.trim().length === 0) {
		throw new Error("Person entity email is required and must be non-empty");
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(person.email)) {
		throw new Error(
			`Person entity email must be a valid email address. Got: ${person.email}`,
		);
	}

	if (!Array.isArray(person.sameAs) || person.sameAs.length === 0) {
		console.warn("Person entity sameAs should include social media URLs");
	}

	// Validate URLs in sameAs
	person.sameAs?.forEach((url, index) => {
		try {
			new URL(url);
		} catch {
			throw new Error(
				`Person entity sameAs[${index}] must be a valid URL. Got: ${url}`,
			);
		}
	});
}

/**
 * Validation function for Creative Work entity
 */
export function validateCreativeWorkEntity(work: CreativeWorkEntity): void {
	if (work["@type"] !== "CreativeWork") {
		throw new Error('CreativeWork entity @type must be "CreativeWork"');
	}

	if (!work.name || work.name.trim().length === 0) {
		throw new Error(
			"CreativeWork entity name is required and must be non-empty",
		);
	}

	if (!work.description || work.description.trim().length === 0) {
		throw new Error(
			"CreativeWork entity description is required and must be non-empty",
		);
	}

	if (!work.url || work.url.trim().length === 0) {
		throw new Error(
			"CreativeWork entity url is required and must be non-empty",
		);
	}
}

/**
 * Example structured data for single-page portfolio
 * This can be used as a template
 */
export const exampleStructuredData: JSONLDStructuredData = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "John Doe Portfolio",
	url: "https://johndoe.com",
	description:
		"Full stack developer portfolio showcasing web development projects and expertise",
	mainEntity: {
		"@type": "Person",
		name: "John Doe",
		url: "https://johndoe.com",
		description:
			"Passionate full stack developer with expertise in modern JavaScript frameworks and performance optimization",
		image: "https://johndoe.com/profile.jpg",
		jobTitle: "Full Stack Developer",
		email: "john@johndoe.com",
		sameAs: [
			"https://github.com/johndoe",
			"https://linkedin.com/in/johndoe",
			"https://twitter.com/johndoe",
		],
		knowsAbout: ["TypeScript", "React", "Node.js", "Astro", "Web Performance"],
		hasPart: [
			{
				"@type": "CreativeWork",
				name: "E-commerce Platform",
				description: "Modern e-commerce platform built with React and Node.js",
				url: "https://johndoe.com/#projects",
				creator: {
					"@type": "Person",
					name: "John Doe",
				},
			},
		],
	},
	potentialAction: {
		"@type": "Action",
		target: "https://johndoe.com/#contact",
		name: "Contact",
	},
};

/**
 * Example page metadata
 * This can be used as a template
 */
export const examplePageMetadata: PageMetadata = {
	title: "John Doe - Full Stack Developer Portfolio",
	description:
		"Portfolio showcasing web development projects, expertise in modern JavaScript frameworks, and contact information.",
	ogImage: "https://johndoe.com/og-image.jpg",
	canonical: "https://johndoe.com/",
	keywords:
		"full stack developer, web development, TypeScript, React, portfolio",
	author: "John Doe",
	twitterCard: "summary_large_image",
};

/**
 * Type exports for TypeScript consumers
 */
export type TwitterCardType = PageMetadata["twitterCard"];
export type SchemaOrgType = JSONLDStructuredData["@type"];
