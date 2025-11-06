# Configuration Contracts

This directory contains **contracts** (schemas and type definitions) for the portfolio static site project configuration files. Since this is a static site with no API or backend, these contracts define the structure and validation rules for configuration files rather than API endpoints.

## Contract Files

### 1. `package-json.schema.json`

**JSON Schema** for `package.json` validation.

**Purpose**: Ensures package.json follows constitutional requirements:
- Uses Bun as package manager (engines field)
- Includes all required scripts (dev, build, preview, lint, format, test)
- Uses ES modules (type: "module")
- Contains required dependencies (Astro, GSAP, Lenis, TypeScript)

**Usage**:
```bash
# Validate package.json against schema (using ajv-cli or similar)
bunx ajv validate -s contracts/package-json.schema.json -d package.json
```

**Key Validations**:
- ✅ `name`: Lowercase with hyphens only
- ✅ `version`: Semantic versioning (MAJOR.MINOR.PATCH)
- ✅ `type`: MUST be "module"
- ✅ `engines.bun`: MUST be ">=1.0.0" or higher
- ✅ `scripts`: All required commands present and use Bun
- ✅ `dependencies`: Core dependencies present (Astro, GSAP, Lenis)

---

### 2. `astro-config.schema.ts`

**TypeScript Contract** for `astro.config.mjs` validation.

**Purpose**: Type-safe Astro configuration with constitutional compliance:
- Static output mode required (Principle III)
- HTTPS site URL required (Principle V - SEO)
- HTML compression required (Principle I - Performance)
- GitHub Pages deployment configuration

**Usage**:
```typescript
// In astro.config.mjs
import { defineConfig } from 'astro/config';
import type { PortfolioAstroConfig } from './specs/001-1505-initialise-le/contracts/astro-config.schema';

export default defineConfig({
  site: "https://username.github.io",
  base: "/portfolio",
  output: "static",
  compressHTML: true,
} satisfies PortfolioAstroConfig);
```

**Key Validations**:
- ✅ `site`: MUST be HTTPS URL
- ✅ `output`: MUST be "static"
- ✅ `base`: MUST start with "/" if provided
- ✅ `compressHTML`: MUST be true for production
- ✅ `integrations`: Optional array (empty for minimal init)

**Helper Functions**:
- `isValidPortfolioConfig(config)`: Type guard for validation
- `createDefaultConfig(site, base?)`: Factory for default configuration

---

## Contract Purpose

These contracts serve multiple purposes:

1. **Validation**: Automated validation of configuration files during CI/CD
2. **Documentation**: Self-documenting configuration requirements
3. **Type Safety**: TypeScript type checking for configuration objects
4. **Constitutional Compliance**: Enforce project constitution requirements
5. **Onboarding**: Help new developers understand configuration structure

## Constitutional Alignment

### Principle I: Performance First
- `astro-config.schema.ts` enforces `compressHTML: true` for production
- `astro-config.schema.ts` enforces `output: "static"` for 0KB JavaScript initial load

### Principle III: Build & Deployment Optimization
- `package-json.schema.json` enforces Bun package manager via `engines.bun`
- `package-json.schema.json` validates build scripts use Bun commands

### Principle IV: Developer Experience & Maintainability
- `package-json.schema.json` requires TypeScript in dependencies
- `package-json.schema.json` validates linting/formatting scripts

### Principle V: Content & SEO Excellence
- `astro-config.schema.ts` requires HTTPS `site` URL for SEO and meta tags

### Principle VI: Tooling & Runtime Excellence
- `package-json.schema.json` enforces Bun >=1.0.0 in engines field
- `package-json.schema.json` validates all scripts use Bun commands

## Integration with Workflow

### During Development
```bash
# Validate configuration files before commit
bun run lint  # Biome checks TypeScript types including config
```

### During CI/CD
```yaml
# .github/workflows/validate.yml
steps:
  - name: Validate package.json
    run: bunx ajv validate -s specs/001-1505-initialise-le/contracts/package-json.schema.json -d package.json

  - name: Type check configurations
    run: bun run astro check
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Validate package.json
bunx ajv validate -s specs/001-1505-initialise-le/contracts/package-json.schema.json -d package.json || exit 1

# Type check
bun run astro check || exit 1
```

## Future Extensions

As the project grows, additional contracts can be added:

1. **`tsconfig.schema.json`**: Validate TypeScript configuration
2. **`biome.schema.json`**: Validate Biome linting rules
3. **`content-collection.schema.ts`**: Type-safe content collection schemas
4. **`github-actions.schema.json`**: Validate CI/CD workflow configuration

## References

- [JSON Schema Specification](https://json-schema.org/)
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [Bun package.json Fields](https://bun.sh/docs/runtime/bunfig)
- [Project Constitution](../../../.specify/memory/constitution.md)
