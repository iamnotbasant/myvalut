'use client';

import React from 'react';
import { FilterState, Collection } from '@/types/stashr';
import { PlatformIcon, X, TagDot } from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  collections: Collection[];
  totalResults: number;
}

export function FilterBar({
  filterState,
  onFilterChange,
  collections,
  totalResults
}: FilterBarProps) {
  const activeCollection = collections.find(c => c.id === filterState.collectionId);

  const hasAnyFilter =
    filterState.query.trim() !== '' ||
    filterState.platforms.length > 0 ||
    filterState.tags.length > 0 ||
    filterState.onlyFavorites ||
    filterState.collectionId !== null;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-4 py-2 text-xs lg:px-6 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-0.5">Active filters:</span>

        {/* Collection Filter Pill */}
        {activeCollection && (
          <div className="flex items-center overflow-hidden rounded-lg bg-card text-xs shadow-xs ring-1 ring-foreground/10">
            <span className="border-r border-foreground/10 px-2 py-1 text-foreground font-medium">
              Collection: {activeCollection.name}
            </span>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onFilterChange({ collectionId: null });
              }}
              className="flex items-center px-1.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* Search Query Pill */}
        {filterState.query && (
          <div className="flex items-center overflow-hidden rounded-lg bg-card text-xs shadow-xs ring-1 ring-foreground/10">
            <span className="border-r border-foreground/10 px-2 py-1 text-foreground font-medium">
              &quot;{filterState.query}&quot;
            </span>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onFilterChange({ query: '' });
              }}
              className="flex items-center px-1.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* Platform Pills */}
        {filterState.platforms.map(platform => (
          <div
            key={platform}
            className="flex items-center overflow-hidden rounded-lg bg-card text-xs shadow-xs ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-1.5 border-r border-foreground/10 px-2 py-1 text-foreground font-medium capitalize">
              <PlatformIcon platform={platform} className="size-3" />
              <span>{platform}</span>
            </div>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onFilterChange({
                  platforms: filterState.platforms.filter(p => p !== platform)
                });
              }}
              className="flex items-center px-1.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {/* Tag Pills */}
        {filterState.tags.map(tagName => (
          <div
            key={tagName}
            className="flex items-center overflow-hidden rounded-lg bg-card text-xs shadow-xs ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-1.5 border-r border-foreground/10 px-2 py-1 text-foreground font-medium">
              <TagDot color="teal" />
              <span>{tagName}</span>
            </div>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onFilterChange({
                  tags: filterState.tags.filter(t => t !== tagName)
                });
              }}
              className="flex items-center px-1.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        {/* Favorite Filter Pill */}
        {filterState.onlyFavorites && (
          <div className="flex items-center overflow-hidden rounded-lg bg-card text-xs shadow-xs ring-1 ring-foreground/10">
            <span className="border-r border-foreground/10 px-2 py-1 text-foreground font-medium text-amber-500 flex items-center gap-1">
              ★ Favorites Only
            </span>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onFilterChange({ onlyFavorites: false });
              }}
              className="flex items-center px-1.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground tabular-nums hidden sm:inline">
          {totalResults} {totalResults === 1 ? 'result' : 'results'}
        </span>
        <button
          onClick={() => {
            soundFx.playClickSound();
            onFilterChange({
              query: '',
              platforms: [],
              tags: [],
              onlyFavorites: false,
              collectionId: null
            });
          }}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
