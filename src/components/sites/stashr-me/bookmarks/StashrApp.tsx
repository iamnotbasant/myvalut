'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  BookmarkItem,
  Collection,
  Tag,
  FilterState,
  ViewMode
} from '@/types/stashr';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { SecondaryToolbar } from './SecondaryToolbar';
import { BookmarksContainer } from './BookmarksContainer';
import { CreatorsView, ConnectionsView } from './OtherViews';
import { SystemLogsView } from './SystemLogsView';
import { CommandPalette } from './CommandPalette';
import {
  AddBookmarkModal,
  AddCollectionModal,
  EditCollectionModal,
  ConfirmDialogModal,
  NoteModal,
  ImageLightboxModal,
  FeedbackModal
} from './Modals';
import { BookmarkDetailModal } from './BookmarkDetailModal';
import {
  fetchBookmarksFromDb,
  fetchCollectionsFromDb,
  fetchTagsFromDb,
  insertBookmarkToDb,
  updateBookmarkInDb,
  deleteBookmarkFromDb,
  deleteMultipleBookmarksFromDb,
  archiveMultipleBookmarksInDb,
  insertCollectionToDb,
  updateCollectionInDb,
  deleteCollectionFromDb,
  insertTagToDb,
  mapDbBookmarkToApp,
  DbBookmark
} from '@/lib/supabase-db';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CreatorProfile } from './OtherViews';

import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { soundFx } from '@/lib/sound-effects';

interface StashrAppProps {
  initialNav?: 'bookmarks' | 'archived' | 'creators' | 'connections' | 'logs';
}

function getInitialLocalStorageData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function StashrApp({ initialNav = 'bookmarks' }: StashrAppProps) {
  const { user } = useAuth();

  // 1. Data States with 0ms Instant Hydration
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    getInitialLocalStorageData<BookmarkItem[]>('stashr_bookmarks_v3', [])
  );
  const [collections, setCollections] = useState<Collection[]>(() =>
    getInitialLocalStorageData<Collection[]>('stashr_collections_v3', [])
  );
  const [tags, setTags] = useState<Tag[]>(() =>
    getInitialLocalStorageData<Tag[]>('stashr_tags_v3', [])
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // 2. View and Filter States
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashr_view_mode') as ViewMode;
      if (saved) return saved;
    }
    return 'grid';
  });

  const [columns, setColumns] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashr_grid_columns');
      if (saved) return Number(saved);
    }
    return 3;
  });

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
  const [activeEditCollection, setActiveEditCollection] = useState<Collection | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });
  const [pinnedCreatorIds, setPinnedCreatorIds] = useState<string[]>(() =>
    getInitialLocalStorageData<string[]>('stashr_pinned_creators_v1', [])
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeNoteBookmark, setActiveNoteBookmark] = useState<BookmarkItem | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [activeDetailBookmark, setActiveDetailBookmark] = useState<BookmarkItem | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Background tag generation tracking state
  const [generatingTagIds, setGeneratingTagIds] = useState<Set<string>>(new Set());
  const processedAutoTagIdsRef = useRef<Set<string>>(new Set());

  // Sync pinned creators to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stashr_pinned_creators_v1', JSON.stringify(pinnedCreatorIds));
    } catch {}
  }, [pinnedCreatorIds]);

  // 5. Theme & Network State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stashr_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isOnline, setIsOnline] = useState(true);

  // Network offline / online detection & auto-reconnect sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (isSupabaseConfigured) {
        Promise.all([
          fetchBookmarksFromDb(user?.id),
          fetchCollectionsFromDb(user?.id),
          fetchTagsFromDb(user?.id)
        ])
          .then(([dbBm, dbCol, dbTg]) => {
            if (dbBm !== null) setBookmarks(dbBm);
            if (dbCol !== null) setCollections(dbCol);
            if (dbTg !== null) setTags(dbTg);
          })
          .catch(() => {});
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Apply dark class on mount/change
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load from Supabase in the background
  useEffect(() => {
    let isCancelled = false;

    async function loadFromDatabase() {
      if (!isSupabaseConfigured) {
        setIsLoaded(true);
        return;
      }

      try {
        const [dbBookmarks, dbCollections, dbTags] = await Promise.all([
          fetchBookmarksFromDb(user?.id),
          fetchCollectionsFromDb(user?.id),
          fetchTagsFromDb(user?.id)
        ]);

        if (!isCancelled) {
          if (dbBookmarks !== null) setBookmarks(dbBookmarks);
          if (dbCollections !== null) setCollections(dbCollections);
          if (dbTags !== null) setTags(dbTags);
        }
      } catch (err) {
        console.error('Failed background sync with Supabase:', err);
      } finally {
        if (!isCancelled) {
          setIsLoaded(true);
        }
      }
    }

    loadFromDatabase();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // 6. Supabase Realtime Live WebSocket Sync (Zero Refresh Needed!)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('realtime-bookmarks-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBm = mapDbBookmarkToApp(payload.new as DbBookmark);
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === newBm.id)) return prev;
              return [newBm, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedBm = mapDbBookmarkToApp(payload.new as DbBookmark);
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBm.id ? updatedBm : b))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id?: string })?.id;
            if (deletedId) {
              setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  // Debounced LocalStorage save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('stashr_bookmarks_v3', JSON.stringify(bookmarks));
        localStorage.setItem('stashr_collections_v3', JSON.stringify(collections));
        localStorage.setItem('stashr_tags_v3', JSON.stringify(tags));
      } catch {}
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [bookmarks, collections, tags, isLoaded]);

  // Global keyboard shortcuts for Quick Add (+ or n)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '+' || e.key === '=' || (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey)) {
        e.preventDefault();
        soundFx.playClickSound();
        setIsAddBookmarkOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('stashr_theme', nextDark ? 'dark' : 'light');
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
    const target = bookmarks.find(b => b.id === id);
    const nextVal = target ? !target.isFavorite : true;
    if (nextVal) {
      soundFx.playFavoriteSound();
    } else {
      soundFx.playClickSound();
    }
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, isFavorite: nextVal } : b))
    );
    updateBookmarkInDb(id, { isFavorite: nextVal });
  };

  const handleArchive = (id: string) => {
    soundFx.playArchiveSound();
    const target = bookmarks.find(b => b.id === id);
    const nextVal = target ? !target.isArchived : true;
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, isArchived: nextVal } : b))
    );
    updateBookmarkInDb(id, { isArchived: nextVal });
  };

  const handleDelete = (id: string) => {
    soundFx.playArchiveSound();
    setBookmarks(prev => prev.filter(b => b.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    deleteBookmarkFromDb(id);
  };

  const handleSaveNote = (id: string, note: string) => {
    soundFx.playClickSound();
    const trimmed = note.trim() || undefined;
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, note: trimmed } : b))
    );
    updateBookmarkInDb(id, { note: trimmed });
  };

  const handleSelectTag = (tagName: string) => {
    soundFx.playTagSound();
    setFilterState(prev => {
      const isAlreadySelected = prev.tags.includes(tagName);
      return {
        ...prev,
        tags: isAlreadySelected
          ? prev.tags.filter(t => t !== tagName)
          : [...prev.tags, tagName],
        activeNav: 'bookmarks'
      };
    });
  };

  // AI Tag Generator for a Bookmark (manual trigger or auto-queue)
  const handleGenerateTagsForBookmark = useCallback(async (bookmark: BookmarkItem) => {
    if (!bookmark || !bookmark.id || generatingTagIds.has(bookmark.id)) return;

    setGeneratingTagIds(prev => new Set(prev).add(bookmark.id));

    try {
      const response = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: bookmark.id,
          url: bookmark.url || '',
          title: bookmark.title || '',
          text: bookmark.text || '',
          platform: bookmark.platform || 'web',
          displayName: bookmark.displayName || '',
          username: bookmark.username || '',
          userId: user?.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newTags = Array.isArray(result.tags) ? result.tags : [];

        if (newTags.length > 0) {
          // Update bookmark in local state
          setBookmarks(prev =>
            prev.map(b => (b.id === bookmark.id ? { ...b, tags: newTags } : b))
          );

          // Update tags catalog if new tags added
          setTags(prevTags => {
            const existingNames = new Set(prevTags.map(t => t.name.toLowerCase()));
            const toAdd: Tag[] = [];
            for (const nt of newTags) {
              if (!existingNames.has(nt.name.toLowerCase())) {
                const newTagObj: Tag = {
                  id: `tag_${nt.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                  name: nt.name,
                  color: nt.color,
                };
                toAdd.push(newTagObj);
                existingNames.add(nt.name.toLowerCase());
                insertTagToDb(newTagObj, user?.id);
              }
            }
            return toAdd.length > 0 ? [...prevTags, ...toAdd] : prevTags;
          });

          // Save bookmark tags update to Supabase
          updateBookmarkInDb(bookmark.id, { tags: newTags });
        }
      }
    } catch (err) {
      console.warn('Auto-tagging error for bookmark:', bookmark.id, err);
    } finally {
      setGeneratingTagIds(prev => {
        const next = new Set(prev);
        next.delete(bookmark.id);
        return next;
      });
    }
  }, [generatingTagIds, user]);

  const handleAddBookmark = (newBm: Omit<BookmarkItem, 'id' | 'date'>) => {
    soundFx.playSaveSound();
    const created: BookmarkItem = {
      ...newBm,
      id: `b_${Date.now()}`,
      date: 'Just now',
      createdAt: Date.now()
    };
    setBookmarks(prev => [created, ...prev]);
    insertBookmarkToDb(created, user?.id);

    // Update tags list if new tags were introduced
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
      additions.forEach(tag => insertTagToDb(tag, user?.id));
      return [...prev, ...additions];
    });
  };

  const handleAddCollection = (newCol: { name: string; icon: string }) => {
    soundFx.playClickSound();
    const created: Collection = {
      id: `c_${Date.now()}`,
      name: newCol.name,
      icon: newCol.icon,
      count: 0
    };
    setCollections(prev => [...prev, created]);
    insertCollectionToDb(created, user?.id);
  };

  const handleEditCollection = (collection: Collection) => {
    soundFx.playClickSound();
    setActiveEditCollection(collection);
  };

  const handleSaveEditCollection = (id: string, updates: { name: string; icon: string }) => {
    soundFx.playClickSound();
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    updateCollectionInDb(id, updates);
  };

  const handleDeleteCollection = (id: string) => {
    const target = collections.find(c => c.id === id);
    const targetName = target?.name || 'this collection';

    setConfirmDialog({
      isOpen: true,
      title: 'Delete collection?',
      description: `Are you sure you want to delete "${targetName}"? Any bookmarks in this collection will remain safe in your vault.`,
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: () => {
        soundFx.playArchiveSound();
        setCollections(prev => prev.filter(c => c.id !== id));
        if (filterState.collectionId === id) {
          setFilterState(prev => ({ ...prev, collectionId: null }));
        }
        deleteCollectionFromDb(id);
      }
    });
  };

  const handleTogglePinCollection = (id: string) => {
    soundFx.playClickSound();
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleTogglePinCreator = (creatorId: string) => {
    soundFx.playClickSound();
    setPinnedCreatorIds(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleDeleteCreatorBookmarks = (creator: CreatorProfile) => {
    const ids = creator.bookmarks.map(b => b.id);
    if (ids.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      title: `Delete all bookmarks by ${creator.displayName}?`,
      description: `This will delete ${ids.length} ${ids.length === 1 ? 'bookmark' : 'bookmarks'} by @${creator.username} from your vault. This action cannot be undone.`,
      confirmText: `Delete ${ids.length} Bookmarks`,
      isDestructive: true,
      onConfirm: () => {
        soundFx.playArchiveSound();
        const idSet = new Set(ids);
        setBookmarks(prev => prev.filter(b => !idSet.has(b.id)));
        deleteMultipleBookmarksFromDb(ids);
      }
    });
  };

  const handleShuffle = () => {
    soundFx.playClickSound();
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
    const ids = Array.from(selectedIds);
    setBookmarks(prev =>
      prev.map(b => (selectedIds.has(b.id) ? { ...b, isArchived: true } : b))
    );
    archiveMultipleBookmarksInDb(ids);
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleDeleteSelected = () => {
    const ids = Array.from(selectedIds);
    setBookmarks(prev => prev.filter(b => !selectedIds.has(b.id)));
    deleteMultipleBookmarksFromDb(ids);
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
        const matchesTags = (b.tags || []).some(t => t.name.toLowerCase().includes(q));
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
        const hasTag = (b.tags || []).some(t => filterState.tags.includes(t.name));
        if (!hasTag) return false;
      }

      // 5. Favorites filter
      if (filterState.onlyFavorites) {
        if (!b.isFavorite) return false;
      }

      return true;
    });
  }, [bookmarks, filterState]);

  const allAvailableTags = useMemo<Tag[]>(() => {
    const map = new Map<string, Tag>();

    // First populate from initial/fetched tags state
    tags.forEach(t => {
      map.set(t.name.toLowerCase(), { ...t, count: 0 });
    });

    // Compute live counts and discover any tags from saved bookmarks
    bookmarks.forEach(bm => {
      if (bm.tags && Array.isArray(bm.tags)) {
        bm.tags.forEach(t => {
          if (!t || !t.name) return;
          const key = t.name.toLowerCase();
          const existing = map.get(key);
          if (existing) {
            existing.count = (existing.count || 0) + 1;
          } else {
            map.set(key, {
              id: `tag_${key.replace(/[^a-z0-9]/g, '_')}`,
              name: t.name,
              color: t.color || 'teal',
              count: 1,
            });
          }
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tags, bookmarks]);

  const activeBookmarksCount = bookmarks.filter(b => !b.isArchived).length;
  const archivedBookmarksCount = bookmarks.filter(b => b.isArchived).length;
  const uniqueCreatorsCount = useMemo(() => {
    const activeBms = bookmarks.filter(b => !b.isArchived);
    const sourceBms = activeBms.length > 0 ? activeBms : bookmarks;
    const set = new Set(
      sourceBms
        .map(b => `${b.platform || 'web'}___${(b.username || b.displayName || '').replace(/^@+/, '').replace(/^u\//i, '').trim().toLowerCase()}`)
        .filter(k => !k.endsWith('___'))
    );
    return set.size;
  }, [bookmarks]);

  return (
    <div className="flex h-svh overflow-hidden bg-background md:bg-sidebar text-foreground antialiased selection:bg-primary/20">
      {/* 1. Left Navigation Sidebar (w-56) */}
      <Sidebar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        collections={collections}
        tags={allAvailableTags}
        bookmarksCount={activeBookmarksCount}
        archivedCount={archivedBookmarksCount}
        creatorsCount={uniqueCreatorsCount}
        onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
        onOpenAddCollection={() => setIsAddCollectionOpen(true)}
        onEditCollection={handleEditCollection}
        onDeleteCollection={handleDeleteCollection}
        onTogglePinCollection={handleTogglePinCollection}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
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
          tags={allAvailableTags}
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
            onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
            onDeleteCreatorBookmarks={handleDeleteCreatorBookmarks}
            onTogglePinCreator={handleTogglePinCreator}
            pinnedCreatorIds={pinnedCreatorIds}
          />
        )}

        {filterState.activeNav === 'connections' && <ConnectionsView bookmarks={bookmarks} />}

        {filterState.activeNav === 'logs' && (
          <SystemLogsView bookmarks={bookmarks} onGenerateTags={handleGenerateTagsForBookmark} />
        )}

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
                tags={allAvailableTags}
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
                onOpenDetail={setActiveDetailBookmark}
                onSelectTag={handleSelectTag}
                generatingTagIds={generatingTagIds}
                onGenerateTags={handleGenerateTagsForBookmark}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. Modal Dialogs */}
      <BookmarkDetailModal
        bookmark={activeDetailBookmark}
        isOpen={!!activeDetailBookmark}
        isGeneratingTags={activeDetailBookmark ? generatingTagIds.has(activeDetailBookmark.id) : false}
        onClose={() => setActiveDetailBookmark(null)}
        onSelectTag={handleSelectTag}
        onGenerateTags={handleGenerateTagsForBookmark}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
        bookmarks={bookmarks}
        collections={collections}
        tags={allAvailableTags}
        onToggleTheme={handleToggleTheme}
        isDark={isDark}
        onOpenAddBookmark={() => setIsAddBookmarkOpen(true)}
      />

      <AddBookmarkModal
        isOpen={isAddBookmarkOpen}
        onClose={() => setIsAddBookmarkOpen(false)}
        onAdd={handleAddBookmark}
        availableTags={allAvailableTags}
      />

      <AddCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onAdd={handleAddCollection}
      />

      <EditCollectionModal
        isOpen={!!activeEditCollection}
        collection={activeEditCollection}
        onClose={() => setActiveEditCollection(null)}
        onSave={handleSaveEditCollection}
        onDelete={handleDeleteCollection}
      />

      <ConfirmDialogModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 4. Subtle Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-amber-500/30 bg-neutral-900/90 px-4 py-2 text-xs text-amber-300 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <span className="size-2 rounded-full bg-amber-400 animate-ping" />
          <span>Offline mode — your bookmarks are cached locally and will auto-sync when online.</span>
        </div>
      )}
    </div>
  );
}
