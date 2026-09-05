'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { BookmarkItem, PlatformType } from '@/types/stashr';
import {
  PlatformIcon,
  Search,
  ExternalLink,
  ExtensionPuzzleIcon,
  SlidersHorizontal,
  Bookmark as BookmarkIcon,
  Check,
  Users,
  Plus,
  X,
  Pin,
  PinOff,
  Copy,
  Trash2,
  MoreHorizontal
} from '@/components/icons';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

// ==========================================
// 1. CREATORS VIEW (100% Dynamic & Connected)
// ==========================================

export interface CreatorProfile {
  id: string;
  displayName: string;
  username: string;
  platform: PlatformType;
  avatarUrl?: string;
  initials: string;
  bookmarkCount: number;
  profileUrl: string;
  latestBookmarkDate?: string;
  isPinned?: boolean;
  bookmarks: BookmarkItem[];
}

interface CreatorsViewProps {
  bookmarks?: BookmarkItem[];
  onSelectCreator: (username: string) => void;
  onOpenAddBookmark?: () => void;
  onDeleteCreatorBookmarks?: (creator: CreatorProfile) => void;
  onTogglePinCreator?: (creatorId: string) => void;
  pinnedCreatorIds?: string[];
}

type SortOption = 'most_bookmarks' | 'recent' | 'az' | 'za';

const PLATFORM_LABELS: Record<string, string> = {
  all: 'All platforms',
  twitter: 'X / Twitter',
  reddit: 'Reddit',
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  bluesky: 'Bluesky',
  threads: 'Threads',
  pinterest: 'Pinterest',
  web: 'Web'
};

export function CreatorsView({
  bookmarks = [],
  onSelectCreator,
  onOpenAddBookmark,
  onDeleteCreatorBookmarks,
  onTogglePinCreator,
  pinnedCreatorIds = []
}: CreatorsViewProps) {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('most_bookmarks');
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [hoveredCreatorId, setHoveredCreatorId] = useState<string | null>(null);

  // Context Menu state for Creator cards
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    creator: CreatorProfile | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    creator: null
  });

  // 1. Dynamically compute all unique creators from user's actual active bookmarks
  const dynamicCreators = useMemo(() => {
    if (!bookmarks || bookmarks.length === 0) return [];
    
    // Consider non-archived bookmarks (or all if none archived)
    const activeBookmarks = bookmarks.filter(b => !b.isArchived);
    const sourceBookmarks = activeBookmarks.length > 0 ? activeBookmarks : bookmarks;

    const map = new Map<string, CreatorProfile>();

    for (const b of sourceBookmarks) {
      const rawHandle = (b.username || b.displayName || 'creator').trim();
      const cleanHandle = rawHandle.replace(/^@+/, '').replace(/^u\//i, '').trim() || 'creator';
      const cleanDisplayName = (b.displayName || b.username || 'Creator').trim();
      const platform: PlatformType = b.platform || 'web';
      
      const key = `${platform}___${cleanHandle.toLowerCase()}`;
      const existing = map.get(key);

      if (existing) {
        existing.bookmarkCount += 1;
        existing.bookmarks.push(b);
        if (!existing.avatarUrl && b.avatarUrl) {
          existing.avatarUrl = b.avatarUrl;
        }
        if (b.date && (!existing.latestBookmarkDate || new Date(b.date) > new Date(existing.latestBookmarkDate))) {
          existing.latestBookmarkDate = b.date;
        }
      } else {
        let profileUrl = b.url || '#';
        if (platform === 'twitter') {
          profileUrl = `https://x.com/${cleanHandle}`;
        } else if (platform === 'reddit') {
          profileUrl = `https://reddit.com/user/${cleanHandle}`;
        } else if (platform === 'youtube') {
          const handle = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;
          profileUrl = `https://youtube.com/${handle}`;
        } else if (platform === 'instagram') {
          profileUrl = `https://instagram.com/${cleanHandle}`;
        } else if (platform === 'tiktok') {
          const handle = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;
          profileUrl = `https://tiktok.com/${handle}`;
        } else if (platform === 'bluesky') {
          profileUrl = `https://bsky.app/profile/${cleanHandle}`;
        } else if (platform === 'threads') {
          profileUrl = `https://threads.net/@${cleanHandle}`;
        } else if (platform === 'pinterest') {
          profileUrl = `https://pinterest.com/${cleanHandle}`;
        }

        const initials = (cleanDisplayName || cleanHandle)
          .split(/[\s_.-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map(w => w[0]?.toUpperCase())
          .join('') || cleanDisplayName.slice(0, 2).toUpperCase() || 'CR';

        const isPinned = pinnedCreatorIds.includes(key);

        map.set(key, {
          id: key,
          displayName: cleanDisplayName,
          username: cleanHandle,
          platform,
          avatarUrl: b.avatarUrl,
          initials,
          bookmarkCount: 1,
          profileUrl,
          latestBookmarkDate: b.date,
          isPinned,
          bookmarks: [b]
        });
      }
    }

    return Array.from(map.values());
  }, [bookmarks, pinnedCreatorIds]);

  // 2. Count creators per platform for the filter dropdown
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { all: dynamicCreators.length };
    for (const c of dynamicCreators) {
      counts[c.platform] = (counts[c.platform] || 0) + 1;
    }
    return counts;
  }, [dynamicCreators]);

  const availablePlatforms = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All platforms', count: dynamicCreators.length }
    ];
    const platforms: PlatformType[] = ['twitter', 'reddit', 'youtube', 'instagram', 'tiktok', 'bluesky', 'threads', 'pinterest', 'web'];
    for (const p of platforms) {
      const count = platformCounts[p] || 0;
      if (count > 0) {
        list.push({ id: p, label: PLATFORM_LABELS[p] || p, count });
      }
    }
    return list;
  }, [dynamicCreators.length, platformCounts]);

  // 3. Filter and Sort
  const filteredCreators = useMemo(() => {
    return dynamicCreators.filter(creator => {
      const matchesQuery =
        creator.displayName.toLowerCase().includes(query.toLowerCase()) ||
        creator.username.toLowerCase().includes(query.toLowerCase());
      const matchesPlatform =
        selectedPlatform === 'all' || creator.platform === selectedPlatform;
      return matchesQuery && matchesPlatform;
    });
  }, [dynamicCreators, query, selectedPlatform]);

  const sortedCreators = useMemo(() => {
    return [...filteredCreators].sort((a, b) => {
      // Pinned creators always stay on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === 'most_bookmarks') {
        return b.bookmarkCount - a.bookmarkCount;
      }
      if (sortBy === 'recent') {
        const dateA = a.latestBookmarkDate ? new Date(a.latestBookmarkDate).getTime() : 0;
        const dateB = b.latestBookmarkDate ? new Date(b.latestBookmarkDate).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'az') {
        return a.displayName.localeCompare(b.displayName);
      }
      if (sortBy === 'za') {
        return b.displayName.localeCompare(a.displayName);
      }
      return 0;
    });
  }, [filteredCreators, sortBy]);

  // 4. Empty State when user has 0 bookmarks/creators in vault
  if (dynamicCreators.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[420px] bg-background">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-card border border-border/80 text-muted-foreground shadow-xs mb-4">
          <Users className="size-6 text-muted-foreground/80" />
        </div>
        <h3 className="text-base font-semibold text-strong mb-1.5">No creators found</h3>
        <p className="max-w-sm text-xs text-muted-foreground leading-relaxed mb-6">
          Save tweets, reddit posts, YouTube videos, and web articles to organize and discover creators directly in your vault.
        </p>
        {onOpenAddBookmark && (
          <button
            type="button"
            onClick={onOpenAddBookmark}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Bookmark</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background px-4 py-4 md:px-7 md:py-5 space-y-4">
      {/* Top Filter, Search & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative w-64 md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search creators..."
              className="h-8.5 w-full rounded-xl border border-input bg-card/60 pl-8.5 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring/80 focus:ring-2 focus:ring-ring/20 shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Platform Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsPlatformMenuOpen(!isPlatformMenuOpen);
                setIsSortMenuOpen(false);
              }}
              className="flex h-8.5 items-center gap-2 rounded-xl border border-input bg-card/60 px-3 text-xs font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="size-3.5 text-muted-foreground" />
              <span>
                {selectedPlatform === 'all'
                  ? 'Platform'
                  : PLATFORM_LABELS[selectedPlatform] || selectedPlatform}
              </span>
            </button>

            {isPlatformMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsPlatformMenuOpen(false)}
                />
                <div className="absolute top-10 left-0 z-30 w-52 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                  {availablePlatforms.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPlatform(p.id);
                        setIsPlatformMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        selectedPlatform === p.id
                          ? 'bg-accent text-strong font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      }`}
                    >
                      <span>{p.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {p.count}
                        </span>
                        {selectedPlatform === p.id && (
                          <Check className="size-3 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsPlatformMenuOpen(false);
              }}
              className="flex h-8.5 items-center gap-1.5 rounded-xl border border-input bg-card/60 px-3 text-xs font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-xs cursor-pointer"
            >
              <span className="text-muted-foreground">Sort:</span>
              <span>
                {sortBy === 'most_bookmarks' && 'Most bookmarks'}
                {sortBy === 'recent' && 'Recently added'}
                {sortBy === 'az' && 'A - Z'}
                {sortBy === 'za' && 'Z - A'}
              </span>
            </button>

            {isSortMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsSortMenuOpen(false)}
                />
                <div className="absolute top-10 left-0 z-30 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { id: 'most_bookmarks', label: 'Most bookmarks' },
                    { id: 'recent', label: 'Recently added' },
                    { id: 'az', label: 'Alphabetical (A - Z)' },
                    { id: 'za', label: 'Alphabetical (Z - A)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.id as SortOption);
                        setIsSortMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        sortBy === opt.id
                          ? 'bg-accent text-strong font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="size-3 text-primary" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Total Summary */}
        <div className="hidden sm:flex items-center text-xs text-muted-foreground font-mono">
          <span>
            {sortedCreators.length} {sortedCreators.length === 1 ? 'creator' : 'creators'}
          </span>
        </div>
      </div>

      {/* Zero matches for current search/filter */}
      {sortedCreators.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[300px]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-card border border-border/80 text-muted-foreground shadow-xs mb-3">
            <Search className="size-5 text-muted-foreground/70" />
          </div>
          <h3 className="text-sm font-semibold text-strong mb-1">No matching creators</h3>
          <p className="max-w-xs text-xs text-muted-foreground mb-4">
            No creators found matching &quot;{query}&quot;
            {selectedPlatform !== 'all' ? ` on ${PLATFORM_LABELS[selectedPlatform] || selectedPlatform}` : ''}.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedPlatform('all');
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* 3-Column Creators Cards Grid (Exact Stashr Dark Aesthetics) */
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCreators.map(creator => (
            <div
              key={creator.id}
              className="group relative flex h-[62px] items-center justify-between rounded-xl border border-border/80 bg-card/75 p-3 shadow-xs transition-all hover:border-border hover:bg-accent/40"
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({
                  isOpen: true,
                  position: { x: e.clientX, y: e.clientY },
                  creator
                });
              }}
            >
              {/* Creator Left info: Avatar with Platform Badge + Name & Handle */}
              <div
                onClick={() => onSelectCreator(creator.username)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
              >
                {/* Circular Avatar with Platform overlay badge */}
                <div className="relative size-8.5 shrink-0">
                  <div className="size-8.5 overflow-hidden rounded-full ring-1 ring-border bg-neutral-800 flex items-center justify-center">
                    {creator.avatarUrl ? (
                      <Image
                        src={creator.avatarUrl}
                        alt={creator.displayName}
                        width={34}
                        height={34}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[11px] font-semibold text-neutral-300">
                        {creator.initials}
                      </span>
                    )}
                  </div>
                  {/* Platform Badge Overlay */}
                  <div className="absolute -right-0.5 -bottom-0.5">
                    <PlatformIcon platform={creator.platform} className="size-3.5" />
                  </div>
                </div>

                {/* Creator Names */}
                <div className="flex flex-col min-w-0 leading-tight">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-[13px] font-medium text-strong">
                      {creator.displayName}
                    </span>
                    {creator.isPinned && (
                      <Pin className="size-3 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <span className="truncate text-[11px] text-muted-foreground">
                    @{creator.username}
                  </span>
                </div>
              </div>

              {/* Right Action Cluster: Bookmark Count (with View bookmarks tooltip) + External Link + Options */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Bookmark Count Button with Tooltip */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredCreatorId(creator.id)}
                  onMouseLeave={() => setHoveredCreatorId(null)}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCreator(creator.username)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                  >
                    <BookmarkIcon className="size-3.5" />
                    <span className="font-mono text-xs">{creator.bookmarkCount}</span>
                  </button>

                  {/* Tooltip on Hover */}
                  {hoveredCreatorId === creator.id && (
                    <div className="absolute -top-7 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-white shadow-md">
                      View bookmarks
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                    </div>
                  )}
                </div>

                {/* External Profile Link */}
                <a
                  href={creator.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${creator.displayName}'s profile`}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                >
                  <ExternalLink className="size-3.5" />
                </a>

                {/* 3-dots context menu trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({
                      isOpen: true,
                      position: { x: rect.right + 4, y: rect.top },
                      creator
                    });
                  }}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-foreground transition-all cursor-pointer"
                  title="More actions"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creator Right-Click Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        title={contextMenu.creator ? `${contextMenu.creator.displayName} (@${contextMenu.creator.username})` : undefined}
        onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, creator: null })}
        items={
          contextMenu.creator
            ? [
                {
                  id: 'view',
                  label: `View Bookmarks (${contextMenu.creator.bookmarkCount})`,
                  icon: <BookmarkIcon className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.creator) onSelectCreator(contextMenu.creator.username);
                  }
                },
                {
                  id: 'open-profile',
                  label: 'Open Social Profile',
                  icon: <ExternalLink className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.creator?.profileUrl) {
                      window.open(contextMenu.creator.profileUrl, '_blank', 'noopener,noreferrer');
                    }
                  }
                },
                {
                  id: 'copy-handle',
                  label: 'Copy @handle',
                  icon: <Copy className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.creator) {
                      navigator.clipboard.writeText(`@${contextMenu.creator.username}`);
                    }
                  }
                },
                {
                  id: 'copy-url',
                  label: 'Copy Profile Link',
                  icon: <Copy className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.creator?.profileUrl) {
                      navigator.clipboard.writeText(contextMenu.creator.profileUrl);
                    }
                  }
                },
                {
                  id: 'pin',
                  label: contextMenu.creator.isPinned ? 'Unpin from Top' : 'Pin Creator to Top',
                  icon: contextMenu.creator.isPinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />,
                  onClick: () => {
                    if (contextMenu.creator) {
                      onTogglePinCreator?.(contextMenu.creator.id);
                    }
                  }
                },
                {
                  id: 'sep-1',
                  label: '',
                  separator: true
                },
                {
                  id: 'delete-bookmarks',
                  label: `Delete All Bookmarks (${contextMenu.creator.bookmarkCount})`,
                  icon: <Trash2 className="size-3.5" />,
                  danger: true,
                  onClick: () => {
                    if (contextMenu.creator) {
                      onDeleteCreatorBookmarks?.(contextMenu.creator);
                    }
                  }
                }
              ]
            : []
        }
      />
    </div>
  );
}

// ==========================================
// 2. CONNECTIONS VIEW (Dynamic from real bookmarks)
// ==========================================

interface ConnectionsViewProps {
  bookmarks?: BookmarkItem[];
  onOpenExtensionGuide?: () => void;
}

export function ConnectionsView({ bookmarks = [], onOpenExtensionGuide }: ConnectionsViewProps) {
  const [connections, setConnections] = useState([
    {
      id: 'x',
      name: 'X',
      url: 'x.com',
      platform: 'twitter' as PlatformType,
      enabled: true,
      description:
        'Captures posts and articles the moment you bookmark them on X, plus a full import of your bookmark history.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      url: 'reddit.com',
      platform: 'reddit' as PlatformType,
      enabled: true,
      description:
        'Captures posts and comments as you save them on Reddit, plus a full import of your saved history.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: 'tiktok.com',
      platform: 'tiktok' as PlatformType,
      enabled: false,
      description:
        'Captures videos as you favorite them on TikTok, plus a full import of your favorites.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'instagram.com',
      platform: 'instagram' as PlatformType,
      enabled: false,
      description:
        'Captures posts and reels as you save them on Instagram, plus a full import of your saved collection.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'web',
      name: 'Web clips',
      url: 'Any website',
      platform: 'web' as PlatformType,
      enabled: true,
      description:
        'Clip images and text snippets from any website with a right click, straight into your library.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'youtube.com',
      platform: 'youtube' as PlatformType,
      enabled: true,
      description:
        'Capture videos, shorts, and descriptions as you bookmark them on YouTube.',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      url: 'pinterest.com',
      platform: 'pinterest' as PlatformType,
      enabled: false,
      description:
        'Import your boards and capture Pins as you save them.',
      roadmap: 'On the roadmap'
    },
    {
      id: 'bluesky',
      name: 'Bluesky',
      url: 'bsky.app',
      platform: 'bluesky' as PlatformType,
      enabled: false,
      description:
        'Capture posts as you bookmark them on Bluesky.',
      roadmap: 'On the roadmap'
    },
    {
      id: 'threads',
      name: 'Threads',
      url: 'threads.com',
      platform: 'threads' as PlatformType,
      enabled: false,
      description:
        'Capture posts as you save them on Threads.',
      roadmap: 'On the roadmap'
    }
  ]);

  const handleToggle = (id: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  // Compute platform count dynamically from user's actual bookmarks
  const platformStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of bookmarks) {
      if (!b.isArchived) {
        counts[b.platform] = (counts[b.platform] || 0) + 1;
      }
    }
    return counts;
  }, [bookmarks]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background px-4 py-4 md:px-7 md:py-5 space-y-4">
      {/* Top Extension Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 md:p-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/40 text-foreground">
            <ExtensionPuzzleIcon className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-strong">Valut extension</h3>
            <p className="text-xs text-muted-foreground">
              Valut captures bookmarks through the browser extension. Install it to start saving in 1 click from platforms below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenExtensionGuide}
          className="inline-flex h-8.5 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Install extension
        </button>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map(conn => {
          const savedCount = platformStats[conn.platform] || 0;

          return (
            <div
              key={conn.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-5 shadow-xs transition-all hover:border-border"
            >
              <div className="space-y-3">
                {/* Header: Platform Icon + Name & URL + Toggle Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 shrink-0 flex items-center justify-center">
                      <PlatformIcon platform={conn.platform} className="size-7" />
                    </div>
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-sm font-semibold text-strong">{conn.name}</span>
                      <span className="text-xs text-muted-foreground">{conn.url}</span>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={conn.enabled}
                    onClick={() => handleToggle(conn.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      conn.enabled ? 'bg-neutral-200 dark:bg-white' : 'bg-neutral-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                        conn.enabled ? 'translate-x-4 bg-neutral-900' : 'translate-x-0 bg-neutral-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-muted-foreground/90">
                  {conn.description}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium font-mono">
                  <span>{savedCount} saved</span>
                  {conn.enabled && savedCount > 0 && <span>• Connected</span>}
                </div>
              </div>

              {/* Bottom Status / Action */}
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                <span className="text-muted-foreground">
                  {savedCount > 0
                    ? `Active in vault`
                    : conn.roadmap || (conn.enabled ? 'Connected' : 'Waiting for extension')}
                </span>
                {conn.action && (
                  <button
                    type="button"
                    onClick={onOpenExtensionGuide}
                    className="text-xs font-medium text-foreground hover:underline cursor-pointer"
                  >
                    {conn.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
