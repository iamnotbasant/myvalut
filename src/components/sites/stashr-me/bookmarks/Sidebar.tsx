'use client';

import React from 'react';
import Image from 'next/image';
import { Collection, Tag, FilterState } from '@/types/stashr';
import {
  Bookmark,
  Archive,
  Users,
  Radio,
  Plus,
  TagDot,
  Folder,
  Sparkles,
  Lightbulb,
  Search,
  Settings,
  HelpCircle,
  ExternalLink,
  Laptop,
  Trash2,
  X,
  MoreHorizontal
} from '@/components/icons';

interface SidebarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  collections: Collection[];
  tags: Tag[];
  bookmarksCount: number;
  archivedCount: number;
  onOpenAddBookmark: () => void;
  onOpenAddCollection: () => void;
  onOpenFeedback: () => void;
  onOpenCommandPalette: () => void;
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
  onOpenAddBookmark,
  onOpenAddCollection,
  onOpenFeedback,
  onOpenCommandPalette,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const getCollectionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="flex size-4 shrink-0 items-center justify-center" />;
      case 'Lightbulb':
        return <Lightbulb className="flex size-4 shrink-0 items-center justify-center" />;
      default:
        return <Folder className="flex size-4 shrink-0 items-center justify-center" />;
    }
  };

  const navItemClass = "group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/sidebar-item hit-area-y-0.5 justify-start gap-3 border-0 px-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:hover:bg-sidebar-accent data-[active=true]:dark:hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:px-0";

  const isNavActive = (navName: string) => {
    if (navName === 'bookmarks') return filterState.activeNav === 'bookmarks' && !filterState.collectionId && filterState.tags.length === 0;
    return filterState.activeNav === navName;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`group/sidebar hidden h-full w-[220px] shrink-0 flex-col bg-sidebar data-[state=collapsed]:w-[56px] md:flex ${
          isMobileOpen ? '!flex fixed inset-y-0 left-0 z-50 translate-x-0 shadow-2xl border-r border-border' : ''
        }`}
        data-state="expanded"
      >
        <div className="flex flex-col gap-[17px] px-3 pt-5.5 pb-[18px] group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0">
          <a
            aria-label="Stashr home"
            href="#"
            className="mx-[5px] flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          >
            <Image
              src="/branding/icon.svg"
              alt="Stashr"
              width={22}
              height={22}
              className="size-5.5 shrink-0"
              unoptimized
            />
            <span className="font-medium text-sidebar-accent-foreground text-sm group-data-[state=collapsed]/sidebar:hidden">
              Stashr
            </span>
          </a>
          
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border bg-clip-padding font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 w-full justify-start gap-3 px-[7px] text-sidebar-accent-foreground shadow-card-input transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden"
          >
            <span className="font-normal flex items-center gap-2"><Search className="size-4" /> Search</span>
            <div className="ml-auto flex gap-[3px]">
              <kbd className="flex size-4 items-center justify-center rounded bg-sidebar-accent-foreground/15 text-sidebar-accent-foreground">⌘</kbd>
              <kbd className="flex size-4 items-center justify-center rounded bg-sidebar-accent-foreground/15 font-mono font-semibold text-[10px] text-sidebar-accent-foreground">K</kbd>
            </div>
          </button>
          
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="group/button shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border bg-clip-padding font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 size-8 hidden text-sidebar-accent-foreground shadow-card-input transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:flex"
          >
             <Search className="size-4" />
          </button>
        </div>

        <div className="flex flex-col px-3 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0 gap-1">
          <a
            role="button"
            data-active={isNavActive('bookmarks') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); onFilterChange({ activeNav: 'bookmarks', collectionId: null, tags: [] }); onCloseMobile?.(); }}
            className={navItemClass + (isNavActive('bookmarks') ? " active" : "")}
            href="#"
          >
            <Bookmark className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Bookmarks</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('archived') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); onFilterChange({ activeNav: 'archived', collectionId: null, tags: [] }); onCloseMobile?.(); }}
            className={navItemClass + (isNavActive('archived') ? " active" : "")}
            href="#"
          >
            <Archive className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Archived</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('creators') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); onFilterChange({ activeNav: 'creators' }); onCloseMobile?.(); }}
            className={navItemClass + (isNavActive('creators') ? " active" : "")}
            href="#"
          >
            <Users className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Creators</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('connections') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); onFilterChange({ activeNav: 'connections' }); onCloseMobile?.(); }}
            className={navItemClass + (isNavActive('connections') ? " active" : "")}
            href="#"
          >
            <Radio className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Connections</span>
          </a>
        </div>

        <div className="flex min-h-12 flex-1 flex-col">
          <div className="hidden flex-col items-center pt-1 group-data-[state=collapsed]/sidebar:flex">
             <button
              type="button"
              className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 size-8 justify-center px-0 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:hover:bg-sidebar-accent data-[active=true]:dark:hover:bg-sidebar-accent"
             >
                <Folder className="size-4" />
             </button>
          </div>
          
          <div className="flex flex-col px-3 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0 min-h-0 flex-1 pt-4.5 group-data-[state=collapsed]/sidebar:hidden">
            <div className="mr-2 mb-1 ml-3 flex shrink-0 items-center justify-between text-muted-foreground text-xs group-data-[state=collapsed]/sidebar:hidden">
              <span>Collections</span>
              <button
                type="button"
                onClick={onOpenAddCollection}
                className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3 size-4 rounded-xs text-sidebar-accent-foreground shadow-sm"
              >
                <Plus className="size-3" />
              </button>
            </div>
            
            <div className="-m-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-1">
              {collections.map(col => {
                const isActive = filterState.collectionId === col.id;
                return (
                  <div key={col.id} className="group/row relative">
                    <a
                      role="button"
                      data-active={isActive ? "true" : undefined}
                      onClick={(e) => { e.preventDefault(); onFilterChange({ collectionId: isActive ? null : col.id, activeNav: 'bookmarks' }); onCloseMobile?.(); }}
                      className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/sidebar-item hit-area-y-0.5 justify-start gap-3 border-0 px-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:hover:bg-sidebar-accent data-[active=true]:dark:hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:px-0 w-full pr-8 group-hover/row:bg-sidebar-accent/40"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">{getCollectionIcon(col.icon)}</span>
                      <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">
                        {col.name}
                      </span>
                    </a>
                    <button className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border border-transparent bg-clip-padding font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3 absolute top-1/2 right-1 size-6 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover/row:opacity-100 data-popup-open:opacity-100">
                      <MoreHorizontal className="size-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Tags Section and Footer */}
        <div className="flex flex-col px-3 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0 gap-1 mt-4">
          <div className="mr-2 mb-1 ml-3 flex shrink-0 items-center justify-between text-muted-foreground text-xs group-data-[state=collapsed]/sidebar:hidden">
            <span>Tags</span>
          </div>
          <div className="-m-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-1">
            {tags.map(tag => {
              const isSelected = filterState.tags.includes(tag.name);
              return (
                <div key={tag.id} className="group/row relative">
                  <a
                    role="button"
                    data-active={isSelected ? "true" : undefined}
                    onClick={(e) => { e.preventDefault(); const newTags = isSelected ? filterState.tags.filter(t => t !== tag.name) : [...filterState.tags, tag.name]; onFilterChange({ tags: newTags, activeNav: 'bookmarks' }); onCloseMobile?.(); }}
                    className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/sidebar-item hit-area-y-0.5 justify-start gap-3 border-0 px-2 font-normal text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:hover:bg-sidebar-accent data-[active=true]:dark:hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:w-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:px-0 w-full pr-8 group-hover/row:bg-sidebar-accent/40"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"><TagDot color={tag.color} /></span>
                    <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">
                      {tag.name}
                    </span>
                  </a>
                  {isSelected && (
                    <span className="absolute top-1/2 right-3 size-1.5 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <button className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border border-transparent bg-clip-padding font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3 absolute top-1/2 right-1 size-6 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover/row:opacity-100 data-popup-open:opacity-100">
                    <MoreHorizontal className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="flex flex-col gap-1 p-2">
          <button
            type="button"
            onClick={() => onFilterChange({ activeNav: 'connections' })}
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 w-full justify-start gap-3 px-[7px] text-muted-foreground"
          >
            <Settings className="size-4" />
            <span className="font-normal text-foreground group-data-[state=collapsed]/sidebar:hidden">Settings</span>
          </button>
          
          <button
            type="button"
            onClick={onOpenFeedback}
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent/50 h-8 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 w-full justify-start gap-3 px-[7px] text-muted-foreground"
          >
            <HelpCircle className="size-4" />
            <span className="font-normal text-foreground group-data-[state=collapsed]/sidebar:hidden">Feedback</span>
          </button>
        </div>
      </aside>
    </>
  );
}
