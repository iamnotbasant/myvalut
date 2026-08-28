// Generic Page Scraper & Listener for Valut
(function () {
  function getMetaContent(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const content = el.getAttribute('content') || el.getAttribute('value') || el.textContent;
        if (content && content.trim()) return content.trim();
      }
    }
    return '';
  }

  function extractGenericPageData() {
    const url = window.location.href;
    const hostname = window.location.hostname.replace(/^www\./, '');

    const ogTitle = getMetaContent(['meta[property="og:title"]', 'meta[name="twitter:title"]']);
    const title = ogTitle || document.title || hostname;

    const ogDesc = getMetaContent([
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]);
    const text = ogDesc || title || url;

    const ogImage = getMetaContent(['meta[property="og:image"]', 'meta[name="twitter:image"]']);
    let imageUrl = ogImage;
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        imageUrl = new URL(imageUrl, window.location.origin).href;
      } catch {
        imageUrl = '';
      }
    }

    const faviconEl = document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    let avatarUrl = '';
    if (faviconEl) {
      const href = faviconEl.getAttribute('href');
      if (href) {
        try {
          avatarUrl = new URL(href, window.location.origin).href;
        } catch {
          avatarUrl = '';
        }
      }
    }
    if (!avatarUrl) {
      avatarUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    }

    const siteName = getMetaContent(['meta[property="og:site_name"]', 'meta[name="author"]']) || hostname;

    let platform = 'web';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) platform = 'youtube';
    else if (hostname.includes('twitter.com') || hostname.includes('x.com')) platform = 'twitter';
    else if (hostname.includes('instagram.com')) platform = 'instagram';
    else if (hostname.includes('reddit.com')) platform = 'reddit';
    else if (hostname.includes('tiktok.com')) platform = 'tiktok';
    else if (hostname.includes('pinterest.com')) platform = 'pinterest';
    else if (hostname.includes('threads.net')) platform = 'threads';
    else if (hostname.includes('bsky.app')) platform = 'bluesky';

    return {
      url,
      platform,
      title,
      text,
      displayName: siteName,
      username: hostname,
      avatarUrl,
      imageUrl: imageUrl || undefined,
    };
  }

  function extractSmartTags(text) {
    const lower = (text || '').toLowerCase();
    let category = 'tech';
    const topics = [];
    let type = 'resource';

    if (lower.includes('ai') || lower.includes('gpt') || lower.includes('llm') || lower.includes('agent') || lower.includes('claude') || lower.includes('deepseek')) {
      category = 'ai';
      topics.push('ai-tools', 'prompt-engineering');
      type = 'tool';
    } else if (lower.includes('github') || lower.includes('open source') || lower.includes('opensource') || lower.includes('repo')) {
      category = 'tech';
      topics.push('open-source', 'github');
      type = 'resource';
    } else if (lower.includes('react') || lower.includes('next.js') || lower.includes('tailwind') || lower.includes('typescript') || lower.includes('javascript') || lower.includes('webdev') || lower.includes('frontend')) {
      category = 'tech';
      if (lower.includes('react')) topics.push('react');
      if (lower.includes('next')) topics.push('next-js');
      if (lower.includes('tailwind')) topics.push('tailwind-css');
      if (topics.length === 0) topics.push('web-development');
      type = 'tool';
    } else if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('figma') || lower.includes('typography')) {
      category = 'design';
      topics.push('ui-ux', 'figma');
      type = 'showcase';
    } else if (lower.includes('saas') || lower.includes('startup') || lower.includes('pricing') || lower.includes('business')) {
      category = 'business';
      topics.push('saas', 'startup');
      type = 'case-study';
    } else if (lower.includes('productivity') || lower.includes('workflow') || lower.includes('notion')) {
      category = 'productivity';
      topics.push('productivity', 'workflow');
      type = 'tool';
    }

    if (topics.length === 0) {
      topics.push('web-development', 'resource');
    }

    const tagNames = [category, ...topics.slice(0, 3), type];
    const colorMap = {
      'tech': 'teal',
      'ai': 'teal',
      'design': 'pink',
      'business': 'cyan',
      'productivity': 'amber',
      'ai-tools': 'teal',
      'prompt-engineering': 'teal',
      'open-source': 'green',
      'github': 'orange',
      'react': 'cyan',
      'next-js': 'teal',
      'tailwind-css': 'cyan',
      'web-development': 'teal',
      'ui-ux': 'cyan',
      'figma': 'pink',
      'saas': 'cyan',
      'startup': 'green',
      'workflow': 'amber',
      'resource': 'blue',
      'tool': 'cyan',
      'guide': 'green',
      'showcase': 'blue',
      'case-study': 'amber'
    };

    const unique = Array.from(new Set(tagNames)).slice(0, 5);
    return unique.map(name => ({
      name,
      color: colorMap[name] || 'blue'
    }));
  }

  const SUPABASE_URL = 'https://fsouhiafooeybyftkpsy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3VoaWFmb29leWJ5ZnRrcHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNTYxNzIsImV4cCI6MjEwMjkzMjE3Mn0.e0HiUVtH7a57j8bvyC-myrnRbZLz3BWgM_0RRXIp5TQ';

  async function directFallbackSave(payload) {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const smartTags = extractSmartTags(payload.title + ' ' + payload.text);

    const bookmarkItem = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      platform: payload.platform || 'web',
      display_name: payload.displayName || 'Web Page',
      username: payload.username || 'web',
      avatar_url: payload.avatarUrl || null,
      image_url: payload.imageUrl || null,
      title: payload.title || null,
      text: payload.text || payload.title || payload.url || 'Saved Page',
      url: payload.url || null,
      date: formattedDate,
      created_at_ms: Date.now(),
      tags: smartTags,
      is_favorite: false,
      is_archived: false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(bookmarkItem),
    });

    if (!res.ok) throw new Error('Direct save failed');
    return { success: true, result: { tags: bookmarkItem.tags } };
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract-page-data') {
      const data = extractGenericPageData();
      sendResponse(data);
      return true;
    }

    if (request.action === 'save-page-direct') {
      const data = extractGenericPageData();
      const toast = window.__valutToastManager?.showToast({
        title: data.title,
        loading: true,
        status: 'Saving to vault with smart tags...',
      });

      const payload = { ...data, openWebsite: true };

      chrome.runtime.sendMessage({ action: 'save-bookmark', payload }, async (res) => {
        if (chrome.runtime.lastError || !res || !res.success) {
          try {
            const fbRes = await directFallbackSave(payload);
            if (toast) toast.updateSuccess({ tags: fbRes.result?.tags || [] });
            window.open('https://myvalut.vercel.app', '_blank');
            sendResponse({ success: true, result: fbRes.result });
          } catch (fbErr) {
            const errMsg = res?.error || chrome.runtime.lastError?.message || 'Save failed';
            if (toast) toast.updateError(errMsg);
            sendResponse({ success: false, error: errMsg });
          }
        } else {
          if (toast) {
            toast.updateSuccess({
              tags: res.result?.tags || [],
            });
          }
          sendResponse({ success: true, result: res.result });
        }
      });
      return true;
    }
  });
})();
