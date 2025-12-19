/**
 * Statusline Sync Script
 * Feature: PBF-32-portofolio-with-tui
 *
 * Updates StatusLine component based on section changes and scroll position
 */

import type { SectionId, SectionChangeEventDetail } from '../types/tui';

// File name mapping
const FILE_NAMES: Record<SectionId, string> = {
  hero: 'hero.tsx',
  about: 'about.tsx',
  experience: 'experience.tsx',
  projects: 'projects.tsx',
  expertise: 'expertise.tsx',
  contact: 'contact.tsx',
};

/**
 * Initialize statusline synchronization
 */
export function initStatuslineSync(): void {
  // Listen for section change events from tui-navigation
  document.addEventListener('tui:section-change', handleSectionChange as EventListener);

  // Track scroll position for line number updates
  setupScrollTracking();

  // Cleanup on page navigation
  document.addEventListener('astro:before-swap', cleanup);
}

/**
 * Handle section change event
 */
function handleSectionChange(event: CustomEvent<SectionChangeEventDetail>): void {
  const { currentSectionId } = event.detail;
  updateStatusline(currentSectionId);
}

/**
 * Update statusline display for a section
 */
function updateStatusline(sectionId: SectionId): void {
  const fileName = FILE_NAMES[sectionId];
  if (!fileName) return;

  // Update file name
  const fileNameElement = document.querySelector('.tui-statusline__file-name');
  if (fileNameElement) {
    fileNameElement.textContent = fileName;
  }

  // Reset line/column to 1,1 when section changes
  updatePosition(1, 1, 'Top');
}

/**
 * Setup scroll tracking for line/column updates
 */
function setupScrollTracking(): void {
  const viewport = document.querySelector('.tui-content__viewport');
  if (!viewport) return;

  let ticking = false;

  viewport.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollPosition(viewport);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Update position based on scroll
 */
function updateScrollPosition(viewport: Element): void {
  const scrollTop = viewport.scrollTop;
  const scrollHeight = viewport.scrollHeight - viewport.clientHeight;

  if (scrollHeight <= 0) {
    updatePosition(1, 1, 'All');
    return;
  }

  // Calculate decorative line number based on scroll position
  // Assuming ~20 lines per viewport height
  const linesPerViewport = 20;
  const estimatedLine = Math.floor((scrollTop / viewport.clientHeight) * linesPerViewport) + 1;

  // Calculate percentage
  const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
  let percentText: string;
  if (scrollPercent <= 0) {
    percentText = 'Top';
  } else if (scrollPercent >= 100) {
    percentText = 'Bot';
  } else {
    percentText = `${scrollPercent}%`;
  }

  updatePosition(estimatedLine, 1, percentText);
}

/**
 * Update position display
 */
function updatePosition(line: number, column: number, percent: string): void {
  const positionElement = document.getElementById('tui-statusline-position');
  if (positionElement) {
    positionElement.innerHTML = `<span class="tui-statusline__line">Ln ${line}</span><span>,</span><span class="tui-statusline__column">Col ${column}</span>`;
  }

  const percentElement = document.querySelector('.tui-statusline__percent');
  if (percentElement) {
    percentElement.textContent = percent;
  }
}

/**
 * Cleanup function
 */
function cleanup(): void {
  document.removeEventListener('tui:section-change', handleSectionChange as EventListener);
}
