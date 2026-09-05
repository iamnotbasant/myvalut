import { BookmarkItem } from '@/types/stashr';

const OFFLINE_QUEUE_KEY = 'valut_offline_sync_queue_v1';
const MAX_CACHED_BOOKMARKS = 300;

export interface OfflineMutation {
  id: string;
  type: 'insert_bookmark' | 'update_bookmark' | 'delete_bookmark';
  payload: any;
  timestamp: number;
}

/**
 * Quota-Safe LocalStorage Setter
 * Strips overly bloated payload strings and safely recovers if quota is exceeded
 */
export function safeLocalStorageSet<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: any) {
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      console.warn('[Valut Offline] LocalStorage quota exceeded. Pruning cache...');
      
      // If saving bookmarks array, prune older entries to fit within quota
      if (Array.isArray(data)) {
        try {
          const pruned = (data as BookmarkItem[]).slice(0, 150).map(b => ({
            ...b,
            // Prune any large base64 image strings to raw URLs
            imageUrl: b.imageUrl?.startsWith('data:') ? undefined : b.imageUrl,
            avatarUrl: b.avatarUrl?.startsWith('data:') ? undefined : b.avatarUrl,
          }));
          localStorage.setItem(key, JSON.stringify(pruned));
          return true;
        } catch {
          // If still fails, clear non-critical caches
          try {
            localStorage.removeItem('stashr_pinned_creators_v1');
            localStorage.setItem(key, JSON.stringify((data as any[]).slice(0, 50)));
            return true;
          } catch {}
        }
      }
    }
    return false;
  }
}

/**
 * Queue an offline mutation when network request fails
 */
export function queueOfflineMutation(mutation: Omit<OfflineMutation, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const list: OfflineMutation[] = raw ? JSON.parse(raw) : [];
    
    // Deduplicate mutation for the same bookmark ID
    const filtered = list.filter(m => !(m.payload?.id === mutation.payload?.id && m.type === mutation.type));
    filtered.push({
      ...mutation,
      timestamp: Date.now(),
    });

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered.slice(-100)));
  } catch (e) {
    console.warn('[Valut Offline] Failed to queue offline mutation:', e);
  }
}

/**
 * Get pending mutations
 */
export function getPendingOfflineMutations(): OfflineMutation[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear the offline queue
 */
export function clearOfflineQueue(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch {}
}

/**
 * Flush pending offline mutations to Supabase upon reconnect
 */
export async function flushOfflineQueue(handlers: {
  insertBookmark: (item: BookmarkItem, userId?: string | null) => Promise<boolean>;
  updateBookmark: (id: string, updates: Partial<BookmarkItem>) => Promise<boolean>;
  deleteBookmark: (id: string) => Promise<boolean>;
  userId?: string | null;
}): Promise<number> {
  const pending = getPendingOfflineMutations();
  if (pending.length === 0) return 0;

  console.log(`[Valut Sync] Flushing ${pending.length} offline mutations to Supabase...`);
  let syncedCount = 0;
  const remaining: OfflineMutation[] = [];

  for (const item of pending) {
    try {
      let ok = false;
      if (item.type === 'insert_bookmark') {
        ok = await handlers.insertBookmark(item.payload, handlers.userId);
      } else if (item.type === 'update_bookmark') {
        ok = await handlers.updateBookmark(item.id, item.payload);
      } else if (item.type === 'delete_bookmark') {
        ok = await handlers.deleteBookmark(item.id);
      }

      if (ok) {
        syncedCount++;
      } else {
        remaining.push(item);
      }
    } catch {
      remaining.push(item);
    }
  }

  try {
    if (remaining.length === 0) {
      clearOfflineQueue();
    } else {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    }
  } catch {}

  return syncedCount;
}
