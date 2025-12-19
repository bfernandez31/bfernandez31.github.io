# Research: Featured Project - AI-BOARD

**Feature**: PBF-23-featured-project
**Date**: 2025-12-19
**Status**: Complete

## Research Questions

### Q1: Existing Project displayOrder Mapping

**Question**: What are the current displayOrder values for all projects, and how should they be renumbered?

**Findings**:

| File | Current displayOrder | featured | New displayOrder |
|------|---------------------|----------|------------------|
| neural-portfolio.md | 1 | true | 2 |
| ecommerce-platform.md | 2 | true | 3 |
| data-visualization.md | 3 | false | 4 |
| mobile-app.md | 4 | false | 5 |
| saas-platform.md | 5 | true | 6 |
| open-source-library.md | 6 | false | 7 |
| **ai-board.md** | **N/A** | **true** | **1** |

**Decision**: Increment all existing project displayOrder values by 1. AI-BOARD gets displayOrder: 1.

**Rationale**:
- User explicitly wants AI-BOARD as the top featured project
- Zod schema requires positive integers (z.number().int().positive())
- Maintains relative ordering of existing projects
- No gaps in sequence (1-7 continuous)

**Alternatives Considered**:
1. ~~displayOrder: 0~~ - Rejected: Schema requires positive integers
2. ~~Keep existing orders, AI-BOARD at 0.5~~ - Rejected: Schema requires integers

---

### Q2: Content Collection Schema Validation

**Question**: Will the AI-BOARD project entry pass schema validation?

**Schema Definition** (from `src/content/config.ts`):

```typescript
z.object({
  title: z.string(),                                    // Required
  description: z.string(),                              // Required
  technologies: z.array(z.string()),                    // Required
  image: z.string(),                                    // Required
  imageAlt: z.string(),                                 // Required
  externalUrl: z.string().url().optional(),             // Optional
  githubUrl: z.string().url().optional(),               // Optional
  featured: z.boolean().default(false),                 // Optional (default: false)
  displayOrder: z.number().int().positive(),            // Required
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  startDate: z.coerce.date(),                           // Required
  endDate: z.coerce.date().optional(),                  // Optional
  tags: z.array(z.string()).optional(),                 // Optional
})
```

**Proposed AI-BOARD Entry**:

| Field | Value | Valid? |
|-------|-------|--------|
| title | "AI-BOARD" | ✅ |
| description | ~100 chars describing AI-powered project management | ✅ |
| technologies | ["TypeScript", "Claude API", "Astro", "GSAP"] | ✅ |
| image | "/images/projects/ai-board.webp" | ⚠️ Needs asset |
| imageAlt | "AI-BOARD dashboard interface with project boards" | ✅ |
| externalUrl | "https://ai-board-three.vercel.app/" | ✅ |
| githubUrl | (omitted) | ✅ N/A |
| featured | true | ✅ |
| displayOrder | 1 | ✅ |
| status | "completed" | ✅ |
| startDate | 2024-06-01 (estimated) | ✅ |
| endDate | (omitted - ongoing) | ✅ |
| tags | ["ai", "productivity", "automation"] | ✅ |

**Decision**: Entry will pass validation. Image asset required before build succeeds.

**Rationale**: All required fields have valid values. The image path follows existing project image patterns.

---

### Q3: Footer Component Modification

**Question**: What is the exact change needed in Footer.astro?

**Current Implementation** (`src/components/layout/Footer.astro:10-18`):

```astro
<p class="footer__built">
  Built with <a
    href="https://astro.build"
    target="_blank"
    rel="noopener noreferrer">Astro</a
  > and <a href="https://bun.sh" target="_blank" rel="noopener noreferrer"
    >Bun</a
  >
</p>
```

**New Implementation**:

```astro
<p class="footer__built">
  Powered by <a
    href="https://ai-board-three.vercel.app/"
    target="_blank"
    rel="noopener noreferrer">AI-BOARD</a
  >
</p>
```

**Decision**: Direct replacement of the paragraph content. No CSS changes needed.

**Rationale**:
- Existing `.footer__built a` styles handle link colors, hover states, and focus indicators
- Same semantic structure (paragraph with link)
- Same accessibility attributes (target="_blank" with rel="noopener noreferrer")

---

### Q4: Image Asset Requirements

**Question**: What image is needed and what are the specifications?

**Existing Project Image Patterns**:

| Project | Image Path | Format |
|---------|-----------|--------|
| neural-portfolio | /images/projects/neural-portfolio.webp | WebP |
| ecommerce-platform | /images/projects/ecommerce.webp | WebP |
| data-visualization | /images/projects/data-viz.webp | WebP |
| mobile-app | /images/projects/mobile-app.webp | WebP |
| saas-platform | /images/projects/saas.webp | WebP |
| open-source-library | /images/projects/oss-lib.webp | WebP |

**Required for AI-BOARD**:
- **Path**: `/images/projects/ai-board.webp`
- **Format**: WebP (consistent with other projects)
- **Recommended dimensions**: ~800x600px or 16:9 aspect ratio
- **Content**: Screenshot of AI-BOARD interface

**Decision**: Use placeholder image initially. Document requirement for proper screenshot.

**Rationale**:
- Spec Decision 3 notes: "User should provide or approve the image before implementation; placeholder can be used initially"
- Project cannot build without an image at the specified path
- Placeholder allows development to proceed while awaiting final asset

**Options for Placeholder**:
1. Generate a solid color placeholder with WebP encoder
2. Use existing project image temporarily
3. Create simple gradient/pattern image

---

## Summary of Decisions

| Topic | Decision | Risk Level |
|-------|----------|------------|
| displayOrder Strategy | Increment all existing by 1, AI-BOARD gets 1 | Low |
| Schema Compatibility | Full compatibility confirmed | Low |
| Footer Modification | Direct text/link replacement | Low |
| Image Asset | Placeholder initially, real screenshot needed | Medium |

## Open Items

1. **Image Asset**: Final screenshot or approved image for AI-BOARD project card
   - Blocker: Build will fail without valid image at `/images/projects/ai-board.webp`
   - Mitigation: Create placeholder for initial development

2. **AI-BOARD Description**: Exact description text for project card
   - Current assumption: General description of AI-powered project management
   - May need user input for specific marketing copy

3. **Technologies List**: Exact technologies to display on project card
   - Current assumption: ["TypeScript", "Claude API", "Astro", "GSAP"]
   - May need verification of actual tech stack
