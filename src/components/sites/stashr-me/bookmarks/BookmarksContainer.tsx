'use client';

import React from 'react';
import { BookmarkItem, ViewMode } from '@/types/stashr';
import { BookmarkCard } from './BookmarkCard';
import { Sparkles, Plus, Bookmark, Archive, Trash2, Check } from '@/components/icons';
import { RotateCcw } from 'lucide-react';

interface BookmarksContainerProps {
  bookmarks: BookmarkItem[];
  allBookmarksCount: number;
  viewMode: ViewMode;
  columns: number;
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  generatingTagIds?: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenNote: (bookmark: BookmarkItem) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onArchiveSelected: () => void;
  onDeleteSelected: () => void;
  onRestoreSelected?: () => void;
  isArchivedView?: boolean;
  onResetFilters: () => void;
  onOpenAddBookmark: () => void;
  onOpenImage: (url: string) => void;
  onOpenDetail: (bookmark: BookmarkItem) => void;
  onSelectTag?: (tagName: string) => void;
  onGenerateTags?: (bookmark: BookmarkItem) => void;
  onEditTags?: (bookmark: BookmarkItem) => void;
}

export function BookmarksContainer({
  bookmarks,
  allBookmarksCount,
  viewMode,
  columns,
  selectedIds,
  isSelectionMode,
  generatingTagIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onToggleFavorite,
  onOpenNote,
  onArchive,
  onDelete,
  onArchiveSelected,
  onDeleteSelected,
  onRestoreSelected,
  isArchivedView = false,
  onResetFilters,
  onOpenAddBookmark,
  onOpenImage,
  onOpenDetail,
  onSelectTag,
  onGenerateTags,
  onEditTags
}: BookmarksContainerProps) {
  // Adaptive responsive column calculation: 1 col on mobile, 2 on tablet, N on desktop
  const [effectiveColumns, setEffectiveColumns] = React.useState(columns);

  React.useEffect(() => {
    function updateColumns() {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 640) {
        setEffectiveColumns(1);
      } else if (w < 1024) {
        setEffectiveColumns(Math.min(2, columns));
      } else {
        setEffectiveColumns(columns);
      }
    }
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Empty State
  if (bookmarks.length === 0) {
    const isArchivedView = allBookmarksCount === 0 && bookmarks.length === 0;
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground shadow-xs">
          <Bookmark className="size-6 opacity-60" />
        </div>
        <h3 className="mt-4 font-semibold text-strong text-base tracking-tight">
          {allBookmarksCount === 0 ? 'No bookmarks found' : 'No matching bookmarks'}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          {allBookmarksCount === 0
            ? isArchivedView
              ? 'Your archived vault is empty.'
              : 'Start your collection by adding your first bookmark or using our Chrome extension.'
            : 'Try adjusting your search query, clearing your tag filters, or selecting a different platform.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          {allBookmarksCount === 0 ? (
            <button
              onClick={onOpenAddBookmark}
              className="inline-flex h-8.5 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Bookmark</span>
            </button>
          ) : (
            <button
              onClick={onResetFilters}
              className="h-8 rounded-lg border border-border bg-background px-3.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto ${viewMode === 'mosaic' ? 'p-2.5 pt-2' : 'p-3 sm:p-4'}`}>
      <div className="relative flex min-h-full flex-col">
      {/* 1. ROW VIEW (Vertical list) */}
      {viewMode === 'row' && (
        <div className="flex flex-col gap-3.5 max-w-4xl mx-auto w-full">
          {bookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="row"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              isGeneratingTags={generatingTagIds?.has(bm.id)}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
              onSelectTag={onSelectTag}
              onGenerateTags={onGenerateTags}
              onEditTags={onEditTags}
            />
          ))}
        </div>
      )}

      {/* 2. TIMELINE VIEW (Vertical feed) */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
          {bookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="timeline"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              isGeneratingTags={generatingTagIds?.has(bm.id)}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
              onSelectTag={onSelectTag}
              onGenerateTags={onGenerateTags}
              onEditTags={onEditTags}
            />
          ))}
        </div>
      )}

      {/* 3. MOSAIC VIEW (Media Wall - Distributed Columns) */}
      {viewMode === 'mosaic' && (() => {
        const mediaBookmarks = bookmarks.filter(bm => Boolean(bm.imageUrl));
        
        if (mediaBookmarks.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <p className="text-xs">No media bookmarks found with images.</p>
            </div>
          );
        }

        const mosaicCols = Math.max(1, Math.min(3, effectiveColumns));
        const columnBuckets = Array.from({ length: mosaicCols }, () => [] as typeof mediaBookmarks);
        mediaBookmarks.forEach((bm, idx) => {
          columnBuckets[idx % mosaicCols].push(bm);
        });

        return (
          <div className="flex gap-2.5 items-start w-full">
            {columnBuckets.map((colBms, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-2.5 min-w-0">
                {colBms.map(bm => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    viewMode="mosaic"
                    isSelected={selectedIds.has(bm.id)}
                    isSelectionMode={isSelectionMode}
                    isGeneratingTags={generatingTagIds?.has(bm.id)}
                    onToggleSelect={() => onToggleSelect(bm.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenNote={onOpenNote}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpenImage={onOpenImage}
                    onOpenDetail={onOpenDetail}
                    onSelectTag={onSelectTag}
                    onGenerateTags={onGenerateTags}
                    onEditTags={onEditTags}
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })()}

      {/* 4. GRID VIEW (Dynamic Height Masonry Columns) */}
      {viewMode === 'grid' && (
        <div className="flex gap-3 sm:gap-4 items-start w-full">
          {Array.from({ length: effectiveColumns }).map((_, colIndex) => {
            const columnBookmarks = bookmarks.filter((_, idx) => idx % effectiveColumns === colIndex);
            if (columnBookmarks.length === 0) return null;
            return (
              <div key={colIndex} className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
                {columnBookmarks.map(bm => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    viewMode="grid"
                    isSelected={selectedIds.has(bm.id)}
                    isSelectionMode={isSelectionMode}
                    isGeneratingTags={generatingTagIds?.has(bm.id)}
                    onToggleSelect={() => onToggleSelect(bm.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenNote={onOpenNote}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpenImage={onOpenImage}
                    onOpenDetail={onOpenDetail}
                    onSelectTag={onSelectTag}
                    onGenerateTags={onGenerateTags}
                    onEditTags={onEditTags}
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
          {isArchivedView ? (
            <>
              <button
                onClick={onRestoreSelected}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Restore</span>
              </button>
              <button
                onClick={onDeleteSelected}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors shadow-xs cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Permanently</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onArchiveSelected}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Archive className="size-3.5" />
                <span>Archive</span>
              </button>
              <button
                onClick={onDeleteSelected}
                className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/20 transition-colors shadow-xs cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
