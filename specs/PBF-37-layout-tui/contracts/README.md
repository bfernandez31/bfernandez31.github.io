# API Contracts: TUI Layout Redesign

**Feature Branch**: `PBF-37-layout-tui`
**Date**: 2025-12-20

## N/A - No API Contracts

This feature is a **frontend-only UI redesign** for a static site.

There are no:
- REST API endpoints
- GraphQL schemas
- WebSocket protocols
- Server-side data contracts

## Client-Side Events

The only "contracts" are custom DOM events for inter-component communication:

### `tui:section-change` Event

```typescript
// Event dispatched when active section changes
interface SectionChangeEvent extends CustomEvent {
  detail: {
    previousSectionId: SectionId | null;
    currentSectionId: SectionId;
    source: 'click' | 'keyboard' | 'scroll' | 'history';
  };
}

// Usage
document.addEventListener('tui:section-change', (event: SectionChangeEvent) => {
  console.log(`Section changed from ${event.detail.previousSectionId} to ${event.detail.currentSectionId}`);
});
```

### `tui:animation-state` Event (new)

```typescript
// Event dispatched when animation state changes
interface AnimationStateEvent extends CustomEvent {
  detail: {
    state: 'started' | 'completed' | 'cancelled';
    fromSection: SectionId;
    toSection: SectionId;
    duration: number;
  };
}
```

## URL Hash Contract

The URL hash serves as the persistent navigation state:

| Hash | Section |
|------|---------|
| `#hero` | Hero (default) |
| `#about` | About |
| `#experience` | Experience |
| `#projects` | Projects |
| `#expertise` | Expertise |
| `#contact` | Contact |

Invalid hashes default to `#hero`.
