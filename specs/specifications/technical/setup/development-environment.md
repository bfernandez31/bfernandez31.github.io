# Development Environment Setup

## Prerequisites

### Required Software

**Bun** (≥1.0.0)
- JavaScript runtime and package manager
- Installation: https://bun.sh
- Verify: `bun --version`

**Git** (any recent version)
- Version control system
- Installation: https://git-scm.com
- Verify: `git --version`

**Code Editor** (recommended)
- Visual Studio Code with Astro extension
- Alternative: Any editor with TypeScript support

### System Requirements

**Operating Systems**:
- macOS (Intel or Apple Silicon)
- Linux (most distributions)
- Windows (WSL2 recommended)

**Hardware**:
- 4GB RAM minimum (8GB recommended)
- 500MB free disk space (2GB with dependencies)
- Modern CPU (2015 or newer)

## Installation Steps

### 1. Install Bun

**macOS/Linux**:
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows** (WSL2):
```bash
curl -fsSL https://bun.sh/install | bash
```

**Verify Installation**:
```bash
bun --version
# Should output: 1.0.0 or higher
```

### 2. Clone Repository

```bash
git clone https://github.com/b-fernandez/portfolio.git
cd portfolio
```

### 3. Install Dependencies

```bash
bun install
```

**Expected Output**:
```
[0.00ms] Resolving dependencies
[1.23ms] Downloading packages
[2.45ms] Installing dependencies
✓ Installed 308 packages in 2.45s
```

**Troubleshooting**:
- If installation fails, check network connectivity
- Clear Bun cache: `bun pm cache clear`
- Retry installation: `bun install --force`

### 4. Verify Setup

Run health check commands:

```bash
# Check TypeScript compilation
bun run build

# Start development server
bun run dev

# Run linting
bun run lint

# Run tests
bun test
```

**Expected Results**:
- Build completes without errors
- Dev server starts on port 4321
- Linting passes with no warnings
- All tests pass

## Development Workflow

### Starting Development Server

```bash
bun run dev
```

**Output**:
```
  🚀  astro v5.15.3 started in 82ms

  ┃ Local    http://localhost:4321/portfolio
  ┃ Network  use --host to expose

  watching for file changes...
```

**Access Site**:
- Local: http://localhost:4321/portfolio
- Network: Add `--host` flag to expose on network

**Features**:
- Hot module replacement (instant updates)
- Error overlay for compilation errors
- TypeScript type checking in editor

### Making Changes

**Edit Files**:
```bash
# Open in VS Code
code .

# Or any editor
vim src/pages/index.astro
```

**Save Changes**:
- Changes auto-detected
- Browser refreshes automatically
- Errors displayed in terminal and browser

**File Watching**:
- Watches `src/` directory
- Watches `public/` directory
- Watches configuration files
- Ignores `node_modules/` and `dist/`

### Code Quality Checks

**Linting**:
```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run format
```

**Type Checking**:
```bash
# Check types manually
astro check

# Automatic during build
bun run build
```

**Testing**:
```bash
# Run all tests
bun test

# Watch mode (re-run on changes)
bun test --watch

# Specific test file
bun test tests/unit/Button.test.ts

# With coverage
bun test --coverage
```

### Building for Production

```bash
bun run build
```

**Build Process**:
1. Run TypeScript type checking
2. Compile Astro components to HTML
3. Optimize CSS and JavaScript
4. Compress HTML
5. Generate hashed assets
6. Output to `dist/` directory

**Build Output**:
```
dist/
├── index.html           # 2.3 KB
├── about.html           # 1.8 KB
├── _astro/
│   ├── styles.abc123.css
│   └── component.def456.js
└── assets/
```

**Verification**:
```bash
# Preview production build
bun run preview

# Access at http://localhost:4321/portfolio
```

## IDE Configuration

### Visual Studio Code

**Recommended Extensions**:
```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "biomejs.biome",
    "dbaeumer.vscode-eslint"
  ]
}
```

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**Keyboard Shortcuts**:
- `Ctrl/Cmd + S`: Save and auto-format
- `F5`: Start debugging
- `Ctrl/Cmd + Shift + B`: Build project

### Other Editors

**WebStorm/IntelliJ**:
- Enable Astro plugin
- Configure Biome as formatter
- Set TypeScript version to workspace

**Vim/Neovim**:
- Install Astro language server
- Configure Biome with ALE or null-ls
- Enable TypeScript support

## Environment Variables

### Development Variables

Create `.env` file (optional):
```bash
# Public variables (available in browser)
PUBLIC_SITE_NAME="Portfolio"
PUBLIC_ANALYTICS_ID="G-XXXXXXXXXX"

# Private variables (server-only)
SECRET_API_KEY="your-api-key"
```

**Usage in Code**:
```astro
---
const siteName = import.meta.env.PUBLIC_SITE_NAME;
---
```

**Access Rules**:
- `PUBLIC_*` prefix required for browser access
- Non-prefixed variables only available server-side
- Never commit `.env` to git (in `.gitignore`)

### Build Variables

**GitHub Actions** (automatic):
```yaml
env:
  NODE_ENV: production
  ASTRO_TELEMETRY_DISABLED: 1
```

**Manual Build**:
```bash
# Production build
NODE_ENV=production bun run build

# Development build
NODE_ENV=development bun run build
```

## Port Configuration

### Default Ports

- **Development**: 4321
- **Preview**: 4321 (same as dev)

### Custom Port

```bash
# Specify custom port
bun run dev -- --port 3000

# Expose on network
bun run dev -- --host

# Custom port and host
bun run dev -- --port 3000 --host
```

**Configuration** (`astro.config.mjs`):
```javascript
export default defineConfig({
  server: {
    port: 3000,
    host: true
  }
});
```

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Error: Port 4321 is already in use
# Solution: Kill process or use different port
lsof -i :4321
kill -9 <PID>
# Or use custom port
bun run dev -- --port 3000
```

**Bun Version Mismatch**:
```bash
# Error: Required Bun version >=1.0.0
# Solution: Update Bun
bun upgrade
```

**Module Not Found**:
```bash
# Error: Cannot find module 'astro'
# Solution: Reinstall dependencies
rm -rf node_modules bun.lockb
bun install
```

**TypeScript Errors**:
```bash
# Error: Type errors in components
# Solution: Check TypeScript version
bun run build  # Shows detailed errors
astro check    # Standalone type check
```

**Build Failures**:
```bash
# Error: Build failed with exit code 1
# Solution: Check for errors in terminal
bun run build --verbose  # Detailed output
```

### Performance Issues

**Slow Development Server**:
- Check file watcher limits (Linux)
- Exclude large directories from watching
- Clear `.astro` build cache

**Slow Builds**:
- Reduce number of pages
- Optimize image sizes
- Check for circular imports

**High Memory Usage**:
- Close unused applications
- Reduce concurrent builds
- Check for memory leaks in components

### Getting Help

**Resources**:
- Astro Docs: https://docs.astro.build
- Bun Docs: https://bun.sh/docs
- GitHub Issues: https://github.com/b-fernandez/portfolio/issues

**Debug Mode**:
```bash
# Enable debug logging
DEBUG=* bun run dev

# Astro-specific debug
DEBUG=astro:* bun run dev
```

## Development Best Practices

### File Organization

**Do**:
- Group related components
- Use consistent naming conventions
- Keep components small and focused
- Document complex logic

**Don't**:
- Mix concerns in single file
- Create deep directory nesting
- Use ambiguous names
- Skip type annotations

### Code Quality

**Before Committing**:
```bash
# Run full quality check
bun run lint && bun test && bun run build
```

**Commit Guidelines**:
- Write clear commit messages
- Keep commits focused and atomic
- Reference issue numbers
- Run tests before pushing

### Performance

**Development**:
- Use hot reload for quick iterations
- Test in multiple browsers
- Check mobile responsiveness
- Monitor bundle sizes

**Production**:
- Run lighthouse audits
- Test on slow networks
- Verify accessibility
- Check SEO metadata

## Continuous Integration

### GitHub Actions

**Automatic Checks**:
- Type checking on every push
- Linting on every pull request
- Tests on every commit
- Build verification before merge

**Deployment**:
- Automatic deploy to GitHub Pages on main branch
- Preview deployments for pull requests (optional)

**Configuration** (`.github/workflows/deploy.yml`):
- Uses Bun for fast installation
- Runs full build pipeline
- Uploads artifacts
- Deploys to GitHub Pages

## Next Steps

After setup:
1. Explore project structure (see architecture/project-structure.md)
2. Review component examples in `src/components/`
3. Read Astro documentation
4. Create your first page
5. Customize styles in `src/styles/global.css`
6. Add content to collections
7. Deploy to GitHub Pages
