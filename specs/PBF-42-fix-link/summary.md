# Implementation Summary: Fix Navigation Links

**Branch**: `PBF-42-fix-link` | **Date**: 2025-12-21
**Spec**: [spec.md](spec.md)

## Changes Summary

Fixed CTA buttons (e.g., "Explore Projects") and internal hash links causing blank screens on desktop. Added generic internal link click handler (`handleInternalLinkClick`) that intercepts all `a[href^="#"]` links (excluding sidebar entries and buffer tabs), extracts the target section ID, and calls `navigateToSection()` to properly apply CSS state classes (`is-active`, `is-previous`) for smooth transitions.

## Key Decisions

- Used generic selector `a[href^="#"]:not(.tui-skip-link):not(.tui-file-entry):not(.tui-buffer-tab)` to automatically handle all current and future internal links without modifying component files
- Reused existing `navigateToSection()` function to maintain consistent behavior with sidebar/tab navigation
- Followed same fix pattern as PBF-37 (commit ff275e8) per spec requirements

## Files Modified

- `src/scripts/tui-navigation.ts` - Added `handleInternalLinkClick()` function and registration in `setupClickHandlers()` (~15 lines)

## Manual Requirements

None
