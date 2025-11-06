---
title: "perf: Optimize bundle size and achieve 100 Lighthouse score"
commitHash: "b8e4c1d"
description: "Techniques for reducing bundle size, improving Core Web Vitals, and achieving perfect Lighthouse scores."
author: "Your Name"
publishDate: 2024-09-20
tags: ["Performance", "Optimization", "Web Vitals"]
draft: false
featured: false
---

# Performance Optimization: From 60 to 100

Recently, I optimized a production application from a Lighthouse score of 60 to a perfect 100. Here's how.

## Initial Assessment

The main issues were:
- Large JavaScript bundle (450KB)
- Unoptimized images
- Render-blocking resources
- Poor Time to Interactive (TTI)

## Optimization Strategy

### 1. Code Splitting

Implemented route-based code splitting using dynamic imports:

```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
```

**Result**: Reduced initial bundle from 450KB to 180KB (-60%)

### 2. Image Optimization

- Converted images to WebP format
- Implemented responsive images with `srcset`
- Added lazy loading for below-the-fold images

**Result**: Reduced image payload by 70%

### 3. Critical CSS Inlining

Inlined critical CSS and deferred non-critical stylesheets:

```html
<style>/* Critical CSS here */</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

**Result**: Eliminated render-blocking stylesheets

## Results

- **Performance**: 60 → 100 (+40)
- **TTI**: 8.5s → 2.1s (-75%)
- **Bundle Size**: 450KB → 180KB (-60%)
- **LCP**: 4.2s → 1.8s (-57%)

## Key Takeaways

1. Measure before optimizing
2. Focus on user-visible metrics (LCP, FID, CLS)
3. Use browser DevTools Performance tab
4. Test on real devices, not just desktop

Performance is a feature, not an afterthought!
