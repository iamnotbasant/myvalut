# Stashr Bookmarks - Behaviors & Interaction Specification

## 1. Theme Management (Dark / Light / System)
- **Mechanism:** Persistent theme stored in `localStorage.getItem("stashr_theme")` and applied as class `dark` on `<html>`.
- **Transitions:** Smooth color transitions (`duration-150 ease-in-out`) between light and dark modes across surfaces, borders, text, and badges.
- **Trigger:** Sun/Moon toggle in the sidebar footer or user profile dropdown.

## 2. Navigation & Section Filtering
- **Navigation Tabs:**
  - `Bookmarks` (Default / Active view displaying all captured saves)
  - `Archived` (Displays archived bookmarks with restore options)
  - `Creators` (Displays list of authors / accounts)
  - `Connections` (Import integrations: X, Reddit, Instagram, TikTok, YouTube, Chrome extension)
- **Collections:** User-created smart collections with custom emoji / icons and auto-filtering.
- **Tags:** Direct tag selection from the sidebar filters the bookmarks feed by that specific tag.

## 3. Search & Multi-Facet Filtering
- **Live Search Input:** Instant debounced substring matching across bookmark titles, post text, authors, handles, and tags.
- **Keyboard Shortcuts:** Pressing `/` or `Cmd+K` / `Ctrl+K` focuses the search bar; `Escape` clears search or closes dialogs.
- **Filter Menu (`Add Filters`):**
  - **Platform filter:** Multi-select between Twitter/X, Reddit, Instagram, TikTok, YouTube, Web.
  - **Tag filter:** Multi-select from user tags (`Design`, `History`, `Travel`, `Dev`, `Productivity`, `Reading`, etc.).
  - **Date filter:** Filter by time range (Today, This Week, This Month, All Time).
- **Active Filter Pills Bar:** Displays badges for each active filter with quick-remove `x` and a "Clear all" button when filters are active.

## 4. View Modes & Grid Density
- **Modes:**
  - `Grid`: Responsive card grid with 3 to 5 columns customizable by column density slider.
  - `Mosaic`: Masonry layout adapting to dynamic card heights and media aspects.
  - `List` / `Table`: Compact row-based list with inline metadata, tags, and quick action buttons.
- **Persistence:** Current view mode and column count saved in `localStorage`.

## 5. Bookmark Interactions & Card Actions
- **Star / Favorite:** Toggle favorite state with animated star fill.
- **Notes Dialog:** View, write, edit, and save persistent rich markdown notes for any bookmark.
- **Tag Management:** Add or remove tags on a bookmark with colored tag picker.
- **Copy Link:** Copies source URL or clean link to clipboard with toast notification.
- **Archive / Delete:** Soft-delete or archive bookmarks with instant UI updates and undo toast.
- **Media Lightbox:** Clicking image/media preview opens full-resolution modal preview.

## 6. Modals & Dialogs
- **Add Bookmark Modal:** Quick URL input with automatic metadata preview, tag selector, collection picker, and note field.
- **Create Collection Modal:** Name input, description, color, and icon selector.
- **Feedback Dialog:** In-app user feedback submission.

## 7. Responsive Behavior
- **Desktop (>= 1024px):** Fixed left navigation sidebar (240px width), top action header, expandable grid.
- **Tablet (768px - 1023px):** Compact sidebar with collapsible items or icon-only mode.
- **Mobile (< 768px):** Mobile header with hamburger menu button, sliding sidebar sheet/drawer, single-column card feed, fixed bottom actions.
