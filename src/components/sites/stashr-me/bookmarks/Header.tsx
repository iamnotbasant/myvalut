'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
  Shuffle,
  Sun,
  Moon,
  Laptop,
  HelpCircle
} from '@/components/icons';

interface HeaderProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  columns: number;
  onColumnsChange: (cols: number) => void;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
  onOpenAddBookmark: () => void;
  onShuffle: () => void;
  tags: Tag[];
  collections: Collection[];
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
  onOpenFeedback: () => void;
}

export function Header({
  filterState,
  onFilterChange,
  viewMode,
  onViewModeChange,
  columns,
  onColumnsChange,
  isSelectionMode,
  onToggleSelectionMode,
  onOpenAddBookmark,
  onShuffle,
  tags,
  collections,
  isDark,
  onToggleTheme,
  onOpenMobileMenu,
  onOpenFeedback
}: HeaderProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const platforms: { key: PlatformType; label: string }[] = [
    { key: 'twitter', label: 'Twitter / X' },
    { key: 'reddit', label: 'Reddit' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'web', label: 'Web' }
  ];

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalActiveFilters =
    filterState.platforms.length +
    filterState.tags.length +
    (filterState.onlyFavorites ? 1 : 0);

  const activeCollection = collections.find(c => c.id === filterState.collectionId);

  const getBreadcrumbTitle = () => {
    if (activeCollection) return activeCollection.name;
    if (filterState.activeNav === 'archived') return 'Archived';
    if (filterState.activeNav === 'creators') return 'Creators';
    if (filterState.activeNav === 'connections') return 'Connections';
    return 'Bookmarks';
  };

  return (
    <header className="flex h-[54px] shrink-0 items-center justify-between border-b pr-[9px] pl-2">
      {/* Left: Mobile Button + Divider + Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenMobileMenu}
            type="button"
            aria-label="Toggle navigation"
            className="group/button inline-flex size-8 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 md:hidden text-muted-foreground"
          >
            <SlidersHorizontal className="size-4" />
          </button>
          <div className="hidden h-4 w-px bg-border md:block" />
        </div>

        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <li className="inline-flex items-center gap-1">
              <span className="font-normal text-strong text-xs md:text-sm">
                {getBreadcrumbTitle()}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Right: Extension Indicator + User Avatar */}
      <div className="flex items-center gap-1">
        {/* Extension status */}
        <a
          href="https://chromewebstore.google.com/detail/stashr-ai-bookmark-saver/mampphpkeibkmmdhdfenjdedpioklfmf"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Stashr extension installed"
          className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors"
        >
          <Laptop className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full border-2 border-background bg-emerald-500" />
        </a>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="cursor-pointer rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten image-transparent-border size-8 rounded-full bg-linear-to-tr from-amber-500 to-violet-500 items-center justify-center text-xs font-semibold text-white shadow-xs">
              B
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-2 border-b border-border">
                <div className="font-medium text-xs text-strong">BASANT KUMAR</div>
                <div className="text-[11px] text-muted-foreground">basant@stashr.me</div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <span>Account</span>
                </Link>

                <Link
                  href="/settings/appearance"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <span>Appearance</span>
                </Link>

                <button
                  onClick={() => {
                    onOpenFeedback();
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <HelpCircle className="size-3.5" />
                  <span>Feedback</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
