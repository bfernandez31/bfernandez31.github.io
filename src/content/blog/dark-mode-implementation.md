---
title: "feat: Implement dark mode with CSS custom properties"
commitHash: "a3f7b2c"
description: "Learn how to build a maintainable dark mode system using CSS custom properties and the prefers-color-scheme media query."
author: "Your Name"
publishDate: 2024-10-15
tags: ["CSS", "Accessibility", "Design Systems"]
draft: false
featured: true
---

# Implementing Dark Mode with CSS Custom Properties

Dark mode has become an essential feature for modern web applications. In this post, I'll walk through implementing a robust dark mode system using CSS custom properties.

## Why CSS Custom Properties?

CSS custom properties (also known as CSS variables) provide several advantages for theming:

1. **Single source of truth** - Define colors once, use everywhere
2. **Runtime updates** - Change themes without reloading the page
3. **Cascade support** - Inherit values through the DOM tree
4. **Browser support** - Excellent support across modern browsers

## The Implementation

Here's the basic structure:

```css
:root {
  --color-background: #ffffff;
  --color-text: #1e1e2e;
  --color-primary: #5e81ac;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1e1e2e;
    --color-text: #cdd6f4;
    --color-primary: #cba6f7;
  }
}
```

## Respecting User Preferences

The `prefers-color-scheme` media query automatically detects the user's system preference. This ensures your site respects their choice without requiring additional JavaScript.

## Best Practices

1. Always provide both light and dark variants
2. Test color contrast ratios (WCAG 2.1 AA minimum: 4.5:1)
3. Consider images and illustrations in both modes
4. Test with actual users in different environments

## Conclusion

CSS custom properties make theming straightforward and maintainable. By respecting user preferences and following accessibility guidelines, you can create a dark mode that enhances the user experience.
