import { supabase, isSupabaseConfigured } from './supabase';
import { BookmarkItem, Collection, Tag } from '@/types/stashr';

// Row types from Supabase
export interface DbBookmark {
  id: string;
  platform: string;
  display_name: string;
  username: string;
  avatar_url?: string | null;
  image_url?: string | null;
  title?: string | null;
  text: string;
  url?: string | null;
  date: string;
  created_at_ms?: number | null;
  tags: { name: string; color: string }[];
  is_favorite?: boolean | null;
  is_archived?: boolean | null;
  note?: string | null;
  collection_id?: string | null;
  user_id?: string | null;
  created_at?: string;
}

interface DbCollection {
  id: string;
  name: string;
  icon?: string | null;
  user_id?: string | null;
  created_at?: string;
}

interface DbTag {
  id: string;
  name: string;
  color: string;
  user_id?: string | null;
  created_at?: string;
}

function sanitizeUuid(id?: string | null): string | null {
  if (!id || typeof id !== 'string') return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) ? id : null;
}

// Convert DB bookmark row to BookmarkItem
export function mapDbBookmarkToApp(row: DbBookmark): BookmarkItem {
  return {
    id: row.id,
    platform: (row.platform as BookmarkItem['platform']) || 'web',
    displayName: row.display_name,
    username: row.username,
    avatarUrl: row.avatar_url || undefined,
    imageUrl: row.image_url || undefined,
    title: row.title || undefined,
    text: row.text,
    url: row.url || undefined,
    date: row.date,
    createdAt: row.created_at_ms ? Number(row.created_at_ms) : undefined,
    tags: Array.isArray(row.tags) ? (row.tags as Tag[]) : [],
    isFavorite: Boolean(row.is_favorite),
    isArchived: Boolean(row.is_archived),
    note: row.note || undefined,
    collectionId: row.collection_id || undefined,
  };
}

// Convert BookmarkItem to DB bookmark row
function mapAppBookmarkToDb(item: BookmarkItem, userId?: string | null): DbBookmark {
  return {
    id: item.id,
    platform: item.platform,
    display_name: item.displayName,
    username: item.username,
    avatar_url: item.avatarUrl || null,
    image_url: item.imageUrl || null,
    title: item.title || null,
    text: item.text,
    url: item.url || null,
    date: item.date,
    created_at_ms: item.createdAt || Date.now(),
    tags: item.tags || [],
    is_favorite: Boolean(item.isFavorite),
    is_archived: Boolean(item.isArchived),
    note: item.note || null,
    collection_id: item.collectionId || null,
    user_id: sanitizeUuid(userId),
  };
}

export async function fetchBookmarksFromDb(userId?: string | null): Promise<BookmarkItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('bookmarks').select('*').order('created_at_ms', { ascending: false });
    
    const validUserId = sanitizeUuid(userId);
    if (validUserId) {
      query = query.or(`user_id.eq.${validUserId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookmarks from Supabase:', error);
      return null;
    }
    return (data as DbBookmark[]).map(mapDbBookmarkToApp);
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return null;
  }
}

export async function fetchCollectionsFromDb(userId?: string | null): Promise<Collection[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('collections').select('*').order('name', { ascending: true });
    
    const validUserId = sanitizeUuid(userId);
    if (validUserId) {
      query = query.or(`user_id.eq.${validUserId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching collections from Supabase:', error);
      return null;
    }
    return (data as DbCollection[]).map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon || undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch collections from Supabase:', err);
    return null;
  }
}

export async function fetchTagsFromDb(userId?: string | null): Promise<Tag[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('tags').select('*').order('name', { ascending: true });
    
    const validUserId = sanitizeUuid(userId);
    if (validUserId) {
      query = query.or(`user_id.eq.${validUserId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tags from Supabase:', error);
      return null;
    }
    return (data as DbTag[]).map(t => ({
      id: t.id,
      name: t.name,
      color: t.color as Tag['color'],
    }));
  } catch (err) {
    console.error('Failed to fetch tags from Supabase:', err);
    return null;
  }
}

export async function insertBookmarkToDb(item: BookmarkItem, userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const row = mapAppBookmarkToDb(item, userId);
    const { error } = await supabase.from('bookmarks').insert(row);
    if (error) {
      console.error('Error inserting bookmark into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert bookmark into Supabase:', err);
    return false;
  }
}

export async function updateBookmarkInDb(id: string, updates: Partial<BookmarkItem>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbUpdates: Partial<DbBookmark> = {};
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl || null;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl || null;
    if (updates.title !== undefined) dbUpdates.title = updates.title || null;
    if (updates.text !== undefined) dbUpdates.text = updates.text;
    if (updates.url !== undefined) dbUpdates.url = updates.url || null;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
    if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;
    if (updates.note !== undefined) dbUpdates.note = updates.note || null;
    if (updates.collectionId !== undefined) dbUpdates.collection_id = updates.collectionId || null;

    const { error } = await supabase
      .from('bookmarks')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating bookmark in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update bookmark in Supabase:', err);
    return false;
  }
}

export async function deleteBookmarkFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting bookmark from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete bookmark from Supabase:', err);
    return false;
  }
}

export async function deleteMultipleBookmarksFromDb(ids: string[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || ids.length === 0) return false;
  try {
    const { error } = await supabase.from('bookmarks').delete().in('id', ids);
    if (error) {
      console.error('Error batch deleting bookmarks from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to batch delete bookmarks from Supabase:', err);
    return false;
  }
}

export async function archiveMultipleBookmarksInDb(ids: string[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || ids.length === 0) return false;
  try {
    const { error } = await supabase.from('bookmarks').update({ is_archived: true }).in('id', ids);
    if (error) {
      console.error('Error batch archiving bookmarks in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to batch archive bookmarks in Supabase:', err);
    return false;
  }
}

export async function insertCollectionToDb(item: Collection, userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('collections').insert({
      id: item.id,
      name: item.name,
      icon: item.icon || null,
      user_id: sanitizeUuid(userId),
    });
    if (error) {
      console.error('Error inserting collection into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert collection into Supabase:', err);
    return false;
  }
}

export async function updateCollectionInDb(id: string, updates: Partial<Collection>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbUpdates: { name?: string; icon?: string | null } = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon || null;

    const { error } = await supabase
      .from('collections')
      .update(dbUpdates)
      .eq('id', id);
    if (error) {
      console.error('Error updating collection in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update collection in Supabase:', err);
    return false;
  }
}

export async function deleteCollectionFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    // 1. Unlink bookmarks that belonged to this collection
    await supabase.from('bookmarks').update({ collection_id: null }).eq('collection_id', id);
    // 2. Delete collection row
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) {
      console.error('Error deleting collection from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete collection from Supabase:', err);
    return false;
  }
}

export async function insertTagToDb(item: Tag, userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('tags').upsert({
      id: item.id,
      name: item.name,
      color: item.color,
      user_id: sanitizeUuid(userId),
    }, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting tag into Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert tag into Supabase:', err);
    return false;
  }
}

export async function updateTagInDb(id: string, updates: Partial<Tag>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const dbUpdates: { name?: string; color?: string } = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    const { error } = await supabase
      .from('tags')
      .update(dbUpdates)
      .eq('id', id);
    if (error) {
      console.error('Error updating tag in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update tag in Supabase:', err);
    return false;
  }
}

export async function deleteTagFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) {
      console.error('Error deleting tag from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete tag from Supabase:', err);
    return false;
  }
}

export async function wipeAllVaultDataFromDb(userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;
  try {
    const validUserId = sanitizeUuid(userId);
    if (validUserId) {
      await supabase.from('bookmarks').delete().eq('user_id', validUserId);
      await supabase.from('collections').delete().eq('user_id', validUserId);
      await supabase.from('tags').delete().eq('user_id', validUserId);
    }
    // Also delete any anonymous/guest bookmarks
    await supabase.from('bookmarks').delete().is('user_id', null);
    await supabase.from('collections').delete().is('user_id', null);
    return true;
  } catch (err) {
    console.error('Failed to wipe data from Supabase:', err);
    return false;
  }
}
