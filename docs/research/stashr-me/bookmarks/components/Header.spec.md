# Header & FilterBar Specification

## Overview
- **Target files:**
  - `src/components/sites/stashr-me/bookmarks/Header.tsx`
  - `src/components/sites/stashr-me/bookmarks/FilterBar.tsx`
- **Interaction model:** Search input with live debouncing, dropdown filter menus, view mode toggles, add bookmark trigger.

## Header Structure
- `div.flex.items-center.justify-between.gap-4.w-full`
  - `div.flex.items-center.gap-3.flex-1.max-w-md`
    - Search Input with `SearchIcon`, placeholder `"Search bookmarks..."`, and keyboard badge `Cmd+K` or `/`
  - `div.flex.items-center.gap-2`
    - `Add Filters` Dropdown Button
    - View Tabs (Grid, Mosaic, List)
    - Column slider (3 to 5 columns)
    - `+ Add Bookmark` Primary Button

## FilterBar Structure
- `div.flex.items-center.gap-2.flex-wrap`
  - Filter badges with label, category, and removal `x` icon
  - `Clear all` ghost button
