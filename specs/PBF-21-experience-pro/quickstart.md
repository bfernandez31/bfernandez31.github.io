# Quickstart: Experience Pro

**Feature**: PBF-21-experience-pro
**Date**: 2025-12-19

## Overview

This feature adds a professional experience timeline section to the portfolio and updates the skills data for accuracy and filtering.

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and on branch `PBF-21-experience-pro`

## Quick Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

## Implementation Checklist

### 1. Create Experience Data File

Create `src/data/experiences.json` with professional experience entries:

```json
{
  "experiences": [
    {
      "id": "cdc-frontend-2023",
      "role": "Tech Lead Frontend",
      "company": "Caisse des dépôts et consignations",
      "location": "Toulouse",
      "startDate": "2023",
      "endDate": null,
      "description": "Projet MADPS - Développement et TMA de l'application SAU",
      "achievements": ["Migration Angular 13 vers 17"],
      "technologies": ["angular", "typescript", "git", "jenkins"],
      "type": "full-time",
      "displayOrder": 1
    }
    // ... additional entries
  ]
}
```

### 2. Create TypeScript Interface

Create `src/types/experience.ts`:

```typescript
export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  type: "full-time" | "contract" | "freelance" | "mixed";
  displayOrder: number;
}
```

### 3. Create Experience Component

Create `src/components/sections/Experience.astro`:

```astro
---
import experienceData from "../../data/experiences.json";
import type { Experience } from "../../types/experience";

const experiences = experienceData.experiences.sort(
  (a, b) => a.displayOrder - b.displayOrder
);
---

<section class="experience">
  <div class="experience__container">
    <h2 class="experience__title">Expériences</h2>
    <p class="experience__subtitle">Extrait d'expériences professionnelles</p>

    <ol class="experience__timeline">
      {experiences.map((exp) => (
        <li class="experience__entry">
          <article>
            <header class="experience__header">
              <h3 class="experience__role">{exp.role}</h3>
              <span class="experience__company">{exp.company}</span>
              <time class="experience__date">
                {exp.startDate} - {exp.endDate ?? "Présent"}
              </time>
            </header>
            <p class="experience__description">{exp.description}</p>
            <ul class="experience__technologies">
              {exp.technologies.map((tech) => (
                <li class="experience__tech-tag">{tech}</li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>
  </div>
</section>
```

### 4. Update Navigation

Update `src/data/navigation.ts` to add Experience link:

```typescript
// Add to navigationLinks array
{
  href: "#experience",
  targetSectionId: "experience",
  label: "Experience",
  ariaLabel: "Navigate to Experience section",
  ariaCurrent: null,
  isActive: false,
  order: 3, // Insert between About (2) and Projects (4)
}
```

### 5. Update Sections Config

Update `src/data/sections.ts` to add Experience section:

```typescript
{
  id: "experience",
  dataSection: "experience",
  ariaLabel: "Experience section with professional career history",
  ariaRole: "region",
  heading: "Experience",
  headingLevel: 2,
  minHeight: "100dvh",
  order: 3, // Insert between About (2) and Projects (4)
}
```

### 6. Update Index Page

Add Experience section to `src/pages/index.astro` between About and Projects:

```astro
<!-- Experience Section -->
<section
  id="experience"
  data-section="experience"
  class="portfolio-section portfolio-section--experience"
  role="region"
  aria-label="Experience section with professional career history"
>
  <Experience />
</section>
```

### 7. Update Skills Filter

Modify `src/components/sections/ExpertiseMatrix.astro` to filter skills:

```typescript
// Filter skills with proficiency >= 2
const skillsByCategory = categories.map((category) => ({
  ...category,
  skills: skillsData.skills
    .filter((skill) => skill.category === category.id && skill.proficiencyLevel >= 2)
    .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel),
}));
```

### 8. Update Skills Data

Update `src/data/skills.json` yearsExperience values based on CV data (see data-model.md for specific values).

## Validation

```bash
# Run linting
bun run lint

# Build to verify no errors
bun run build

# Run tests
bun test
```

## Key Files

| File | Action |
|------|--------|
| `src/data/experiences.json` | CREATE |
| `src/types/experience.ts` | CREATE |
| `src/components/sections/Experience.astro` | CREATE |
| `src/data/navigation.ts` | MODIFY |
| `src/data/sections.ts` | MODIFY |
| `src/pages/index.astro` | MODIFY |
| `src/components/sections/ExpertiseMatrix.astro` | MODIFY |
| `src/data/skills.json` | MODIFY |

## Testing

After implementation, verify:

1. Experience section displays between About and Projects
2. Timeline shows 5 experience entries in correct order
3. Technology tags display for each experience
4. Skills matrix shows only proficiency >= 2 skills (~25 skills)
5. Navigation works (hash links, keyboard nav, scroll)
6. Animations respect prefers-reduced-motion
7. Mobile layout is stacked and readable
