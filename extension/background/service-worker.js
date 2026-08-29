// Valut Extension Background Service Worker
const DEFAULT_SERVER_URL = 'http://localhost:3000';

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

// Main save function
async function saveBookmarkToValut(data) {
  try {
    const config = await chrome.storage.sync.get(['serverUrl', 'apiKey', 'userId']);
    const serverUrl = (config.serverUrl || DEFAULT_SERVER_URL).replace(/\/$/, '');

    const payload = {
      url: data.url,
      title: data.title || undefined,
      text: data.text || undefined,
      platform: data.platform || undefined,
      userId: config.userId || undefined,
      apiKey: config.apiKey || undefined
    };

    const response = await fetch(`${serverUrl}/api/extension/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Notify content script if tabId exists
      if (data.tabId) {
        chrome.tabs.sendMessage(data.tabId, {
          action: 'SAVE_SUCCESS',
          bookmark: result.bookmark,
          tags: result.tags
        }).catch(() => {});
      }

      // Visual badge feedback
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
      setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);

      return { success: true, bookmark: result.bookmark, tags: result.tags };
    } else {
      throw new Error(result.error || 'Server rejected bookmark save');
    }
  } catch (error) {
    console.error('Valut save error:', error);
    if (data.tabId) {
      chrome.tabs.sendMessage(data.tabId, {
        action: 'SAVE_ERROR',
        error: error.message
      }).catch(() => {});
    }
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#EF4444' });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2500);
    return { success: false, error: error.message };
  }
}
