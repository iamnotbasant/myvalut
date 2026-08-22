import { supabase, isSupabaseConfigured } from './supabase';
import { BookmarkItem, Collection, Tag } from '@/types/stashr';

// Row types from Supabase
interface DbBookmark {
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
  tags: { name: string; color: any }[];
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
  color: any;
  user_id?: string | null;
  created_at?: string;
}

// Convert DB bookmark row to BookmarkItem
function mapDbBookmarkToApp(row: DbBookmark): BookmarkItem {
  return {
    id: row.id,
    platform: row.platform as any,
    displayName: row.display_name,
    username: row.username,
    avatarUrl: row.avatar_url || undefined,
    imageUrl: row.image_url || undefined,
    title: row.title || undefined,
    text: row.text,
    url: row.url || undefined,
    date: row.date,
    createdAt: row.created_at_ms ? Number(row.created_at_ms) : undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
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
    user_id: userId || null,
  };
}

export async function fetchBookmarksFromDb(userId?: string | null): Promise<BookmarkItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from('bookmarks').select('*').order('created_at_ms', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
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
    
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
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
    
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tags from Supabase:', error);
      return null;
    }
    return (data as DbTag[]).map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
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
      user_id: userId || null,
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

export async function insertTagToDb(item: Tag, userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('tags').upsert({
      id: item.id,
      name: item.name,
      color: item.color,
      user_id: userId || null,
    }, { onConflict: 'name' });
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
