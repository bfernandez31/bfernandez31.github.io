# 🏆 Awwwards Portfolio - Specifications for AI-Board

## Overview
Specifications for transforming the portfolio into an Awwwards-worthy experience with smooth scroll navigation, immersive animations, and spectacular visual effects.

---

## 📦 SPEC-001: Single Page Architecture
**Goal**: Convert multi-page site to single page with sections
- Merge all pages into index.astro
- Create 5 sections: #hero, #about, #projects, #expertise, #contact
- Each section = 100vh (viewport height)
- data-section attribute for identification
- **Deliverable**: index.astro with 5 fullscreen sections

## 📦 SPEC-002: Lenis Smooth Scroll Setup
**Goal**: Configure Lenis for smooth scroll with snap
- Install/configure Lenis in main.ts
- Enable snap on sections (duration: 1.2s)
- Smooth scroll with "easeInOutExpo" easing
- Momentum scroll enabled
- **Deliverable**: src/scripts/smooth-scroll.ts configured

## 📦 SPEC-003: Vertical Navigation Dots
**Goal**: Create vertical navigation with dots
- NavigationDots.astro component
- Position fixed right: 2rem
- One dot per section (5 dots)
- Active state with scale animation
- Click to scroll to section
- **Deliverable**: src/components/ui/NavigationDots.astro

## 📦 SPEC-004: Scroll Progress Bar
**Goal**: Top scroll progress indicator
- ScrollProgress.astro component
- Position fixed top: 0
- Dynamic width based on scroll (0-100%)
- Violet/rose gradient color
- Z-index above header
- **Deliverable**: src/components/ui/ScrollProgress.astro

## 📦 SPEC-005: Custom Cursor Base
**Goal**: Replace system cursor
- CustomCursor.astro component
- Circle following mouse
- Mix-blend-mode: difference
- Scale on hover (data-cursor="hover")
- Smooth follow with GSAP quickTo
- **Deliverable**: src/components/ui/CustomCursor.astro

## 📦 SPEC-006: Cursor Trail Effect
**Goal**: Add luminous trail to cursor
- Extension of CustomCursor
- Canvas for trail drawing
- Fading particles
- Luminous violet color
- 60fps with requestAnimationFrame
- **Deliverable**: src/scripts/cursor-trail.ts

## 📦 SPEC-007: Text Split Animation
**Goal**: Text reveal animation utility
- splitText utility in animations.ts
- Split by character/word/line
- GSAP stagger animation
- data-split-text attribute
- Configurable delay
- **Deliverable**: src/scripts/text-animations.ts

## 📦 SPEC-008: Hero Glitch Effect
**Goal**: Glitch effect on hero title
- CSS keyframes animation
- RGB offset (text-shadow)
- Trigger on hover
- Random 0.3s duration
- Prefers reduced-motion safe
- **Deliverable**: src/styles/effects/glitch.css

## 📦 SPEC-009: Section Reveal on Scroll
**Goal**: Section entrance animations
- GSAP ScrollTrigger
- Fade in + translateY
- Stagger on child elements
- Trigger at 20% visible
- Once: true (no repeat)
- **Deliverable**: src/scripts/scroll-animations.ts

## 📦 SPEC-010: Parallax Backgrounds
**Goal**: Parallax effect on backgrounds
- data-speed="0.5" attribute
- Transform translateY based on scroll
- GSAP ScrollTrigger smooth
- GPU accelerated (will-change)
- Mobile: reduced effect
- **Deliverable**: src/scripts/parallax.ts

## 📦 SPEC-011: Button Ripple Effect
**Goal**: Ripple on button click
- Circle growing from click point
- 600ms ease-out animation
- Semi-transparent color
- Auto-cleanup after animation
- Touch events support
- **Deliverable**: src/scripts/ripple-effect.ts

## 📦 SPEC-012: Global Magnetic Hover
**Goal**: Magnetic effect on elements
- data-magnetic attribute
- Slightly follows mouse
- Configurable force (data-magnetic-force)
- Reset on mouseleave
- GSAP quickTo for 60fps
- **Deliverable**: src/scripts/magnetic-effect.ts

## 📦 SPEC-013: Project Cards 3D Tilt
**Goal**: 3D effect on project cards
- 3D rotation on hover
- CSS perspective
- Shine effect following mouse
- Transform-style: preserve-3d
- Smooth reset on leave
- **Deliverable**: src/scripts/tilt-effect.ts

## 📦 SPEC-014: Animated Loading Screen
**Goal**: Startup loading screen
- Preloader.astro component
- Animated 0-100 percentage
- Animated logo or text
- Fade out transition
- Min duration 1.5s
- **Deliverable**: src/components/ui/Preloader.astro

## 📦 SPEC-015: IDE Typing Animation
**Goal**: Typewriter animation for About
- Simulate typing in IDE
- Variable speed (human-like)
- Blinking CSS cursor
- Syntax highlighting support
- Pause between lines
- **Deliverable**: src/scripts/typewriter.ts

## 📦 SPEC-016: Section Color Morphing
**Goal**: Background color change on scroll
- Gradient backgrounds per section
- Smooth transition between sections
- GSAP ScrollTrigger scrub
- CSS custom properties
- Performance optimized
- **Deliverable**: src/scripts/color-morph.ts

## 📦 SPEC-017: Particle Scroll Interaction
**Goal**: Particles react to scroll
- Speed linked to scroll delta
- Dispersion on fast scroll
- Regroup at rest
- Optimized canvas
- Adaptive FPS
- **Deliverable**: Update neural-network.ts

## 📦 SPEC-018: Sound Design Toggle
**Goal**: Optional UI sounds
- Sound toggle button (mute/unmute)
- Sounds: hover, click, transition
- Web Audio API
- Adjustable volume
- LocalStorage preference
- **Deliverable**: src/scripts/sound-manager.ts

## 📦 SPEC-019: Enhanced Keyboard Navigation
**Goal**: Complete keyboard navigation
- Arrow up/down: sections
- Page Up/Down: sections
- Home/End: start/end
- Escape: close overlays
- Tab: focus management
- **Deliverable**: src/scripts/keyboard-nav.ts

## 📦 SPEC-020: Dev Performance Monitor
**Goal**: FPS monitor in dev mode
- FPS counter widget
- Memory usage
- Render time
- Visible only in dev
- Position bottom-left
- **Deliverable**: src/components/dev/PerfMonitor.astro

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Critical)
1. **SPEC-001**: Single Page Architecture
2. **SPEC-002**: Lenis Smooth Scroll Setup
3. **SPEC-003**: Vertical Navigation Dots

### Phase 2: Core Navigation (High Priority)
4. **SPEC-004**: Scroll Progress Bar
5. **SPEC-019**: Enhanced Keyboard Navigation

### Phase 3: Visual Impact (High Priority)
6. **SPEC-005**: Custom Cursor Base
7. **SPEC-006**: Cursor Trail Effect

### Phase 4: Content Animations (Medium Priority)
8. **SPEC-007**: Text Split Animation
9. **SPEC-009**: Section Reveal on Scroll
10. **SPEC-015**: IDE Typing Animation

### Phase 5: Polish Effects (Medium Priority)
11. **SPEC-008**: Hero Glitch Effect
12. **SPEC-010**: Parallax Backgrounds
13. **SPEC-011**: Button Ripple Effect
14. **SPEC-012**: Global Magnetic Hover
15. **SPEC-013**: Project Cards 3D Tilt

### Phase 6: Advanced Features (Low Priority)
16. **SPEC-014**: Animated Loading Screen
17. **SPEC-016**: Section Color Morphing
18. **SPEC-017**: Particle Scroll Interaction

### Phase 7: Optional Enhancements
19. **SPEC-018**: Sound Design Toggle
20. **SPEC-020**: Dev Performance Monitor

---

## 📊 Success Metrics
- ✅ 60fps on desktop AND mobile
- ✅ Lighthouse score > 90
- ✅ Load time < 3s
- ✅ Smooth scroll without jank
- ✅ WCAG AA accessibility maintained

## 🛠️ Technical Stack
- **GSAP ScrollTrigger** for scroll animations
- **Lenis** configured with snap and momentum
- **Three.js** (optional) for WebGL effects
- **SplitType** for text animations
- **CSS Houdini** for advanced effects

## ⏱️ Estimated Timeline
- Phase 1 (Foundation): 2-3 hours
- Phase 2-3 (Navigation & Cursor): 2-3 hours
- Phase 4-5 (Animations & Effects): 3-4 hours
- Phase 6-7 (Advanced & Optional): 2-3 hours
- **Total: 9-13 hours for complete Awwwards portfolio**

---

**Each specification is designed to be an atomic, testable AI-Board ticket** ✨