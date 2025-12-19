/**
 * TUI Navigation Script
 * Feature: PBF-32-portofolio-with-tui
 *
 * Handles sidebar file clicks, scroll to section, and active state updates
 * Works with both sidebar FileEntry and TopBar BufferTab components
 */

import type { SectionId } from '../types/tui';

// Valid section IDs
const SECTION_IDS: SectionId[] = ['hero', 'about', 'experience', 'projects', 'expertise', 'contact'];

// State
let activeSectionId: SectionId = 'hero';
let isNavigating = false;

/**
 * Initialize TUI navigation system
 */
export function initTuiNavigation(): void {
  // Setup IntersectionObserver for scroll-based active section detection
  setupIntersectionObserver();

  // Setup click handlers for file entries and buffer tabs
  setupClickHandlers();

  // Setup keyboard navigation
  setupKeyboardNavigation();

  // Handle initial hash navigation
  handleInitialHash();

  // Listen for hash changes (back/forward navigation)
  window.addEventListener('hashchange', handleHashChange);

  // Cleanup on page navigation (Astro view transitions)
  document.addEventListener('astro:before-swap', cleanup);
}

/**
 * Setup IntersectionObserver for detecting active section on scroll
 */
function setupIntersectionObserver(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-section]');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // Skip if we're in the middle of programmatic navigation
      if (isNavigating) return;

      // Find the most visible section
      let mostVisible: { id: SectionId; ratio: number } | null = null;

      for (const entry of entries) {
        const sectionId = entry.target.getAttribute('data-section') as SectionId;
        if (!sectionId || !SECTION_IDS.includes(sectionId)) continue;

        if (entry.isIntersecting) {
          if (!mostVisible || entry.intersectionRatio > mostVisible.ratio) {
            mostVisible = { id: sectionId, ratio: entry.intersectionRatio };
          }
        }
      }

      if (mostVisible && mostVisible.id !== activeSectionId) {
        setActiveSection(mostVisible.id, 'scroll');
      }
    },
    {
      threshold: [0.1, 0.3, 0.5, 0.7],
      rootMargin: '-10% 0px -10% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Setup click handlers for navigation elements
 */
function setupClickHandlers(): void {
  // File entries (sidebar)
  const fileEntries = document.querySelectorAll<HTMLAnchorElement>('.tui-file-entry');
  fileEntries.forEach((entry) => {
    entry.addEventListener('click', handleNavigationClick);
  });

  // Buffer tabs (top bar)
  const bufferTabs = document.querySelectorAll<HTMLAnchorElement>('.tui-buffer-tab');
  bufferTabs.forEach((tab) => {
    tab.addEventListener('click', handleNavigationClick);
  });
}

/**
 * Handle click on navigation element
 */
function handleNavigationClick(event: Event): void {
  event.preventDefault();
  const target = event.currentTarget as HTMLAnchorElement;
  const sectionId = target.getAttribute('data-section-id') as SectionId;

  if (sectionId && SECTION_IDS.includes(sectionId)) {
    navigateToSection(sectionId, 'click');

    // Close sidebar on mobile after navigation
    closeSidebarOnMobile();
  }
}

/**
 * Navigate to a section
 */
export function navigateToSection(sectionId: SectionId, source: 'click' | 'keyboard' | 'history' = 'click'): void {
  const section = document.getElementById(sectionId);
  if (!section) return;

  isNavigating = true;

  // Smooth scroll to section
  const viewport = document.querySelector('.tui-content__viewport');
  if (viewport) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update active state
  setActiveSection(sectionId, source);

  // Update URL hash without triggering hashchange
  if (source !== 'history') {
    history.pushState(null, '', `#${sectionId}`);
  }

  // Reset navigation flag after scroll completes
  setTimeout(() => {
    isNavigating = false;
  }, 1000);
}

/**
 * Set active section and update all UI elements
 */
function setActiveSection(sectionId: SectionId, source: 'scroll' | 'click' | 'keyboard' | 'history'): void {
  if (sectionId === activeSectionId) return;

  const previousSectionId = activeSectionId;
  activeSectionId = sectionId;

  // Update file entries (sidebar)
  updateFileEntries(sectionId);

  // Update buffer tabs (top bar)
  updateBufferTabs(sectionId);

  // Update statusline
  updateStatusLine(sectionId);

  // Update command line
  updateCommandLine(sectionId);

  // Dispatch custom event
  document.dispatchEvent(
    new CustomEvent('tui:section-change', {
      detail: {
        previousSectionId,
        currentSectionId: sectionId,
        source,
      },
    })
  );
}

/**
 * Update file entry active states
 */
function updateFileEntries(activeSectionId: SectionId): void {
  const entries = document.querySelectorAll<HTMLAnchorElement>('.tui-file-entry');
  entries.forEach((entry) => {
    const sectionId = entry.getAttribute('data-section-id');
    const isActive = sectionId === activeSectionId;
    entry.classList.toggle('is-active', isActive);
    entry.setAttribute('aria-current', isActive ? 'page' : '');
  });
}

/**
 * Update buffer tab active states
 */
function updateBufferTabs(activeSectionId: SectionId): void {
  const tabs = document.querySelectorAll<HTMLAnchorElement>('.tui-buffer-tab');
  tabs.forEach((tab) => {
    const sectionId = tab.getAttribute('data-section-id');
    const isActive = sectionId === activeSectionId;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-current', isActive ? 'page' : '');
  });
}

/**
 * Update statusline file display
 */
function updateStatusLine(sectionId: SectionId): void {
  const fileNameMap: Record<SectionId, string> = {
    hero: 'hero.tsx',
    about: 'about.tsx',
    experience: 'experience.tsx',
    projects: 'projects.tsx',
    expertise: 'expertise.tsx',
    contact: 'contact.tsx',
  };

  const fileName = fileNameMap[sectionId];
  const fileNameElement = document.querySelector('.tui-statusline__file-name');
  if (fileNameElement) {
    fileNameElement.textContent = fileName;
  }

  // Reset line/column to 1,1
  const positionElement = document.getElementById('tui-statusline-position');
  if (positionElement) {
    positionElement.innerHTML = '<span class="tui-statusline__line">Ln 1</span><span>,</span><span class="tui-statusline__column">Col 1</span>';
  }
}

/**
 * Update command line display
 */
function updateCommandLine(sectionId: SectionId): void {
  const fileNameMap: Record<SectionId, string> = {
    hero: 'hero.tsx',
    about: 'about.tsx',
    experience: 'experience.tsx',
    projects: 'projects.tsx',
    expertise: 'expertise.tsx',
    contact: 'contact.tsx',
  };

  const fileName = fileNameMap[sectionId];
  const contentElement = document.getElementById('tui-commandline-content');
  if (contentElement) {
    contentElement.textContent = `e ${fileName}`;
  }
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation(): void {
  document.addEventListener('keydown', (event) => {
    // Only handle when focus is within TUI layout
    const tuiLayout = document.querySelector('.tui-layout');
    if (!tuiLayout?.contains(document.activeElement)) return;

    // j/k for vim-style navigation within sidebar
    const sidebar = document.getElementById('tui-sidebar');
    if (sidebar?.contains(document.activeElement)) {
      const entries = Array.from(sidebar.querySelectorAll<HTMLAnchorElement>('.tui-file-entry'));
      const currentIndex = entries.findIndex((e) => e === document.activeElement);

      if (event.key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, entries.length - 1);
        entries[nextIndex]?.focus();
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        entries[prevIndex]?.focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const focused = document.activeElement as HTMLAnchorElement;
        const sectionId = focused?.getAttribute('data-section-id') as SectionId;
        if (sectionId) {
          navigateToSection(sectionId, 'keyboard');
        }
      }
    }
  });
}

/**
 * Handle initial hash in URL
 */
function handleInitialHash(): void {
  const hash = window.location.hash.slice(1) as SectionId;
  if (hash && SECTION_IDS.includes(hash)) {
    // Delay to ensure DOM is ready
    setTimeout(() => {
      navigateToSection(hash, 'history');
    }, 100);
  }
}

/**
 * Handle hash change (back/forward navigation)
 */
function handleHashChange(): void {
  const hash = window.location.hash.slice(1) as SectionId;
  if (hash && SECTION_IDS.includes(hash) && hash !== activeSectionId) {
    navigateToSection(hash, 'history');
  }
}

/**
 * Close sidebar on mobile after navigation
 */
function closeSidebarOnMobile(): void {
  if (window.innerWidth < 1024) {
    const sidebar = document.getElementById('tui-sidebar');
    const overlay = document.querySelector('.tui-sidebar-overlay');
    const toggle = document.querySelector('.tui-sidebar-toggle');

    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Get current active section
 */
export function getActiveSectionId(): SectionId {
  return activeSectionId;
}

/**
 * Cleanup function
 */
function cleanup(): void {
  window.removeEventListener('hashchange', handleHashChange);
}
