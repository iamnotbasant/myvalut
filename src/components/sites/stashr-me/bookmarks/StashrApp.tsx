'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookmarkItem,
  Collection,
  Tag,
  FilterState,
  ViewMode
} from '@/types/stashr';
import {
  INITIAL_BOOKMARKS,
  INITIAL_COLLECTIONS,
  INITIAL_TAGS
} from './mock-data';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { SecondaryToolbar } from './SecondaryToolbar';
import { BookmarksContainer } from './BookmarksContainer';
import { CreatorsView, ConnectionsView } from './OtherViews';
import { CommandPalette } from './CommandPalette';
import {
  AddBookmarkModal,
  AddCollectionModal,
  NoteModal,
  ImageLightboxModal,
  FeedbackModal
} from './Modals';

interface StashrAppProps {
  initialNav?: 'bookmarks' | 'archived' | 'creators' | 'connections';
}

export function StashrApp({ initialNav = 'bookmarks' }: StashrAppProps) {
  // 1. Data States with LocalStorage Hydration
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. View and Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [columns, setColumns] = useState<number>(3);
  const [filterState, setFilterState] = useState<FilterState>({
    query: '',
    platforms: [],
    tags: [],
    onlyFavorites: false,
    collectionId: null,
    activeNav: initialNav
  });

  // 3. Selection States
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 4. Modal States
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeNoteBookmark, setActiveNoteBookmark] = useState<BookmarkItem | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 5. Theme State
  const [isDark, setIsDark] = useState(false);

  // Initialize theme and load persisted data from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('stashr_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setIsDark(shouldUseDark);
      if (shouldUseDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedBookmarks = localStorage.getItem('stashr_bookmarks_v1');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      const savedCollections = localStorage.getItem('stashr_collections_v1');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }

      const savedView = localStorage.getItem('stashr_view_mode') as ViewMode;
      if (savedView) {
        setViewMode(savedView);
      }

      const savedCols = localStorage.getItem('stashr_grid_columns');
      if (savedCols) {
        setColumns(Number(savedCols));
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stashr_bookmarks_v1', JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stashr_collections_v1', JSON.stringify(collections));
    }
  }, [collections, isLoaded]);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stashr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stashr_theme', 'light');
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('stashr_view_mode', mode);
  };

  const handleColumnsChange = (cols: number) => {
    setColumns(cols);
    localStorage.setItem('stashr_grid_columns', String(cols));
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  // Actions
  const handleToggleFavorite = (id: string) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const handleArchive = (id: string) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, isArchived: !b.isArchived } : b))
    );
  };

  const handleDelete = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSaveNote = (id: string, note: string) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, note: note.trim() || undefined } : b))
    );
  };

  const handleAddBookmark = (newBm: Omit<BookmarkItem, 'id' | 'date'>) => {
    const created: BookmarkItem = {
      ...newBm,
      id: `b_${Date.now()}`,
      date: 'Just now',
      createdAt: Date.now()
    };
    setBookmarks(prev => [created, ...prev]);

    // Update tags list if new tags were introduced
    const newTagNames = newBm.tags.map(t => t.name);
    setTags(prev => {
      const existingNames = new Set(prev.map(t => t.name));
      const additions: Tag[] = newBm.tags
        .filter(t => !existingNames.has(t.name))
        .map(t => ({
          id: `t_${Date.now()}_${t.name}`,
          name: t.name,
          color: t.color,
          count: 1
        }));
      return [...prev, ...additions];
    });
  };

  const handleAddCollection = (newCol: { name: string; icon: string }) => {
    const created: Collection = {
      id: `c_${Date.now()}`,
      name: newCol.name,
      icon: newCol.icon,
      count: 0
    };
    setCollections(prev => [...prev, created]);
  };

  const handleShuffle = () => {
    setBookmarks(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredBookmarks.map(b => b.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleArchiveSelected = () => {
    setBookmarks(prev =>
      prev.map(b => (selectedIds.has(b.id) ? { ...b, isArchived: true } : b))
    );
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleDeleteSelected = () => {
    setBookmarks(prev => prev.filter(b => !selectedIds.has(b.id)));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  // Filtered bookmarks computation
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      // 1. Navigation tab filtering
      if (filterState.activeNav === 'archived') {
        if (!b.isArchived) return false;
      } else {
        if (b.isArchived) return false;
      }

      // 2. Search query substring matching
      if (filterState.query.trim()) {
        const q = filterState.query.toLowerCase();
        const matchesText = b.text.toLowerCase().includes(q);
        const matchesAuthor = b.displayName.toLowerCase().includes(q);
        const matchesUsername = b.username.toLowerCase().includes(q);
        const matchesTags = b.tags.some(t => t.name.toLowerCase().includes(q));
        const matchesNote = b.note?.toLowerCase().includes(q);
        if (!matchesText && !matchesAuthor && !matchesUsername && !matchesTags && !matchesNote) {
          return false;
        }
      }

      // 3. Platform filter
      if (filterState.platforms.length > 0) {
        if (!filterState.platforms.includes(b.platform)) return false;
      }

      // 4. Tags filter
      if (filterState.tags.length > 0) {
        const hasTag = b.tags.some(t => filterState.tags.includes(t.name));
        if (!hasTag) return false;
      }

      // 5. Favorites filter
      if (filterState.onlyFavorites) {
        if (!b.isFavorite) return false;
      }

      return true;
    });
  }, [bookmarks, filterState]);

  const activeBookmarksCount = bookmarks.filter(b => !b.isArchived).length;
  const archivedBookmarksCount = bookmarks.filter(b => b.isArchived).length;

  return (
    <div className="flex h-svh overflow-hidden bg-background md:bg-sidebar text-foreground antialiased selection:bg-primary/20">
      {/* 1. Left Navigation Sidebar (w-56) */}
      <Sidebar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        collections={collections}
        tags={tags}
        bookmarksCount={activeBookmarksCount}
        archivedCount={archivedBookmarksCount}
        onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
        onOpenAddCollection={() => setIsAddCollectionOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 2. Main Content Floating Rounded Container */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background md:my-2 md:mr-2 md:rounded-xl md:border">
        {/* Top Header & Breadcrumbs & Action Toolbar */}
        <Header
          filterState={filterState}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          columns={columns}
          onColumnsChange={handleColumnsChange}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={() => {
            setIsSelectionMode(!isSelectionMode);
            setSelectedIds(new Set());
          }}
          onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
          onShuffle={handleShuffle}
          tags={tags}
          collections={collections}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />

        {/* Active Filter Pills Bar */}
        {filterState.activeNav === 'bookmarks' && (
          <FilterBar
            filterState={filterState}
            onFilterChange={handleFilterChange}
            collections={collections}
            totalResults={filteredBookmarks.length}
          />
        )}

        {/* Dynamic View Body */}
        {filterState.activeNav === 'creators' && (
          <CreatorsView
            bookmarks={bookmarks}
            onSelectCreator={username => {
              setFilterState({
                query: username,
                activeNav: 'bookmarks',
                platforms: [],
                tags: [],
                onlyFavorites: false,
                collectionId: null
              });
            }}
          />
        )}

        {filterState.activeNav === 'connections' && <ConnectionsView />}

        {(filterState.activeNav === 'bookmarks' || filterState.activeNav === 'archived') && (
          <div className="flex-1 overflow-y-auto">
            <div className="relative flex h-full flex-col">
              <SecondaryToolbar
                filterState={filterState}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                isSelectionMode={isSelectionMode}
                onToggleSelectionMode={() => {
                  setIsSelectionMode(!isSelectionMode);
                  setSelectedIds(new Set());
                }}
                onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
                onShuffle={handleShuffle}
                tags={tags}
                platforms={[
                  { key: 'twitter', label: 'Twitter / X' },
                  { key: 'reddit', label: 'Reddit' },
                  { key: 'instagram', label: 'Instagram' },
                  { key: 'tiktok', label: 'TikTok' },
                  { key: 'youtube', label: 'YouTube' },
                  { key: 'web', label: 'Web' }
                ]}
              />
              <BookmarksContainer
                bookmarks={filteredBookmarks}
                allBookmarksCount={
                  filterState.activeNav === 'archived'
                    ? archivedBookmarksCount
                    : activeBookmarksCount
                }
                viewMode={viewMode}
                columns={columns}
                selectedIds={selectedIds}
                isSelectionMode={isSelectionMode}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onToggleFavorite={handleToggleFavorite}
                onOpenNote={setActiveNoteBookmark}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onArchiveSelected={handleArchiveSelected}
                onDeleteSelected={handleDeleteSelected}
                onResetFilters={() =>
                  setFilterState({
                    query: '',
                    platforms: [],
                    tags: [],
                    onlyFavorites: false,
                    collectionId: null,
                    activeNav: filterState.activeNav
                  })
                }
                onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
                onOpenImage={setActiveLightboxImage}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. Modal Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        bookmarks={bookmarks}
        collections={collections}
        tags={tags}
        onToggleTheme={handleToggleTheme}
        isDark={isDark}
      />

      <AddBookmarkModal
        isOpen={isAddBookmarkOpen}
        onClose={() => setIsAddBookmarkOpen(false)}
        onAdd={handleAddBookmark}
        availableTags={tags}
      />

      <AddCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onAdd={handleAddCollection}
      />

      <NoteModal
        bookmark={activeNoteBookmark}
        isOpen={!!activeNoteBookmark}
        onClose={() => setActiveNoteBookmark(null)}
        onSave={handleSaveNote}
      />

      <ImageLightboxModal
        imageUrl={activeLightboxImage}
        isOpen={!!activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
