# BookmarkCard Specification

## Overview
- **Target file:** `src/components/sites/stashr-me/bookmarks/BookmarkCard.tsx`
- **Interaction model:** Hover elevation, star toggle, note dialog, tag actions, link opening.

## DOM Structure
- `article.rounded-xl.border.border-border.bg-card.p-4.flex.flex-col.gap-3.transition-all.hover:shadow-sm`
  - `header.flex.items-center.justify-between.gap-2`
    - `div.flex.items-center.gap-2.5`
      - `div.relative.size-8.rounded-full` (Avatar with fallback gradient)
      - `div.flex.flex-col`
        - `span.font-medium.text-sm.text-strong.leading-snug` (DisplayName)
        - `span.text-xs.text-muted-foreground` (`@username`)
    - `div.flex.items-center.gap-1.5`
      - `PlatformIcon` (Platform badge with official color: `#000000`, `#FF4500`, `#E4405F`, `#2563EB`, etc.)
      - `span.text-xs.text-muted-foreground` (Formatted date, e.g. "Mar 12, 2026")
  - `div.text-sm.text-foreground.leading-relaxed` (Post Text / description)
  - `div.relative.overflow-hidden.rounded-lg.border.border-border/60` (Optional image preview)
  - `footer.flex.items-center.justify-between.pt-1`
    - `div.flex.flex-wrap.gap-1.5` (Colored tag pills with dot indicator and overflow)
    - `div.flex.items-center.gap-1` (Actions: Favorite Star, Note button, Link, 3-dots Menu)
