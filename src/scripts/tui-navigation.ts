/**
 * TUI Navigation Script
 * Feature: PBF-32-portofolio-with-tui
 * Feature: PBF-37-layout-tui (Horizontal slide navigation, viewport mode detection)
 *
 * Handles navigation between sections with:
 * - Horizontal slide animation on desktop (>= 1024px)
 * - Vertical scroll on mobile (< 1024px)
 * - Keyboard navigation (j/k, arrow keys)
 * - Browser history integration
 * - Reduced motion support
 */

import type {
	SectionId,
	ViewportMode,
	AnimationState,
	NavigationSource,
	SectionChangeEventDetail,
	AnimationStateEventDetail,
} from "../types/tui";

// Valid section IDs
const SECTION_IDS: SectionId[] = [
	"hero",
	"about",
	"experience",
	"projects",
	"expertise",
	"contact",
];

// Breakpoints
const DESKTOP_BREAKPOINT = 1024;

// Animation config (must match CSS transition duration in layout.css)
const SLIDE_DURATION = 0.4;
const REDUCED_MOTION_DURATION = 0.15;

// State
let currentSectionId: SectionId = "hero";
let currentSectionIndex = 0;
let previousSectionId: SectionId | null = null;
let viewportMode: ViewportMode = "desktop";
let animationState: AnimationState = "idle";
let lastNavigationSource: NavigationSource = "click";
let prefersReducedMotion = false;

// Media query for viewport mode
let viewportMediaQuery: MediaQueryList | null = null;
let reducedMotionMediaQuery: MediaQueryList | null = null;

// Wheel navigation state
let wheelCooldown = false;
let wheelHandler: ((e: WheelEvent) => void) | null = null;
const WHEEL_COOLDOWN_MS = 800; // Prevent rapid section changes from scroll momentum

// Lenis instance (if available)
let lenisInstance: {
	scrollTo: (target: string | HTMLElement, options?: object) => void;
} | null = null;

/**
 * Initialize TUI navigation system
 */
export function initTuiNavigation(): void {
	// Detect viewport mode
	setupViewportDetection();

	// Detect reduced motion preference
	setupReducedMotionDetection();

	// Get Lenis instance if available
	lenisInstance =
		(window as unknown as { lenis?: typeof lenisInstance }).lenis ?? null;

	// Position sections initially (desktop only)
	if (viewportMode === "desktop") {
		initializeSectionPositions();
	}

	// Setup IntersectionObserver for scroll-based detection (mobile only)
	setupIntersectionObserver();

	// Setup click handlers
	setupClickHandlers();

	// Setup keyboard navigation
	setupKeyboardNavigation();

	// Setup wheel navigation (desktop only)
	setupWheelNavigation();

	// Handle initial hash navigation
	handleInitialHash();

	// Listen for hash changes (back/forward navigation)
	window.addEventListener("popstate", handlePopState);

	// Cleanup on page navigation (Astro view transitions)
	document.addEventListener("astro:before-swap", cleanup);
}

/**
 * Setup viewport mode detection
 */
function setupViewportDetection(): void {
	viewportMediaQuery = window.matchMedia(
		`(min-width: ${DESKTOP_BREAKPOINT}px)`,
	);

	const updateViewportMode = (matches: boolean): void => {
		const newMode: ViewportMode = matches ? "desktop" : "mobile";

		if (newMode !== viewportMode) {
			viewportMode = newMode;

			// Re-initialize section positions when switching modes
			if (viewportMode === "desktop") {
				initializeSectionPositions();
			} else {
				resetSectionPositions();
			}
		}
	};

	updateViewportMode(viewportMediaQuery.matches);
	viewportMediaQuery.addEventListener("change", (e) =>
		updateViewportMode(e.matches),
	);
}

/**
 * Setup reduced motion preference detection
 */
function setupReducedMotionDetection(): void {
	reducedMotionMediaQuery = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	);

	const updateReducedMotion = (matches: boolean): void => {
		prefersReducedMotion = matches;
	};

	updateReducedMotion(reducedMotionMediaQuery.matches);
	reducedMotionMediaQuery.addEventListener("change", (e) =>
		updateReducedMotion(e.matches),
	);
}

/**
 * Initialize section positions for horizontal slide
 * CSS handles transforms via classes - we just set the right classes
 */
function initializeSectionPositions(): void {
	const sections = document.querySelectorAll<HTMLElement>(".tui-section");

	sections.forEach((section, index) => {
		// Clear any inline styles that GSAP might have set
		section.style.transform = "";
		section.style.opacity = "";

		// Remove all state classes first
		section.classList.remove("is-active", "is-previous");

		if (index === currentSectionIndex) {
			section.classList.add("is-active");
		} else if (index < currentSectionIndex) {
			section.classList.add("is-previous");
		}
		// Others: no class = default CSS (translateX(100%), opacity: 0)
	});
}

/**
 * Reset section positions for mobile vertical scroll
 */
function resetSectionPositions(): void {
	const sections = document.querySelectorAll<HTMLElement>(".tui-section");

	sections.forEach((section) => {
		// Clear inline styles and classes for mobile vertical scroll
		section.style.transform = "";
		section.style.opacity = "";
		section.classList.remove("is-active", "is-previous");
	});
}

/**
 * Setup IntersectionObserver for detecting active section on scroll (mobile)
 */
function setupIntersectionObserver(): void {
	const sections = document.querySelectorAll<HTMLElement>("[data-section]");
	if (sections.length === 0) return;

	const observer = new IntersectionObserver(
		(entries) => {
			// Only handle on mobile (vertical scroll mode)
			if (viewportMode === "desktop") return;

			// Skip if animating
			if (animationState === "animating") return;

			// Find the most visible section
			let mostVisible: { id: SectionId; ratio: number } | null = null;

			for (const entry of entries) {
				const sectionId = entry.target.getAttribute(
					"data-section",
				) as SectionId;
				if (!sectionId || !SECTION_IDS.includes(sectionId)) continue;

				if (entry.isIntersecting) {
					if (!mostVisible || entry.intersectionRatio > mostVisible.ratio) {
						mostVisible = { id: sectionId, ratio: entry.intersectionRatio };
					}
				}
			}

			if (mostVisible && mostVisible.id !== currentSectionId) {
				setActiveSection(mostVisible.id, "scroll", false);
			}
		},
		{
			threshold: [0.1, 0.3, 0.5, 0.7],
			rootMargin: "-10% 0px -10% 0px",
		},
	);

	sections.forEach((section) => observer.observe(section));
}

/**
 * Handle click on internal hash link (CTAs, back links, etc.)
 */
function handleInternalLinkClick(event: Event): void {
	event.preventDefault();
	const target = event.currentTarget as HTMLAnchorElement;
	const href = target.getAttribute("href");
	if (!href) return;

	const sectionId = href.substring(1) as SectionId;
	if (SECTION_IDS.includes(sectionId)) {
		navigateToSection(sectionId, "click");
	}
}

/**
 * Setup click handlers for navigation elements
 */
function setupClickHandlers(): void {
	// File entries (sidebar)
	const fileEntries =
		document.querySelectorAll<HTMLAnchorElement>(".tui-file-entry");
	fileEntries.forEach((entry) => {
		entry.addEventListener("click", handleNavigationClick);
	});

	// Buffer tabs (top bar)
	const bufferTabs =
		document.querySelectorAll<HTMLAnchorElement>(".tui-buffer-tab");
	bufferTabs.forEach((tab) => {
		tab.addEventListener("click", handleNavigationClick);
	});

	// Internal hash links (CTAs, back links, etc.)
	const internalLinks = document.querySelectorAll<HTMLAnchorElement>(
		'a[href^="#"]:not(.tui-skip-link):not(.tui-file-entry):not(.tui-buffer-tab)',
	);
	internalLinks.forEach((link) => {
		link.addEventListener("click", handleInternalLinkClick);
	});
}

/**
 * Handle click on navigation element
 */
function handleNavigationClick(event: Event): void {
	event.preventDefault();
	const target = event.currentTarget as HTMLAnchorElement;
	const sectionId = target.getAttribute("data-section-id") as SectionId;

	if (sectionId && SECTION_IDS.includes(sectionId)) {
		navigateToSection(sectionId, "click");

		// Close sidebar on mobile after navigation
		closeSidebarOnMobile();
	}
}

/**
 * Navigate to a section
 */
export function navigateToSection(
	sectionId: SectionId,
	source: NavigationSource = "click",
	updateHistory = true,
): void {
	const targetIndex = SECTION_IDS.indexOf(sectionId);
	if (targetIndex === -1) return;

	// Skip if already on this section
	if (sectionId === currentSectionId) return;

	// Note: We allow navigation even during animation (CSS handles transition interruption)

	lastNavigationSource = source;

	// Choose navigation method based on viewport mode
	if (viewportMode === "desktop") {
		slideToSection(targetIndex, updateHistory);
	} else {
		scrollToSection(sectionId, updateHistory);
	}
}

/**
 * Slide to section (desktop mode)
 */
function slideToSection(targetIndex: number, updateHistory = true): void {
	const sections = document.querySelectorAll<HTMLElement>(".tui-section");
	if (sections.length === 0) return;

	const targetSectionId = SECTION_IDS[targetIndex];
	const targetSection = sections[targetIndex];

	if (!targetSection) return;

	// Update animation state
	animationState = "animating";
	dispatchAnimationStateEvent("started", currentSectionId, targetSectionId);

	const duration = prefersReducedMotion
		? REDUCED_MOTION_DURATION
		: SLIDE_DURATION;

	// Update classes - mark ALL sections before target as is-previous
	// This prevents :first-child from showing hero when navigating between other sections
	sections.forEach((section, index) => {
		section.classList.remove("is-active", "is-previous");
		section.style.transform = "";
		section.style.opacity = "";

		if (index === targetIndex) {
			section.classList.add("is-active");
		} else if (index < targetIndex) {
			// All sections before the target are "previous" (hidden to left)
			section.classList.add("is-previous");
		}
		// Sections after target: no class = hidden to right (default CSS)
	});

	// Wait for CSS transition to complete
	setTimeout(() => {
		finishNavigation(targetIndex, targetSectionId, updateHistory);
	}, duration * 1000 + 50);
}

/**
 * Scroll to section (mobile mode)
 */
function scrollToSection(sectionId: SectionId, updateHistory = true): void {
	const section = document.getElementById(sectionId);
	if (!section) return;

	const targetIndex = SECTION_IDS.indexOf(sectionId);

	animationState = "animating";
	dispatchAnimationStateEvent("started", currentSectionId, sectionId);

	// Use Lenis if available, otherwise native scroll
	if (lenisInstance && !prefersReducedMotion) {
		lenisInstance.scrollTo(section, {
			offset: 0,
			duration: 0.6,
			easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
			onComplete: () => {
				finishNavigation(targetIndex, sectionId, updateHistory);
			},
		});
	} else {
		section.scrollIntoView({
			behavior: prefersReducedMotion ? "auto" : "smooth",
			block: "start",
		});

		// Estimate scroll completion
		setTimeout(
			() => {
				finishNavigation(targetIndex, sectionId, updateHistory);
			},
			prefersReducedMotion ? 50 : 600,
		);
	}
}

/**
 * Finish navigation and update state
 */
function finishNavigation(
	targetIndex: number,
	targetSectionId: SectionId,
	updateHistory: boolean,
): void {
	previousSectionId = currentSectionId;
	currentSectionId = targetSectionId;
	currentSectionIndex = targetIndex;
	animationState = "idle";

	// Update all UI elements
	updateFileEntries(targetSectionId);
	updateBufferTabs(targetSectionId);
	updateStatusLine(targetSectionId);
	updateCommandLine(targetSectionId);

	// Update browser history
	if (updateHistory) {
		history.pushState(
			{ index: targetIndex, sectionId: targetSectionId },
			"",
			`#${targetSectionId}`,
		);
	}

	// Dispatch events
	dispatchSectionChangeEvent(targetSectionId);
	dispatchAnimationStateEvent("completed", previousSectionId!, targetSectionId);
}

/**
 * Set active section (for scroll-based detection)
 */
function setActiveSection(
	sectionId: SectionId,
	source: NavigationSource,
	updateHistory = false,
): void {
	if (sectionId === currentSectionId) return;

	const targetIndex = SECTION_IDS.indexOf(sectionId);
	if (targetIndex === -1) return;

	previousSectionId = currentSectionId;
	currentSectionId = sectionId;
	currentSectionIndex = targetIndex;
	lastNavigationSource = source;

	// Update UI elements
	updateFileEntries(sectionId);
	updateBufferTabs(sectionId);
	updateStatusLine(sectionId);
	updateCommandLine(sectionId);

	// Update history
	if (updateHistory) {
		history.replaceState(
			{ index: targetIndex, sectionId },
			"",
			`#${sectionId}`,
		);
	}

	// Dispatch event
	dispatchSectionChangeEvent(sectionId);
}

/**
 * Dispatch section change event
 */
function dispatchSectionChangeEvent(sectionId: SectionId): void {
	const detail: SectionChangeEventDetail = {
		previousSectionId,
		currentSectionId: sectionId,
		source: lastNavigationSource,
	};

	document.dispatchEvent(new CustomEvent("tui:section-change", { detail }));
}

/**
 * Dispatch animation state event
 */
function dispatchAnimationStateEvent(
	state: "started" | "completed" | "cancelled",
	fromSection: SectionId,
	toSection: SectionId,
): void {
	const detail: AnimationStateEventDetail = {
		state,
		fromSection,
		toSection,
		duration: prefersReducedMotion ? REDUCED_MOTION_DURATION : SLIDE_DURATION,
	};

	document.dispatchEvent(new CustomEvent("tui:animation-state", { detail }));
}

/**
 * Update file entry active states
 */
function updateFileEntries(activeSectionId: SectionId): void {
	const entries =
		document.querySelectorAll<HTMLAnchorElement>(".tui-file-entry");
	entries.forEach((entry) => {
		const sectionId = entry.getAttribute("data-section-id");
		const isActive = sectionId === activeSectionId;
		entry.classList.toggle("is-active", isActive);
		entry.setAttribute("aria-current", isActive ? "page" : "");
	});
}

/**
 * Update buffer tab active states
 */
function updateBufferTabs(activeSectionId: SectionId): void {
	const tabs = document.querySelectorAll<HTMLAnchorElement>(".tui-buffer-tab");
	tabs.forEach((tab) => {
		const sectionId = tab.getAttribute("data-section-id");
		const isActive = sectionId === activeSectionId;
		tab.classList.toggle("is-active", isActive);
		tab.setAttribute("aria-current", isActive ? "page" : "");

		// Toggle close button visibility
		const closeBtn = tab.querySelector(".tui-buffer-tab__close");
		if (closeBtn) {
			(closeBtn as HTMLElement).style.display = isActive ? "flex" : "none";
		}
	});
}

/**
 * Update statusline file display
 */
function updateStatusLine(sectionId: SectionId): void {
	const fileNameMap: Record<SectionId, string> = {
		hero: "hero.tsx",
		about: "about.tsx",
		experience: "experience.tsx",
		projects: "projects.tsx",
		expertise: "expertise.tsx",
		contact: "contact.tsx",
	};

	const fileName = fileNameMap[sectionId];
	const fileNameElement = document.querySelector(".tui-statusline__file-name");
	if (fileNameElement) {
		fileNameElement.textContent = fileName;
	}

	// Reset line/column to 1,1
	const positionElement = document.getElementById("tui-statusline-position");
	if (positionElement) {
		positionElement.innerHTML =
			'<span class="tui-statusline__line">Ln 1</span><span>,</span><span class="tui-statusline__column">Col 1</span>';
	}
}

/**
 * Update command line display
 */
function updateCommandLine(sectionId: SectionId): void {
	const fileNameMap: Record<SectionId, string> = {
		hero: "hero.tsx",
		about: "about.tsx",
		experience: "experience.tsx",
		projects: "projects.tsx",
		expertise: "expertise.tsx",
		contact: "contact.tsx",
	};

	const fileName = fileNameMap[sectionId];
	const contentElement = document.getElementById("tui-commandline-content");
	if (contentElement) {
		contentElement.textContent = `e ${fileName}`;
	}
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation(): void {
	document.addEventListener("keydown", (event) => {
		// Only handle when focus is within TUI layout or body
		const tuiLayout = document.querySelector(".tui-layout");
		const isInTui =
			tuiLayout?.contains(document.activeElement) ||
			document.activeElement === document.body;

		if (!isInTui) return;

		// Global section navigation with j/k when not in sidebar
		const sidebar = document.getElementById("tui-sidebar");
		const isInSidebar = sidebar?.contains(document.activeElement);

		if (!isInSidebar) {
			// j/k or arrow keys for section navigation
			if (
				event.key === "j" ||
				event.key === "ArrowDown" ||
				event.key === "ArrowRight"
			) {
				event.preventDefault();
				const nextIndex = Math.min(
					currentSectionIndex + 1,
					SECTION_IDS.length - 1,
				);
				if (nextIndex !== currentSectionIndex) {
					navigateToSection(SECTION_IDS[nextIndex], "keyboard");
				}
			} else if (
				event.key === "k" ||
				event.key === "ArrowUp" ||
				event.key === "ArrowLeft"
			) {
				event.preventDefault();
				const prevIndex = Math.max(currentSectionIndex - 1, 0);
				if (prevIndex !== currentSectionIndex) {
					navigateToSection(SECTION_IDS[prevIndex], "keyboard");
				}
			}
		}

		// Sidebar-specific navigation
		if (isInSidebar) {
			const entries = Array.from(
				sidebar!.querySelectorAll<HTMLAnchorElement>(".tui-file-entry"),
			);
			const currentEntryIndex = entries.findIndex(
				(e) => e === document.activeElement,
			);

			if (event.key === "j" || event.key === "ArrowDown") {
				event.preventDefault();
				const nextIndex = Math.min(currentEntryIndex + 1, entries.length - 1);
				entries[nextIndex]?.focus();
			} else if (event.key === "k" || event.key === "ArrowUp") {
				event.preventDefault();
				const prevIndex = Math.max(currentEntryIndex - 1, 0);
				entries[prevIndex]?.focus();
			} else if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				const focused = document.activeElement as HTMLAnchorElement;
				const sectionId = focused?.getAttribute("data-section-id") as SectionId;
				if (sectionId) {
					navigateToSection(sectionId, "keyboard");
				}
			}
		}
	});
}

/**
 * Setup wheel navigation for desktop horizontal slide
 * Converts vertical scroll to horizontal section navigation
 */
function setupWheelNavigation(): void {
	const content = document.querySelector<HTMLElement>(".tui-content");
	if (!content) return;

	wheelHandler = (event: WheelEvent) => {
		// Only handle on desktop mode
		if (viewportMode !== "desktop") return;

		// Skip if in cooldown or animating
		if (wheelCooldown || animationState === "animating") return;

		// Determine scroll direction (deltaY > 0 = scroll down = next section)
		const delta = event.deltaY;
		const threshold = 30; // Minimum delta to trigger navigation

		if (Math.abs(delta) < threshold) return;

		// Prevent default scroll behavior
		event.preventDefault();

		// Start cooldown
		wheelCooldown = true;
		setTimeout(() => {
			wheelCooldown = false;
		}, WHEEL_COOLDOWN_MS);

		// Navigate based on direction
		if (delta > 0) {
			// Scroll down → next section
			const nextIndex = Math.min(
				currentSectionIndex + 1,
				SECTION_IDS.length - 1,
			);
			if (nextIndex !== currentSectionIndex) {
				navigateToSection(SECTION_IDS[nextIndex], "scroll");
			}
		} else {
			// Scroll up → previous section
			const prevIndex = Math.max(currentSectionIndex - 1, 0);
			if (prevIndex !== currentSectionIndex) {
				navigateToSection(SECTION_IDS[prevIndex], "scroll");
			}
		}
	};

	// Use passive: false to allow preventDefault
	content.addEventListener("wheel", wheelHandler, { passive: false });
}

/**
 * Handle initial hash in URL
 */
function handleInitialHash(): void {
	const hash = window.location.hash.slice(1) as SectionId;
	if (hash && SECTION_IDS.includes(hash)) {
		const targetIndex = SECTION_IDS.indexOf(hash);
		currentSectionId = hash;
		currentSectionIndex = targetIndex;

		// Position sections for initial state
		if (viewportMode === "desktop") {
			initializeSectionPositions();
		}

		// Update UI
		updateFileEntries(hash);
		updateBufferTabs(hash);
		updateStatusLine(hash);
		updateCommandLine(hash);
	}
}

/**
 * Handle popstate (back/forward navigation)
 */
function handlePopState(event: PopStateEvent): void {
	const state = event.state as { index?: number; sectionId?: SectionId } | null;

	if (state?.sectionId && SECTION_IDS.includes(state.sectionId)) {
		navigateToSection(state.sectionId, "history", false);
	} else {
		// Fallback to hash
		const hash = window.location.hash.slice(1) as SectionId;
		if (hash && SECTION_IDS.includes(hash) && hash !== currentSectionId) {
			navigateToSection(hash, "history", false);
		}
	}
}

/**
 * Close sidebar on mobile after navigation
 */
function closeSidebarOnMobile(): void {
	if (window.innerWidth < DESKTOP_BREAKPOINT) {
		const sidebar = document.getElementById("tui-sidebar");
		const overlay = document.querySelector(".tui-sidebar-overlay");
		const toggle = document.querySelector(".tui-sidebar-toggle");

		sidebar?.classList.remove("is-open");
		overlay?.classList.remove("is-visible");
		toggle?.setAttribute("aria-expanded", "false");
	}
}

/**
 * Get current active section
 */
export function getActiveSectionId(): SectionId {
	return currentSectionId;
}

/**
 * Get current section index
 */
export function getCurrentSectionIndex(): number {
	return currentSectionIndex;
}

/**
 * Get current viewport mode
 */
export function getViewportMode(): ViewportMode {
	return viewportMode;
}

/**
 * Check if animations are reduced
 */
export function isReducedMotion(): boolean {
	return prefersReducedMotion;
}

/**
 * Cleanup function
 */
function cleanup(): void {
	window.removeEventListener("popstate", handlePopState);

	if (viewportMediaQuery) {
		viewportMediaQuery.removeEventListener("change", () => {});
	}

	if (reducedMotionMediaQuery) {
		reducedMotionMediaQuery.removeEventListener("change", () => {});
	}

	// Remove wheel handler
	if (wheelHandler) {
		const content = document.querySelector<HTMLElement>(".tui-content");
		content?.removeEventListener("wheel", wheelHandler);
		wheelHandler = null;
	}
}
