/**
 * TUI Type Definitions
 * Feature: PBF-32-portofolio-with-tui
 */

// =============================================================================
// Section Types
// =============================================================================

/**
 * Valid section identifiers matching URL hash anchors
 */
export type SectionId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'projects'
  | 'expertise'
  | 'contact';

/**
 * TUI styling type determining section visual treatment
 */
export type SectionStyleType =
  | 'typing'        // Hero: character-by-character typing animation
  | 'readme'        // About: markdown README.md aesthetic
  | 'git-log'       // Experience: git log with branch visualization
  | 'telescope'     // Projects: Telescope/fzf fuzzy finder aesthetic
  | 'checkhealth'   // Expertise: Neovim :checkhealth output style
  | 'terminal';     // Contact: terminal commands with $ prompts

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
// Component Props
// =============================================================================

/**
 * BufferTab entity for top bar
 */
export interface BufferTab {
  sectionId: SectionId;
  label: string;
  windowNumber: number;
  isActive: boolean;
}

/**
 * FileEntry entity for sidebar
 */
export interface FileEntry {
  sectionId: SectionId;
  fileName: string;
  icon: string;
  level: 0;
  isActive: boolean;
}

/**
 * StatusLine state
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
 * Vim mode (always NORMAL per spec)
 */
export type VimMode = 'NORMAL';

/**
 * CommandLine display
 */
export interface CommandLine {
  prompt: ':' | '/' | '?';
  content: string;
  isVisible: boolean;
}

/**
 * TopBar state
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

export type TypingPhase = 'idle' | 'typing' | 'complete' | 'reduced';

/**
 * Sidebar visibility state
 */
export type SidebarState = 'visible' | 'collapsible' | 'hidden';

// =============================================================================
// Configuration Constants
// =============================================================================

/**
 * TUI responsive breakpoints
 */
export const TUI_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1024,
} as const;

/**
 * Typing animation defaults
 */
export const TYPING_DEFAULTS = {
  speed: 12.5,
  cursor: '█',
  cursorBlinkSpeed: 0.53,
  delay: 0,
} as const;

// =============================================================================
// Event Types
// =============================================================================

/**
 * Section change event detail
 */
export interface SectionChangeEventDetail {
  previousSectionId: SectionId | null;
  currentSectionId: SectionId;
  source: 'scroll' | 'click' | 'keyboard' | 'history';
}

/**
 * Sidebar toggle event detail
 */
export interface SidebarToggleEventDetail {
  isVisible: boolean;
  trigger: 'button' | 'navigation' | 'resize';
}
