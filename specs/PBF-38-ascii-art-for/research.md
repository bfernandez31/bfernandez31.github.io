# Research: ASCII Art Generation for "BENOIT FERNANDEZ"

**Feature**: PBF-38-ascii-art-for
**Date**: 2025-12-20
**Objective**: Research FIGlet font identification, ASCII art generation methods, and responsive scaling strategies for hero section implementation

---

## 1. FIGlet Font Identification

### Finding: ANSI Shadow Font Confirmed

The CONTACT ASCII art in `/home/runner/work/ai-board/ai-board/src/components/sections/ContactTerminal.astro` uses the **ANSI Shadow** FIGlet font.

**Characteristics**:
- Uses Unicode box-drawing characters: `█ ╔ ═ ╗ ║ ╚ ╝`
- Block elements (`██`) for filled areas
- Shadow effect created with double-line box characters
- Height: 6 lines of content + 1 blank line = 7 total lines
- CONTACT width: 61 characters

**Example from ContactTerminal.astro**:
```
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝
```

**Verification**: Generated "CONTACT" using figlet.js with ANSI Shadow font - matches exactly.

---

## 2. ASCII Art Generation for "BENOIT FERNANDEZ"

### Tools & Methods

#### Option A: figlet.js (npm package) - RECOMMENDED
- **Package**: `figlet@1.9.4` (latest as of 2025)
- **Status**: Installed and tested successfully
- **TypeScript Support**: `@types/figlet@1.7.0` available
- **Font Support**: Includes ANSI Shadow font
- **Repository**: https://github.com/patorjk/figlet.js

#### Option B: Online Generators
- **patorjk.com/software/taag/**: Text to ASCII Art Generator (TAAG) - most popular online tool
- **asciiart.eu**: Free online generator with FIGlet fonts
- **Orbit2x ASCII Generator**: Modern tool for terminal splash screens

#### Option C: Command-line FIGlet
- **Not installed** in current environment
- Installation: `brew install figlet` (Mac) or `sudo apt install figlet` (Linux)
- Fonts: 500+ available, ANSI Shadow included

### Generated ASCII Art Results

#### Full Name (One Line) - DEFAULT LAYOUT
```
██████╗ ███████╗███╗   ██╗ ██████╗ ██╗████████╗    ███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗
██╔══██╗██╔════╝████╗  ██║██╔═══██╗██║╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝╚══███╔╝
██████╔╝█████╗  ██╔██╗ ██║██║   ██║██║   ██║       █████╗  █████╗  ██████╔╝██╔██╗ ██║███████║██╔██╗ ██║██║  ██║█████╗    ███╔╝
██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║██║   ██║       ██╔══╝  ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝   ███╔╝
██████╔╝███████╗██║ ╚████║╚██████╔╝██║   ██║       ██║     ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝       ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝
```
- **Width**: 127 characters
- **Height**: 7 lines (6 content + 1 blank)
- **Note**: Names displayed side-by-side with spacing

#### First Name Only - BENOIT
```
██████╗ ███████╗███╗   ██╗ ██████╗ ██╗████████╗
██╔══██╗██╔════╝████╗  ██║██╔═══██╗██║╚══██╔══╝
██████╔╝█████╗  ██╔██╗ ██║██║   ██║██║   ██║
██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║██║   ██║
██████╔╝███████╗██║ ╚████║╚██████╔╝██║   ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝
```
- **Width**: 47 characters
- **Height**: 7 lines

#### Last Name Only - FERNANDEZ
```
███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗
██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝╚══███╔╝
█████╗  █████╗  ██████╔╝██╔██╗ ██║███████║██╔██╗ ██║██║  ██║█████╗    ███╔╝
██╔══╝  ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝   ███╔╝
██║     ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝
```
- **Width**: 76 characters
- **Height**: 7 lines

#### Stacked Names (Separate Lines)
```
██████╗ ███████╗███╗   ██╗ ██████╗ ██╗████████╗
██╔══██╗██╔════╝████╗  ██║██╔═══██╗██║╚══██╔══╝
██████╔╝█████╗  ██╔██╗ ██║██║   ██║██║   ██║
██╔══██╗██╔══╝  ██║╚██╗██║██║   ██║██║   ██║
██████╔╝███████╗██║ ╚████║╚██████╔╝██║   ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝   ╚═╝

███████╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ██╗██████╗ ███████╗███████╗
██╔════╝██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝╚══███╔╝
█████╗  █████╗  ██████╔╝██╔██╗ ██║███████║██╔██╗ ██║██║  ██║█████╗    ███╔╝
██╔══╝  ██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝   ███╔╝
██║     ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚████║██████╔╝███████╗███████╗
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝
```
- **Width**: 76 characters (max of both)
- **Height**: 14 lines (7 + 1 blank + 7)

---

## 3. Layout Options Analysis

FIGlet supports 5 horizontal layout modes:

| Layout | Width | Description | Visual Quality |
|--------|-------|-------------|----------------|
| **default** | 127 chars | Font designer's intended kerning | ✅ Best |
| **full** | 127 chars | Full letter spacing (no kerning) | ✅ Same as default |
| **fitted** | 127 chars | Letters touch but don't overlap | ✅ Same as default |
| **controlled smushing** | 127 chars | Controlled character overlap | ✅ Same as default |
| **universal smushing** | 114 chars | Aggressive character merging | ⚠️ Distorted/broken |

**Recommendation**: Use `default` layout (matches CONTACT pattern, cleanest output)

---

## 4. Line Break Strategy

### Single Line (Horizontal)
- **Pros**: Consistent with typical name display, single visual element
- **Cons**: Very wide (127 chars), will overflow on mobile devices
- **Best for**: Desktop only (≥1280px width)

### Stacked Names (Vertical)
- **Pros**: Narrower (76 chars max), better mobile compatibility, dramatic presentation
- **Cons**: Taller (14 lines vs 7), takes more vertical space
- **Best for**: All devices, responsive design

### Side-by-Side (Current figlet output)
- **Same as Single Line** - figlet naturally puts them side-by-side when space allows

**Recommendation**: **Use stacked names** for better mobile responsiveness.
- Desktop (≥1024px): 76 chars fits comfortably
- Tablet (768-1023px): 76 chars still fits
- Mobile (320-767px): 76 chars requires font-size scaling but avoids horizontal scroll

---

## 5. Responsive Scaling Strategies

### Research Findings

#### SVG Wrapper Approach (Best Practice)
**Source**: [Responsive ASCII Art Blog](https://blog.zgp.org/responsive-ascii/)

Wrap ASCII art in `<svg>` element for image-like scaling:

```html
<svg viewBox="0 0 127 7" preserveAspectRatio="xMinYMin meet">
  <text x="0" y="0" style="white-space: pre; user-select: none;">
    [ASCII art here]
  </text>
</svg>
```

**Advantages**:
- Scales proportionally like an image
- No text reflow
- Prevents text selection (user-select: none)
- Smooth scaling with CSS

**Disadvantages**:
- More complex implementation
- Requires calculating viewBox dimensions
- May affect screen reader accessibility

#### CSS-Only Approach (Simpler)
Use `<pre>` element with responsive font-sizing:

```css
.tui-hero__ascii {
  font-size: clamp(0.35rem, 1vw, 0.5rem);
  line-height: 1.2;
  overflow-x: auto;
  white-space: pre;
}
```

**Advantages**:
- Simple implementation (already used in ContactTerminal.astro)
- Semantic HTML
- Screen reader friendly with aria-label
- Direct text selection control with CSS

**Disadvantages**:
- May still overflow on very narrow viewports
- Font scaling can make text too small on mobile

#### Viewport-Based Font Sizing
Current ContactTerminal.astro approach:

```css
.tui-terminal__ascii {
  font-size: 0.5rem;
  line-height: 1.2;
}

@media (max-width: 767px) {
  .tui-terminal__ascii {
    font-size: 0.35rem;
  }
}
```

**Character Width Calculations**:
- 76 chars × 0.6em (monospace char width) = 45.6em = 456px at 0.5rem (8px)
- 76 chars × 0.6em × 0.35rem (5.6px) = 256px minimum
- Mobile viewport min: 320px ✅ Fits comfortably

**Recommendation**: **Use CSS-Only approach with clamp()** for smoother scaling:

```css
.tui-hero__ascii {
  font-size: clamp(0.3rem, 0.8vw, 0.5rem);
  line-height: 1.2;
  color: var(--color-primary);
  margin: 0 0 1rem;
  overflow-x: auto; /* fallback for extreme cases */
}
```

### Breakpoint Strategy

Based on project's responsive guidelines (mobile-first):

| Viewport | Font Size | Width Calculation | Status |
|----------|-----------|-------------------|--------|
| Mobile (<768px) | 0.3rem (4.8px) | 76 × 0.6em = 218px | ✅ Fits 320px min |
| Tablet (768-1023px) | ~0.4rem (6.4px) | 76 × 0.6em = 291px | ✅ Fits 768px |
| Desktop (≥1024px) | 0.5rem (8px) | 76 × 0.6em = 365px | ✅ Fits 1024px+ |

---

## 6. Unicode Box-Drawing Character Reference

### Characters Used in ANSI Shadow Font

| Character | Unicode | Name | Usage |
|-----------|---------|------|-------|
| `█` | U+2588 | Full Block | Filled areas, solid parts |
| `╔` | U+2554 | Box Drawings Double Down And Right | Top-left corners |
| `═` | U+2550 | Box Drawings Double Horizontal | Top/bottom borders |
| `╗` | U+2557 | Box Drawings Double Down And Left | Top-right corners |
| `║` | U+2551 | Box Drawings Double Vertical | Side borders |
| `╚` | U+255A | Box Drawings Double Up And Right | Bottom-left corners |
| `╝` | U+255D | Box Drawings Double Up And Left | Bottom-right corners |
| `╠` | U+2560 | Box Drawings Double Vertical And Right | Left T-junction |
| `╣` | U+2563 | Box Drawings Double Vertical And Left | Right T-junction |
| `╦` | U+2566 | Box Drawings Double Down And Horizontal | Top T-junction |
| `╩` | U+2569 | Box Drawings Double Up And Horizontal | Bottom T-junction |

**Font Compatibility**:
- ✅ JetBrains Mono (project's monospace font) supports all Unicode box-drawing characters
- ✅ Fallback system monospace fonts support these characters
- ✅ All modern browsers support Unicode range U+2500-257F (Box Drawing)

---

## 7. Accessibility Considerations

### Screen Reader Support
ASCII art is decorative and should be hidden from screen readers with proper labeling:

```html
<pre class="tui-hero__ascii" aria-label="Benoit Fernandez">
  [ASCII art]
</pre>
```

### Text Selection
Prevent accidental text selection that breaks visual appearance:

```css
.tui-hero__ascii {
  user-select: none;
  -webkit-user-select: none;
}
```

### Reduced Motion
ASCII art is static (no animation needed), naturally respects `prefers-reduced-motion`.

---

## 8. Performance Impact

### File Size Analysis
- **Stacked names ASCII**: ~1.2KB (76 chars × 14 lines × 1 byte/char)
- **One line ASCII**: ~900 bytes (127 chars × 7 lines)
- **Impact**: Negligible (<1% of 50KB HTML budget)

### Rendering Performance
- Static HTML (no JavaScript required for display)
- No animation overhead
- CSS-only scaling (GPU-accelerated transforms)
- **Lighthouse Impact**: None (static content)

---

## 9. Implementation Recommendations

### RECOMMENDED APPROACH

1. **ASCII Art Format**: **Stacked names** (BENOIT on top, FERNANDEZ below)
   - Better mobile responsiveness (76 chars vs 127 chars)
   - Dramatic visual presentation
   - Fits all viewports with reasonable font scaling

2. **Font**: **ANSI Shadow** (confirmed match with CONTACT section)

3. **Generation Method**: **figlet.js npm package**
   - Already installed and tested
   - Reproducible (can regenerate if needed)
   - TypeScript support

4. **Scaling Strategy**: **CSS-only with clamp()**
   ```css
   font-size: clamp(0.3rem, 0.8vw, 0.5rem);
   ```

5. **HTML Structure**: **`<pre>` element** (semantic, accessible)
   ```html
   <pre class="tui-hero__ascii" aria-label="Benoit Fernandez">
     [ASCII art]
   </pre>
   ```

6. **Typewriter Animation**: **Remove for ASCII art, keep for subheadline**
   - ASCII art appears statically (no character-by-character animation)
   - Subheadline retains typewriter effect for visual interest

### Code Generation Script

Created utility scripts for future reference:
- `/home/runner/work/ai-board/ai-board/generate-ascii.js` - Generate ASCII art
- `/home/runner/work/ai-board/ai-board/test-layouts.js` - Test layout options

Can be removed after implementation or kept for maintenance.

---

## 10. Sources & References

### FIGlet & ANSI Shadow Font
- [figlet npm package](https://www.npmjs.com/package/figlet) - JavaScript FIGlet implementation
- [figlet.js GitHub](https://github.com/patorjk/figlet.js) - FIG Driver with ANSI Shadow font
- [ANSI Shadow font file](https://github.com/xero/figlet-fonts/blob/master/ANSI%20Shadow.flf) - Font specification
- [figlet Guide: Complete NPM Package Documentation](https://generalistprogrammer.com/tutorials/figlet-npm-package-guide) - Usage guide
- [Text to ASCII Art Generator (TAAG)](https://patorjk.com/software/taag/) - Online generator

### Unicode Box-Drawing Characters
- [Box-drawing characters - Wikipedia](https://en.wikipedia.org/wiki/Box-drawing_characters) - Overview and history
- [Block Elements - Wikipedia](https://en.wikipedia.org/wiki/Block_Elements) - Block element reference
- [Box Drawing Unicode Block](https://symbl.cc/en/unicode/blocks/box-drawing/) - Character table
- [Box Drawing Character Table](https://jrgraphix.net/r/Unicode/2500-257F) - Complete reference
- [Unicode Box Drawing Block](https://www.compart.com/en/unicode/block/U+2500) - Technical specs

### Responsive ASCII Art Strategies
- [Responsive ASCII Art Blog](https://blog.zgp.org/responsive-ascii/) - SVG wrapper technique
- [Complete Responsive Web Design Guide 2025](https://ui-deploy.com/blog/complete-responsive-web-design-guide-mobile-first-development-and-breakpoint-strategies-2025) - Mobile-first strategies
- [Responsive Website Breakpoints 2025](https://topbrandingaltimeter.com/blog/responsive-website-breakpoints/) - Breakpoint best practices
- [Mastering Responsive Design](https://medium.com/@jessicajournal/mastering-responsive-design-touch-typography-breakpoints-2a1d28f69169) - Typography scaling
- [DEV Community - Responsive ASCII Art](https://dev.to/m4tt72/comment/1jlf4) - Developer insights

### ASCII Art General Resources
- [ASCII art - Wikipedia](https://en.wikipedia.org/wiki/ASCII_art) - History and techniques
- [ANSI art - Wikipedia](https://en.wikipedia.org/wiki/ANSI_art) - ANSI art overview
- [asciiart.eu](https://www.asciiart.eu/text-to-ascii-art) - Online generator
- [ASCII Art Archive Glossary](https://www.asciiart.eu/glossary) - Terminology

---

## Summary

✅ **Font Confirmed**: ANSI Shadow FIGlet font
✅ **ASCII Art Generated**: Stacked names format (76 chars × 14 lines)
✅ **Layout**: Default horizontal layout (font designer's intent)
✅ **Responsive Strategy**: CSS clamp() scaling (0.3rem - 0.5rem)
✅ **Display Method**: Semantic `<pre>` element with aria-label
✅ **Mobile Compatibility**: Fits 320px minimum viewport
✅ **Performance**: <1KB additional HTML, no JavaScript overhead
✅ **Accessibility**: Screen reader friendly, static (no animation conflicts)

**Next Step**: Proceed to implementation in HeroTui.astro component.
