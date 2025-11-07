---
title: "feat: Add WCAG 2.1 AA compliance and keyboard navigation"
commitHash: "e7f8b9a"
description: "Building accessible web applications from the ground up with WCAG 2.1 AA compliance."
author: "Benoit Fernandez"
publishDate: 2024-06-15
tags: ["Accessibility", "WCAG", "Inclusive Design"]
draft: false
featured: false
---

# Accessibility-First Development

Accessibility isn't an afterthought—it's a fundamental requirement. Here's how to build accessible applications from day one.

## WCAG 2.1 AA Requirements

### 1. Color Contrast

All text must meet minimum contrast ratios:
- **Normal text**: 4.5:1
- **Large text**: 3:1
- **UI components**: 3:1

Use tools like [WebAIM's Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

### 2. Keyboard Navigation

Every interactive element must be keyboard accessible:

```jsx
function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
      tabIndex={0}
    >
      {children}
    </button>
  );
}
```

### 3. ARIA Attributes

Use ARIA to enhance semantics:

```html
<button
  aria-label="Close menu"
  aria-expanded="true"
  aria-controls="menu"
>
  ✕
</button>
```

## Testing Strategy

1. **Automated**: Use axe-core or Lighthouse
2. **Manual**: Test with keyboard only
3. **Screen readers**: NVDA (Windows), VoiceOver (macOS)
4. **Real users**: Include people with disabilities in testing

## Common Mistakes

### ❌ Don't:
```html
<div onclick="handleClick()">Click me</div>
```

### ✅ Do:
```html
<button onClick={handleClick}>Click me</button>
```

## Impact

Making your site accessible:
- **Legal compliance**: ADA, Section 508
- **SEO benefits**: Better semantic HTML
- **User experience**: 15% of population has disabilities
- **Market reach**: Broader audience

## Conclusion

Accessibility benefits everyone, not just users with disabilities. Build it in from the start!
