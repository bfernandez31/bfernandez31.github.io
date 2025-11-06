import { defineCollection, z } from "astro:content";

/**
 * Content Collections Configuration
 *
 * This file defines the schema for content collections used in the portfolio.
 * Collections provide type-safe, validated content management for blog posts,
 * projects, case studies, and other structured content.
 *
 * Example collections (ready for future implementation):
 * - blog: Blog posts and articles
 * - projects: Portfolio projects and case studies
 * - testimonials: Client testimonials and reviews
 */

// Example: Blog collection schema (commented out until needed)
// const blog = defineCollection({
//   type: 'content',
//   schema: z.object({
//     title: z.string(),
//     description: z.string(),
//     pubDate: z.coerce.date(),
//     updatedDate: z.coerce.date().optional(),
//     heroImage: z.string().optional(),
//     tags: z.array(z.string()).optional(),
//   }),
// });

// Example: Projects collection schema (commented out until needed)
// const projects = defineCollection({
//   type: 'content',
//   schema: z.object({
//     title: z.string(),
//     description: z.string(),
//     heroImage: z.string(),
//     technologies: z.array(z.string()),
//     liveUrl: z.string().url().optional(),
//     githubUrl: z.string().url().optional(),
//     featured: z.boolean().default(false),
//     order: z.number().optional(),
//   }),
// });

// Export collections (currently empty, ready for future additions)
export const collections = {
	// blog,
	// projects,
};
