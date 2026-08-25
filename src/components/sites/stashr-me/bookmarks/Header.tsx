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
  HelpCircle
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
    <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#1c1c1f] pr-[9px] pl-2">
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

      {/* Right: Sound Toggle + Extension Indicator + User Profile Avatar */}
      <div className="flex items-center gap-1.5">
        {/* Sound Effects Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          aria-label="Toggle Sound Effects"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="size-4 text-neutral-500" /> : <Volume2 className="size-4 text-primary" />}
        </button>

        {/* Extension status with green active dot */}
        <a
          href="https://chromewebstore.google.com/detail/stashr-ai-bookmark-saver/mampphpkeibkmmdhdfenjdedpioklfmf"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Stashr extension installed"
          className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ExtensionPuzzleIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full border-2 border-[#1c1c1f] bg-emerald-500" />
        </a>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            className="cursor-pointer rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring block"
            aria-expanded={isUserMenuOpen}
          >
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20 bg-muted">
              <Image
                src="/stashr_files/unnamed.jpg"
                alt="BASANT KUMAR"
                fill
                className="object-cover aspect-square"
                unoptimized
              />
            </div>
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-2xl border border-white/10 bg-[#1c1c1f] p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="font-semibold text-xs text-white leading-tight">BASANT KUMAR</p>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">iamnotbasant@gmail.com</p>
              </div>

              <div className="py-1">
                <Link
                  href="/settings/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Account Settings
                </Link>
                <Link
                  href="/settings/billing"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Subscription & Billing
                </Link>
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
