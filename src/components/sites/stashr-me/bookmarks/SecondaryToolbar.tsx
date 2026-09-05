'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilterState, PlatformType, ViewMode, Tag } from '@/types/stashr';
import {
  Search,
  FilterSlidersIcon,
  SelectCursorIcon,
  FolderPlusIcon,
  ViewGrid,
  ViewRow,
  ViewTimeline,
  ViewMosaic,
  PlatformIcon,
  TagDot,
  Check,
  X,
  Shuffle,
  Plus
} from '@/components/icons';
import { ArrowUpDown } from 'lucide-react';
import { soundFx } from '@/lib/sound-effects';

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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'platform' | 'tag' | 'media' | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
        setActiveSubMenu(null);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlatform = (p: PlatformType) => {
    soundFx.playTagSound();
    const next = filterState.platforms.includes(p)
      ? filterState.platforms.filter(x => x !== p)
      : [...filterState.platforms, p];
    onFilterChange({ platforms: next });
  };

  const toggleTag = (tagName: string) => {
    soundFx.playTagSound();
    const next = filterState.tags.includes(tagName)
      ? filterState.tags.filter(t => t !== tagName)
      : [...filterState.tags, tagName];
    onFilterChange({ tags: next });
  };

  const handleModeChange = (mode: ViewMode) => {
    soundFx.playClickSound();
    onViewModeChange(mode);
  };

  const totalActiveFilters =
    filterState.platforms.length +
    filterState.tags.length +
    (filterState.onlyFavorites ? 1 : 0);

  return (
    <div className="flex h-[52px] shrink-0 items-stretch justify-between gap-2 md:gap-4 border-b border-white/[0.08] bg-[#080808] pr-2 md:pr-3 pl-1.5 md:pl-2 select-none overflow-x-auto no-scrollbar">
      {/* Left: View Tabs (Grid, Row, Timeline, Mosaic) */}
      <div className="relative flex items-end gap-0.5 sm:gap-1 h-full pb-0">
        {/* Grid Tab */}
        <button
          type="button"
          aria-label="Grid"
          onClick={() => handleModeChange('grid')}
          className={`relative group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg h-full pb-2.5 pt-2 gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 text-xs sm:text-[13.5px] font-medium outline-none transition-colors cursor-pointer ${
            viewMode === 'grid'
              ? 'text-white'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ViewGrid className="size-4 sm:size-4.5" />
          <span className="inline">Grid</span>
          {viewMode === 'grid' && (
            <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-white transition-all duration-200 ease-out" />
          )}
        </button>

        {/* Row Tab */}
        <button
          type="button"
          aria-label="Row"
          onClick={() => handleModeChange('row')}
          className={`relative group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg h-full pb-2.5 pt-2 gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 text-xs sm:text-[13.5px] font-medium outline-none transition-colors cursor-pointer ${
            viewMode === 'row'
              ? 'text-white'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ViewRow className="size-4 sm:size-4.5" />
          <span className="inline">Row</span>
          {viewMode === 'row' && (
            <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-white transition-all duration-200 ease-out" />
          )}
        </button>

        {/* Timeline Tab */}
        <button
          type="button"
          aria-label="Timeline"
          onClick={() => handleModeChange('timeline')}
          className={`relative group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg h-full pb-2.5 pt-2 gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 text-xs sm:text-[13.5px] font-medium outline-none transition-colors cursor-pointer ${
            viewMode === 'timeline'
              ? 'text-white'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ViewTimeline className="size-4 sm:size-4.5" />
          <span className="inline">Timeline</span>
          {viewMode === 'timeline' && (
            <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-white transition-all duration-200 ease-out" />
          )}
        </button>

        {/* Mosaic Tab */}
        <button
          type="button"
          aria-label="Mosaic"
          onClick={() => handleModeChange('mosaic')}
          className={`relative group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-t-lg h-full pb-2.5 pt-2 gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 text-xs sm:text-[13.5px] font-medium outline-none transition-colors cursor-pointer ${
            viewMode === 'mosaic'
              ? 'text-white'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ViewMosaic className="size-4 sm:size-4.5" />
          <span className="inline">Mosaic</span>
          {viewMode === 'mosaic' && (
            <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-white transition-all duration-200 ease-out" />
          )}
        </button>
      </div>

      {/* Right: Search, Shuffle, Add Filters, Select/Cancel, + Collection */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
        {/* Search Input Box */}
        <div className="hidden w-full max-w-64 min-[936px]:block">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={filterState.query}
              onChange={e => onFilterChange({ query: e.target.value })}
              placeholder="Search bookmarks..."
              className="h-8.5 w-full min-w-0 rounded-lg border border-neutral-700/80 bg-[#121214]/60 pl-9 pr-3 py-1.5 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30"
            />
            {filterState.query && (
              <button
                onClick={() => onFilterChange({ query: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterDropdownOpen(false);
              }}
              title="Sort bookmarks"
              aria-label="Sort bookmarks"
              className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#121212] hover:bg-neutral-800 text-neutral-300 hover:text-white h-8.5 gap-1.5 px-2.5 sm:px-3 text-xs font-medium transition-colors cursor-pointer ${
                filterState.sortBy && filterState.sortBy !== 'newest' ? 'border-white text-white' : ''
              }`}
            >
              <ArrowUpDown className="size-3.5 text-neutral-400 group-hover/button:text-white" />
              <span className="hidden sm:inline">
                {filterState.sortBy === 'oldest'
                  ? 'Oldest'
                  : filterState.sortBy === 'az'
                  ? 'A → Z'
                  : filterState.sortBy === 'za'
                  ? 'Z → A'
                  : 'Sort'}
              </span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-white/10 bg-[#121212] p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Sort Order
                </div>
                {[
                  { key: 'newest', label: 'Newest first' },
                  { key: 'oldest', label: 'Oldest first' },
                  { key: 'az', label: 'Alphabetical (A - Z)' },
                  { key: 'za', label: 'Alphabetical (Z - A)' },
                ].map(opt => {
                  const isSelected = (filterState.sortBy || 'newest') === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        soundFx.playClickSound();
                        onFilterChange({ sortBy: opt.key as any });
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-800 text-white font-medium'
                          : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="size-3 text-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shuffle Button */}
          <button
            type="button"
            onClick={onShuffle}
            title="Shuffle"
            aria-label="Shuffle"
            className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#121212] hover:bg-neutral-800 text-neutral-400 hover:text-white size-8.5 transition-colors cursor-pointer"
          >
            <Shuffle className="size-4" />
          </button>

          {/* Add Filters Button & Popover */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
                setActiveSubMenu(null);
                setIsSortOpen(false);
              }}
              className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#121212] hover:bg-neutral-800 text-neutral-300 hover:text-white h-8.5 gap-1.5 px-2.5 sm:px-3 text-xs font-medium transition-colors cursor-pointer ${
                totalActiveFilters > 0 ? 'border-white text-white' : ''
              }`}
            >
              <FilterSlidersIcon className="size-3.5" />
              <span>Filters</span>
              {totalActiveFilters > 0 && (
                <span className="flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                  {totalActiveFilters}
                </span>
              )}
            </button>

            {/* Filter Dropdown & Submenus (1:1 Reference Image 3) */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 flex gap-1">
                {/* Main Filter Menu */}
                <div className="w-56 rounded-xl border border-white/10 bg-[#121212] p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 mb-1">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full bg-[#121214] border border-neutral-700/80 rounded-md px-2 py-1 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none"
                    />
                  </div>

                  {/* Menu Options */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveSubMenu('platform')}
                    onClick={() => setActiveSubMenu(activeSubMenu === 'platform' ? null : 'platform')}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors ${
                      activeSubMenu === 'platform' ? 'bg-neutral-800 text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/></svg>
                      <span>Platform</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>

                  <button
                    type="button"
                    onMouseEnter={() => setActiveSubMenu('tag')}
                    onClick={() => setActiveSubMenu(activeSubMenu === 'tag' ? null : 'tag')}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors ${
                      activeSubMenu === 'tag' ? 'bg-neutral-800 text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/></svg>
                      <span>Tag</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                      <span>Author</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>

                  <button
                    type="button"
                    onMouseEnter={() => setActiveSubMenu('media')}
                    onClick={() => setActiveSubMenu(activeSubMenu === 'media' ? null : 'media')}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors ${
                      activeSubMenu === 'media' ? 'bg-neutral-800 text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span>Media</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>Content Type</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onFilterChange({ onlyFavorites: !filterState.onlyFavorites })}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filterState.onlyFavorites ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span>Favorite</span>
                    </div>
                    {filterState.onlyFavorites && <Check className="size-3.5 text-primary" />}
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      <span>Note</span>
                    </div>
                    <span className="text-neutral-500 text-[10px]">›</span>
                  </button>
                </div>

                {/* Sub Menu Flyout for Platform (Exact Image 3 Match) */}
                {activeSubMenu === 'platform' && (
                  <div className="w-48 rounded-xl border border-white/10 bg-[#121212] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
                    <p className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400">Platform...</p>
                    <div className="space-y-0.5">
                      {platforms.map(p => {
                        const checked = filterState.platforms.includes(p.key);
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => togglePlatform(p.key)}
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <PlatformIcon platform={p.key} />
                              <span>{p.label}</span>
                            </div>
                            <div className={`size-3.5 rounded border flex items-center justify-center ${
                              checked ? 'bg-white border-white text-black' : 'border-neutral-600 bg-transparent'
                            }`}>
                              {checked && <Check className="size-2.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub Menu Flyout for Tag */}
                {activeSubMenu === 'tag' && (
                  <div className="w-52 rounded-xl border border-white/10 bg-[#121212] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
                    <p className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400">Tags...</p>
                    <div className="space-y-0.5">
                      {tags.map(t => {
                        const checked = filterState.tags.includes(t.name);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTag(t.name)}
                            className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <TagDot color={t.color} />
                              <span className="truncate">{t.name}</span>
                            </div>
                            <div className={`size-3.5 rounded border flex items-center justify-center ${
                              checked ? 'bg-white border-white text-black' : 'border-neutral-600 bg-transparent'
                            }`}>
                              {checked && <Check className="size-2.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Select / Cancel Button */}
          <button
            type="button"
            onClick={onToggleSelectionMode}
            className={`group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#121212] hover:bg-neutral-800 text-neutral-300 hover:text-white h-8.5 gap-1.5 px-3 text-xs font-medium transition-colors ${
              isSelectionMode ? 'border-white text-white' : ''
            }`}
          >
            {isSelectionMode ? (
              <>
                <X className="size-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <SelectCursorIcon className="size-3.5" />
                <span>Select</span>
              </>
            )}
          </button>

          {/* + Bookmark Button (Solid White Button) */}
          <button
            type="button"
            onClick={onOpenAddBookmark}
            className="inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs h-8.5 gap-1.5 px-3.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Bookmark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
