'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const router = useRouter();

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
    if (pathname.startsWith('/settings')) return false;
    if (navName === 'bookmarks') return (filterState.activeNav === 'bookmarks' || pathname === '/bookmarks' || pathname === '/') && !filterState.collectionId && filterState.tags.length === 0;
    return filterState.activeNav === navName || pathname === `/${navName}`;
  };

  const handleNavClick = (nav: 'bookmarks' | 'archived' | 'creators' | 'connections') => {
    if (pathname.startsWith('/settings')) {
      router.push(`/${nav}`);
    } else {
      onFilterChange({ activeNav: nav, collectionId: null, tags: [] });
    }
    onCloseMobile?.();
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
            onClick={(e) => { e.preventDefault(); handleNavClick('bookmarks'); }}
            className={navItemClass + (isNavActive('bookmarks') ? " active" : "")}
            href="/bookmarks"
          >
            <Bookmark className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Bookmarks</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('archived') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('archived'); }}
            className={navItemClass + (isNavActive('archived') ? " active" : "")}
            href="/archived"
          >
            <Archive className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Archived</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('creators') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('creators'); }}
            className={navItemClass + (isNavActive('creators') ? " active" : "")}
            href="/creators"
          >
            <Users className="size-4" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">Creators</span>
          </a>
          <a
            role="button"
            data-active={isNavActive('connections') ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); handleNavClick('connections'); }}
            className={navItemClass + (isNavActive('connections') ? " active" : "")}
            href="/connections"
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
                      <span className="flex size-4 shrink-0 items-center justify-center rounded bg-blue-500/15">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className="size-3 text-blue-500" strokeWidth="1.7" stroke="currentColor">
                          <path d="M10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 13.0348 16.4106 17.858 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                        </svg>
                      </span>
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

        {/* Free trial Widget and Footer (Exact Match) */}
        <div className="mt-auto flex flex-col gap-1 px-3 py-3 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-0">
          <div className="mb-2 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3 group-data-[state=collapsed]/sidebar:hidden">
            <p className="font-medium text-primary text-sm">Free trial</p>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                  <span>Days left</span><span className="tabular-nums">5 / 7</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted-foreground/20">
                  <div className="h-full rounded-full bg-primary" style={{ width: "71.4%" }}></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                  <span>AI tagging</span><span className="tabular-nums">205 / 250</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted-foreground/20">
                  <div className="h-full rounded-full bg-primary" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border border-transparent bg-clip-padding font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 bg-primary text-primary-foreground hover:bg-primary/80 h-7 gap-1 rounded-xl px-2.5 text-[0.8rem] mt-3.5 w-full shadow-xs"
            >
              Upgrade Now
            </button>
          </div>

          {/* Settings */}
          <Link
            href="/settings/account"
            data-active={pathname.startsWith('/settings') ? "true" : undefined}
            onClick={() => onCloseMobile?.()}
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground h-8 gap-3 px-2 font-normal text-sidebar-foreground group/sidebar-item w-full"
          >
            <Settings className="size-4 shrink-0" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden group-data-[active=true]/sidebar-item:text-inherit">
              Settings
            </span>
          </Link>

          {/* Feedback */}
          <button
            type="button"
            onClick={onOpenFeedback}
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground/80 h-8 gap-3 px-2 font-normal text-sidebar-foreground group/sidebar-item w-full"
          >
            <HelpCircle className="size-4 shrink-0" />
            <span className="min-w-0 truncate text-foreground group-hover/sidebar-item:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:hidden">
              Feedback
            </span>
          </button>

          {/* Logout */}
          <button
            type="button"
            className="group/button inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-lg border-transparent bg-clip-padding text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-8 gap-3 px-2 font-normal text-destructive hover:bg-destructive/10 group/sidebar-item w-full [&_span]:text-destructive"
          >
            <svg aria-hidden="true" className="text-destructive size-4 shrink-0" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6856 3.25027C11.7518 3.76376 11.75 4.41982 11.75 5.19656L11.75 18.863C11.7501 19.614 11.7501 20.2498 11.6856 20.7503C11.6176 21.2766 11.4638 21.7901 11.0469 22.1848C10.925 22.3003 10.79 22.4021 10.6455 22.4876C10.1515 22.7798 9.61553 22.7866 9.09084 22.7073C8.59102 22.6317 7.9783 22.4567 7.25445 22.2499L7.15469 22.2214C6.42537 22.0131 5.82294 21.841 5.34572 21.6497C4.84346 21.4484 4.41446 21.2011 4.06642 20.8079C3.95414 20.681 3.85193 20.5454 3.76076 20.4026C3.47827 19.9601 3.3584 19.4798 3.30275 18.9417C3.24997 18.4311 3.24999 17.8059 3.25002 17.0492V6.95133C3.24999 6.1946 3.24997 5.5694 3.30275 5.05887C3.3584 4.52076 3.47827 4.04049 3.76076 3.59793C3.85192 3.45513 3.95414 3.31952 4.06642 3.19265C4.41446 2.79943 4.84346 2.55219 5.34572 2.35086C5.82295 2.15956 6.42538 1.98749 7.1547 1.77918L7.20119 1.7659C7.94828 1.55248 8.57881 1.37065 9.09084 1.29324C9.61553 1.21396 10.1515 1.22077 10.6455 1.51297C10.79 1.59847 10.925 1.70028 11.0469 1.8157C11.4638 2.21046 11.6176 2.72394 11.6856 3.25027Z" fill="currentColor" />
              <path d="M16.8483 16.7549C16.2988 16.7005 15.8091 17.1019 15.7546 17.6514C15.699 18.2122 15.5908 18.3696 15.5056 18.4541C15.4273 18.5317 15.2875 18.627 14.8483 18.6856C14.3805 18.748 13.7452 18.75 12.7663 18.75H10.7497C10.1974 18.75 9.74971 19.1978 9.74971 19.75C9.74971 20.3023 10.1974 20.75 10.7497 20.75H12.7663C13.6891 20.75 14.4813 20.7521 15.112 20.668C15.7706 20.5802 16.4013 20.3822 16.9138 19.8741C17.4873 19.3054 17.6715 18.5879 17.7448 17.8487C17.7993 17.2991 17.3979 16.8094 16.8483 16.7549ZM10.7497 3.25004C10.1974 3.25004 9.74971 3.69776 9.74971 4.25004C9.74971 4.80233 10.1974 5.25004 10.7497 5.25004H12.7663C13.7452 5.25004 14.3805 5.25213 14.8483 5.3145C15.2875 5.37309 15.4273 5.46837 15.5056 5.54594C15.5908 5.63048 15.699 5.78789 15.7546 6.34868C15.8091 6.89823 16.2988 7.29963 16.8483 7.24516C17.3979 7.19064 17.7993 6.70096 17.7448 6.15141C17.6715 5.41215 17.4873 4.69466 16.9138 4.12602C16.4013 3.61792 15.7706 3.41987 15.112 3.33207C14.4813 3.24801 13.6891 3.25004 12.7663 3.25004H10.7497Z" fill="currentColor" />
              <path d="M19.8428 8.69444C19.3982 8.36731 18.7728 8.46282 18.4453 8.90733C18.1178 9.35202 18.2126 9.97728 18.6573 10.3048C18.722 10.3537 18.913 10.4983 19.0254 10.586C19.1727 10.701 19.3494 10.8445 19.5371 11.0001H14.25C13.6978 11.0001 13.2501 11.4478 13.25 12.0001C13.25 12.5524 13.6977 13.0001 14.25 13.0001H19.5371C19.3494 13.1557 19.1727 13.2992 19.0254 13.4142C18.913 13.5019 18.6429 13.711 18.5782 13.7599C18.2024 14.1001 18.1383 14.6759 18.4453 15.0929C18.7728 15.5374 19.3982 15.6329 19.8428 15.3058C19.9147 15.2514 20.134 15.0855 20.2559 14.9903C20.4986 14.8009 20.8254 14.5385 21.1553 14.2521C21.4802 13.97 21.8311 13.645 22.1084 13.3312C22.2461 13.1753 22.3873 12.998 22.4991 12.8126C22.5943 12.6546 22.75 12.3607 22.75 12.0001C22.75 11.6395 22.5943 11.3456 22.4991 11.1876C22.3873 11.0022 22.2461 10.8249 22.1084 10.669C21.8311 10.3552 21.4802 10.0302 21.1553 9.74815C20.8254 9.46171 20.4986 9.19929 20.2559 9.00987C20.134 8.91474 19.9147 8.74878 19.8428 8.69444Z" fill="currentColor" />
            </svg>
            <span className="min-w-0 truncate group-data-[state=collapsed]/sidebar:hidden">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
