# Contributing to Portfolio

Thank you for your interest in contributing! This document provides guidelines and workflows for developing this project.

## Development Setup

### Prerequisites

- **Bun** ≥1.0.0 ([Install Bun](https://bun.sh))
- **Git** for version control
- **Code Editor** (VS Code recommended with Biome extension)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the code standards and project structure documented below.

### 3. Test Your Changes

```bash
# Run linting
bun run lint

# Run formatting
bun run format

# Run tests
bun test

# Build the project
bun run build

# Preview the build
bun run preview
```

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add your feature description"
```

#### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring without behavior changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependencies, etc.

Examples:
```
feat: add contact form component
fix: resolve button hover state issue
docs: update README with deployment instructions
style: format code with Biome
refactor: simplify header navigation logic
perf: optimize image loading strategy
test: add unit tests for Button component
chore: update dependencies to latest versions
```

### 5. Push and Create a Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## Code Standards

### TypeScript

- **Strict Mode**: Always use TypeScript strict mode
- **Types**: Prefer interfaces over types for object shapes
- **Exports**: Use named exports (avoid default exports except for Astro pages)
- **Naming**: Use PascalCase for components, camelCase for functions/variables

```typescript
// Good
interface ButtonProps {
	variant: "primary" | "secondary";
	onClick?: () => void;
}

export function Button({ variant, onClick }: ButtonProps) {
	// ...
}

// Avoid
type buttonProps = {
	variant: string;
	onClick: any;
};
```

### Astro Components

- **File Naming**: Use PascalCase for component files (e.g., `Button.astro`)
- **Props Interface**: Always define a Props interface for component props
- **Styling**: Use scoped styles within components when possible
- **Islands**: Use client directives sparingly (prefer 0KB JavaScript)

```astro
---
interface Props {
	title: string;
	description?: string;
}

const { title, description } = Astro.props;
---

<div class="card">
	<h2>{title}</h2>
	{description && <p>{description}</p>}
</div>

<style>
	.card {
		/* Scoped styles */
	}
</style>
```

### CSS/Styling

- **Mobile-First**: Write mobile styles first, then use media queries for larger screens
- **BEM Naming**: Use BEM convention for class names (e.g., `header__nav-link`)
- **CSS Variables**: Use CSS custom properties for design tokens
- **Performance**: Avoid expensive CSS properties (box-shadow, filters, etc.)

```css
/* Good - Mobile-first, BEM naming */
.card {
	padding: 1rem;
}

.card__title {
	font-size: 1.25rem;
}

@media (min-width: 768px) {
	.card {
		padding: 2rem;
	}

	.card__title {
		font-size: 1.5rem;
	}
}
```

### Testing

- **Unit Tests**: Place in `tests/unit/` with `.test.ts` extension
- **Integration Tests**: Place in `tests/integration/` with `.test.ts` extension
- **Test Structure**: Use `describe` for test suites, `test` for individual tests
- **Assertions**: Use Bun's `expect` API

```typescript
import { describe, test, expect } from "bun:test";

describe("Component Name", () => {
	test("should render correctly", () => {
		// Test implementation
		expect(result).toBe(expected);
	});
});
```

## Project Structure

### Directory Organization

```
src/
├── components/
│   ├── layout/      # Structural components (Header, Footer)
│   ├── ui/          # Reusable UI elements (Button, Card)
│   └── islands/     # Interactive components with client JS
├── layouts/         # Page templates
├── pages/           # File-based routing (becomes URLs)
├── styles/          # Global styles
└── content/         # Content collections (blog, projects)
```

### Adding New Components

1. **Layout Components**: Place in `src/components/layout/`
2. **UI Components**: Place in `src/components/ui/`
3. **Interactive Components**: Place in `src/components/islands/`

### Adding New Pages

Create `.astro` files in `src/pages/`:

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/index.astro` → `/blog`

### Adding Static Assets

Place files in `public/assets/` and reference with:

```astro
<img src={`${import.meta.env.BASE_URL}assets/image.png`} alt="Description" />
```

## Performance Guidelines

This project prioritizes performance. Follow these guidelines:

### JavaScript

- **0KB by Default**: Use pure Astro components without client-side JavaScript
- **Islands Architecture**: Add client directives only when interactivity is required
- **Bundle Size**: Keep total JavaScript <200KB (including GSAP + Lenis)

```astro
<!-- Good: No JavaScript -->
<button class="btn">Click Me</button>

<!-- Only when interactive behavior is needed -->
<InteractiveComponent client:visible />
```

### Images

- **Optimization**: Use Astro's `<Image />` component for automatic optimization
- **Lazy Loading**: Use `loading="lazy"` for below-the-fold images
- **Dimensions**: Always specify width and height attributes
- **Formats**: Prefer WebP/AVIF with fallbacks

### CSS

- **Critical CSS**: Inline critical CSS in `<head>`
- **Minification**: Astro minifies CSS automatically in production
- **Scoped Styles**: Use component-scoped styles to reduce global CSS

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Semantic HTML**: Use proper HTML5 semantic elements
- **Alt Text**: Provide descriptive alt text for all images
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Focus States**: Style `:focus-visible` for keyboard navigation
- **Color Contrast**: Maintain 4.5:1 contrast ratio for text
- **ARIA**: Use ARIA attributes when semantic HTML is insufficient

```astro
<!-- Good accessibility -->
<button class="btn" aria-label="Close modal">
	<span aria-hidden="true">×</span>
</button>

<img src="image.jpg" alt="Descriptive text about the image" />

<nav aria-label="Main navigation">
	<ul>
		<li><a href="/">Home</a></li>
	</ul>
</nav>
```

## Tools and Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Lint code |
| `bun run format` | Format code |
| `bun test` | Run tests |

## Getting Help

- **Issues**: Check [existing issues](https://github.com/YOUR_USERNAME/portfolio/issues) before creating a new one
- **Discussions**: Use [GitHub Discussions](https://github.com/YOUR_USERNAME/portfolio/discussions) for questions
- **Documentation**: Review the [README](README.md) and [Project Constitution](.specify/memory/constitution.md)

## Code Review Process

Pull requests will be reviewed for:

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it readable, maintainable, and well-structured?
3. **Performance**: Does it meet performance budgets?
4. **Accessibility**: Is it accessible to all users?
5. **Testing**: Are there adequate tests?
6. **Documentation**: Is it documented appropriately?

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).
