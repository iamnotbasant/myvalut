'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../bookmarks/Sidebar';
import { INITIAL_COLLECTIONS, INITIAL_TAGS, INITIAL_BOOKMARKS } from '../bookmarks/mock-data';
import {
  SidebarToggleIcon,
  ExtensionPuzzleIcon,
  User,
  EditPencilIcon,
  TagIcon,
  Key,
  Shield
} from '@/components/icons';
import { soundFx } from '@/lib/sound-effects';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: 'account' | 'appearance' | 'tags' | 'authorized-apps' | 'api-keys';
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const tabs = [
    {
      id: 'account',
      label: 'Account & Profile',
      href: '/settings/account',
      icon: User
    },
    {
      id: 'appearance',
      label: 'Appearance',
      href: '/settings/appearance',
      icon: EditPencilIcon
    },
    {
      id: 'tags',
      label: 'Tags & Organisation',
      href: '/settings/tags',
      icon: TagIcon
    },
    {
      id: 'authorized-apps',
      label: 'Authorized apps',
      href: '/settings/authorized-apps',
      icon: Shield
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      href: '/settings/api-keys',
      icon: Key
    }
  ];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'account':
        return 'Account & Profile';
      case 'appearance':
        return 'Appearance';
      case 'tags':
        return 'Tags';
      case 'authorized-apps':
        return 'Authorized apps';
      case 'api-keys':
        return 'API Keys';
      default:
        return 'Account & Profile';
    }
  };

  return (
    <div className="flex h-svh w-screen overflow-hidden bg-background md:bg-sidebar text-foreground antialiased selection:bg-primary/20">
      {/* Left Navigation Sidebar */}
      <Sidebar
        filterState={{
          query: '',
          platforms: [],
          tags: [],
          activeNav: 'bookmarks',
          collectionId: null
        }}
        onFilterChange={() => {}}
        collections={INITIAL_COLLECTIONS}
        tags={INITIAL_TAGS}
        bookmarksCount={INITIAL_BOOKMARKS.length}
        archivedCount={0}
        onOpenAddBookmark={() => {}}
        onOpenAddCollection={() => {}}
        onOpenFeedback={() => {}}
        onOpenCommandPalette={() => {}}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Floating Container */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background md:my-2 md:mr-2 md:rounded-xl md:border md:border-border shadow-xs">
        {/* Header Bar */}
        <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-border bg-background pr-[9px] pl-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundFx.playClickSound();
                  setIsMobileOpen(true);
                }}
                type="button"
                aria-label="Toggle navigation"
                className="group/button inline-flex size-8 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent font-medium text-sm outline-none transition-all hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <SidebarToggleIcon className="size-4" />
              </button>
              <div className="hidden h-4 w-px bg-border md:block" />
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-normal">Settings</span>
              <span className="text-muted-foreground/60">&gt;</span>
              <span className="text-strong font-medium">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          {/* Right side extension */}
          <div className="flex items-center gap-2">
            <Link
              href="/settings/account"
              aria-label="Account Settings"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ExtensionPuzzleIcon className="size-4" />
            </Link>
          </div>
        </header>

        {/* Settings Navigation Tabs Bar */}
        <div className="flex items-center border-b border-border bg-background px-6 md:px-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => soundFx.playClickSound()}
                  className={`group relative flex items-center gap-2 py-3 text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'text-strong font-semibold'
                      : 'text-muted-foreground hover:text-foreground font-medium'
                  }`}
                >
                  <TabIcon className={`size-3.5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Settings Tab Content View */}
        <div className="flex-1 overflow-y-auto bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
