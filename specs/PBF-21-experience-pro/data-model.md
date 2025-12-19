# Data Model: Experience Pro

**Feature**: PBF-21-experience-pro
**Date**: 2025-12-19
**Status**: Complete

## Entities

### 1. Experience (NEW)

Represents a professional work position in the candidate's career history.

```typescript
// src/types/experience.ts

/**
 * Represents a professional work experience entry.
 * Used for displaying career timeline in the Experience section.
 */
export interface Experience {
  /** Unique identifier (e.g., "cdc-frontend-2023") */
  id: string;

  /** Job title/role */
  role: string;

  /** Company or organization name */
  company: string;

  /** Work location (city) */
  location: string;

  /** Start date in ISO 8601 format (YYYY or YYYY-MM) */
  startDate: string;

  /** End date in ISO 8601 format, or null if current position */
  endDate: string | null;

  /** Role description and key responsibilities */
  description: string;

  /** List of key achievements or accomplishments */
  achievements: string[];

  /** Array of skill IDs (references skills.json) */
  technologies: string[];

  /** Employment type */
  type: ExperienceType;

  /** Display order (1 = most recent, higher = older) */
  displayOrder: number;
}

export type ExperienceType = "full-time" | "contract" | "freelance" | "mixed";

/**
 * Experience data file structure
 */
export interface ExperienceData {
  experiences: Experience[];
}
```

### 2. Skill (EXISTING - Modified)

Existing skill entity with updated `yearsExperience` values.

```typescript
// Already defined in src/types or inferred from skills.json
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiencyLevel: number;  // 0-5 scale
  yearsExperience: number;   // UPDATED VALUES
  relatedProjects: string[];
  icon: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  displayOrder: number;
}

export interface SkillsData {
  categories: SkillCategory[];
  skills: Skill[];
}
```

---

## Entity Relationships

```
┌─────────────────┐         ┌─────────────────┐
│   Experience    │────────>│     Skill       │
├─────────────────┤  1:N    ├─────────────────┤
│ id              │ refs    │ id              │
│ role            │ via     │ name            │
│ company         │ tech-   │ proficiencyLevel│
│ technologies[]  │ nologies│ yearsExperience │
└─────────────────┘         └─────────────────┘
```

**Relationship**: Experience.technologies[] contains Skill.id references
- One Experience can reference many Skills
- One Skill can be referenced by many Experiences
- Loose coupling via string IDs (no strict foreign key)

---

## Validation Rules

### Experience Entity

| Field | Rule | Error Message |
|-------|------|---------------|
| id | Required, unique, kebab-case | "Experience ID must be unique and kebab-case" |
| role | Required, 2-100 chars | "Role must be 2-100 characters" |
| company | Required, 2-100 chars | "Company must be 2-100 characters" |
| location | Required, 2-50 chars | "Location must be 2-50 characters" |
| startDate | Required, ISO 8601 (YYYY or YYYY-MM) | "Start date must be valid ISO 8601" |
| endDate | Optional, ISO 8601 or null | "End date must be valid ISO 8601 or null" |
| description | Required, 10-500 chars | "Description must be 10-500 characters" |
| achievements | Optional, array of strings | "Achievements must be array of strings" |
| technologies | Required, array of valid skill IDs | "Technologies must reference valid skill IDs" |
| type | Required, enum value | "Type must be full-time, contract, freelance, or mixed" |
| displayOrder | Required, positive integer | "Display order must be positive integer" |

### Business Rules

1. **Chronological ordering**: experiences MUST be ordered by displayOrder (1 = most recent)
2. **Current position**: At most one experience can have `endDate: null`
3. **Date consistency**: `startDate <= endDate` when endDate is not null
4. **Technology references**: All IDs in technologies[] SHOULD exist in skills.json (warn if not)

### Skill Entity (Filtering Rules)

| Rule | Implementation |
|------|----------------|
| Display filter | Only show skills where `proficiencyLevel >= 2` |
| Sort order | Sort by `proficiencyLevel` DESC within category |

---

## State Transitions

### Experience Display States

```
┌──────────────┐
│   Default    │ Initial state on page load
└──────┬───────┘
       │ ScrollTrigger enters viewport
       ▼
┌──────────────┐
│   Animating  │ GSAP fade-in animation (0.6s)
└──────┬───────┘
       │ Animation complete
       ▼
┌──────────────┐
│   Visible    │ Final state, fully visible
└──────────────┘
```

### Technology Tag States

```
Default ──hover──> Highlighted ──focus──> Focused
   │                    │                    │
   └──────────────────>────────────────────>─┘
                  (keyboard navigation)
```

---

## Data Values (from CV)

### experiences.json Content

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
      "achievements": [
        "Migration Angular 13 vers 17",
        "Mise en place CI/CD avec Jenkins"
      ],
      "technologies": ["angular", "typescript", "git", "jenkins"],
      "type": "full-time",
      "displayOrder": 1
    },
    {
      "id": "sfr-architect-2021",
      "role": "Architecte Applicatif",
      "company": "SFR",
      "location": "Toulouse",
      "startDate": "2021",
      "endDate": "2023",
      "description": "Refonte du back-office des boutiques SFR et mise en place d'une nouvelle expérience digital. Conception de la solution front back office, Réalisation de l'architecture applicative et des différents livrables (DAT, MEX, ...). Développement de la solution et accompagnement de l'équipe",
      "achievements": [
        "Architecture front-back office",
        "Leadership équipe technique"
      ],
      "technologies": ["angular", "java", "spring-boot", "postgresql", "redis", "kubernetes", "docker"],
      "type": "full-time",
      "displayOrder": 2
    },
    {
      "id": "sfr-frontend-2020",
      "role": "Tech Lead Frontend",
      "company": "SFR",
      "location": "Toulouse",
      "startDate": "2020",
      "endDate": "2021",
      "description": "Refonte du système des chargées de clientèles SFR et conception de l'outil de modélisation des parcours",
      "achievements": [
        "Refonte système clientèle",
        "Conception outil modélisation"
      ],
      "technologies": ["angular", "typescript", "java", "postgresql", "redis", "elk-stack"],
      "type": "full-time",
      "displayOrder": 3
    },
    {
      "id": "sfr-techlead-2019",
      "role": "Tech Lead",
      "company": "SFR",
      "location": "Toulouse",
      "startDate": "2019",
      "endDate": "2020",
      "description": "Mise en place d'une plateforme numérique –CoPass– pour proposer une organisation adaptée au contexte sanitaire",
      "achievements": [
        "Plateforme CoPass",
        "Architecture Cloud GCP"
      ],
      "technologies": ["angular", "java", "spring-boot", "postgresql", "kubernetes", "gcp"],
      "type": "full-time",
      "displayOrder": 4
    },
    {
      "id": "toulouse-dev-2010",
      "role": "Développeur Informatique",
      "company": "Diverses expériences",
      "location": "Toulouse",
      "startDate": "2010",
      "endDate": "2019",
      "description": "DocOne, ICDC, Orange, DataOne - Développement d'applications web et backend avec Java et Angular",
      "achievements": [
        "Expérience multi-secteurs",
        "Progression vers Tech Lead"
      ],
      "technologies": ["java", "spring-boot", "angular", "javascript", "postgresql"],
      "type": "mixed",
      "displayOrder": 5
    }
  ]
}
```

### skills.json Updates (yearsExperience)

| Skill ID | Old Value | New Value | Calculation |
|----------|-----------|-----------|-------------|
| angular | 5 | 10 | 2014-2024 (first Angular usage) |
| javascript | 8 | 15 | 2010-2025 (career-long) |
| typescript | 5 | 8 | 2017-2025 |
| java | 5 | 15 | 2010-2025 (career-long) |
| spring-boot | 5 | 8 | 2017-2025 |
| postgresql | 5 | 10 | 2015-2025 |
| git | 8 | 12 | 2013-2025 |
| docker | 4 | 6 | 2019-2025 |
| kubernetes | 2 | 4 | 2021-2025 |
| css | 8 | 15 | 2010-2025 |
| redux | 4 | 6 | 2019-2025 |
| spring-security | 4 | 6 | 2019-2025 |

---

## Display Requirements

### Experience Section Layout

- **Title**: "Expériences" (French, matching CV)
- **Subtitle**: "Extrait d'expériences professionnelles"
- **Entries**: Displayed in `displayOrder` (1 = top/most recent)
- **Date format**: "2023 - Présent" or "2021 - 2023"
- **Technology tags**: Display as badges, link to Expertise section

### Skills Section Filter

- **Filter**: `proficiencyLevel >= 2`
- **Current count**: ~70 skills
- **Expected filtered count**: ~25 skills
- **Reduction**: ~64% removed
