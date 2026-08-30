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
            const items = tagStats.bookmarkMap[tag.name.toLowerCase()] || [];
            const count = items.length;
            const previewItems = items.filter(b => Boolean(b.imageUrl || b.avatarUrl)).slice(0, 4);

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
                className="group/tagcard relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#141416] hover:bg-[#18181c] hover:border-white/20 p-4 transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10 group-hover/tagcard:border-white/20 transition-colors">
                      <TagDot color={tag.color} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover/tagcard:text-purple-300 transition-colors">
                        {tag.name}
                      </h3>
                      <span className="text-[11px] text-neutral-400 capitalize">
                        {COLOR_NAMES[tag.color] || 'Tag'}
                      </span>
                    </div>
                  </div>

                  {/* 3-dots Menu Trigger */}
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
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>

                {/* Body - Bookmark Thumbnails Preview */}
                <div className="my-3 py-2 border-y border-white/[0.04] min-h-12 flex items-center justify-between">
                  {previewItems.length > 0 ? (
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {previewItems.map((bm, i) => (
                        <div
                          key={bm.id || i}
                          className="relative size-8 shrink-0 rounded-lg overflow-hidden ring-2 ring-[#141416] bg-neutral-800"
                        >
                          {bm.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={bm.imageUrl}
                              alt={bm.title || tag.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                              {bm.displayName?.[0] || 'V'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 italic">No bookmarks attached yet</span>
                  )}

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-neutral-200 tabular-nums">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-400 group-hover/tagcard:text-white flex items-center gap-1 transition-colors">
                    <span>Browse vault</span>
                    <ExternalLink className="size-3 group-hover/tagcard:translate-x-0.5 transition-transform" />
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
                      title="Copy name"
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
