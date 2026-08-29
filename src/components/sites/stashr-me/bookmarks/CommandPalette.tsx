'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookmarkItem, Collection, Tag, FilterState } from '@/types/stashr';
import {
  Search,
  Bookmark,
  Archive,
  Users,
  Radio,
  Settings,
  Sun,
  Moon,
  TagDot,
  Folder,
  X,
  Plus,
  Sparkles
} from '@/components/icons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  bookmarks: BookmarkItem[];
  collections: Collection[];
  tags: Tag[];
  onToggleTheme: () => void;
  isDark: boolean;
  onOpenAddBookmark?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  filterState,
  onFilterChange,
  bookmarks,
  collections,
  tags,
  onToggleTheme,
  isDark,
  onOpenAddBookmark
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBookmarks = query.trim()
    ? bookmarks.filter(b =>
        b.text.toLowerCase().includes(query.toLowerCase()) ||
        b.displayName.toLowerCase().includes(query.toLowerCase()) ||
        b.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredTags = query.trim()
    ? tags.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    : tags;

  const filteredCollections = query.trim()
    ? collections.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : collections;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Top Search Input */}
        <div className="flex h-12 items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or jump to…"
            className="h-full flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* List of Results & Actions */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Direct Search Option */}
          {query.trim() && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Search
              </div>
              <button
                onClick={() => {
                  onFilterChange({ query, activeNav: 'bookmarks' });
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-foreground hover:bg-accent text-left transition-colors"
              >
                <Search className="size-3.5 text-primary" />
                <span>Search for &quot;{query}&quot;</span>
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              {onOpenAddBookmark && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddBookmark();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-primary hover:bg-primary/10 text-left transition-colors font-medium cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add new bookmark (Auto AI Tags)</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">⌘N / +</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onFilterChange({ activeNav: 'bookmarks', collectionId: null });
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
              >
                <Bookmark className="size-3.5 text-muted-foreground" />
                <span>Bookmarks</span>
              </button>
              <button
                onClick={() => {
                  onFilterChange({ activeNav: 'archived', collectionId: null });
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
              >
                <Archive className="size-3.5 text-muted-foreground" />
                <span>Archived</span>
              </button>
              <button
                onClick={() => {
                  onFilterChange({ activeNav: 'creators' });
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
              >
                <Users className="size-3.5 text-muted-foreground" />
                <span>Creators</span>
              </button>
              <button
                onClick={() => {
                  onFilterChange({ activeNav: 'connections' });
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
              >
                <Radio className="size-3.5 text-muted-foreground" />
                <span>Connections</span>
              </button>
            </div>
          </div>

          {/* Collections */}
          {filteredCollections.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Collections
              </div>
              <div className="space-y-0.5">
                {filteredCollections.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onFilterChange({ collectionId: c.id, activeNav: 'bookmarks' });
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="size-3.5 text-muted-foreground" />
                      <span>{c.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {filteredTags.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Tags
              </div>
              <div className="grid grid-cols-2 gap-1">
                {filteredTags.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onFilterChange({ tags: [t.name], activeNav: 'bookmarks' });
                      onClose();
                    }}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
                  >
                    <TagDot color={t.color} />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme Switch Action */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Theme
            </div>
            <button
              onClick={() => {
                onToggleTheme();
                onClose();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-foreground hover:bg-accent text-left transition-colors"
            >
              {isDark ? (
                <Sun className="size-3.5 text-amber-500" />
              ) : (
                <Moon className="size-3.5 text-neutral-400" />
              )}
              <span>Switch to {isDark ? 'Light' : 'Dark'} mode</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex h-10 shrink-0 items-center justify-between border-t border-border px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Image
              src="/branding/icon.svg"
              alt="Stashr"
              width={16}
              height={16}
              className="size-4 opacity-70"
              unoptimized
            />
            <span className="font-medium">Stashr</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Select</span>
            <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-medium text-[11px]">
              ↵
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
