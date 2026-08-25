'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookmarkItem, PlatformType } from '@/types/stashr';
import {
  PlatformIcon,
  Search,
  ExternalLink,
  ExtensionPuzzleIcon,
  SlidersHorizontal,
  Bookmark as BookmarkIcon,
  Check
} from '@/components/icons';

// ==========================================
// 1. CREATORS VIEW (Exact Match to Image 1)
// ==========================================

export interface CreatorProfile {
  id: string;
  displayName: string;
  username: string;
  platform: PlatformType;
  avatarUrl?: string;
  initials?: string;
  bookmarkCount: number;
  profileUrl: string;
}

const DEFAULT_CREATORS: CreatorProfile[] = [
  {
    id: 'c1',
    displayName: 'Busy-Race-4648',
    username: 'Busy-Race-4648',
    platform: 'reddit',
    initials: 'BU',
    bookmarkCount: 3,
    profileUrl: 'https://reddit.com/user/Busy-Race-4648'
  },
  {
    id: 'c2',
    displayName: 'Wail Beghoul',
    username: 'wailbranding',
    platform: 'twitter',
    avatarUrl: '/stashr_files/657ccdf6fd99feec.jpg',
    bookmarkCount: 2,
    profileUrl: 'https://x.com/wailbranding'
  },
  {
    id: 'c3',
    displayName: 'fuyo',
    username: 'fuyofulo',
    platform: 'twitter',
    avatarUrl: '/stashr_files/6e91ff44b380a5e3.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/fuyofulo'
  },
  {
    id: 'c4',
    displayName: 'roman',
    username: 'Nozelcode',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8b700a235ebcffd6.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/Nozelcode'
  },
  {
    id: 'c5',
    displayName: 'Adi',
    username: 'AdityaSur11',
    platform: 'twitter',
    avatarUrl: '/stashr_files/62db0f69f5d36f21.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/AdityaSur11'
  },
  {
    id: 'c6',
    displayName: 'Ian Nuttall',
    username: 'iannuttall',
    platform: 'twitter',
    avatarUrl: '/stashr_files/b218c4095252c807.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/iannuttall'
  },
  {
    id: 'c7',
    displayName: 'Manish Kumar',
    username: 'Manixh02',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8266259c9e4c4384.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/Manixh02'
  },
  {
    id: 'c8',
    displayName: 'Carter The Editor',
    username: 'vfxcarter',
    platform: 'twitter',
    avatarUrl: '/stashr_files/657ccdf6fd99feec.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/vfxcarter'
  },
  {
    id: 'c9',
    displayName: 'José Siles | AI | Data',
    username: 'josesilesdata',
    platform: 'twitter',
    avatarUrl: '/stashr_files/6e91ff44b380a5e3.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/josesilesdata'
  },
  {
    id: 'c10',
    displayName: 'Kailash',
    username: 'kail_designs',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8b700a235ebcffd6.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/kail_designs'
  },
  {
    id: 'c11',
    displayName: 'Bill (Yiqi) Guo',
    username: 'loficoxmos1',
    platform: 'twitter',
    avatarUrl: '/stashr_files/62db0f69f5d36f21.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/loficoxmos1'
  },
  {
    id: 'c12',
    displayName: 'Imran',
    username: 'ImranUxi',
    platform: 'twitter',
    avatarUrl: '/stashr_files/b218c4095252c807.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/ImranUxi'
  },
  {
    id: 'c13',
    displayName: 'xiA',
    username: 'xiathls',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8266259c9e4c4384.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/xiathls'
  },
  {
    id: 'c14',
    displayName: 'arc.',
    username: 'arceyul',
    platform: 'twitter',
    avatarUrl: '/stashr_files/657ccdf6fd99feec.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/arceyul'
  },
  {
    id: 'c15',
    displayName: 'Ayan Gfx | YouTube Editor',
    username: 'theayangfx',
    platform: 'twitter',
    avatarUrl: '/stashr_files/6e91ff44b380a5e3.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/theayangfx'
  },
  {
    id: 'c16',
    displayName: 'Joseph Tsar',
    username: 'joseph_tsar_',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8b700a235ebcffd6.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/joseph_tsar_'
  },
  {
    id: 'c17',
    displayName: 'hachimi',
    username: 'HakimlHamizl',
    platform: 'twitter',
    avatarUrl: '/stashr_files/62db0f69f5d36f21.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/HakimlHamizl'
  },
  {
    id: 'c18',
    displayName: 'cova',
    username: 'covacut',
    platform: 'twitter',
    avatarUrl: '/stashr_files/b218c4095252c807.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/covacut'
  },
  {
    id: 'c19',
    displayName: 'Hal',
    username: 'hal__lee',
    platform: 'twitter',
    avatarUrl: '/stashr_files/8266259c9e4c4384.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/hal__lee'
  },
  {
    id: 'c20',
    displayName: 'Darel Ebuka',
    username: 'dareltsudio',
    platform: 'twitter',
    avatarUrl: '/stashr_files/657ccdf6fd99feec.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/dareltsudio'
  },
  {
    id: 'c21',
    displayName: 'Aqib',
    username: 'MAQIB135',
    platform: 'twitter',
    avatarUrl: '/stashr_files/6e91ff44b380a5e3.jpg',
    bookmarkCount: 1,
    profileUrl: 'https://x.com/MAQIB135'
  }
];

interface CreatorsViewProps {
  bookmarks?: BookmarkItem[];
  onSelectCreator: (username: string) => void;
}

export function CreatorsView({ bookmarks, onSelectCreator }: CreatorsViewProps) {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [hoveredCreatorId, setHoveredCreatorId] = useState<string | null>(null);

  // Dynamically compute all unique creators from user's actual bookmarks
  const dynamicCreators = React.useMemo(() => {
    if (!bookmarks || bookmarks.length === 0) return DEFAULT_CREATORS;
    const map = new Map<string, CreatorProfile>();

    for (const b of bookmarks) {
      const handle = b.username || b.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'creator';
      const key = `${b.platform}_${handle.toLowerCase()}`;
      const existing = map.get(key);

      if (existing) {
        existing.bookmarkCount += 1;
        if (!existing.avatarUrl && b.avatarUrl) existing.avatarUrl = b.avatarUrl;
      } else {
        let profileUrl = b.url || '#';
        if (b.platform === 'twitter') profileUrl = `https://x.com/${handle}`;
        else if (b.platform === 'reddit') profileUrl = `https://reddit.com/u/${handle}`;
        else if (b.platform === 'instagram') profileUrl = `https://instagram.com/${handle}`;
        else if (b.platform === 'youtube') profileUrl = `https://youtube.com/@${handle}`;

        map.set(key, {
          id: key,
          displayName: b.displayName,
          username: handle,
          platform: b.platform,
          avatarUrl: b.avatarUrl,
          initials: b.displayName.slice(0, 2).toUpperCase(),
          bookmarkCount: 1,
          profileUrl,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.bookmarkCount - a.bookmarkCount);
  }, [bookmarks]);

  const creators = dynamicCreators.filter(creator => {
    const matchesQuery =
      creator.displayName.toLowerCase().includes(query.toLowerCase()) ||
      creator.username.toLowerCase().includes(query.toLowerCase());
    const matchesPlatform =
      selectedPlatform === 'all' || creator.platform === selectedPlatform;
    return matchesQuery && matchesPlatform;
  });

  const platforms = [
    { id: 'all', label: 'All platforms' },
    { id: 'twitter', label: 'X / Twitter' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' }
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background px-4 py-4 md:px-7 md:py-5 space-y-4">
      {/* Top Filter and Search Bar (Exact Match) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative w-64 md:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search creators..."
            className="h-8.5 w-full rounded-xl border border-input bg-card/60 pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring/80 focus:ring-2 focus:ring-ring/20 shadow-xs"
          />
        </div>

        {/* Platform Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
            className="flex h-8.5 items-center gap-2 rounded-xl border border-input bg-card/60 px-3 text-xs font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-xs"
          >
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span>
              {selectedPlatform === 'all'
                ? 'Platform'
                : platforms.find(p => p.id === selectedPlatform)?.label}
            </span>
          </button>

          {isPlatformMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsPlatformMenuOpen(false)}
              />
              <div className="absolute top-10 left-0 z-30 w-44 rounded-xl border border-border bg-popover p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlatform(p.id);
                      setIsPlatformMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      selectedPlatform === p.id
                        ? 'bg-accent text-strong font-medium'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <span>{p.label}</span>
                    {selectedPlatform === p.id && <Check className="size-3 text-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3-Column Creators Cards Grid (Exact Stashr Dark Aesthetics) */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map(creator => (
          <div
            key={creator.id}
            className="group relative flex h-[62px] items-center justify-between rounded-xl border border-border/80 bg-card/75 p-3 shadow-xs transition-all hover:border-border hover:bg-accent/40"
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
                      {creator.initials || creator.displayName.slice(0, 2).toUpperCase()}
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
                <span className="truncate text-[13px] font-medium text-strong">
                  {creator.displayName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  @{creator.username}
                </span>
              </div>
            </div>

            {/* Right Action Cluster: Bookmark Count (with View bookmarks tooltip) + External Link */}
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
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <BookmarkIcon className="size-3.5" />
                  <span className="font-mono text-xs">{creator.bookmarkCount}</span>
                </button>

                {/* Tooltip on Hover matching reference image */}
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
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. CONNECTIONS VIEW (Exact Match to Image 2)
// ==========================================

export function ConnectionsView() {
  const [connections, setConnections] = useState([
    {
      id: 'x',
      name: 'X',
      url: 'x.com',
      platform: 'twitter' as PlatformType,
      enabled: true,
      description:
        'Captures posts and articles the moment you bookmark them on X, plus a full import of your bookmark history.',
      stats: [
        { label: '37 saved' },
        { label: '18 real-time' },
        { label: '19 imported' }
      ],
      lastCapture: 'Last capture 12m ago',
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
      stats: [
        { label: '17 saved' },
        { label: '17 imported' }
      ],
      lastCapture: 'Last capture 2d ago',
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
      lastCapture: 'Waiting for the extension',
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
      lastCapture: 'Waiting for the extension',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'web',
      name: 'Web clips',
      url: 'Any website',
      platform: 'web' as PlatformType,
      enabled: false,
      description:
        'Clip images and text snippets from any website with a right click, straight into your library.',
      lastCapture: 'Waiting for the extension',
      action: 'Install extension',
      actionLink: '#'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'youtube.com',
      platform: 'youtube' as PlatformType,
      enabled: false,
      description:
        'Capture videos as you add them to Watch Later or playlists.',
      roadmap: 'On the roadmap'
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

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background px-4 py-4 md:px-7 md:py-5 space-y-4">
      {/* Top Extension Banner (Exact Match) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 md:p-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/40 text-foreground">
            <ExtensionPuzzleIcon className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-strong">Stashr extension</h3>
            <p className="text-xs text-muted-foreground">
              Stashr captures through the browser extension. Install it to start saving from the platforms below.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-8.5 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
        >
          Install extension
        </button>
      </div>

      {/* 9 Platform Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map(conn => (
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

              {/* Stats Row (if present) */}
              {conn.stats && conn.stats.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium">
                  {conn.stats.map((stat, idx) => (
                    <span key={idx}>{stat.label}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Status / Roadmap */}
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="text-muted-foreground">
                {conn.lastCapture || conn.roadmap}
              </span>
              {conn.action && (
                <button
                  type="button"
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  {conn.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
