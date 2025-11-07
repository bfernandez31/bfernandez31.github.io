import { defineCollection, z } from "astro:content";

/**
 * Content Collections Configuration
 *
 * This file defines the schema for content collections used in the portfolio.
 * Collections provide type-safe, validated content management for blog posts
 * and projects.
 *
 * Collections:
 * - projects: Portfolio projects with hexagonal grid display
 * - blog: Blog posts with Git commit-style presentation
 */

const projectsCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		image: z.string(),
		imageAlt: z.string(),
		externalUrl: z.string().url().optional(),
		githubUrl: z.string().url().optional(),
		featured: z.boolean().default(false),
		displayOrder: z.number().int().positive(),
		status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
		startDate: z.coerce.date(),
		endDate: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const blogCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		commitHash: z.string().regex(/^[a-f0-9]{7}$/),
		description: z.string(),
		author: z.string().default("Benoit Fernandez"),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()),
		draft: z.boolean().default(false),
		featured: z.boolean().default(false),
		readingTime: z.number().int().positive().optional(),
		coverImage: z.string().optional(),
		coverImageAlt: z.string().optional(),
	}),
});

export const collections = {
	projects: projectsCollection,
	blog: blogCollection,
};
