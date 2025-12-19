# Research: Experience Pro

**Feature**: PBF-21-experience-pro
**Date**: 2025-12-19
**Status**: Complete

## Research Summary

This document consolidates research findings for implementing the professional experience timeline section and skills data updates for the portfolio.

---

## 1. Timeline UI Pattern

### Decision: Vertical Timeline with Alternating Layout (Desktop) / Stacked (Mobile)

### Rationale
- **CV reference alignment**: The CV shows a clear chronological list format with company, dates, and descriptions
- **Accessibility**: Vertical timelines are more accessible than horizontal ones (better screen reader support, no scroll hijacking)
- **Responsive**: Stacked layout on mobile maintains readability without complex transformations
- **Performance**: CSS-only base layout with GSAP for scroll-triggered fade-ins

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| Horizontal timeline | Visual impact, unique | Poor mobile experience, scroll hijacking, accessibility issues | Violates accessibility principles |
| Card grid | Simple, responsive | Doesn't convey chronology clearly | Loses temporal relationship |
| Accordion/collapsible | Space efficient | Requires interaction to see content | Important info should be immediately visible |

### Implementation Pattern

```
Desktop (≥1024px):
[Date]----●----[Content Card]
          |
[Content Card]----●----[Date]
          |
[Date]----●----[Content Card]

Mobile (<1024px):
●----[Date]
|    [Content Card]
|
●----[Date]
|    [Content Card]
```

### Key Technical Decisions
- Timeline line: CSS `::before` pseudo-element on container
- Timeline dots: CSS `::before` on each entry with absolute positioning
- Alternating: CSS `nth-child(odd/even)` for left/right alignment
- Animation: GSAP ScrollTrigger for staggered fade-in (respects `prefers-reduced-motion`)

---

## 2. Experience Data Structure

### Decision: JSON Data File with TypeScript Interface

### Rationale
- **Consistency**: Matches existing `skills.json` pattern
- **Type safety**: TypeScript interfaces catch errors at build time
- **Separation**: Data externalized from component for maintainability
- **SEO**: JSON-LD structured data can be generated from same source

### Data Schema

```typescript
interface Experience {
  id: string;                    // Unique identifier (e.g., "cdc-2023")
  role: string;                  // Job title
  company: string;               // Company name
  location: string;              // City
  startDate: string;             // ISO 8601 date or "YYYY"
  endDate: string | null;        // null for current position
  description: string;           // Role description
  achievements: string[];        // Key accomplishments
  technologies: string[];        // Skill IDs (links to skills.json)
  type: "full-time" | "contract" | "freelance";
}
```

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| Astro Content Collections | Built-in validation, MDX support | Overkill for 5 entries, different pattern from skills.json | Inconsistency with existing data approach |
| Inline data in component | Simple, no external file | Hard to maintain, no type safety, cluttered component | Poor maintainability |
| CMS/headless | Dynamic updates | Requires build on content change, deployment overhead | Static site principle violated |

---

## 3. Skills Data Update Strategy

### Decision: Direct JSON Modification + Build-Time Filtering

### Rationale
- **Performance**: Filtering at build time produces optimal static output
- **Simplicity**: No runtime JavaScript needed for filtering
- **Data integrity**: Single source of truth in skills.json

### Update Rules

Based on CV analysis (career start: 2010, 14 years total):

1. **yearsExperience recalculation**: Based on actual technology usage periods
2. **proficiencyLevel filter**: Display only skills with `proficiencyLevel >= 2`
3. **Consolidated skills**: Remove duplicates (REST/RESTful, Spring variants)

### Skills to Update (from CV badges)

| Skill | Current Years | Updated Years | Rationale |
|-------|---------------|---------------|-----------|
| Angular | 5 | 10 | Used since 2014 (CV shows Angular 9-17) |
| JavaScript | 8 | 14 | Career-long skill |
| TypeScript | 5 | 8 | Used since ~2017 |
| Java | 5 | 14 | Career-long backend |
| Spring Boot | 5 | 8 | Used since ~2017 |
| PostgreSQL | 5 | 10 | Used since ~2015 |
| Docker | 4 | 6 | Used since ~2019 |
| Kubernetes | 2 | 4 | Used since ~2021 |
| Git | 8 | 12 | Used since ~2013 |

### Skills to Remove (proficiencyLevel < 2)

All skills with `proficiencyLevel: 0` or `proficiencyLevel: 1`:
- Bootstrap, PL-SQL, WebStorm, GitLab (level 0)
- Apache Kafka, Spring Data, Spring REST, Java 17 (level 0)
- Architecture skills with level 0 (keep if level >= 2)
- Clojure, Go, Haskell, Micronaut, Quarkus, Rust, Scala, SolidJS (level 1)
- Mobile Kotlin (level 1)

### Filtering Implementation

```typescript
// In ExpertiseMatrix.astro frontmatter
const filteredSkills = skillsData.skills.filter(
  (skill) => skill.proficiencyLevel >= 2
);
```

---

## 4. Navigation Integration

### Decision: Insert Experience as Section 3, Shift Subsequent Sections

### Rationale
- **Logical flow**: Hero → About → Experience → Projects → Expertise → Contact
- **CV alignment**: Experience immediately follows About (personal intro)
- **Minimal disruption**: Only requires order number updates

### Navigation Order Changes

| Section | Current Order | New Order |
|---------|---------------|-----------|
| Hero | 1 | 1 |
| About | 2 | 2 |
| Experience | - | **3 (NEW)** |
| Projects | 3 | 4 |
| Expertise | 4 | 5 |
| Contact | 5 | 6 |

### Files to Update
- `src/data/navigation.ts`: Add Experience link, update orders
- `src/data/sections.ts`: Add Experience section config, update orders
- `src/pages/index.astro`: Insert Experience section between About and Projects

---

## 5. Animation Strategy

### Decision: GSAP ScrollTrigger with Staggered Entry Animations

### Rationale
- **Consistency**: Matches existing ExpertiseMatrix animation pattern
- **Performance**: GPU-accelerated transforms (opacity, translateY)
- **Accessibility**: Respects `prefers-reduced-motion` media query

### Animation Specification

```javascript
// Entry animation
gsap.fromTo(entry,
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: entry,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  }
);

// Timeline line draw animation (optional enhancement)
gsap.fromTo(timelineLine,
  { scaleY: 0 },
  {
    scaleY: 1,
    duration: 1,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: container,
      start: "top 60%",
      end: "bottom 80%",
      scrub: 1
    }
  }
);
```

### Reduced Motion Fallback
```css
@media (prefers-reduced-motion: reduce) {
  .experience__entry {
    opacity: 1;
    transform: none;
  }
}
```

---

## 6. Responsive Breakpoints

### Decision: Follow Existing Portfolio Breakpoints

### Rationale
- **Consistency**: Matches existing sections (ExpertiseMatrix, Hero)
- **Tested**: Already validated across device types

### Breakpoints

| Breakpoint | Layout | Timeline Style |
|------------|--------|----------------|
| ≥1024px | Desktop | Alternating left/right |
| 768px-1023px | Tablet | Stacked, centered line |
| <768px | Mobile | Stacked, left-aligned line |

---

## 7. Accessibility Considerations

### Decision: Semantic HTML + ARIA Enhancement

### Semantic Structure
```html
<section id="experience" role="region" aria-label="Professional Experience">
  <h2>Experience</h2>
  <ol class="experience__timeline" aria-label="Career timeline">
    <li class="experience__entry">
      <article>
        <header>
          <h3>{role} at {company}</h3>
          <time datetime="2023">{date range}</time>
        </header>
        <p>{description}</p>
        <ul class="experience__technologies" aria-label="Technologies used">
          <li>{tech}</li>
        </ul>
      </article>
    </li>
  </ol>
</section>
```

### Key Decisions
- `<ol>` for ordered/chronological list (semantic meaning)
- `<article>` for each experience (self-contained content)
- `<time datetime="">` for machine-readable dates
- Technology tags as `<ul>` (unordered, no hierarchy implied)
- Focus indicators using existing `--color-primary` outline

---

## Research Complete

All clarifications resolved. Ready for Phase 1: Design & Contracts.
