/**
 * TUI Component Type Contracts
 * Feature: PBF-32-portofolio-with-tui
 *
 * This file defines TypeScript interfaces for all TUI components.
 * These contracts serve as the source of truth for component props and state.
 */

// =============================================================================
// Section Types
// =============================================================================

/**
 * Valid section identifiers matching URL hash anchors
 */
export type SectionId =
	| "hero"
	| "about"
	| "experience"
	| "projects"
	| "expertise"
	| "contact";

/**
 * TUI styling type determining section visual treatment
 */
export type SectionStyleType =
	| "typing" // Hero: character-by-character typing animation
	| "readme" // About: markdown README.md aesthetic
	| "git-log" // Experience: git log with branch visualization
	| "telescope" // Projects: Telescope/fzf fuzzy finder aesthetic
	| "checkhealth" // Expertise: Neovim :checkhealth output style
	| "terminal"; // Contact: terminal commands with $ prompts

/**
 * Section configuration entity
 */
export interface Section {
	/** Unique section identifier */
	id: SectionId;
	/** Human-readable display name */
	displayName: string;
	/** Simulated file name (e.g., "hero.tsx") */
	fileName: string;
	/** Nerd Font icon unicode character */
	icon: string;
	/** Display order (1-6) */
	order: number;
	/** Visual styling type */
	styleType: SectionStyleType;
}

// =============================================================================
// Layout Component Props
// =============================================================================

/**
 * TuiLayout.astro props
 * Main layout container for TUI interface
 */
export interface TuiLayoutProps {
	/** Array of section configurations */
	sections: Section[];
	/** Initial active section (default: 'hero') */
	initialSection?: SectionId;
}

/**
 * TopBar.astro props
 * tmux-style top bar with buffer tabs
 */
export interface TopBarProps {
	/** Array of buffer tabs */
	tabs: BufferTab[];
	/** Session name display (decorative) */
	sessionName?: string;
	/** Git branch display */
	gitBranch?: string;
	/** Show clock display */
	showClock?: boolean;
}

/**
 * Sidebar.astro props
 * NvimTree-style file explorer
 */
export interface SidebarProps {
	/** Array of file entries */
	files: FileEntry[];
	/** Currently active section ID */
	activeSectionId: SectionId;
	/** Whether sidebar is collapsed (mobile/tablet) */
	isCollapsed?: boolean;
	/** Callback when file is clicked */
	onFileClick?: (sectionId: SectionId) => void;
}

/**
 * StatusLine.astro props
 * Neovim-style status line
 */
export interface StatusLineProps {
	/** Vim mode indicator */
	mode?: VimMode;
	/** Active file name */
	activeFile: string;
	/** Line number */
	line?: number;
	/** Column number */
	column?: number;
	/** File type */
	fileType?: string;
	/** Git branch */
	gitBranch?: string;
}

/**
 * CommandLine.astro props
 * Decorative command line
 */
export interface CommandLineProps {
	/** Command prompt character */
	prompt?: ":" | "/" | "?";
	/** Command content */
	content?: string;
	/** Whether visible */
	isVisible?: boolean;
}

// =============================================================================
// UI Component Props
// =============================================================================

/**
 * BufferTab entity and component props
 */
export interface BufferTab {
	/** Reference section ID */
	sectionId: SectionId;
	/** Tab label */
	label: string;
	/** Window number (1-based) */
	windowNumber: number;
	/** Active state */
	isActive: boolean;
}

/**
 * BufferTab.astro component props
 */
export interface BufferTabProps extends BufferTab {
	/** Click handler */
	onClick?: () => void;
}

/**
 * FileEntry entity and component props
 */
export interface FileEntry {
	/** Reference section ID */
	sectionId: SectionId;
	/** File name display */
	fileName: string;
	/** Nerd Font icon */
	icon: string;
	/** Nesting level (always 0 per spec) */
	level: 0;
	/** Active state */
	isActive: boolean;
}

/**
 * FileEntry.astro component props
 */
export interface FileEntryProps extends FileEntry {
	/** Click handler */
	onClick?: () => void;
}

/**
 * LineNumbers.astro props
 * Line number gutter for content area
 */
export interface LineNumbersProps {
	/** Starting line number */
	startLine?: number;
	/** Number of lines to display */
	lineCount: number;
	/** Highlighted line number (optional) */
	highlightLine?: number;
}

/**
 * TypewriterText.astro props
 * Typing animation component
 */
export interface TypewriterTextProps {
	/** Full text to type */
	text: string;
	/** Characters per second */
	speed?: number;
	/** Cursor character */
	cursor?: string;
	/** Cursor blink speed (seconds) */
	cursorBlinkSpeed?: number;
	/** Start delay (seconds) */
	delay?: number;
	/** Tag to render (h1, p, span, etc.) */
	as?: keyof HTMLElementTagNameMap;
	/** Additional CSS class */
	class?: string;
}

// =============================================================================
// Section Component Props
// =============================================================================

/**
 * HeroTui.astro props
 */
export interface HeroTuiProps {
	/** Main headline text */
	headline: string;
	/** Subheadline text */
	subheadline?: string;
	/** Typing speed (chars/sec) */
	typingSpeed?: number;
	/** CTA button text */
	ctaText?: string;
	/** CTA button link */
	ctaLink?: string;
}

/**
 * AboutReadme.astro props
 */
export interface AboutReadmeProps {
	/** README title */
	title?: string;
	/** Content paragraphs */
	content: string[];
	/** List of skills/technologies */
	skills?: string[];
}

/**
 * ExperienceGitLog.astro props
 */
export interface ExperienceGitLogProps {
	/** Array of experience entries */
	experiences: ExperienceEntry[];
}

/**
 * Experience entry for git log visualization
 */
export interface ExperienceEntry {
	/** Unique ID */
	id: string;
	/** Company name */
	company: string;
	/** Role/position */
	role: string;
	/** Start date (YYYY-MM-DD or display string) */
	startDate: string;
	/** End date or 'Present' */
	endDate: string | "Present";
	/** Description items */
	description: string[];
	/** Technologies used */
	technologies: string[];
}

/**
 * ProjectsTelescope.astro props
 */
export interface ProjectsTelescopeProps {
	/** Array of project entries */
	projects: ProjectEntry[];
	/** Search placeholder text */
	searchPlaceholder?: string;
}

/**
 * Project entry for telescope/fzf visualization
 */
export interface ProjectEntry {
	/** Unique slug */
	slug: string;
	/** Project title */
	title: string;
	/** Short description */
	description: string;
	/** Technologies/tags */
	technologies: string[];
	/** GitHub URL */
	githubUrl?: string;
	/** Live demo URL */
	liveUrl?: string;
	/** Featured flag */
	isFeatured?: boolean;
}

/**
 * ExpertiseCheckhealth.astro props
 */
export interface ExpertiseCheckhealthProps {
	/** Array of skill categories */
	categories: SkillCategory[];
}

/**
 * Skill category for checkhealth visualization
 */
export interface SkillCategory {
	/** Category name */
	name: string;
	/** Skills in this category */
	skills: SkillEntry[];
}

/**
 * Individual skill entry
 */
export interface SkillEntry {
	/** Skill name */
	name: string;
	/** Proficiency level (1-5) */
	level: 1 | 2 | 3 | 4 | 5;
	/** Years of experience */
	years: number;
	/** Status: OK (3+), WARN (2), or nothing (1) */
	status: "ok" | "warn" | "note";
}

/**
 * ContactTerminal.astro props
 */
export interface ContactTerminalProps {
	/** Email address */
	email: string;
	/** GitHub URL */
	githubUrl?: string;
	/** LinkedIn URL */
	linkedinUrl?: string;
	/** Additional contact commands */
	commands?: ContactCommand[];
}

/**
 * Contact command for terminal visualization
 */
export interface ContactCommand {
	/** Command name (e.g., "email") */
	name: string;
	/** Command value (e.g., "hello@example.com") */
	value: string;
	/** Optional link URL */
	href?: string;
}

// =============================================================================
// State Types
// =============================================================================

/**
 * Vim mode (limited per spec Decision 3)
 */
export type VimMode = "NORMAL";

/**
 * Statusline composite state
 */
export interface StatusLineState {
	mode: VimMode;
	activeFile: string;
	line: number;
	column: number;
	fileType: string;
	gitBranch: string;
}

/**
 * Top bar composite state
 */
export interface TopBarState {
	tabs: BufferTab[];
	clock: string;
	gitBranch: string;
	sessionName: string;
}

/**
 * TUI navigation state
 */
export interface TuiNavigationState {
	activeSectionId: SectionId;
	previousSectionId: SectionId | null;
	isSidebarVisible: boolean;
	isSidebarCollapsed: boolean;
}

/**
 * Typing animation state
 */
export interface TypingAnimationState {
	fullText: string;
	visibleText: string;
	phase: TypingPhase;
	cursorVisible: boolean;
}

/**
 * Typing animation phase
 */
export type TypingPhase = "idle" | "typing" | "complete" | "reduced";

/**
 * Sidebar visibility state
 */
export type SidebarState = "visible" | "collapsible" | "hidden";

// =============================================================================
// Configuration Constants
// =============================================================================

/**
 * TUI responsive breakpoints
 */
export interface TuiBreakpoints {
	/** Mobile breakpoint (<768px) */
	mobile: number;
	/** Tablet breakpoint (768-1023px) */
	tablet: number;
	/** Desktop breakpoint (≥1024px) */
	desktop: number;
}

/**
 * Typing animation defaults
 */
export interface TypingAnimationDefaults {
	/** Characters per second */
	speed: number;
	/** Cursor character */
	cursor: string;
	/** Cursor blink speed (seconds) */
	cursorBlinkSpeed: number;
	/** Start delay (seconds) */
	delay: number;
}

// =============================================================================
// Event Types
// =============================================================================

/**
 * Section change event detail
 */
export interface SectionChangeEventDetail {
	previousSectionId: SectionId | null;
	currentSectionId: SectionId;
	source: "scroll" | "click" | "keyboard" | "history";
}

/**
 * Sidebar toggle event detail
 */
export interface SidebarToggleEventDetail {
	isVisible: boolean;
	trigger: "button" | "navigation" | "resize";
}
