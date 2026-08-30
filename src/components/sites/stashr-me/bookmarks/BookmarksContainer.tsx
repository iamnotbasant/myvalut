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
  onResetFilters,
  onOpenAddBookmark,
  onOpenImage,
  onOpenDetail,
  onSelectTag,
  onGenerateTags,
  onEditTags
}: BookmarksContainerProps) {
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
            ? 'Save tweets, reddit threads, youtube videos and inspiration directly into your personal vault.'
            : 'Try adjusting your search keywords or removing filters to see more bookmarks.'}
        </p>
        <div className="mt-5 flex items-center gap-2.5">
          {allBookmarksCount === 0 ? (
            <button
              onClick={onOpenAddBookmark}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
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

        const col1Bookmarks = mediaBookmarks.filter((_, idx) => idx % 3 === 0);
        const col2Bookmarks = mediaBookmarks.filter((_, idx) => idx % 3 === 1);
        const col3Bookmarks = mediaBookmarks.filter((_, idx) => idx % 3 === 2);

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

            {/* Column 2 */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              {col2Bookmarks.map(bm => (
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

            {/* Column 3 */}
            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
              {col3Bookmarks.map(bm => (
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
        </div>
      )}
      </div>
    </div>
  );
}
