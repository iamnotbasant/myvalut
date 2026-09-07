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

const FOLDER_COLOR_THEMES: Record<TagColor, {
  name: string;
  frontBg: string;
  backBg: string;
  frontBorder: string;
  tabBorder: string;
  glowHover: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentText: string;
}> = {
  violet: {
    name: 'Violet',
    frontBg: 'from-[#171328] via-[#120f20] to-[#0d0a17]',
    backBg: 'from-[#241b3d] via-[#19132c] to-[#0f0c1b]',
    frontBorder: 'border-violet-500/30 group-hover/tagcard:border-violet-400/50',
    tabBorder: 'border-violet-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(139,92,246,0.3)]',
    badgeBg: 'bg-violet-500/15',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-500/30',
    accentText: 'text-violet-400'
  },
  indigo: {
    name: 'Indigo',
    frontBg: 'from-[#131529] via-[#0f1122] to-[#0a0c1a]',
    backBg: 'from-[#1b2041] via-[#121631] to-[#0c0e20]',
    frontBorder: 'border-indigo-500/30 group-hover/tagcard:border-indigo-400/50',
    tabBorder: 'border-indigo-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(99,102,241,0.3)]',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    accentText: 'text-indigo-400'
  },
  blue: {
    name: 'Blue',
    frontBg: 'from-[#11172a] via-[#0d1222] to-[#090d1a]',
    backBg: 'from-[#172445] via-[#101934] to-[#0a1022]',
    frontBorder: 'border-blue-500/30 group-hover/tagcard:border-blue-400/50',
    tabBorder: 'border-blue-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.3)]',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    accentText: 'text-blue-400'
  },
  cyan: {
    name: 'Cyan',
    frontBg: 'from-[#0e1b25] via-[#0a141d] to-[#070e15]',
    backBg: 'from-[#11293a] via-[#0b1c28] to-[#07131c]',
    frontBorder: 'border-cyan-500/30 group-hover/tagcard:border-cyan-400/50',
    tabBorder: 'border-cyan-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.3)]',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    accentText: 'text-cyan-400'
  },
  teal: {
    name: 'Teal',
    frontBg: 'from-[#0e1d20] via-[#091518] to-[#060f11]',
    backBg: 'from-[#122c30] via-[#0c1f22] to-[#081517]',
    frontBorder: 'border-teal-500/30 group-hover/tagcard:border-teal-400/50',
    tabBorder: 'border-teal-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(20,184,166,0.3)]',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
    accentText: 'text-teal-400'
  },
  green: {
    name: 'Green',
    frontBg: 'from-[#0e1c15] via-[#0a150f] to-[#070f0b]',
    backBg: 'from-[#122b1f] via-[#0d1e16] to-[#08140f]',
    frontBorder: 'border-emerald-500/30 group-hover/tagcard:border-emerald-400/50',
    tabBorder: 'border-emerald-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.3)]',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    accentText: 'text-emerald-400'
  },
  amber: {
    name: 'Amber',
    frontBg: 'from-[#221a0f] via-[#1a130a] to-[#120d06]',
    backBg: 'from-[#332411] via-[#24190b] to-[#171007]',
    frontBorder: 'border-amber-500/30 group-hover/tagcard:border-amber-400/50',
    tabBorder: 'border-amber-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.3)]',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    accentText: 'text-amber-400'
  },
  orange: {
    name: 'Orange',
    frontBg: 'from-[#23160e] via-[#1a1009] to-[#130b06]',
    backBg: 'from-[#351e10] via-[#26150a] to-[#190d06]',
    frontBorder: 'border-orange-500/30 group-hover/tagcard:border-orange-400/50',
    tabBorder: 'border-orange-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(249,115,22,0.3)]',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
    accentText: 'text-orange-400'
  },
  pink: {
    name: 'Pink',
    frontBg: 'from-[#22101e] via-[#180b15] to-[#11070e]',
    backBg: 'from-[#33152c] via-[#240e1f] to-[#170914]',
    frontBorder: 'border-pink-500/30 group-hover/tagcard:border-pink-400/50',
    tabBorder: 'border-pink-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(236,72,153,0.3)]',
    badgeBg: 'bg-pink-500/15',
    badgeText: 'text-pink-300',
    badgeBorder: 'border-pink-500/30',
    accentText: 'text-pink-400'
  },
  red: {
    name: 'Red',
    frontBg: 'from-[#221013] via-[#180b0d] to-[#110708]',
    backBg: 'from-[#331519] via-[#240e11] to-[#17090b]',
    frontBorder: 'border-rose-500/30 group-hover/tagcard:border-rose-400/50',
    tabBorder: 'border-rose-500/25',
    glowHover: 'hover:shadow-[0_20px_45px_-12px_rgba(244,63,94,0.3)]',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
    accentText: 'text-rose-400'
  }
};

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
            {allColors.slice(0, 5).map(c => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedTags.map(tag => {
            const theme = FOLDER_COLOR_THEMES[tag.color] || FOLDER_COLOR_THEMES.violet;
            const items = tagStats.bookmarkMap[tag.name.toLowerCase()] || [];
            const count = items.length;
            const previewBookmarks = items.slice(0, 3);

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
                className="group/folder relative h-[190px] rounded-2xl cursor-pointer select-none transition-all duration-300 ease-out hover:-translate-y-1.5"
              >
                {/* 1. Folder Top Tab (Folder ear) */}
                <div className={`absolute -top-2.5 left-4 h-6 px-3.5 rounded-t-xl border-t border-x ${theme.tabBorder} bg-gradient-to-b ${theme.backBg} flex items-center justify-center shadow-xs z-0`}>
                  <div className="flex items-center gap-1.5">
                    <TagDot color={tag.color} />
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      {COLOR_NAMES[tag.color] || 'Folder'}
                    </span>
                  </div>
                </div>

                {/* 2. Folder Back Body (Interior backing) */}
                <div className={`absolute inset-0 rounded-2xl border border-white/[0.08] bg-gradient-to-b ${theme.backBg} shadow-lg overflow-hidden z-0`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                </div>

                {/* 3. Layered Document/Thumbnail Sheets Peeking Out */}
                <div className="absolute inset-x-3 top-2.5 h-[90px] flex justify-center items-start pointer-events-none z-10 overflow-visible">
                  {previewBookmarks.length > 0 ? (
                    <>
                      {/* Back Left Sheet (Bookmark 2 if available) */}
                      <div className="absolute w-[84%] h-[74px] rounded-xl border border-white/15 bg-[#141418] shadow-md -rotate-4 -translate-x-3.5 translate-y-1 overflow-hidden transition-all duration-300 ease-out group-hover/folder:-translate-y-4 group-hover/folder:-rotate-6 group-hover/folder:scale-105">
                        {previewBookmarks[2]?.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={previewBookmarks[2].imageUrl} alt="" className="size-full object-cover opacity-70" />
                        ) : (
                          <div className="p-2.5 flex flex-col justify-between h-full bg-gradient-to-br from-neutral-800/90 to-neutral-900/90">
                            <span className="text-[10px] font-medium text-neutral-300 truncate">{previewBookmarks[2]?.title || previewBookmarks[2]?.text?.slice(0, 30) || 'Note'}</span>
                            <div className="h-1 w-12 rounded-full bg-white/10" />
                          </div>
                        )}
                      </div>

                      {/* Back Right Sheet (Bookmark 1 if available) */}
                      <div className="absolute w-[86%] h-[76px] rounded-xl border border-white/20 bg-[#17171d] shadow-lg rotate-3 translate-x-3 translate-y-0.5 overflow-hidden transition-all duration-300 ease-out group-hover/folder:-translate-y-5 group-hover/folder:rotate-5 group-hover/folder:scale-105">
                        {previewBookmarks[1]?.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={previewBookmarks[1].imageUrl} alt="" className="size-full object-cover opacity-80" />
                        ) : (
                          <div className="p-2.5 flex flex-col justify-between h-full bg-gradient-to-br from-neutral-800/95 to-neutral-900/95">
                            <span className="text-[10px] font-medium text-neutral-300 truncate">{previewBookmarks[1]?.title || previewBookmarks[1]?.text?.slice(0, 30) || 'Document'}</span>
                            <div className="h-1 w-16 rounded-full bg-white/10" />
                          </div>
                        )}
                      </div>

                      {/* Front Center Sheet (Bookmark 0 - Primary preview) */}
                      <div className="absolute w-[88%] h-[80px] rounded-xl border border-white/25 bg-[#1a1a22] shadow-xl rotate-0 translate-y-0 overflow-hidden transition-all duration-300 ease-out group-hover/folder:-translate-y-6 group-hover/folder:scale-105">
                        {previewBookmarks[0]?.imageUrl ? (
                          <div className="relative size-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewBookmarks[0].imageUrl} alt="" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-semibold text-white truncate max-w-full">
                                {previewBookmarks[0]?.title || previewBookmarks[0]?.displayName}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 flex flex-col justify-between h-full bg-gradient-to-br from-[#202028] to-[#16161e]">
                            <div className="flex items-center gap-1.5">
                              <div className="size-3.5 rounded-sm bg-white/10 flex items-center justify-center text-[8px] font-bold text-neutral-300">
                                {previewBookmarks[0]?.displayName?.[0] || 'V'}
                              </div>
                              <span className="text-[10.5px] font-semibold text-neutral-200 truncate">
                                {previewBookmarks[0]?.title || previewBookmarks[0]?.displayName || 'Saved note'}
                              </span>
                            </div>
                            <p className="text-[9.5px] text-neutral-400 line-clamp-2 leading-tight">
                              {previewBookmarks[0]?.text?.slice(0, 70) || 'Text content stored in vault...'}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Empty Folder Blank Paper Sheet */
                    <div className="w-[88%] h-[76px] rounded-xl border border-dashed border-white/15 bg-white/[0.02] shadow-sm flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out group-hover/folder:-translate-y-3.5">
                      <Folder className="size-4 text-neutral-500 opacity-60" />
                      <span className="text-[10px] text-neutral-500">Empty folder</span>
                    </div>
                  )}
                </div>

                {/* 4. Front Folder Sleeve (Curved Pocket Lip & Depth) */}
                <div className={`absolute inset-x-0 bottom-0 h-[66%] rounded-2xl border ${theme.frontBorder} bg-gradient-to-b ${theme.frontBg} shadow-[0_16px_36px_-8px_rgba(0,0,0,0.85)] p-3.5 flex flex-col justify-between z-20 overflow-hidden`}>
                  {/* Subtle top inner edge highlight line */}
                  <div className="absolute top-0 inset-x-0 h-px bg-white/20 shadow-[0_1px_4px_rgba(255,255,255,0.15)]" />

                  {/* Header in Front Pocket: Badge Icon + Tag Name & Count */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Floating Tag Icon Badge */}
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${theme.badgeBg} border ${theme.badgeBorder} shadow-sm group-hover/folder:scale-105 transition-transform`}>
                        <TagDot color={tag.color} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[13.5px] font-semibold text-white truncate group-hover/folder:text-white transition-colors">
                          {tag.name}
                        </h3>
                        <span className="text-[11px] text-neutral-400 font-medium">
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
                      className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      title="More options"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>

                  {/* Footer in Front Pocket: Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-[11px] text-neutral-400 group-hover/folder:text-white flex items-center gap-1 transition-colors">
                      <span>Open folder</span>
                      <ExternalLink className="size-3 group-hover/folder:translate-x-0.5 transition-transform" />
                    </span>

                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onEditTag(tag)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit tag"
                      >
                        <Pencil className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyTag(tag.name)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Copy tag name"
                      >
                        {copiedTagName === tag.name ? (
                          <Check className="size-3 text-emerald-400" />
                        ) : (
                          <Copy className="size-3" />
                        )}
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
