# Quickstart: Featured Project - AI-BOARD

**Feature**: PBF-23-featured-project
**Date**: 2025-12-19

## Overview

This guide provides step-by-step verification for implementing the AI-BOARD featured project and footer attribution changes.

## Prerequisites

- Bun ≥1.0.0 installed
- Repository cloned and dependencies installed (`bun install`)
- Development server available (`bun run dev`)

## Implementation Checklist

### Step 1: Update Existing Project displayOrders

Update each existing project file to increment displayOrder by 1:

```bash
# Files to modify (in src/content/projects/):
# - neural-portfolio.md: displayOrder: 1 → 2
# - ecommerce-platform.md: displayOrder: 2 → 3
# - data-visualization.md: displayOrder: 3 → 4
# - mobile-app.md: displayOrder: 4 → 5
# - saas-platform.md: displayOrder: 5 → 6
# - open-source-library.md: displayOrder: 6 → 7
```

**Verification**:
```bash
# Check displayOrder values
grep -r "displayOrder:" src/content/projects/
# Expected: All values should be 2-7, no value 1 yet
```

### Step 2: Create AI-BOARD Project Entry

Create `src/content/projects/ai-board.md`:

```yaml
---
title: "AI-BOARD"
description: "AI-powered project management board that leverages Claude AI to streamline development workflows and automate task specifications"
image: "/images/projects/ai-board.webp"
imageAlt: "AI-BOARD dashboard interface showing project boards and AI-generated specifications"
technologies: ["TypeScript", "Claude API", "Astro", "GSAP"]
featured: true
displayOrder: 1
externalUrl: "https://ai-board-three.vercel.app/"
startDate: 2024-06-01
status: "completed"
tags: ["ai", "productivity", "automation", "spec-kit"]
---

# AI-BOARD

AI-powered project management tool that transforms how development teams plan and execute features.

## Key Features

- **AI-Powered Specifications**: Automatically generate detailed feature specifications
- **Task Breakdown**: Intelligent task decomposition with dependency tracking
- **Implementation Planning**: Structured implementation plans following best practices

## What Powers This Portfolio

This portfolio was built using AI-BOARD's specification and planning tools.
```

**Verification**:
```bash
# Verify file exists
ls -la src/content/projects/ai-board.md

# Verify displayOrder is 1
grep "displayOrder:" src/content/projects/ai-board.md
# Expected: displayOrder: 1
```

### Step 3: Add Placeholder Image

Create or add image at `public/images/projects/ai-board.webp`:

```bash
# Option A: Create a simple placeholder (requires ImageMagick)
convert -size 800x600 gradient:purple-blue public/images/projects/ai-board.webp

# Option B: Copy an existing project image as temporary placeholder
cp public/images/projects/neural-portfolio.webp public/images/projects/ai-board.webp
```

**Verification**:
```bash
# Verify image exists
ls -la public/images/projects/ai-board.webp
# Expected: File exists with reasonable size
```

### Step 4: Update Footer Attribution

Modify `src/components/layout/Footer.astro`:

**Before** (lines 10-18):
```astro
<p class="footer__built">
  Built with <a
    href="https://astro.build"
    target="_blank"
    rel="noopener noreferrer">Astro</a
  > and <a href="https://bun.sh" target="_blank" rel="noopener noreferrer"
    >Bun</a
  >
</p>
```

**After**:
```astro
<p class="footer__built">
  Powered by <a
    href="https://ai-board-three.vercel.app/"
    target="_blank"
    rel="noopener noreferrer">AI-BOARD</a
  >
</p>
```

**Verification**:
```bash
# Verify footer text
grep -A5 "footer__built" src/components/layout/Footer.astro
# Expected: Contains "Powered by" and "AI-BOARD"
```

## Verification Commands

### Build Verification

```bash
# Full build (must pass)
bun run build

# Expected: Build completes without errors
# If image missing: "Could not find image" error
# If schema invalid: Zod validation error
```

### Development Server

```bash
# Start dev server
bun run dev

# Navigate to:
# - http://localhost:4321/#projects - AI-BOARD should be first project
# - http://localhost:4321/ - Footer should show "Powered by AI-BOARD"
```

### Link Verification

| Link Location | Expected URL | Opens In |
|--------------|--------------|----------|
| AI-BOARD project card | https://ai-board-three.vercel.app/ | New tab |
| Footer "AI-BOARD" | https://ai-board-three.vercel.app/ | New tab |

### Visual Verification

1. **Projects Section** (`/#projects`):
   - [ ] AI-BOARD appears as first project (leftmost/topmost)
   - [ ] Project card displays title "AI-BOARD"
   - [ ] Project card shows description
   - [ ] Technology tags visible (TypeScript, Claude API, Astro, GSAP)
   - [ ] Click navigates to external URL in new tab

2. **Footer** (any page):
   - [ ] Shows "Powered by AI-BOARD" (not "Built with Astro and Bun")
   - [ ] Link has proper hover state (color change)
   - [ ] Link opens in new tab
   - [ ] Focus indicator visible when tabbed to

3. **Project Order** (all 7 projects):
   - [ ] 1: AI-BOARD (featured)
   - [ ] 2: Neural Portfolio (featured)
   - [ ] 3: E-Commerce Platform (featured)
   - [ ] 4: Data Visualization
   - [ ] 5: Mobile App
   - [ ] 6: Team Analytics SaaS (featured)
   - [ ] 7: Open Source Library

## Accessibility Verification

```bash
# Run Lighthouse audit (if available)
bun run build && bunx lighthouse http://localhost:4322/#projects --only-categories=accessibility

# Manual checks:
# - Tab to footer link: Focus indicator visible
# - Screen reader: Link announces "AI-BOARD, link, opens in new tab"
# - Color contrast: Link text meets AA standards
```

## Troubleshooting

### Build Fails: Image Not Found

```
Error: Could not find image "/images/projects/ai-board.webp"
```

**Solution**: Create placeholder image (Step 3)

### Build Fails: Schema Validation

```
Error: Invalid frontmatter in ai-board.md
```

**Solution**: Check YAML formatting, ensure all required fields present

### Project Not Appearing First

**Solution**: Verify displayOrder values:
- ai-board.md must have `displayOrder: 1`
- No other project should have `displayOrder: 1`

### Footer Link Not Working

**Solution**: Verify href URL format includes protocol (https://)
