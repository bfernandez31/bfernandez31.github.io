# Data Model: Project Initialization

**Feature**: Project Initialization with Bun and Astro
**Date**: 2025-11-06

## Overview

This feature initializes a static site project, which has **no runtime data model** (no database, no API, no dynamic data). However, there are several "entities" represented as **configuration objects** and **file structures** that define the project's behavior.

## Configuration Entities

### 1. Project Configuration

**Purpose**: Defines project metadata and build settings

**Location**: `package.json`

**Schema**:
```typescript
interface PackageJson {
  name: string;                    // Project name (e.g., "portfolio")
  version: string;                 // Semantic version (e.g., "0.1.0")
  type: "module";                  // ES modules
  scripts: {
    dev: string;                   // Development server command
    build: string;                 // Production build command
    preview: string;               // Preview production build
    lint: string;                  // Linting command
    format: string;                // Formatting command
    test: string;                  // Testing command
  };
  engines: {
    bun: string;                   // Required Bun version (e.g., ">=1.0.0")
  };
  dependencies: Record<string, string>;     // Production dependencies
  devDependencies: Record<string, string>;  // Development dependencies
}
```

**Validation Rules**:
- `name` MUST be lowercase, hyphen-separated (e.g., "my-portfolio")
- `version` MUST follow semantic versioning (MAJOR.MINOR.PATCH)
- `type` MUST be "module" for ES modules support
- `engines.bun` MUST specify minimum version ">=1.0.0"
- All scripts MUST use `bun` or `bun run` prefix (not npm/yarn)

**Relationships**:
- References `astro.config.mjs` via build script
- References `biome.json` via lint/format scripts
- References `tsconfig.json` via TypeScript compilation

---

### 2. Astro Configuration

**Purpose**: Configures Astro framework behavior, integrations, and build output

**Location**: `astro.config.mjs`

**Schema**:
```typescript
interface AstroConfig {
  site: string;                    // Production URL (e.g., "https://username.github.io")
  base?: string;                   // Base path for deployment (e.g., "/portfolio")
  output: 'static';                // Output mode (MUST be static for GitHub Pages)
  integrations: Integration[];     // Framework integrations (React, Vue, Tailwind)
  build: {
    assets: string;                // Asset directory name (default: "_astro")
  };
  vite?: {
    build?: {
      rollupOptions?: {
        output?: {
          entryFileNames: string;  // JS file naming pattern
          chunkFileNames: string;  // Chunk file naming pattern
          assetFileNames: string;  // Asset file naming pattern
        };
      };
    };
  };
  compressHTML?: boolean;          // HTML minification (default: true for production)
}
```

**Validation Rules**:
- `output` MUST be "static" (constitutional requirement for GitHub Pages)
- `site` MUST be a valid HTTPS URL
- `base` MUST start with "/" if provided
- `compressHTML` SHOULD be true for production builds

**Relationships**:
- Determines output directory structure (`dist/`)
- Configures integrations (e.g., `@astrojs/react` for React Islands)
- References TypeScript configuration via Vite

---

### 3. TypeScript Configuration

**Purpose**: Configures TypeScript compiler and type checking behavior

**Location**: `tsconfig.json`

**Schema**:
```typescript
interface TypeScriptConfig {
  extends: string;                 // Base config (e.g., "astro/tsconfigs/strict")
  compilerOptions: {
    target: string;                // ECMAScript target (e.g., "ES2022")
    module: string;                // Module system (e.g., "ESNext")
    moduleResolution: string;      // Module resolution (e.g., "bundler")
    lib: string[];                 // Standard libraries (e.g., ["ES2022", "DOM"])
    jsx?: string;                  // JSX support (e.g., "react-jsx" for React Islands)
    strict: boolean;               // Strict type checking (MUST be true)
    esModuleInterop: boolean;      // ES module interop
    skipLibCheck: boolean;         // Skip type checking of declaration files
    resolveJsonModule: boolean;    // Import JSON modules
    paths?: Record<string, string[]>; // Path aliases (e.g., "@/*": ["./src/*"])
  };
  include: string[];               // Files to include (e.g., ["src/**/*"])
  exclude: string[];               // Files to exclude (e.g., ["dist", "node_modules"])
}
```

**Validation Rules**:
- `extends` MUST reference Astro's recommended config
- `compilerOptions.strict` MUST be true (constitutional requirement)
- `compilerOptions.moduleResolution` MUST be "bundler" for Bun compatibility
- `include` MUST cover all source files in `src/`

**Relationships**:
- Extended by Astro for `.astro` file type checking
- Used by Biome for linting TypeScript files
- Used by Bun for native TypeScript execution

---

### 4. Biome Configuration

**Purpose**: Configures linting and formatting rules

**Location**: `biome.json`

**Schema**:
```typescript
interface BiomeConfig {
  $schema: string;                 // JSON schema URL
  organizeImports: {
    enabled: boolean;              // Auto-organize imports
  };
  linter: {
    enabled: boolean;              // Enable linting
    rules: {
      recommended: boolean;        // Use recommended rules
      complexity?: Record<string, string>;    // Complexity rules
      style?: Record<string, string>;         // Style rules
      suspicious?: Record<string, string>;    // Suspicious code rules
    };
  };
  formatter: {
    enabled: boolean;              // Enable formatting
    indentStyle: "tab" | "space";  // Indentation style
    indentWidth: number;           // Indentation width
    lineWidth: number;             // Max line width (e.g., 100)
  };
  javascript: {
    formatter: {
      quoteStyle: "single" | "double"; // Quote style
      trailingComma: "all" | "es5" | "none"; // Trailing comma
      semicolons: "always" | "asNeeded"; // Semicolon style
    };
  };
}
```

**Validation Rules**:
- `linter.enabled` MUST be true (constitutional requirement)
- `formatter.enabled` MUST be true (constitutional requirement)
- `formatter.lineWidth` SHOULD be ≤100 for readability
- `linter.rules.recommended` MUST be true for baseline quality

**Relationships**:
- Used by `bun run lint` and `bun run format` scripts
- Applied to TypeScript, JavaScript, JSON, and CSS files
- Integrated with VS Code via Biome extension

---

### 5. Git Configuration

**Purpose**: Defines files to ignore in version control

**Location**: `.gitignore`

**Schema** (text file, not JSON):
```
# Dependencies
node_modules/
bun.lockb.bak

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

**Validation Rules**:
- MUST include `node_modules/` to prevent dependency commits
- MUST include `dist/` to prevent build artifact commits
- MUST include `.env*` to prevent secret leaks
- SHOULD include editor and OS-specific files

---

### 6. GitHub Actions Workflow

**Purpose**: Defines CI/CD pipeline for automated deployment to GitHub Pages

**Location**: `.github/workflows/deploy.yml`

**Schema**:
```typescript
interface GitHubWorkflow {
  name: string;                    // Workflow name (e.g., "Deploy to GitHub Pages")
  on: {
    push: {
      branches: string[];          // Trigger branches (e.g., ["main"])
    };
  };
  permissions: {
    contents: "read";
    pages: "write";
    id-token: "write";
  };
  jobs: {
    build: {
      runs-on: string;             // Runner OS (e.g., "ubuntu-latest")
      steps: Step[];               // Build steps
    };
    deploy: {
      needs: string[];             // Dependencies (e.g., ["build"])
      runs-on: string;
      environment: {
        name: string;              // Environment name (e.g., "github-pages")
        url: string;               // Deployment URL variable
      };
      steps: Step[];               // Deployment steps
    };
  };
}

interface Step {
  name?: string;                   // Step name (optional)
  uses?: string;                   // Action to use (e.g., "actions/checkout@v4")
  with?: Record<string, any>;      // Action inputs
  run?: string;                    // Shell command to run
}
```

**Validation Rules**:
- `on.push.branches` MUST include main branch
- `permissions` MUST include `pages: write` for deployment
- Build job MUST use `oven-sh/setup-bun@v1` action for Bun installation
- Build job MUST run `bun install` and `bun run build`
- Deploy job MUST depend on build job (`needs: ["build"]`)

**Relationships**:
- Triggered by commits to main branch
- Uses `package.json` scripts for build commands
- Uploads artifacts from `dist/` directory
- Deploys to GitHub Pages environment

---

## File Structure Entity

### 7. Project Directory Structure

**Purpose**: Represents the physical file and folder organization

**Schema**:
```typescript
interface DirectoryStructure {
  root: Directory;
}

interface Directory {
  name: string;
  type: "directory";
  children: (Directory | File)[];
}

interface File {
  name: string;
  type: "file";
  extension: string;
  purpose: string;
}
```

**Example Instance**:
```typescript
{
  root: {
    name: "portfolio",
    type: "directory",
    children: [
      {
        name: "src",
        type: "directory",
        children: [
          { name: "pages", type: "directory", purpose: "File-based routing" },
          { name: "components", type: "directory", purpose: "Reusable components" },
          { name: "layouts", type: "directory", purpose: "Page templates" },
          { name: "styles", type: "directory", purpose: "Global styles" },
          { name: "content", type: "directory", purpose: "Content collections" }
        ]
      },
      {
        name: "public",
        type: "directory",
        children: [
          { name: "favicon.svg", type: "file", extension: "svg", purpose: "Site icon" },
          { name: "robots.txt", type: "file", extension: "txt", purpose: "SEO directives" }
        ]
      },
      { name: "package.json", type: "file", extension: "json", purpose: "Project manifest" },
      { name: "astro.config.mjs", type: "file", extension: "mjs", purpose: "Astro config" },
      { name: "tsconfig.json", type: "file", extension: "json", purpose: "TypeScript config" },
      { name: "biome.json", type: "file", extension: "json", purpose: "Linting config" }
    ]
  }
}
```

**Validation Rules**:
- `src/` directory MUST exist at project root
- `src/pages/` MUST contain at least one `.astro` file (e.g., `index.astro`)
- `public/` directory MUST exist for static assets
- Root MUST contain `package.json`, `astro.config.mjs`, and `tsconfig.json`

**Relationships**:
- `src/pages/` files become routes in the built site
- `public/` files are copied as-is to `dist/` during build
- Configuration files control build behavior

---

## State Transitions

### Project Initialization Lifecycle

```
[Empty Directory]
    ↓
    | bun create astro@latest
    ↓
[Astro Project Scaffold]
    ↓
    | bun install (dependencies)
    ↓
[Dependencies Installed]
    ↓
    | Add Biome, configure tooling
    ↓
[Linting/Formatting Configured]
    ↓
    | Add test setup, GitHub Actions
    ↓
[Production-Ready Project]
    ↓
    | bun run dev
    ↓
[Development Server Running]
```

**State Validation**:
- After "Dependencies Installed": `node_modules/` exists, `bun.lockb` exists
- After "Linting/Formatting Configured": `bun run lint` succeeds without errors
- After "Production-Ready Project": `bun run build` produces `dist/` directory
- After "Development Server Running": Server responds on `http://localhost:4321`

---

## Constraints and Relationships

### Cross-Entity Constraints

1. **Package.json ↔ Astro Config**:
   - `package.json` scripts reference `astro.config.mjs` implicitly via `astro build` command
   - Astro integrations in `astro.config.mjs` must have corresponding dependencies in `package.json`

2. **TypeScript Config ↔ Astro Config**:
   - `tsconfig.json` extends Astro's base config
   - Path aliases in `tsconfig.json` must align with Astro's resolver

3. **Biome Config ↔ Source Files**:
   - Biome rules apply to all `.ts`, `.js`, `.astro`, `.json` files in `src/`
   - Formatting rules must be consistent with project conventions

4. **Git Ignore ↔ Directory Structure**:
   - `.gitignore` must exclude all build artifacts (`dist/`, `.astro/`)
   - Must exclude lock files backups (`bun.lockb.bak`)

5. **GitHub Actions ↔ Build Configuration**:
   - Workflow references scripts from `package.json`
   - Deploy step assumes `dist/` directory structure from Astro build

### Performance Constraints

- **Build Output Size**: `dist/` directory MUST be ≤10MB for typical portfolio site
- **Configuration Parse Time**: All JSON configs MUST parse in <50ms
- **Dependency Tree Depth**: Maximum depth of 5 levels to prevent resolution issues

---

## Future Extension Points

While this feature initializes a minimal project, the data model is designed to support future extensions:

1. **Content Collections** (deferred):
   - `src/content/` will contain type-safe content schemas
   - Add collections for blog posts, projects, case studies

2. **Framework Integrations** (deferred):
   - `astro.config.mjs` can add `@astrojs/react`, `@astrojs/vue` integrations
   - `src/components/islands/` ready for interactive components

3. **Environment Variables** (deferred):
   - `.env` files for API keys, feature flags
   - Astro's `import.meta.env` for type-safe environment access

4. **Deployment Targets** (deferred):
   - Additional deployment workflows for Netlify, Vercel, Cloudflare Pages
   - Preview deployments for pull requests

---

## Summary

This "data model" represents the **project configuration and structure as data**, not runtime application data. Key entities:

1. **package.json**: Project metadata and scripts
2. **astro.config.mjs**: Framework configuration
3. **tsconfig.json**: TypeScript compiler settings
4. **biome.json**: Linting and formatting rules
5. **.gitignore**: Version control exclusions
6. **.github/workflows/deploy.yml**: CI/CD pipeline
7. **Directory Structure**: Physical file organization

All entities validated against constitutional requirements and designed for extensibility.
