# Stashr Bookmarks - Page Topology

## Visual Order and Z-Index Hierarchy

1. **Root App Shell (`h-screen overflow-hidden flex bg-sidebar text-foreground`)**
   - Fixed full-height application layout avoiding outer window scrollbars.

2. **Left Navigation Sidebar (`w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col justify-between`)**
   - **Header:** Stashr logo mark (32x32) + "Stashr" wordmark + Quick Search trigger (`Cmd+K`).
   - **Main Nav Items:**
     - Bookmarks (Counter badge: `6`)
     - Archived
     - Creators
     - Connections
   - **Collections Section:**
     - Header: "Collections" + "+" icon button
     - Dynamic Collections List (e.g. `✨ Design Inspo`, `🍔 TikTok Recipes`, `📚 Books to Read`)
   - **Tags Section:**
     - Header: "Tags" + "+" icon button
     - Dynamic Tag List with colored dots (`violet`, `amber`, `teal`, `green`, `orange`, `pink`)
   - **Footer:**
     - Download Extension CTA banner
     - Theme Toggle (Light / Dark) + Feedback dialog trigger
     - User Profile Bar: Avatar + Name ("Basant") + Email + Dropdown menu trigger

3. **Main Content Container (`flex-1 flex flex-col min-w-0 bg-background overflow-hidden`)**
   - **Header / Action Bar (`h-14 border-b border-border px-6 flex items-center justify-between gap-4 shrink-0 bg-background/80 backdrop-blur`)**
     - Search input field with search icon & shortcut badge
     - Filter Menu (`Add Filters` trigger with badge count)
     - View Switcher Tabs (Grid, Mosaic, List)
     - Columns density slider
     - Multi-Select action button
     - "+ Add Bookmark" primary button
   - **Active Filter Bar (`px-6 py-2 border-b border-border/60 flex flex-wrap gap-2 items-center text-xs`)**
     - Filter tags with removal `x` button
     - "Clear all" button
   - **Scrollable Bookmarks Viewport (`flex-1 overflow-y-auto p-6`)**
     - Multi-column grid or list of bookmark cards
     - Empty state with onboarding carousel when no items match filters

4. **Overlay Modals & Sheets (`z-50`)**
   - Add Bookmark Dialog
   - Create Collection Dialog
   - Note Editor Dialog
   - Mobile Navigation Drawer Sheet
