'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BookmarkItem, ViewMode, Collection, Tag } from '@/types/stashr';
import { BookmarkCard } from './BookmarkCard';
import { Sparkles, Bookmark, Archive, Trash2, Check } from '@/components/icons';
import { RotateCcw, Folder, Tag as TagIcon, Plus } from 'lucide-react';

interface BookmarksContainerProps {
  bookmarks: BookmarkItem[];
  allBookmarksCount: number;
  viewMode: ViewMode;
  columns: number;
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  generatingTagIds?: Set<string>;
  summarizingIds?: Set<string>;
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
  collections?: Collection[];
  tags?: Tag[];
  onBulkAddTag?: (tagName: string) => void;
  onBulkMoveToCollection?: (collectionId: string | null) => void;
  isArchivedView?: boolean;
  onResetFilters: () => void;
  onOpenAddBookmark: () => void;
  onOpenImage: (url: string) => void;
  onOpenDetail: (bookmark: BookmarkItem) => void;
  onSelectTag?: (tagName: string) => void;
  onGenerateTags?: (bookmark: BookmarkItem) => void;
  onSummarize?: (bookmark: BookmarkItem) => void;
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
  summarizingIds,
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
  collections = [],
  tags = [],
  onBulkAddTag,
  onBulkMoveToCollection,
  isArchivedView = false,
  onResetFilters,
  onOpenAddBookmark,
  onOpenImage,
  onOpenDetail,
  onSelectTag,
  onGenerateTags,
  onSummarize,
  onEditTags
}: BookmarksContainerProps) {
  // Adaptive responsive column calculation: 1 col on mobile, 2 on tablet, N on desktop
  const [effectiveColumns, setEffectiveColumns] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 1024) return Math.min(2, columns);
      return columns;
    }
    return columns;
  });

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

  // Bulk selection menu state
  const [bulkMenu, setBulkMenu] = useState<'tag' | 'move' | null>(null);
  const [bulkTagInput, setBulkTagInput] = useState('');
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node)) {
        setBulkMenu(null);
      }
    }
    if (bulkMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bulkMenu]);

  // Progressive rendering: initial paint is instant (first 28 items), rest load smoothly
  const [renderLimit, setRenderLimit] = React.useState(28);

  React.useEffect(() => {
    setRenderLimit(28);
  }, [bookmarks.length, viewMode]);

  React.useEffect(() => {
    if (renderLimit < bookmarks.length) {
      const timer = setTimeout(() => {
        setRenderLimit(prev => Math.min(prev + 28, bookmarks.length));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [renderLimit, bookmarks.length]);

  const displayedBookmarks = React.useMemo(() => {
    return bookmarks.slice(0, renderLimit);
  }, [bookmarks, renderLimit]);

  // Empty State (rendered only when no bookmarks match query or filter)
  if (bookmarks.length === 0) {
    const isVaultEmpty = allBookmarksCount === 0;
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground shadow-xs">
          <Bookmark className="size-6 opacity-60" />
        </div>
        <h3 className="mt-4 font-semibold text-strong text-base tracking-tight">
          {isVaultEmpty ? 'No bookmarks found' : 'No matching bookmarks'}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
          {isVaultEmpty
            ? isArchivedView
              ? 'Your archived vault is empty.'
              : 'Start your collection by adding your first bookmark or using our Chrome extension.'
            : 'Try adjusting your search query, clearing your tag filters, or selecting a different platform.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          {isVaultEmpty ? (
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
    <div className={`flex-1 min-w-0 w-full max-w-full overflow-y-auto ${viewMode === 'mosaic' ? 'p-2 sm:p-2.5 pt-2' : 'p-2.5 sm:p-4'}`}>
      <div className="relative flex min-h-full flex-col min-w-0 w-full">
      {/* 1. ROW VIEW (Vertical list) */}
      {viewMode === 'row' && (
        <div className="flex flex-col gap-3 sm:gap-3.5 max-w-4xl mx-auto w-full min-w-0">
          {displayedBookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="row"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              isGeneratingTags={generatingTagIds?.has(bm.id)}
              isSummarizing={summarizingIds?.has(bm.id)}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
              onSelectTag={onSelectTag}
              onGenerateTags={onGenerateTags}
              onSummarize={onSummarize}
              onEditTags={onEditTags}
            />
          ))}
        </div>
      )}

      {/* 2. TIMELINE VIEW (Vertical feed) */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl mx-auto w-full min-w-0">
          {displayedBookmarks.map(bm => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              viewMode="timeline"
              isSelected={selectedIds.has(bm.id)}
              isSelectionMode={isSelectionMode}
              isGeneratingTags={generatingTagIds?.has(bm.id)}
              isSummarizing={summarizingIds?.has(bm.id)}
              onToggleSelect={() => onToggleSelect(bm.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenNote={onOpenNote}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenImage={onOpenImage}
              onOpenDetail={onOpenDetail}
              onSelectTag={onSelectTag}
              onGenerateTags={onGenerateTags}
              onSummarize={onSummarize}
              onEditTags={onEditTags}
            />
          ))}
        </div>
      )}

      {/* 3. MOSAIC VIEW (Media Wall - Distributed Columns) */}
      {viewMode === 'mosaic' && (() => {
        const mediaBookmarks = displayedBookmarks.filter(bm => Boolean(bm.imageUrl));
        
        if (mediaBookmarks.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <p className="text-xs">No media bookmarks found with images.</p>
            </div>
          );
        }

        const mosaicCols = effectiveColumns === 1 ? 1 : Math.max(1, Math.min(3, effectiveColumns));
        const columnBuckets = Array.from({ length: mosaicCols }, () => [] as typeof mediaBookmarks);
        mediaBookmarks.forEach((bm, idx) => {
          columnBuckets[idx % mosaicCols].push(bm);
        });

        return (
          <div className="flex gap-2 sm:gap-2.5 items-start w-full min-w-0">
            {columnBuckets.map((colBms, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-2 sm:gap-2.5 min-w-0">
                {colBms.map(bm => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    viewMode="mosaic"
                    isSelected={selectedIds.has(bm.id)}
                    isSelectionMode={isSelectionMode}
                    isGeneratingTags={generatingTagIds?.has(bm.id)}
                    isSummarizing={summarizingIds?.has(bm.id)}
                    onToggleSelect={() => onToggleSelect(bm.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenNote={onOpenNote}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpenImage={onOpenImage}
                    onOpenDetail={onOpenDetail}
                    onSelectTag={onSelectTag}
                    onGenerateTags={onGenerateTags}
                    onSummarize={onSummarize}
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
        <div className="flex gap-2.5 sm:gap-4 items-start w-full min-w-0">
          {Array.from({ length: effectiveColumns }).map((_, colIndex) => {
            const columnBookmarks = displayedBookmarks.filter((_, idx) => idx % effectiveColumns === colIndex);
            if (columnBookmarks.length === 0) return null;
            return (
              <div key={colIndex} className="flex-1 flex flex-col gap-2.5 sm:gap-4 min-w-0">
                {columnBookmarks.map(bm => (
                  <BookmarkCard
                    key={bm.id}
                    bookmark={bm}
                    viewMode="grid"
                    isSelected={selectedIds.has(bm.id)}
                    isSelectionMode={isSelectionMode}
                    isGeneratingTags={generatingTagIds?.has(bm.id)}
                    isSummarizing={summarizingIds?.has(bm.id)}
                    onToggleSelect={() => onToggleSelect(bm.id)}
                    onToggleFavorite={onToggleFavorite}
                    onOpenNote={onOpenNote}
                    onArchive={onArchive}
                    onDelete={onDelete}
                    onOpenImage={onOpenImage}
                    onOpenDetail={onOpenDetail}
                    onSelectTag={onSelectTag}
                    onGenerateTags={onGenerateTags}
                    onSummarize={onSummarize}
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
        <div ref={bulkMenuRef} className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center">
          {/* Submenu Popover: Tag */}
          {bulkMenu === 'tag' && (
            <div className="mb-2 w-64 rounded-2xl border border-white/10 bg-[#121214] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 text-xs text-neutral-200">
              <div className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <TagIcon className="size-3.5 text-purple-400" />
                <span>Tag {selectedIds.size} bookmarks</span>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (bulkTagInput.trim()) {
                    onBulkAddTag?.(bulkTagInput.trim());
                    setBulkTagInput('');
                    setBulkMenu(null);
                  }
                }}
                className="flex items-center gap-1.5 mb-2"
              >
                <input
                  type="text"
                  placeholder="New or existing tag..."
                  value={bulkTagInput}
                  onChange={e => setBulkTagInput(e.target.value)}
                  className="w-full bg-[#1e1e24] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!bulkTagInput.trim()}
                  className="rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-2.5 py-1 text-xs font-medium cursor-pointer"
                >
                  Add
                </button>
              </form>
              {tags.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-0.5 border-t border-white/10 pt-1.5">
                  <p className="text-[10px] text-neutral-400 px-1 py-0.5 font-medium">Existing tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onBulkAddTag?.(t.name);
                          setBulkMenu(null);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>#{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submenu Popover: Move to Collection */}
          {bulkMenu === 'move' && (
            <div className="mb-2 w-56 rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 text-xs text-neutral-200">
              <div className="font-semibold text-white px-2 py-1 flex items-center gap-1.5">
                <Folder className="size-3.5 text-blue-400" />
                <span>Move {selectedIds.size} bookmarks</span>
              </div>
              <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    onBulkMoveToCollection?.(null);
                    setBulkMenu(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-neutral-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span>None (Unassigned)</span>
                </button>
                {collections.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onBulkMoveToCollection?.(c.id);
                      setBulkMenu(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-neutral-200 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>📁</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-border bg-popover/95 px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 max-w-[calc(100vw-20px)] overflow-x-auto">
            <span className="font-mono text-xs font-semibold text-strong">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={onSelectAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Select all
            </button>
            <button
              onClick={onClearSelection}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear
            </button>
            <div className="h-4 w-px bg-border" />
            {!isArchivedView && (
              <>
                <button
                  type="button"
                  onClick={() => setBulkMenu(bulkMenu === 'tag' ? null : 'tag')}
                  className={`inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer ${
                    bulkMenu === 'tag' ? 'border-purple-500 text-purple-300' : ''
                  }`}
                >
                  <TagIcon className="size-3.5 text-purple-400" />
                  <span>Tag</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMenu(bulkMenu === 'move' ? null : 'move')}
                  className={`inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer ${
                    bulkMenu === 'move' ? 'border-blue-500 text-blue-300' : ''
                  }`}
                >
                  <Folder className="size-3.5 text-blue-400" />
                  <span>Move</span>
                </button>
                <div className="h-4 w-px bg-border" />
              </>
            )}
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
        </div>
      )}
      </div>
    </div>
  );
}
