# Portfolio Specifications

This directory contains the functional and technical documentation for the portfolio project. Documentation is organized by feature and purpose to provide clear guidance for developers, designers, and stakeholders.

## Documentation Structure

```
specifications/
├── functional/               # User-facing behavior and features
│   ├── 00-portfolio-overview.md
│   └── 01-project-initialization.md
└── technical/                # Implementation details
    ├── architecture/
    │   ├── project-structure.md
    │   └── technology-stack.md
    └── setup/
        ├── development-environment.md
        └── deployment.md
```

## Functional Documentation

**Purpose**: Describes WHAT the portfolio does from a user perspective

**Location**: `functional/`

**Content**:
- User workflows and interactions
- Feature capabilities
- Expected behaviors
- Success criteria
- Edge cases and limitations

**Audience**: Product owners, designers, QA engineers, end users

### Current Functional Docs

- **[00-portfolio-overview.md](functional/00-portfolio-overview.md)** - High-level overview of portfolio capabilities, user experience, and core features
- **[01-project-initialization.md](functional/01-project-initialization.md)** - Project setup workflows, development commands, and initialization features

## Technical Documentation

**Purpose**: Describes HOW the portfolio is implemented

**Location**: `technical/`

**Content**:
- Architecture decisions
- Technology choices
- Implementation patterns
- Configuration details
- Code examples

**Audience**: Developers, DevOps engineers, technical leads

### Architecture Documentation

**Location**: `technical/architecture/`

**Content**: System design, structure, and technology decisions

**Current Architecture Docs**:
- **[project-structure.md](technical/architecture/project-structure.md)** - Directory layout, file organization, component structure, and conventions
- **[technology-stack.md](technical/architecture/technology-stack.md)** - Technology choices, dependencies, version compatibility, and rationale

### Setup Documentation

**Location**: `technical/setup/`

**Content**: Environment configuration, deployment, and operational procedures

**Current Setup Docs**:
- **[development-environment.md](technical/setup/development-environment.md)** - Local development setup, IDE configuration, and development workflow
- **[deployment.md](technical/setup/deployment.md)** - GitHub Pages deployment, CI/CD pipeline, and production configuration

## How to Use This Documentation

### For New Developers

**Getting Started**:
1. Read [00-portfolio-overview.md](functional/00-portfolio-overview.md) - Understand what the portfolio does
2. Read [technology-stack.md](technical/architecture/technology-stack.md) - Learn the tech stack
3. Read [development-environment.md](technical/setup/development-environment.md) - Set up your environment
4. Read [project-structure.md](technical/architecture/project-structure.md) - Understand the codebase

### For Feature Development

**Before Implementing**:
1. Read relevant functional documentation to understand user requirements
2. Review architecture documentation for implementation patterns
3. Check existing code structure in project-structure.md
4. Follow conventions in CLAUDE.md (root directory)

### For Deployment

**Deployment Process**:
1. Read [deployment.md](technical/setup/deployment.md) - Understand deployment workflow
2. Follow deployment checklist
3. Verify post-deployment

### For Troubleshooting

**When Issues Arise**:
1. Check [development-environment.md](technical/setup/development-environment.md) - Common issues and solutions
2. Review [deployment.md](technical/setup/deployment.md) - Deployment debugging
3. Consult technology documentation links in [technology-stack.md](technical/architecture/technology-stack.md)

## Documentation Principles

### Present Tense
Documentation reflects the CURRENT STATE of the system. It describes what IS, not what was or will be.

**Good**: "The portfolio uses Astro for static site generation"
**Bad**: "The portfolio will use Astro" or "We decided to use Astro"

### User Perspective (Functional)
Functional documentation focuses on user-facing behavior and value.

**Good**: "Users can navigate between pages using the header menu"
**Bad**: "The Header component renders navigation links"

### Implementation Focus (Technical)
Technical documentation focuses on HOW things work under the hood.

**Good**: "The Header component uses Astro's file-based routing"
**Bad**: "The header allows navigation" (too high-level for technical docs)

### Practical Examples
Technical documentation includes code examples where relevant.

**Include**:
- Configuration snippets
- Component examples
- Command usage
- Directory structures

### No Historical Information
Documentation does not include decision history, meeting notes, or changelogs.

**For history**: See git commits and feature spec documents in `specs/[feature-id]/`

## Relationship to Feature Specs

### Feature Specifications

**Location**: `specs/[feature-id]/`

**Purpose**: Planning and implementation artifacts for individual features

**Content**:
- spec.md - Requirements and user stories
- plan.md - Implementation plan
- tasks.md - Task breakdown
- research.md - Technology research
- contracts/ - Schemas and validation

**Lifecycle**: Created during feature planning, archived after completion

### Specifications Documentation (This Directory)

**Location**: `specs/specifications/`

**Purpose**: Living documentation of the complete system

**Content**: Consolidated knowledge from all features

**Lifecycle**: Updated as features are completed, reflects current state

**Relationship**: Feature specs are SOURCE, specifications are CONSOLIDATED KNOWLEDGE

## Updating Documentation

### When to Update

**Add New Documentation**:
- New feature adds user-facing capabilities → Update functional docs
- New technology or pattern introduced → Update technical docs
- New architectural pattern established → Update architecture docs

**Update Existing Documentation**:
- Feature modifies existing behavior → Update relevant functional doc
- Technology upgraded or changed → Update technology-stack.md
- Project structure changes → Update project-structure.md
- Deployment process changes → Update deployment.md

### How to Update

**Process**:
1. Identify which documentation file(s) need updates
2. Read the current documentation
3. Update to reflect NEW current state (not incremental changes)
4. Use present tense, concrete examples
5. Remove outdated information
6. Test any code examples
7. Commit with clear message

**Commit Message Format**:
```
docs(specs): update [file] for [feature]

- Added section on [new capability]
- Updated [changed section]
- Removed [obsolete information]
```

### What NOT to Include

**Avoid**:
- Historical decisions ("We chose X because...")
- Personal opinions ("I think X is better")
- Temporary workarounds (fix the code instead)
- Tutorial-style explanations (link to external docs)
- Incomplete information (finish it or don't add it)

## Related Documentation

### Root Documentation

- **[README.md](../../README.md)** - Quick start guide and project overview
- **[CLAUDE.md](../../CLAUDE.md)** - Development guidelines and conventions
- **[CONTRIBUTING.md](../../CONTRIBUTING.md)** - Contribution guidelines

### External Documentation

- **[Astro Documentation](https://docs.astro.build)** - Framework documentation
- **[Bun Documentation](https://bun.sh/docs)** - Runtime and package manager
- **[Biome Documentation](https://biomejs.dev)** - Linting and formatting
- **[GSAP Documentation](https://greensock.com/docs)** - Animation library

### Feature Specifications

- **[specs/001-1505-initialise-le/](../001-1505-initialise-le/)** - Project initialization feature spec

## Questions and Feedback

**For Documentation Issues**:
- Create GitHub issue with label `documentation`
- Tag with specific file or section

**For Technical Questions**:
- Check technical documentation first
- Consult external documentation
- Ask in team channel or create discussion

## Maintenance

**Documentation Review**: Quarterly review to ensure accuracy

**Ownership**: All developers are responsible for documentation accuracy

**Quality Standards**:
- Clear and concise writing
- Accurate code examples
- Up-to-date information
- Proper formatting
- No broken links
