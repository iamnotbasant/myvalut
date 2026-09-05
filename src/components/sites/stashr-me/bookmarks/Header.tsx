'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FilterState, PlatformType, ViewMode, Tag, Collection } from '@/types/stashr';
import {
  SidebarToggleIcon,
  ExtensionPuzzleIcon,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  Plus
} from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';
import { Volume2, VolumeX } from 'lucide-react';

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
  isOnline?: boolean;
  onOpenImportExport?: () => void;
  onOpenExtensionGuide?: () => void;
  onOpenShortcuts?: () => void;
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
  onOpenFeedback,
  isOnline = true,
  onOpenImportExport,
  onOpenExtensionGuide,
  onOpenShortcuts
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getIsMuted());
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundFx.playSaveSound();
    }
  };

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  const activeCollection = collections.find(c => c.id === filterState.collectionId);

  const getBreadcrumbTitle = () => {
    if (activeCollection) return activeCollection.name;
    if (filterState.activeNav === 'archived') return 'Archived';
    if (filterState.activeNav === 'creators') return 'Creators';
    if (filterState.activeNav === 'connections') return 'Connections';
    return 'Bookmarks';
  };

  return (
    <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#080808] pr-[9px] pl-2">
      {/* Left: Sidebar Toggle Button + Divider + Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundFx.playClickSound();
              onOpenMobileMenu?.();
            }}
            type="button"
            aria-label="Toggle navigation"
            className="group/button inline-flex size-8 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-all hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
          >
            <SidebarToggleIcon className="size-4" />
          </button>
          <div className="hidden h-4 w-px bg-white/[0.15] md:block" />
        </div>

        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 text-neutral-400 text-sm">
            <li className="inline-flex items-center gap-1">
              <span className="font-normal text-white text-xs md:text-sm">
                {getBreadcrumbTitle()}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Right: + Add Bookmark + Sound Toggle + Extension Indicator + User Profile Avatar */}
      <div className="flex items-center gap-1.5">


        {/* Sound Effects Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          aria-label="Toggle Sound Effects"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="size-4 text-neutral-500" /> : <Volume2 className="size-4 text-white" />}
        </button>

        {/* Extension guide modal trigger with active dot */}
        <button
          type="button"
          onClick={onOpenExtensionGuide}
          title="Valut Chrome Extension (1-Click Save & Setup Guide)"
          aria-label="Valut Chrome Extension Setup"
          className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ExtensionPuzzleIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full border-2 border-[#080808] bg-emerald-500" />
        </button>

        {/* Offline Indicator Badge */}
        {!isOnline && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-medium"
            title="Offline - Changes are saved locally and will auto-sync when online"
          >
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Offline</span>
          </div>
        )}

        {/* Action Button: Add Bookmark */}
        <button
          type="button"
          onClick={onOpenAddBookmark}
          className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add</span>
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex size-8 items-center justify-center rounded-full bg-linear-to-tr from-amber-500/20 via-primary/20 to-teal-500/20 ring-1 ring-white/15 hover:ring-white/30 transition-all cursor-pointer"
          >
            <span className="font-mono text-xs font-semibold text-white">B</span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-[#121212] p-1 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-xs font-medium text-white">Basant</p>
                <p className="font-mono text-[11px] text-neutral-400">Personal Vault</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/settings/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Account & Profile Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setIsUserMenuOpen(false);
                    onOpenExtensionGuide?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Install Chrome Extension
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setIsUserMenuOpen(false);
                    onOpenShortcuts?.();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Keyboard Shortcuts</span>
                  <kbd className="font-mono text-[10px] text-neutral-400 bg-white/5 px-1 py-0.5 rounded">?</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setIsUserMenuOpen(false);
                    onOpenImportExport?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Backup & Restore (JSON / MD)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    setIsUserMenuOpen(false);
                    onOpenFeedback();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Feedback
                </button>
              </div>

              <div className="border-t border-white/10 pt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleSound();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Sound Effects</span>
                  <div className="flex items-center gap-1 text-neutral-400">
                    {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-emerald-400" />}
                    <span>{isMuted ? 'Muted' : 'On'}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClickSound();
                    onToggleTheme();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Theme</span>
                  <div className="flex items-center gap-1 text-neutral-400">
                    {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                    <span>{isDark ? 'Dark' : 'Light'}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
