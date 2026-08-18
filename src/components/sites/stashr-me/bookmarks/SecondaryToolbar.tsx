'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilterState, PlatformType, ViewMode, Tag, Collection } from '@/types/stashr';
import {
  Search,
  SlidersHorizontal,
  ViewGrid,
  ViewRow,
  ViewTimeline,
  ViewMosaic,
  Plus,
  PlatformIcon,
  TagDot,
  Check,
  X,
  Shuffle
} from '@/components/icons';

interface SecondaryToolbarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onOpenAddBookmark: () => void;
  onShuffle: () => void;
  tags: Tag[];
  platforms: { key: PlatformType; label: string }[];
}

export function SecondaryToolbar({
  filterState,
  onFilterChange,
  viewMode,
  onViewModeChange,
  isSelectionMode,
  onToggleSelectionMode,
  onOpenAddBookmark,
  onShuffle,
  tags,
  platforms
}: SecondaryToolbarProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalActiveFilters =
    filterState.platforms.length +
    filterState.tags.length +
    (filterState.onlyFavorites ? 1 : 0);

  return (
    <>
    <div className="flex h-[54px] shrink-0 items-stretch justify-between gap-4 border-b pr-2 pl-1.5">
      {/* Left: View Tabs (Grid, Row, Timeline, Mosaic) */}
      <div className="relative flex items-center gap-1">
        <button
          type="button"
          aria-label="Grid"
          onClick={() => onViewModeChange('grid')}
          className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 hit-area-r-0.75 ${
            viewMode === 'grid' ? 'text-strong' : 'text-foreground'
          }`}
        >
          <ViewGrid className="size-4" />
          <span className="hidden min-[1080px]:inline">Grid</span>
        </button>

        <button
          type="button"
          aria-label="Row"
          onClick={() => onViewModeChange('row')}
          className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 hit-area-x-0.75 ${
            viewMode === 'row' ? 'text-strong' : 'text-foreground'
          }`}
        >
          <ViewRow className="size-4" />
          <span className="hidden min-[1080px]:inline">Row</span>
        </button>

        <button
          type="button"
          aria-label="Timeline"
          onClick={() => onViewModeChange('timeline')}
          className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 hit-area-x-0.75 ${
            viewMode === 'timeline' ? 'text-strong' : 'text-foreground'
          }`}
        >
          <ViewTimeline className="size-4" />
          <span className="hidden min-[1080px]:inline">Timeline</span>
        </button>

        <button
          type="button"
          aria-label="Mosaic"
          onClick={() => onViewModeChange('mosaic')}
          className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 hit-area-l-0.75 ${
            viewMode === 'mosaic' ? 'text-strong' : 'text-foreground'
          }`}
        >
          <ViewMosaic className="size-4" />
          <span className="hidden min-[1080px]:inline">Mosaic</span>
        </button>
      </div>

      {/* Right: Search, Filter, Shuffle, Select, + Add */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        {/* Search Input Box */}
        <div className="hidden w-full max-w-64 min-[936px]:block">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filterState.query}
              onChange={e => onFilterChange({ query: e.target.value })}
              placeholder="Search bookmarks..."
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent pl-8 pr-2.5 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {filterState.query && (
              <button
                onClick={() => onFilterChange({ query: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 min-[560px]:flex">
          {/* Shuffle Button */}
          <button
            type="button"
            onClick={onShuffle}
            title="Shuffle"
            className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 border-border bg-background hover:bg-accent hover:text-accent-foreground size-8"
          >
            <Shuffle className="size-4" />
          </button>

          {/* Add Filters Dropdown Button */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 border-border bg-background hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 px-2.5 ${
                totalActiveFilters > 0 ? 'border-primary bg-primary/10 text-primary' : ''
              }`}
            >
              <SlidersHorizontal className="size-4" />
              <span>Add Filters</span>
              {totalActiveFilters > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  {totalActiveFilters}
                </span>
              )}
            </button>

            {/* Filter Popover Dropdown */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-border pb-2 text-xs font-semibold text-strong">
                  <span>Filter by</span>
                  {totalActiveFilters > 0 && (
                    <button
                      onClick={() =>
                        onFilterChange({
                          platforms: [],
                          tags: [],
                          onlyFavorites: false
                        })
                      }
                      className="text-[11px] font-normal text-muted-foreground hover:text-primary"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Platform Checkboxes */}
                <div className="py-2.5 border-b border-border space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Platform
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {platforms.map(p => {
                      const isSelected = filterState.platforms.includes(p.key);
                      return (
                        <button
                          key={p.key}
                          onClick={() => {
                            const newPlatforms = isSelected
                              ? filterState.platforms.filter(x => x !== p.key)
                              : [...filterState.platforms, p.key];
                            onFilterChange({ platforms: newPlatforms });
                          }}
                          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                            isSelected
                              ? 'bg-accent text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }`}
                        >
                          <PlatformIcon platform={p.key} className="size-3.5" />
                          <span className="truncate">{p.label}</span>
                          {isSelected && <Check className="ml-auto size-3 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tag Checkboxes */}
                <div className="pt-2.5 space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Tags
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-0.5 pr-1">
                    {tags.map(t => {
                      const isSelected = filterState.tags.includes(t.name);
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            const newTags = isSelected
                              ? filterState.tags.filter(x => x !== t.name)
                              : [...filterState.tags, t.name];
                            onFilterChange({ tags: newTags });
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                            isSelected
                              ? 'bg-accent text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }`}
                        >
                          <TagDot color={t.color} />
                          <span className="truncate">{t.name}</span>
                          {isSelected && <Check className="ml-auto size-3 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Select Toggle Button */}
          <button
            type="button"
            onClick={onToggleSelectionMode}
            className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 border-border bg-background hover:bg-accent hover:text-accent-foreground h-8 gap-1.5 px-2.5 ${
              isSelectionMode ? 'border-primary bg-primary/10 text-primary' : ''
            }`}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>
        </div>

        {/* + Add Bookmark Primary Button */}
        <button
          type="button"
          onClick={onOpenAddBookmark}
          className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 gap-1.5 px-2.5"
        >
          <Plus className="size-4" />
          <span>Add</span>
        </button>
      </div>
    </div>
    
    {/* Mobile Search Bar */}
    <div className="shrink-0 border-b px-2 py-2 min-[936px]:hidden">
      <div className="relative w-full">
        <input
          data-slot="input"
          aria-label="Search bookmarks"
          placeholder="Search bookmarks..."
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80 pl-8"
          value={filterState.query}
          onChange={e => onFilterChange({ query: e.target.value })}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
    </>
  );
}
