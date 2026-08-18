'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookmarkItem, PlatformType } from '@/types/stashr';
import {
  PlatformIcon,
  Search,
  ExternalLink,
  Users,
  Radio,
  Check,
  Plus,
  Laptop
} from '@/components/icons';

// 1. CREATORS VIEW
interface CreatorsViewProps {
  bookmarks: BookmarkItem[];
  onSelectCreator: (username: string) => void;
}

export function CreatorsView({ bookmarks, onSelectCreator }: CreatorsViewProps) {
  const [query, setQuery] = useState('');

  // Group bookmarks by creator username
  const creatorsMap = new Map<
    string,
    {
      username: string;
      displayName: string;
      avatarUrl?: string;
      platform: PlatformType;
      count: number;
      profileUrl?: string;
    }
  >();

  bookmarks.forEach(bm => {
    const key = `${bm.platform}_${bm.username}`;
    if (!creatorsMap.has(key)) {
      creatorsMap.set(key, {
        username: bm.username,
        displayName: bm.displayName,
        avatarUrl: bm.avatarUrl,
        platform: bm.platform,
        count: 0,
        profileUrl: bm.url
      });
    }
    creatorsMap.get(key)!.count += 1;
  });

  const creators = Array.from(creatorsMap.values()).filter(
    c =>
      c.displayName.toLowerCase().includes(query.toLowerCase()) ||
      c.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold text-strong tracking-tight">Creators</h2>
          <p className="text-xs text-muted-foreground">
            Authors and creators behind your saved bookmarks.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators..."
            className="h-8 w-full rounded-lg border border-input bg-background/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
          />
        </div>
      </div>

      {/* Creators Grid (Exact Stashr 66px Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {creators.map(creator => (
          <div
            key={`${creator.platform}_${creator.username}`}
            onClick={() => onSelectCreator(creator.username)}
            className="group flex h-[66px] cursor-pointer items-center justify-between gap-3 rounded-xl bg-card p-3 shadow-card ring-1 ring-foreground/10 hover:shadow-md transition-all hover:bg-accent/30"
          >
            {/* Avatar with Platform Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-8 shrink-0">
                <div className="size-8 overflow-hidden rounded-full ring-1 ring-foreground/10 bg-muted">
                  {creator.avatarUrl ? (
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      width={32}
                      height={32}
                      className="object-cover size-full"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-accent text-xs font-semibold text-strong">
                      {creator.displayName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full ring-2 ring-card">
                  <PlatformIcon platform={creator.platform} className="size-3.5" />
                </div>
              </div>

              {/* Creator Names */}
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="truncate text-xs font-medium text-strong">
                  {creator.displayName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  @{creator.username}
                </span>
              </div>
            </div>

            {/* Saves Count */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {creator.count} {creator.count === 1 ? 'save' : 'saves'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. CONNECTIONS VIEW
export function ConnectionsView() {
  const connections = [
    {
      id: 'chrome',
      name: 'Stashr Extension',
      platform: 'web' as PlatformType,
      desc: 'Capture bookmarks with 1-click shortcut from Chrome, Brave, and Edge.',
      status: 'Connected',
      version: 'v1.4.2'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      platform: 'twitter' as PlatformType,
      desc: 'Automatic sync with your Twitter bookmark vault and liked tweets.',
      status: 'Connected',
      lastSync: '10 mins ago'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      platform: 'reddit' as PlatformType,
      desc: 'Import saved reddit submissions, comments, and media galleries.',
      status: 'Connected',
      lastSync: '1 hour ago'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      platform: 'youtube' as PlatformType,
      desc: 'Sync Watch Later playlist and channel subscriptions into your library.',
      status: 'On the roadmap'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      platform: 'instagram' as PlatformType,
      desc: 'Direct sync of saved reels, posts, and carousel guides.',
      status: 'On the roadmap'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      platform: 'tiktok' as PlatformType,
      desc: 'Import favorite short videos and sound collections.',
      status: 'On the roadmap'
    }
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-strong tracking-tight">Your connections</h2>
        <p className="text-xs text-muted-foreground">
          Everywhere Stashr can capture from, and how each source is doing.
        </p>
      </div>

      {/* Connections Card Grid (Exact Stashr Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map(conn => (
          <div
            key={conn.id}
            className="flex flex-col justify-between overflow-hidden rounded-xl bg-card shadow-card ring-1 ring-foreground/10"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={conn.platform} className="size-5" />
                  <span className="font-semibold text-sm text-strong">{conn.name}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    conn.status === 'Connected'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {conn.status}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {conn.desc}
              </p>
            </div>

            <div className="flex h-11 shrink-0 items-center justify-between border-t border-border bg-muted/30 px-4 text-xs text-muted-foreground">
              <span>{conn.version || conn.lastSync || 'Coming soon'}</span>
              <button className="text-xs font-medium text-foreground hover:underline">
                {conn.status === 'Connected' ? 'Manage' : 'Notify me'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
