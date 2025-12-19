/**
 * Typing Animation Script
 * Feature: PBF-32-portofolio-with-tui
 *
 * Hero typing effect with cursor using GSAP TextPlugin
 */

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugin
gsap.registerPlugin(TextPlugin);

/**
 * Typewriter animation options
 */
export interface TypewriterOptions {
  /** Characters per second (default: 12.5 = 80ms/char) */
  speed?: number;
  /** Cursor character (default: '█') */
  cursor?: string;
  /** Cursor blink speed in seconds (default: 0.53) */
  cursorBlinkSpeed?: number;
  /** Start delay in seconds */
  delay?: number;
  /** Callback when typing completes */
  onComplete?: () => void;
}

/**
 * Create typewriter animation for an element
 */
export function createTypewriter(
  element: HTMLElement,
  text: string,
  options: TypewriterOptions = {}
): gsap.core.Timeline {
  const {
    speed = 12.5,
    cursor = '█',
    cursorBlinkSpeed = 0.53,
    delay = 0,
    onComplete,
  } = options;

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create DOM structure for accessibility
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = text;

  const textSpan = document.createElement('span');
  textSpan.setAttribute('aria-hidden', 'true');
  textSpan.className = 'typewriter-text';

  const cursorSpan = document.createElement('span');
  cursorSpan.setAttribute('aria-hidden', 'true');
  cursorSpan.className = 'typewriter-cursor';
  cursorSpan.textContent = cursor;

  // Clear element and append structure
  element.textContent = '';
  element.appendChild(srSpan);
  element.appendChild(textSpan);
  element.appendChild(cursorSpan);

  // Create timeline
  const timeline = gsap.timeline({ paused: true });

  if (prefersReduced) {
    // Instant reveal for accessibility
    timeline.set(textSpan, { textContent: text }, delay);
    timeline.call(() => {
      cursorSpan.classList.add('typewriter-cursor--blink');
      onComplete?.();
    });
  } else {
    // Character-by-character typing animation
    timeline.to(textSpan, {
      duration: text.length / speed,
      text: { value: text },
      ease: 'none',
      delay,
      onComplete: () => {
        // Start cursor blink
        gsap.to(cursorSpan, {
          opacity: 0,
          duration: cursorBlinkSpeed / 2,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)',
        });
        onComplete?.();
      },
    });
  }

  // Play the animation
  timeline.play();

  return timeline;
}

/**
 * Create chained typewriter animations for multiple elements
 */
export function createTypewriterChain(
  items: Array<{ element: HTMLElement; text: string; options?: TypewriterOptions }>
): gsap.core.Timeline {
  const masterTimeline = gsap.timeline();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((item, index) => {
    const { element, text, options = {} } = item;
    const speed = options.speed || 12.5;
    const delay = index === 0 ? (options.delay || 0.5) : 0.3;

    // Create DOM structure
    const srSpan = document.createElement('span');
    srSpan.className = 'sr-only';
    srSpan.textContent = text;

    const textSpan = document.createElement('span');
    textSpan.setAttribute('aria-hidden', 'true');
    textSpan.className = 'typewriter-text';

    const cursorSpan = document.createElement('span');
    cursorSpan.setAttribute('aria-hidden', 'true');
    cursorSpan.className = 'typewriter-cursor';
    cursorSpan.textContent = options.cursor || '█';
    cursorSpan.style.opacity = '0'; // Hidden initially

    element.textContent = '';
    element.appendChild(srSpan);
    element.appendChild(textSpan);
    element.appendChild(cursorSpan);

    if (prefersReduced) {
      masterTimeline.set(textSpan, { textContent: text }, delay);
    } else {
      masterTimeline.to(
        textSpan,
        {
          duration: text.length / speed,
          text: { value: text },
          ease: 'none',
          onStart: () => {
            cursorSpan.style.opacity = '1';
          },
          onComplete: () => {
            if (index < items.length - 1) {
              cursorSpan.style.opacity = '0';
            } else {
              // Keep cursor blinking on last item
              gsap.to(cursorSpan, {
                opacity: 0,
                duration: 0.265,
                repeat: -1,
                yoyo: true,
                ease: 'steps(1)',
              });
            }
          },
        },
        delay
      );
    }
  });

  masterTimeline.play();
  return masterTimeline;
}

/**
 * Initialize typing animations on page
 */
export function initTypingAnimations(): void {
  // Find elements with data-typewriter attribute
  const elements = document.querySelectorAll<HTMLElement>('[data-typewriter]');

  elements.forEach((element) => {
    const text = element.getAttribute('data-typewriter') || element.textContent || '';
    const speed = parseFloat(element.getAttribute('data-typewriter-speed') || '12.5');
    const delay = parseFloat(element.getAttribute('data-typewriter-delay') || '0');

    createTypewriter(element, text, { speed, delay });
  });
}
