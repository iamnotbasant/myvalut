'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { BookmarkItem, Tag, TagColor } from '@/types/stashr';
import {
  TagDot,
  Search,
  Plus,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Bookmark as BookmarkIcon,
  Check,
  MoreHorizontal,
  Folder,
  Tag as TagIcon,
  X
} from '@/components/icons';
import { ContextMenu } from './ContextMenu';
import { soundFx } from '@/lib/sound-effects';

interface TagsViewProps {
  tags: Tag[];
  bookmarks: BookmarkItem[];
  onSelectTag: (tagName: string) => void;
  onOpenAddTag: () => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (id: string) => void;
  onAutoTagUntagged?: () => void;
  isAutoTagging?: boolean;
}

type SortOption = 'most_bookmarks' | 'least_bookmarks' | 'az' | 'za' | 'color';

const COLOR_NAMES: Record<TagColor, string> = {
  cyan: 'Cyan',
  teal: 'Teal',
  blue: 'Blue',
  indigo: 'Indigo',
  violet: 'Violet',
  pink: 'Pink',
  amber: 'Amber',
  orange: 'Orange',
  green: 'Green',
  red: 'Red'
};

function FolderAccentGraphic({ type, color }: { type: string; color: string }) {
  if (type === 'seeds') {
    return (
      <svg width="34" height="26" viewBox="0 0 34 26" fill={color} className="opacity-90 select-none pointer-events-none drop-shadow-xs">
        <path d="M7 16C5.5 12.5 8.5 7 11 4.5C13.5 8 12 13.5 10 16C9 17 7.5 17 7 16Z" />
        <path d="M18 20C16.5 16.5 19.5 11 22 8.5C24.5 12 23 17.5 21 20C20 21 18.5 21 18 20Z" />
        <path d="M28 17C26.8 14.5 29 10 31 8C33 11 32 15 30 17C29.2 17.8 28.3 17.8 28 17Z" />
      </svg>
    );
  }
  if (type === 'leaf') {
    return (
      <svg width="38" height="34" viewBox="0 0 38 34" fill={color} className="opacity-90 select-none pointer-events-none drop-shadow-xs">
        <path d="M19 30C18 24 13 20 9 20C15 17.5 17 13.5 15 7C19.5 11.5 24 11.5 26 7C25 13.5 28 16.5 34 17.5C28 20 24 24 21 30C20 32 19.5 32 19 30Z" />
      </svg>
    );
  }
  // splash / star
  return (
    <svg width="38" height="34" viewBox="0 0 38 34" fill={color} className="opacity-90 select-none pointer-events-none drop-shadow-xs">
      <path d="M17 4C18 9.5 21.5 13 28 12C22.5 15 21.5 19.5 26 26C20.5 24 16 26 13 31.5C13 25 10 23 4.5 22C10 20 11 15.5 9 10C13 12 16.5 10 17 4Z" />
    </svg>
  );
}

const FOLDER_COLOR_THEMES: Record<TagColor, {
  name: string;
  backBg: string;
  frontBg: string;
  frontBorder: string;
  tabBorder: string;
  tabBg: string;
  glowHover: string;
  accentFont: string;
  splashColor: string;
  splashType: 'seeds' | 'leaf' | 'splash';
}> = {
  red: {
    name: 'Red',
    backBg: 'from-[#ff4d4f] via-[#f5222d] to-[#cf1322]',
    frontBg: 'from-[#ff6b6b]/95 via-[#f5222d]/90 to-[#cf1322]/95',
    frontBorder: 'border-[#ffa39e]/45',
    tabBorder: 'border-[#ff4d4f]/60',
    tabBg: 'bg-[#ff4d4f]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(245,34,45,0.4)]',
    accentFont: 'text-[#cf1322]',
    splashColor: '#820014',
    splashType: 'seeds'
  },
  blue: {
    name: 'Blue',
    backBg: 'from-[#38bdf8] via-[#2563eb] to-[#1d4ed8]',
    frontBg: 'from-[#60a5fa]/95 via-[#3b82f6]/90 to-[#1d4ed8]/95',
    frontBorder: 'border-[#93c5fd]/45',
    tabBorder: 'border-[#38bdf8]/60',
    tabBg: 'bg-[#2563eb]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(37,99,235,0.4)]',
    accentFont: 'text-[#1d4ed8]',
    splashColor: '#1e3a8a',
    splashType: 'splash'
  },
  amber: {
    name: 'Amber',
    backBg: 'from-[#fde047] via-[#f59e0b] to-[#d97706]',
    frontBg: 'from-[#fef08a]/95 via-[#fbbf24]/90 to-[#d97706]/95',
    frontBorder: 'border-[#fef08a]/50',
    tabBorder: 'border-[#facc15]/60',
    tabBg: 'bg-[#f59e0b]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(245,158,11,0.4)]',
    accentFont: 'text-[#15803d]',
    splashColor: '#15803d',
    splashType: 'leaf'
  },
  green: {
    name: 'Green',
    backBg: 'from-[#34d399] via-[#10b981] to-[#047857]',
    frontBg: 'from-[#6ee7b7]/95 via-[#10b981]/90 to-[#047857]/95',
    frontBorder: 'border-[#a7f3d0]/45',
    tabBorder: 'border-[#34d399]/60',
    tabBg: 'bg-[#10b981]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(16,185,129,0.4)]',
    accentFont: 'text-[#047857]',
    splashColor: '#064e3b',
    splashType: 'leaf'
  },
  violet: {
    name: 'Violet',
    backBg: 'from-[#c084fc] via-[#9333ea] to-[#6b21a8]',
    frontBg: 'from-[#d8b4fe]/95 via-[#a855f7]/90 to-[#6b21a8]/95',
    frontBorder: 'border-[#e9d5ff]/45',
    tabBorder: 'border-[#c084fc]/60',
    tabBg: 'bg-[#9333ea]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(147,51,234,0.4)]',
    accentFont: 'text-[#6b21a8]',
    splashColor: '#3b0764',
    splashType: 'splash'
  },
  indigo: {
    name: 'Indigo',
    backBg: 'from-[#818cf8] via-[#4f46e5] to-[#3730a3]',
    frontBg: 'from-[#a5b4fc]/95 via-[#6366f1]/90 to-[#3730a3]/95',
    frontBorder: 'border-[#c7d2fe]/45',
    tabBorder: 'border-[#818cf8]/60',
    tabBg: 'bg-[#4f46e5]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(79,70,229,0.4)]',
    accentFont: 'text-[#3730a3]',
    splashColor: '#1e1b4b',
    splashType: 'splash'
  },
  pink: {
    name: 'Pink',
    backBg: 'from-[#f472b6] via-[#db2777] to-[#9d174d]',
    frontBg: 'from-[#fbcfe8]/95 via-[#ec4899]/90 to-[#9d174d]/95',
    frontBorder: 'border-[#fbcfe8]/45',
    tabBorder: 'border-[#f472b6]/60',
    tabBg: 'bg-[#db2777]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(219,39,119,0.4)]',
    accentFont: 'text-[#9d174d]',
    splashColor: '#500724',
    splashType: 'seeds'
  },
  orange: {
    name: 'Orange',
    backBg: 'from-[#fb923c] via-[#ea580c] to-[#9a3412]',
    frontBg: 'from-[#fed7aa]/95 via-[#f97316]/90 to-[#9a3412]/95',
    frontBorder: 'border-[#fed7aa]/45',
    tabBorder: 'border-[#fb923c]/60',
    tabBg: 'bg-[#ea580c]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(234,88,12,0.4)]',
    accentFont: 'text-[#9a3412]',
    splashColor: '#431407',
    splashType: 'splash'
  },
  cyan: {
    name: 'Cyan',
    backBg: 'from-[#22d3ee] via-[#0891b2] to-[#155e75]',
    frontBg: 'from-[#67e8f9]/95 via-[#06b6d4]/90 to-[#155e75]/95',
    frontBorder: 'border-[#a5f3fc]/45',
    tabBorder: 'border-[#22d3ee]/60',
    tabBg: 'bg-[#0891b2]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(8,145,178,0.4)]',
    accentFont: 'text-[#155e75]',
    splashColor: '#083344',
    splashType: 'splash'
  },
  teal: {
    name: 'Teal',
    backBg: 'from-[#2dd4bf] via-[#0d9488] to-[#115e59]',
    frontBg: 'from-[#5eead4]/95 via-[#14b8a6]/90 to-[#115e59]/95',
    frontBorder: 'border-[#99f6e4]/45',
    tabBorder: 'border-[#2dd4bf]/60',
    tabBg: 'bg-[#0d9488]',
    glowHover: 'hover:shadow-[0_24px_50px_-10px_rgba(13,148,136,0.4)]',
    accentFont: 'text-[#115e59]',
    splashColor: '#042f2e',
    splashType: 'leaf'
  }
};

function FolderTuckedCard({
  item,
  position,
  tagName,
  count,
  accentColor
}: {
  item?: BookmarkItem;
  position: 'left' | 'center' | 'right';
  tagName: string;
  count: number;
  accentColor: string;
}) {
  const isCenter = position === 'center';
  const isLeft = position === 'left';

  // Base positions & hover transform classes so all 3 cards are visibly layered
  const posClasses = isLeft
    ? 'left-1.5 w-[86%] top-2 -rotate-6 z-10 group-hover/folder:-translate-y-8 group-hover/folder:-translate-x-4 group-hover/folder:-rotate-12'
    : isCenter
    ? 'inset-x-3 top-4 rotate-0 z-20 group-hover/folder:-translate-y-10 group-hover/folder:scale-[1.02]'
    : 'right-1.5 w-[86%] top-2 rotate-6 z-10 group-hover/folder:-translate-y-8 group-hover/folder:translate-x-4 group-hover/folder:rotate-12';

  return (
    <div
      className={`absolute h-[165px] rounded-2xl bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] border border-neutral-100 overflow-hidden flex flex-col justify-between p-2.5 transition-all duration-400 ease-out pointer-events-none ${posClasses}`}
    >
      {/* Top Header Row matching Reference 2 */}
      <div className="flex items-start justify-between gap-1.5 pb-1 shrink-0">
        <div className="flex flex-col gap-1 pt-0.5">
          <div className="h-1.5 w-7 rounded-full bg-neutral-200" />
          <div className="h-1 w-4.5 rounded-full bg-neutral-200/70" />
        </div>
        <div className="text-right truncate max-w-[65%]">
          <span className="text-[11px] font-bold text-neutral-800 tracking-tight font-mono truncate block">
            {isCenter ? tagName : item?.platform ? item.platform.toUpperCase() : `#${tagName}`}
          </span>
          <span className="text-[9px] text-neutral-400 block font-medium">
            {isCenter ? `• ${count} ${count === 1 ? 'save' : 'saves'}` : item?.displayName ? `@${item.username}` : '• note'}
          </span>
        </div>
      </div>

      {/* Card Body: Thumbnail Media or Document Snippet */}
      {item?.imageUrl ? (
        <div className="relative h-[105px] w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/60 shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-white">
            <span className="text-[9.5px] font-semibold truncate drop-shadow-sm max-w-[70%]">
              {item.title || item.text.slice(0, 22) || 'Bookmark'}
            </span>
            <span className="text-[8px] font-mono opacity-80 uppercase shrink-0">
              {item.platform}
            </span>
          </div>
        </div>
      ) : item ? (
        <div className="flex flex-col justify-between h-[105px] w-full p-2 bg-gradient-to-b from-neutral-50 to-white rounded-xl border border-neutral-200/50">
          <p className="text-[10.5px] font-semibold text-neutral-800 line-clamp-3 leading-snug">
            {item.title || item.text.slice(0, 45)}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
            <span className="text-[8.5px] text-neutral-400 font-medium truncate">
              {item.displayName || '@' + item.username}
            </span>
            <span className="text-[8px] font-mono font-bold uppercase text-neutral-500">
              {item.platform}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-[105px] w-full p-2 bg-gradient-to-b from-neutral-50 to-white rounded-xl border border-neutral-200/40">
          <div className="space-y-1.5 my-auto py-1">
            <div className="h-1.5 w-full bg-neutral-100 rounded-full" />
            <div className="h-1.5 w-4/5 bg-neutral-100 rounded-full" />
            <div className="h-1.5 w-3/5 bg-neutral-100 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-mono text-neutral-400">
              #{tagName}
            </span>
            <div className="size-2 rounded-full" style={{ backgroundColor: accentColor }} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TagsView({
  tags,
  bookmarks,
  onSelectTag,
  onOpenAddTag,
  onEditTag,
  onDeleteTag,
  onAutoTagUntagged,
  isAutoTagging = false
}: TagsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('most_bookmarks');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [copiedTagName, setCopiedTagName] = useState<string | null>(null);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    tag: Tag | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    tag: null
  });

  // 1. Group bookmarks by tag name
  const tagStats = useMemo(() => {
    const bookmarkMap: Record<string, BookmarkItem[]> = {};
    let taggedCount = 0;
    let untaggedCount = 0;

    for (const bm of bookmarks) {
      if (bm.tags && bm.tags.length > 0) {
        taggedCount++;
        for (const t of bm.tags) {
          const key = t.name.toLowerCase();
          if (!bookmarkMap[key]) bookmarkMap[key] = [];
          bookmarkMap[key].push(bm);
        }
      } else {
        untaggedCount++;
      }
    }

    return { bookmarkMap, taggedCount, untaggedCount };
  }, [bookmarks]);

  // 2. Filter & Sort Tags
  const processedTags = useMemo(() => {
    let result = [...tags];

    // Filter query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q));
    }

    // Filter color
    if (selectedColor !== 'all') {
      result = result.filter(t => t.color === selectedColor);
    }

    // Sort
    result.sort((a, b) => {
      const countA = tagStats.bookmarkMap[a.name.toLowerCase()]?.length || 0;
      const countB = tagStats.bookmarkMap[b.name.toLowerCase()]?.length || 0;

      if (sortBy === 'most_bookmarks') return countB - countA;
      if (sortBy === 'least_bookmarks') return countA - countB;
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      if (sortBy === 'color') return a.color.localeCompare(b.color);
      return 0;
    });

    return result;
  }, [tags, searchQuery, selectedColor, sortBy, tagStats.bookmarkMap]);

  const handleCopyTag = (name: string) => {
    navigator.clipboard.writeText(name);
    soundFx.playClickSound();
    setCopiedTagName(name);
    setTimeout(() => setCopiedTagName(null), 2000);
  };

  const allColors: TagColor[] = ['cyan', 'teal', 'blue', 'indigo', 'violet', 'pink', 'amber', 'orange', 'green', 'red'];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 md:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30 shadow-md">
                <TagIcon className="size-4.5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Tags & Topics</h1>
            </div>
            <p className="text-xs text-neutral-400 max-w-xl">
              Organize, filter, and discover your saved bookmarks by compound topics and AI-generated concepts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {tagStats.untaggedCount > 0 && onAutoTagUntagged && (
              <button
                type="button"
                onClick={onAutoTagUntagged}
                disabled={isAutoTagging}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`size-3.5 text-purple-400 ${isAutoTagging ? 'animate-spin' : ''}`} />
                <span>{isAutoTagging ? 'Auto-Tagging...' : `Auto-Tag ${tagStats.untaggedCount} Untagged`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAddTag}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="size-3.5" />
              <span>Create Tag</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex flex-col">
            <span className="text-[11px] text-neutral-400 font-medium">Total Tags</span>
            <span className="text-xl font-bold text-white tracking-tight mt-1">{tags.length}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex flex-col">
            <span className="text-[11px] text-neutral-400 font-medium">Tagged Bookmarks</span>
            <span className="text-xl font-bold text-emerald-400 tracking-tight mt-1">{tagStats.taggedCount}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex flex-col">
            <span className="text-[11px] text-neutral-400 font-medium">Untagged Items</span>
            <span className="text-xl font-bold text-amber-400 tracking-tight mt-1">{tagStats.untaggedCount}</span>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-black/30 p-3 flex flex-col">
            <span className="text-[11px] text-neutral-400 font-medium">Active Filter</span>
            <span className="text-xs font-medium text-purple-300 truncate mt-2">
              {selectedColor === 'all' ? 'All Colors' : COLOR_NAMES[selectedColor as TagColor]}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tags by name..."
            className="w-full rounded-xl border border-white/10 bg-neutral-900/60 pl-9 pr-8 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Color Chips + Sort Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Color Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-neutral-900/60 p-1">
            <button
              type="button"
              onClick={() => setSelectedColor('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                selectedColor === 'all'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            {allColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(selectedColor === c ? 'all' : c)}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  selectedColor === c ? 'bg-white/20 ring-1 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
                title={COLOR_NAMES[c]}
              >
                <TagDot color={c} />
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="size-3 text-neutral-400" />
              <span className="capitalize">{sortBy.replace('_', ' ')}</span>
            </button>

            {isSortMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl border border-white/10 bg-[#17171a] p-1 shadow-2xl space-y-0.5 animate-in fade-in-50">
                {[
                  { id: 'most_bookmarks', label: 'Most Bookmarks' },
                  { id: 'least_bookmarks', label: 'Least Bookmarks' },
                  { id: 'az', label: 'Alphabetical (A - Z)' },
                  { id: 'za', label: 'Alphabetical (Z - A)' },
                  { id: 'color', label: 'By Color' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id as SortOption);
                      setIsSortMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      sortBy === opt.id
                        ? 'bg-purple-500/20 text-purple-200 font-medium'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="size-3 text-purple-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag Grid Cards */}
      {processedTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 space-y-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 shadow-md">
            <TagIcon className="size-6 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-white">No tags found</h3>
          <p className="text-xs text-neutral-400 max-w-sm">
            {searchQuery
              ? `No tags matched your search query "${searchQuery}".`
              : 'Create custom tags to organize your bookmarks or use AI auto-tagging.'}
          </p>
          <button
            type="button"
            onClick={onOpenAddTag}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md transition-all cursor-pointer mt-2"
          >
            <Plus className="size-3.5" />
            <span>Create New Tag</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 sm:gap-6 pb-12">
          {processedTags.map(tag => {
            const theme = FOLDER_COLOR_THEMES[tag.color] || FOLDER_COLOR_THEMES.violet;
            const items = tagStats.bookmarkMap[tag.name.toLowerCase()] || [];
            const count = items.length;

            // Ensure unique items
            const uniqueItems = items.filter((b, i, a) => a.findIndex(x => x.id === b.id) === i);

            // Primary bookmark in center; secondary bookmarks on left and right
            const cardCenter = uniqueItems[0];
            const cardLeft = uniqueItems.length >= 2 ? uniqueItems[1] : undefined;
            const cardRight = uniqueItems.length >= 3 ? uniqueItems[2] : undefined;

            return (
              <div
                key={tag.id}
                onClick={() => onSelectTag(tag.name)}
                onContextMenu={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setContextMenu({
                    isOpen: true,
                    position: { x: e.clientX, y: e.clientY },
                    tag: tag
                  });
                }}
                className={`group/folder relative w-full max-w-[260px] mx-auto h-[275px] rounded-[28px] cursor-pointer select-none transition-all duration-400 ease-out hover:-translate-y-2 ${theme.glowHover}`}
              >
                {/* 1. Folder Back Body */}
                <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-b ${theme.backBg} shadow-lg border border-white/20 overflow-hidden z-0`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/10 pointer-events-none" />
                </div>

                {/* 2. Tucked Layered Bookmark Cards (Multi-card visibly peeking stack) */}
                <FolderTuckedCard
                  item={cardLeft}
                  position="left"
                  tagName={tag.name}
                  count={count}
                  accentColor={theme.splashColor}
                />
                <FolderTuckedCard
                  item={cardRight}
                  position="right"
                  tagName={tag.name}
                  count={count}
                  accentColor={theme.splashColor}
                />
                <FolderTuckedCard
                  item={cardCenter}
                  position="center"
                  tagName={tag.name}
                  count={count}
                  accentColor={theme.splashColor}
                />

                {/* 3. Front Pocket Sleeve with Organic Cutout & Bottom Artwork */}
                <div className="absolute inset-x-0 bottom-0 h-[56%] z-30 flex flex-col justify-end pointer-events-none">
                  {/* Sculpted Wavy Top Lip */}
                  <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="w-full h-8 block -mb-0.5 drop-shadow-sm">
                    <path d="M 0 24 Q 90 6 180 26 T 400 12 L 400 48 L 0 48 Z" fill="currentColor" className={`bg-gradient-to-b ${theme.frontBg} text-transparent`} style={{ fill: 'currentColor' }} />
                  </svg>

                  {/* Pocket Body */}
                  <div className={`relative rounded-b-[28px] bg-gradient-to-b ${theme.frontBg} ${theme.frontBorder} border-b border-x p-3.5 pt-1 flex flex-col justify-between min-h-[92px] backdrop-blur-md shadow-2xl pointer-events-auto`}>
                    {/* Splash / Leaves / Seeds Graphic at Bottom Left */}
                    <div className="absolute bottom-2.5 left-3 pointer-events-none select-none">
                      <FolderAccentGraphic type={theme.splashType} color={theme.splashColor} />
                    </div>

                    {/* Front Content: Tag Name & Saves Count Pill */}
                    <div className="flex items-center justify-between gap-2 relative z-10 pl-1">
                      <div className="min-w-0 pr-1.5">
                        <h3 className="text-[15px] sm:text-base font-bold text-white drop-shadow-md tracking-tight truncate group-hover/folder:text-white transition-colors">
                          {tag.name}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10.5px] font-semibold text-white/90 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                            {count} {count === 1 ? 'save' : 'saves'}
                          </span>
                        </div>
                      </div>

                      {/* 3-dots Menu Button */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({
                            isOpen: true,
                            position: { x: rect.right + 4, y: rect.top },
                            tag: tag
                          });
                        }}
                        className="flex size-7 items-center justify-center rounded-full bg-black/25 hover:bg-black/45 text-white transition-colors cursor-pointer shrink-0 border border-white/20 shadow-xs"
                        title="More options"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        title={contextMenu.tag?.name}
        onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, tag: null })}
        items={
          contextMenu.tag
            ? [
                {
                  id: 'browse',
                  label: 'Browse Bookmarks',
                  icon: <BookmarkIcon className="size-3.5 text-purple-400" />,
                  onClick: () => {
                    if (contextMenu.tag) onSelectTag(contextMenu.tag.name);
                  }
                },
                {
                  id: 'edit',
                  label: 'Edit Tag / Color',
                  icon: <Pencil className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.tag) onEditTag(contextMenu.tag);
                  }
                },
                {
                  id: 'copy',
                  label: 'Copy Tag Name',
                  icon: <Copy className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.tag) handleCopyTag(contextMenu.tag.name);
                  }
                },
                {
                  id: 'sep',
                  label: '',
                  separator: true
                },
                {
                  id: 'delete',
                  label: 'Delete Tag',
                  icon: <Trash2 className="size-3.5" />,
                  danger: true,
                  onClick: () => {
                    if (contextMenu.tag) onDeleteTag(contextMenu.tag.id);
                  }
                }
              ]
            : []
        }
      />
    </div>
  );
}
