# Data Model: Single-Page Portfolio with Sectioned Layout

**Feature**: 005-1510-convert-multi
**Date**: 2025-11-07
**Status**: Complete

This document defines the entities, relationships, and data structures for the single-page portfolio architecture.

---

## Entity Overview

The single-page portfolio consists of three primary entities:

1. **Section** - Represents a distinct content area (Hero, About, Projects, Expertise, Contact)
2. **NavigationLink** - Represents anchor links in navigation that point to sections
3. **PageContent** - Represents the consolidated single-page structure

---

## Entity 1: Section

### Description
A Section represents a distinct content area of the portfolio. Each section occupies full viewport height, contains specific content, and is identified by a unique ID and data attribute.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | ✅ | Unique identifier matching section name | Must be one of: `hero`, `about`, `projects`, `expertise`, `contact` |
| `dataSection` | string | ✅ | Data attribute for identification (matches `id`) | Must equal `id` value |
| `ariaLabel` | string | ✅ | Accessible label for screen readers | Non-empty string, descriptive |
| `ariaRole` | string | ✅ | ARIA landmark role | One of: `main`, `region`, `complementary` |
| `heading` | string | ✅ | Section heading (H1 or H2) | Non-empty string |
| `headingLevel` | number | ✅ | Heading level for semantic hierarchy | 1 or 2 |
| `content` | Component | ✅ | Astro component to render | Valid Astro component reference |
| `minHeight` | string | ✅ | Minimum viewport height | CSS value (e.g., `100vh`, `100dvh`) |
| `order` | number | ✅ | Display order (1-5) | Integer 1-5, unique per section |

### Relationships
- **Belongs to**: PageContent (one-to-many)
- **Referenced by**: NavigationLink (one-to-many)

### State Transitions
```
[Created] → [Rendered] → [Visible] → [Active] → [Hidden]
                          ↓           ↓
                          ←─────────←─
```

**States**:
- **Created**: Section element exists in DOM
- **Rendered**: Section component has mounted
- **Visible**: Section is in viewport (IntersectionObserver)
- **Active**: Section is the primary focused section (≥30% visible)
- **Hidden**: Section is scrolled out of viewport

### Example Data Structure

```typescript
interface Section {
  id: 'hero' | 'about' | 'projects' | 'expertise' | 'contact';
  dataSection: string; // Matches id
  ariaLabel: string;
  ariaRole: 'main' | 'region' | 'complementary';
  heading: string;
  headingLevel: 1 | 2;
  content: typeof AstroComponent;
  minHeight: string; // CSS value
  order: number; // 1-5
}
```

**Example Instance**:
```typescript
const heroSection: Section = {
  id: 'hero',
  dataSection: 'hero',
  ariaLabel: 'Hero section with introduction',
  ariaRole: 'main',
  heading: 'Full Stack Developer & Creative Technologist',
  headingLevel: 1,
  content: Hero,
  minHeight: '100dvh',
  order: 1,
};
```

### Validation Rules

1. **ID Uniqueness**: Each section ID must be unique across the page
2. **Order Uniqueness**: Each section order must be unique (1-5)
3. **Data-Section Consistency**: `dataSection` must always equal `id`
4. **ARIA Compliance**: Hero section must use `role="main"`, others use `role="region"`
5. **Heading Hierarchy**: Hero uses `<h1>`, others use `<h2>`
6. **Min-Height**: Must use responsive CSS units (`100vh`, `100dvh`)

---

## Entity 2: NavigationLink

### Description
A NavigationLink represents an anchor link in the site navigation that points to a specific section. Links are used in both Header and BurgerMenu components.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `href` | string | ✅ | Anchor link to section | Must start with `#`, match a section ID |
| `targetSectionId` | string | ✅ | ID of target section | Must match an existing section ID |
| `label` | string | ✅ | Display text for link | Non-empty string |
| `ariaLabel` | string | ✅ | Accessible label (if different from label) | Non-empty string |
| `ariaCurrent` | string \| null | ❌ | Active state indicator | `"page"` when active, `null` otherwise |
| `isActive` | boolean | ✅ | Whether link is currently active | Computed from IntersectionObserver |
| `order` | number | ✅ | Display order in navigation | Integer ≥ 1 |

### Relationships
- **References**: Section (many-to-one)
- **Belongs to**: NavigationMenu (many-to-one)

### State Transitions
```
[Idle] ⇄ [Active]
  ↓       ↓
[Hover] [Focus]
```

**States**:
- **Idle**: Default state, not active or interacted with
- **Active**: Corresponding section is visible and primary (≥30% in viewport)
- **Hover**: Mouse cursor is over the link
- **Focus**: Link has keyboard focus

### Example Data Structure

```typescript
interface NavigationLink {
  href: string; // Starts with #
  targetSectionId: 'hero' | 'about' | 'projects' | 'expertise' | 'contact';
  label: string;
  ariaLabel: string;
  ariaCurrent: 'page' | null;
  isActive: boolean;
  order: number;
}
```

**Example Instance**:
```typescript
const aboutLink: NavigationLink = {
  href: '#about',
  targetSectionId: 'about',
  label: 'About',
  ariaLabel: 'Navigate to About section',
  ariaCurrent: null, // Updated dynamically
  isActive: false, // Updated by IntersectionObserver
  order: 2,
};
```

### Validation Rules

1. **Href Format**: Must start with `#` followed by valid section ID
2. **Target Section Existence**: `targetSectionId` must match an existing section
3. **Order Uniqueness**: Each link order must be unique within navigation
4. **Aria-Current Consistency**: Only one link can have `ariaCurrent="page"` at a time
5. **Active State Sync**: `isActive` and `ariaCurrent` must be synchronized

---

## Entity 3: PageContent

### Description
PageContent represents the consolidated single-page structure in index.astro. It contains all sections in order, global styles, and navigation logic.

### Fields

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `sections` | Section[] | ✅ | Array of all page sections | Exactly 5 sections, ordered 1-5 |
| `navigationLinks` | NavigationLink[] | ✅ | Array of navigation links | One link per section |
| `metadata` | PageMetadata | ✅ | SEO metadata for the page | Valid metadata object |
| `jsonLd` | object | ✅ | Structured data (JSON-LD) | Valid Schema.org structure |
| `smoothScrollEnabled` | boolean | ✅ | Whether Lenis smooth scroll is enabled | `false` if `prefers-reduced-motion` |
| `currentSection` | string \| null | ✅ | ID of currently active section | Matches a section ID or `null` |

### Relationships
- **Contains**: Section[] (one-to-many)
- **Contains**: NavigationLink[] (one-to-many)
- **Has**: PageMetadata (one-to-one)
- **Has**: JSON-LD structured data (one-to-one)

### Example Data Structure

```typescript
interface PageMetadata {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
}

interface PageContent {
  sections: Section[];
  navigationLinks: NavigationLink[];
  metadata: PageMetadata;
  jsonLd: object; // Schema.org WebSite + Person + CreativeWork
  smoothScrollEnabled: boolean;
  currentSection: string | null;
}
```

**Example Instance**:
```typescript
const pageContent: PageContent = {
  sections: [
    { id: 'hero', order: 1, /* ... */ },
    { id: 'about', order: 2, /* ... */ },
    { id: 'projects', order: 3, /* ... */ },
    { id: 'expertise', order: 4, /* ... */ },
    { id: 'contact', order: 5, /* ... */ },
  ],
  navigationLinks: [
    { href: '#hero', order: 1, /* ... */ },
    { href: '#about', order: 2, /* ... */ },
    { href: '#projects', order: 3, /* ... */ },
    { href: '#expertise', order: 4, /* ... */ },
    { href: '#contact', order: 5, /* ... */ },
  ],
  metadata: {
    title: 'Portfolio - Full Stack Developer',
    description: 'Portfolio showcasing web development projects and expertise',
    ogImage: '/og-image.jpg',
    canonical: 'https://your-domain.com/',
  },
  jsonLd: { /* Schema.org structure */ },
  smoothScrollEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  currentSection: 'hero', // Updated by IntersectionObserver
};
```

### Validation Rules

1. **Section Count**: Must have exactly 5 sections
2. **Section Order**: Sections must be ordered sequentially 1-5
3. **Navigation Consistency**: One navigation link per section
4. **Current Section**: Must be `null` or match an existing section ID
5. **Smooth Scroll**: Must respect `prefers-reduced-motion` user preference
6. **Metadata**: All metadata fields must be non-empty
7. **JSON-LD**: Must be valid Schema.org structure

---

## Relationships Diagram

```
PageContent (1)
  ├─── sections (5) → Section
  │       ├─── id (unique)
  │       ├─── content (Astro component)
  │       └─── order (1-5)
  │
  ├─── navigationLinks (5) → NavigationLink
  │       ├─── href (#section-id)
  │       ├─── targetSectionId → references Section.id
  │       ├─── isActive (computed)
  │       └─── order (1-5)
  │
  ├─── metadata → PageMetadata
  │       ├─── title
  │       ├─── description
  │       ├─── ogImage
  │       └─── canonical
  │
  └─── jsonLd → Schema.org structure
          ├─── WebSite
          ├─── Person (mainEntity)
          └─── CreativeWork[] (hasPart)
```

---

## Data Sources

### Static Data (Build-Time)

**File**: `src/data/sections.ts`
```typescript
export const sections: Section[] = [
  {
    id: 'hero',
    dataSection: 'hero',
    ariaLabel: 'Hero section with introduction',
    ariaRole: 'main',
    heading: 'Full Stack Developer & Creative Technologist',
    headingLevel: 1,
    content: Hero,
    minHeight: '100dvh',
    order: 1,
  },
  // ... other sections
];
```

**File**: `src/data/navigation.ts`
```typescript
export const navigationLinks: NavigationLink[] = [
  {
    href: '#hero',
    targetSectionId: 'hero',
    label: 'Home',
    ariaLabel: 'Navigate to Home section',
    ariaCurrent: null,
    isActive: false,
    order: 1,
  },
  // ... other links
];
```

**File**: `src/data/pages.ts`
```typescript
export const pageMetadata = {
  home: {
    title: 'Portfolio - Full Stack Developer',
    description: 'Portfolio showcasing web development projects, expertise, and contact information',
    ogImage: '/og-image.jpg',
    canonical: 'https://your-domain.com/',
  },
};
```

### Dynamic Data (Runtime)

**Managed by JavaScript**:
- `NavigationLink.isActive` - Updated by IntersectionObserver
- `NavigationLink.ariaCurrent` - Updated by ActiveNavigationManager
- `PageContent.currentSection` - Updated by IntersectionObserver
- `Section.state` (Visible/Active/Hidden) - Updated by IntersectionObserver

---

## Configuration Data

### Intersection Observer Configuration

```typescript
interface IntersectionObserverConfig {
  threshold: number; // Section visibility percentage to trigger active state
  rootMargin: string; // Margin around root element
}

const observerConfig: IntersectionObserverConfig = {
  threshold: 0.3, // 30% of section visible = active
  rootMargin: '0px', // No additional margin
};
```

### Lenis Smooth Scroll Configuration

```typescript
interface LenisConfig {
  duration: number; // Scroll duration in seconds
  easing: (t: number) => number; // Easing function
  smoothWheel: boolean; // Enable smooth wheel scrolling
}

const lenisConfig: LenisConfig = {
  duration: 1.2, // 1.2 seconds
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
};
```

---

## Data Validation

### Type Guards

```typescript
// Type guard for Section
export function isValidSection(obj: any): obj is Section {
  return (
    typeof obj.id === 'string' &&
    ['hero', 'about', 'projects', 'expertise', 'contact'].includes(obj.id) &&
    obj.dataSection === obj.id &&
    typeof obj.ariaLabel === 'string' &&
    typeof obj.ariaRole === 'string' &&
    typeof obj.heading === 'string' &&
    [1, 2].includes(obj.headingLevel) &&
    typeof obj.minHeight === 'string' &&
    typeof obj.order === 'number' &&
    obj.order >= 1 && obj.order <= 5
  );
}

// Type guard for NavigationLink
export function isValidNavigationLink(obj: any): obj is NavigationLink {
  return (
    typeof obj.href === 'string' &&
    obj.href.startsWith('#') &&
    typeof obj.targetSectionId === 'string' &&
    typeof obj.label === 'string' &&
    typeof obj.ariaLabel === 'string' &&
    (obj.ariaCurrent === null || obj.ariaCurrent === 'page') &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.order === 'number' &&
    obj.order >= 1
  );
}
```

### Runtime Validation

```typescript
// Validate sections array
export function validateSections(sections: Section[]): void {
  if (sections.length !== 5) {
    throw new Error('PageContent must have exactly 5 sections');
  }

  const ids = sections.map(s => s.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== 5) {
    throw new Error('Section IDs must be unique');
  }

  const orders = sections.map(s => s.order);
  const expectedOrders = [1, 2, 3, 4, 5];
  if (!orders.every((order, i) => order === expectedOrders[i])) {
    throw new Error('Sections must be ordered 1-5 sequentially');
  }
}

// Validate navigation links
export function validateNavigationLinks(links: NavigationLink[], sections: Section[]): void {
  const sectionIds = sections.map(s => s.id);

  links.forEach(link => {
    if (!sectionIds.includes(link.targetSectionId)) {
      throw new Error(`NavigationLink references non-existent section: ${link.targetSectionId}`);
    }

    if (link.href !== `#${link.targetSectionId}`) {
      throw new Error(`NavigationLink href must match #${link.targetSectionId}`);
    }
  });

  const activeCount = links.filter(l => l.ariaCurrent === 'page').length;
  if (activeCount > 1) {
    throw new Error('Only one NavigationLink can have ariaCurrent="page"');
  }
}
```

---

## Data Migration

### From Multi-Page to Single-Page

**Source Pages**:
- `src/pages/index.astro` → Section: Hero
- `src/pages/about.astro` → Section: About
- `src/pages/expertise.astro` → Section: Expertise
- `src/pages/contact.astro` → Section: Contact
- (New) → Section: Projects

**Migration Steps**:
1. Extract content from each page's component
2. Map to Section entity with appropriate metadata
3. Update navigation links from page URLs to hash anchors
4. Consolidate all sections into new `index.astro`
5. Deprecate old page files (keep for reference until testing complete)

**Content Preservation**:
```typescript
// Example: About page migration
// OLD: src/pages/about.astro
// <AboutIDE biography={biography} highlights={highlights} />

// NEW: src/pages/index.astro (About section)
// <section id="about" data-section="about" role="region" aria-label="About section">
//   <h2>About</h2>
//   <AboutIDE biography={biography} highlights={highlights} />
// </section>
```

---

## Data Integrity Constraints

### Must-Have Constraints

1. **Section ID Uniqueness**: No two sections can have the same ID
2. **Order Uniqueness**: No two sections can have the same order
3. **Navigation Link Target Validity**: All navigation links must reference existing sections
4. **Single Active State**: Only one navigation link can have `ariaCurrent="page"` at a time
5. **Data-Section Consistency**: `dataSection` attribute must always equal `id`
6. **Heading Hierarchy**: Only one `<h1>` per page (Hero section)

### Should-Have Constraints

1. **Aria-Label Descriptiveness**: All aria-labels should be descriptive and unique
2. **Metadata Completeness**: All metadata fields should be non-empty
3. **JSON-LD Validity**: Structured data should validate against Schema.org
4. **Section Content**: Each section should have meaningful content (not empty)

---

## Performance Considerations

### Data Size

| Entity | Instances | Size per Instance | Total Size |
|--------|-----------|-------------------|------------|
| Section | 5 | ~1KB (metadata + refs) | ~5KB |
| NavigationLink | 5 | ~0.2KB | ~1KB |
| PageContent | 1 | ~2KB (metadata + JSON-LD) | ~2KB |
| **Total Static Data** | - | - | **~8KB** |

### Dynamic Updates

- **IntersectionObserver callbacks**: Fired only when section enters/exits viewport (not on every scroll)
- **Navigation state updates**: O(n) where n = number of navigation links (5) = negligible
- **URL hash updates**: Debounced to max 1 update per 100ms
- **Focus management**: <1ms per navigation event

---

## Testing Data

### Test Fixtures

**File**: `tests/fixtures/sections.ts`
```typescript
export const mockSections: Section[] = [
  {
    id: 'hero',
    dataSection: 'hero',
    ariaLabel: 'Test hero section',
    ariaRole: 'main',
    heading: 'Test Heading',
    headingLevel: 1,
    content: MockHeroComponent,
    minHeight: '100vh',
    order: 1,
  },
  // ... other test sections
];
```

**File**: `tests/fixtures/navigation.ts`
```typescript
export const mockNavigationLinks: NavigationLink[] = [
  {
    href: '#hero',
    targetSectionId: 'hero',
    label: 'Home',
    ariaLabel: 'Navigate to Home',
    ariaCurrent: null,
    isActive: false,
    order: 1,
  },
  // ... other test links
];
```

---

## Summary

This data model defines three core entities:

1. **Section**: Content areas with full-viewport height, semantic markup, and ARIA attributes
2. **NavigationLink**: Anchor links with active state management and accessibility support
3. **PageContent**: Single-page structure containing all sections, navigation, and metadata

All entities include validation rules, relationships, state transitions, and performance considerations. The model supports the constitutional requirements for performance, accessibility, and maintainability.
