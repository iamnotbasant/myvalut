'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Collection, Tag, FilterState } from '@/types/stashr';
import {
  Bookmark,
  Archive,
  Users,
  Radio,
  Plus,
  Folder,
  Search,
  Settings,
  HelpCircle,
  Trash2,
  X,
  Pencil,
  Pin,
  PinOff,
  Copy,
  MoreHorizontal,
  Activity,
  Tag as TagIcon
} from '@/components/icons';
import { useAuth } from '@/lib/auth-context';
import { LogIn, Download, Keyboard, Puzzle } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { soundFx } from '@/lib/sound-effects';
import { ValutLogo } from '@/components/ValutLogo';

interface SidebarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  collections: Collection[];
  tags: Tag[];
  bookmarksCountByTag?: Record<string, number>;
  bookmarksCount: number;
  archivedCount: number;
  creatorsCount?: number;
  onOpenAddBookmark: () => void;
  onOpenAddCollection: () => void;
  onEditCollection?: (collection: Collection) => void;
  onDeleteCollection?: (id: string) => void;
  onTogglePinCollection?: (id: string) => void;
  onOpenAddTag?: () => void;
  onEditTag?: (tag: Tag) => void;
  onDeleteTag?: (id: string) => void;
  onOpenFeedback: () => void;
  onOpenCommandPalette: () => void;
  onOpenImportExport?: () => void;
  onOpenExtensionGuide?: () => void;
  onOpenShortcuts?: () => void;
  onOpenAuth?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  filterState,
  onFilterChange,
  collections,
  tags,
  bookmarksCount,
  archivedCount,
  creatorsCount,
  onOpenAddBookmark,
  onOpenAddCollection,
  onEditCollection,
  onDeleteCollection,
  onTogglePinCollection,
  onOpenFeedback,
  onOpenCommandPalette,
  onOpenImportExport,
  onOpenExtensionGuide,
  onOpenShortcuts,
  onOpenAuth,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // Context Menu state for Collections
  const [contextMenu, setContextMenu] = React.useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    collection: Collection | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    collection: null
  });

  const navItemClass = "group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-8 justify-start gap-3 border-0 px-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:px-0 cursor-pointer";

  const isNavActive = (navName: string) => {
    if (pathname.startsWith('/settings')) return false;
    if (navName === 'bookmarks') return (filterState.activeNav === 'bookmarks' || pathname === '/bookmarks' || pathname === '/') && !filterState.collectionId && filterState.tags.length === 0;
    return filterState.activeNav === navName || pathname === `/${navName}`;
  };

  const handleNavClick = (nav: 'bookmarks' | 'archived' | 'creators' | 'tags' | 'connections' | 'logs') => {
    soundFx.playClickSound();
    const targetUrl = nav === 'bookmarks' ? '/bookmarks' : `/${nav}`;
    if (pathname.startsWith('/settings')) {
      router.push(targetUrl);
    } else {
      if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      onFilterChange({ activeNav: nav, collectionId: null, tags: [] });
    }
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        data-mobile={isMobileOpen ? "true" : undefined}
        className="fixed inset-y-0 left-0 z-40 flex w-56 -translate-x-full flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out md:static md:translate-x-0 group-data-[state=collapsed]/sidebar:w-16 data-[mobile=true]:translate-x-0"
      >
        {/* Brand Header */}
        <div className="flex h-12 items-center justify-between px-3 border-b border-sidebar-border/40">
          <Link
            href="/"
            onClick={() => soundFx.playClickSound()}
            className="flex items-center gap-2.5 px-1 font-semibold text-sm tracking-tight text-foreground group"
          >
            <ValutLogo size="sm" glow={true} />
            <span className="font-bold text-base tracking-tight text-foreground">Valut</span>
          </Link>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Search quick button */}
        <div className="px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onOpenCommandPalette();
            }}
            className="flex h-8 w-full items-center gap-2 rounded-lg border border-border/80 bg-background/50 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <Search className="size-3.5" />
            <span>Search vault...</span>
            <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex flex-col gap-1 p-2">
          <a
            role="button"
            data-active={isNavActive('bookmarks') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('bookmarks'); }}
            className={navItemClass + (isNavActive('bookmarks') ? " active" : "")}
            href="/bookmarks"
          >
            <Bookmark className="size-4" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Bookmarks</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums group-data-[state=collapsed]/sidebar:hidden">{bookmarksCount}</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('archived') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('archived'); }}
            className={navItemClass + (isNavActive('archived') ? " active" : "")}
            href="/archived"
          >
            <Archive className="size-4" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Archived</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums group-data-[state=collapsed]/sidebar:hidden">{archivedCount}</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('creators') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('creators'); }}
            className={navItemClass + (isNavActive('creators') ? " active" : "")}
            href="/creators"
          >
            <Users className="size-4" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Creators</span>
            {creatorsCount !== undefined && (
              <span className="ml-auto text-xs text-muted-foreground tabular-nums group-data-[state=collapsed]/sidebar:hidden">{creatorsCount}</span>
            )}
          </a>
          <a
            role="button"
            data-active={isNavActive('tags') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('tags'); }}
            className={navItemClass + (isNavActive('tags') ? " active" : "")}
            href="/tags"
          >
            <TagIcon className="size-4 text-teal-400" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Tags</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums group-data-[state=collapsed]/sidebar:hidden">{tags.length}</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('connections') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('connections'); }}
            className={navItemClass + (isNavActive('connections') ? " active" : "")}
            href="/connections"
          >
            <Radio className="size-4" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Connections</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('logs') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('logs'); }}
            className={navItemClass + (isNavActive('logs') ? " active" : "")}
            href="/logs"
          >
            <Activity className="size-4 text-purple-400" />
            <span className="min-w-0 truncate text-foreground group-data-[state=collapsed]/sidebar:hidden">Activity & Logs</span>
          </a>
        </div>

        {/* Collections */}
        <div className="flex min-h-12 flex-1 flex-col">
          <div className="flex flex-col px-3 min-h-0 flex-1 pt-3 group-data-[state=collapsed]/sidebar:hidden">
            <div className="mr-2 mb-1 ml-2 flex shrink-0 items-center justify-between text-muted-foreground text-xs">
              <span>Collections</span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClickSound();
                  onOpenAddCollection();
                }}
                className="inline-flex size-4 items-center justify-center rounded border border-border bg-background hover:bg-accent text-foreground shadow-xs cursor-pointer"
                title="New collection"
              >
                <Plus className="size-3" />
              </button>
            </div>
            
            <div className="-m-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-1">
              {collections.length === 0 ? (
                <p className="px-2 py-2 text-[11px] text-muted-foreground italic">No collections yet</p>
              ) : (
                [...collections]
                  .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map(col => {
                    const isActive = filterState.collectionId === col.id;
                    return (
                      <div
                        key={col.id}
                        className="group/row relative flex items-center"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setContextMenu({
                            isOpen: true,
                            position: { x: e.clientX, y: e.clientY },
                            collection: col
                          });
                        }}
                      >
                        <a
                          role="button"
                          data-active={isActive ? "true" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            soundFx.playClickSound();
                            onFilterChange({ collectionId: isActive ? null : col.id, activeNav: 'bookmarks' });
                            onCloseMobile?.();
                          }}
                          className="inline-flex h-8 w-full items-center justify-between rounded-lg px-2 text-xs font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground cursor-pointer pr-7"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex size-4 shrink-0 items-center justify-center rounded bg-blue-500/15 text-blue-500">
                              <Folder className="size-3" />
                            </span>
                            <span className="min-w-0 truncate">{col.name}</span>
                          </div>

                          {col.isPinned && (
                            <Pin className="size-3 text-muted-foreground shrink-0 group-hover/row:hidden" />
                          )}
                        </a>

                        {/* 3-dots actions trigger on hover */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setContextMenu({
                              isOpen: true,
                              position: { x: rect.right + 4, y: rect.top },
                              collection: col
                            });
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover/row:opacity-100 hover:bg-accent hover:text-foreground transition-all cursor-pointer"
                          title="Collection options"
                        >
                          <MoreHorizontal className="size-3.5" />
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Collections Context Menu */}
        <ContextMenu
          isOpen={contextMenu.isOpen}
          position={contextMenu.position}
          title={contextMenu.collection?.name}
          onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, collection: null })}
          items={
            contextMenu.collection
              ? [
                  {
                    id: 'rename',
                    label: 'Rename / Edit',
                    icon: <Pencil className="size-3.5" />,
                    onClick: () => {
                      if (contextMenu.collection) onEditCollection?.(contextMenu.collection);
                    }
                  },
                  {
                    id: 'pin',
                    label: contextMenu.collection.isPinned ? 'Unpin from Top' : 'Pin to Top',
                    icon: contextMenu.collection.isPinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />,
                    onClick: () => {
                      if (contextMenu.collection) onTogglePinCollection?.(contextMenu.collection.id);
                    }
                  },
                  {
                    id: 'copy',
                    label: 'Copy Name',
                    icon: <Copy className="size-3.5" />,
                    onClick: () => {
                      if (contextMenu.collection) navigator.clipboard.writeText(contextMenu.collection.name);
                    }
                  },
                  {
                    id: 'sep-1',
                    label: '',
                    separator: true
                  },
                  {
                    id: 'delete',
                    label: 'Delete Collection',
                    icon: <Trash2 className="size-3.5" />,
                    danger: true,
                    onClick: () => {
                      if (contextMenu.collection) onDeleteCollection?.(contextMenu.collection.id);
                    }
                  }
                ]
              : []
          }
        />

        {/* Footer: Settings & Feedback */}
        <div className="mt-auto flex flex-col gap-1 px-3 py-3 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0 border-t border-sidebar-border/40">
          {/* Settings */}
          <Link
            href="/settings/account"
            data-active={pathname.startsWith('/settings') ? "true" : undefined}
            onClick={() => {
              soundFx.playClickSound();
              onCloseMobile?.();
            }}
            className="inline-flex h-8 w-full items-center gap-3 rounded-lg px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground cursor-pointer"
          >
            <Settings className="size-4 shrink-0" />
            <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
              Settings
            </span>
          </Link>

          {/* Chrome Extension */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onOpenExtensionGuide?.();
            }}
            className="inline-flex h-8 w-full items-center gap-3 rounded-lg px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 cursor-pointer"
          >
            <Puzzle className="size-4 shrink-0 text-emerald-400" />
            <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
              Chrome Extension
            </span>
          </button>

          {/* Keyboard Shortcuts */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onOpenShortcuts?.();
            }}
            className="inline-flex h-8 w-full items-center justify-between rounded-lg px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 truncate">
              <Keyboard className="size-4 shrink-0 text-purple-400" />
              <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
                Shortcuts
              </span>
            </div>
            <kbd className="font-mono text-[10px] text-neutral-400 bg-white/5 px-1 py-0.5 rounded group-data-[state=collapsed]/sidebar:hidden">
              ?
            </kbd>
          </button>

          {/* Backup & Restore */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onOpenImportExport?.();
            }}
            className="inline-flex h-8 w-full items-center gap-3 rounded-lg px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 cursor-pointer"
          >
            <Download className="size-4 shrink-0 text-blue-400" />
            <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
              Backup & Restore
            </span>
          </button>

          {/* Feedback */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClickSound();
              onOpenFeedback();
            }}
            className="inline-flex h-8 w-full items-center gap-3 rounded-lg px-2 text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 cursor-pointer"
          >
            <HelpCircle className="size-4 shrink-0" />
            <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
              Feedback
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
