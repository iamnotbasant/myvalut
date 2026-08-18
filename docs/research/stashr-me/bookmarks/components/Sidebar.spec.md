# Sidebar Specification

## Overview
- **Target file:** `src/components/sites/stashr-me/bookmarks/Sidebar.tsx`
- **Interaction model:** Click-driven navigation and theme toggling

## DOM Structure
- `aside.w-60.border-r.border-sidebar-border.bg-sidebar.flex.flex-col.h-full`
  - `div.p-4.border-b.border-sidebar-border` (Logo & Brand)
  - `div.flex-1.overflow-y-auto.p-3.space-y-6`
    - Nav Items Group (`Bookmarks`, `Archived`, `Creators`, `Connections`)
    - Collections Group (Collapsible header + items + Add button)
    - Tags Group (Header + colored tags + Add button)
  - `div.p-3.border-t.border-sidebar-border.space-y-3` (Footer: Extension banner, Theme switch, User profile)

## Computed Styles
- `background`: `var(--sidebar)` (`#fcfcfc` light / `#171717` dark)
- `color`: `var(--sidebar-foreground)`
- `activeItemBackground`: `var(--sidebar-accent)` (`#f0f0f0` light / `#2c2c2c` dark)
- `activeItemColor`: `var(--sidebar-accent-foreground)` (`#404040` light / `#f0f0f0` dark)
- `borderRadius`: `calc(var(--radius) - 2px)`
