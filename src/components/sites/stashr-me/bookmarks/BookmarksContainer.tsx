'use client';

import React from 'react';
import { BookmarkItem, ViewMode } from '@/types/stashr';
import { BookmarkCard } from './BookmarkCard';
import { Sparkles, Plus, Bookmark, Archive, Trash2, Check } from '@/components/icons';

interface BookmarksContainerProps {
  bookmarks: BookmarkItem[];
  allBookmarksCount: number;
  viewMode: ViewMode;
  columns: number;
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenNote: (bookmark: BookmarkItem) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onArchiveSelected: () => void;
  onDeleteSelected: () => void;
  onResetFilters: () => void;
  onOpenAddBookmark: () => void;
  onOpenImage: (url: string) => void;
  onOpenDetail: (bookmark: BookmarkItem) => void;
}

function ScreenBrightnessCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#1c1c1f] px-3.5 py-2.5 text-white shadow-md transition-all hover:scale-[1.01] hover:border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="text-[13px] font-medium text-white tracking-tight">Screen Brightness</span>
        </div>
        <span className="text-xs font-medium text-emerald-400">Good</span>
      </div>
      <p className="mt-1 text-[11.5px] text-neutral-400 leading-snug">
        Auto-brightness is on. The device will auto adjust brightness.
      </p>
    </div>
  );
}

function AppUsageCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#1c1c1f] px-3.5 py-2.5 text-white shadow-md transition-all hover:scale-[1.01] hover:border-white/20 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-[13px] font-medium text-white tracking-tight">App Usage</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-neutral-500">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <div className="flex flex-col gap-1.5 pt-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="text-[13px] text-neutral-200">Google</span>
          </div>
          <span className="text-xs text-neutral-400 tabular-nums">77.2 mAh</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-[4px] overflow-hidden bg-[#e05b2b] flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-[10px] leading-none select-none">🏄</span>
            </div>
            <span className="text-[13px] text-neutral-200">Subway Surf</span>
          </div>
          <span className="text-xs text-neutral-400 tabular-nums">60.4 mAh</span>
        </div>
      </div>
    </div>
  );
}

export function BookmarksContainer({
  bookmarks,
  allBookmarksCount,
  viewMode,
  columns,
  selectedIds,
  isSelectionMode,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onToggleFavorite,
  onOpenNote,
  onArchive,
  onDelete,
  onArchiveSelected,
  onDeleteSelected,
  onResetFilters,
  onOpenAddBookmark,
  onOpenImage,
  onOpenDetail
}: BookmarksContainerProps) {
  // Empty State
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground shadow-xs">
          <Bookmark className="size-6 opacity-60" />
        </div>
        <h3 className="mt-4 font-semibold text-strong text-base tracking-tight">
          {allBookmarksCount === 0 ? 'No bookmarks saved yet' : 'No matching bookmarks'}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          {allBookmarksCount === 0
            ? 'Start saving tweets, reddit threads, and web inspiration directly into your personal vault.'
            : 'Try adjusting your search keywords or removing filters to see more bookmarks.'}
        </p>
        <div className="mt-5 flex items-center gap-2.5">
          {allBookmarksCount === 0 ? (
            <button
              onClick={onOpenAddBookmark}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Add Bookmark</span>
            </button>
          ) : (
            <button
              onClick={onResetFilters}
              className="h-8 rounded-lg border border-border bg-background px-3.5 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  // Column style map for Grid
  const getGridColsClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      case 3:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto ${viewMode === 'mosaic' ? 'p-2.5 pt-2' : 'p-4'}`}>
      <div className="relative flex min-h-full flex-col">
      {/* 1. ROW VIEW (Vertical list - Image 1 Match) */}
      {viewMode === 'row' && (
        <div className="flex flex-col gap-3.5 max-w-4xl mx-auto w-full">
          {bookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="row"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}

      {/* 2. TIMELINE VIEW (Vertical feed - Image 2 Match) */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          {bookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="timeline"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}

      {/* 3. MOSAIC VIEW (Pure Media Wall - 3 Columns Matching Original Target) */}
      {viewMode === 'mosaic' && (() => {
        const mosaicCol1Order = ['bm-wail', 'bm-dog'];
        const mosaicCol2Order = ['bm-bugged', 'bm-bladebutcher'];
        const mosaicCol3Order = ['bm-alain', 'bm-savesync-1'];

        const mediaBookmarks = bookmarks.filter(bm => Boolean(bm.imageUrl));
        
        const col1Bookmarks: BookmarkItem[] = [];
        const col2Bookmarks: BookmarkItem[] = [];
        const col3Bookmarks: BookmarkItem[] = [];

        mosaicCol1Order.forEach(id => {
          const found = mediaBookmarks.find(bm => bm.id === id);
          if (found) col1Bookmarks.push(found);
        });
        mosaicCol2Order.forEach(id => {
          const found = mediaBookmarks.find(bm => bm.id === id);
          if (found) col2Bookmarks.push(found);
        });
        mosaicCol3Order.forEach(id => {
          const found = mediaBookmarks.find(bm => bm.id === id);
          if (found) col3Bookmarks.push(found);
        });

        const handledIds = new Set([...mosaicCol1Order, ...mosaicCol2Order, ...mosaicCol3Order]);
        const otherBookmarks = mediaBookmarks.filter(bm => !handledIds.has(bm.id));
        otherBookmarks.forEach((bm, idx) => {
          if (idx % 3 === 0) col1Bookmarks.push(bm);
          else if (idx % 3 === 1) col2Bookmarks.push(bm);
          else col3Bookmarks.push(bm);
        });

        return (
          <div className="flex gap-2.5 items-start w-full">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              {col1Bookmarks.map(bm => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  viewMode="mosaic"
                  isSelected={selectedIds.has(bm.id)}
                  isSelectionMode={isSelectionMode}
                  onToggleSelect={() => onToggleSelect(bm.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenNote={onOpenNote}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onOpenImage={onOpenImage}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              {col2Bookmarks.map(bm => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  viewMode="mosaic"
                  isSelected={selectedIds.has(bm.id)}
                  isSelectionMode={isSelectionMode}
                  onToggleSelect={() => onToggleSelect(bm.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenNote={onOpenNote}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onOpenImage={onOpenImage}
                  onOpenDetail={onOpenDetail}
                />
              ))}
              <ScreenBrightnessCard />
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              {col3Bookmarks.map(bm => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  viewMode="mosaic"
                  isSelected={selectedIds.has(bm.id)}
                  isSelectionMode={isSelectionMode}
                  onToggleSelect={() => onToggleSelect(bm.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenNote={onOpenNote}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onOpenImage={onOpenImage}
                  onOpenDetail={onOpenDetail}
                />
              ))}
              <AppUsageCard />
            </div>
          </div>
        );
      })()}

      {/* 4. GRID VIEW (Dynamic Height Masonry Columns) */}
      {viewMode === 'grid' && (
        <div className="flex gap-4 items-start w-full">
          {Array.from({ length: columns }).map((_, colIndex) => {
            const columnBookmarks = bookmarks.filter((_, idx) => idx % columns === colIndex);
            if (columnBookmarks.length === 0) return null;
            return (
              <div key={colIndex} className="flex-1 flex flex-col gap-4 min-w-0">
                {columnBookmarks.map(bm => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    viewMode="grid"
                    isSelected={selectedIds.has(bm.id)}
                    isSelectionMode={isSelectionMode}
                    onToggleSelect={() => onToggleSelect(bm.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenNote={onOpenNote}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpenImage={onOpenImage}
                    onOpenDetail={onOpenDetail}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bulk Selection Action Bar */}
      {isSelectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-popover/95 px-4 py-2.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4">
          <span className="font-mono text-xs font-semibold text-strong">
            {selectedIds.size} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={onSelectAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Select all
          </button>
          <button
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={onArchiveSelected}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-accent transition-colors shadow-xs"
          >
            <Archive className="size-3.5" />
            <span>Archive</span>
          </button>
          <button
            onClick={onDeleteSelected}
            className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/20 transition-colors shadow-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
