// Valut Extension Background Service Worker
const DEFAULT_SERVER_URL = 'https://myvalut.vercel.app';

// Helper to extract YouTube video ID from URL
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/watch')) {
        const v = urlObj.searchParams.get('v');
        return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
      }
      if (urlObj.pathname.startsWith('/shorts/')) {
        const s = urlObj.pathname.split('/shorts/')[1]?.split(/[?#/]/)[0];
        return s && /^[a-zA-Z0-9_-]{11}$/.test(s) ? s : null;
      }
      if (urlObj.pathname.startsWith('/live/')) {
        const l = urlObj.pathname.split('/live/')[1]?.split(/[?#/]/)[0];
        return l && /^[a-zA-Z0-9_-]{11}$/.test(l) ? l : null;
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      const b = urlObj.pathname.slice(1).split(/[?#/]/)[0];
      return b && /^[a-zA-Z0-9_-]{11}$/.test(b) ? b : null;
    }
  } catch {}
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'valut-save-page',
    title: 'Save Page to Valut',
    contexts: ['page', 'link', 'selection']
  });
});

// Handle Context Menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'valut-save-page' && tab) {
    const targetUrl = info.linkUrl || info.pageUrl || tab.url;
    const selectedText = info.selectionText || '';
    
    if (targetUrl) {
      await saveBookmarkToValut({
        url: targetUrl,
        text: selectedText,
        tabId: tab.id
      });
    }
  }
});

// Handle Keyboard shortcut (Alt+V)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-page') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      await saveBookmarkToValut({
        url: tab.url,
        title: tab.title,
        tabId: tab.id
      });
    }
  }
});

// Listen for messages from content scripts & popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SAVE_BOOKMARK') {
    saveBookmarkToValut({
      ...request.data,
      tabId: sender.tab?.id
    }).then(response => {
      sendResponse(response);
    });
    return true; // async response
  }

  if (request.action === 'CHECK_BOOKMARK_SAVED') {
    checkBookmarkSaved(request.url, request.videoId).then(response => {
      sendResponse(response);
    });
    return true;
  }

  if (request.action === 'GET_CONFIG') {
    chrome.storage.sync.get(['serverUrl', 'apiKey', 'userId'], (data) => {
      sendResponse({
        serverUrl: data.serverUrl || DEFAULT_SERVER_URL,
        apiKey: data.apiKey || '',
        userId: data.userId || ''
      });
    });
    return true;
  }
});

// Check if a bookmark is already saved
async function checkBookmarkSaved(url, videoId) {
  const vid = (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) ? videoId : extractYouTubeId(url);
  
  // 1. Check local storage cache first
  try {
    const stored = await chrome.storage.local.get(['valut_saved_urls', 'valut_saved_yt_ids']);
    const savedUrls = (stored.valut_saved_urls || []).filter(u => typeof u === 'string' && u.length > 5);
    const savedYtIds = (stored.valut_saved_yt_ids || []).filter(id => typeof id === 'string' && id.length === 11);

    if (vid && savedYtIds.includes(vid)) {
      return { isSaved: true, videoId: vid };
    }
    if (url && savedUrls.some(u => u === url || (vid && u.includes(vid)))) {
      return { isSaved: true, videoId: vid };
    }
  } catch (err) {
    console.warn('Local storage check error:', err);
  }

  // 2. Query backend if server is accessible
  if (vid || (url && url.length > 5)) {
    try {
      const config = await chrome.storage.sync.get(['serverUrl']);
      const primaryUrl = (config.serverUrl || DEFAULT_SERVER_URL).replace(/\/$/, '');
      const queryUrl = `${primaryUrl}/api/extension/check?url=${encodeURIComponent(url || '')}&videoId=${encodeURIComponent(vid || '')}`;
      
      const res = await fetch(queryUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.isSaved) {
          if (vid) await cacheSavedVideoId(vid);
          if (url) await cacheSavedUrl(url);
          return { isSaved: true, videoId: vid, bookmark: data.bookmark };
        }
      }
    } catch {}
  }

  return { isSaved: false, videoId: vid };
}

// Helpers to update local cache
async function cacheSavedUrl(url) {
  if (!url || typeof url !== 'string' || url.length < 5) return;
  try {
    const stored = await chrome.storage.local.get(['valut_saved_urls']);
    const list = (stored.valut_saved_urls || []).filter(u => typeof u === 'string' && u.length > 5);
    if (!list.includes(url)) {
      list.push(url);
      await chrome.storage.local.set({ valut_saved_urls: list.slice(-500) });
    }
  } catch (e) {}
}

async function cacheSavedVideoId(vid) {
  if (!vid || typeof vid !== 'string' || vid.length !== 11) return;
  try {
    const stored = await chrome.storage.local.get(['valut_saved_yt_ids']);
    const list = (stored.valut_saved_yt_ids || []).filter(id => typeof id === 'string' && id.length === 11);
    if (!list.includes(vid)) {
      list.push(vid);
      await chrome.storage.local.set({ valut_saved_yt_ids: list.slice(-500) });
    }
  } catch (e) {}
}

// Main save function with automatic multi-port fallback (3000, 3001, etc.)
async function saveBookmarkToValut(data) {
  const config = await chrome.storage.sync.get(['serverUrl', 'apiKey', 'userId']);
  const primaryUrl = (config.serverUrl || DEFAULT_SERVER_URL).replace(/\/$/, '');
  
  const candidateUrls = [
    primaryUrl,
    'https://myvalut.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001'
  ];

  const uniqueCandidates = Array.from(new Set(candidateUrls.filter(Boolean)));
  let lastError = null;

  for (const baseUrl of uniqueCandidates) {
    try {
      const response = await fetch(`${baseUrl}/api/extension/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: data.url,
          title: data.title || undefined,
          text: data.text || undefined,
          platform: data.platform || undefined,
          displayName: data.displayName || undefined,
          username: data.username || undefined,
          avatarUrl: data.avatarUrl || undefined,
          imageUrl: data.imageUrl || undefined,
          userId: config.userId || undefined,
          apiKey: config.apiKey || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (baseUrl !== primaryUrl) {
            chrome.storage.sync.set({ serverUrl: baseUrl });
          }

          // Cache saved URL and YouTube video ID
          if (data.url) {
            await cacheSavedUrl(data.url);
            const vid = extractYouTubeId(data.url);
            if (vid) {
              await cacheSavedVideoId(vid);
            }
          }

          if (data.tabId) {
            chrome.tabs.sendMessage(data.tabId, {
              action: 'SAVE_SUCCESS',
              bookmark: result.bookmark,
              tags: result.tags
            }).catch(() => {});
          }

          chrome.action.setBadgeText({ text: '✓' });
          chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
          setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

          return { success: true, bookmark: result.bookmark, tags: result.tags };
        } else {
          lastError = new Error(result.error || 'Failed to save');
        }
      } else {
        try {
          const errJson = await response.json();
          lastError = new Error(errJson.error || `Server responded with ${response.status}`);
        } catch {
          lastError = new Error(`Server responded with ${response.status}`);
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  const friendlyError = lastError?.message && !lastError.message.toLowerCase().includes('failed to fetch')
    ? lastError.message
    : 'Valut app is offline. Please run "npm run dev" in your project terminal!';
  console.error('Valut save error:', lastError);

  if (data.tabId) {
    chrome.tabs.sendMessage(data.tabId, {
      action: 'SAVE_ERROR',
      error: friendlyError
    }).catch(() => {});
  }

  chrome.action.setBadgeText({ text: '!' });
  chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

  return { success: false, error: friendlyError };
}
