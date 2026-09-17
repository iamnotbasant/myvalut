import { BookmarkItem, Collection, Tag } from '@/types/stashr';
import { normalizeTagCollection } from '@/lib/supabase-db';

export interface ValutExportData {
  appName: 'Valut';
  schemaVersion: 1;
  exportedAt: string;
  totalBookmarks: number;
  bookmarks: BookmarkItem[];
  collections: Collection[];
  tags: Tag[];
}

/**
 * Generate standard Netscape Bookmark HTML export (Chrome, Firefox, Safari, Edge, Raindrop format)
 */
export function exportVaultToNetscapeHtml(bookmarks: BookmarkItem[]): string {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const lines: string[] = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file.',
    '     It will be read and overwritten.',
    '     DO NOT EDIT! -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
    '    <DT><H3 ADD_DATE="' + Math.floor(Date.now() / 1000) + '">Valut Bookmarks</H3>',
    '    <DL><p>',
  ];

  for (const bm of bookmarks) {
    if (!bm.url) continue;
    const addDate = Math.floor((bm.createdAt || Date.now()) / 1000);
    const tagList = (bm.tags || []).map(t => t.name).join(',');
    const title = escapeHtml(bm.title || bm.text.slice(0, 80) || bm.url);
    const note = bm.note ? escapeHtml(bm.note) : '';

    const tagAttr = tagList ? ` TAGS="${escapeHtml(tagList)}"` : '';
    lines.push(`        <DT><A HREF="${escapeHtml(bm.url)}" ADD_DATE="${addDate}"${tagAttr}>${title}</A>`);
    if (note) {
      lines.push(`        <DD>${note}`);
    }
  }

  lines.push('    </DL><p>');
  lines.push('</DL><p>');

  return lines.join('\n');
}

/**
 * Parse Netscape Bookmarks HTML format into BookmarkItem[]
 */
export function parseNetscapeBookmarksHtml(htmlString: string): BookmarkItem[] {
  const bookmarks: BookmarkItem[] = [];
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Browser DOMParser approach if available
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));

      for (const a of links) {
        const href = a.getAttribute('href')?.trim();
        if (!href || (!href.startsWith('http://') && !href.startsWith('https://'))) continue;

        const title = a.textContent?.trim() || href;
        const addDateAttr = a.getAttribute('add_date');
        const timestamp = addDateAttr ? Number(addDateAttr) * 1000 : Date.now();
        const tagsAttr = a.getAttribute('tags') || '';
        const rawTags = tagsAttr.split(',').map(t => t.trim()).filter(Boolean);

        let note = '';
        const nextElem = a.parentElement?.nextElementSibling || a.nextElementSibling;
        if (nextElem && nextElem.tagName.toLowerCase() === 'dd') {
          note = nextElem.textContent?.trim() || '';
        }

        let platform: any = 'web';
        const lowerUrl = href.toLowerCase();
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) platform = 'youtube';
        else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) platform = 'twitter';
        else if (lowerUrl.includes('reddit.com')) platform = 'reddit';
        else if (lowerUrl.includes('github.com')) platform = 'github';
        else if (lowerUrl.includes('instagram.com')) platform = 'instagram';

        let domain = 'Web';
        try {
          domain = new URL(href).hostname.replace(/^www\./, '');
        } catch {}

        bookmarks.push({
          id: `bm_html_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          url: href,
          title,
          text: title,
          platform,
          displayName: domain,
          username: domain.toLowerCase(),
          date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || now,
          createdAt: timestamp,
          tags: normalizeTagCollection(rawTags),
          note: note || undefined,
          isFavorite: false,
          isArchived: false,
        });
      }

      if (bookmarks.length > 0) return bookmarks;
    } catch {
      // Fall back to regex
    }
  }

  // Fallback regex parser
  const regex = /<A\s+([^>]*?)>([^<]*?)<\/A>/gi;
  let match;
  while ((match = regex.exec(htmlString)) !== null) {
    const attrsStr = match[1];
    const textContent = match[2].trim();

    const hrefMatch = /HREF="([^"]*)"/i.exec(attrsStr);
    if (!hrefMatch || !hrefMatch[1]) continue;
    const href = hrefMatch[1].trim();
    if (!href.startsWith('http://') && !href.startsWith('https://')) continue;

    const tagsMatch = /TAGS="([^"]*)"/i.exec(attrsStr);
    const rawTags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];

    const dateMatch = /ADD_DATE="([^"]*)"/i.exec(attrsStr);
    const timestamp = dateMatch ? Number(dateMatch[1]) * 1000 : Date.now();

    let platform: any = 'web';
    const lowerUrl = href.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) platform = 'youtube';
    else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) platform = 'twitter';
    else if (lowerUrl.includes('reddit.com')) platform = 'reddit';
    else if (lowerUrl.includes('github.com')) platform = 'github';
    else if (lowerUrl.includes('instagram.com')) platform = 'instagram';

    let domain = 'Web';
    try {
      domain = new URL(href).hostname.replace(/^www\./, '');
    } catch {}

    bookmarks.push({
      id: `bm_html_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      url: href,
      title: textContent || href,
      text: textContent || href,
      platform,
      displayName: domain,
      username: domain.toLowerCase(),
      date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || now,
      createdAt: timestamp,
      tags: normalizeTagCollection(rawTags),
      isFavorite: false,
      isArchived: false,
    });
  }

  return bookmarks;
}

/**
 * Generate full-fidelity JSON export
 */
export function exportVaultToJson(
  bookmarks: BookmarkItem[],
  collections: Collection[] = [],
  tags: Tag[] = []
): string {
  const exportPayload: ValutExportData = {
    appName: 'Valut',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    totalBookmarks: bookmarks.length,
    bookmarks,
    collections,
    tags,
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Generate clean, human-readable Markdown export compatible with Obsidian, Notion, Logseq
 */
export function exportVaultToMarkdown(
  bookmarks: BookmarkItem[],
  options?: { filterTitle?: string }
): string {
  const now = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const lines: string[] = [];

  // Header
  lines.push(`# Valut Knowledge Backup`);
  lines.push(`*Exported on ${now} | Total: ${bookmarks.length} bookmarks*`);
  if (options?.filterTitle) {
    lines.push(`*View: ${options.filterTitle}*`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Group bookmarks by Platform
  const byPlatform: Record<string, BookmarkItem[]> = {};
  for (const bm of bookmarks) {
    const key = bm.platform || 'web';
    if (!byPlatform[key]) byPlatform[key] = [];
    byPlatform[key].push(bm);
  }

  const platformDisplayNames: Record<string, string> = {
    youtube: '📺 YouTube Videos',
    twitter: '🐦 X / Twitter Posts',
    reddit: '💬 Reddit Discussions',
    instagram: '📸 Instagram Posts',
    github: '💻 GitHub Repositories',
    web: '🌐 Web Articles & Resources',
  };

  for (const [platformKey, items] of Object.entries(byPlatform)) {
    const sectionName = platformDisplayNames[platformKey] || `📌 ${platformKey.toUpperCase()}`;
    lines.push(`## ${sectionName} (${items.length})`);
    lines.push('');

    items.forEach((item, index) => {
      const title = item.title || item.text.slice(0, 70) || 'Untitled Bookmark';
      const link = item.url ? `[${title}](${item.url})` : title;

      lines.push(`### ${index + 1}. ${link}`);
      
      const metaParts: string[] = [];
      if (item.displayName || item.username) {
        metaParts.push(`**Author:** ${item.displayName || ''} (@${item.username || ''})`);
      }
      if (item.date) {
        metaParts.push(`**Date:** ${item.date}`);
      }
      if (metaParts.length > 0) {
        lines.push(metaParts.join(' | '));
      }

      // Tags as hashtags
      if (item.tags && item.tags.length > 0) {
        const tagStrings = item.tags.map(t => `#${t.name.replace(/\s+/g, '_')}`).join(' ');
        lines.push(`**Tags:** ${tagStrings}`);
      }

      // Quote / text
      if (item.text && item.text !== item.title) {
        const quoteText = item.text
          .split('\n')
          .map(line => `> ${line}`)
          .join('\n');
        lines.push(quoteText);
      }

      // Note
      if (item.note) {
        lines.push(`> 📝 **Personal Note:** ${item.note}`);
      }

      lines.push('');
    });

    lines.push('---');
    lines.push('');
  }

  lines.push(`*Generated by Valut Knowledge Vault*`);
  return lines.join('\n');
}

/**
 * Trigger Instant Browser File Download
 */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy string content to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch {
    return false;
  }
}

/**
 * Parse and safely validate imported JSON or Netscape HTML bookmark backups
 */
export function parseAndValidateImport(fileContent: string): {
  success: boolean;
  data?: {
    bookmarks: BookmarkItem[];
    collections: Collection[];
    tags: Tag[];
  };
  error?: string;
} {
  const trimmed = fileContent.trim();

  // 1. Check if input is standard Netscape HTML format (Chrome, Safari, Firefox, Edge, Raindrop)
  if (
    trimmed.toLowerCase().includes('<!doctype netscape') ||
    trimmed.toLowerCase().includes('<meta http-equiv="content-type"') ||
    trimmed.toLowerCase().includes('<dl><p>') ||
    (trimmed.includes('<A HREF=') || trimmed.includes('<a href='))
  ) {
    try {
      const htmlBookmarks = parseNetscapeBookmarksHtml(fileContent);
      if (htmlBookmarks.length === 0) {
        return { success: false, error: 'No bookmarks could be extracted from this HTML file.' };
      }
      return {
        success: true,
        data: {
          bookmarks: htmlBookmarks,
          collections: [],
          tags: [],
        },
      };
    } catch (e: any) {
      return { success: false, error: `Failed to parse HTML bookmarks: ${e.message}` };
    }
  }

  // 2. Otherwise parse as JSON backup
  try {
    const parsed = JSON.parse(fileContent);

    let rawBookmarks: any[] = [];
    let rawCollections: any[] = [];
    let rawTags: any[] = [];

    // Support both standard Valut backup schema and raw bookmark arrays
    if (Array.isArray(parsed)) {
      rawBookmarks = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.bookmarks)) rawBookmarks = parsed.bookmarks;
      if (Array.isArray(parsed.collections)) rawCollections = parsed.collections;
      if (Array.isArray(parsed.tags)) rawTags = parsed.tags;
    } else {
      return { success: false, error: 'Invalid file format. Expected JSON object or array.' };
    }

    if (rawBookmarks.length === 0) {
      return { success: false, error: 'No bookmarks found in the imported file.' };
    }

    // Validate and sanitize each bookmark
    const validBookmarks: BookmarkItem[] = [];
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    for (const b of rawBookmarks) {
      if (!b || typeof b !== 'object') continue;
      if (!b.url && !b.text && !b.title) continue;

      const validId = b.id && typeof b.id === 'string' ? b.id : `bm_imp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const normalizedTags = normalizeTagCollection(Array.isArray(b.tags) ? b.tags : []);

      validBookmarks.push({
        id: validId,
        platform: b.platform || 'web',
        displayName: b.displayName || b.display_name || 'Creator',
        username: b.username ? (String(b.username).startsWith('@') ? String(b.username).slice(1) : String(b.username)) : 'creator',
        avatarUrl: b.avatarUrl || b.avatar_url || undefined,
        imageUrl: b.imageUrl || b.image_url || undefined,
        title: b.title || undefined,
        text: b.text || b.title || b.url || 'Saved Bookmark',
        url: b.url || undefined,
        date: b.date || now,
        createdAt: Number(b.createdAt || b.created_at_ms) || Date.now(),
        tags: normalizedTags,
        isFavorite: Boolean(b.isFavorite || b.is_favorite),
        isArchived: Boolean(b.isArchived || b.is_archived),
        note: b.note || undefined,
        collectionId: b.collectionId || b.collection_id || undefined,
      });
    }

    const validCollections: Collection[] = rawCollections.map((c: any) => ({
      id: c.id || `col_${Date.now()}`,
      name: c.name || 'Untitled Collection',
      icon: c.icon || undefined,
    }));

    const validTags: Tag[] = normalizeTagCollection(rawTags) as Tag[];

    return {
      success: true,
      data: {
        bookmarks: validBookmarks,
        collections: validCollections,
        tags: validTags,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Could not parse JSON file: ${err.message || 'Syntax error'}`,
    };
  }
}
