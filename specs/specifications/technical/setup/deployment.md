# Deployment Guide

## Overview

The portfolio deploys automatically to GitHub Pages using GitHub Actions. Every push to the main branch triggers a build and deployment workflow that compiles the site and publishes it to GitHub's CDN.

## GitHub Pages Configuration

### Repository Settings

**Enable GitHub Pages**:
1. Navigate to repository Settings
2. Go to Pages section
3. Set Source to "GitHub Actions"
4. Save configuration

**Custom Domain** (optional):
1. Add CNAME file to `public/` directory
2. Configure DNS with your domain provider
3. Add domain in GitHub Pages settings
4. Wait for DNS propagation (up to 48 hours)

**HTTPS**:
- Enabled automatically for github.io domains
- Enabled automatically for custom domains with proper DNS

### Site Configuration

**Base URL** (`astro.config.mjs`):
```javascript
export default defineConfig({
  site: "https://b-fernandez.github.io",
  base: "/portfolio",
});
```

**Configuration Options**:
- `site` - Full site URL (required for sitemap, RSS)
- `base` - Path prefix for deployment (`/portfolio` for GitHub Pages)

**Custom Domain** (modify if using custom domain):
```javascript
export default defineConfig({
  site: "https://yourdomain.com",
  base: "/",
});
```

## Deployment Workflow

### Automatic Deployment

**Trigger**: Push to main branch

**Process**:
1. Checkout repository
2. Setup Bun runtime (v1.0+)
3. Install dependencies (`bun install`)
4. Run build pipeline (`bun run build`)
5. Upload build artifacts from `dist/`
6. Deploy to GitHub Pages
7. Update live site

**Workflow File** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Duration**: Typical deployment takes 2-3 minutes

**Notifications**: Check GitHub Actions tab for deployment status

### Manual Deployment

**Trigger Manually**:
1. Go to GitHub Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch (usually main)
5. Click "Run workflow" button

**Use Case**: Deploy without new commits (e.g., after settings change)

### Local Preview of Production Build

**Build Locally**:
```bash
bun run build
```

**Preview Build**:
```bash
bun run preview
```

**Access**: http://localhost:4321/portfolio

**Verification**:
- Check all pages render correctly
- Verify assets load properly
- Test navigation and links
- Check base path handling

## Build Process

### Build Steps

**1. Type Checking**:
```bash
astro check
```

Validates:
- TypeScript syntax
- Component prop types
- Import statements
- Content collection schemas

**2. Compilation**:
```bash
astro build
```

Generates:
- Static HTML files
- Optimized CSS bundles
- JavaScript for Islands
- Hashed asset filenames

**3. Optimization**:
- HTML compression (`compressHTML: true`)
- CSS minification
- JavaScript minification
- Image optimization (if using Astro Image)

**4. Output**:
```
dist/
├── index.html              # Homepage
├── about.html              # About page
├── _astro/                 # Hashed assets
│   ├── index.abc123.css
│   └── component.def456.js
├── assets/                 # Static assets from public/
├── favicon.svg
└── robots.txt
```

### Build Artifacts

**HTML Files**:
- One file per page route
- Compressed (whitespace removed)
- SEO metadata included
- Relative links adjusted for base path

**CSS Files**:
- Hashed filenames for cache busting
- Minified and optimized
- Scoped component styles merged
- Global styles included

**JavaScript Files**:
- Only for interactive Islands
- Tree-shaken and minified
- Hashed filenames
- ES module format

**Static Assets**:
- Copied from `public/` directory
- Served with original filenames
- No processing or optimization

### Build Configuration

**Environment Variables**:
```bash
NODE_ENV=production bun run build
```

**Build Options** (`astro.config.mjs`):
```javascript
export default defineConfig({
  output: "static",           // Static site generation
  compressHTML: true,         // Compress HTML output
  build: {
    inlineStylesheets: "auto" // Inline small CSS
  }
});
```

## Deployment Verification

### Automated Checks

**GitHub Actions Logs**:
1. Go to Actions tab
2. Click on latest workflow run
3. Review build and deploy steps
4. Check for errors or warnings

**Deployment Status**:
- Green checkmark: Success
- Red X: Failed (review logs)
- Yellow dot: In progress

### Manual Verification

**After Deployment**:
1. Visit deployed site: https://b-fernandez.github.io/portfolio
2. Check homepage loads correctly
3. Navigate to all major pages
4. Verify assets (images, fonts) load
5. Test interactive elements
6. Check mobile responsiveness

**Testing Checklist**:
- [ ] Homepage renders correctly
- [ ] Navigation works
- [ ] Images and assets load
- [ ] Styles applied correctly
- [ ] No console errors
- [ ] Links work (internal and external)
- [ ] Mobile responsive
- [ ] Lighthouse score ≥95

### Performance Verification

**Run Lighthouse Audit**:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Performance, Accessibility, Best Practices, SEO"
4. Click "Analyze page load"
5. Review scores (target: ≥95 for all)

**Expected Scores**:
- Performance: ≥95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Core Web Vitals**:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

## Rollback Procedures

### Revert Failed Deployment

**Option 1: Revert Git Commit**:
```bash
# Find commit hash of last working version
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Push revert
git push origin main
```

**Option 2: Re-deploy Previous Version**:
```bash
# Reset to previous commit
git reset --hard <commit-hash>

# Force push (use with caution)
git push origin main --force
```

**Option 3: Manual Workflow Run**:
1. Switch branch to last working commit
2. Manually trigger workflow
3. Wait for deployment

### Debugging Failed Deployments

**Check Build Logs**:
```bash
# Look for error messages in:
# - Type checking errors
# - Compilation errors
# - Missing dependencies
# - Configuration issues
```

**Common Issues**:

**Type Errors**:
```bash
# Fix locally first
bun run build

# Commit fix
git add .
git commit -m "fix: resolve type errors"
git push
```

**Missing Dependencies**:
```bash
# Update package.json
bun add missing-package

# Commit
git add package.json bun.lockb
git commit -m "fix: add missing dependency"
git push
```

**Configuration Errors**:
```bash
# Validate configuration locally
bun run build

# Fix astro.config.mjs if needed
# Commit and push
```

## Custom Domain Setup

### DNS Configuration

**GitHub Pages DNS** (A Records):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record** (alternative):
```
CNAME: username.github.io
```

**DNS Provider** (example for Cloudflare):
1. Add A records pointing to GitHub IPs
2. Or add CNAME record pointing to username.github.io
3. Enable proxy (orange cloud) optional
4. Wait for DNS propagation

### Update Configuration

**Add CNAME File** (`public/CNAME`):
```
yourdomain.com
```

**Update Astro Config**:
```javascript
export default defineConfig({
  site: "https://yourdomain.com",
  base: "/",
});
```

**GitHub Settings**:
1. Go to repository Settings > Pages
2. Enter custom domain
3. Check "Enforce HTTPS"
4. Save

**Verification**:
```bash
# Check DNS propagation
nslookup yourdomain.com

# Visit site
https://yourdomain.com
```

## Environment-Specific Configuration

### Production vs Development

**Development** (`bun run dev`):
- Source maps enabled
- Hot reload active
- Unminified output
- Debug logging available

**Production** (`bun run build`):
- No source maps
- Minified output
- Optimized assets
- Compressed HTML

### Environment Variables

**Production Variables** (GitHub Actions):
```yaml
env:
  NODE_ENV: production
  ASTRO_TELEMETRY_DISABLED: 1
```

**Public Variables** (`.env.production`):
```bash
PUBLIC_SITE_URL=https://yourdomain.com
PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

**Usage**:
```astro
---
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
---
```

## Monitoring and Analytics

### Deployment Monitoring

**GitHub Actions**:
- Email notifications for failures
- Slack integration (optional)
- Discord webhooks (optional)

**Uptime Monitoring**:
- Use external service (UptimeRobot, Pingdom)
- Monitor main page availability
- Alert on downtime

### Performance Monitoring

**Lighthouse CI** (optional):
```yaml
# Add to .github/workflows/deploy.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://b-fernandez.github.io/portfolio
    uploadArtifacts: true
```

**Analytics** (optional):
- Google Analytics
- Plausible Analytics
- Simple Analytics

### Error Tracking

**Console Errors**:
- Monitor browser console in production
- Use error tracking service (Sentry, LogRocket)

**404 Pages**:
- Create custom 404.astro page
- Track 404 hits in analytics

## Security Best Practices

### HTTPS Configuration

- **Always enabled** for GitHub Pages
- Enforced automatically
- Automatic certificate renewal

### Content Security Policy

**Add CSP Headers** (optional, via Cloudflare or Netlify):
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

### Secrets Management

**Never commit**:
- API keys
- Authentication tokens
- Database credentials

**Use GitHub Secrets**:
1. Go to Settings > Secrets and variables > Actions
2. Add secret
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## Deployment Checklist

**Before Deployment**:
- [ ] Run local build successfully
- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Preview build locally
- [ ] Update version in package.json (optional)

**After Deployment**:
- [ ] Verify site loads
- [ ] Check all pages
- [ ] Test navigation
- [ ] Verify assets load
- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Monitor for errors

**Post-Deployment**:
- [ ] Update documentation if needed
- [ ] Notify team of deployment
- [ ] Monitor analytics for issues
- [ ] Check error logs
