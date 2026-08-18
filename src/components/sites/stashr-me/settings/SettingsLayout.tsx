'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../bookmarks/Sidebar';
import { Header } from '../bookmarks/Header';
import { INITIAL_COLLECTIONS, INITIAL_TAGS, INITIAL_BOOKMARKS } from '../bookmarks/mock-data';
import { User, Sun, TagIcon, CreditCard, Key, Shield, Smartphone } from '@/components/icons';

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: 'account' | 'appearance' | 'tags' | 'billing' | 'authorized-apps' | 'api-keys';
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  const tabs = [
    { id: 'account', label: 'Account', href: '/settings/account' },
    { id: 'appearance', label: 'Appearance', href: '/settings/appearance' },
    { id: 'tags', label: 'Tags', href: '/settings/tags' },
    { id: 'billing', label: 'Billing', href: '/settings/billing' }
  ];

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
      />

      {/* Main Content Floating Card */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background md:my-2 md:mr-2 md:rounded-xl md:border md:border-border shadow-xs">
        {/* Header Bar */}
        <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-border bg-background pr-[9px] pl-3">
          <div className="flex items-center gap-2.5">
            <div className="hidden md:block h-4 w-px bg-border mr-1" />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Link href="/bookmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                Bookmarks
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-strong font-semibold">Settings</span>
            </div>
          </div>
        </header>

        {/* Settings Navigation Tabs Bar */}
        <div className="flex items-center border-b border-border bg-background px-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`relative py-3 text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-strong font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Settings Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
